import asyncio
import dataclasses
import inspect
import json
import logging
from typing import List, Dict, Any

from ocpp.charge_point import snake_to_camel_case, remove_nones, camel_to_snake_case
from ocpp.exceptions import NotSupportedError
from ocpp.messages import Call, validate_payload, MessageType
from ocpp.v16.datatypes import ChargingProfile

from ocpp.v16.enums import DiagnosticsStatus, FirmwareStatus, ChargingProfilePurposeType, \
    AvailabilityType, ChargingRateUnitType, LogStatus

from ocpp.routing import on
from ocpp.v16 import ChargePoint as cp, call
from ocpp.v16.enums import Action, ChargePointStatus, ChargePointErrorCode, \
    ResetType, MessageTrigger, UpdateType
from ocpp.v16 import call_result

from compote.csms.analytics.stats import log_ocpp_processing
from compote.csms.processors.authorization.authorize import OCPP16AuthorizeProcessor
from compote.csms.processors.connectivity.boot_notification import OCPP16BootNotificationProcessor
from compote.csms.processors.connectivity.heartbeat import OCPP16HeartbeatProcessor
from compote.csms.processors.metering.meter_values import OCPP16MeterValuesProcessor
from compote.csms.processors.status.receive_data_transfer import OCPP16ReceiveDataTransferProcessor
from compote.csms.processors.firmware.diagnostic_status_notification import OCPP16DiagnosticsStatusNotificationProcessor
from compote.csms.processors.firmware.firmware_status_notification import OCPP16FirmwareStatusNotificationProcessor
from compote.csms.processors.status.status_notification import OCPP16StatusNotificationProcessor
from compote.csms.processors.transactions.start_transaction import OCPP16StartTransactionProcessor
from compote.csms.processors.transactions.stop_transaction import OCPP16StopTransactionProcessor

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('csms_ocpp16_handler')

class ChargePoint(cp):

    last_uuid = None

    # Override for ocpp.v16.ChargePoint function _send to allow structured logging
    async def _send(self, message):
        message_type = "OCPP.Call.Send"
        function = "Send"
        cp_id = self.id
        arguments = json.loads(message)
        msg = {"message_type": message_type, "function": function, "cp_id" : cp_id, "arguments": arguments}
        LOGGER.info(msg)

        #LOGGER.info(f"Custom log: {self.id} sending {message}")

        #await self._connection.send(message)
        await self._connection.send_text(message)


    # Override for ocpp.v16.ChargePoint function start to allow structured logging
    async def start(self):
        while True:
            #message = await self._connection.recv()
            message = await self._connection.receive_text()
            message_type = "OCPP.Call.Receive"
            function = "Receive"
            cp_id = self.id
            arguments = json.loads(message)
            msg = {"message_type": message_type, "function": function, "cp_id": cp_id, "arguments": arguments}
            LOGGER.info(msg)

            #LOGGER.info("%s: receive message %s", self.id, message)

            await self.route_message(message)

    async def call(self, payload, suppress=True, unique_id=None):
        """
        Send Call message to client and return payload of response.

        The given payload is transformed into a Call object by looking at the
        type of the payload. A payload of type BootNotificationPayload will
        turn in a Call with Action BootNotification, a HeartbeatPayload will
        result in a Call with Action Heartbeat etc.

        A timeout is raised when no response has arrived before expiring of
        the configured timeout.

        When waiting for a response no other Call message can be send. So this
        function will wait before response arrives or response timeout has
        expired. This is in line the OCPP specification

        Suppress is used to maintain backwards compatibility. When set to True,
        if response is a CallError, then this call will be suppressed. When
        set to False, an exception will be raised for users to handle this
        CallError.

        """
        camel_case_payload = snake_to_camel_case(dataclasses.asdict(payload))

        unique_id = (
            unique_id if unique_id is not None else str(self._unique_id_generator())
        )

        call = Call(
            unique_id=unique_id,
            action=payload.__class__.__name__[:-7],
            payload=remove_nones(camel_case_payload),
        )

        validate_payload(call, self._ocpp_version)

        self.last_uuid = str(call.unique_id)

        # Use a lock to prevent make sure that only 1 message can be send at a
        # a time.
        async with self._call_lock:
            await self._send(call.to_json())
            try:
                response = await self._get_specific_response(
                    call.unique_id, self._response_timeout
                )
            except asyncio.TimeoutError:
                raise asyncio.TimeoutError(
                    f"Waited {self._response_timeout}s for response on "
                    f"{call.to_json()}."
                )

        if response.message_type_id == MessageType.CallError:
            LOGGER.warning("Received a CALLError: %s'", response)
            if suppress:
                return
            raise response.to_exception()
        else:
            response.action = call.action
            validate_payload(response, self._ocpp_version)

        snake_case_payload = camel_to_snake_case(response.payload)
        # Create the correct Payload instance based on the received payload. If
        # this method is called with a call.BootNotificationPayload, then it
        # will create a call_result.BootNotificationPayload. If this method is
        # called with a call.HeartbeatPayload, then it will create a
        # call_result.HeartbeatPayload etc.
        cls = getattr(self._call_result, payload.__class__.__name__)  # noqa
        return cls(**snake_case_payload)

    async def _handle_call(self, msg):
        """
        Execute all hooks installed for based on the Action of the message.

        First the '_on_action' hook is executed and its response is returned to
        the client. If there is no '_on_action' hook for Action in the message
        a CallError with a NotImplemtendError is returned.

        Next the '_after_action' hook is executed.

        """

        self.last_uuid = str(msg.unique_id)

        try:
            handlers = self.route_map[msg.action]
        except KeyError:
            raise NotSupportedError(
                details={"cause": f"No handler for {msg.action} registered."}
            )

        if not handlers.get("_skip_schema_validation", False):
            validate_payload(msg, self._ocpp_version)
        # OCPP uses camelCase for the keys in the payload. It's more pythonic
        # to use snake_case for keyword arguments. Therefore the keys must be
        # 'translated'. Some examples:
        #
        # * chargePointVendor becomes charge_point_vendor
        # * firmwareVersion becomes firmwareVersion
        snake_case_payload = camel_to_snake_case(msg.payload)

        try:
            handler = handlers["_on_action"]
        except KeyError:
            raise NotSupportedError(
                details={"cause": f"No handler for {msg.action} registered."}
            )

        try:
            response = handler(**snake_case_payload)
            if inspect.isawaitable(response):
                response = await response
        except Exception as e:
            LOGGER.exception("Error while handling request '%s'", msg)
            response = msg.create_call_error(e).to_json()
            await self._send(response)

            return

        temp_response_payload = dataclasses.asdict(response)

        # Remove nones ensures that we strip out optional arguments
        # which were not set and have a default value of None
        response_payload = remove_nones(temp_response_payload)

        # The response payload must be 'translated' from snake_case to
        # camelCase. So:
        #
        # * charge_point_vendor becomes chargePointVendor
        # * firmware_version becomes firmwareVersion
        camel_case_payload = snake_to_camel_case(response_payload)

        response = msg.create_call_result(camel_case_payload)

        if not handlers.get("_skip_schema_validation", False):
            validate_payload(response, self._ocpp_version)

        await self._send(response.to_json())

        try:
            handler = handlers["_after_action"]
            # Create task to avoid blocking when making a call inside the
            # after handler
            response = handler(**snake_case_payload)
            if inspect.isawaitable(response):
                asyncio.ensure_future(response)
        except KeyError:
            # '_on_after' hooks are not required. Therefore ignore exception
            # when no '_on_after' hook is installed.
            pass

    async def register_context(self, context):
        self.context = context

    @log_ocpp_processing(type="req")
    @on(Action.Authorize)
    async def on_authorize(self, id_tag: str):
        #LOGGER.info("auth requested for " + id_tag)
        output = await OCPP16AuthorizeProcessor().process(self.context, id_tag)

        return call_result.AuthorizePayload(
            id_tag_info = output.get("id_tag_info")
        )

    @log_ocpp_processing(type="req")
    @on(Action.BootNotification)
    async def on_boot_notification(self, charge_point_vendor: str, charge_point_model: str, **kwargs):

        output = await OCPP16BootNotificationProcessor().process(self.context, charge_point_vendor, charge_point_model, **kwargs)

        return call_result.BootNotificationPayload(
            current_time=output.get("current_time"),
            interval=output.get("interval"),
            status=output.get("status")
        )

    @log_ocpp_processing(type="req")
    @on(Action.StartTransaction)
    async def on_start_transaction(self, connector_id: int, id_tag: str, meter_start: int, timestamp: str, reservation_id: int = None):

        output = await OCPP16StartTransactionProcessor().process(self.context, connector_id, id_tag, meter_start, timestamp)

        if "transaction_id" in output:
            return call_result.StartTransactionPayload(
                transaction_id = output.get("transaction_id"),
                id_tag_info = output.get("id_tag_info")
            )
        else:
            return call_result.StartTransactionPayload(
                id_tag_info = output.get("id_tag_info"),
                transaction_id = 0
            )

    @log_ocpp_processing(type="req")
    @on(Action.StopTransaction)
    async def on_stop_transaction(self, meter_stop: int, timestamp: str, transaction_id: int, id_tag: str, **kwargs):
        output = await OCPP16StopTransactionProcessor().process(self.context, meter_stop, timestamp, transaction_id, id_tag)
        return call_result.StopTransactionPayload(
            id_tag_info = output
        )

    @log_ocpp_processing(type="req")
    @on(Action.Heartbeat)
    async def on_heartbeat(self):
        output = await OCPP16HeartbeatProcessor().process(self.context)
        return call_result.HeartbeatPayload(
            current_time = output.get("current_time")
        )

    @log_ocpp_processing(type="req")
    @on(Action.MeterValues)
    async def on_meter_values(self, connector_id: int, meter_value: List, **kwargs):
        output = await OCPP16MeterValuesProcessor().process(self.context, connector_id, meter_value)
        return call_result.MeterValuesPayload()

    @log_ocpp_processing(type="req")
    @on(Action.StatusNotification)
    async def on_status_notification(self, connector_id: int, error_code: ChargePointErrorCode, status: ChargePointStatus, timestamp: str = None, info: str = None, vendor_id: str = None, vendor_error_code = None):
        await OCPP16StatusNotificationProcessor().process(self.context, connector_id, error_code, status, timestamp, info, vendor_id, vendor_error_code)
        return call_result.StatusNotificationPayload()

    @log_ocpp_processing(type="req")
    @on(Action.DataTransfer)
    async def on_data_transfer(self, vendor_id: str, message_id: str = None,  data: str = None):
        #LOGGER.info("received Data")

        output = await OCPP16ReceiveDataTransferProcessor().process(self.context, vendor_id, message_id, data)

        return call_result.DataTransferPayload(
            status = output.get("status"),
            data = output.get("data")
        )

    @log_ocpp_processing(type="req")
    @on(Action.DiagnosticsStatusNotification)
    async def on_Diagnostics_StatusNotification(self, status: DiagnosticsStatus):
        #LOGGER.info("received Diagnostic Status")
        output = await OCPP16DiagnosticsStatusNotificationProcessor().process(self.context, status)
        return call_result.DiagnosticsStatusNotificationPayload()

    @log_ocpp_processing(type="req")
    @on(Action.LogStatusNotification)
    async def on_LogStatusNotification(self, status: LogStatus):
        #LOGGER.info("received Diagnostic Status")
        pass


    @log_ocpp_processing(type="req")
    @on(Action.FirmwareStatusNotification)
    async def on_Firmware_StatusNotification(self, status: FirmwareStatus):
        #LOGGER.info("received Firmware Status")
        output = await OCPP16FirmwareStatusNotificationProcessor().process(self.context, status)
        return call_result.FirmwareStatusNotificationPayload()

    @log_ocpp_processing(type="req")
    async def send_cancel_reservation(self, reservation_id: int):
        request = call.CancelReservationPayload(
            reservation_id = reservation_id
        )
        LOGGER.info("Sending cancel reservation request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_change_availability(self, connector_id: int, type = AvailabilityType):

        request = call.ChangeAvailabilityPayload(
            connector_id = connector_id,
            type = type
        )
        LOGGER.info("Sending change availability request: " + str(request))

        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_change_configuration(self, key: str, value: Any):
        request = call.ChangeConfigurationPayload(
            key = key,
            value = value
        )
        LOGGER.info("Sending change configuration request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_clear_cache(self):
        request = call.ClearCachePayload()
        LOGGER.info("Sending clear cache request: " + str(request))

        result = await self.call(request)

        try:
            return dataclasses.asdict(result)
        except TypeError:
            return {}

    @log_ocpp_processing(type="req")
    async def send_clear_charging_profile(self, id: int = None, connector_id: int = None, charging_profile_purpose: ChargingProfilePurposeType = None, stack_level: int = None):
        request = call.ClearChargingProfilePayload(
            id = id,
            connector_id = connector_id,
            charging_profile_purpose = charging_profile_purpose,
            stack_level = stack_level
        )
        LOGGER.info("Sending clear charging profile request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_get_composite_schedule(self, connector_id: int, duration: int, charging_rate_unit: ChargingRateUnitType = None):
        request = call.GetCompositeSchedulePayload(
            connector_id = connector_id,
            duration = duration,
            charging_rate_unit = charging_rate_unit
        )
        LOGGER.info("Sending get composite schedule request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_get_configuration(self, key: List = None):
        request = call.GetConfigurationPayload(
           key = key
        )
        LOGGER.info("Sending get configuration request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_get_diagnostics(self, location: str, retries: int = None, retry_interval: int = None, start_time: str = None, stop_time: str = None):
        request = call.GetDiagnosticsPayload(
            location = location,
            retries = retries,
            retry_interval = retry_interval,
            start_time = start_time,
            stop_time = stop_time
        )
        LOGGER.info("Sending get analytics request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_data_transfer(self, vendor_id: str, message_id: str = None, data: str = None):
        request = call.DataTransferPayload(
            vendor_id   = vendor_id,
            message_id  = message_id,
            data        = data
        )
        LOGGER.info("Sending data_transfer: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_get_local_list_version(self):
        request = call.GetLocalListVersionPayload()
        LOGGER.info("Sending get list version request")
        listversion = await self.call(request)
        return listversion

    @log_ocpp_processing(type="req")
    async def send_send_local_list(self, list_version: int, update_type: UpdateType, local_authorization_list: List = None):
        request = call.SendLocalListPayload(
            list_version = list_version,
            update_type = update_type,
            local_authorization_list = local_authorization_list
        )
        LOGGER.info("Sending send local list: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_set_charging_profile(self, connector_id: int, cs_charging_profiles: ChargingProfile):
        request = call.SetChargingProfilePayload(
            connector_id = connector_id,
            cs_charging_profiles = cs_charging_profiles
        )
        LOGGER.info("Sending set charging profile: " + str(request))
        result = await self.call(request)
        return dataclasses.asdict(result)

    @log_ocpp_processing(type="req")
    async def send_extended_trigger_message(self, requested_message: MessageTrigger, connector_id: int = None):
        request = call.ExtendedTriggerMessagePayload(
            requested_message = requested_message,
            connector_id = connector_id
         )
        LOGGER.info("Sending extended trigger message request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_reset(self, reset_type: ResetType):
        request = call.ResetPayload(
            type = reset_type
        )
        LOGGER.info("Sending reset request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_reserve_now(self, connector_id: int, expiry_date: str, id_tag: str, reservation_id: int, parent_id_tag: str = None):
        request = call.ReserveNowPayload(
            connector_id = connector_id,
            expiry_date = expiry_date,
            id_tag = id_tag,
            reservation_id = reservation_id,
            parent_id_tag = parent_id_tag
        )
        LOGGER.info("Sending reserve now request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_remote_start_transaction(self, id_tag: str, connector_id: int = None, charging_profile: Dict = None):
        request = call.RemoteStartTransactionPayload(
            id_tag = id_tag,
            connector_id = connector_id,
            charging_profile = charging_profile
        )
        LOGGER.info("Sending remote start request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_remote_stop_transaction(self, transaction_id: int):
        request = call.RemoteStopTransactionPayload(
            transaction_id = transaction_id
        )
        LOGGER.info("Sending remote stop request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_trigger_message(self, requested_message: MessageTrigger, connector_id: int = None):
        request = call.TriggerMessagePayload(
            requested_message = requested_message,
            connector_id = connector_id
        )
        LOGGER.info("Sending trigger message request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_update_firmware(self, location: str, retrieve_date: str, retries: int = None, retry_interval: int = None):
        request = call.UpdateFirmwarePayload(
            location = location,
            retrieve_date = retrieve_date,
            retries = retries,
            retry_interval = retry_interval
        )
        LOGGER.info("Sending update firmware request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_unlock_connector(self, connector_id: int):
        request = call.UnlockConnectorPayload(
            connector_id = connector_id
        )
        unique_id = str(self._unique_id_generator())
        LOGGER.info("Sending unlock connector request: " + str(request))
        result = await self.call(payload=request, unique_id=unique_id)
        return str(result) + "" + unique_id
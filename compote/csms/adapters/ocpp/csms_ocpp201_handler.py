import asyncio
import dataclasses
import inspect
import json
import logging
from typing import Optional, Dict, List, Any

from ocpp.charge_point import remove_nones, snake_to_camel_case, camel_to_snake_case
from ocpp.exceptions import NotSupportedError
from ocpp.messages import validate_payload, MessageType, Call
from ocpp.routing import on
from ocpp.v201 import ChargePoint as cp, call
from ocpp.v201 import call_result
from ocpp.v201.datatypes import FirmwareType
from ocpp.v201.enums import ResetType, Action, FirmwareStatusType, MessageTriggerType, ChargingRateUnitType

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_ocpp_processing
from compote.csms.processors.authorization.authorize import OCPP20AuthorizeProcessor
from compote.csms.processors.connectivity.boot_notification import OCPP20BootNotificationProcessor
from compote.csms.processors.connectivity.heartbeat import OCPP20HeartbeatProcessor
from compote.csms.processors.firmware.firmware_status_notification import OCPP20FirmwareStatusNotificationProcessor
from compote.csms.processors.metering.meter_values import OCPP20MeterValuesProcessor
from compote.csms.processors.status.notify_event import OCPP20NotifyEventProcessor
from compote.csms.processors.status.receive_data_transfer import OCPP20ReceiveDataTransferProcessor
from compote.csms.processors.status.security_event_notification import OCPP20SecurityEventNotificationProcessor
from compote.csms.processors.status.status_notification import OCPP20StatusNotificationProcessor
from compote.csms.processors.transactions.transaction_event import OCPP20TransactionProcessor


logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('csms_ocpp201_handler')

class ChargePoint(cp):

    last_uuid = None

    # Override for ocpp.v201.ChargePoint function _send to allow structured logging and replace ws
    async def _send(self, message):
        message_type = "OCPP.Call.Send"
        function = "Send"
        cp_id = self.id
        arguments = json.loads(message)
        msg = {"message_type": message_type, "function": function, "cp_id": cp_id, "arguments": arguments}
        LOGGER.info(msg)
        await self._connection.send_text(message)

    # Override for ocpp.v201.ChargePoint function _send to allow structured logging and replace ws
    async def start(self):
        while True:
            message = await self._connection.receive_text()
            message_type = "OCPP.Call.Receive"
            function = "Receive"
            cp_id = self.id
            arguments = json.loads(message)
            msg = {"message_type": message_type, "function": function, "cp_id": cp_id, "arguments": arguments}
            LOGGER.info(msg)

            # LOGGER.info("%s: receive message %s", self.id, message)

            await self.route_message(message)

    # Override for ocpp.v201.ChargePoint function _send to allow structured logging and replace ws
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

    # Override for ocpp.v201.ChargePoint function _send to allow structured logging and replace ws
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

    async def register_context(self, context: Context):
        self.context = context

    @log_ocpp_processing(type="req")
    @on(Action.Authorize)
    async def on_authorize(self, id_token: Dict, certificate: Optional[str] = None, iso15118_certificate_hash_data: Optional[List] = None):
        LOGGER.info("auth requested for " + str(id_token))
        output = await OCPP20AuthorizeProcessor().process(self.context, id_token, certificate, iso15118_certificate_hash_data)
        return call_result.AuthorizePayload(
            id_token_info = output.get("id_token_info"),
            certificate_status= output.get("certificate_status")
        )

    @log_ocpp_processing(type="req")
    @on("BootNotification")
    async def on_boot_notification(self, charging_station, reason, **kwargs):

        output = await OCPP20BootNotificationProcessor().process(self.context, charge_point_vendor=charging_station["vendor_name"], charge_point_model=charging_station["model"],
                                                                 **kwargs)
        return call_result.BootNotificationPayload(
            **output
        )

    @log_ocpp_processing(type="req")
    @on("Heartbeat")
    async def on_heartbeat(self):
        output = await OCPP20HeartbeatProcessor().process(self.context)
        return call_result.HeartbeatPayload(
            current_time = output.get("current_time")
        )

    @log_ocpp_processing(type="req")
    @on(Action.DataTransfer)
    async def on_data_transfer(self, vendor_id: str, message_id: str = None,  data: str = None):
        LOGGER.info("received Data")
        output = await OCPP20ReceiveDataTransferProcessor().process(self.context, vendor_id, message_id, data)

        return call_result.DataTransferPayload(
            status = output.get("status")
        )

    @log_ocpp_processing(type="req")
    @on(Action.FirmwareStatusNotification)
    async def on_Firmware_StatusNotification(self, status: FirmwareStatusType):
        output = await OCPP20FirmwareStatusNotificationProcessor().process(self.context, status)
        return call_result.FirmwareStatusNotificationPayload()

    @log_ocpp_processing(type="req")
    @on(Action.MeterValues)
    async def on_meter_values(self, evse_id: int, meter_value: List, **kwargs):
        await OCPP20MeterValuesProcessor().process(self.context, evse_id, meter_value)
        return call_result.MeterValuesPayload()

    @log_ocpp_processing(type="req")
    @on(Action.SecurityEventNotification)
    async def on_security_event_notification(self, type: str, timestamp: str, tech_info: str = None, custom_date: Dict[str, Any] = None):
        await OCPP20SecurityEventNotificationProcessor().process(self.context, type, timestamp, tech_info, custom_date)
        return call_result.SecurityEventNotificationPayload()

    @log_ocpp_processing(type="req")
    @on(Action.NotifyEvent)
    async def on_notify_event(self, generated_at: str, seq_no: int, event_data: List, tbc: bool = None, custom_data = None):
        await OCPP20NotifyEventProcessor().process(self.context, generated_at, seq_no, event_data, tbc, custom_data)
        return call_result.NotifyEventPayload()

    @log_ocpp_processing(type="req")
    @on(Action.StatusNotification)
    async def on_status_notification(self, timestamp: str, connector_status: str, evse_id: str, connector_id: str):
        await OCPP20StatusNotificationProcessor().process(self.context, timestamp, connector_status, evse_id, connector_id)
        return call_result.StatusNotificationPayload()

    @log_ocpp_processing(type="req")
    @on(Action.TransactionEvent)
    async def on_transaction(self, event_type: str, timestamp: str, trigger_reason: str, seq_no: int, transaction_info: Dict, meter_value: Optional[List] = None, offline: Optional[bool] = None, number_of_phases_used: Optional[int] = None, cable_max_current: Optional[int] = None, reservation_id: Optional[int] = None, evse: Optional[Dict] = None, id_token: Optional[Dict] = None):
        output = await OCPP20TransactionProcessor().process(self.context, event_type, timestamp, trigger_reason, seq_no, transaction_info, meter_value, offline, number_of_phases_used, cable_max_current, reservation_id, evse, id_token)

        return call_result.TransactionEventPayload(
            total_cost = output.get("total_cost"),
            charging_priority = output.get("charging_priority"),
            id_token_info = output.get("id_token_info"),
            updated_personal_message = output.get("updated_personal_message")
        )

    @log_ocpp_processing(type="req")
    async def send_set_variables(self, set_variable_data: List, custom_data: Optional[Dict] = None):
        request = call.SetVariablesPayload(
            set_variable_data = set_variable_data,
            custom_data = custom_data
        )

        LOGGER.info("Sending set variables request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_get_report(self, request_id: int, component_variable: Optional[List], component_criteria: Optional[List], custom_data: Optional[Dict] = None):
        request = call.GetReportPayload(
            request_id = request_id,
            component_variable = component_variable,
            component_criteria = component_criteria,
            custom_data = custom_data
        )

        LOGGER.info("Sending get report request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_get_base_report(self, request_id: int, report_base: str, custom_data: Optional[Dict] = None):
        request = call.GetBaseReportPayload(
            request_id = request_id,
            report_base = report_base,
            custom_data = custom_data
        )

        LOGGER.info("Sending get base report request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_get_variables(self, get_variable_data: List, custom_data: Optional[Dict] = None):
        request = call.GetVariablesPayload(
            get_variable_data = get_variable_data,
            custom_data = custom_data
        )

        LOGGER.info("Sending get variables request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_get_local_list_version(self, custom_data: Optional[Dict] = None):
        request = call.GetLocalListVersionPayload(custom_data=custom_data)
        LOGGER.info("Sending get list version request")
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_send_local_list(self, version_number: int, update_type: str, local_authorization_list: Optional[List] = None, custom_data: Optional[List] = None):
        request = call.SendLocalListPayload(
            version_number = version_number,
            update_type = update_type,
            local_authorization_list = local_authorization_list,
            custom_data = custom_data
        )
        LOGGER.info("Sending send local list: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_reset(self, reset_type: ResetType, evse_id: Optional[int] = None, custom_data: Optional[Dict] = None):
        request = call.ResetPayload(
            type = reset_type,
            evse_id = evse_id,
            custom_data = custom_data
        )

        LOGGER.info("Sending reset: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_change_availability(self, operational_status: str, evse: Optional[Dict], custom_data: Optional[Dict] = None):
        request = call.ChangeAvailabilityPayload(
            operational_status = operational_status,
            evse = evse,
            custom_data = custom_data
        )
        LOGGER.info("Sending change availability request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_data_transfer(self, vendor_id: str, message_id: str = None, data: str = None, custom_data: Optional[Dict] = None):
        request = call.DataTransferPayload(
            vendor_id = vendor_id,
            message_id = message_id,
            data = data,
            custom_data = custom_data
        )

        LOGGER.info("Sending data_transfer: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_reserve_now(self, id: int, expiry_date_time: str, id_token: Dict, connector_type: str = None, evse_id: int = None, group_id_token: Dict = None, custom_data: Optional[Dict] = None):
        request = call.ReserveNowPayload(
            id = id,
            expiry_date_time = expiry_date_time,
            id_token = id_token,
            connector_type = connector_type,
            evse_id = evse_id,
            group_id_token = group_id_token,
            custom_data = custom_data
        )
        LOGGER.info("Sending reserve now request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_cancel_reservation(self, reservation_id: int, custom_data: Optional[Dict] = None):
        request = call.CancelReservationPayload(
            reservation_id = reservation_id,
            custom_data = custom_data
        )
        LOGGER.info("Sending cancel reservation request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_set_charging_profile(self, evse_id: int, charging_profile: Dict, custom_data: Optional[Dict] = None):
        request = call.SetChargingProfilePayload(
            evse_id = evse_id,
            charging_profile = charging_profile,
            custom_data = custom_data
        )
        LOGGER.info("Sending set charging profile: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_clear_cache(self):
        request = call.ClearCachePayload()
        LOGGER.info("Sending clear cache request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_clear_charging_profile(self, charging_profile_id: Optional[int] = None, charging_profile_criteria: Optional[Dict] = None, custom_data: Optional[Dict] = None):
        request = call.ClearChargingProfilePayload(
            charging_profile_id = charging_profile_id,
            charging_profile_criteria = charging_profile_criteria,
            custom_data = custom_data
        )
        LOGGER.info("Sending clear charging profile request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_get_composite_schedule(self, connector_id: int, duration: int, charging_rate_unit: ChargingRateUnitType = None):
        request = call.GetCompositeSchedulePayload(
            evse_id = connector_id,
            duration = duration,
            charging_rate_unit = charging_rate_unit
        )
        LOGGER.info("Sending get composite schedule request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_request_start_transaction(self, id_token: Dict, remote_start_id: int, evse_id: int = None, group_id_token: Dict = None, charging_profile: Dict = None, custom_data: Optional[Dict] = None):
        request = call.RequestStartTransactionPayload(
            id_token = id_token,
            remote_start_id = remote_start_id,
            evse_id = evse_id,
            group_id_token = group_id_token,
            charging_profile = charging_profile,
            custom_data = custom_data
        )
        LOGGER.info("Sending remote start request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_request_stop_transaction(self, transaction_id: str, custom_data: Optional[Dict] = None):
        request = call.RequestStopTransactionPayload(
            transaction_id = transaction_id,
            custom_data = custom_data
        )
        LOGGER.info("Sending remote stop request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_trigger_message(self, requested_message: MessageTriggerType, connector_id: int = None):
        request = call.TriggerMessagePayload(
            requested_message = requested_message,
            evse = {"id": 0, "connector_id": connector_id}
        )
        LOGGER.info("Sending trigger message request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_update_firmware(self, request_id: int, firmware: FirmwareType, retries: int = None, retry_interval: int = None):
        request = call.UpdateFirmwarePayload(
            request_id = request_id,
            firmware = dataclasses.asdict(firmware),
            retries = retries,
            retry_interval = retry_interval
        )
        LOGGER.info("Sending update firmware request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_unlock_connector(self, evse_id: int, connector_id: int, custom_data: Optional[Dict] = None):
        request = call.UnlockConnectorPayload(
            evse_id = evse_id,
            connector_id = connector_id,
            custom_data = custom_data
        )

        LOGGER.info("Sending unlock connector request: " + str(request))
        result = await self.call(request)
        return result
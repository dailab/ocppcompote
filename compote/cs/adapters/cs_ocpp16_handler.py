import asyncio
from decimal import Decimal
import logging
from pathlib import Path
from typing import List, Dict, Any
import json

from ocpp.routing import on

from ocpp.v16 import call, call_result
from ocpp.v16 import ChargePoint as cp
from ocpp.v16.datatypes import ChargingProfile
from ocpp.v16.enums import RegistrationStatus, ChargePointStatus, ChargePointErrorCode, Action, ResetType, ResetStatus, \
    MessageTrigger, TriggerMessageStatus, FirmwareStatus, DiagnosticsStatus, Reason, ChargingProfileStatus, AvailabilityType, \
    ChargingProfilePurposeType, ChargingRateUnitType, UpdateType, UpdateStatus, UnlockStatus

from compote.cs.cs_context import Context
logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('cs_ocpp16_handler')

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return json.JSONEncoder.default(self, obj)


class ChargePoint(cp):

    def __init__(self, id, connection, response_timeout=30):
        super().__init__(id, connection, response_timeout)
        self.context: Context = None
        self.status_cp = ChargePointStatus.available

    async def start(self):
        while True:
            message = await self._connection.recv()
            message_type = "OCPP.Call.Receive"
            function = "Receive"
            cp_id = self.id
            arguments = json.loads(message)
            msg = {"message_type": message_type, "function": function, "cp_id": cp_id, "arguments": arguments}
            LOGGER.info(msg)

            await self.route_message(message)

    async def _send(self, message):
        message_type = "OCPP.Call.Send"
        function = "Send"
        cp_id = self.id
        arguments = json.loads(message)
        msg = {"message_type": message_type, "function": function, "cp_id" : cp_id, "arguments": arguments}
        LOGGER.info(msg)
        await self._connection.send(message)

    @on(Action.Reset)
    async def on_reset(self, type: ResetType):
        LOGGER.info("reset received: " + type)

        if type == ResetType.hard:
            pass
        elif type == ResetType.soft:
            pass

        call_result.ResetPayload(status=ResetStatus.accepted)

        return call_result.ResetPayload(
            status=ResetStatus.accepted
        )

    @on(Action.TriggerMessage)
    async def on_trigger_message(self, requested_message: MessageTrigger, connector_id=None):
        LOGGER.info("received TriggerMessage")

        if connector_id is not None:
            return call_result.TriggerMessagePayload(
                status=TriggerMessageStatus.not_implemented
            )
        else:
            return call_result.TriggerMessagePayload(
                status=TriggerMessageStatus.not_implemented
            )

    @on(Action.ExtendedTriggerMessage)
    async def on_extended_trigger_message(self, requested_message: MessageTrigger, connector_id=None):
        LOGGER.info("received ExtendedTriggerMessage")
        if connector_id is not None:
            return call_result.ExtendedTriggerMessagePayload(
                status=TriggerMessageStatus.not_implemented
            )
        else:
            return call_result.ExtendedTriggerMessagePayload(
                status=TriggerMessageStatus.not_implemented
            )

    @on(Action.RemoteStartTransaction)
    async def on_remote_start(self, id_tag: int, connector_id: int = None, charging_profile: Dict = None):
        LOGGER.info("Received RemoteStartTransaction")

        return call_result.RemoteStartTransactionPayload(status="Accepted")

    @on(Action.RemoteStopTransaction)
    async def on_remote_stop(self, transaction_id: int):
        LOGGER.info("received RemoteStopTransaction")

        return call_result.RemoteStopTransactionPayload(status = "Accepted")

    @on(Action.SetChargingProfile)
    async def on_set_charging_profile(self, connector_id: int, cs_charging_profiles: ChargingProfile):
        LOGGER.info("Received Charging Profile")

        id =  str(cs_charging_profiles['charging_profile_id'])
        fn = "chargingprofile_" + str(connector_id) + "_" + id + ".json"

        filepath = Path(__file__).parents[1] /"tmp/chargingProfiles/" / fn
   
        try:
            with filepath.open("w") as f:
                json.dump(cs_charging_profiles, f, cls=JSONEncoder)
        except ValueError:
            logging.error("Error while writing charging profile.")

        return call_result.SetChargingProfilePayload(
            status = ChargingProfileStatus.accepted
        )

    @on(Action.CancelReservation)
    async def on_cancel_reservation(self, reservation_id: int):
        LOGGER.info("received CancelReservation")

        return call_result.CancelReservationPayload(status = "Accepted")

    @on(Action.ChangeAvailability)
    async def on_change_availability(self, connector_id: int, type = AvailabilityType):
        LOGGER.info("received ChangeAvailability")

        return call_result.ChangeAvailabilityPayload(status = "Accepted")

    @on(Action.ChangeConfiguration)
    async def on_change_configuration(self, key: str, value: Any):
        LOGGER.info("received ChangeConfiguration")

        return call_result.ChangeConfigurationPayload(status = "Accepted")

    @on(Action.ClearCache)
    async def on_clear_cache(self):
        LOGGER.info("received ClearCache")
        
        return call_result.ClearCachePayload(status = "Accepted")

    @on(Action.ClearChargingProfile)
    async def on_clear_charging_profile(self, id: int = None, connector_id: int = None, charging_profile_purpose: ChargingProfilePurposeType = None, stack_level: int = None):
        LOGGER.info("received ClearCache")
        
        return call_result.ClearCachePayload(status = "Accepted")

    @on(Action.GetCompositeSchedule)
    async def on_get_composite_schedule(self, connector_id: int, duration: int, charging_rate_unit: ChargingRateUnitType = None):
        LOGGER.info("received GetCompositeSchedule")
        
        return call_result.GetCompositeSchedulePayload(status = "Accepted")

    @on(Action.GetConfiguration)
    async def on_get_configuration(self, key: List = None):
        LOGGER.info("received GetConfiguration")
        
        return call_result.GetConfigurationPayload(status = "Accepted")

    @on(Action.GetDiagnostics)
    async def on_get_diagnostics(self, location: str, retries: int = None, retry_interval: int = None, start_time: str = None, stop_time: str = None):
        LOGGER.info("received GetDiagnostics")
        
        return call_result.GetDiagnosticsPayload()

    @on(Action.DataTransfer)
    async def on_data_transfer(self, vendor_id: str, message_id: str = None, data: str = None):
        LOGGER.info("received DataTransfer")
        
        return call_result.DataTransferPayload(status = "Accepted")

    @on(Action.GetLocalListVersion)
    async def on_get_local_list_version(self):
        LOGGER.info("received GetLocalListVersion")
        
        return call_result.GetLocalListVersionPayload(int)
    
    @on(Action.SendLocalList)
    async def on_send_local_list(self, list_version: int, update_type: UpdateType, local_authorization_list: List = None):
        LOGGER.info("received SendLocalList")
        
        return call_result.SendLocalListPayload(UpdateStatus)

    
    @on(Action.ReserveNow)
    async def on_reserve_now(self, connector_id: int, expiry_date: str, id_tag: str, reservation_id: int, parent_id_tag: str = None):
        LOGGER.info("received ReserveNow")
        
        return call_result.ReserveNowPayload(status = "Accepted")


    @on(Action.UpdateFirmware)
    async def on_update_firmware(self, location: str, retrieve_date: str, retries: int = None, retry_interval: int = None):
        LOGGER.info("received UpdateFirmware")
        
        return call_result.UpdateFirmwarePayload()

    @on(Action.UnlockConnector)
    async def on_unlock_connector(self, connector_id: int):
        LOGGER.info("received UnlockConnector")
        
        return call_result.UnlockConnectorPayload(status=UnlockStatus.unlocked)
        
    
    async def send_authorize(self, id_tag: str):
        self.request = call.AuthorizePayload(
            id_tag=id_tag
        )
        LOGGER.info("Sending authorize: " + str(self.request))
        self.response = await self.call(self.request)

    async def send_boot_notification(self, charge_point_model: str, charge_point_vendor: str, charge_box_serial_number: str = None, charge_point_serial_number: str = None, firmware_version: str = None, iccid: str = None, imsi: str = None, meter_serial_number: str = None, meter_type: str = None):
        LOGGER.info("sending BootNotification")
        self.request = call.BootNotificationPayload(
            charge_point_model=charge_point_model,
            charge_point_vendor=charge_point_vendor,
            charge_box_serial_number=charge_box_serial_number,
            charge_point_serial_number=charge_point_serial_number,
            firmware_version=firmware_version,
            iccid=iccid,
            imsi=imsi,
            meter_serial_number=meter_serial_number,
            meter_type=meter_type
        )

        self.response = await self.call(self.request)
        self.item = 'BootNotification'

        LOGGER.info("Received Response from central system: " + str(self.response))

        if self.response.status == RegistrationStatus.accepted:
            LOGGER.info("Connected to central system.")
            asyncio.create_task(self.idle(self.response.interval))

    async def send_data_transfer(self, vendor_id: str, message_id: str = None, data: str = None):
        self.request = call.DataTransferPayload(
            vendor_id=vendor_id,
            message_id=message_id,
            data=data
        )
        LOGGER.info("Sending data_transfer: " + str(self.request))
        self.response = await self.call(self.request)

    async def send_diagnostics_status_notification(self, status: DiagnosticsStatus):
        self.request = call.DiagnosticsStatusNotificationPayload(
            status=status
        )
        LOGGER.info("Sending diagnostics_status_notification: " + str(self.request))
        self.response = await self.call(self.request)

    async def send_firmware_status_notification(self, status: FirmwareStatus):
        self.request = call.FirmwareStatusNotificationPayload(
            status=status
        )
        LOGGER.info("Sending firmware_status_notification: " + str(self.request))
        self.response = await self.call(self.request)

    async def send_heartbeat(self, interval: int):
        self.request = call.HeartbeatPayload()
        LOGGER.info("Sending heartbeat with interval " +
                    str(interval) + ": " + str(self.request))
        self.response = await self.call(self.request)

    async def send_meter_values(self, connector_id: int = 1, meter_value = None, transaction_id: int = None):

        self.request = call.MeterValuesPayload(
            connector_id=connector_id,
            meter_value=meter_value,
            transaction_id=transaction_id
        )
        LOGGER.info("Sending meter_values: " + str(self.request))
        self.response = await self.call(self.request)

        return meter_value

    async def send_start_transaction(self, connector_id: int, id_tag: str, meter_start: int, timestamp: str, reservation_id: int = None):
        self.request = call.StartTransactionPayload(
            connector_id=connector_id,
            id_tag=id_tag,
            meter_start=meter_start,
            timestamp=timestamp,
            reservation_id=reservation_id
        )
        LOGGER.info("Sending StartTransaction: " + str(self.request))
        self.response = await self.call(self.request)
        self.context.transaction_id = self.response.transaction_id
        return self.response.transaction_id

    async def send_status_notification(self, connector_id: int, error_code: ChargePointErrorCode, status: ChargePointStatus, timestamp: str = None, info: str = None, vendor_id: str = None, vendor_error_code: str = None):
        self.request = call.StatusNotificationPayload(
            connector_id=connector_id,
            error_code=error_code,
            status=status,
            timestamp=timestamp,
            info=info,
            vendor_id=vendor_id,
            vendor_error_code=vendor_error_code
        )
        LOGGER.info("Sending StatusNotification:" + str(self.request))
        self.response = await self.call(self.request)

    async def send_stop_transaction(self, meter_stop: int, timestamp: str, transaction_id: int, reason: Reason = None, id_tag: str = None, transaction_data: List = None):
        self.request = call.StopTransactionPayload(
            meter_stop=meter_stop,
            timestamp=timestamp,
            transaction_id=transaction_id,
            reason=reason,
            id_tag=id_tag,
            transaction_data=transaction_data
        )
        LOGGER.info("Sending StopTransaction: " + str(self.request))
        self.response = await self.call(self.request)

    # Default to idle method when picking actions

    async def idle(self, interval):

        self.item = await self.context.get_next()

        match self.item:
            case 'boot_notification':
                await self.send_boot_notification(**(await self.context.perform_boot_notification()))
            case 'heartbeat':
                await self.send_heartbeat(interval) # Ignore this one for now
            case 'authorize':
                await self.send_authorize(**(await self.context.perform_authorize()))
            case 'status':
                await self.send_status_notification(**(await self.context.perform_status_notification()))
            case 'start_transaction':
                await self.send_start_transaction(**(await self.context.perform_start_transaction()))
            case 'meter_values':
                await self.send_meter_values(**(await self.context.perform_meter_values())) 
            case 'stop_transaction':
                await self.send_stop_transaction(**(await self.context.perform_stop_transaction()))
            case 'data_transfer':
                await self.send_data_transfer(**(await self.context.perform_data_transfer()))
            case 'data_transfer_iso_auth':
                await self.send_data_transfer(**(await self.context.perform_data_transfer(message_id = 'Authorize')))
            case 'data_transfer_iso_cert':
                await self.send_data_transfer(**(await self.context.perform_data_transfer(message_id = 'GetCertificateStatus')))
            case 'data_transfer_sign_certificate':
                await self.send_data_transfer(**(await self.context.perform_data_transfer(message_id = 'SignCertificate')))
            case 'data_transfer_iso_ev':
                await self.send_data_transfer(**(await self.context.perform_data_transfer(message_id = 'Get15118EVCertificate')))
            case 'diagnostic_status_notification':
                await self.send_diagnostics_status_notification(**(await self.context.perform_diagnostic_status_notification()))
            case 'firmware_status_notification' :
                await self.send_firmware_status_notification(**(await self.context.perform_firmware_status_notification()))

        await asyncio.sleep(interval)
        await self.idle(interval)

    def register_context(self, context: Context):
        self.context = context

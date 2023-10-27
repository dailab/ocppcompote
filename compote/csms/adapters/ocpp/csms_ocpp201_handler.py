import logging
from typing import Optional, Dict, List

from ocpp.routing import on
from ocpp.v201 import ChargePoint as cp, call
from ocpp.v201 import call_result
from ocpp.v201.enums import ResetType, Action

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_ocpp_processing
from compote.csms.processors.authorization.authorize import OCPP20AuthorizeProcessor
from compote.csms.processors.connectivity.boot_notification import OCPP20BootNotificationProcessor
from compote.csms.processors.connectivity.heartbeat import OCPP20HeartbeatProcessor
from compote.csms.processors.metering.meter_values import OCPP20MeterValuesProcessor
from compote.csms.processors.status.receive_data_transfer import OCPP20ReceiveDataTransferProcessor
from compote.csms.processors.status.status_notification import OCPP20StatusNotificationProcessor
from compote.csms.processors.transactions.transaction_event import OCPP20TransactionProcessor

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('csms_ocpp201_handler')

class ChargePoint(cp):

    async def register_context(self, context: Context):
        self.context = context

    @log_ocpp_processing(type="req")
    @on(Action.Authorize)
    async def on_authorize(self, id_token: Dict, certificate: Optional[str] = None, iso15118_certificate_hash_data: Optional[List] = None):
        LOGGER.info("auth requested for " + id_token)
        output = await OCPP20AuthorizeProcessor().process(self.context, id_token, certificate, iso15118_certificate_hash_data)
        return call_result.AuthorizePayload(
            id_token_info = output["id_token_info"],
            certificate_status= output["certificate_status"]
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
            current_time = output
        )

    @log_ocpp_processing(type="req")
    @on(Action.DataTransfer)
    async def on_data_transfer(self, vendor_id: str, message_id: str = None,  data: str = None):
        LOGGER.info("received Data")
        output = await OCPP20ReceiveDataTransferProcessor().process(self.context, vendor_id, message_id, data)

        return call_result.DataTransferPayload(
            status = output["status"]
        )

    @log_ocpp_processing(type="req")
    @on(Action.MeterValues)
    async def on_meter_values(self, evse_id: int, meter_value: List, **kwargs):
        output = await OCPP20MeterValuesProcessor().process(self.context, evse_id, meter_value)
        return call_result.MeterValuesPayload()

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
            total_cost = output["total_cost"],
            charging_priority = output["charging_priority"],
            id_token_info = output["id_token_info"],
            updated_personal_message = output["updated_personal_message"]
        )

    @log_ocpp_processing(type="req")
    async def send_set_variables(self, set_variable_data: List):
        return call.SetVariablesPayload(
            set_variable_data = set_variable_data
        )

    @log_ocpp_processing(type="req")
    async def send_get_report(self, request_id: int, component_variable: Optional[List], component_criteria: Optional[List]):
        return call.GetReportPayload(
            request_id = request_id,
            component_variable = component_variable,
            component_criteria = component_criteria
        )

    @log_ocpp_processing(type="req")
    async def send_get_base_report(self, request_id: int, report_base: str):
        return call.GetBaseReportPayload(
            request_id = request_id,
            report_base = report_base
        )

    @log_ocpp_processing(type="req")
    async def send_get_variables(self, get_variable_data: List):
        return call.GetVariablesPayload(
            get_variable_data = get_variable_data
        )

    @log_ocpp_processing(type="req")
    async def send_reset(self, reset_type: ResetType, evse_id: Optional[int] = None):
        return call.ResetPayload(
            type = reset_type,
            evse_id = evse_id
        )

    @log_ocpp_processing(type="req")
    async def send_change_availability(self, operational_status: str, evse: Optional[Dict]):
        request = call.ChangeAvailabilityPayload(
            operational_status=operational_status,
            evse=evse
        )
        LOGGER.info("Sending change availability request: " + str(request))
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
    async def send_reserve_now(self, id: int, expiry_date_time: str, id_token: Dict, connector_type: str = None, evse_id: int = None, group_id_token: Dict = None):
        request = call.ReserveNowPayload(
            id = id,
            expiry_date_time = expiry_date_time,
            id_token = id_token,
            connector_type = connector_type,
            evse_id = evse_id,
            group_id_token = group_id_token
        )
        LOGGER.info("Sending reserve now request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_cancel_reservation(self, reservation_id: int):
        request = call.CancelReservationPayload(
            reservation_id = reservation_id
        )
        LOGGER.info("Sending cancel reservation request: " + str(request))
        result = await self.call(request)
        return result

    @log_ocpp_processing(type="req")
    async def send_clear_charging_profile(self, charging_profile_id: Optional[int] = None, charging_profile_criteria: Optional[Dict] = None, stack_level: int = None):
        request = call.ClearChargingProfilePayload(
            charging_profile_id = charging_profile_id,
            charging_profile_criteria = charging_profile_criteria,
            stack_level = stack_level
        )
        LOGGER.info("Sending clear charging profile request: " + str(request))
        result = await self.call(request)
        return result
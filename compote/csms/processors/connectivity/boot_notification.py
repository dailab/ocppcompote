from datetime import datetime

from ocpp.v16.enums import RegistrationStatus

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericBootNotificationProcessor:
    @log_processing(name="process_boot_notification")
    async def process(self, context: Context, charge_point_vendor: str, charge_point_model: str, **kwargs):
        context.cp_data["charge_point_vendor"] = charge_point_vendor
        context.cp_data["charge_point_model"] = charge_point_model

        if context.cp_data["auth"] is True:
            context.cp_data["registration_status"] = RegistrationStatus.accepted

        current_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        interval = context.cp_data["interval"]
        registration_status = context.cp_data["registration_status"]

        return {"current_time": current_time, "interval": interval, "status": registration_status}

class OCPP16BootNotificationProcessor(GenericBootNotificationProcessor):
    pass

class OCPP20BootNotificationProcessor(GenericBootNotificationProcessor):
    pass
from datetime import datetime
from typing import Any

from ocpp.v16.enums import FirmwareStatus
from ocpp.v201.enums import FirmwareStatusType

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericFirmwareStatusNotificationProcessor:
    async def process(self, context: Context, status: Any, **kwargs):
        context.cp_data["firmware_status_notifications"].append({str(datetime.utcnow()) : status})
        return True

class OCPP16FirmwareStatusNotificationProcessor(GenericFirmwareStatusNotificationProcessor):
    @log_processing(name="process_firmware_status_notification")
    async def process(self, context: Context, status: FirmwareStatus, **kwargs):
        await super().process(context, status, **kwargs)
        return True

class OCPP20FirmwareStatusNotificationProcessor(GenericFirmwareStatusNotificationProcessor):
    @log_processing(name="process_firmware_status_notification")
    async def process(self, context: Context, status: FirmwareStatusType, **kwargs):
        await super().process(context, status, **kwargs)
        return True
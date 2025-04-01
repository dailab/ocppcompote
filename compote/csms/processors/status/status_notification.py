from datetime import datetime
from typing import Any

from ocpp.v16.enums import ChargePointErrorCode, ChargePointStatus

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericStatusNotificationProcessor:
    async def process(self, context: Context, connector_id: int, values: Any, **kwargs):
        context.cp_data["connectors"][connector_id]["status"].append(values)
        return True

class OCPP16StatusNotificationProcessor(GenericStatusNotificationProcessor):
    @log_processing(name="process_status_notification")
    async def process(self, context: Context, connector_id: int, error_code: ChargePointErrorCode, status: ChargePointStatus, timestamp: str = None, info: str = None, vendor_id: str = None, vendor_error_code=None, **kwargs):
        values = {k: v for k, v in locals().items() if v is not None and k != "self" and k != "context" and k != "__class__"}
        if timestamp not in values: values.update({"timestamp" : str(datetime.now())})

        await context.context_manager.update_evse_status(context.cp_data["id"], status)

        return await super().process(context, connector_id, values, **kwargs)

class OCPP20StatusNotificationProcessor(GenericStatusNotificationProcessor):
    @log_processing(name="process_status_notification")
    async def process(self, context: Context, timestamp: str, connector_status: str, evse_id: str, connector_id: str, **kwargs):
        values = {k: v for k, v in locals().items() if v is not None and k != "self" and k != "context" and k != "__class__"}
        if timestamp not in values: values.update({"timestamp": str(datetime.now())})

        await context.context_manager.update_evse_status(context.cp_data["id"], connector_status)

        return await super().process(context, int(connector_id), values, **kwargs)
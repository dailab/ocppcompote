from datetime import datetime
from typing import Any

from ocpp.v16.enums import DiagnosticsStatus

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericDiagnosticsStatusNotificationProcessor:
    async def process(self, context: Context, status: Any, **kwargs):
        context.cp_data["diagnostic_status_notifications"].append({str(datetime.utcnow()) : status})
        return True

class OCPP16DiagnosticsStatusNotificationProcessor(GenericDiagnosticsStatusNotificationProcessor):
    @log_processing(name="process_diagnostics_status_notification")
    async def process(self, context: Context, status: DiagnosticsStatus, **kwargs):
        await super().process(context, status, **kwargs)
        return True
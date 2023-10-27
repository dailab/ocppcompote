from datetime import datetime
from typing import Any, Optional

from ocpp.v16.enums import ResetType

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericResetProcessor:
    async def process(self, context: Context, type: Any, connector_id: int = None, **kwargs):
        context.cp_data["resets"].append({str(datetime.now()): str(type)})
        return True

class OCPP16ResetProcessor(GenericResetProcessor):
    @log_processing(name="process_reset")
    async def process(self, context: Context, type: ResetType, **kwargs):
        await super().process(context, type)
        result = await context.cp.send_reset(type)
        return result

class OCPP20ResetProcessor(GenericResetProcessor):
    @log_processing(name="process_reset")
    async def process(self, context: Context, type: ResetType, evse_id: Optional[int] = None, **kwargs):
        await super().process(context=context, type=type, connector_id=evse_id)
        result = await context.cp.send_reset(type, evse_id)
        return result
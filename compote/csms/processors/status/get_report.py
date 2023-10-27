from typing import Optional, List

from compote.csms.analytics.stats import log_processing
from compote.csms.context.csms_context import Context


class GenericGetReportProcessor:
    async def process(self, context: Context, request_id: int, component_variable: Optional[List] = None, component_criteria: Optional[List] = None, **kwargs):
        return True

class OCPP20GetReportProcessor(GenericGetReportProcessor):
    @log_processing(name="process_get_base_report")
    async def process(self, context: Context, request_id: int, component_variable: Optional[List] = None, component_criteria: Optional[List] = None, **kwargs):
        await super().process(context=context, request_id=request_id, component_variable=component_variable, component_criteria=component_criteria, **kwargs)
        result = await context.cp.send_get_report(request_id=request_id, component_variable=component_variable, component_criteria=component_criteria)
        return result
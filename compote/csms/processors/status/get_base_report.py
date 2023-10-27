from compote.csms.analytics.stats import log_processing
from compote.csms.context.csms_context import Context


class GenericGetBaseReportProcessor:
    async def process(self, context: Context, request_id: int, report_base: str, **kwargs):
        return True

class OCPP20GetBaseReportProcessor(GenericGetBaseReportProcessor):
    @log_processing(name="process_get_base_report")
    async def process(self, context: Context, request_id: int, report_base: str, **kwargs):
        await super().process(context=context, request_id=request_id, report_base=report_base, **kwargs)
        result = await context.cp.send_get_base_report(request_id=request_id, report_base=report_base)
        return result
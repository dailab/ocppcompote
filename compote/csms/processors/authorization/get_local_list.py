from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing

class GenericGetLocalListVersionProcessor:
    async def process(self, context: Context, **kwargs):
        return True

class OCPP16GetLocalListVersionProcessor(GenericGetLocalListVersionProcessor):
    @log_processing(name="process_get_local_list_version")
    async def process(self, context: Context, **kwargs):
        await super().process(context, **kwargs)
        result = await context.cp.send_get_local_list_version()
        return result

class OCPP20GetLocalListVersionProcessor(GenericGetLocalListVersionProcessor):
    @log_processing(name="process_get_local_list_version")
    async def process(self, context: Context, **kwargs):
        await super().process(context, **kwargs)
        result = await context.cp.send_get_local_list_version()
        return result
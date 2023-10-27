from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericClearCacheProcessor:
    @log_processing(name="process_clear_cache")
    async def process(self, context: Context, **kwargs):
        result = await context.cp.send_clear_cache()
        return result

class OCPP16ClearCacheProcessor(GenericClearCacheProcessor):
    pass

class OCPP20ClearCacheProcessor(GenericClearCacheProcessor):
    pass
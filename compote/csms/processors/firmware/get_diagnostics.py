
from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericGetDiagnosticsProcessor:
    async def process(self, context: Context,  location: str, retries: int = None, retry_interval: int = None, start_time: str = None, stop_time: str = None, **kwargs):
        return True

class OCPP16GetDiagnosticsProcessor(GenericGetDiagnosticsProcessor):
    @log_processing(name="process_get_diagnostics")
    async def process(self, context: Context, location: str, retries: int = None, retry_interval: int = None, start_time: str = None, stop_time: str = None, **kwargs):
        await super().process(context, location, retries, retry_interval, start_time, stop_time, **kwargs)
        result = await context.cp.send_get_diagnostics(location, retries, retry_interval, start_time, stop_time)
        return result

class OCPP20GetDiagnosticsProcessor(GenericGetDiagnosticsProcessor):
    @log_processing(name="process_get_diagnostics")
    async def process(self, context: Context,  location: str, retries: int = None, retry_interval: int = None, start_time: str = None, stop_time: str = None, **kwargs):
        await super().process(context, location, retries, retry_interval, start_time, stop_time, **kwargs)
        result = await context.cp.send_get_diagnostics(location, retries, retry_interval, start_time, stop_time)
        return result
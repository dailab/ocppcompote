from ocpp.v201.datatypes import FirmwareType

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericUpdateFirmwareProcessor:
    async def process(self, context: Context, location: str, retrieve_date: str, retries: int = None, retry_interval: int = None, **kwargs):
        return True

class OCPP16UpdateFirmwareProcessor(GenericUpdateFirmwareProcessor):
    @log_processing(name="process_update_firmware")
    async def process(self, context: Context, location: str, retrieve_date: str, retries: int = None, retry_interval: int = None, **kwargs):
        await super().process(context, location, retrieve_date, retries, retry_interval, **kwargs)
        result = await context.cp.send_update_firmware(location, retrieve_date, retries, retry_interval)
        return result

class OCPP20UpdateFirmwareProcessor(GenericUpdateFirmwareProcessor):
    @log_processing(name="process_update_firmware")
    async def process(self, context: Context, request_id: int, firmware: FirmwareType, retries: int = None, retry_interval: int = None, **kwargs):
        await super().process(context, "", "", retries, retry_interval, **kwargs)
        result = await context.cp.send_update_firmware(request_id, firmware, retries, retry_interval)
        return result
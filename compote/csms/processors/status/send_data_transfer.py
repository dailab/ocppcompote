
from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericSendDataTransferProcessor:
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        return True

class OCPP16SendDataTransferProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)
        result = await context.cp.send_data_transfer(vendor_id, message_id, data)
        return result

class OCPP20SendDataTransferProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)
        result = await context.cp.send_data_transfer(vendor_id, message_id, data)
        return result
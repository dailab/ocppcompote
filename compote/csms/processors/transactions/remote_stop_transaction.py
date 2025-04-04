from typing import Dict

from compote.csms.analytics.stats import log_processing
from compote.csms.context.csms_context import Context

class GenericRemoteStopTransactionProcessor:
    async def process(self, context: Context, transaction_id: int, **kwargs):
        return True

class OCPP16RemoteStopTransactionProcessor(GenericRemoteStopTransactionProcessor):
    @log_processing(name="process_remote_stop_transaction")
    async def process(self, context: Context, transaction_id: int, **kwargs):
        await super().process(context, transaction_id)
        result = await context.cp.send_remote_stop_transaction(transaction_id)
        return result

class OCPP20RemoteStopTransactionProcessor(GenericRemoteStopTransactionProcessor):
    @log_processing(name="process_remote_stop_transaction")
    async def process(self, context: Context, transaction_id: str, custom_data: Dict = None, **kwargs):
        await super().process(context, transaction_id)
        result = await context.cp.send_request_stop_transaction(transaction_id, custom_data)
        return result
import logging
from datetime import datetime

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing
from compote.shared.enums import Transaction, IdTag

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('stop_transaction_processor')

class GenericStopTransactionProcessor:
    @log_processing(name="process_stop_transaction")
    async def process(self, context: Context, meter_stop: int, timestamp: str, transaction_id: int, id_tag: str, **kwargs):

        # Set status message as rejected as standard
        id_tag_info = {'status': 'Blocked'}

        for connector in context.cp_data["connectors"]:
           for transaction in context.cp_data["connectors"][connector]["transactions"]:

               if transaction["id"] is transaction_id:

                    # Proceed with stopping transaction
                   transaction["status"] = Transaction.stopped
                   transaction["timestamp_stop"] = timestamp
                   transaction["meter_stop"] = meter_stop

                    # Set stop_transaction request as accepted and return result
                   id_tag_info["status"] = 'Accepted'
                   id_tag_info["expiry_date"] =  datetime.utcnow().isoformat()
                   return id_tag_info
        return id_tag_info

class OCPP16StopTransactionProcessor(GenericStopTransactionProcessor):
    pass

import logging
from datetime import datetime

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing
from compote.shared.enums import Transaction, IdTag

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('start_transaction_processor')

class GenericStartTransactionProcessor:
    @log_processing(name="process_start_transaction")
    async def process(self, context: Context, connector_id: int, id_tag: str, meter_start: int, timestamp: str, reservation_id: int = None, **kwargs):

        # Determine auth previously, if auth successful: status = Accepted, else Rejected
        status = await context.determine_authorization_status(id_tag)

        # Create reply data structures
        id_tag_info = {'status' : status}
        result = {'id_tag_info' : id_tag_info}

        # Check plausibility of meter_start
        if meter_start > 0:
            LOGGER.info("StartTransaction: plausibility check of meter_start failed")
            status = IdTag.invalid


        # Check if connector_id is correct and not None
        if connector_id in context.cp_data["connectors"]:
            connector = context.cp_data["connectors"][connector_id]
        else:
            LOGGER.info("StartTransaction: connector id not found, creating new one")
            connector = await context.init_connector(connector_id)

        # Check if there already occuring transactions for connector + id
        for transaction in connector["transactions"]:
            if transaction["status"] is Transaction.active:
                if not transaction["idTag"] == id_tag:
                    LOGGER.info("StartTransaction: transaction id not found")
                    result["id_tag_info"]["status"] = IdTag.invalid
                    return result
                else:
                    LOGGER.info("StartTransaction: transaction is concurrent")
                    result["id_tag_info"]["status"]  = IdTag.concurrent
                    result["transaction_id"] = transaction["id"]
                    return result

        # TODO: Check if there is current reservation blocking transaction start
        # Check if there is a reservation for id_tag and whether it has expired
        if reservation_id:
            for reservation in connector["reservations"]:
                if reservation_id == reservation["id"] and reservation["id_tag"] == id_tag:
                    if timestamp > reservation["expiry_date"]:
                        result["id_tag_info"]["status"] = IdTag.expired
                        return result

        # If checks successful, finally add transaction
        transactions = connector["transactions"]
        transaction = {
            "id" : len(transactions)+1,
            "status" : Transaction.active,
            "idTag" : id_tag,
            "meter_start" : meter_start,
            "timestamp_start" : timestamp
        }
        id_tag_info["expiry_date"] = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        transactions.append(transaction)
        result["transaction_id"] = transaction["id"]

        return result

class OCPP16StartTransactionProcessor(GenericStartTransactionProcessor):
    pass

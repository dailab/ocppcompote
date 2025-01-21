import logging
from datetime import datetime
from typing import Dict, Optional, List

from ocpp.v201.enums import TransactionEventType

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing
from compote.shared.enums import Transaction, IdTag

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger('transaction_processor')

class GenericTransactionProcessor:
    pass

class OCPP16TransactionProcessor(GenericTransactionProcessor):
    pass

class OCPP20TransactionProcessor(GenericTransactionProcessor):
    @log_processing(name="process_transaction")
    async def process(self, context: Context, event_type: str, timestamp: str, trigger_reason: str, seq_no: int, transaction_info: Dict, meter_value: Optional[List] = None, offline: Optional[bool] = None, number_of_phases_used: Optional[int] = None, cable_max_current: Optional[int] = None, reservation_id: Optional[int] = None, evse: Optional[Dict] = None, id_token: Optional[Dict] = None, **kwargs):

        if (event_type == TransactionEventType.started):

            # CablePluggedIn, not authorized yet
            if id_token:
                status = await context.determine_authorization_status(id_token.get("id_token"))
            else:
                # TODO Workaround
                status = IdTag.accepted

            # Create reply data structures
            id_tag_info = {'status': status}
            result = {'id_tag_info': id_tag_info}

            # Check if connector id is correct and not None
            if evse["id"] in context.cp_data["connectors"]:
                connector = context.cp_data["connectors"][evse["id"]]
            else:
                LOGGER.info("StartTransaction: connector id not found, creating new one")
                connector = await context.init_connector(evse["id"])

            # Check if there already occuring transactions for connector + id
            for transaction in connector["transactions"]:
                if transaction["status"] == Transaction.active:
                    if not transaction["idTag"] == id_token.get("id_token"):
                        LOGGER.info("StartTransaction: transaction id not found")
                        result["id_tag_info"]["status"] = IdTag.invalid
                        return result
                    else:
                        LOGGER.info("StartTransaction: transaction is concurrent")
                        result["id_tag_info"]["status"] = IdTag.concurrent
                        result["transaction_id"] = transaction["id"]
                        return result

            # TODO: Check if there is current reservation blocking transaction start
            # Check if there is a reservation for id_tag and whether it has expired
            if reservation_id:
                for reservation in connector["reservations"]:
                    if reservation_id == reservation["id"] and reservation["id_tag"] == id_token.get("id_token"):
                        if timestamp > reservation["expiry_date"]:
                            result["id_tag_info"]["status"] = IdTag.expired
                            return result

            # If checks successful, finally add transaction
            transactions = connector["transactions"]

            meter_values = []
            meter_values.append(meter_value)

            # TODO Workaround
            if id_token:
                idTag_temp = id_token.get("id_token")
            else:
                idTag_temp = IdTag.accepted

            transaction = {
                "id": transaction_info.get("transaction_id"),
                "status": Transaction.active,
                "idTag": idTag_temp,
                "meter_start": meter_value,
                "meter_values" : meter_values,
                "timestamp_start": timestamp
            }
            id_tag_info["expiry_date"] = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
            transactions.append(transaction)
            result["transaction_id"] = transaction["id"]
            result["total_cost"] = 0

            return result

        if (event_type == TransactionEventType.ended):
            id_tag_info = {'status': 'Blocked'}

            # Traverse connectors and their transactions if there is a transaction with the given transaction_id
            for connector in context.cp_data["connectors"]:
                for transaction in context.cp_data["connectors"][connector]["transactions"]:
                    if transaction["id"] == transaction_info["transaction_id"]:
                        print(transaction["id"], transaction_info["transaction_id"])
                        # Proceed with stopping transaction
                        transaction["status"] = Transaction.stopped
                        transaction["timestamp_stop"] = timestamp
                        transaction["meter_stop"] = meter_value
                        transaction["meter_values"].append(meter_value)
                        # Set stop_transaction request as accepted and return result
                        id_tag_info["status"] = 'Accepted'
                        id_tag_info["expiry_date"] = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
                        return id_tag_info
            return id_tag_info

        # TODO Implement TransactionEventType.updated
        if (event_type == TransactionEventType.updated):
            id_tag_info = {'status': 'Blocked'}
            # Traverse connectors and their transactions if there is a transaction with the given transaction_id
            for connector in context.cp_data["connectors"]:
                for transaction in context.cp_data["connectors"][connector]["transactions"]:
                    # If transaction_id was found, perform consistency checks
                    if transaction["id"] == transaction_info["transaction_id"]:
                        # Set stop_transaction request as accepted and return result
                        transaction["meter_values"].append(meter_value)
                        id_tag_info["status"] = 'Accepted'
                        id_tag_info["expiry_date"] = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
                        return id_tag_info
            return id_tag_info

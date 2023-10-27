
from ocpp.v16.enums import DataTransferStatus
from ocpp.v201.enums import DataTransferStatusType

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericReceiveDataTransferProcessor:
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        return True

class OCPP16ReceiveDataTransferProcessor(GenericReceiveDataTransferProcessor):
    @log_processing(name="process_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        # Check if vendor_id and message_id exist
        if vendor_id not in context.cp_data["data_transfer"]["known_vendors"]:
            return {"status": DataTransferStatus.unknownVendorId}
        else:
            if not message_id in context.cp_data["data_transfer"]["known_message_ids"]:
                return {"status": DataTransferStatus.unknownMessageId}

        # Perform DataTransfer processing
        return {"status": DataTransferStatus.rejected, "data": data}

class OCPP20ReceiveDataTransferProcessor(GenericReceiveDataTransferProcessor):
    @log_processing(name="process_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None,  data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        # Check if vendor_id and message_id exist
        if vendor_id not in context.cp_data["data_transfer"]["known_vendors"]:
            return {"status": DataTransferStatusType.unknown_vendor_id}
        else:
            if not message_id in context.cp_data["data_transfer"]["known_message_ids"]:
                return {"status": DataTransferStatusType.unknown_message_id}

        # Perform DataTransfer processing
        return {"status": DataTransferStatusType.rejected}
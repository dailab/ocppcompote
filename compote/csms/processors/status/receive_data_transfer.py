import json
from datetime import datetime

from ocpp.v16.call import DataTransferPayload
from ocpp.v16.enums import DataTransferStatus
from ocpp.v201.enums import DataTransferStatusType

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericReceiveDataTransferProcessor:
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        context.cp_data["data_transfers"].append({str(datetime.utcnow()) : {"message_id" : message_id, "vendor_id" : vendor_id, "data" : data}})
        return True

class OCPP16ReceiveDataTransferProcessor(GenericReceiveDataTransferProcessor):
    @log_processing(name="process_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        data = {
            "certificateStatus" : "Accepted",
            "idTokenInfo" : {
                "status" : "Accepted"
            }
        }

        return {"status": DataTransferStatus.accepted, "data": json.dumps(data)}

    class OCPP16ReceiveDataTransferProcessor(GenericReceiveDataTransferProcessor):
        @log_processing(name="process_data_transfer")
        async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
            await super().process(context, vendor_id, message_id, data, **kwargs)

            # TODO
            if vendor_id == "org.openchargealliance.iso15118pnc":
                data = {
                    "certificateStatus": "Accepted",
                    "idTokenInfo": {
                        "status": "Accepted"
                    }
                }

                match message_id:
                    case 'Authorize':
                        data = {
                            "certificateStatus": "Accepted",
                            "idTokenInfo": {
                                "status": "Accepted"
                            }
                        }
                    case 'Get15118EVCertificate':
                        pass
                    case 'CertificateSigned':
                        pass
                    case 'GetCertificateStatus':
                        data = {
                            "certificateStatus": "Accepted",
                            "idTokenInfo": {
                                "status": "Accepted"
                            }
                        }
                    case 'InstallCertificate':
                        pass
                    case 'TriggerMessage':
                        pass
                    case 'DeleteCertificate':
                        pass
                    case _:
                        pass

                return {"status": DataTransferStatus.accepted, "data": json.dumps(data)}
            else:
                return {"status": DataTransferStatus.accepted, "data": {}}


class OCPP20ReceiveDataTransferProcessor(GenericReceiveDataTransferProcessor):
    @log_processing(name="process_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None,  data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        if vendor_id not in context.cp_data["data_transfer"]["known_vendors"]:
            return {"status": DataTransferStatusType.unknown_vendor_id}
        else:
            if not message_id in context.cp_data["data_transfer"]["known_message_ids"]:
                return {"status": DataTransferStatusType.unknown_message_id}

        return {"status": DataTransferStatusType.rejected}

class OCPP20ReceiveDataTransferV2GProcessor(GenericReceiveDataTransferProcessor):
    @log_processing(name="process_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None,  data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        if vendor_id not in context.cp_data["data_transfer"]["known_vendors"]:
            return {"status": DataTransferStatusType.unknown_vendor_id}
        else:
            if not message_id in context.cp_data["data_transfer"]["known_message_ids"]:
                return {"status": DataTransferStatusType.unknown_message_id}

        return {"status": DataTransferStatusType.rejected}
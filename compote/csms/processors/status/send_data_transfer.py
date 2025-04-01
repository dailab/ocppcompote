import json
from typing import Dict

from ocpp.v16.call import DataTransferPayload

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

class OCPP16SendDataTransferGetInstalledCertificateIdsProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str = "org.openchargealliance.iso15118pnc", message_id: str = "GetInstalledCertificateIds", data: str = "", **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        if not data:
            data = {
                "certificateType" : "CSMSRootCertificate"
            }

        data_json = json.dumps(data)

        datatransfer = DataTransferPayload(message_id=message_id, vendor_id=vendor_id, data=data_json)

        result = await context.cp.send_data_transfer(datatransfer.vendor_id, datatransfer.message_id, datatransfer.data)
        return result

class OCPP16SendDataTransferCertificateSignedProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str = "org.openchargealliance.iso15118pnc", message_id: str = "CertificateSigned", data: str = "", **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        if not data:
            data = {
                "certificate" : ""
            }

        data_json = json.dumps(data)

        datatransfer = DataTransferPayload(message_id=message_id, vendor_id=vendor_id, data=data_json)

        result = await context.cp.send_data_transfer(datatransfer.vendor_id, datatransfer.message_id, datatransfer.data)
        return result

class OCPP16SendDataTransferDeleteCertificateProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str = "org.openchargealliance.iso15118pnc", message_id: str = "DeleteCertificate", data: str = "", **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        if not data:
            data = {
                "certificate" : ""
            }

        data_json = json.dumps(data)

        datatransfer = DataTransferPayload(message_id=message_id, vendor_id=vendor_id, data=data_json)

        result = await context.cp.send_data_transfer(datatransfer.vendor_id, datatransfer.message_id, datatransfer.data)
        return result

class OCPP16SendDataTransferTriggerMessageProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str = "org.openchargealliance.iso15118pnc", message_id: str = "TriggerMessage", data: str = "", **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        if not data:
            data = {
                "requested_message": "SignV2GCertificate",
                "connector_id": 0
            }

        data_json = json.dumps(data)

        datatransfer = DataTransferPayload(message_id=message_id, vendor_id=vendor_id, data=data_json)

        result = await context.cp.send_data_transfer(datatransfer.vendor_id, datatransfer.message_id, datatransfer.data)
        return result

class OCPP16SendDataTransferCertificateInstallationProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str = "org.openchargealliance.iso15118pnc", message_id: str = "CertificateInstallationReq", data: str = "", **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        if not data:
            data = {
            }

        data_json = json.dumps(data)

        datatransfer = DataTransferPayload(message_id=message_id, vendor_id=vendor_id, data=data_json)

        result = await context.cp.send_data_transfer(datatransfer.vendor_id, datatransfer.message_id, datatransfer.data)
        return result

class OCPP20SendDataTransferProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, custom_data: Dict = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)
        result = await context.cp.send_data_transfer(vendor_id, message_id, data, custom_data)
        return result
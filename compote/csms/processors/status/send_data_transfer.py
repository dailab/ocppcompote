import json
from typing import Dict

from ocpp.v16 import call
from ocpp.v16.call import DataTransferPayload, TriggerMessagePayload

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

# TODO ISO15118 Processing
class OCPP16SendDataTransferV2GCertificateProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        datatransfer = DataTransferPayload
        datatransfer.message_id = "SignCertificate"
        data = {
            "csr" : "",
            "certificateType" : "V2GCertificate"
        }
        datatransfer.data = json.dumps(data)
        datatransfer.vendor_id = "org.openchargealliance.iso15118pnc"

        result = await context.cp.send_data_transfer(datatransfer.vendor_id, datatransfer.message_id, datatransfer.data)
        return result

class OCPP16SendDataTransferGetCertificateStatusProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        datatransfer = DataTransferPayload
        datatransfer.message_id = "GetCertificateStatus"
        data = {
        }
        datatransfer.data = json.dumps(data)
        datatransfer.vendor_id = "org.openchargealliance.iso15118pnc"

        result = await context.cp.send_data_transfer(datatransfer.vendor_id, datatransfer.message_id, datatransfer.data)
        return result

class OCPP16SendDataTransferGetInstalledCertificateIdsProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        datatransfer = DataTransferPayload
        datatransfer.message_id = "GetInstalledCertificateIds"
        data = {
            "certificateType" : ""
        }
        datatransfer.data = json.dumps(data)
        datatransfer.vendor_id = "org.openchargealliance.iso15118pnc"

        result = await context.cp.send_data_transfer(datatransfer.vendor_id, datatransfer.message_id, datatransfer.data)
        return result

class OCPP16SendDataTransferCertificateSignedProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        datatransfer = DataTransferPayload
        datatransfer.message_id = "CertificateSigned"
        data = {
            "certificate" : ""
        }
        datatransfer.data = json.dumps(data)
        datatransfer.vendor_id = "org.openchargealliance.iso15118pnc"

        result = await context.cp.send_data_transfer(datatransfer.vendor_id, datatransfer.message_id, datatransfer.data)
        return result

class OCPP16SendDataTransferTriggerMessageProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        triggermessage = TriggerMessagePayload
        triggermessage.requested_message = "SignV2GCertificate"
        datatransfer = DataTransferPayload
        datatransfer.message_id = "TriggerMessage"
        data = triggermessage
        datatransfer.data = json.dumps(data)
        datatransfer.vendor_id = "org.openchargealliance.iso15118pnc"

        result = await context.cp.send_data_transfer(datatransfer.vendor_id, datatransfer.message_id, datatransfer.data)
        return result

class OCPP16SendDataTransferCertificateInstallationProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        datatransfer = DataTransferPayload
        datatransfer.message_id = "CertificateInstallationReq"
        datatransfer.data = json.dumps(data)
        datatransfer.vendor_id = "org.openchargealliance.iso15118pnc"

        result = await context.cp.send_data_transfer(datatransfer.vendor_id, datatransfer.message_id, datatransfer.data)
        return result

class OCPP20SendDataTransferProcessor(GenericSendDataTransferProcessor):
    @log_processing(name="process_send_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, custom_data: Dict = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)
        result = await context.cp.send_data_transfer(vendor_id, message_id, data, custom_data)
        return result
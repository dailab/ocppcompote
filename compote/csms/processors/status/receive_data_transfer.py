import asyncio
import json
from datetime import datetime

from ocpp.v16.enums import DataTransferStatus
from ocpp.v201.enums import DataTransferStatusType

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing
from compote.csms.cpopncservice.ccp_pnc_routes import get_signed_contract_data
from compote.csms.cpopncservice.est_pnc_routes import csr_enroll
from compote.csms.cpopncservice.pnc_routes import get_ocsp_request


class GenericReceiveDataTransferProcessor:
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        context.cp_data["data_transfers"].append({str(datetime.utcnow()) : {"message_id" : message_id, "vendor_id" : vendor_id, "data" : data}})
        return True

class OCPP16ReceiveDataTransferProcessor(GenericReceiveDataTransferProcessor):
    @log_processing(name="process_data_transfer")
    async def process(self, context: Context, vendor_id: str, message_id: str = None, data: str = None, **kwargs):
        await super().process(context, vendor_id, message_id, data, **kwargs)

        if vendor_id == "org.openchargealliance.iso15118pnc":
            match message_id:
                case 'Authorize':
                    return await OCPP16ReceiveDataTransferAuthorizeProcessor().process(context, vendor_id, message_id, data, **kwargs)
                case 'Get15118EVCertificate':
                    return await OCPP16ReceiveDataTransferGet15118EVCertificateProcessor().process(context, vendor_id, message_id, data, **kwargs)
                case 'SignCertificate':
                    return await OCPP16ReceiveDataTransferSignCertificateProcessor().process(context, vendor_id, message_id, data, **kwargs)
                case 'GetCertificateStatus':
                    return await OCPP16ReceiveDataTransferGetCertificateStatusProcessor().process(context, vendor_id, message_id, data, **kwargs)
                case _:
                    data = {
                        "certificateStatus": "Accepted",
                        "idTokenInfo": {
                            "status": "Accepted"
                        }
                    }
                    status = DataTransferStatus.accepted

            return {"status": status, "data": json.dumps(data)}
        else:
            return {"status": DataTransferStatus.accepted, "data": {}}

class OCPP16ReceiveDataTransferAuthorizeProcessor(GenericReceiveDataTransferProcessor):
    @log_processing(name="process_data_transfer")
    async def process(self, context: Context, vendor_id: str = "org.openchargealliance.iso15118pnc", message_id: str = "Authorize", data: str = None, **kwargs):

        data_json = json.loads(data)
        id_token_info = {'status' : await context.determine_authorization_status(data_json["idToken"])}

        # TODO validate certificate
        if "certificate" in data_json:
            pass

        # Verify EV Contract Certificates via OCSP
        certificate_status = "Accepted"
        if "iso15118CertificateHashData" in data_json:
            for item in data_json["iso15118CertificateHashData"]:
                hash_algorithm = item["hashAlgorithm"]
                issuer_name_hash = item["issuerNameHash"]
                issuer_key_hash = item["issuerKeyHash"]
                serial_number = item["serialNumber"]
                responder_url = item["responderURL"]
                result = await get_ocsp_request(hash_algorithm=hash_algorithm, issuer_name_hash=issuer_name_hash,
                                                issuer_key_hash=issuer_key_hash, serial_number=serial_number,
                                                responder_url=responder_url, context=context)

                if result["status"] is not "Accepted":
                    certificate_status = "CertificateRevoked"
                    break

        data = {
            "certificateStatus": certificate_status,
            "idTokenInfo": id_token_info
        }

        status = DataTransferStatus.accepted

        return {"status": status, "data": json.dumps(data)}

class OCPP16ReceiveDataTransferSignCertificateProcessor(GenericReceiveDataTransferProcessor):
    @log_processing(name="process_data_transfer")
    async def process(self, context: Context, vendor_id: str = "org.openchargealliance.iso15118pnc", message_id: str = "SignCertificate", data: str = None, **kwargs):
        data_return = {
            "status": "Accepted"
        }

        data_json = json.loads(data)

        asyncio.create_task(csr_enroll(body=data_json["csr"], context=context))

        status = DataTransferStatus.accepted

        return {"status": status, "data": json.dumps(data_return)}

class OCPP16ReceiveDataTransferGet15118EVCertificateProcessor(GenericReceiveDataTransferProcessor):
    @log_processing(name="process_data_transfer")
    async def process(self, context: Context, vendor_id: str = "org.openchargealliance.iso15118pnc", message_id: str = "Get15118EVCertificate", data: str = None, **kwargs):

        if data:
            data_json = json.loads(data)
            xsd_msg_def_namespace = data_json["iso15118SchemaVersion"]
            action = data_json["action"] # Determine Update or Creation
            exi_request = data_json["exiRequest"]
        # Debugging purposes if data is not provided
        else:
            xsd_msg_def_namespace = None
            exi_request = None

        response = await get_signed_contract_data(exi_request=exi_request, xsd_msg_def_namespace=xsd_msg_def_namespace, context=context)

        data_return = {
            "status": response["status_code"],
            "exiResponse": response["exi_response"]
        }
        status = DataTransferStatus.accepted

        return {"status": status, "data": json.dumps(data_return)}

class OCPP16ReceiveDataTransferGetCertificateStatusProcessor(GenericReceiveDataTransferProcessor):
    @log_processing(name="process_data_transfer")
    async def process(self, context: Context, vendor_id: str = "org.openchargealliance.iso15118pnc", message_id: str = "GetCertificateStatus", data: str = None, **kwargs):

        data_json = json.loads(data)
        hash_algorithm = data_json["ocspRequestData"]["hashAlgorithm"]
        issuer_name_hash = data_json["ocspRequestData"]["issuerNameHash"]
        issuer_key_hash = data_json["ocspRequestData"]["issuerKeyHash"]
        serial_number = data_json["ocspRequestData"]["serialNumber"]
        responder_url = data_json["ocspRequestData"]["responderURL"]

        result = await get_ocsp_request(hash_algorithm=hash_algorithm, issuer_name_hash=issuer_name_hash, issuer_key_hash=issuer_key_hash, serial_number=serial_number, responder_url=responder_url, context=context)

        data = result

        status = DataTransferStatus.accepted

        return {"status": status, "data": json.dumps(data)}

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
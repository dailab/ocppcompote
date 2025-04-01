import base64
import logging
from pathlib import Path
from typing import Any

import httpx
from asn1crypto import cms
from fastapi import APIRouter, Depends, HTTPException
from compote.csms.context.csms_contextmanager import get_shared_context_manager, ContextManager
from compote.csms.cpopncservice.pnc_routes import get_bearer_token
from compote.csms.processors.status.send_data_transfer import OCPP16SendDataTransferCertificateSignedProcessor

router = APIRouter()

@router.post("/enroll", tags=["CPO EST PNC Client API"])
async def csr_enroll(
        body: str = None,
        context = None,
        context_manager: ContextManager = Depends(get_shared_context_manager),
) -> Any:

    auth_token = await get_bearer_token()

    endpoint_url = (
        f"https://open.plugncharge-test.hubject.com/.well-known/cpo/simpleenroll"
    )
    headers = {
        "Content-Type": "application/pkcs10",
        'Authorization': auth_token,
        "Accept": "application/pkcs10"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(endpoint_url, content=body, headers=headers)
            response.raise_for_status()
            p7_data = response.content

            logging.info(p7_data)

            decoded_data = base64.b64decode(p7_data)

            pkcs7 = cms.ContentInfo.load(decoded_data)

            certificates = []
            for cert in pkcs7['content']['certificates']:
                # Convert to PEM format
                pem_data = cert.dump()
                certificates.append(pem_data)

            pem_data_combined = b''.join(certificates)
            pem_data_base64 = base64.b64encode(pem_data_combined)
            pem_data_base64_str = pem_data_base64.decode('utf-8')

            data = {
                "certificateChain": pem_data_base64_str
            }

            result = await OCPP16SendDataTransferCertificateSignedProcessor().process(context=context, data=data)
            logging.info(result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get_ca_certs", tags=["CPO EST PNC Client API"])
async def get_ca_certs(
    context_manager=Depends(get_shared_context_manager),
) -> Any:
    certificate_path = Path("./compote/csms/cpopncservice/certificates")
    auth_token = await get_bearer_token()

    async def fetch_certs(url):
        headers = {
            "Accept": "application/pkcs7-mime, application/pkcs7",
            "Authorization": f"{auth_token}",
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            p7_data = response.content

            logging.info(p7_data)

            try:
                decoded_data = base64.b64decode(p7_data)
            except Exception:
                decoded_data = p7_data

            pkcs7 = cms.ContentInfo.load(decoded_data)

            certificates = []
            for cert in pkcs7['content']['certificates']:
                # Convert each certificate to PEM format
                pem_data = cert.dump()
                certificates.append(pem_data)

            return certificates

    try:
        cpo_certs = await fetch_certs("https://open.plugncharge-test.hubject.com/.well-known/cpo/cacerts")

        cpo_sub_ca1 = [cert for cert in cpo_certs if b'CPO Sub1 CA QA G1.2' in cert]
        cpo_sub_ca2 = [cert for cert in cpo_certs if b'CPO Sub2 CA QA G1.2.1' in cert]
        root_v2g = [cert for cert in cpo_certs if b'V2G Root CA QA G1' in cert]

        certificate_path.mkdir(parents=True, exist_ok=True)

        (certificate_path / "cpo_sub_ca1.pem").write_bytes(b''.join(cpo_sub_ca1))
        (certificate_path / "cpo_sub_ca2.pem").write_bytes(b''.join(cpo_sub_ca2))
        (certificate_path / "root-V2G-cert.pem").write_bytes(b''.join(root_v2g))
        (certificate_path / "trust.pem").write_bytes(b''.join(cpo_sub_ca1 + cpo_sub_ca2))

        everest_dir = Path("./compote/cs_everest/everest/certs/ca/cso/")

        return {"message": "CA certificates fetched and saved successfully", "location" : certificate_path, "everest_dir" : everest_dir}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

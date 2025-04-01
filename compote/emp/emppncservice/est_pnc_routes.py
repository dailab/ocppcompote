import base64
import logging
from pathlib import Path
from typing import Any

import httpx
from asn1crypto import cms
from fastapi import APIRouter, Depends, HTTPException

from compote.emp.context.emp_context import get_shared_context, EMPContext
from compote.emp.emppncservice.pnc_routes import get_bearer_token

router = APIRouter()

@router.post("/enroll", tags=["EMP EST PNC Client API"])
async def csr_enroll(
        body: str = None,
        context: EMPContext = Depends(get_shared_context),
) -> Any:

    auth_token = await get_bearer_token()

    endpoint_url = (
        f"https://open.plugncharge-test.hubject.com/.well-known/mo/simpleenroll"
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

            return {"message": "CSR enrollment successful", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get_ca_certs", tags=["EMP EST PNC Client API"])
async def get_ca_certs(
    context=Depends(get_shared_context),
) -> Any:
    certificate_path = Path("./compote/emp/emppncservice/certificates")
    certificate_path.mkdir(parents=True, exist_ok=True)

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
                pem_data = cert.dump()
                certificates.append(pem_data)

            return certificates

    try:
        mo_certs = await fetch_certs("https://open.plugncharge-test.hubject.com/.well-known/mo/cacerts")
        mo_sub_ca1 = [cert for cert in mo_certs if b'MO Sub1 CA QA G1.2' in cert]
        mo_sub_ca2 = [cert for cert in mo_certs if b'MO Sub2 CA QA G1.2.1' in cert]

        (certificate_path / "mo_sub_ca1.pem").write_bytes(b''.join(mo_sub_ca1))
        (certificate_path / "mo_sub_ca2.pem").write_bytes(b''.join(mo_sub_ca2))

        everest_dir = Path("./compote/cs_everest/everest/certs/ca/mo/")

        return {"message": "CA certificates fetched and saved successfully", "location" : certificate_path, "everest_dir" : everest_dir}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
import base64
import logging
from typing import Any

import httpx
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives._serialization import Encoding
from cryptography.x509 import ocsp
from cryptography.x509.ocsp import OCSPRequestBuilder
from fastapi import APIRouter, Depends, HTTPException
from compote.csms.context.csms_contextmanager import ContextManager, get_shared_context_manager

router = APIRouter()

@router.post("/ocsp_request", tags=["CPO PNC Client API"])
async def get_ocsp_request(
        hash_algorithm: str = None,
        issuer_name_hash: str = None,
        issuer_key_hash: str = None,
        serial_number: str = None,
        responder_url: str = None,
        context = None,
        context_manager: ContextManager = Depends(get_shared_context_manager),
) -> Any:

    # Convert to hash algorithm instance
    if hash_algorithm == "SHA1":
        hash_algorithm_instance = hashes.SHA1()
    elif hash_algorithm == "SHA256":
        hash_algorithm_instance = hashes.SHA256()
    elif hash_algorithm == "SHA384":
        hash_algorithm_instance = hashes.SHA384()
    elif hash_algorithm == "SHA512":
        hash_algorithm_instance = hashes.SHA512()
    else:
        raise ValueError("Unsupported hash algorithm")

    # Converts hex to bytes/int
    issuer_name_hash_bytes = bytes.fromhex(issuer_name_hash)
    issuer_key_hash_bytes = bytes.fromhex(issuer_key_hash)
    serial_number_int = int(serial_number, 16)

    ocsp_request = OCSPRequestBuilder().add_certificate_by_hash(issuer_name_hash=issuer_name_hash_bytes, issuer_key_hash=issuer_key_hash_bytes, serial_number=serial_number_int, algorithm=hash_algorithm_instance).build()
    ocsp_request_data = ocsp_request.public_bytes(encoding=Encoding.DER)

    async with httpx.AsyncClient() as client:
        headers = {
            "Content-Type": "application/ocsp-request",
            "Accept": "application/ocsp-response"
        }
        response = await client.post(responder_url, content=ocsp_request_data, headers=headers)

    if response.status_code == 200:
        ocsp_response = ocsp.load_der_ocsp_response(response.content)
        ocsp_response_der = ocsp_response.public_bytes(Encoding.DER)
        ocsp_response_base64 = base64.b64encode(ocsp_response_der).decode('utf-8')
        logging.info(ocsp_response.certificate_status)

        if ocsp_response.certificate_status == ocsp_response.certificate_status.GOOD:
            status = "Accepted"
        else:
            status = "Failed"

    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to get OCSP response")

    if ocsp_response:
        response = {"status" : status, "ocspResult" : ocsp_response_base64}
    else:
        response = {"status" : status}

    return response

@router.post("/request_bearer_token", tags=["CPO PNC Client API"])
async def get_bearer_token(
        context_manager: ContextManager = Depends(get_shared_context_manager)
) -> Any:

    endpoint_url = (
        f"https://hubject.stoplight.io/api/v1/projects/cHJqOjk0NTg5/nodes/6bb8b3bc79c2e-authorization-token"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(endpoint_url)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to retrieve bearer token")

        data = response.json()
        token_info = data.get("data", "")

        start_marker = "# Authorization Token\n> Please use the following token to authorize your requests on Open Plugncharge:\n\n```\n"
        end_marker = "\n```"

        if start_marker in token_info and end_marker in token_info:
            start_index = token_info.index(start_marker) + len(start_marker)
            end_index = token_info.index(end_marker, start_index)
            bearer_token = token_info[start_index:end_index].strip()
        else:
            raise HTTPException(status_code=400, detail="Bearer token not found in the response")

        return bearer_token
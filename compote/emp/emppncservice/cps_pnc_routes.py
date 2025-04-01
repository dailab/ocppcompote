
import logging
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException, Body

from compote.emp.context.emp_context import get_shared_context, EMPContext
from compote.emp.emppncservice.pnc_routes import get_bearer_token

router = APIRouter()

DEFAULT_PROVISIONING_DATA = {
  "contractBegins": "2025-03-11T18:17:15Z",
  "contractEnds": "2027-03-11T18:17:15Z",
  "pcid": "HUBOpenProvCert201",
  "emaid": "DEHUBCTESTOPEN",
  "xsdMsgDefNamespace": "urn:iso:15118:20:2022:MsgDef"
}

@router.post("/generate_signed_contract_data", tags=["EMP CPS PNC Client API"])
async def get_provisioning_certificate(
        body = Body(default=DEFAULT_PROVISIONING_DATA),
        context: EMPContext = Depends(get_shared_context),
) -> Any:

    auth_token = await get_bearer_token()

    endpoint_url = (
        f"https://open.plugncharge-test.hubject.com/v1/cps/generate/signedContractData"
    )

    headers = {
        "Content-Type": "application/json",
        'Authorization': auth_token,
        "Accept": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.put(endpoint_url, json=body, headers=headers)
            logging.info(response)

        return {"message": "Generate signed contract data successful", "status_code" : response.status_code}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException

from compote.emp.context.emp_context import get_shared_context, EMPContext
from compote.emp.emppncservice.pnc_routes import get_bearer_token

router = APIRouter()

@router.post("/lookup_contract", tags=["EMP CCP PNC Client API"])
async def lookup_contract(
        emaid: str = "EMP77Open00001",
        cps_v2g_root_certificate_fingerprint: str = None,
        xsd_msg_def_namespace: str = None,
        context: EMPContext = Depends(get_shared_context),
) -> Any:

    auth_token = await get_bearer_token()

    endpoint_url = (
        f"https://open.plugncharge-test.hubject.com/v1/ccp/lookupContract/{emaid}"
    )

    param = {}
    if cps_v2g_root_certificate_fingerprint: param.update({"cpsV2GRootCertificateFingerprint": cps_v2g_root_certificate_fingerprint})
    if xsd_msg_def_namespace: param.update({"xsdMsgDefNamespace": xsd_msg_def_namespace})


    headers = {
        "Content-Type": "application/json",
        'Authorization': auth_token,
        "Accept": "application/json"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(endpoint_url, headers=headers, params=param)

        return {"message": "Lookup successful", "data": response.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/delete_signed_contract_data", tags=["EMP CCP PNC Client API"])
async def delete_signed_contract_data(
        emaid: str = "EMP77Open00001",
        cps_v2g_root_certificate_fingerprint: str = None,
        xsd_msg_def_namespace: str = None,
        x_skip_revocation: bool = False,
        context: EMPContext = Depends(get_shared_context),
) -> Any:

    auth_token = await get_bearer_token()

    endpoint_url = (
        f"https://open.plugncharge-test.hubject.com/v1/ccp/signedContractData/{emaid}"
    )

    param = {}
    if cps_v2g_root_certificate_fingerprint: param.update({"cpsV2GRootCertificateFingerprint": cps_v2g_root_certificate_fingerprint})
    if xsd_msg_def_namespace: param.update({"xsdMsgDefNamespace": xsd_msg_def_namespace})

    headers = {
        "Content-Type": "application/json",
        'Authorization': auth_token,
        "Accept": "application/json"
    }

    if x_skip_revocation: headers.update({"X-Skip-Revocation": x_skip_revocation})

    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(endpoint_url, headers=headers, params=param)

        return {"message": "Deletion successful", "data": response.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

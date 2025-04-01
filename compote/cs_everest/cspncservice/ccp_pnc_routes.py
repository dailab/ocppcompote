
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException

from compote.cs_everest.context.cs_everest_context import CSEverestContext, get_shared_context
from compote.cs_everest.cspncservice.pnc_routes import get_bearer_token

router = APIRouter()

# OEM Route
@router.post("/get_contract_by_id", tags=["OEM CCP PNC Client API"])
async def get_contract_by_id(
        pcid: str = "WMI123456712345678",
        cps_v2g_root_certificate_fingerprint: str = None,
        xsd_msg_def_namespace: str = None,
        context: CSEverestContext = Depends(get_shared_context),
) -> Any:

    auth_token = await get_bearer_token()

    endpoint_url = (
        f"https://open.plugncharge-test.hubject.com/v1/ccp/signedContractData/{pcid}"
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

# OEM Route
@router.post("/provide_signed_contract_data", tags=["OEM CCP PNC Client API"])
async def provide_signed_contract_data(
        pcid: str = "HUBOpenProvCert201",
        emaid: str = "DEHUBCTESTOPEN",
        cps_v2g_root_certificate_fingerprint: str = None,
        session_id: str = None,
        xsd_msg_def_namespace: str = None,
        context: CSEverestContext = Depends(get_shared_context),
) -> Any:

    auth_token = await get_bearer_token()

    endpoint_url = (
        f"https://open.plugncharge-test.hubject.com/v1/ccp/provideSignedContractData/{emaid}/{pcid}"
    )

    param = {}
    if cps_v2g_root_certificate_fingerprint: param.update({"cpsV2GRootCertificateFingerprint": cps_v2g_root_certificate_fingerprint})
    if session_id: param.update({"sessionID": session_id})
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
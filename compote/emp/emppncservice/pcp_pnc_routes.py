
import logging
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException

from compote.emp.context.emp_context import get_shared_context, EMPContext
from compote.emp.emppncservice.pnc_routes import get_bearer_token

router = APIRouter()

@router.post("/get_provisioning_certificate", tags=["EMP PCP PNC Client API"])
async def get_provisioning_certificate(
        pcid: str = "HUBOpenProvCert001",
        signature_algorithm: str = None,
        context: EMPContext = Depends(get_shared_context),
) -> Any:

    auth_token = await get_bearer_token()

    endpoint_url = (
        f"https://open.plugncharge-test.hubject.com/v1/oem/provCerts/{pcid}"
    )

    param = {}
    if signature_algorithm: param.update({"signatureAlgorithm": signature_algorithm})

    headers = {
        "Content-Type": "application/json",
        'Authorization': auth_token,
        "Accept": "application/json"
    }


    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(endpoint_url, headers=headers, params=param)
            logging.info(response.json())

        return {"message": "Get provisioning certificate successful", "data": response.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/lookup_vehicle", tags=["EMP PCP PNC Client API"])
async def lookup_vehicle(
        pcid: str = "HUBOpenProvCert001",
        signature_algorithm: str = None,
        xsd_msg_def_namespace: str = None,
        context: EMPContext = Depends(get_shared_context),
) -> Any:

    auth_token = await get_bearer_token()

    endpoint_url = (
        f"https://open.plugncharge-test.hubject.com/v1/oem/provCerts/lookupVehicle/{pcid}"
    )

    param = {}
    if signature_algorithm: param.update({"signatureAlgorithm": signature_algorithm})
    if xsd_msg_def_namespace: param.update({"xsdMsgDefNamespace": xsd_msg_def_namespace})


    headers = {
        "Content-Type": "application/json",
        'Authorization': auth_token,
        "Accept": "application/json"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(endpoint_url, headers=headers, params=param)

        return {"message": "Lookup successful", "data": response.status_code}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

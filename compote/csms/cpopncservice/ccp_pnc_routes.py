
import json
import logging
from typing import Any

import httpx
from fastapi import APIRouter, Depends
from compote.csms.context.csms_contextmanager import ContextManager, get_shared_context_manager
from compote.csms.cpopncservice.pnc_routes import get_bearer_token

router = APIRouter()

@router.post("/get_signed_contract_data", tags=["CPO CCP PNC Client API"])
async def get_signed_contract_data(
        exi_request: str = None,
        xsd_msg_def_namespace: str = None,
        context=None,
        context_manager: ContextManager = Depends(get_shared_context_manager),
) -> Any:

    auth_token = await get_bearer_token()

    if exi_request and xsd_msg_def_namespace:
        payload = {
            "certificateInstallationReq": exi_request,
            "xsdMsgDefNamespace": xsd_msg_def_namespace
        }
    else:
        # Test Data
        payload = {
            "certificateInstallationReq": "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",
            "xsdMsgDefNamespace": "urn:iso:15118:20:2022:MsgDef"
        }

    logging.info(payload)

    endpoint_url = (
        f"https://open.plugncharge-test.hubject.com/v1/ccp/signedContractData"
    )

    headers = {
        "Content-Type": "application/json",
        'Authorization': auth_token,
        "Accept": "application/json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, content=json.dumps(payload), headers=headers)
        logging.info(response.json())

    if response.status_code == "200":
        status_code = "Accepted"
    else:
        status_code = "Failed"

    exi_response = response.json()["CCPResponse"]["emaidContent"][0]["messageDef"]["certificateInstallationRes"]

    return {"status_code" : status_code, "exi_response" : exi_response}

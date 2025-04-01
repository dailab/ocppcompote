
import logging
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException

from compote.csms.context.csms_contextmanager import get_shared_context_manager, ContextManager
from compote.csms.cpopncservice.pnc_routes import get_bearer_token

router = APIRouter()

@router.get("/get_root_certificates", tags=["CPO RCP PNC Client API"])
async def get_root_certs(
    context_manager: ContextManager = Depends(get_shared_context_manager),
) -> Any:
    auth_token = await get_bearer_token()

    endpoint_url = (
        f"https://open.plugncharge-test.hubject.com/v1/root/rootCerts"
    )

    headers = {
        "Accept": "application/json",
        "Authorization": f"{auth_token}",
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(endpoint_url, headers=headers)
            response.raise_for_status()
            json_data = response.content

            logging.info(json_data)

            return {"message": "Root certificates fetched and saved successfully", "response" : json_data}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

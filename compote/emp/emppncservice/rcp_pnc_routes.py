
import logging
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException

from compote.emp.context.emp_context import get_shared_context, EMPContext
from compote.emp.emppncservice.pnc_routes import get_bearer_token

router = APIRouter()

@router.get("/get_root_certificates", tags=["EMP RCP PNC Client API"])
async def get_root_certs(
    context_manager: EMPContext = Depends(get_shared_context),
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

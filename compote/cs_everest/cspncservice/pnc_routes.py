
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException
from compote.cs_everest.context.cs_everest_context import CSEverestContext, get_shared_context

router = APIRouter()

@router.post("/request_bearer_token", tags=["OEM PNC Client API"])
async def get_bearer_token(
        context: CSEverestContext = Depends(get_shared_context)
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
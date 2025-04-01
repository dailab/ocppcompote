import json

from fastapi import APIRouter, Depends

from compote.cs_everest.context.cs_everest_context import CSEverestContext, get_shared_context

router = APIRouter()

@router.get("/context", tags=["Context Management"])
async def show_context(context: CSEverestContext = Depends(get_shared_context)):
    return {"data": context.data}

@router.post("/update-context", tags=["Context Management"])
async def update_context(
    key: str, value: str, context: CSEverestContext = Depends(get_shared_context)
):
    context.data[key] = value
    return {"message": "Updated successfully", "current_data": context.data}

@router.get("/connector_state/{id}", tags=["Context Management"])
async def get_connector_state(connector_id: str = None, context: CSEverestContext = Depends(get_shared_context)):
    if connector_id and connector_id in context.data["state"].keys():
        return {"state": context.data["state"][connector_id]}
    else:
        return {"state": context.data["state"]}

@router.post("/startcharging", tags=["Context Management"])
async def startcharging(

    commands: str = "sleep 1;iec_wait_pwr_ready;sleep 1;draw_power_regulated 16,3;sleep 36000",
    connector_id: int = 1,
    context: CSEverestContext = Depends(get_shared_context)
):
    await context.client.publish(f"everest_external/nodered/{connector_id}/carsim/cmd/execute_charging_session", commands)
    return {"message": "Published", "commands": commands}


@router.post("/startchargingiso15118", tags=["Context Management"])
async def startchargingiso15118(
    commands: str = "sleep 1;iso_wait_slac_matched;iso_start_v2g_session contract,AC_three_phase_core;iso_wait_pwr_ready;iso_draw_power_regulated 16,3;sleep 36000",
    connector_id: int = 1,
    context: CSEverestContext = Depends(get_shared_context)
):

    await context.client.publish(f"everest_external/nodered/{connector_id}/carsim/cmd/execute_charging_session", commands)
    return {"message": "Published", "commands": commands}

@router.post("/unplug", tags=["Context Management"])
async def unplug(
    commands: str = "unplug",
    connector_id: int = 1,
    context: CSEverestContext = Depends(get_shared_context)
):
    await context.client.publish(f"everest_external/nodered/{connector_id}/carsim/cmd/modify_charging_session", commands)
    return {"message": "Published", "commands": commands}


@router.post("/authorize", tags=["Context Management"])
async def authorize(
    token: str = "ABC12345", connector_id: int = 1, context: CSEverestContext = Depends(get_shared_context)
):
    authdict =  {"id_token": {"value": token, "type": "ISO14443"}, "authorization_type": "RFID", "prevalidated": False, "connectors": [connector_id]}
    authdict_json = json.dumps(authdict)
    await context.client.publish("everest_api/dummy_token_provider/cmd/provide", authdict_json)
    return {"message": "Published", "auth": authdict}
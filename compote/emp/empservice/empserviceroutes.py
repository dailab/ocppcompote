from typing import List, Dict

from fastapi import APIRouter, Depends

from compote.emp.context.emp_context import EMPContext, get_shared_context
from compote.shared.dataclasses import AuthIdTag, User

from compote.shared.helper_functions import log_json_sync

router = APIRouter()

@router.get("/context", tags=["Context Management"])
async def show_context(context: EMPContext = Depends(get_shared_context)):
    return {"data": context.data}

@router.post("/update-context", tags=["Context Management"])
async def update_context(
    key: str, value: str, context: EMPContext = Depends(get_shared_context)
):
    context.data[key] = value
    return {"message": "Updated successfully", "current_data": context.data}

@router.get("/authdata", tags=["Auth ID Management"])
async def get_authentication_data_records(context: EMPContext = Depends(get_shared_context)):
    return {"authentication_data_records": context.data["authentication_data_records"]}

@router.get("/users", tags=["User Management"], response_model=Dict[str,List[User]])
async def get_users(context: EMPContext = Depends(get_shared_context)):
    return {"users": context.data["config"]["users"]}

@router.post("/users/add", tags=["User Management"], response_model=Dict[str,List[User]])
async def add_id_tag(context: EMPContext = Depends(get_shared_context), user: User = None):
    context.data["config"]["users"].append(user)
    return {"users": context.data["config"]["users"]}

@router.put("/users/{user_id}", tags=["User Management"], response_model=Dict[str,List[User]])
async def modify_id_tag(context: EMPContext = Depends(get_shared_context), user_id: int = None, user: User = None):
    context.data["config"]["users"][user_id] = user
    return {"users": context.data["config"]["users"]}

@router.delete("/users/{user_id}", tags=["User Management"], response_model=Dict[str,List[User]])
async def modify_id_tag(context: EMPContext = Depends(get_shared_context), user_id: int = None):
    del context.data["config"]["users"][user_id]
    return {"users": context.data["config"]["users"]}

@router.get("/known_cs", tags=["CS Management"])
async def get_cs(context: EMPContext = Depends(get_shared_context)):
    return {"cs": context.data["cs_data"]}

@router.get("/known_cpos", tags=["CPO Management"])
async def get_cpos(context: EMPContext = Depends(get_shared_context)):
    return {"cpos": context.data["cpos"]}

@router.get("/cdrs", tags=["CDR Management"])
async def get_cdr(context: EMPContext = Depends(get_shared_context)):
    return {"cdrs": context.data["cdrs"]}

@router.get("/authorizations", tags=["Authorization Management"])
async def get_authorizations(context: EMPContext = Depends(get_shared_context)):
    return {"authorizations": context.data["authorizations"]}

@router.get("/remoteauthorizations", tags=["Authorization Management"])
async def get_remote_authorizations(context: EMPContext = Depends(get_shared_context)):
    return {"remote_authorizations": context.data["remote_authorizations"]}

@router.get("/remotereservations", tags=["Reservation Management"])
async def get_remote_reservations(context: EMPContext = Depends(get_shared_context)):
    return {"remote_reservations": context.data["remote_reservations"]}

@router.get("/evsepricing", tags=["Pricing Management"])
async def get_cdr(context: EMPContext = Depends(get_shared_context)):
    return {"evse_pricing": context.data["evse_pricing"]}

@router.get("/pricingproductdata", tags=["Pricing Management"])
async def get_cdr(context: EMPContext = Depends(get_shared_context)):
    return {"pricing_product_data": context.data["pricing_product_data"]}

@router.get("/charging_notifications", tags=["Charging Notification Management"])
async def get_cdr(context: EMPContext = Depends(get_shared_context)):
    return {"charging_notifications": context.data["charging_notifications"]}

@router.get("/log", tags=["Logs"])
async def get_log(context: EMPContext = Depends(get_shared_context)):
    log = log_json_sync(context.data["config"]["logfile_name"])
    return {"log": log}

@router.get("/currentrequest", tags=["Context Debugging"])
async def get_current_request(context: EMPContext = Depends(get_shared_context)):
    request = context.currentrequest
    return {"request": request}

@router.get("/currentresponse", tags=["Context Debugging"])
async def get_current_response(context: EMPContext = Depends(get_shared_context)):
    response = context.currentresponse
    return {"response": response}

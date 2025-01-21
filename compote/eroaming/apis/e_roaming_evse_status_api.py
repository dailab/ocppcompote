# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from compote.eroaming.apis.e_roaming_evse_status_api_base import BaseERoamingEvseStatusApi
import compote.eroaming.impl

from fastapi import (  # noqa: F401
    APIRouter,
    Body,
    Cookie,
    Depends,
    Form,
    Header,
    HTTPException,
    Path,
    Query,
    Response,
    Security,
    status,
)

from compote.eroaming.models.extra_models import TokenModel  # noqa: F401
from pydantic import Field, StrictStr
from typing_extensions import Annotated
from compote.eroaming.models.e_roaming_pull_evse_status_v21200_response import ERoamingPullEvseStatusV21200Response
from compote.eroaming.models.e_roaming_pull_evse_status_v21_request import ERoamingPullEvseStatusV21Request


router = APIRouter()

ns_pkg = compote.eroaming.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/evsepull/v21/providers/{providerID}/status-records",
    responses={
        200: {"model": ERoamingPullEvseStatusV21200Response, "description": "Expected response to a valid request"},
    },
    tags=["eRoamingEvseStatus"],
    summary="eRoamingPullEvseStatus_V2.1",
    response_model_by_alias=True,
)
async def e_roaming_pull_evse_status_v2_1(
    providerID: Annotated[StrictStr, Field(description="The id of the provider")] = Path(..., description="The id of the provider"),
    e_roaming_pull_evse_status_v21_request: ERoamingPullEvseStatusV21Request = Body(None, description=""),
) -> ERoamingPullEvseStatusV21200Response:
    """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;Mandatory&#x60;  ![Pull EVSE status](images/pullevsestatus.png)      When an EMP sends an eRoamingPullEVSEStatus request, Hubject checks whether there is a valid contract between Hubject and the EMP for the service type (EMP must be the subscriber). If so, the operation allows downloading EVSE status data from Hubject. When an EMP sends an eRoamingPullEVSEStatus request, Hubject identifies all currently valid EVSE status records of all operators.  Hubject groups all resulting EVSE status records according to the related CPO. The response structure contains an “EvseStatuses” node that envelopes an “OperatorEVSEStatus” node for every CPO with currently valid and accessible status data records. """
    if not BaseERoamingEvseStatusApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseERoamingEvseStatusApi.subclasses[0]().e_roaming_pull_evse_status_v2_1(providerID, e_roaming_pull_evse_status_v21_request)

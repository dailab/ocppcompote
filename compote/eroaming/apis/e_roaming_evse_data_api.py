# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from compote.eroaming.apis.e_roaming_evse_data_api_base import BaseERoamingEvseDataApi
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

from compote.eroaming.context.eroaming_context import ERoamingContext, get_shared_context
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_push_evse_data import ERoamingPushEvseData
from compote.eroaming.models.extra_models import TokenModel  # noqa: F401
from pydantic import Field, StrictStr
from typing_extensions import Annotated
from compote.eroaming.models.e_roaming_evse_data import ERoamingEVSEData
from compote.eroaming.models.e_roaming_pull_evse_data import ERoamingPullEVSEData


router = APIRouter()

ns_pkg = compote.eroaming.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/evsepull/v23/providers/{providerID}/data-records",
    responses={
        200: {"model": ERoamingEVSEData, "description": "Expected response to a valid request"},
    },
    tags=["eRoamingEvseData"],
    summary="eRoamingPullEvseData_V2.3",
    response_model_by_alias=True,
)
async def e_roaming_pull_evse_data_v2_3(
    providerID: Annotated[StrictStr, Field(description="The id of the provider")] = Path(..., description="The id of the provider"),
    e_roaming_pull_evse_data: ERoamingPullEVSEData = Body(None, description=""),
    context: ERoamingContext = Depends(get_shared_context)
) -> ERoamingEVSEData:
    """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;MANDATORY&#x60;  ![Pull evse data diagram](images/pullevsedata.png)  When an EMP sends an eRoamingPullEVSEData request, Hubject checks whether there is a valid contract between Hubject and the EMP for the service type (EMP must be the subscriber). If so, the operation allows downloading EVSEData from Hubject. When an EMP sends an eRoamingPullEVSEData request, Hubject identifies all currently valid EVSEData records of all operators.  For every EVSE data record Hubject identifies the timestamp of the last update, which has been performed on the record. The timestamp is returned with the attribute “lastUpdate”.  __Delta pull:__  As mentioned above, the operation by default returns all currently valid EVSE data records. However, the requesting EMP has the possibility to download only the changes (delta) compared to a certain time in the past. In order to do so, the EMP MUST provide the optional date/time field “LastCall”, indicating his last EVSE pull request. In case that Hubject receives the LastCall parameter, Hubject compares the EVSE records from the time of the last call with the currently valid records. As a result, Hubject assigns the attribute “deltaType” (possible values: insert, update, delete) to every response EVSE data record indicating whether the particular record has been inserted, updated or deleted in the meantime. EVSE data records that have not changed will not be part of the response.  Note: * The delta pull option cannot be combined with radial search, because in some cases this could lead to data inconsistency on the EMP’s side. This is why the API only allows the provision of either the attribute “SearchCenter” or “LastCall”.  __Pagination:__  Starting from OICP 2.3, eRoamingPullEvseData uses pagination. This is an implementation that EMPs &#x60;MUST&#x60; use in order to divide the amount of EvseDataRecords contained in the response of the pull request.  The parameters of the pagination are given at the end of the end point: &#x60;…​?page&#x3D;0&amp;size&#x3D;20&#x60; where &#x60;page&#x60; indicates the number of the page for the response and &#x60;size&#x60; the amount of records to be provided in the response.  Important: * __The default number of records provided in the eRoamingEvseData response is 20 elements.__ """
    if not BaseERoamingEvseDataApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseERoamingEvseDataApi.subclasses[0]().e_roaming_pull_evse_data_v2_3(providerID, e_roaming_pull_evse_data, context)

@router.post(
    "/evsepush/v23/operators/{operatorID}/data-records",
    responses={
        200: {"model": ERoamingAcknowledgment, "description": "Expected response to a valid request"},
    },
    tags=["eRoamingEvseData"],
    summary="eRoamingPushEvseData_V2.3",
    response_model_by_alias=True,
)
async def e_roaming_push_evse_data_v2_3(
    operatorID: Annotated[StrictStr, Field(description="The id of the operator")] = Path(..., description="The id of the operator"),
    e_roaming_push_evse_data: ERoamingPushEvseData = Body(None, description=""),
    context: ERoamingContext = Depends(get_shared_context)
) -> ERoamingAcknowledgment:
    """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;MANDATORY&#x60;  ![Push evse data diagram](images/pushevsedata.png)  When a CPO sends an eRoamingPushEvseData request, Hubject checks whether there is a valid contract between Hubject and the CPO for the service type (Hubject must be the subscriber). If so, the operation allows uploading EVSE data to Hubject. Furthermore, it is possible to update or delete EVSE data that has been pushed with an earlier operation request. How Hubject handles the transferred data &#x60;MUST&#x60; be defined in the request field \&quot;ActionType\&quot;, which offers four options.  The EvseData that will be inserted or updated &#x60;MUST&#x60; be provided in the OperatorEvseData field, which consists of EvseDataRecord structures. Hubject keeps a history of all updated and changed data records. Every successful push operation – irrespective of the performed action – leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of EvseData for every point in time in the past.  EVSE consistency:  EvseIDs contain the ID of the corresponding CPO (With every data upload operation Hubject checks whether the given CPO’s OperatorID or Sub-OperatorIDs if necessary) matches every given EvseID. If not, Hubject refuses the data upload and responds with the status code 018.  Note: * The eRoamingPushEvseData operation &#x60;MUST&#x60; always be used sequentially as described in Data Push Operations. """
    if not BaseERoamingEvseDataApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseERoamingEvseDataApi.subclasses[0]().e_roaming_push_evse_data_v2_3(operatorID, e_roaming_push_evse_data, context)

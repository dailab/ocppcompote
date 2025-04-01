# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from compote.eroaming.apis.e_roaming_reservation_api_base import BaseERoamingReservationApi
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
from compote.eroaming.models.extra_models import TokenModel  # noqa: F401
from pydantic import Field, StrictStr
from typing_extensions import Annotated
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_authorize_remote_reservation_start import ERoamingAuthorizeRemoteReservationStart
from compote.eroaming.models.e_roaming_authorize_remote_reservation_stop import ERoamingAuthorizeRemoteReservationStop


router = APIRouter()

ns_pkg = compote.eroaming.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/reservation/v11/providers/{providerID}/reservation-start-request",
    responses={
        200: {"model": ERoamingAcknowledgment, "description": "Expected response to a valid request"},
    },
    tags=["eRoamingReservation"],
    summary="eRoamingAuthorizeRemoteReservationStart_V1.1",
    response_model_by_alias=True,
)
async def e_roaming_authorize_remote_reservation_start_v1_1(
    providerID: Annotated[StrictStr, Field(description="The id of the provider")] = Path(..., description="The id of the provider"),
    e_roaming_authorize_remote_reservation_start: ERoamingAuthorizeRemoteReservationStart = Body(None, description=""),
    context: ERoamingContext = Depends(get_shared_context)
) -> ERoamingAcknowledgment:
    """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;OPTIONAL&#x60;   * This operation is used by EMPs in order to remotely reserve a charging point.  ![Reservation start diagram](images/reservationstart.png)  __Functional Description:__  Scenario:  A customer of an EMP wants to reserve a charging point of a CPO for a later charging process. The customer informs his EMP of his intention, e.g. via mobile phone or smart phone application. The EMP’s provider system can then initiate a reservation of the CPO’s charging point by sending an eRoamingAuthorizeRemoteReservationStart request to Hubject. The request &#x60;MUST&#x60; contain the ProviderID and the EvseID. The demanded reservation product can be specified using the field PartnerProductID.  Hubject will derive the CPO’s OperatorID from the EvseID.  Hubject will check whether there is a valid contract between the two partners for the service Reservation (EMP must be the subscriber). If so, Hubject continues with checking the charging point compatibility. In case that the CPO has uploaded at least one charging point data record, Hubject will check whether the requested EvseID is among the uploaded data. If not, Hubject will respond with the status code 603 “Unknown EvseID”. If yes, Hubject will check whether the charging spot’s property “IsHubjectCompatible” is set “true”. If the property is false, Hubject will respond with the status code 604 “EvseID is not Hubject compatible”.  In case that the requested EvseID is compatible or the CPO has not uploaded any EVSE records at all, Hubject generates a SessionID for the reservation process and forwards the request (including the SessionID) to the CPO. The CPO MUST return an eRoamingAcknowledgement message that MUST contain the result indicating whether the reservation was successful and that MAY contain a status code for further information.  In case that the CPO’s system cannot be addressed (e.g. due to technical problems), Hubject will return to the requestor a “false” result and a message indicating the connection error. """
    if not BaseERoamingReservationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseERoamingReservationApi.subclasses[0]().e_roaming_authorize_remote_reservation_start_v1_1(providerID, e_roaming_authorize_remote_reservation_start, context)


@router.post(
    "/reservation/v11/providers/{providerID}/reservation-stop-request",
    responses={
        200: {"model": ERoamingAcknowledgment, "description": "Expected response to a valid request"},
    },
    tags=["eRoamingReservation"],
    summary="eRoamingAuthorizeRemoteReservationStop_V1.1",
    response_model_by_alias=True,
)
async def e_roaming_authorize_remote_reservation_stop_v1(
    providerID: Annotated[StrictStr, Field(description="The id of the provider")] = Path(..., description="The id of the provider"),
    e_roaming_authorize_remote_reservation_stop: ERoamingAuthorizeRemoteReservationStop = Body(None, description=""),
    context: ERoamingContext = Depends(get_shared_context)
) -> ERoamingAcknowledgment:
    """__Note:__   * To &#x60;RECEIVE&#x60;   * Implementation: &#x60;OPTIONAL&#x60;  ![Reservation stop diagram](images/reservationstop.png)  eRoamingAuthorizeRemoteReservationStop basically works in the same way as eRoamingAuthorizeRemoteReservationStart. The only difference is that this request is sent in order to end the reservation of a charging spot. The request &#x60;MUST&#x60; contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeRemoteReservationStart request. After the eRoamingAuthorizeRemoteReservationStop the CPO &#x60;MUST&#x60; provide a CDR. """
    if not BaseERoamingReservationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseERoamingReservationApi.subclasses[0]().e_roaming_authorize_remote_reservation_stop_v1(providerID, e_roaming_authorize_remote_reservation_stop, context)

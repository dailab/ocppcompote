# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from compote.eroaming.apis.e_roaming_charging_notifications_api_base import BaseERoamingChargingNotificationsApi
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
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_charging_notifications_v11_request import ERoamingChargingNotificationsV11Request


router = APIRouter()

ns_pkg = compote.eroaming.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/notificationmgmt/v11/charging-notifications",
    responses={
        200: {"model": ERoamingAcknowledgment, "description": "Expected response to a valid request"},
    },
    tags=["eRoamingChargingNotifications"],
    summary="eRoamingChargingNotifications_V1.1",
    response_model_by_alias=True,
)
async def e_roaming_charging_notifications_v1_1(
    e_roaming_charging_notifications_v11_request: ERoamingChargingNotificationsV11Request = Body(None, description=""),
    context: ERoamingContext = Depends(get_shared_context)
) -> ERoamingAcknowledgment:
    """![Charging notifications diagram](images/chargingnotifications.png) The ChargingNotification feature enables CPOs to notify EMPs about the end of charge  The ChargingNotification feature basically increases the transparency between CPO - EMP - End Consumer to the level of each charging session.  This feature enables CPO to send various notifications during a single Charging Session. These notifications give the details like  1. When the charging session has started. The CPO can send ChargingNotification of type “Start” to Hubject containing information like ChargingStart, MeterStartValue, EVSEID etc.  2. Consumed Energy values during the charging process or duration of successful charging process that has lapsed. The CPO can send ChargingNotification of type “Progress” to Hubject containing information like ChargingStart, EventOccurred, ChargingDuration, ConsumedEnergyProgress, EVSEID etc. The frequency between two progress notifications for one charging session should be at least 5 minutes.  3. When the charging session has ended (because no energy is transmitted anymore). The CPO can send a ChargingNotification of type “End” to Hubject containing information such as ChargingEnd, ConsumedEnergy, EVSEID etc.  4. Error occurred before charging starts or during charging process or abrupt changing end. The CPO can send a ChargingNotification of type “Error” to Hubject containing information such as ErrorClass, ErrorAdditionalInfo, EVSEID etc.  Hubject will forward Start, Progress, End and Error notification requests to the EMP. The EMP responds with an eRoamingAcknowledgement. This acknowledgement is then being forwarded to the CPO.  This feature should cover all the notifications that could happen between Session Start and Session End in future. Each bit of information increases transparency to the customer of EMP. """
    if not BaseERoamingChargingNotificationsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseERoamingChargingNotificationsApi.subclasses[0]().e_roaming_charging_notifications_v1_1(e_roaming_charging_notifications_v11_request, context)

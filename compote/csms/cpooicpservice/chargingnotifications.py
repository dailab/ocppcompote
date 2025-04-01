
from typing import Union
from datetime import datetime

import httpx
from fastapi import APIRouter, Body

from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_charging_notification_end import \
    ERoamingChargingNotificationEnd
from compote.eroaming.models.e_roaming_charging_notification_error import \
    ERoamingChargingNotificationError
from compote.eroaming.models.e_roaming_charging_notification_progress import \
    ERoamingChargingNotificationProgress
from compote.eroaming.models.e_roaming_charging_notification_start import \
    ERoamingChargingNotificationStart

router = APIRouter()

DEFAULT_CHARGING_NOTIFICATION_START = ERoamingChargingNotificationStart(
    Type="Start",
    CPOPartnerSessionID="1234XYZ",
    EMPPartnerSessionID="2345ABC",
    ChargingStart="2020-09-23T14:17:53.038Z",
    EvseID="DE*XYZ*ETEST1",
    Identification={
        "RFIDMifareFamilyIdentification": {
            "UID": "1234ABCD"
        }
    },
    MeterValueStart=0,
    PartnerProductID="AC 1",
    SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
    SessionStart="2020-09-23T14:17:53.038Z",
    OperatorID="DE*ABC"
)

@router.post("/chargingnotificationsv11", tags=["CPO OICP Client API"])
async def eRoamingChargingNotifications_V11(
        body: Union[
            ERoamingChargingNotificationStart, ERoamingChargingNotificationProgress, ERoamingChargingNotificationEnd, ERoamingChargingNotificationError] = Body(default=DEFAULT_CHARGING_NOTIFICATION_START),
        #context_manager: ContextManager = Depends(get_shared_context_manager)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `SEND`
      * Implementation: `OPTIONAL`

    __Functional Description:__

    ![Charging notifications diagram](images/chargingnotifications.png)
    The ChargingNotification feature enables CPOs to notify EMPs about the end of charge

    The ChargingNotification feature basically increases the transparency between CPO - EMP - End Consumer to the level of each charging session.

    This feature enables CPO to send various notifications during a single Charging Session. These notifications give the details like

    1. When the charging session has started. The CPO can send ChargingNotification of type “Start” to Hubject containing information like ChargingStart, MeterStartValue, EVSEID etc.

    2. Consumed Energy values during the charging process or duration of successful charging process that has lapsed. The CPO can send ChargingNotification of type “Progress” to Hubject containing information like ChargingStart, EventOccurred, ChargingDuration, ConsumedEnergyProgress, EVSEID etc. The frequency between two progress notifications for one charging session should be at least 5 minutes.

    3. When the charging session has ended (because no energy is transmitted anymore). The CPO can send a ChargingNotification of type “End” to Hubject containing information such as ChargingEnd, ConsumedEnergy, EVSEID etc.

    4. Error occurred before charging starts or during charging process or abrupt changing end. The CPO can send a ChargingNotification of type “Error” to Hubject containing information such as ErrorClass, ErrorAdditionalInfo, EVSEID etc.

    Hubject will forward Start, Progress, End and Error notification requests to the EMP. The EMP responds with an eRoamingAcknowledgement. This acknowledgement is then being forwarded to the CPO.

    This feature should cover all the notifications that could happen between Session Start and Session End in future. Each bit of information increases transparency to the customer of EMP.

    """  # noqa


    if not body:
        request = ERoamingChargingNotificationStart(
            OperatorID="DE-ABC"
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    if "ChargingStart" in payload and isinstance(payload["ChargingStart"], datetime):
        payload["ChargingStart"] = payload["ChargingStart"].isoformat()

    if "SessionStart" in payload and isinstance(payload["SessionStart"], datetime):
        payload["SessionStart"] = payload["SessionStart"].isoformat()

    if "ChargingEnd" in payload and isinstance(payload["ChargingEnd"], datetime):
        payload["ChargingEnd"] = payload["ChargingEnd"].isoformat()

    if "SessionEnd" in payload and isinstance(payload["SessionEnd"], datetime):
        payload["SessionEnd"] = payload["SessionEnd"].isoformat()

    endpoint_url = (
       f"http://127.0.0.1:8002/oicp"
       f"/notificationmgmt/v11/charging-notifications"
    )

    async with httpx.AsyncClient() as client:
       response = await client.post(endpoint_url, json=payload)
       response.raise_for_status()

    #context_manager.currentresponse = response.json()
    return response.json()
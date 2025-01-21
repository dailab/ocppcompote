
from typing import Union
from fastapi import APIRouter, Depends

from compote.emp.context.emp_context import EMPContext, get_shared_context
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
providerId = "DE-DCB"

DEFAULT_ACK_CN = ERoamingAcknowledgment(
    Result=True,
    StatusCode={
        "AdditionalInfo": "Success",
        "Code": "000",
        "Description": "Success"
    },
    SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
    CPOPartnerSessionID="1234XYZ",
    EMPPartnerSessionID="2345ABC"
)

@router.post("/chargingnotificationsv11", tags=["EMP OICP Server API"])
async def eRoamingChargingNotifications_V11(
        body: Union[
            ERoamingChargingNotificationStart, ERoamingChargingNotificationProgress, ERoamingChargingNotificationEnd, ERoamingChargingNotificationError] = None,
        context: EMPContext = Depends(get_shared_context)
) -> ERoamingAcknowledgment:
    """
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

    context.data["charging_notifications"].append(body.dict(by_alias=True, exclude_none=True))

    response = ERoamingAcknowledgment(
        Result=True,
        StatusCode={
            "AdditionalInfo": "Success",
            "Code": "000",
            "Description": "Success"
        },
        SessionID=body.session_id,
        CPOPartnerSessionID=body.cpo_partner_session_id,
        EMPPartnerSessionID=body.emp_partner_session_id
    )

    return response
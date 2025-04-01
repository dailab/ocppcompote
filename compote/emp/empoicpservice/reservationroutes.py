from datetime import datetime

import httpx
from fastapi import APIRouter, Body, Depends

from compote.emp.context.emp_context import EMPContext, get_shared_context
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_authorize_remote_reservation_start import \
    ERoamingAuthorizeRemoteReservationStart
from compote.eroaming.models.e_roaming_authorize_remote_reservation_stop import \
    ERoamingAuthorizeRemoteReservationStop

router = APIRouter()
providerId = "DE-DCB"

DEFAULT_AUTHORIZE_REMOTE_RESERVATION_START = ERoamingAuthorizeRemoteReservationStart(
    CPOPartnerSessionID="1234XYZ",
    Duration=15,
    EMPPartnerSessionID="2345ABC",
    EvseID="DE*XYZ*ETEST1",
    Identification={
        "RFIDMifareFamilyIdentification": {
            "UID": "1234ABCD"
        },
        "QRCodeIdentification": {
            "EvcoID": "DE-DCB-C12345678-X",
            "HashedPIN": {
                "Function": "Bcrypt",
                "LegacyHashData": {
                    "Function": "MD5",
                    "Salt": "a5ghdhf73h",
                    "Value": "a5ghdhf73h"
                },
                "Value": "a5ghdhf73h"
            },
            "PIN": "1234"
        },
        "PlugAndChargeIdentification": {
            "EvcoID": "DE-DCB-C12345678-X"
        },
        "RemoteIdentification": {
            "EvcoID": "DE-DCB-C12345678-X"
        },
        "RFIDIdentification": {
            "EvcoID": "DE-DCB-C12345678-X",
            "ExpiryDate": "2021-01-23T14:23:54.228Z",
            "PrintedNumber": "9876655",
            "RFID": "mifareCls",
            "UID": "1234ABCD"
        }
    },
    PartnerProductID="Reservation",
    ProviderID="DE-DCB",
    SessionID="b2688855-7f00-0002-6d8e-48d883f6abb6"
)

DEFAULT_AUTHORIZE_REMOTE_RESERVATION_STOP = ERoamingAuthorizeRemoteReservationStop(
    EvseID="DE*XYZ*ETEST1",
    CPOPartnerSessionID="1234XYZ",
    EMPPartnerSessionID="2345ABC",
    ProviderID="DE-DCB",
    SessionID="b2688855-7f00-0002-6d8e-48d883f6abb6"
)


@router.post("/authorizeremotereservationstartv11", tags=["EMP OICP Client API"])
async def eRoamingAuthorizeRemoteReservationStart_V11(
        providerID: str = providerId,
        body: ERoamingAuthorizeRemoteReservationStart = Body(default=DEFAULT_AUTHORIZE_REMOTE_RESERVATION_START),
        context: EMPContext = Depends(get_shared_context)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `SEND`
      * Implementation: `OPTIONAL`
      * This operation is used by EMPs in order to remotely reserve a charging point.

    ![Reservation start diagram](images/reservationstart.png)

    __Functional Description:__

    Scenario:

    A customer of an EMP wants to reserve a charging point of a CPO for a later charging process.
    The customer informs his EMP of his intention, e.g. via mobile phone or smart phone application.
    The EMP’s provider system can then initiate a reservation of the CPO’s charging point by sending an eRoamingAuthorizeRemoteReservationStart request to Hubject.
    The request `MUST` contain the ProviderID and the EvseID.
    The demanded reservation product can be specified using the field PartnerProductID.

    Hubject will derive the CPO’s OperatorID from the EvseID.

    Hubject will check whether there is a valid contract between the two partners for the service Reservation (EMP must be the subscriber). If so, Hubject continues with checking the charging point compatibility. In case that the CPO has uploaded at least one charging point data record, Hubject will check whether the requested EvseID is among the uploaded data. If not, Hubject will respond with the status code 603 “Unknown EvseID”. If yes, Hubject will check whether the charging spot’s property “IsHubjectCompatible” is set “true”. If the property is false, Hubject will respond with the status code 604 “EvseID is not Hubject compatible”.

    In case that the requested EvseID is compatible or the CPO has not uploaded any EVSE records at all, Hubject generates a SessionID for the reservation process and forwards the request (including the SessionID) to the CPO. The CPO MUST return an eRoamingAcknowledgement message that MUST contain the result indicating whether the reservation was successful and that MAY contain a status code for further information.

    In case that the CPO’s system cannot be addressed (e.g. due to technical problems), Hubject will return to the requestor a “false” result and a message indicating the connection error.

    """  # noqa

    if not body:
        request = ERoamingAuthorizeRemoteReservationStart(
            ProviderID = providerID or context.data["providerId"],
            Identification = context.data.authentication_data_records[0],
            EvseID = "DE*XYZ*ETEST1"
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    context.currentrequest = payload

    endpoint_url = (
        f"{context.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/reservation/v11/providers/{context.data['providerId']}/reservation-start-request"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context.currentresponse = response.json()

    if response.json()["StatusCode"]["Code"] == "000":
        context.data["remote_reservations"].append(payload)

    return response.json()

@router.post("/authorizeremotereservationstopv1", tags=["EMP OICP Client API"])
async def eRoamingAuthorizeRemoteReservationStop_V1(
        providerID: str = providerId,
        body: ERoamingAuthorizeRemoteReservationStop = Body(default=DEFAULT_AUTHORIZE_REMOTE_RESERVATION_STOP),
        context: EMPContext = Depends(get_shared_context)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `RECEIVE`
      * Implementation: `OPTIONAL`

    ![Reservation stop diagram](images/reservationstop.png)

    eRoamingAuthorizeRemoteReservationStop basically works in the same way as eRoamingAuthorizeRemoteReservationStart.
    The only difference is that this request is sent in order to end the reservation of a charging spot.
    The request `MUST` contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeRemoteReservationStart request.
    After the eRoamingAuthorizeRemoteReservationStop the CPO `MUST` provide a CDR.

    """  # noqa

    if not body:
        request = ERoamingAuthorizeRemoteReservationStop(
            ProviderID = providerID or context.data["providerId"],
            EvseID = "DE*XYZ*ETEST1",
            SessionID = "b2688855-7f00-0002-6d8e-48d883f6abb6"
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    context.currentrequest = payload

    endpoint_url = (
        f"{context.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/reservation/v11/providers/{context.data['providerId']}/reservation-stop-request"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context.currentresponse = response.json()
    return response.json()


from fastapi import APIRouter, Body, Depends

from compote.csms.context.csms_contextmanager import ContextManager, get_shared_context_manager
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_authorize_remote_reservation_start import \
    ERoamingAuthorizeRemoteReservationStart
from compote.eroaming.models.e_roaming_authorize_remote_reservation_stop import \
    ERoamingAuthorizeRemoteReservationStop

router = APIRouter()

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

@router.post("/authorizeremotereservationstartv11", tags=["CPO OICP Server API"])
async def eRoamingAuthorizeRemoteReservationStart_V11(
        operatorID: str = None,
        body: ERoamingAuthorizeRemoteReservationStart = Body(default=DEFAULT_AUTHORIZE_REMOTE_RESERVATION_START),
        context_manager: ContextManager = Depends(get_shared_context_manager)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `RECEIVE`
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

    context_manager.data["remote_reservations"].append(body)

    await context_manager.dispatch_authorize_remote_reservation_start(body.evse_id, body.identification)

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

@router.post("/authorizeremotereservationstopv1", tags=["CPO OICP Server API"])
async def eRoamingAuthorizeRemoteReservationStop_V1(
        operatorID: str = None,
        body: ERoamingAuthorizeRemoteReservationStop = Body(default=DEFAULT_AUTHORIZE_REMOTE_RESERVATION_STOP),
        context_manager: ContextManager = Depends(get_shared_context_manager)
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

    context_manager.data["remote_reservations"].append(body)

    await context_manager.dispatch_authorize_remote_reservation_stop(body.evse_id)

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

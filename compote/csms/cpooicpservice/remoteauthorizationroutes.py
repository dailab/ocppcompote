
from fastapi import APIRouter, Body, Depends

from compote.csms.context.csms_contextmanager import ContextManager, get_shared_context_manager
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_authorize_remote_start import \
    ERoamingAuthorizeRemoteStart
from compote.eroaming.models.e_roaming_authorize_remote_stop import \
    ERoamingAuthorizeRemoteStop

router = APIRouter()

DEFAULT_AUTHORIZE_REMOTE_STOP_DATA = ERoamingAuthorizeRemoteStop(
    CPOPartnerSessionID="1234XYZ",
    EMPPartnerSessionID="2345ABC",
    ProviderID="DE-DCB",
    SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
    EvseID="DE*XYZ*ETEST1"
)

DEFAULT_AUTHORIZE_REMOTE_START_DATA = ERoamingAuthorizeRemoteStart(
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
                    "Salt": "string",
                    "Value": "string123456"
                },
                "Value": "string123456"
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
            "ExpiryDate": "2021-01-23T14:21:36.954Z",
            "PrintedNumber": "9876655",
            "RFID": "mifareCls",
            "UID": "1234ABCD"
        }
    },
    CPOPartnerSessionID="1234XYZ",
    EMPPartnerSessionID="2345ABC",
    ProviderID="DE-DCB",
    SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
    PartnerProductID="AC 1",
    EvseID="DE*XYZ*ETEST1"
)

DEFAULT_AUTHORIZE_REMOTE_STOP_DATA = ERoamingAuthorizeRemoteStop(
    CPOPartnerSessionID="1234XYZ",
    EMPPartnerSessionID="2345ABC",
    ProviderID="DE-DCB",
    SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
    EvseID="DE*XYZ*ETEST1"
)

@router.post("/authorizeremotestartv21", tags=["CPO OICP Server API"])
async def eRoamingAuthorizeRemoteStart_v21(
            operatorID: str = None,
            body: ERoamingAuthorizeRemoteStart = Body(default=DEFAULT_AUTHORIZE_REMOTE_START_DATA),
            context_manager: ContextManager = Depends(get_shared_context_manager)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `RECEIVE`
      * Implementation: `MANDATORY`
      * This operation is used by EMPs in order to remotely start a charging process

    The service that is offered by Hubject in order to allow customers to directly start a charging process via mobile app.

    ![Remote start diagram](images/remotestart.png)


    __Functional Description:__

    __Scenario:__

    A customer of an EMP wants to charge a vehicle at a charging station of a CPO. The customer informs his EMP of his intention, e.g. via mobile phone or smart phone application. The EMP’s provider system can then initiate a charging process at the CPO’s charging station by sending an eRoamingAuthorizeRemoteStart request to Hubject. The request `MUST` contain the ProviderID and the EvseID.

    Hubject will derive the CPO’s OperatorID from the EvseID.

    Hubject will check whether there is a valid contract between the two partners for the service (EMP must be the subscriber). If so, Hubject continues with checking the charging point compatibility. In case that the CPO has uploaded at least one charging point data record, Hubject will check whether the requested EvseID is among the uploaded data. If not, Hubject will respond with the status code 603 “Unknown EvseID”. If yes, Hubject will check whether the charging spot’s property “IsHubjectCompatible” is set “true”. If the property is false, Hubject will respond with the status code 604 “EvseID is not Hubject compatible”.

    In case that the requested EvseID is compatible or the CPO has not uploaded any EVSE records at all, Hubject generates a SessionID for the following process and forwards the request (including the SessionID) to the CPO. The CPO `MUST` return an eRoamingAcknowledgement message that `MUST` contain the result indicating whether the charging process will be started and that `MAY` contain a status code for further information.

    In case that the CPO’s system cannot be addressed (e.g. due to technical problems), Hubject will return to the requestor a “false” result and a message indicating the connection error.

    Best Practices:
      * Please ensure a request run time of under 10 seconds including network roundtrip.

    """  # noqa

    #logging.INFO()
    context_manager.data["remote_authorizations"].append(body)
    await context_manager.dispatch_authorize_remote_start(body.evse_id, body.identification)

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


@router.post("/authorizeremotestopv21", tags=["CPO OICP Server API"])
async def eRoamingAuthorizeRemoteStop_v21(
            externalID: str = None,
            body: ERoamingAuthorizeRemoteStop = Body(default=DEFAULT_AUTHORIZE_REMOTE_STOP_DATA),
            context_manager: ContextManager = Depends(get_shared_context_manager)
    ) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `RECEIVE`
      * Implementation: `MANDATORY`

    ![Remote stop diagram](images/remotestop.png)

    eRoamingAuthorizeRemoteStop basically works in the same way as eRoamingAuthorizeRemoteStart. The only difference is that this request is sent in order to initiate the stopping of a charging process. The request `MUST` contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeRemoteStart request.

    """  # noqa

    await context_manager.dispatch_authorize_remote_stop(body.evse_id)

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
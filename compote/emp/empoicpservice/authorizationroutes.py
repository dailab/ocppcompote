import uuid

from fastapi import APIRouter, Depends

from compote.emp.context.emp_context import EMPContext, get_shared_context
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_authorization_start import ERoamingAuthorizationStart
from compote.eroaming.models.e_roaming_authorization_stop import ERoamingAuthorizationStop
from compote.eroaming.models.e_roaming_authorize_remote_stop import \
    ERoamingAuthorizeRemoteStop
from compote.eroaming.models.e_roaming_authorize_start import ERoamingAuthorizeStart
from compote.eroaming.models.e_roaming_authorize_stop import ERoamingAuthorizeStop
from compote.eroaming.models.e_roaming_charge_detail_records import \
    ERoamingChargeDetailRecord
from compote.eroaming.models.e_roaming_get_charge_detail_records import \
    ERoamingGetChargeDetailRecords

router = APIRouter()
providerId = "DE-DCB"

# DEFAULT_AUTHORIZE_START_DATA = ERoamingAuthorizeStart(
#     Identification={
#         "RFIDMifareFamilyIdentification": {
#             "UID": "1234ABCD"
#         },
#         "QRCodeIdentification": {
#             "EvcoID": "DE-DCB-C12345678-X",
#             "HashedPIN": {
#                 "Function": "Bcrypt",
#                 "LegacyHashData": {
#                     "Function": "MD5",
#                     "Salt": "string",
#                     "Value": "string123456"
#                 },
#                 "Value": "string123456"
#             },
#             "PIN": "1234"
#         },
#         "PlugAndChargeIdentification": {
#             "EvcoID": "DE-DCB-C12345678-X"
#         },
#         "RemoteIdentification": {
#             "EvcoID": "DE-DCB-C12345678-X"
#         },
#         "RFIDIdentification": {
#             "EvcoID": "DE-DCB-C12345678-X",
#             "ExpiryDate": "2021-01-23T14:21:36.954Z",
#             "PrintedNumber": "9876655",
#             "RFID": "mifareCls",
#             "UID": "1234ABCD"
#         }
#     },
#     CPOPartnerSessionID="1234XYZ",
#     EMPPartnerSessionID="2345ABC",
#     ProviderID="DE-DCB",
#     SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
#     PartnerProductID="AC 1",
#     EvseID="DE*XYZ*ETEST1"
# )

DEFAULT_AUTHORIZATION_START = ERoamingAuthorizationStart(
    AuthorizationStatus="Authorized",
    AuthorizationStopIdentifications=[
        {
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
        }
    ],
    CPOPartnerSessionID="1234XYZ",
    EMPPartnerSessionID="2345ABC",
    ProviderID="DE-DCB",
    SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
    StatusCode={
        "AdditionalInfo": "Success",
        "Code": "000",
        "Description": "string"
    }
)

DEFAULT_AUTHORIZATION_STOP = ERoamingAuthorizationStop(
    AuthorizationStatus="Authorized",
    AuthorizationStopIdentifications=[
        {
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
        }
    ],
    CPOPartnerSessionID="1234XYZ",
    EMPPartnerSessionID="2345ABC",
    ProviderID="DE-DCB",
    SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
    StatusCode={
        "AdditionalInfo": "Success",
        "Code": "000",
        "Description": "string"
    }
)


DEFAULT_AUTHORIZE_REMOTE_STOP_DATA = ERoamingAuthorizeRemoteStop(
    CPOPartnerSessionID="1234XYZ",
    EMPPartnerSessionID="2345ABC",
    ProviderID="DE-DCB",
    SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
    EvseID="DE*XYZ*ETEST1"
)

DEFAULT_CDR_REQUEST = ERoamingGetChargeDetailRecords(
    CDRForwarded=False,
    From="2020-08-23T14:20:10.285Z",
    OperatorID="DE*ABC",
    ProviderID="DE-DCN",
    To="2020-09-23T14:20:10.285Z",
    SessionID=[
        "f98efba4-02d8-4fa0-b810-9a9d50d2c527"
    ]
)

DEFAULT_ACK_CDR_RECORD = ERoamingAcknowledgment(
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

@router.post("/authorizestartv21", tags=["EMP OICP Server API"])
async def eRoamingAuthorizeStart_v21(
        body: ERoamingAuthorizeStart,
        operatorID: str,
        context: EMPContext = Depends(get_shared_context)
) -> ERoamingAuthorizationStart:
    """
    __Note:__
      * To `RECEIVE`
      * Implementation: `MANDATORY`

    __Functional Description:__

    Scenario:

    A customer of an EMP wants to charge a vehicle at a charging point of a CPO. The customer authenticates at the charging point. The CPO’s operator system does not recognize the customer’s authentication data. In order to authorize the charging process, the CPO’s system can send an eRoamingAuthorizeStart request to Hubject. The request MUST contain the OperatorID and the identification data (e.g. UID or EvcoID) and MAY contain the EvseID.

    Hubject generates a SessionID for the charging process and persists important session data (SessionID, EvseID, identification data).

    Regarding the further service processing, there are three different options:

    a. Hubject first tries to authorize the customer offline by checking authentication master data. Authentication data can be uploaded by EMPs using the eRoamingAuthenticationData service.
    ![Authorize Start offline diagram](images/authorizestart_offline.png)

    b. In case offline authorization is not possible, Hubject tries to derive the EMP from the provided identification data. QR Code and Plug&amp;Charge identification data contain the EvcoID. Hubject can derive the EMP’s ProviderID from the EvcoID. Hubject will directly forward eRoamingAuthorizeStart requests to the EMP. The EMP provider system checks the requested authentication data and responds accordingly, either by authorizing or not authorizing the request. The response `MUST` contain the ProviderID and the AuthorizationStatus and `MAY` contain a list of identification data that is authorized to stop the charging process. In case that the EMP provider system cannot be addressed (e.g. due to technical problems), the corresponding provider will be dealt with as if responding “NotAuthorized”.
    ![Authorize evco diagram](images/authorize_evco.png)

    c. In case that Hubject cannot derive the EMP from the identification data (e.g. with RFID identification), Hubject identifies all EMPs that are under contract with the CPO (EMPs must be the service subscriber) and forwards the eRoamingAuthorizeStart request to all these EMPs (broadcast). Hubject consolidates all EMP responses and creates an overall response, authorizing the request in case that one EMP authorized the request.

    ![Authorize Start online diagram](images/authorizestart_online.png)

    In case that the request for authorization was not successful, Hubject deletes the corresponding SessionID for the charging process.

    The response from Hubject to the CPO contains authorization details and in case of successful authorization the created SessionID and the ProviderID of the authorizing provider.

    """  # noqa

    authorizations = context.data.setdefault("authorizations", [])

    session_id = body.session_id
    cpo_session_id = body.cpo_partner_session_id
    emp_session_id = body.emp_partner_session_id
    provider_id = body.provider_id or context.data["providerId"]

    uid = None
    if (body.identification
        and body.identification.rfid_mifare_family_identification
        and body.identification.rfid_mifare_family_identification.uid):
        uid = body.identification.rfid_mifare_family_identification.uid

    recognized_uids = set()
    for record in context.data.get("authentication_data_records", []):
        identification = record.get("Identification", {})

        if "RFIDMifareFamilyIdentification" in identification:
            recognized_uids.add(identification["RFIDMifareFamilyIdentification"]["UID"])

        if "RFIDIdentification" in identification:
            recognized_uids.add(identification["RFIDIdentification"]["UID"])

    if uid and uid in recognized_uids:
        # Authorized
        authorizations.append({
            "session_id": session_id,
            "cpo_partner_session_id": cpo_session_id,
            "emp_partner_session_id": emp_session_id,
            "identification": body.identification.dict(exclude_unset=True),
            "operator_id": operatorID,
        })

        auth_stop_identifications = [
            {
                "RFIDMifareFamilyIdentification": {
                    "UID": uid
                }
            }
        ]

        response = ERoamingAuthorizationStart(
            AuthorizationStatus="Authorized",
            AuthorizationStopIdentifications=auth_stop_identifications,
            CPOPartnerSessionID=cpo_session_id,
            EMPPartnerSessionID=emp_session_id,
            ProviderID=provider_id,
            SessionID=session_id,
            StatusCode={
                "Code": "000",
                "Description": "Authorized",
                "AdditionalInfo": "UID recognized"
            }
        )
    else:
        # Not authorized or no UID provided
        response = ERoamingAuthorizationStart(
            AuthorizationStatus="NotAuthorized",
            AuthorizationStopIdentifications=[],
            CPOPartnerSessionID=cpo_session_id,
            EMPPartnerSessionID=emp_session_id,
            ProviderID=provider_id,
            SessionID=session_id,
            StatusCode={
                "Code": "201",
                "Description": "NotAuthorized",
                "AdditionalInfo": f"UID {uid} not recognized or missing"
            }
        )

    return response


@router.post("/authorizestopv21", tags=["EMP OICP Server API"])
async def eRoamingAuthorizeStop_V21(
        body: ERoamingAuthorizeStop,
        operatorID: str,
        context: EMPContext = Depends(get_shared_context)
) -> ERoamingAuthorizationStop:
    """
    __Note:__
      * To `RECEIVE`
      * Implementation: `OPTIONAL`

    ![Authorize stop diagram](images/authorizestop.png)

    eRoamingAuthorizeStop basically works in a similar way to the operation eRoamingAuthorizeStart.
    The request is sent in order to authorize the stopping of a charging process.
    The request `MUST` contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeStart request.
    In most cases, Hubject can derive the EMP that authorized the charging process from the SessionID and can directly and offline authorize the request or forward the request for stopping to the EMP.
    In case the charging session was originally authorized offline by the HBS, the session `MUST` only be stopped with the same medium, which was used for starting the session

    """  # noqa

    authorizations = context.data.get("authorizations", [])
    matching_auth = next(
        (item for item in authorizations if item["session_id"] == body.session_id),
        None
    )

    if not matching_auth:
        return ERoamingAuthorizationStop(
            AuthorizationStatus="NotAuthorized",
            AuthorizationStopIdentifications=[],
            CPOPartnerSessionID=body.cpo_partner_session_id,
            EMPPartnerSessionID=body.emp_partner_session_id,
            ProviderID=context.data["providerId"],
            SessionID=body.session_id,
            StatusCode={
                "Code": "400",
                "Description": "Session not found or invalid",
                "AdditionalInfo": "No active authorization for given SessionID"
            }
        )

    # Matching authorization exists for SessionID
    used_identification = matching_auth["identification"]
    response = ERoamingAuthorizationStop(
        AuthorizationStatus="Authorized",
        AuthorizationStopIdentifications=[used_identification],
        CPOPartnerSessionID=body.cpo_partner_session_id,
        EMPPartnerSessionID=body.emp_partner_session_id,
        ProviderID=context.data["providerId"],
        SessionID=body.session_id,
        StatusCode={
            "AdditionalInfo": "Success",
            "Code": "000",
            "Description": "Authorization for stopping is granted."
        }
    )

    # TODO Remove the session from `authorizations`
    # authorizations.remove(matching_auth)

    return response


@router.post("/chargedetailrecordv22", tags=["EMP OICP Server API"])
async def eRoamingChargeDetailRecord_V22(
        body: ERoamingChargeDetailRecord,
        operatorID: str,
        context: EMPContext = Depends(get_shared_context)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `RECEIVE`
      * Implementation: `MANDATORY`

    ![Charge Detail Record diagram](images/cdr.png)

    __Functional Description:__

    Scenario:

    A customer of an EMP has charged a vehicle at a charging station of a CPO. The charging process was started with an eRoamingAuthorizeStart or an eRoamingAuthorizeRemoteStart operation. The process may have been stopped with an eRoamingAuthorizeStop or an eRoamingAuthorizeRemoteStop operation. A preceding stop request is not a necessary precondition for the processing of an eRoamingChargeDetailRecord request. The CPO’s provider system `MUST` send an eRoamingChargeDetailRecord (CDR) after the end of the charging process in order to inform the EMP of the charging session data (e.g. meter values and consumed energy) and further charging process details.

    Note:

    The CPO `MUST` provide the same SessionID that was assigned to the corresponding charging process. Based on this information Hubject will be able to assign the session data to the correct process.

    Hubject will identify the receiving EMP and will forward the CDR to the corresponding EMP. The EMP `MUST` return an eRoamingAcknowledgement message that `MUST` contain the result indicating whether the session data was received successfully and that `MAY` contain a status code for further information.

    Hubject will accept only one CDR per SessionID.

    In addition to forwarding the CDR to the EMP, Hubject also stores the CDR. In case that the recipient provider’s system cannot be addressed (e.g. due to technical problems), Hubject will nevertheless return to the requestor a positive result provided that storing the CDR was successful.

    """  # noqa

    context.data["cdrs"].append(body.dict(by_alias=True, exclude_none=True))

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
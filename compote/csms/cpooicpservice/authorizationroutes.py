
from datetime import datetime

import httpx
from fastapi import APIRouter, Depends, Body

from compote.csms.context.csms_contextmanager import ContextManager, get_shared_context_manager
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_authorization_start import ERoamingAuthorizationStart
from compote.eroaming.models.e_roaming_authorization_stop import ERoamingAuthorizationStop
from compote.eroaming.models.e_roaming_authorize_remote_stop import \
    ERoamingAuthorizeRemoteStop
from compote.eroaming.models.e_roaming_authorize_start import ERoamingAuthorizeStart
from compote.eroaming.models.e_roaming_authorize_stop import ERoamingAuthorizeStop
from compote.eroaming.models.e_roaming_charge_detail_records import \
    ERoamingChargeDetailRecord

router = APIRouter()

DEFAULT_AUTHORIZE_START_DATA = ERoamingAuthorizeStart(
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
    OperatorID="DE*ABC",
    SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
    PartnerProductID="AC 1",
    EvseID="DE*XYZ*ETEST1"
)

DEFAULT_AUTHORIZE_STOP_DATA = ERoamingAuthorizeStop(
    CPOPartnerSessionID="1234XYZ",
    EMPPartnerSessionID="2345ABC",
    OperatorID="DE*ABC",
    SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
    EvseID="DE*XYZ*ETEST1",
    PartnerProductID="AC 1",
    Identification = {
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
)

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

DEFAULT_CDR_RECORD = ERoamingChargeDetailRecord(
  CalibrationLawVerificationInfo = {
    "CalibrationLawCertificateID": "CD-12BD-2783T",
    "PublicKey": "a9sdh839alskldh/WEDjaskdjis20ij2wdpasodpjlkofi3ed3ed",
    "MeteringSignatureUrl": "http://www.meteringexample1234.com",
    "MeteringSignatureEncodingFormat": "UTF-8",
    "SignedMeteringValuesVerificationInstruction": "please follow instructions provided in the mentioned URL"
  },
  CPOPartnerSessionID = "1234XYZ",
  ChargingEnd = "2020-09-23T14:17:53.038Z",
  ChargingStart = "2020-09-23T14:17:53.038Z",
  ConsumedEnergy =10,
  EMPPartnerSessionID = "9876655",
  EvseID = "DE*XYZ*ETEST1",
  HubOperatorID = "DE*ABC",
  HubProviderID = "DE-DCB",
  Identification = {
    "PlugAndChargeIdentification": {
      "EvcoID": "DE-DCB-C12345678-X"
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
    "RFIDIdentification": {
      "EvcoID": "DE-DCB-C12345678-X",
      "ExpiryDate": "2021-01-23T14:17:53.039Z",
      "PrintedNumber": "9876655",
      "RFID": "mifareCls",
      "UID": "1234ABCD"
    },
    "RFIDMifareFamilyIdentification": {
      "UID": "1234ABCD"
    },
    "RemoteIdentification": {
      "EvcoID": "DE-DCB-C12345678-X"
    }
  },
  MeterValueEnd = 10,
  MeterValueInBetween = {
    "meterValues": [
      10
    ]
  },
  MeterValueStart = 0,
  SignedMeteringValues = [
    {
      "SignedMeteringValue": "AAAAAAAAAAAAAAABasdno2e89d2ekasdeBBBBBBBBBBBBBBBBCCCCCCCCC23423BBBBBBBBBBBBBAS",
      "MeteringStatus": "Start"
    },
    {
      "SignedMeteringValue": "AAAAAAAAAAAAAAABBBBdaskjhadksiqwd2309nede9owineBBBBBBBBBBBBBCCCCCCCCC23423BBBBBBBBBBBBBAS",
      "MeteringStatus": "End"
    }
  ],
  PartnerProductID = "AC 1",
  SessionEnd = "2020-09-23T14:17:53.039Z",
  SessionID = "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
  SessionStart = "2020-09-23T14:17:53.039Z"
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

@router.post("/authorizestartv21", tags=["CPO OICP Client API"])
async def eRoamingAuthorizeStart_v21(
        operatorID: str,
        body: ERoamingAuthorizeStart = Body(default=DEFAULT_AUTHORIZE_START_DATA),
        context_manager: ContextManager = Depends(get_shared_context_manager)
) -> ERoamingAuthorizationStart:
    """
    __Note:__
      * To `SEND`
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

    __Pin Security:__

    The eRoamingAuthorizeStart request contains one of the defined identification types (see IdentificationType). The identification type “QRCodeIdentificationType” (see QRCodeIdentificationType) contains - besides the “EvcoID” field - a “PIN” field or a “HashedPIN” field (only one of the two options must be provided).

    For security reasons and as a general rule, Hubject does not store PINs in clear text, but always as encrypted hash values. In order to prevent hashed PIN values that may have been picked illegally from being used to request the authorization for charging processes, the PIN value `MUST` always be provided in clear text within the eRoamingAuthorizeStart request. This means that this operation `MUST` always provide the “PIN” field (clear text). Hubject will always generate a hash value of the provided PIN before checking the offline authentication data. So, in case that a PIN is provided by mistake as hashed value, Hubject automatically generates a hash of a hash, which eventually leads to a denial of authorization

    In order to create hash values, Hubject applies the hash algorithm that the EMP has assigned to the QR Code identification record

    """  # noqa

    if not body:
        request = ERoamingAuthorizeStart(
            OperatorID = operatorID,
            Identification={
                "RFIDMifareFamilyIdentification": {
                    "UID": "1234ABCD"
                }
            }
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    context_manager.currentrequest = payload

    endpoint_url = (
        f"{context_manager.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/charging/v21/operators/{context_manager.config['operatorId']}/authorize/start"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context_manager.data["authorizations"].append(response.json())
    context_manager.currentresponse = response.json()

    return response.json()


@router.post("/authorizestopv21", tags=["CPO OICP Client API"])
async def eRoamingAuthorizeStop_v21(
        operatorID: str = None,
        body: ERoamingAuthorizeStop = Body(default=DEFAULT_AUTHORIZE_STOP_DATA),
        context_manager: ContextManager = Depends(get_shared_context_manager)
) -> ERoamingAuthorizationStop:
    """
    __Note:__
      * To `SEND`
      * Implementation: `OPTIONAL`

    ![Authorize stop diagram](images/authorizestop.png)

    eRoamingAuthorizeStop basically works in a similar way to the operation eRoamingAuthorizeStart.
    The request is sent in order to authorize the stopping of a charging process.
    The request `MUST` contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeStart request.
    In most cases, Hubject can derive the EMP that authorized the charging process from the SessionID and can directly and offline authorize the request or forward the request for stopping to the EMP.
    In case the charging session was originally authorized offline by the HBS, the session `MUST` only be stopped with the same medium, which was used for starting the session

    """  # noqa

    if not body:
        request = ERoamingAuthorizeStop(
            OperatorID = operatorID,
            SessionID = "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
            Identification={
                "RFIDMifareFamilyIdentification": {
                    "UID": "1234ABCD"
                }
            }
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    context_manager.currentrequest = payload

    endpoint_url = (
        f"{context_manager.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/charging/v21/operators/{context_manager.config['operatorId']}/authorize/stop"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context_manager.currentresponse = response.json()

    return response.json()


@router.post("/chargedetailrecordv22", tags=["CPO OICP Client API"])
async def eRoamingChargeDetailRecord_V22(
        operatorID: str,
        body: ERoamingChargeDetailRecord = Body(default=DEFAULT_CDR_RECORD),
        context_manager: ContextManager = Depends(get_shared_context_manager)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `SEND`
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

    Note:

    Please note that in case of EMP role this part of the URL '/api/oicp/cdrmgmt/v21/operators/{operatorID}/charge-detail-record' will be added to your URL endpoint when sending the request through our HBS platform.

    """  # noqa

    if not body:
        request = DEFAULT_CDR_RECORD
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()
    if "ChargingStart" in payload and isinstance(payload["ChargingStart"], datetime):
        payload["ChargingStart"] = payload["ChargingStart"].isoformat()
    if "ChargingEnd" in payload and isinstance(payload["ChargingEnd"], datetime):
        payload["ChargingEnd"] = payload["ChargingEnd"].isoformat()
    if "SessionStart" in payload and isinstance(payload["SessionStart"], datetime):
        payload["SessionStart"] = payload["SessionStart"].isoformat()
    if "SessionEnd" in payload and isinstance(payload["SessionEnd"], datetime):
        payload["SessionEnd"] = payload["SessionEnd"].isoformat()

    context_manager.currentrequest = payload

    endpoint_url = (
        f"{context_manager.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/cdrmgmt/v22/operators/{context_manager.config['operatorId']}/charge-detail-record"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context_manager.currentresponse = response.json()

    return response.json()
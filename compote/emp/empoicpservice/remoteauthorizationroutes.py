from datetime import datetime

import httpx
from fastapi import APIRouter, Body, Depends

from compote.emp.context.emp_context import EMPContext, get_shared_context
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_authorize_remote_start import \
    ERoamingAuthorizeRemoteStart
from compote.eroaming.models.e_roaming_authorize_remote_stop import \
    ERoamingAuthorizeRemoteStop
from compote.eroaming.models.e_roaming_charge_detail_records import \
    ERoamingChargeDetailRecords
from compote.eroaming.models.e_roaming_get_charge_detail_records import \
    ERoamingGetChargeDetailRecords

router = APIRouter()
providerId = "DE-DCB"

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

@router.post("/authorizeremotestartv21", tags=["EMP OICP Client API"])
async def eRoamingAuthorizeRemoteStart_v21(
            body: ERoamingAuthorizeRemoteStart = Body(default=DEFAULT_AUTHORIZE_REMOTE_START_DATA),
            providerID: str = providerId,
            context: EMPContext = Depends(get_shared_context)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `SEND`
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

    if not body:
        request = ERoamingAuthorizeRemoteStart(
            ProviderID = providerID or context.data["providerId"],
            Identification = context.data["authentication_data_records"][0]["Identification"],
            EvseID = "DE*XYZ*ETEST1",
            SessionID = "f98efba4-02d8-4fa0-b810-9a9d50d2c527"
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    context.currentrequest = payload

    endpoint_url = (
        f"{context.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/charging/v21/providers/{context.data['providerId']}/authorize-remote/start"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context.currentresponse = response.json()

    if response.json()["StatusCode"]["Code"] == "000":
        context.data["remote_authorizations"].append(payload)

    return response.json()


@router.post("/authorizeremotestopv21", tags=["EMP OICP Client API"])
async def eRoamingAuthorizeRemoteStop_v21(
            body: ERoamingAuthorizeRemoteStop = Body(default=DEFAULT_AUTHORIZE_REMOTE_STOP_DATA),
            externalID: str = providerId,
            context: EMPContext = Depends(get_shared_context)
    ) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `SEND`
      * Implementation: `MANDATORY`

    ![Remote stop diagram](images/remotestop.png)

    eRoamingAuthorizeRemoteStop basically works in the same way as eRoamingAuthorizeRemoteStart. The only difference is that this request is sent in order to initiate the stopping of a charging process. The request `MUST` contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeRemoteStart request.

    """  # noqa

    if not body:
        request = ERoamingAuthorizeRemoteStop(
            ProviderID=context.data["providerId"],
            SessionID="f98efba4-02d8-4fa0-b810-9a9d50d2c527",
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
        f"/charging/v21/providers/{externalID}/authorize-remote/stop"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context.currentresponse = payload
    return response.json()

@router.post("/getchargedetailrecordsv22", tags=["EMP OICP Client API"])
async def eRoamingGetChargeDetailRecords_V22(
            body: ERoamingGetChargeDetailRecords = Body(default=DEFAULT_CDR_REQUEST),
            providerID: str = providerId,
            context: EMPContext = Depends(get_shared_context)
    ) -> ERoamingChargeDetailRecords:
    """
    __Note:__
      * To `SEND`
      * Implementation: EMP Online `OPTIONAL`, EMP Offline `MANDATORY`

    ![Get Charge Detail Records diagram](images/getcdr.png)

    The operation allows EMPs to download CDRs that have been sent to Hubject by partner CPOs. This means if for example Hubject was unable to forward a CDR from a CPO to an EMP due to technical problems in the EMP’s backend, the EMP will still have the option of obtaining these CDRs. The EMP `MUST` specify a date range in the request. Hubject will return a list of all CDRs received by the HBS within the specified date range for the requesting EMP (i.e. all CDRs within the date range where the corresponding charging process was authorized by the EMP or authorized by Hubject based on the EMP’s authentication data.

    Hubject does not check whether a requested CDR has already been provided to the requesting EMP in the past.

    Pagination:

    Starting from OICP 2.3, eRoaminGetChargeDetailRecords uses pagination. This is an implementation that EMPs `MUST` use in order to divide the amount of ChargeDetailRecords contained in the response of the pull request.

    The parameters of the pagination are given at the end of the end point: `…​?page=0&amp;size=20` where `page` indicates the number of the page for the response and `size` the amount of records to be provided in the response.

    Example:

    Using OICP 2.3 GetChargeDetailRecords endpoint for PROD environment:

    https://service.hubject.com/api/oicp/cdrmgmt/v22/providers/{providerID}/get-charge-detail-records-request?page=0&amp;size=1500

    In the previous request we are telling to provide page __0__ with __1500__ records in it.

    Important

    The default number of records provided in the response are __20__ elements and the maximum number of records possible to obtain per page are __2000__.

    """  # noqa

    if not body:
        request = ERoamingGetChargeDetailRecords(
            ProviderID = providerID or context.data["providerId"],
            From = "2020-08-23T14:20:10.285Z",
            OperatorID = "DE*ABC",
            To = "2020-09-23T14:20:10.285Z",
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    if "From" in payload and isinstance(payload["From"], datetime):
        payload["From"] = payload["From"].isoformat()

    if "To" in payload and isinstance(payload["To"], datetime):
        payload["To"] = payload["To"].isoformat()

    context.currentrequest = payload

    endpoint_url = (
        f"{context.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/cdrmgmt/v22/providers/{context.data['providerId']}/get-charge-detail-records-request"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context.data["cdrs"].append(response.json()["content"])
    context.currentresponse = response.json()
    return response.json()
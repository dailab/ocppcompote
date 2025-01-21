from datetime import datetime

import httpx
from fastapi import APIRouter, Body, Depends

from compote.emp.context.emp_context import EMPContext, get_shared_context
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_push_authentication_data import \
    ERoamingPushAuthenticationData


router = APIRouter()
providerId = "DE-DCB"

DEFAULT_PUSH_AUTHENTICATION_DATA = ERoamingPushAuthenticationData(
    ActionType="fullLoad",
    ProviderAuthenticationData={
        "ProviderID": providerId,
        "AuthenticationDataRecord": [
            {
                "Identification": {
                    "RFIDMifareFamilyIdentification": {
                        "UID": "2A83155EE288040047C1"
                    },
                    "RFIDIdentification": {
                        "UID": "2A83155EE288040047C1",
                        "EvcoID": "AB-123C12345678A",
                        "RFID": "mifareFamily",
                        "PrintedNumber": "string",
                        "ExpiryDate": "string"
                    },
                    "QRCodeIdentification": {
                        "EvcoID": "AB-123C12345678A",
                        # "HashedPIN": {
                        #     "Value": "string",
                        #     "Function": "Bcrypt",
                        #     "LegacyHashData": {
                        #         "Function": "string",
                        #         "Salt": "string",
                        #         "Value": "string"
                        #     }
                        # },
                        "PIN": "1234"
                    },
                    "PlugAndChargeIdentification": {
                        "EvcoID": "AB-123C12345678A"
                    },
                    "RemoteIdentification": {
                        "EvcoID": "AB-123C12345678A"
                    }
                }
            }
        ]
    }
)

@router.post("/pushauthenticationdatav21", tags=["EMP OICP Client API"])
async def eRoamingPushAuthenticationData_V21(
        providerID: str = providerId,
        body: ERoamingPushAuthenticationData = Body(default=DEFAULT_PUSH_AUTHENTICATION_DATA),
        context: EMPContext = Depends(get_shared_context)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `SEND`
      * Implementation: `MANDATORY`

    ![Push authentication data diagram](images/pushauthentificationdata.png)

    When an EMP sends an eRoamingPushAuthenticationData request, Hubject checks whether there is a valid contract between Hubject and the EMP for the service type (Hubject must be the subscriber). If so, the operation allows uploading authentication data to Hubject. Furthermore, it is possible to update authentication data that has been pushed with an earlier operation request. How Hubject handles the transferred data `MUST` be defined in the request field “ActionType”, which offers four options (see below).

    The authentication data to be inserted or updated `MUST` be provided with the “ProviderAuthenticationData” field, which consists of “AuthenticationDataRecord” structures. Hubject keeps a history of all updated and changed data records. Every successful push operation – irrespective of the performed action – leads to a new version of currently valid data records. Furthermore, each operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of authentication data for every point in time in the past.

    __Action types:__

    * __fullLoad:__ The EMP uploads the full set of current authentication data. Hubject does not compare the new data to old (earlier pushed) data. It keeps a history of old data records and handles the newly provided data as valid. In order to allow an easy deletion of all records, it is possible to perform a fullLoad with an empty list of records.

    * __insert:__ The EMP adds further authentication data records to the current set of data. Hubject verifies that the provided data records do not already exist in the currently valid data status. If so, the transaction will be aborted, no data will be inserted, and the request will be answered with an error message. Error details will be provided with the “AdditionalInfo” field.

    * __update:__ The EMP updates data records of the current set of data. Hubject verifies that the provided data records do exist in the currently valid data status. If not, the transaction will be aborted, no data will be updated, and the request will be answered with an error message.

    * __delete:__ The EMP deletes data records of the current set of data.

    __PIN security:__

    The authentication data records that are uploaded to Hubject contain one of the defined identification types. The identification type “QRCodeIdentificationType” contains – besides an “EvcoID” field – a “PIN” field or a “HashedPIN” field (only one of the two options must be provided). For security reasons, Hubject generally does not store PINs in clear text, but always as encrypted hash values. When uploading authentication data to Hubject, the EMPs can directly provide hashed PIN values (using the field “HashedPIN”). In case that the PINs are provided in clear text (field “PIN”), Hubject will generate a hash value for every PIN and will store only the hashes. Hubject by default generates a hash using Bcrypt as a hashing function.

    In case that an EMP provides already hashed PINs, he `MUST` also specify the corresponding hash generation algorithm so that Hubject can reproduce the hash generation when processing a request for authorization. For this reason, the “HashedPIN” field contains detailed information concerning the hash function and the hash salt value (for salted hash functions) that must be used for hash generation.

    __EVCO consistency:__

    EvcoIDs contain the ID of the corresponding EMP. With every data upload operation Hubject checks whether the given EMP’s ProviderID (or Sub-ProviderIDs if necessary) matches every given EvcoID. If not, Hubject refuses the data upload and responds with the status code 019.

    Note:

    The eRoamingPushAuthenticationData operation `MUST` always be used sequentially.

    """  # noqa

    if not body:
        request = ERoamingPushAuthenticationData(
            ActionType="fullLoad",
            ProviderAuthenticationData={
                "ProviderID": context.data["providerId"],
                "AuthenticationDataRecord": context.data["authentication_data_records"]
            }
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    context.currentrequest = payload

    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    endpoint_url = (
        f"{context.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/authdata/v21/providers/{context.data['providerId']}/push-request"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context.currentresponse = response.json()
    return response.json()

# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from compote.eroaming.apis.e_roaming_authentication_data_api_base import BaseERoamingAuthenticationDataApi
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

from compote.eroaming.models.extra_models import TokenModel  # noqa: F401
from pydantic import Field, StrictStr
from typing_extensions import Annotated
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_push_authentication_data import ERoamingPushAuthenticationData


router = APIRouter()

ns_pkg = compote.eroaming.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/authdata/v21/providers/{providerID}/push-request",
    responses={
        200: {"model": ERoamingAcknowledgment, "description": "Expected response to a valid request"},
    },
    tags=["eRoamingAuthenticationData"],
    summary="eRoamingPushAuthenticationData_V2.1",
    response_model_by_alias=True,
)
async def e_roaming_push_authentication_data_v2_1(
    providerID: Annotated[StrictStr, Field(description="The id of the provider")] = Path(..., description="The id of the provider"),
    e_roaming_push_authentication_data: ERoamingPushAuthenticationData = Body(None, description=""),
) -> ERoamingAcknowledgment:
    """__Note:__   * To &#x60;SEND&#x60;   * Implementation: &#x60;MANDATORY&#x60;  ![Push authentication data diagram](images/pushauthentificationdata.png)  When an EMP sends an eRoamingPushAuthenticationData request, Hubject checks whether there is a valid contract between Hubject and the EMP for the service type (Hubject must be the subscriber). If so, the operation allows uploading authentication data to Hubject. Furthermore, it is possible to update authentication data that has been pushed with an earlier operation request. How Hubject handles the transferred data &#x60;MUST&#x60; be defined in the request field “ActionType”, which offers four options (see below).  The authentication data to be inserted or updated &#x60;MUST&#x60; be provided with the “ProviderAuthenticationData” field, which consists of “AuthenticationDataRecord” structures. Hubject keeps a history of all updated and changed data records. Every successful push operation – irrespective of the performed action – leads to a new version of currently valid data records. Furthermore, each operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of authentication data for every point in time in the past.  __Action types:__  * __fullLoad:__ The EMP uploads the full set of current authentication data. Hubject does not compare the new data to old (earlier pushed) data. It keeps a history of old data records and handles the newly provided data as valid. In order to allow an easy deletion of all records, it is possible to perform a fullLoad with an empty list of records.  * __insert:__ The EMP adds further authentication data records to the current set of data. Hubject verifies that the provided data records do not already exist in the currently valid data status. If so, the transaction will be aborted, no data will be inserted, and the request will be answered with an error message. Error details will be provided with the “AdditionalInfo” field.  * __update:__ The EMP updates data records of the current set of data. Hubject verifies that the provided data records do exist in the currently valid data status. If not, the transaction will be aborted, no data will be updated, and the request will be answered with an error message.  * __delete:__ The EMP deletes data records of the current set of data.  __PIN security:__  The authentication data records that are uploaded to Hubject contain one of the defined identification types. The identification type “QRCodeIdentificationType” contains – besides an “EvcoID” field – a “PIN” field or a “HashedPIN” field (only one of the two options must be provided). For security reasons, Hubject generally does not store PINs in clear text, but always as encrypted hash values. When uploading authentication data to Hubject, the EMPs can directly provide hashed PIN values (using the field “HashedPIN”). In case that the PINs are provided in clear text (field “PIN”), Hubject will generate a hash value for every PIN and will store only the hashes. Hubject by default generates a hash using Bcrypt as a hashing function.  In case that an EMP provides already hashed PINs, he &#x60;MUST&#x60; also specify the corresponding hash generation algorithm so that Hubject can reproduce the hash generation when processing a request for authorization. For this reason, the “HashedPIN” field contains detailed information concerning the hash function and the hash salt value (for salted hash functions) that must be used for hash generation.  __EVCO consistency:__  EvcoIDs contain the ID of the corresponding EMP. With every data upload operation Hubject checks whether the given EMP’s ProviderID (or Sub-ProviderIDs if necessary) matches every given EvcoID. If not, Hubject refuses the data upload and responds with the status code 019.  Note:  The eRoamingPushAuthenticationData operation &#x60;MUST&#x60; always be used sequentially. """
    if not BaseERoamingAuthenticationDataApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseERoamingAuthenticationDataApi.subclasses[0]().e_roaming_push_authentication_data_v2_1(providerID, e_roaming_push_authentication_data)

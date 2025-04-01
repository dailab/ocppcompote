from datetime import datetime
from typing import Union

import httpx
from fastapi import APIRouter, Body, Depends

from compote.emp.context.emp_context import EMPContext, get_shared_context
from compote.eroaming.models.e_roaming_evse_data import ERoamingEVSEData
from compote.eroaming.models.e_roaming_pull_evse_data import ERoamingPullEVSEData
from compote.eroaming.models.e_roaming_pull_evse_status import ERoamingPullEVSEStatus
from compote.eroaming.models.e_roaming_pull_evse_status_by_id import \
    ERoamingPullEVSEStatusByID
from compote.eroaming.models.e_roaming_pull_evse_status_by_operator_id import \
    ERoamingPullEVSEStatusByOperatorID

router = APIRouter()
providerId = "DE-DCB"


DEFAULT_PULL_EVSE_DATA = ERoamingPullEVSEData(
    AuthenticationModes=[
        "PnC"
    ],
    Accessibility=[
        "Free publicly accessible"
    ],
    CalibrationLawDataAvailability=[
        "Local"
    ],
    CountryCodes=[
        "DEU"
    ],
    GeoCoordinatesResponseFormat="Google",
    IsHubjectCompatible=True,
    IsOpen24Hours=True,
    LastCall="2020-09-23T14:27:43.052Z",
    OperatorIds=[
        "DE*ABC"
    ],
    ProviderID=providerId,
    RenewableEnergy=True,
    SearchCenter={
        "GeoCoordinates": {
            "Google": {
                "Coordinates": "52.480495 13.356465"
            },
            "DecimalDegree": {
                "Latitude": "52.480495",
                "Longitude": "13.356465"
            },
            "DegreeMinuteSeconds": {
                "Latitude": "9°21'39.32''",
                "Longitude": "9°21'39.32''"
            }
        },
        "Radius": 0
    }
)

DEFAULT_PULL_EVSE_STATUS_DATA = ERoamingPullEVSEStatus(
    ProviderID=providerId,
    oneof_schema_1_validator={
        "ProviderID": providerId,
        "SearchCenter": {
            "GeoCoordinates": {
                "Google": {
                    "Coordinates": "52.480495 13.356465"
                },
                "DecimalDegree": {
                    "Latitude": "52.480495",
                    "Longitude": "13.356465"
                },
                "DegreeMinuteSeconds": {
                    "Latitude": "9°21'39.32''",
                    "Longitude": "9°21'39.32''"
                }
            },
            "Radius": 0
        },
        "EVSEStatus": "Available"
    },
    oneof_schema_2_validator={
        "ProviderID": "DE*ABC",
        "EvseID": [
            "string"
        ]
    },
    oneof_schema_3_validator={
        "ProviderID": "DE*ABC",
        "OperatorID": [
            "DE*ABC"
        ]
    },
    actual_instance={
        "ProviderID": providerId,
        "SearchCenter": {
            "GeoCoordinates": {
                "Google": {
                    "Coordinates": "52.480495 13.356465"
                },
                "DecimalDegree": {
                    "Latitude": "52.480495",
                    "Longitude": "13.356465"
                },
                "DegreeMinuteSeconds": {
                    "Latitude": "9°21'39.32''",
                    "Longitude": "9°21'39.32''"
                }
            },
            "Radius": 0
        },
        "EVSEStatus": "Available"
    },
    one_of_schemas=[
        "string"
    ]
)

@router.post("/pullevsedatav23", tags=["EMP OICP Client API"])
async def eRoamingPullEvseData_V23(
        providerID: str = providerId,
        body: ERoamingPullEVSEData = Body(default=DEFAULT_PULL_EVSE_DATA),
        context: EMPContext = Depends(get_shared_context)
) -> ERoamingEVSEData:
    """
    __Note:__
      * To `SEND`
      * Implementation: `MANDATORY`

    ![Pull evse data diagram](images/pullevsedata.png)

    When an EMP sends an eRoamingPullEVSEData request, Hubject checks whether there is a valid contract between Hubject and the EMP for the service type (EMP must be the subscriber). If so, the operation allows downloading EVSEData from Hubject. When an EMP sends an eRoamingPullEVSEData request, Hubject identifies all currently valid EVSEData records of all operators.

    For every EVSE data record Hubject identifies the timestamp of the last update, which has been performed on the record. The timestamp is returned with the attribute “lastUpdate”.

    __Delta pull:__

    As mentioned above, the operation by default returns all currently valid EVSE data records. However, the requesting EMP has the possibility to download only the changes (delta) compared to a certain time in the past. In order to do so, the EMP MUST provide the optional date/time field “LastCall”, indicating his last EVSE pull request. In case that Hubject receives the LastCall parameter, Hubject compares the EVSE records from the time of the last call with the currently valid records. As a result, Hubject assigns the attribute “deltaType” (possible values: insert, update, delete) to every response EVSE data record indicating whether the particular record has been inserted, updated or deleted in the meantime. EVSE data records that have not changed will not be part of the response.

    Note:
    * The delta pull option cannot be combined with radial search, because in some cases this could lead to data inconsistency on the EMP’s side. This is why the API only allows the provision of either the attribute “SearchCenter” or “LastCall”.

    __Pagination:__

    Starting from OICP 2.3, eRoamingPullEvseData uses pagination. This is an implementation that EMPs `MUST` use in order to divide the amount of EvseDataRecords contained in the response of the pull request.

    The parameters of the pagination are given at the end of the end point: `…​?page=0&amp;size=20` where `page` indicates the number of the page for the response and `size` the amount of records to be provided in the response.

    Important:
    * __The default number of records provided in the eRoamingEvseData response is 20 elements.__

    """  # noqa

    if not body:
        request = ERoamingPullEVSEData(
        GeoCoordinatesResponseFormat="Google",
        ProviderID=context.data["providerId"]
    )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    context.currentrequest = payload

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    endpoint_url = (
        f"{context.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/evsepull/v23/providers/{context.data['providerId']}/data-records"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()


    context.data["cs_data"].append(response.json()["content"])
    context.currentresponse = response.json()
    return response.json()


@router.post("/pullevsestatusv21", tags=["EMP OICP Client API"])
async def eRoamingPullEvseStatus_V21(
        providerID: str = providerId,
        body: Union[ERoamingPullEVSEStatus, ERoamingPullEVSEStatusByID, ERoamingPullEVSEStatusByOperatorID] = Body(default=DEFAULT_PULL_EVSE_STATUS_DATA),
        context: EMPContext = Depends(get_shared_context)
) -> ERoamingPullEVSEStatus:
    """
    __Note:__
      * To `SEND`
      * Implementation: `Mandatory`

    ![Pull EVSE status](images/pullevsestatus.png)

    When an EMP sends an eRoamingPullEVSEStatus request, Hubject checks whether there is a valid contract between Hubject and the EMP for the service type (EMP must be the subscriber). If so, the operation allows downloading EVSE status data from Hubject. When an EMP sends an eRoamingPullEVSEStatus request, Hubject identifies all currently valid EVSE status records of all operators.

    Hubject groups all resulting EVSE status records according to the related CPO. The response structure contains an “EvseStatuses” node that envelopes an “OperatorEVSEStatus” node for every CPO with currently valid and accessible status data records.

    """  # noqa

    if not body:
        request = ERoamingPullEVSEStatus(
            ProviderID = providerID or context.data["providerId"]
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    context.currentrequest = payload

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    endpoint_url = (
        f"{context.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/evsepull/v21/providers/{context.data['providerId']}/status-records"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context.data["cs_status_data"].append(response.json())
    context.currentresponse = response.json()
    return response.json()
from datetime import datetime

import httpx
from fastapi import APIRouter, Body, Depends

from compote.csms.context.csms_contextmanager import get_shared_context_manager, ContextManager
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_push_evse_data import ERoamingPushEvseData
from compote.eroaming.models.e_roaming_push_evse_status import ERoamingPushEvseStatus

router = APIRouter()

DEFAULT_PUSH_EVSE_DATA = ERoamingPushEvseData(
  ActionType = "fullLoad",
  OperatorEvseData = {
    "EvseDataRecord": [
      {
        "Accessibility": "Restricted access",
        "AccessibilityLocation": "ParkingGarage",
        "AdditionalInfo": [
          {
            "lang": "en",
            "value": "This charging station is for testing purposes"
          }
        ],
        "Address": {
          "City": "Berlin",
          "Country": "DEU",
          "Floor": "6OG",
          "HouseNum": "22",
          "PostalCode": "10829",
          "Region": "Berlin",
          "Street": "EUREF CAMPUS",
          "TimeZone": "UTC+01:00",
          "ParkingFacility": True,
          "ParkingSpot": "E36"
        },
        "AuthenticationModes": [
          "NFC RFID Classic",
          "REMOTE"
        ],
        "CalibrationLawDataAvailability": "Local",
        "ChargingFacilities": [
          {
            "Amperage": 32,
            "Power": 22,
            "PowerType": "AC_3_PHASE",
            "Voltage": 480,
            "ChargingModes": [
              "Mode_4"
            ]
          }
        ],
        "ChargingPoolID": "DE*ABC*P1234TEST*1",
        "ChargingStationID": "TEST 1",
        "ChargingStationImage": "http://www.testlink.com",
        "ChargingStationNames": [
          {
            "lang": "en",
            "value": "ABC Charging Station Test"
          },
          {
            "lang": "de",
            "value": "ABC Testladestation"
          }
        ],
        "ChargingStationLocationReference": [
          {
            "lang": "en",
            "value": "Charging station is inside Hubject Office Parking Lot"
          }
        ],
        "ClearinghouseID": "TEST ID",
        "DynamicInfoAvailable": "true",
        "DynamicPowerLevel": True,
        "EvseID": "DE*XYZ*ETEST1",
        "EnergySource": [
          {
            "Energy": "Solar",
            "Percentage": 85
          },
          {
            "Energy": "Wind",
            "Percentage": 15
          }
        ],
        "EnvironmentalImpact": {
          "CO2Emission": 30.3
        },
        "GeoChargingPointEntrance": {
          "Google": {
            "Coordinates": "52.480495 13.356465"
          },
            "DecimalDegree": {
                "Longitude": "13.356465",
                "Latitude": "52.480495"
            }
        },
        "GeoCoordinates": {
          "Google": {
            "Coordinates": "52.480495 13.356465"
          },
            "DecimalDegree": {
                "Longitude": "13.356465",
                "Latitude": "52.480495"
            }
        },
        "HardwareManufacturer": "Charger Hardware Muster Company",
        "HotlinePhoneNumber": "+49123123123123",
        "HubOperatorID": "DE*ABC",
        "IsHubjectCompatible": True,
        "IsOpen24Hours": False,
        "MaxCapacity": 50,
        "OpeningTimes": [
          {
            "Period": [
              {
                "begin": "09:00",
                "end": "18:00"
              }
            ],
            "on": "Everyday"
          }
        ],
        "PaymentOptions": [
          "No Payment"
        ],
        "Plugs": [
          "Type 2 Outlet"
        ],
        "RenewableEnergy": True,
        "SubOperatorName": "XYZ Technologies",
        "ValueAddedServices": [
          "Reservation"
        ],
        "deltaType": "insert",
        #"lastUpdate": "2018-01-23T14:04:29.377Z"
      }
    ],
    "OperatorID": "DE*ABC",
    "OperatorName": "ABC technologies"
  }
)

DEFAULT_PUSH_EVSE_STATUS_DATA = ERoamingPushEvseStatus(
  ActionType = "fullLoad",
    OperatorEvseStatus = {
      "OperatorID": "DE*ABC",
      "OperatorName": "ABC technologies",
      "EvseStatusRecord": [
        {
          "EvseID": "DE*XYZ*ETEST1",
          "EvseStatus": "Available"
        }
      ]
    }
)

@router.post("/pushevsedatav23", tags=["CPO OICP Client API"])
async def eRoamingPushEvseData_V23(
        operatorID: str = "DE*ABC",
        body: ERoamingPushEvseData = Body(default=DEFAULT_PUSH_EVSE_DATA),
        context_manager: ContextManager = Depends(get_shared_context_manager)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `SEND`
      * Implementation: `MANDATORY`

    ![Push evse data diagram](images/pushevsedata.png)

    When a CPO sends an eRoamingPushEvseData request, Hubject checks whether there is a valid contract between Hubject and the CPO for the service type (Hubject must be the subscriber). If so, the operation allows uploading EVSE data to Hubject.
    Furthermore, it is possible to update or delete EVSE data that has been pushed with an earlier operation request.
    How Hubject handles the transferred data `MUST` be defined in the request field &quot;ActionType&quot;, which offers four options.

    The EvseData that will be inserted or updated `MUST` be provided in the OperatorEvseData field, which consists of EvseDataRecord structures. Hubject keeps a history of all updated and changed data records. Every successful push operation – irrespective of the performed action – leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of EvseData for every point in time in the past.

    EVSE consistency:

    EvseIDs contain the ID of the corresponding CPO (With every data upload operation Hubject checks whether the given CPO’s OperatorID or Sub-OperatorIDs if necessary) matches every given EvseID. If not, Hubject refuses the data upload and responds with the status code 018.

    Note:
    * The eRoamingPushEvseData operation `MUST` always be used sequentially as described in Data Push Operations.

    """  # noqa

    if not body:
        request = ERoamingPushEvseData(
            ActionType = "fullLoad",
            OperatorEVSEData = {
                "EvseDataRecord": context_manager.data["existing_cs_data"]
            },
        OperatorID = operatorID or context_manager.data["config"]["operatorId"],
        OperatorName = context_manager.data["config"]["operatorName"]
    )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    context_manager.currentrequest = payload

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    endpoint_url = (
        f"{context_manager.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/evsepush/v23/operators/{context_manager.config['operatorId']}/data-records"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context_manager.currentresponse = response.json()
    return response.json()


@router.post("/pushevsestatusv21", tags=["CPO OICP Client API"])
async def eRoamingPushEvseStatus_V21(
        operatorId: str = "DE*ABC",
        body: ERoamingPushEvseStatus = Body(default=DEFAULT_PUSH_EVSE_STATUS_DATA),
        context_manager: ContextManager = Depends(get_shared_context_manager)
) -> ERoamingAcknowledgment:
    """
    __Note:__
      * To `SEND`
      * Implementation: `Mandatory`
  
    ![Push EVSE status](images/pushevsestatus.png)
  
    When a CPO sends an eRoamingPushEvseStatus request, Hubject checks whether there is a valid contract between Hubject and the CPO for the service type (Hubject must be the subscriber). If so, the operation allows uploading EVSE status data to Hubject. Furthermore, it is possible to update EVSE status data that has been pushed with an earlier operation request.
  
    The way how Hubject handles the transferred data `MUST` be defined in the request field &quot;ActionType2, which offers four options. This option works in the same way as the eRoamingAuthenticationData service. The EVSE status data that will be inserted or updated MUST be provided with the field “OperatorEvseStatus”, which consists of “EvseStatusRecord” structures. Hubject keeps a history of all updated and changed data records. Every successful push operation – irrespective of the performed action – leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of EVSE status data for every point in time in the past.
  
    Note:
  
    The eRoamingPushEvseStatus operation `MUST` always be used sequentiallyas described in Data Push Operations
  
    Best Practices:
  
    Please try to avoid race conditions by sending multiple status simultaneously. Status should be sent one by one.
  
    """  # noqa

    if not body:
        request = ERoamingPushEvseStatus(
            ActionType = "fullLoad",
            OperatorEvseStatus = {
              "OperatorID": operatorId or context_manager.data["config"]["operatorId"],
              "OperatorName": context_manager.data["config"]["operatorName"],
              "EvseStatusRecord": context_manager.data["evse_status_data"]
            }
        )
    else:
        request = body

    payload = request.dict(by_alias=True, exclude_none=True)

    context_manager.currentrequest = payload

    # Workaround for Pydantic serialization of datetime
    if "LastCall" in payload and isinstance(payload["LastCall"], datetime):
        payload["LastCall"] = payload["LastCall"].isoformat()

    endpoint_url = (
        f"{context_manager.data['config']['oicp_server_config']['OICP_SERVER_URL']}"
        f"/evsepush/v21/operators/{context_manager.config['operatorId']}/status-records"
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint_url, json=payload)
        response.raise_for_status()

    context_manager.currentresponse = response.json()
    return response.json()
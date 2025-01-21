# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated

from compote.eroaming.apis.e_roaming_evse_data_api_base import BaseERoamingEvseDataApi
from compote.eroaming.models.e_roaming_evse_data import ERoamingEVSEData
from compote.eroaming.models.e_roaming_pull_evse_data import ERoamingPullEVSEData


class BaseERoamingEvseDataImpl(BaseERoamingEvseDataApi):

    def __init__(self):
        super()

    async def e_roaming_pull_evse_data_v2_3(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_pull_evse_data: ERoamingPullEVSEData,
    ) -> ERoamingEVSEData:
        testdata = {
            "content": [
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
                        }
                    },
                    "GeoCoordinates": {
                        "Google": {
                            "Coordinates": "52.480495 13.356465"
                        },
                        "DecimalDegree": {
                            "Longitude": "13.356465",
                            "Latitude": "52.480495"
                        },
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
                    "lastUpdate": "2018-01-23T14:04:29.377Z",
                    "OperatorID": "DE*ABC",
                    "OperatorName": "ABC technologies"
                },
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
                    "EvseID": "DE*XYZ*ETEST2",
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
                        }
                    },
                    "GeoCoordinates": {
                        "Google": {
                            "Coordinates": "52.480495 13.356465"
                        },
                        "DecimalDegree": {
                            "Longitude": "13.351455",
                            "Latitude": "52.489485"
                        },
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
                    "lastUpdate": "2018-01-23T14:04:29.377Z",
                    "OperatorID": "DE*ABC",
                    "OperatorName": "ABC technologies"
                }
            ],
            "number": 0,
            "size": 2,
            "totalElements": 8,
            "last": False,
            "totalPages": 8,
            "first": True,
            "numberOfElements": 1,
            "StatusCode": {
                "AdditionalInfo": "Success",
                "Code": "000",
                "Description": "string"
            }
        }

        return ERoamingEVSEData.parse_obj(testdata)


from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing_extensions import Annotated

from compote.eroaming.apis.e_roaming_evse_data_api_base import BaseERoamingEvseDataApi
from compote.eroaming.context.eroaming_context import ERoamingContext
from compote.eroaming.models.e_roaming_acknowledgment import ERoamingAcknowledgment
from compote.eroaming.models.e_roaming_evse_data import ERoamingEVSEData
from compote.eroaming.models.e_roaming_pull_evse_data import ERoamingPullEVSEData
from compote.eroaming.models.e_roaming_push_evse_data import ERoamingPushEvseData


class BaseERoamingEvseDataImpl(BaseERoamingEvseDataApi):

    cs_data = []

    def __init__(self):
        super().__init__()

    async def e_roaming_pull_evse_data_v2_3(
        self,
        providerID: Annotated[StrictStr, Field(description="The id of the provider")],
        e_roaming_pull_evse_data: ERoamingPullEVSEData,
        context: ERoamingContext
    ) -> ERoamingEVSEData:

        cs_data = context.data.get("cs_data", [])

        response_data = {
            "content": cs_data,
            "number": 0,
            "size": len(cs_data),
            "totalElements": len(cs_data),
            "last": True,
            "totalPages": 1,
            "first": True,
            "numberOfElements": len(cs_data),
            "StatusCode": {
                "AdditionalInfo": "Success",
                "Code": "000",
                "Description": "Success"
            }
        }

        return ERoamingEVSEData.parse_obj(response_data)

    async def e_roaming_push_evse_data_v2_3(
        self,
        operatorID: Annotated[StrictStr, Field(description="The id of the operator")],
        e_roaming_push_evse_data: ERoamingPushEvseData,
        context: ERoamingContext
    ) -> ERoamingAcknowledgment:

        converted_data = []
        for evse_data_record in e_roaming_push_evse_data.operator_evse_data.evse_data_record:
            converted_record = {
                "Accessibility": evse_data_record.accessibility,
                "AccessibilityLocation": evse_data_record.accessibility_location,
                "AdditionalInfo": evse_data_record.additional_info,
                "Address": {
                    "City": evse_data_record.address.city,
                    "Country": evse_data_record.address.country,
                    "Floor": evse_data_record.address.floor,
                    "HouseNum": evse_data_record.address.house_num,
                    "PostalCode": evse_data_record.address.postal_code,
                    "Region": evse_data_record.address.region,
                    "Street": evse_data_record.address.street,
                    "TimeZone": evse_data_record.address.time_zone,
                    "ParkingFacility": evse_data_record.address.parking_facility,
                    "ParkingSpot": evse_data_record.address.parking_spot
                },
                "AuthenticationModes": evse_data_record.authentication_modes,
                "CalibrationLawDataAvailability": evse_data_record.calibration_law_data_availability,
                "ChargingFacilities": [
                    {
                        "Amperage": facility.amperage,
                        "Power": facility.power,
                        "PowerType": facility.power_type,
                        "Voltage": facility.voltage,
                        "ChargingModes": facility.charging_modes
                    }
                    for facility in evse_data_record.charging_facilities
                ],
                "ChargingPoolID": evse_data_record.charging_pool_id,
                "ChargingStationID": evse_data_record.charging_station_id,
                "ChargingStationImage": evse_data_record.charging_station_image,
                "ChargingStationNames": evse_data_record.charging_station_names,
                "ChargingStationLocationReference": evse_data_record.charging_station_location_reference,
                "ClearinghouseID": evse_data_record.clearinghouse_id,
                "DynamicInfoAvailable": evse_data_record.dynamic_info_available,
                "DynamicPowerLevel": evse_data_record.dynamic_power_level,
                "EvseID": evse_data_record.evse_id,
                "EnergySource": evse_data_record.energy_source,
                "EnvironmentalImpact": {
                    "CO2Emission": evse_data_record.environmental_impact.co2_emission
                },
                "GeoChargingPointEntrance": {
                    "Google": {
                        "Coordinates": evse_data_record.geo_charging_point_entrance.google.coordinates
                    }
                },
                "GeoCoordinates": {
                    "Google": {
                        "Coordinates": evse_data_record.geo_coordinates.google.coordinates
                    },
                    "DecimalDegree": {
                        "Longitude": evse_data_record.geo_coordinates.decimal_degree.longitude,
                        "Latitude": evse_data_record.geo_coordinates.decimal_degree.latitude
                    }
                },
                "HardwareManufacturer": evse_data_record.hardware_manufacturer,
                "HotlinePhoneNumber": evse_data_record.hotline_phone_number,
                "HubOperatorID": evse_data_record.hub_operator_id,
                "IsHubjectCompatible": evse_data_record.is_hubject_compatible,
                "IsOpen24Hours": evse_data_record.is_open24_hours,
                "MaxCapacity": evse_data_record.max_capacity,
                "OpeningTimes": evse_data_record.opening_times,
                "PaymentOptions": evse_data_record.payment_options,
                "Plugs": evse_data_record.plugs,
                "RenewableEnergy": evse_data_record.renewable_energy,
                "SubOperatorName": evse_data_record.sub_operator_name,
                "ValueAddedServices": evse_data_record.value_added_services,
                "deltaType": evse_data_record.delta_type,
                "lastUpdate": evse_data_record.last_update,
                "OperatorID": operatorID,
                "OperatorName": operatorID
            }
            converted_data.append(converted_record)

        context.data["cs_data"].extend(converted_data)

        testdata = {
            "Result": True,
            "StatusCode": {
                "AdditionalInfo": "Success",
                "Code": "000",
                "Description": "Success"
            },
            "SessionID": "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
            "CPOPartnerSessionID": "1234XYZ",
            "EMPPartnerSessionID": "2345ABC"
        }

        return ERoamingAcknowledgment.parse_obj(testdata)
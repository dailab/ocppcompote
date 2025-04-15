import componentsSchemasOperatorID from "./OperatorID";
import componentsSchemasOpeningTimes from "./OpeningTimes";
import componentsSchemasAccessibility from "./Accessibility";
import componentsSchemasValueAddedService from "./ValueAddedService";
import componentsSchemasPaymentOption from "./PaymentOption";
import componentsSchemasAuthenticationMode from "./AuthenticationMode";
import componentsSchemasEnergySource from "./EnergySource";
import componentsSchemasChargingFacility from "./ChargingFacility";
import componentsSchemasPlug from "./Plug";
import componentsSchemasGeoCoordinates from "./GeoCoordinates";
import componentsSchemasAddressIso19773 from "./AddressIso19773";
import componentsSchemasInfoTextType from "./InfoTextType";
import componentsSchemasChargingPoolID from "./ChargingPoolID";
import componentsSchemasEvseID from "./EvseID";

const schema = {
  type: "object",
  required: [
    "EvseID",
    "ChargingStationNames",
    "Address",
    "GeoCoordinates",
    "Plugs",
    "ChargingFacilities",
    "RenewableEnergy",
    "CalibrationLawDataAvailability",
    "AuthenticationModes",
    "PaymentOptions",
    "ValueAddedServices",
    "Accessibility",
    "HotlinePhoneNumber",
    "IsOpen24Hours",
    "IsHubjectCompatible",
    "DynamicInfoAvailable",
    "OperatorID",
    "OperatorName",
  ],
  properties: {
    deltaType: {
      type: "string",
      enum: ["update", "insert", "delete"],
      description:
        "In case that the operation “PullEvseData” is performed with the parameter “LastCall”, Hubject assigns this attribute to every response EVSE record in order to return the changes compared to the last call.",
    },
    lastUpdate: {
      type: "string",
      format: "date-time",
      description:
        "The attribute indicates the date and time of the last update of the record. Hubject assigns this attribute to every response EVSE record.",
    },
    EvseID: componentsSchemasEvseID,
    ChargingPoolID: componentsSchemasChargingPoolID,
    ChargingStationId: {
      type: "string",
      description: "The ID that identifies the charging station.",
      maximum: 50,
    },
    ChargingStationNames: {
      type: "array",
      items: componentsSchemasInfoTextType,
      description: "Name of the charging station",
    },
    HardwareManufacturer: {
      type: "string",
      maximum: 50,
      description: "Name of the charging point manufacturer",
    },
    ChargingStationImage: {
      type: "string",
      maximum: 200,
      description: "URL that redirect to an online image of the related EVSEID",
    },
    SubOperatorName: {
      type: "string",
      maximum: 100,
      description: "Name of the Sub Operator owning the Charging Station",
    },
    Address: componentsSchemasAddressIso19773,
    GeoCoordinates: componentsSchemasGeoCoordinates,
    Plugs: {
      type: "array",
      description: "List of plugs that are supported.",
      items: componentsSchemasPlug,
    },
    DynamicPowerLevel: {
      type: "boolean",
      description: "Informs is able to deliver different power outputs.",
    },
    ChargingFacilities: {
      type: "array",
      description: "List of facilities that are supported.",
      items: componentsSchemasChargingFacility,
    },
    RenewableEnergy: {
      type: "boolean",
      description:
        "If the Charging Station provides only renewable energy then the value `MUST` be ”true”, if it use grey energy then value `MUST` be “false”.\n",
    },
    EnergySource: {
      type: "array",
      description:
        "List of energy source that the charging station uses to supply electric energy.",
      items: componentsSchemasEnergySource,
    },
    EnvironmentalImpact: {
      type: "object",
      properties: {
        CO2Emission: {
          type: "number",
          description:
            "Total CO2 emited by the energy source being used by this charging station to supply energy to EV. Units are in g/kWh",
          maximum: 99999,
        },
        NuclearWaste: {
          type: "number",
          description:
            "Total NuclearWaste emited by the energy source being used by this charging station to supply energy to EV. Units are in g/kWh",
          maximum: 99999,
        },
      },
    },
    CalibrationLawDataAvailability: {
      type: "string",
      description:
        "| Option | Description |\n| Local | Calibration law data is shown at the charging station. |\n| External | Calibration law data is provided externaly. |\n| Not Available | Calibration law data is not provided. |\n",
      enum: ["Local", "External", "Not Available"],
    },
    AuthenticationModes: {
      type: "array",
      description: "List of authentication modes that are supported.",
      items: componentsSchemasAuthenticationMode,
    },
    MaxCapacity: {
      type: "integer",
      description:
        "This field is used if the EVSE has a limited capacity (e.g. built-in battery). Values must be given in kWh.",
    },
    PaymentOptions: {
      type: "array",
      description: "List of payment options that are supported.",
      items: componentsSchemasPaymentOption,
    },
    ValueAddedServices: {
      type: "array",
      description: "List of value added services that are supported.",
      items: componentsSchemasValueAddedService,
    },
    Accessibility: componentsSchemasAccessibility,
    AccessibilityLocation: {
      type: "string",
      enum: [
        "OnStreet",
        "ParkingLot",
        "ParkingGarage",
        "UndergroundParkingGarage",
      ],
      description:
        "| Option | Description |\n| ------ | ----------- |\n| OnStreet | The charging station is located on the street|\n| ParkingLot | The Charging Point is located inside a Parking Lot|\n| ParkingGarage | The Charging Point is located inside a Parking Garage|\n| UndergroundParkingGarage | The Charging Point is located inside an Underground Parking Garage |\n",
    },
    HotlinePhoneNumber: {
      type: "string",
      pattern: "^\\+[0-9]{5,15}$",
      description:
        "`^\\+[0-9]{5,15}$`\nThe expression validates the string as a telephone number starting with “+” and containing only numbers.\n\nExample: “+0305132787”\n",
    },
    AdditionalInfo: {
      type: "array",
      description: "Optional information.",
      items: componentsSchemasInfoTextType,
    },
    ChargingStationLocationReference: {
      type: "array",
      description:
        "Inform the EV driver where the ChargingPoint could be accessed.",
      items: componentsSchemasInfoTextType,
    },
    GeoChargingPointEntrance: componentsSchemasGeoCoordinates,
    IsOpen24Hours: {
      type: "boolean",
      description: "Set in case the charging spot is open 24 hours.",
    },
    OpeningTimes: {
      type: "array",
      description:
        "Opening time in case that the charging station cannot be accessed around the clock.",
      items: componentsSchemasOpeningTimes,
    },
    HubOperatorID: componentsSchemasOperatorID,
    ClearinghouseID: {
      type: "string",
      maximum: 20,
      description:
        "Identification of the corresponding clearing house in the event that roaming between different clearing houses `MUST` be processed in the future.\n",
    },
    IsHubjectCompatible: {
      type: "boolean",
      description:
        'Is eRoaming via intercharge at this charging station possible? If set to "false" the charge spot will not be started/stopped remotely via Hubject.',
    },
    DynamicInfoAvailable: {
      type: "string",
      enum: ["true", "false", "auto"],
      description:
        "Values: true / false / auto This attribute indicates whether a CPO provides (dynamic) EVSE Status info in addition to the (static) EVSE Data for this EVSERecord. Value auto is set to true by Hubject if the operator offers Hubject EVSEStatus data.",
    },
    OperatorID: componentsSchemasOperatorID,
    OperatorName: {
      type: "string",
      description: "Free text for operator",
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/PullEvseDataRecord",
  ...schema,
} as const;
export { with$id };

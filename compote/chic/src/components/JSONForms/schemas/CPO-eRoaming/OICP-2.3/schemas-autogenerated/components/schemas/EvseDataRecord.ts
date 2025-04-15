import componentsSchemasOpeningTimes from "./OpeningTimes";
import componentsSchemasAccessibility from "./Accessibility";
import componentsSchemasValueAddedService from "./ValueAddedService";
import componentsSchemasPaymentOption from "./PaymentOption";
import componentsSchemasAuthenticationMode from "./AuthenticationMode";
import componentsSchemasPullEvseDataRecordEnvironmentalImpact from "./PullEvseDataRecordEnvironmentalImpact";
import componentsSchemasEnergySource from "./EnergySource";
import componentsSchemasChargingFacility from "./ChargingFacility";
import componentsSchemasPlug from "./Plug";
import componentsSchemasGeoCoordinates from "./GeoCoordinates";
import componentsSchemasAddressIso19773 from "./AddressIso19773";
import componentsSchemasInfoTextType from "./InfoTextType";

const schema = {
  properties: {
    deltaType: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Deltatype",
      description:
        "In case that the operation â€œPullEvseDataâ€ is performed with the parameter â€œLastCallâ€, Hubject assigns this attribute to every response EVSE record in order to return the changes compared to the last call.",
    },
    lastUpdate: {
      anyOf: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
      title: "Lastupdate",
      description:
        "The attribute indicates the date and time of the last update of the record. Hubject assigns this attribute to every response EVSE record.",
    },
    EvseID: {
      type: "string",
      title: "Evseid",
      description:
        "The ID that identifies the charging spot.  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN.  `^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?E[A-Za-z0-9\\*]{1,30})|(\\+?[0-9]{1,3}\\*[0-9]{3}\\*[0-9\\*]{1,32}))$` The expression validates the string as EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the EvseID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional. Furthermore the ID MUST provide an â€œEâ€ after the OperatorID in order to identify the ID as ISO EvseID without doubt.  In case the EvseID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*AB7*E840*6487â€, â€œDEAB7E8406487â€  Example DIN: â€œ+49*810*000*438â€ ",
    },
    ChargingPoolID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Chargingpoolid",
      description:
        "VSEs may be grouped by using a charging pool id according to emiÂ³ standard definition. The Evse Pool ID MUST match the following structure (the notation corresponds to the augmented Backus-Naur Form (ABNF) as defined in RFC5234): <Evse Pool ID> = <Country Code> <S> <Spot Operator ID> <S> <ID Type> <Pool ID>  with:  <Country Code> = 2 ALPHA ; two character country code according to ISO-3166-1 (Alpha-2-Code).  <Spot Operator ID> = 3 (ALPHA / DIGIT); three alphanumeric characters.  <ID Type> = â€œPâ€; one character â€œPâ€ indicating that this ID represents a â€œPoolâ€.  <Pool Instance> = (ALPHA / DIGIT) 1 * 30 ( 1*(ALPHA / DIGIT) [/ <S>] ); between 1 and 31sequence of alphanumeric characters, including additional optional separators. Starts with alphanumeric character referring to a specific Pool in EVSE Operator data system.  ALPHA = %x41-5A / %x61-7A; according to RFC 5234 (7-Bit ASCII).  DIGIT = %x30-39; according to RFC 5234 (7-Bit ASCII).  <S> = *1 ( â€œ*â€ ); optional separator  An example for a valid Evse Pool ID is â€œIT*123*P456*AB789â€ with :  â€œITâ€ indicating Italy,  â€œ123â€ representing a particular Spot Operator,  â€œPâ€ indicating the Pool, and  â€œ456*AB789â€ representing one of its POOL.  Note  In contrast to the eMA ID, no check digit is specified for the Evse Pool ID in this document. Alpha characters SHALL be interpreted case insensitively. emiÂ³ strongly recommends that implementations SHOULD - use the separator between Country Code and Spot Operator ID - use the separator between Spot Operator ID and ID type This leads to the following regular expression:  `([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?P[A-Za-z0-9\\*]{1,30})`  This regular expression is similar to that of the ISO EvseIDType but E is replaced with P to indicate a pool. ",
    },
    ChargingStationId: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Chargingstationid",
      description: "The ID that identifies the charging station.",
    },
    ChargingStationNames: {
      items: componentsSchemasInfoTextType,
      type: "array",
      title: "Chargingstationnames",
      description: "Name of the charging station",
    },
    HardwareManufacturer: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Hardwaremanufacturer",
      description: "Name of the charging point manufacturer",
    },
    ChargingStationImage: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Chargingstationimage",
      description: "URL that redirect to an online image of the related EVSEID",
    },
    SubOperatorName: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Suboperatorname",
      description: "Name of the Sub Operator owning the Charging Station",
    },
    Address: componentsSchemasAddressIso19773,
    GeoCoordinates: componentsSchemasGeoCoordinates,
    Plugs: {
      items: componentsSchemasPlug,
      type: "array",
      title: "Plugs",
      description: "List of plugs that are supported.",
    },
    DynamicPowerLevel: {
      anyOf: [
        {
          type: "boolean",
        },
        {
          type: "null",
        },
      ],
      title: "Dynamicpowerlevel",
      description: "Informs is able to deliver different power outputs.",
    },
    ChargingFacilities: {
      items: componentsSchemasChargingFacility,
      type: "array",
      title: "Chargingfacilities",
      description: "List of facilities that are supported.",
    },
    RenewableEnergy: {
      type: "boolean",
      title: "Renewableenergy",
      description:
        "If the Charging Station provides only renewable energy then the value `MUST` be â€trueâ€, if it use grey energy then value `MUST` be â€œfalseâ€. ",
    },
    EnergySource: {
      anyOf: [
        {
          items: componentsSchemasEnergySource,
          type: "array",
        },
        {
          type: "null",
        },
      ],
      title: "Energysource",
      description:
        "List of energy source that the charging station uses to supply electric energy.",
    },
    EnvironmentalImpact: {
      anyOf: [
        componentsSchemasPullEvseDataRecordEnvironmentalImpact,
        {
          type: "null",
        },
      ],
    },
    CalibrationLawDataAvailability: {
      type: "string",
      title: "Calibrationlawdataavailability",
      description:
        "| Option | Description | | Local | Calibration law data is shown at the charging station. | | External | Calibration law data is provided externaly. | | Not Available | Calibration law data is not provided. | ",
    },
    AuthenticationModes: {
      items: componentsSchemasAuthenticationMode,
      type: "array",
      title: "Authenticationmodes",
      description: "List of authentication modes that are supported.",
    },
    MaxCapacity: {
      anyOf: [
        {
          type: "integer",
        },
        {
          type: "null",
        },
      ],
      title: "Maxcapacity",
      description:
        "This field is used if the EVSE has a limited capacity (e.g. built-in battery). Values must be given in kWh.",
    },
    PaymentOptions: {
      items: componentsSchemasPaymentOption,
      type: "array",
      title: "Paymentoptions",
      description: "List of payment options that are supported.",
    },
    ValueAddedServices: {
      items: componentsSchemasValueAddedService,
      type: "array",
      title: "Valueaddedservices",
      description: "List of value added services that are supported.",
    },
    Accessibility: componentsSchemasAccessibility,
    AccessibilityLocation: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Accessibilitylocation",
      description:
        "| Option | Description | | ------ | ----------- | | OnStreet | The charging station is located on the street| | ParkingLot | The Charging Point is located inside a Parking Lot| | ParkingGarage | The Charging Point is located inside a Parking Garage| | UndergroundParkingGarage | The Charging Point is located inside an Underground Parking Garage | ",
    },
    HotlinePhoneNumber: {
      type: "string",
      title: "Hotlinephonenumber",
      description:
        "`^\\+[0-9]{5,15}$` The expression validates the string as a telephone number starting with â€œ+â€ and containing only numbers.  Example: â€œ+0305132787â€ ",
    },
    AdditionalInfo: {
      anyOf: [
        {
          items: componentsSchemasInfoTextType,
          type: "array",
        },
        {
          type: "null",
        },
      ],
      title: "Additionalinfo",
      description: "Optional information.",
    },
    ChargingStationLocationReference: {
      anyOf: [
        {
          items: componentsSchemasInfoTextType,
          type: "array",
        },
        {
          type: "null",
        },
      ],
      title: "Chargingstationlocationreference",
      description:
        "Inform the EV driver where the ChargingPoint could be accessed.",
    },
    GeoChargingPointEntrance: {
      anyOf: [
        componentsSchemasGeoCoordinates,
        {
          type: "null",
        },
      ],
    },
    IsOpen24Hours: {
      type: "boolean",
      title: "Isopen24Hours",
      description: "Set in case the charging spot is open 24 hours.",
    },
    OpeningTimes: {
      anyOf: [
        {
          items: componentsSchemasOpeningTimes,
          type: "array",
        },
        {
          type: "null",
        },
      ],
      title: "Openingtimes",
      description:
        "Opening time in case that the charging station cannot be accessed around the clock.",
    },
    HubOperatorID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Huboperatorid",
      description:
        "A string that MUST be valid with respect to the following regular expression: ISO | DIN  ^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3})|(\\+?[0-9]{1,3}\\*[0-9]{3}))$ The expression validates the string as OperatorID including the preceding country code, which is part of EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118. In case the OperatorID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional.  In case the OperatorID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*A36â€, â€œDEA36â€  Example DIN: â€œ+49*536â€ ",
    },
    ClearinghouseID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Clearinghouseid",
      description:
        "Identification of the corresponding clearing house in the event that roaming between different clearing houses `MUST` be processed in the future. ",
    },
    IsHubjectCompatible: {
      type: "boolean",
      title: "Ishubjectcompatible",
      description:
        'Is eRoaming via intercharge at this charging station possible? If set to "false" the charge spot will not be started/stopped remotely via Hubject.',
    },
    DynamicInfoAvailable: {
      type: "string",
      title: "Dynamicinfoavailable",
      description:
        "Values: true / false / auto This attribute indicates whether a CPO provides (dynamic) EVSE Status info in addition to the (static) EVSE Data for this EVSERecord. Value auto is set to true by Hubject if the operator offers Hubject EVSEStatus data.",
    },
  },
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
  ],
  title: "EvseDataRecord",
  description: "EvseDataRecord",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/EvseDataRecord",
  ...schema,
} as const;
export { with$id };

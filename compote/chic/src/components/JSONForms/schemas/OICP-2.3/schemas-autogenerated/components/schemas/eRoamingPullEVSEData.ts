import componentsSchemasAccessibility from "./Accessibility";
import componentsSchemasAuthenticationMode from "./AuthenticationMode";
import componentsSchemasOperatorID from "./OperatorID";
import componentsSchemasCountryCode from "./CountryCode";
import componentsSchemasGeoCoordinatesResponseFormat from "./GeoCoordinatesResponseFormat";
import componentsSchemasGeoCoordinates from "./GeoCoordinates";
import componentsSchemasProviderID from "./ProviderID";

const schema = {
  type: "object",
  description:
    "eRoamingPullEVSEData is a message that is sent in order to request the download of EVSE data of operators stored on the Hubject system.",
  required: ["ProviderID", "GeoCoordinatesResponseFormat"],
  properties: {
    ProviderID: componentsSchemasProviderID,
    SearchCenter: {
      type: "object",
      description:
        '"The data can be restricted using search parameters that are provided in this field.\n\nCannot be combined with “LastCall”."\n',
      required: ["GeoCoordinates", "Radius"],
      properties: {
        GeoCoordinates: componentsSchemasGeoCoordinates,
        Radius: {
          type: "number",
          description:
            "Radius in km around the position that is defined by the geo coordinates",
        },
      },
    },
    LastCall: {
      type: "string",
      format: "date-time",
      description:
        "In case that this field is set, Hubject does not return the currently valid set of EVSE data but the changes compared to the status of EVSE data at the time of the last call. Cannot be combined with “SearchCenter”, “CountryCodes”, and “OperatorIDs”. ",
    },
    GeoCoordinatesResponseFormat: componentsSchemasGeoCoordinatesResponseFormat,
    CountryCodes: {
      type: "array",
      description:
        "A list of countries whose EVSE’s a provider wants to retrieve. Cannot be combined with “LastCall”.",
      items: componentsSchemasCountryCode,
    },
    OperatorIds: {
      type: "array",
      description:
        "A list of Operator Ids in ISO or DIN standard to download only EVSE’s of one or more operators. Cannot be combined with “LastCall”.",
      items: componentsSchemasOperatorID,
    },
    AuthenticationModes: {
      type: "array",
      description: "A list of Authentication Modes to start a charging process",
      items: componentsSchemasAuthenticationMode,
    },
    Accessibility: {
      type: "array",
      description: "A list of accessibility of the charging point",
      items: componentsSchemasAccessibility,
    },
    CalibrationLawDataAvailability: {
      type: "array",
      description:
        "A list of how caliration law data is provided by the charging point",
      items: {
        type: "string",
        enum: ["Local", "External", "Not Available"],
      },
    },
    RenewableEnergy: {
      type: "boolean",
      description: "Select the charging stations use Renewable energy or not",
    },
    IsHubjectCompatible: {
      type: "boolean",
      description: "Select if the charging station is Hubject Compatible",
    },
    IsOpen24Hours: {
      type: "boolean",
      description: "Select the charging stations that are open 24 hours.",
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingPullEVSEData",
  ...schema,
} as const;
export { with$id };

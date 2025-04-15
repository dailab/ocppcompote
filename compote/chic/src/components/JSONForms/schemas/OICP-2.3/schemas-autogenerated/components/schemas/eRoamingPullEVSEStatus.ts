import componentsSchemasEvseStatus from "./EvseStatus";
import componentsSchemasGeoCoordinates from "./GeoCoordinates";
import componentsSchemasProviderID from "./ProviderID";

const schema = {
  type: "object",
  description:
    "eRoamingPullEVSEStatus is a message that is sent in order to request the download of EVSE status data stored on the Hubject system\n\nTip:\n  * In case not all but a specific EVSE status is needed, Hubject offers the service eRoamingPullEVSEStatusByID and eRoamingPullEVSEStatusByOperatorID.\n  * We recommend a to send the request with a frequency from 1 to 5 minutes.\n",
  required: ["ProviderID"],
  properties: {
    ProviderID: componentsSchemasProviderID,
    SearchCenter: {
      type: "object",
      description:
        "The data can be restricted using search parameters that are provided in this field.",
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
    EVSEStatus: componentsSchemasEvseStatus,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingPullEVSEStatus",
  ...schema,
} as const;
export { with$id };

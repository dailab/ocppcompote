import componentsSchemasEvseID from "./EvseID";
import componentsSchemasProviderID from "./ProviderID";

const schema = {
  type: "object",
  description:
    "eRoamingPullEVSEStatusByID is a message that is sent in order to request the EVSE status data for specific EVSE IDs.\n",
  required: ["ProviderID", "EvseID"],
  properties: {
    ProviderID: componentsSchemasProviderID,
    EvseID: {
      type: "array",
      maxItems: 100,
      items: componentsSchemasEvseID,
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingPullEVSEStatusByID",
  ...schema,
} as const;
export { with$id };

import componentsSchemasOperatorID from "./OperatorID";
import componentsSchemasProviderID from "./ProviderID";

const schema = {
  type: "object",
  description:
    "eRoamingPullEVSEStatusByOperatorID is a message that is sent in order to request the EVSE status data for specific OperatorsIDs (i.e. CPO(s) specific EVSE status data).",
  required: ["ProviderID", "OperatorID"],
  properties: {
    ProviderID: componentsSchemasProviderID,
    OperatorID: {
      type: "array",
      items: componentsSchemasOperatorID,
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingPullEVSEStatusByOperatorID",
  ...schema,
} as const;
export { with$id };

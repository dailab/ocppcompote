import componentsSchemasEvseID from "./EvseID";
import componentsSchemasProviderID from "./ProviderID";
import componentsSchemasSessionID from "./SessionID";

const schema = {
  type: "object",
  required: ["SessionID", "ProviderID", "EvseID"],
  properties: {
    SessionID: componentsSchemasSessionID,
    CPOPartnerSessionID: {
      type: "string",
      maximum: 250,
      description:
        "Optional field containing the session id assigned by the CPO to the related operation.",
    },
    EMPPartnerSessionID: {
      type: "string",
      maximum: 250,
      description:
        "Optional field containing the session id assigned by an EMP to the related operation.",
    },
    ProviderID: componentsSchemasProviderID,
    EvseID: componentsSchemasEvseID,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingAuthorizeRemoteStop",
  ...schema,
} as const;
export { with$id };

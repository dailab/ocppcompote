import componentsSchemasEvseID from "./EvseID";
import componentsSchemasProviderID from "./ProviderID";
import componentsSchemasSessionID from "./SessionID";

const schema = {
  type: "object",
  required: ["ProviderID", "EvseID", "SessionID"],
  properties: {
    SessionID: componentsSchemasSessionID,
    CPOPartnerSessionID: {
      type: "string",
      maximum: 250,
      description:
        "Optional field containing the session id assigned by the CPO to the related operation. Partner systems can use this field to link their own session handling to HBS processes.",
    },
    EMPPartnerSessionId: {
      type: "string",
      maximum: 250,
      description:
        "Optional field containing the session id assigned by an EMP to the related operation. Partner systems can use this field to link their own session handling to HBS processes.",
    },
    ProviderID: componentsSchemasProviderID,
    EvseID: componentsSchemasEvseID,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingAuthorizeRemoteReservationStop",
  ...schema,
} as const;
export { with$id };

import componentsSchemasIdentification from "./Identification";
import componentsSchemasEvseID from "./EvseID";
import componentsSchemasOperatorID from "./OperatorID";
import componentsSchemasSessionID from "./SessionID";

const schema = {
  type: "object",
  required: ["SessionID", "OperatorID", "Identification"],
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
    OperatorID: componentsSchemasOperatorID,
    EvseID: componentsSchemasEvseID,
    Identification: componentsSchemasIdentification,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingAuthorizeStop",
  ...schema,
} as const;
export { with$id };

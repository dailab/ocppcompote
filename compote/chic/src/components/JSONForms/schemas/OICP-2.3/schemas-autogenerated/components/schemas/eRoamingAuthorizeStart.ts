import componentsSchemasProductID from "./ProductID";
import componentsSchemasIdentification from "./Identification";
import componentsSchemasEvseID from "./EvseID";
import componentsSchemasOperatorID from "./OperatorID";
import componentsSchemasSessionID from "./SessionID";

const schema = {
  type: "object",
  description:
    "Best Practices:\n* The EVSE ID is optional for this message which is e.g. defined after the RFID authorization at a charge point. If the Evse ID can be provided, we recommend to include the EVSE ID in this message; it will help for support matters.\n* If an authorization process could not successfully be executed, please set an error code by refering to the error code list mentioned in the OICP document.\n",
  required: ["OperatorID", "Identification"],
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
    PartnerProductID: componentsSchemasProductID,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingAuthorizeStart",
  ...schema,
} as const;
export { with$id };

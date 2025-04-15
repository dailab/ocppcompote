import componentsSchemasSessionID from "./SessionID";
import componentsSchemasStatusCode from "./StatusCode";

const schema = {
  type: "object",
  description:
    "The acknowledgement is a message that is sent in response to several requests.\n\n* To `SEND` and `RECEIVE`\n* Implementation: `MANDATORY`\n",
  required: ["Result", "StatusCode"],
  properties: {
    Result: {
      type: "boolean",
      description:
        "If result is true, the message was received and the respective operation was performed successfully.\n\nIf result is false, the message was received and the respective operation was not performed successfully.\n",
    },
    StatusCode: componentsSchemasStatusCode,
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
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingAcknowledgment",
  ...schema,
} as const;
export { with$id };

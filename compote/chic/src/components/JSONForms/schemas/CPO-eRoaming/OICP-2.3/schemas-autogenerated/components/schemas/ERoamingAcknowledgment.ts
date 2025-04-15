import componentsSchemasStatusCode from "./StatusCode";

const schema = {
  properties: {
    Result: {
      type: "boolean",
      title: "Result",
      description:
        "If result is true, the message was received and the respective operation was performed successfully.  If result is false, the message was received and the respective operation was not performed successfully. ",
    },
    StatusCode: componentsSchemasStatusCode,
    SessionID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Sessionid",
      description:
        "The Hubject SessionID that identifies the process  A string that `MUST` be valid with respect to the following regular expression:  `^[A-Za-z0-9]{8}(-[A-Za-z0-9]{4}){3}-[A-Za-z0-9]{12}$`  The expression validates the string as a GUID.  Example: â€œb2688855-7f00-0002-6d8e-48d883f6abb6â€ ",
    },
    CPOPartnerSessionID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Cpopartnersessionid",
      description:
        "Optional field containing the session id assigned by the CPO to the related operation.",
    },
    EMPPartnerSessionID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Emppartnersessionid",
      description:
        "Optional field containing the session id assigned by an EMP to the related operation.",
    },
  },
  type: "object",
  required: ["Result", "StatusCode"],
  title: "ERoamingAcknowledgment",
  description:
    "The acknowledgement is a message that is sent in response to several requests.  * To `SEND` and `RECEIVE` * Implementation: `MANDATORY` ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingAcknowledgment",
  ...schema,
} as const;
export { with$id };

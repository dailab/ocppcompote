import componentsSchemasStatusCode from "./StatusCode";
import componentsSchemasProviderID from "./ProviderID";
import componentsSchemasSessionID from "./SessionID";

const schema = {
  type: "object",
  description:
    "Note:\n  * To `RECEIVE`\n  * Implementation: `OPTIONAL`\n\neRoamingAuthorizeStop is a message to request an authorization for stopping a charging process.\n\nNote:\n\nThis message describes the response which has to be received in return to the eRoamingAuthorizeStop request.\n",
  required: ["AuthorizationStatus", "StatusCode"],
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
    AuthorizationStatus: {
      type: "string",
      enum: ["Authorized", "NotAuthorized"],
      description:
        "Information specifying whether the user is authorized to charge or not.\n\n| Option | Description |\n| ------ | ----------- |\n| Authorized | User is authorized |\n| NotAuthorized | User is not authorized |\n",
    },
    StatusCode: componentsSchemasStatusCode,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingAuthorizationStop",
  ...schema,
} as const;
export { with$id };

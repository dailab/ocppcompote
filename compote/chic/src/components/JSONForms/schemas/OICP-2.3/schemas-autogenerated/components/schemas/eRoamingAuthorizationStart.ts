import componentsSchemasRemoteIdentification from "./RemoteIdentification";
import componentsSchemasPlugAndChargeIdentification from "./PlugAndChargeIdentification";
import componentsSchemasQRCodeIdentification from "./QRCodeIdentification";
import componentsSchemasRFIDIdentification from "./RFIDIdentification";
import componentsSchemasRFIDMifareFamilyIdentification from "./RFIDMifareFamilyIdentification";
import componentsSchemasStatusCode from "./StatusCode";
import componentsSchemasProviderID from "./ProviderID";
import componentsSchemasSessionID from "./SessionID";

const schema = {
  type: "object",
  description:
    "Note:\n  * To `RECEIVE`\n  * Implementation: `MANDATORY`\n\neRoamingAuthorizationStart is a message that authorizes a user to charge a car. NOTE: This message describes the response which has to be receive in response to the eRoamingAuthorizeStart.\n",
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
    AuthorizationStopIdentifications: {
      type: "array",
      description:
        "A list of Identification data that is authorized to stop the charging process.",
      items: {
        type: "object",
        properties: {
          RFIDMifareFamilyIdentification:
            componentsSchemasRFIDMifareFamilyIdentification,
          RFIDIdentification: componentsSchemasRFIDIdentification,
          QRCodeIdentification: componentsSchemasQRCodeIdentification,
          PlugAndChargeIdentification:
            componentsSchemasPlugAndChargeIdentification,
          RemoteIdentification: componentsSchemasRemoteIdentification,
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingAuthorizationStart",
  ...schema,
} as const;
export { with$id };

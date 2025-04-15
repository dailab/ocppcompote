import componentsSchemasRemoteIdentification from "./RemoteIdentification";
import componentsSchemasPlugAndChargeIdentification from "./PlugAndChargeIdentification";
import componentsSchemasQRCodeIdentificationOutput from "./QRCodeIdentification-Output";
import componentsSchemasRFIDIdentification from "./RFIDIdentification";
import componentsSchemasRFIDMifareFamilyIdentification from "./RFIDMifareFamilyIdentification";

const schema = {
  properties: {
    RFIDMifareFamilyIdentification: {
      anyOf: [
        componentsSchemasRFIDMifareFamilyIdentification,
        {
          type: "null",
        },
      ],
    },
    RFIDIdentification: {
      anyOf: [
        componentsSchemasRFIDIdentification,
        {
          type: "null",
        },
      ],
    },
    QRCodeIdentification: {
      anyOf: [
        componentsSchemasQRCodeIdentificationOutput,
        {
          type: "null",
        },
      ],
    },
    PlugAndChargeIdentification: {
      anyOf: [
        componentsSchemasPlugAndChargeIdentification,
        {
          type: "null",
        },
      ],
    },
    RemoteIdentification: {
      anyOf: [
        componentsSchemasRemoteIdentification,
        {
          type: "null",
        },
      ],
    },
  },
  type: "object",
  title: "ERoamingAuthorizationStartAuthorizationStopIdentificationsInner",
  description:
    "ERoamingAuthorizationStartAuthorizationStopIdentificationsInner",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingAuthorizationStartAuthorizationStopIdentificationsInner",
  ...schema,
} as const;
export { with$id };

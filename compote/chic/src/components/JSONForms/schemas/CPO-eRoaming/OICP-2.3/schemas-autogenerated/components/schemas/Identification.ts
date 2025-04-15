import componentsSchemasRemoteIdentification from "./RemoteIdentification";
import componentsSchemasPlugAndChargeIdentification from "./PlugAndChargeIdentification";
import componentsSchemasQRCodeIdentificationInput from "./QRCodeIdentification-Input";
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
        componentsSchemasQRCodeIdentificationInput,
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
  title: "Identification",
  description:
    "Authentication data  1. The option RFIDIdentification `MUST` not be used in the eRoamingAuthorization process. For RFID Authorization, only the option RFIDMifareFamilyIdentification `SHOULD` be used in the respective eRoamingAuthorization messages. 2. For the Remote Authorization process, only the option RemoteIdentification MUST be used in the respective messages. ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/Identification",
  ...schema,
} as const;
export { with$id };

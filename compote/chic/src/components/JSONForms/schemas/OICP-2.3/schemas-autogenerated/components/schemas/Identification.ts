import componentsSchemasRemoteIdentification from "./RemoteIdentification";
import componentsSchemasPlugAndChargeIdentification from "./PlugAndChargeIdentification";
import componentsSchemasQRCodeIdentification from "./QRCodeIdentification";
import componentsSchemasRFIDIdentification from "./RFIDIdentification";
import componentsSchemasRFIDMifareFamilyIdentification from "./RFIDMifareFamilyIdentification";

const schema = {
  type: "object",
  description:
    "Authentication data\n\n1. The option RFIDIdentification `MUST` not be used in the eRoamingAuthorization process. For RFID Authorization, only the option RFIDMifareFamilyIdentification `SHOULD` be used in the respective eRoamingAuthorization messages.\n2. For the Remote Authorization process, only the option RemoteIdentification MUST be used in the respective messages.\n",
  properties: {
    RFIDMifareFamilyIdentification:
      componentsSchemasRFIDMifareFamilyIdentification,
    RFIDIdentification: componentsSchemasRFIDIdentification,
    QRCodeIdentification: componentsSchemasQRCodeIdentification,
    PlugAndChargeIdentification: componentsSchemasPlugAndChargeIdentification,
    RemoteIdentification: componentsSchemasRemoteIdentification,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/Identification",
  ...schema,
} as const;
export { with$id };

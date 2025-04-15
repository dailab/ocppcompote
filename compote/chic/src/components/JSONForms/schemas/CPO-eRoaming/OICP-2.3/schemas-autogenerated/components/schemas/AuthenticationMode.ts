const schema = {
  type: "string",
  enum: [
    "NFC RFID Classic",
    "NFC RFID DESFire",
    "PnC",
    "REMOTE",
    "Direct Payment",
    "No Authentication Required",
  ],
  title: "AuthenticationMode",
  description:
    "| Option | Description | | NFC RFID Classic | Defined authentication. | | NFC RFID DESFire | Defined authentication. | | PnC | ISO/IEC 15118. | | REMOTE | App, QR-Code, Phone. | | Direct Payment | Remote use via direct payment. E.g. intercharge direct | | No Authentication Required | Not Authentication Method Required | ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/AuthenticationMode",
  ...schema,
} as const;
export { with$id };

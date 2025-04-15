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
  description:
    "| Option | Description |\n| NFC RFID Classic | Defined authentication. |\n| NFC RFID DESFire | Defined authentication. |\n| PnC | ISO/IEC 15118. |\n| REMOTE | App, QR-Code, Phone. |\n| Direct Payment | Remote use via direct payment. E.g. intercharge direct |\n| No Authentication Required | Not Authentication Method Required |\n",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/AuthenticationMode",
  ...schema,
} as const;
export { with$id };

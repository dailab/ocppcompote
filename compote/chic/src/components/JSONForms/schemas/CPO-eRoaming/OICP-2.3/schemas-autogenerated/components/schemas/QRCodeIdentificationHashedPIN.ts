import componentsSchemasQRCodeIdentificationHashedPINLegacyHashData from "./QRCodeIdentificationHashedPINLegacyHashData";

const schema = {
  properties: {
    Value: {
      type: "string",
      title: "Value",
      description:
        "Hash value created by partner  The expression validates the string as a hash function result value with a length between 10 and 100 characters  Example: â€œa5ghdhf73hâ€ ",
    },
    Function: {
      type: "string",
      title: "Function",
      description: "Function that was used to generate the hash value.",
    },
    LegacyHashData: {
      anyOf: [
        componentsSchemasQRCodeIdentificationHashedPINLegacyHashData,
        {
          type: "null",
        },
      ],
    },
  },
  type: "object",
  required: ["Value", "Function"],
  title: "QRCodeIdentificationHashedPIN",
  description: "QRCodeIdentificationHashedPIN",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/QRCodeIdentificationHashedPIN",
  ...schema,
} as const;
export { with$id };

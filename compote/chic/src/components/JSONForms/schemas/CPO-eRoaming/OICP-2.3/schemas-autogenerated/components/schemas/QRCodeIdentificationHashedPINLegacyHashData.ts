const schema = {
  properties: {
    Function: {
      type: "string",
      title: "Function",
      description: "Function used for hashing of the PIN at the partner.",
    },
    Salt: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Salt",
      description: "The salt value used by the partner for hashing the PIN.",
    },
    Value: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Value",
      description: "PIN hash at the partner.",
    },
  },
  type: "object",
  required: ["Function"],
  title: "QRCodeIdentificationHashedPINLegacyHashData",
  description: "QRCodeIdentificationHashedPINLegacyHashData",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/QRCodeIdentificationHashedPINLegacyHashData",
  ...schema,
} as const;
export { with$id };

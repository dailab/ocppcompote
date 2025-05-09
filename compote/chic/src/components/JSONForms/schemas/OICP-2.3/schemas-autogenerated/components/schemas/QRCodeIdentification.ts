import componentsSchemasEvcoID from "./EvcoID";

const schema = {
  type: "object",
  required: ["EvcoID"],
  properties: {
    EvcoID: componentsSchemasEvcoID,
    HashedPIN: {
      type: "object",
      required: ["Value", "Function"],
      properties: {
        Value: {
          type: "string",
          pattern: "^[0-9A-Za-z\\\\.+/=\\\\$]{10,100}$",
          description:
            "Hash value created by partner\n\nThe expression validates the string as a hash function result value with a length between 10 and 100 characters\n\nExample: “a5ghdhf73h”\n",
        },
        Function: {
          type: "string",
          enum: ["Bcrypt"],
          description: "Function that was used to generate the hash value.",
        },
        LegacyHashData: {
          type: "object",
          required: ["Function"],
          properties: {
            Function: {
              type: "string",
              enum: ["MD5", "SHA-1"],
              description:
                "Function used for hashing of the PIN at the partner.",
            },
            Salt: {
              type: "string",
              minimum: 0,
              maximum: 100,
              description:
                "The salt value used by the partner for hashing the PIN.",
            },
            Value: {
              type: "string",
              minimum: 0,
              maximum: 20,
              description: "PIN hash at the partner.",
            },
          },
        },
      },
    },
    PIN: {
      type: "string",
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/QRCodeIdentification",
  ...schema,
} as const;
export { with$id };

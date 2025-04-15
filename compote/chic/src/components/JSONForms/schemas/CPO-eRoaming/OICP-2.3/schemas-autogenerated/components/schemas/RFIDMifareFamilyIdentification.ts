const schema = {
  properties: {
    UID: {
      type: "string",
      title: "Uid",
      description:
        "Authentication data details. The data structure differs depending on the authentication technology  The expression validates the string as a unique RFID with a length of 8, 14 or 20 characters.  Examples: â€œ7568290FFF765Fâ€ ",
    },
  },
  type: "object",
  required: ["UID"],
  title: "RFIDMifareFamilyIdentification",
  description:
    "Authentication data details. The data structure differs depending on the authentication technology ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/RFIDMifareFamilyIdentification",
  ...schema,
} as const;
export { with$id };

import componentsSchemasUID from "./UID";

const schema = {
  type: "object",
  description:
    "Authentication data details. The data structure differs depending on the authentication technology\n",
  properties: {
    UID: componentsSchemasUID,
  },
  required: ["UID"],
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/RFIDMifareFamilyIdentification",
  ...schema,
} as const;
export { with$id };

import componentsSchemasEvcoID from "./EvcoID";

const schema = {
  type: "object",
  description:
    "Authentication data details. The data structure differs depending on the authentication technology\n",
  properties: {
    EvcoID: componentsSchemasEvcoID,
  },
  required: ["EvcoID"],
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/RemoteIdentification",
  ...schema,
} as const;
export { with$id };

import componentsSchemasEvcoID from "./EvcoID";

const schema = {
  type: "object",
  description: "Authentication required for Plug&Charge (EMAID/EVCOID)\n",
  properties: {
    EvcoID: componentsSchemasEvcoID,
  },
  required: ["EvcoID"],
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/PlugAndChargeIdentification",
  ...schema,
} as const;
export { with$id };

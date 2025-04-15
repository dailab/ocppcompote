const schema = {
  properties: {
    key: {
      type: "string",
      title: "Key",
    },
    value: {
      title: "Value",
    },
  },
  type: "object",
  required: ["key", "value"],
  title: "OCPP16ChangeConfigurationProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16ChangeConfigurationProcessorBody",
  ...schema,
} as const;
export { with$id };

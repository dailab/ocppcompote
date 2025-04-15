const schema = {
  properties: {
    key: {
      items: {},
      type: "array",
      title: "Key",
    },
  },
  type: "object",
  title: "OCPP16GetConfigurationProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16GetConfigurationProcessorBody",
  ...schema,
} as const;
export { with$id };

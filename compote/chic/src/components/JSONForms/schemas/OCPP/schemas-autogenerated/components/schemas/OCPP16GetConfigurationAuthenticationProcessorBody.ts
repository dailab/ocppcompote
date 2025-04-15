const schema = {
  properties: {
    key: {
      items: {},
      type: "array",
      title: "Key",
      default: ["AuthorizationKey"],
    },
  },
  type: "object",
  title: "OCPP16GetConfigurationAuthenticationProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16GetConfigurationAuthenticationProcessorBody",
  ...schema,
} as const;
export { with$id };

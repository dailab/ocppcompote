const schema = {
  properties: {
    key: {
      type: "string",
      title: "Key",
      default: "AuthorizationKey",
    },
    value: {
      type: "string",
      title: "Value",
      default: "0001020304050607FFFFFFFFFFFFFFFFFFFFFFFF",
    },
  },
  type: "object",
  title: "OCPP16ChangeConfigurationAuthenticationProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16ChangeConfigurationAuthenticationProcessorBody",
  ...schema,
} as const;
export { with$id };

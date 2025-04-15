const schema = {
  properties: {
    get_variable_data: {
      items: {},
      type: "array",
      title: "Get Variable Data",
    },
    custom_data: {
      type: "object",
      title: "Custom Data",
    },
  },
  type: "object",
  title: "OCPP20GetVariablesProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20GetVariablesProcessorBody",
  ...schema,
} as const;
export { with$id };

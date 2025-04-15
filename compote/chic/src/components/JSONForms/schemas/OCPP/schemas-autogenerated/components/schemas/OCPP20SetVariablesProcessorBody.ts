const schema = {
  properties: {
    set_variable_data: {
      items: {},
      type: "array",
      title: "Set Variable Data",
    },
    custom_data: {
      anyOf: [
        {
          type: "object",
        },
        {
          type: "null",
        },
      ],
      title: "Custom Data",
    },
  },
  type: "object",
  required: ["set_variable_data"],
  title: "OCPP20SetVariablesProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20SetVariablesProcessorBody",
  ...schema,
} as const;
export { with$id };

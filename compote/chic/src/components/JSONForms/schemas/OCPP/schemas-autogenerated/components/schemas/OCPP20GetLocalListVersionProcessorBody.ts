const schema = {
  properties: {
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
  title: "OCPP20GetLocalListVersionProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20GetLocalListVersionProcessorBody",
  ...schema,
} as const;
export { with$id };

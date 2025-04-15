const schema = {
  properties: {
    request_id: {
      type: "integer",
      title: "Request Id",
    },
    component_variable: {
      anyOf: [
        {
          items: {},
          type: "array",
        },
        {
          type: "null",
        },
      ],
      title: "Component Variable",
    },
    component_criteria: {
      anyOf: [
        {
          items: {},
          type: "array",
        },
        {
          type: "null",
        },
      ],
      title: "Component Criteria",
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
  required: ["request_id"],
  title: "OCPP20GetReportProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20GetReportProcessorBody",
  ...schema,
} as const;
export { with$id };

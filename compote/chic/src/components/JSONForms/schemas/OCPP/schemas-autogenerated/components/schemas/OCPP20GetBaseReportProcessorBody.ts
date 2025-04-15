const schema = {
  properties: {
    request_id: {
      type: "integer",
      title: "Request Id",
    },
    report_base: {
      type: "string",
      title: "Report Base",
    },
    custom_data: {
      type: "object",
      title: "Custom Data",
    },
  },
  type: "object",
  required: ["request_id", "report_base"],
  title: "OCPP20GetBaseReportProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20GetBaseReportProcessorBody",
  ...schema,
} as const;
export { with$id };

const schema = {
  properties: {
    location: {
      type: "string",
      title: "Location",
    },
    retries: {
      type: "integer",
      title: "Retries",
    },
    retry_interval: {
      type: "integer",
      title: "Retry Interval",
    },
    start_time: {
      type: "string",
      title: "Start Time",
    },
    stop_time: {
      type: "string",
      title: "Stop Time",
    },
  },
  type: "object",
  required: ["location"],
  title: "OCPP16GetDiagnosticsProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16GetDiagnosticsProcessorBody",
  ...schema,
} as const;
export { with$id };

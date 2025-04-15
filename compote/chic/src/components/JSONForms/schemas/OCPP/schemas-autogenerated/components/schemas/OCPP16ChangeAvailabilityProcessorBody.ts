const schema = {
  properties: {
    connector_id: {
      type: "integer",
      title: "Connector Id",
    },
    type: {
      title: "Type",
    },
  },
  type: "object",
  required: ["connector_id"],
  title: "OCPP16ChangeAvailabilityProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16ChangeAvailabilityProcessorBody",
  ...schema,
} as const;
export { with$id };

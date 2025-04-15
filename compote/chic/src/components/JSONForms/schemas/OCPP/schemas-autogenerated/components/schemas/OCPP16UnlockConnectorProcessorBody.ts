const schema = {
  properties: {
    connector_id: {
      type: "integer",
      title: "Connector Id",
    },
  },
  type: "object",
  required: ["connector_id"],
  title: "OCPP16UnlockConnectorProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16UnlockConnectorProcessorBody",
  ...schema,
} as const;
export { with$id };

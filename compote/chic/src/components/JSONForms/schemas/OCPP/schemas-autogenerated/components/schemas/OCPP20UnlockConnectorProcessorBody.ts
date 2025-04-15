const schema = {
  properties: {
    evse_id: {
      type: "integer",
      title: "Evse Id",
    },
    connector_id: {
      type: "integer",
      title: "Connector Id",
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
  required: ["evse_id", "connector_id"],
  title: "OCPP20UnlockConnectorProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20UnlockConnectorProcessorBody",
  ...schema,
} as const;
export { with$id };

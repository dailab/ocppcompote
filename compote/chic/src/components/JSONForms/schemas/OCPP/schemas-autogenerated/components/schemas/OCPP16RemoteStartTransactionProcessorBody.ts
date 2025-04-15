const schema = {
  properties: {
    id_tag: {
      type: "string",
      title: "Id Tag",
    },
    connector_id: {
      type: "integer",
      title: "Connector Id",
    },
    charging_profile: {
      type: "object",
      title: "Charging Profile",
    },
  },
  type: "object",
  required: ["id_tag"],
  title: "OCPP16RemoteStartTransactionProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16RemoteStartTransactionProcessorBody",
  ...schema,
} as const;
export { with$id };

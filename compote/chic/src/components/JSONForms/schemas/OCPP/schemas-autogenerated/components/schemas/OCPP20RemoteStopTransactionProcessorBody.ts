const schema = {
  properties: {
    transaction_id: {
      type: "string",
      title: "Transaction Id",
    },
    custom_data: {
      type: "object",
      title: "Custom Data",
    },
  },
  type: "object",
  required: ["transaction_id"],
  title: "OCPP20RemoteStopTransactionProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20RemoteStopTransactionProcessorBody",
  ...schema,
} as const;
export { with$id };

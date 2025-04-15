const schema = {
  properties: {
    transaction_id: {
      type: "integer",
      title: "Transaction Id",
    },
  },
  type: "object",
  required: ["transaction_id"],
  title: "OCPP16RemoteStopTransactionProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16RemoteStopTransactionProcessorBody",
  ...schema,
} as const;
export { with$id };

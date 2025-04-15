const schema = {
  properties: {
    vendor_id: {
      type: "string",
      title: "Vendor Id",
    },
    message_id: {
      type: "string",
      title: "Message Id",
    },
    data: {
      type: "string",
      title: "Data",
    },
    custom_data: {
      type: "object",
      title: "Custom Data",
    },
  },
  type: "object",
  required: ["vendor_id"],
  title: "OCPP20SendDataTransferProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20SendDataTransferProcessorBody",
  ...schema,
} as const;
export { with$id };

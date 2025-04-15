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
  },
  type: "object",
  required: ["vendor_id"],
  title: "OCPP16SendDataTransferV2GCertificateProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16SendDataTransferV2GCertificateProcessorBody",
  ...schema,
} as const;
export { with$id };

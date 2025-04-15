const schema = {
  type: "string",
  enum: [
    "BootNotification",
    "FirmwareStatusNotification",
    "Heartbeat",
    "MeterValues",
    "StatusNotification",
    "DiagnosticsStatusNotification",
    "LogStatusNotification",
    "SignChargePointCertificate",
    "BootNotification",
    "DiagnosticsStatusNotification",
    "FirmwareStatusNotification",
    "MeterValues",
    "StatusNotification",
  ],
  title: "MessageTrigger",
  description: "Type of request to be triggered in a TriggerMessage.req",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/MessageTrigger",
  ...schema,
} as const;
export { with$id };

import componentsSchemasMessageTrigger from "./MessageTrigger";

const schema = {
  properties: {
    requested_message: componentsSchemasMessageTrigger,
    connector_id: {
      type: "integer",
      title: "Connector Id",
    },
  },
  type: "object",
  required: ["requested_message", "connector_id"],
  title: "OCPP16ExtendedTriggerMessageProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16ExtendedTriggerMessageProcessorBody",
  ...schema,
} as const;
export { with$id };

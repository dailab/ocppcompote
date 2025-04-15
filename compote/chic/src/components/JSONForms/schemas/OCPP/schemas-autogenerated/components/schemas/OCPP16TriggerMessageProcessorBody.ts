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
  title: "OCPP16TriggerMessageProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16TriggerMessageProcessorBody",
  ...schema,
} as const;
export { with$id };

import componentsSchemasResetType from "./ResetType";

const schema = {
  properties: {
    type: componentsSchemasResetType,
  },
  type: "object",
  required: ["type"],
  title: "OCPP16ResetProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16ResetProcessorBody",
  ...schema,
} as const;
export { with$id };

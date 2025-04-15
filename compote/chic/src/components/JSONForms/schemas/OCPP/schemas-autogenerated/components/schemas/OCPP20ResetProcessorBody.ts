import componentsSchemasResetType from "./ResetType";

const schema = {
  properties: {
    type: componentsSchemasResetType,
    evse_id: {
      anyOf: [
        {
          type: "integer",
        },
        {
          type: "null",
        },
      ],
      title: "Evse Id",
    },
    custom_data: {
      type: "object",
      title: "Custom Data",
    },
  },
  type: "object",
  required: ["type"],
  title: "OCPP20ResetProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20ResetProcessorBody",
  ...schema,
} as const;
export { with$id };

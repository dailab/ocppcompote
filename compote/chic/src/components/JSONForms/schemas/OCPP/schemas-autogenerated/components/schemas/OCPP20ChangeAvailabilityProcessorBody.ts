const schema = {
  properties: {
    operational_status: {
      type: "string",
      title: "Operational Status",
    },
    evse: {
      anyOf: [
        {
          type: "object",
        },
        {
          type: "null",
        },
      ],
      title: "Evse",
    },
    custom_data: {
      type: "object",
      title: "Custom Data",
    },
  },
  type: "object",
  required: ["operational_status", "evse"],
  title: "OCPP20ChangeAvailabilityProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20ChangeAvailabilityProcessorBody",
  ...schema,
} as const;
export { with$id };

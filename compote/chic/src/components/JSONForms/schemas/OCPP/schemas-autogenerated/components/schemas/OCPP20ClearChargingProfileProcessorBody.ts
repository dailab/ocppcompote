const schema = {
  properties: {
    charging_profile_id: {
      anyOf: [
        {
          type: "integer",
        },
        {
          type: "null",
        },
      ],
      title: "Charging Profile Id",
    },
    charging_profile_criteria: {
      anyOf: [
        {
          type: "object",
        },
        {
          type: "null",
        },
      ],
      title: "Charging Profile Criteria",
    },
    custom_data: {
      type: "object",
      title: "Custom Data",
    },
  },
  type: "object",
  title: "OCPP20ClearChargingProfileProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20ClearChargingProfileProcessorBody",
  ...schema,
} as const;
export { with$id };

import componentsSchemasChargingProfilePurposeType from "./ChargingProfilePurposeType";

const schema = {
  properties: {
    id: {
      type: "integer",
      title: "Id",
    },
    connector_id: {
      type: "integer",
      title: "Connector Id",
    },
    charging_profile_purpose: componentsSchemasChargingProfilePurposeType,
    stack_level: {
      type: "integer",
      title: "Stack Level",
    },
  },
  type: "object",
  required: ["id", "connector_id", "charging_profile_purpose", "stack_level"],
  title: "OCPP16ClearChargingProfileProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16ClearChargingProfileProcessorBody",
  ...schema,
} as const;
export { with$id };

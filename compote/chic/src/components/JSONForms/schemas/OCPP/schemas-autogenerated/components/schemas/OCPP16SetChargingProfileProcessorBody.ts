const schema = {
  properties: {
    connector_id: {
      title: "Connector Id",
      default: 1,
    },
    charging_profile: {
      title: "Charging Profile",
    },
  },
  type: "object",
  title: "OCPP16SetChargingProfileProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16SetChargingProfileProcessorBody",
  ...schema,
} as const;
export { with$id };

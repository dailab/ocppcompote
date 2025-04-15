import componentsSchemasChargingRateUnitType from "./ChargingRateUnitType";

const schema = {
  properties: {
    connector_id: {
      type: "integer",
      title: "Connector Id",
    },
    duration: {
      type: "integer",
      title: "Duration",
    },
    charging_rate_unit: componentsSchemasChargingRateUnitType,
  },
  type: "object",
  required: ["connector_id", "duration"],
  title: "OCPP16GetCompositeScheduleProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16GetCompositeScheduleProcessorBody",
  ...schema,
} as const;
export { with$id };

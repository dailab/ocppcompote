const schema = {
  type: "string",
  enum: ["W", "A"],
  title: "ChargingRateUnitType",
  description:
    "Unit in which a charging schedule is defined, as used in:\nGetCompositeSchedule.req and ChargingSchedule",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ChargingRateUnitType",
  ...schema,
} as const;
export { with$id };

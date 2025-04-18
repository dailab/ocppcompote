const schema = {
  type: "string",
  enum: [
    "Reservation",
    "DynamicPricing",
    "ParkingSensors",
    "MaximumPowerCharging",
    "PredictiveChargePointUsage",
    "ChargingPlans",
    "RoofProvided",
    "None",
  ],
  title: "ValueAddedService",
  description:
    "| Option | Description | | ------ | ----------- | | Reservation | Can an EV driver reserve the charging sport via remote services? | | DynamicPricing | Does the EVSE ID support dynamic pricing? | | ParkingSensors | Is dynamic status info on the parking area in front of the EVSE-ID available? | | MaximumPowerCharging | Does the EVSE-ID offer a dynamic maximum power charging? | | PredictiveChargePointUsage | Is predictive charge Point usage info available for the EVSE-ID? | | ChargingPlans | Does the EVSE-ID offer charging plans, e.g. As described in ISO15118-2? | | RoofProvided | Indicates if the charging station is under a roof | | None | There are no value-added services available. | ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ValueAddedService",
  ...schema,
} as const;
export { with$id };

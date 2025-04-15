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
  description:
    "| Option | Description |\n| ------ | ----------- |\n| Reservation | Can an EV driver reserve the charging sport via remote services? |\n| DynamicPricing | Does the EVSE ID support dynamic pricing? |\n| ParkingSensors | Is dynamic status info on the parking area in front of the EVSE-ID available? |\n| MaximumPowerCharging | Does the EVSE-ID offer a dynamic maximum power charging? |\n| PredictiveChargePointUsage | Is predictive charge Point usage info available for the EVSE-ID? |\n| ChargingPlans | Does the EVSE-ID offer charging plans, e.g. As described in ISO15118-2? |\n| RoofProvided | Indicates if the charging station is under a roof |\n| None | There are no value-added services available. |\n",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ValueAddedService",
  ...schema,
} as const;
export { with$id };

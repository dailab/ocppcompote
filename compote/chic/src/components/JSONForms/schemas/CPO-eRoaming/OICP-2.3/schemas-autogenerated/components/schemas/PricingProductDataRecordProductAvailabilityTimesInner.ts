import componentsSchemasPricingProductDataRecordProductAvailabilityTimesInnerPeriodsInner from "./PricingProductDataRecordProductAvailabilityTimesInnerPeriodsInner";

const schema = {
  properties: {
    Periods: {
      items:
        componentsSchemasPricingProductDataRecordProductAvailabilityTimesInnerPeriodsInner,
      type: "array",
      title: "Periods",
    },
    on: {
      type: "string",
      title: "On",
      description:
        "Day values to be used in specifying periods on which the product is available. Workdays = Monday â€“ Friday, Weekend = Saturday â€“ Sunday",
    },
  },
  type: "object",
  required: ["Periods", "on"],
  title: "PricingProductDataRecordProductAvailabilityTimesInner",
  description: "PricingProductDataRecordProductAvailabilityTimesInner",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/PricingProductDataRecordProductAvailabilityTimesInner",
  ...schema,
} as const;
export { with$id };

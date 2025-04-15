const schema = {
  properties: {
    begin: {
      type: "string",
      title: "Begin",
      description: "The opening time",
    },
    end: {
      type: "string",
      title: "End",
      description: "The closing time",
    },
  },
  type: "object",
  required: ["begin", "end"],
  title: "PricingProductDataRecordProductAvailabilityTimesInnerPeriodsInner",
  description:
    "The starting and end time for pricing product applicability in the specified period ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/PricingProductDataRecordProductAvailabilityTimesInnerPeriodsInner",
  ...schema,
} as const;
export { with$id };

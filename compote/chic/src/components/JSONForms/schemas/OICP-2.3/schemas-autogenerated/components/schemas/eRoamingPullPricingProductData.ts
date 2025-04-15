import componentsSchemasOperatorID from "./OperatorID";

const schema = {
  type: "object",
  description:
    "eRoamingPullPricingProductData is a message that is sent in order to request the download of pricing data available in the HBS for an EMP.",
  required: ["OperatorIDs"],
  properties: {
    LastCall: {
      type: "string",
      format: "date-time",
      description:
        "In case that this field is set, Hubject does not return the entire set of currently valid pricing products data but just the changes that have taken places since the last call date/time value.",
    },
    OperatorIDs: {
      type: "array",
      description:
        "A list of Operator Ids in ISO or DIN standard to download pricing data pushed by one or more operators.",
      items: componentsSchemasOperatorID,
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingPullPricingProductData",
  ...schema,
} as const;
export { with$id };

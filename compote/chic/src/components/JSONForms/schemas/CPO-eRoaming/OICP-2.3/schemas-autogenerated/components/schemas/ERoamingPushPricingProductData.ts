import componentsSchemasERoamingPushPricingProductDataPricingProductData from "./ERoamingPushPricingProductDataPricingProductData";

const schema = {
  properties: {
    ActionType: {
      type: "string",
      title: "Actiontype",
      description:
        "Describes the action that has to be performed by Hubject with the provided data.",
    },
    PricingProductData:
      componentsSchemasERoamingPushPricingProductDataPricingProductData,
  },
  type: "object",
  required: ["ActionType", "PricingProductData"],
  title: "ERoamingPushPricingProductData",
  description:
    "eRoamingPushPricingProductData is a message that is sent in order to upload data pertaining to a CPOâ€™s pricing products (i.e. tarrifs) to the Hubject system.",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingPushPricingProductData",
  ...schema,
} as const;
export { with$id };

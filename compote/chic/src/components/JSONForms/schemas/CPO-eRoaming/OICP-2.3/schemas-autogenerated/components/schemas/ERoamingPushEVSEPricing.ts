import componentsSchemasERoamingPushEVSEPricingEVSEPricingInner from "./ERoamingPushEVSEPricingEVSEPricingInner";

const schema = {
  properties: {
    ActionType: {
      type: "string",
      title: "Actiontype",
      description:
        "Describes the action that has to be performed by Hubject with the provided data.",
    },
    EVSEPricing: {
      items: componentsSchemasERoamingPushEVSEPricingEVSEPricingInner,
      type: "array",
      title: "Evsepricing",
      description:
        "A list of EVSEs and their respective pricing product relation",
    },
  },
  type: "object",
  required: ["ActionType", "EVSEPricing"],
  title: "ERoamingPushEVSEPricing",
  description:
    "eRoamingPushEVSEPricing is a message that is sent in order to upload a list of EVSEs and the pricing products (i.e. tarrifs) applicable for (charging or reservation) sessions at these EVSEs.",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingPushEVSEPricing",
  ...schema,
} as const;
export { with$id };

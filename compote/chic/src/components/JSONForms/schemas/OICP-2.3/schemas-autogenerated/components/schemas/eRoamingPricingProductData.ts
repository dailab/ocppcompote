import componentsSchemasStatusCode from "./StatusCode";
import componentsSchemasPricingProductDataRecord from "./PricingProductDataRecord";
import componentsSchemasReferenceUnit from "./ReferenceUnit";
import componentsSchemasCurrencyID from "./CurrencyID";
import componentsSchemasProviderIDAsterisk from "./ProviderIDAsterisk";
import componentsSchemasOperatorID from "./OperatorID";

const schema = {
  type: "object",
  description:
    "eRoamingPricingProductData is sent in response to eRoamingPullPricingProductData requests.\n\nNote:\n  * This message describes the response which has to be sent in reply to the eRoamingPullPricingProductData request.\n",
  required: ["PricingProductData"],
  properties: {
    PricingProductData: {
      type: "array",
      description:
        "List of pricing products offered by operators for a specific provider",
      items: {
        type: "object",
        required: [
          "OperatorID",
          "ProviderID",
          "PricingDefaultPrice",
          "PricingDefaultPriceCurrency",
          "PricingDefaultReferenceUnit",
          "PricingProductDataRecords",
        ],
        properties: {
          OperatorID: componentsSchemasOperatorID,
          OperatorName: {
            type: "string",
            description: "Free text for operator",
            maximum: 100,
          },
          ProviderID: componentsSchemasProviderIDAsterisk,
          PricingDefaultPrice: {
            type: "number",
            description:
              "A default price for pricing sessions at undefined EVSEs",
          },
          PricingDefaultPriceCurrency: componentsSchemasCurrencyID,
          PricingDefaultReferenceUnit: componentsSchemasReferenceUnit,
          PricingProductDataRecords: {
            type: "array",
            description: "A list of pricing products",
            items: componentsSchemasPricingProductDataRecord,
          },
        },
      },
    },
    StatusCode: componentsSchemasStatusCode,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingPricingProductData",
  ...schema,
} as const;
export { with$id };

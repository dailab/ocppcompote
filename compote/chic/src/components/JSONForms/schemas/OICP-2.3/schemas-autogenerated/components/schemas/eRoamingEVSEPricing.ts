import componentsSchemasStatusCode from "./StatusCode";
import componentsSchemasProductID from "./ProductID";
import componentsSchemasProviderID from "./ProviderID";
import componentsSchemasEvseID from "./EvseID";
import componentsSchemasOperatorID from "./OperatorID";

const schema = {
  type: "object",
  description:
    "eRoamingEVSEPricing is sent by the HBS in response to eRoamingPullEVSEPricing requests.\n\nNote:\n  * This message describes the response which has to be sent in reply to the eRoamingPullEVSEPricing request.\n",
  required: ["EVSEPricing"],
  properties: {
    EVSEPricing: {
      type: "array",
      description: "A list of EVSE pricing data blocks for specific operators",
      items: {
        type: "object",
        required: ["OperatorID", "EVSEPricing"],
        properties: {
          OperatorID: componentsSchemasOperatorID,
          OperatorName: {
            type: "string",
            description: "Free text for operator",
            maximum: 100,
          },
          EVSEPricing: {
            type: "array",
            description: "List of EVSE pricings offered by the operator.",
            items: {
              type: "object",
              required: ["EvseID", "ProviderID", "EvseIDProductList"],
              properties: {
                EvseID: componentsSchemasEvseID,
                ProviderID: componentsSchemasProviderID,
                EvseIDProductList: {
                  type: "array",
                  description:
                    "A list of pricing products applicable per EvseID",
                  items: componentsSchemasProductID,
                },
              },
            },
          },
        },
      },
    },
    StatusCode: componentsSchemasStatusCode,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingEVSEPricing",
  ...schema,
} as const;
export { with$id };

import componentsSchemasERoamingPricingProductData from "./../components/schemas/eRoamingPricingProductData";
import componentsSchemasERoamingPullPricingProductData from "./../components/schemas/eRoamingPullPricingProductData";

const schema = {
  post: {
    summary: "eRoamingPullPricingProductData_V1.0",
    operationId: "eRoamingPullPricingProductData_V1.0",
    description:
      '__Note:__\n  * To `SEND`\n  * Implementation: `OPTIONAL`\n  \n  When an EMP sends an eRoamingPullPricingProductData request, Hubject checks whether there is a valid flexible/dynamic pricing business contract (for the service type Authorization) between the EMP and the CPOs whose OperatorIDs are sent in the request. If so, the operation allows the download of pricing product data pushed to the HBS by these CPOs for the requesting EMP. When this request is received from an EMP, currently valid pricing products data available in the HBS for the requesting EMP (and pushed by CPOs whose OperatorIDs are supplied in the request) are grouped by OperatorID and sent in response to the request.\n\n  The operation also allows the use of the LastCall filter. When the LastCall filter is used, only pricing product data changes that have taken place after the date/time value provided in the “LastCall" field of the request are sent to the EMP.\n',
    tags: ["eRoamingDynamicPricing"],
    parameters: {
      path: {
        properties: {
          providerID: {
            type: "string",
          },
        },
        required: ["providerID"],
        type: "object",
      },
    },
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: componentsSchemasERoamingPullPricingProductData,
        },
      },
    },
    responses: {
      "200": {
        description: "Expected response to a valid request",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingPricingProductData,
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/paths/_dynamicpricing_v10_providers_{providerID}_pricing-products",
  ...schema,
} as const;
export { with$id };

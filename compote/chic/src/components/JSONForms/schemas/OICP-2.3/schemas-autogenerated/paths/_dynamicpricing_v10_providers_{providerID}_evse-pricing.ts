import componentsSchemasERoamingEVSEPricing from "./../components/schemas/eRoamingEVSEPricing";
import componentsSchemasERoamingPullEVSEPricing from "./../components/schemas/eRoamingPullEVSEPricing";

const schema = {
  post: {
    summary: "eRoamingPullEVSEPricing_V1.0",
    operationId: "eRoamingPullEVSEPricing_V1.0",
    description:
      '__Note:__\n  * To `SEND`\n  * Implementation: `OPTIONAL`\n\nWhen an EMP sends an eRoamingPullPricingProductData request, Hubject checks whether there is a valid flexible/dynamic pricing business contract (for the service type Authorization) between the EMP and the CPOs whose OperatorIDs are sent in the request. If so, the operation allows the download of EVSE pricing data pushed to the HBS by these CPOs for the requesting EMP. When this request is received from an EMP, currently valid EVSE pricing data available in the HBS for the requesting EMP are grouped by OperatorID and sent in response to the request.\n\nThe operation also allows the use of the LastCall filter. When the LastCall filter is used, only EVSE pricing data changes that have taken place after the date/time value provided in the “LastCall" field of the request are sent to the EMP.\n',
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
          schema: componentsSchemasERoamingPullEVSEPricing,
        },
      },
    },
    responses: {
      "200": {
        description: "Expected response to a valid request",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingEVSEPricing,
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/paths/_dynamicpricing_v10_providers_{providerID}_evse-pricing",
  ...schema,
} as const;
export { with$id };

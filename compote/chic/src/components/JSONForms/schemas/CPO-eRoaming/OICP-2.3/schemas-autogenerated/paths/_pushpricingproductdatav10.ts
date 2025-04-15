import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasERoamingAcknowledgment from "./../components/schemas/ERoamingAcknowledgment";
import componentsSchemasERoamingPushPricingProductData from "./../components/schemas/ERoamingPushPricingProductData";

const schema = {
  post: {
    tags: ["CPO OICP Client API"],
    summary: "Eroamingpushpricingproductdata V10",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `OPTIONAL`\n\n  When a CPO sends an eRoamingPushPricingProductData request, Hubject checks whether there is a valid flexible/dynamic pricing service offer (for the service type Authorization) created by the CPO. If so, the operation allows the upload of pricing product data to Hubject. In addition, it is also possible to update or delete pricing data previously pushed with an upload operation request. How the transferred data is to be processed `MUST` be defined in the â€œActionTypeâ€ field of the request. Four processing options (i.e. Action Types) exist, details of which can be seen in eRoamingPushPricingProductData message\n\n  The pricing product data to be processed `MUST` be provided in the â€œPricingProductDataâ€ field, which consists of â€œPricingProductDataRecordâ€ structures. Hubject keeps a history of all updated and changed data records. Every successful push operation â€“ irrespective of the performed action â€“ leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of pricing data for every point in time in the past.",
    operationId:
      "eRoamingPushPricingProductData_V10_pushpricingproductdatav10_post",
    parameters: {
      query: {
        properties: {
          operatorID: {
            type: "string",
            title: "Operatorid",
          },
        },
        required: ["operatorID"],
        type: "object",
      },
    },
    requestBody: {
      content: {
        "application/json": {
          schema: componentsSchemasERoamingPushPricingProductData,
        },
      },
    },
    responses: {
      "200": {
        description: "Successful Response",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingAcknowledgment,
          },
        },
      },
      "422": {
        description: "Validation Error",
        content: {
          "application/json": {
            schema: componentsSchemasHTTPValidationError,
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/paths/_pushpricingproductdatav10",
  ...schema,
} as const;
export { with$id };

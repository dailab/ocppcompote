import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasERoamingAcknowledgment from "./../components/schemas/ERoamingAcknowledgment";
import componentsSchemasERoamingPushEVSEPricing from "./../components/schemas/ERoamingPushEVSEPricing";

const schema = {
  post: {
    tags: ["CPO OICP Client API"],
    summary: "Eroamingpushevsepricing V10",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `OPTIONAL`\nWhen a CPO sends an eRoamingPushEVSEPricing request, Hubject checks whether there is a valid flexible/dynamic pricing service offer (for the service type Authorization) created by the CPO. If so, the operation allows the upload of a list containing pricing product assignment to EvseIDs to Hubject. In addition, it is also possible to update or delete EVSE pricing data previously pushed with an upload operation request. How the transferred data is to be processed `MUST` be defined in the â€œActionTypeâ€ field of the request. Four processing options (i.e. Action Types) exist, details of which can be seen in section eRoamingPushEVSEPricing).\n\nThe EVSE pricing data to be processed `MUST` be provided in the â€œEVSEPricingâ€ field, which consists of â€œEvseIDProductListâ€ structures. Hubject keeps a history of all updated and changed data records. Every successful push operation â€“ irrespective of the performed action â€“ leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of EVSE pricing data for every point in time in the past.\n\nEVSE consistency:\n\nEvseIDs contain the ID of the corresponding CPO (With every EVSE pricing data upload operation, Hubject checks whether the given CPOâ€™s OperatorID or Sub-OperatorIDs if necessary) matches every given EvseID sent in the request. If not, Hubject refuses the data upload and responds with the status code 018.\n\nNote\n\nThe eRoamingPushEVSEPricing operation `MUST` always be used sequentially.",
    operationId: "eRoamingPushEVSEPricing_V10_pushevsepricingv10_post",
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
          schema: componentsSchemasERoamingPushEVSEPricing,
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

const with$id = { $id: "/paths/_pushevsepricingv10", ...schema } as const;
export { with$id };

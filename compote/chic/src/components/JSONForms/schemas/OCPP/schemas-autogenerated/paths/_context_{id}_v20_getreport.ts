import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasOCPP20GetReportProcessorBody from "./../components/schemas/OCPP20GetReportProcessorBody";

const schema = {
  post: {
    tags: ["OCPPv201"],
    summary: "Route Handler",
    operationId: "route_handler_context__id__v20_getreport_post",
    parameters: {
      path: {
        properties: {
          id: {
            type: "integer",
            title: "Id",
          },
        },
        required: ["id"],
        type: "object",
      },
    },
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: componentsSchemasOCPP20GetReportProcessorBody,
        },
      },
    },
    responses: {
      "200": {
        description: "Successful Response",
        content: {
          "application/json": {
            schema: {},
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
  $id: "/paths/_context_{id}_v20_getreport",
  ...schema,
} as const;
export { with$id };

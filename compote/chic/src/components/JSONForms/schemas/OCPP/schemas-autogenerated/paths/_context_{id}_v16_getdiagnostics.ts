import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasOCPP16GetDiagnosticsProcessorBody from "./../components/schemas/OCPP16GetDiagnosticsProcessorBody";

const schema = {
  post: {
    tags: ["OCPPv16"],
    summary: "Route Handler",
    operationId: "route_handler_context__id__v16_getdiagnostics_post",
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
          schema: componentsSchemasOCPP16GetDiagnosticsProcessorBody,
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
  $id: "/paths/_context_{id}_v16_getdiagnostics",
  ...schema,
} as const;
export { with$id };

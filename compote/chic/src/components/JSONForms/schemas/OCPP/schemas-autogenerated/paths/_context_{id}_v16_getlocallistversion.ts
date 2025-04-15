import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasOCPP16GetLocalListVersionProcessorBody from "./../components/schemas/OCPP16GetLocalListVersionProcessorBody";

const schema = {
  post: {
    tags: ["OCPPv16"],
    summary: "Route Handler",
    operationId: "route_handler_context__id__v16_getlocallistversion_post",
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
          schema: componentsSchemasOCPP16GetLocalListVersionProcessorBody,
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
  $id: "/paths/_context_{id}_v16_getlocallistversion",
  ...schema,
} as const;
export { with$id };

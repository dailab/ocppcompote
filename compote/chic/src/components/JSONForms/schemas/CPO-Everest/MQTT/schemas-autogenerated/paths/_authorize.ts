import componentsSchemasHTTPValidationError from "../components/schemas/HTTPValidationError";

const schema = {
  post: {
    tags: ["Context Management"],
    summary: "Authorize",
    operationId: "authorize_authorize_post",
    parameters: {
      query: {
        properties: {
          token: {
            type: "string",
            default: "ABC12345",
            title: "Token",
          },
          connector_id: {
            type: "integer",
            default: 1,
            title: "Connector Id",
          },
        },
        required: [],
        type: "object",
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

const with$id = { $id: "/paths/_authorize", ...schema } as const;
export { with$id };

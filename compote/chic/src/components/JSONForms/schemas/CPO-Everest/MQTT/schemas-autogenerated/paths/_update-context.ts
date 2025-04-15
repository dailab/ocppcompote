import componentsSchemasHTTPValidationError from "../components/schemas/HTTPValidationError";

const schema = {
  post: {
    tags: ["Context Management"],
    summary: "Update Context",
    operationId: "update_context_update_context_post",
    parameters: {
      query: {
        properties: {
          key: {
            type: "string",
            title: "Key",
          },
          value: {
            type: "string",
            title: "Value",
          },
        },
        required: ["key", "value"],
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

const with$id = { $id: "/paths/_update-context", ...schema } as const;
export { with$id };

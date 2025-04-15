import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";

const schema = {
  get: {
    tags: ["Context"],
    summary: "Context Messages",
    description:
      "Handle a specific route for a given request based on matched id and extracted values\nArgs:\n    request: the request to handle, containing an context id\nReturns:\n    dict: the content of the current csms context for a given id",
    operationId: "context_messages_context__context_id__messages_get",
    parameters: {
      path: {
        properties: {
          context_id: {
            type: "string",
            title: "Context Id",
          },
        },
        required: ["context_id"],
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

const with$id = {
  $id: "/paths/_context_{context_id}_messages",
  ...schema,
} as const;
export { with$id };

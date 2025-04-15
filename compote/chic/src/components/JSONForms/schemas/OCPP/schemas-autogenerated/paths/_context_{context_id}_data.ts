import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";

const schema = {
  post: {
    tags: ["Context"],
    summary: "Context Field",
    description:
      "Handle a specific route for a given request based on matched id and extracted values\n\nArgs:\n    context_id: the context ID from the path\n    fields: list of fields to extract from the context data\n\nReturns:\n    A dict containing either all of the context data (if fields is empty)\n    or a subset of the data filtered by `fields`.",
    operationId: "context_field_context__context_id__data_post",
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
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "string",
            },
            title: "Fields",
          },
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
  $id: "/paths/_context_{context_id}_data",
  ...schema,
} as const;
export { with$id };

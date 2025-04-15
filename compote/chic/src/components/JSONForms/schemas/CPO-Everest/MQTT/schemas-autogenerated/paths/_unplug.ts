import componentsSchemasHTTPValidationError from "../components/schemas/HTTPValidationError";

const schema = {
  post: {
    tags: ["Context Management"],
    summary: "Unplug",
    operationId: "unplug_unplug_post",
    parameters: {
      query: {
        properties: {
          commands: {
            type: "string",
            default: "unplug",
            title: "Commands",
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

const with$id = { $id: "/paths/_unplug", ...schema } as const;
export { with$id };

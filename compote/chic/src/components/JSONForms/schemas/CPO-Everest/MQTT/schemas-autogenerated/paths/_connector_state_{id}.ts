import componentsSchemasHTTPValidationError from "../components/schemas/HTTPValidationError";

const schema = {
  get: {
    tags: ["Context Management"],
    summary: "Get Connector State",
    operationId: "get_connector_state_connector_state__id__get",
    parameters: {
      query: {
        properties: {
          connector_id: {
            type: "string",
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

const with$id = { $id: "/paths/_connector_state_{id}", ...schema } as const;
export { with$id };

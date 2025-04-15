import componentsSchemasHTTPValidationError from "../components/schemas/HTTPValidationError";

const schema = {
  post: {
    tags: ["Context Management"],
    summary: "Startcharging",
    operationId: "startcharging_startcharging_post",
    parameters: {
      query: {
        properties: {
          commands: {
            type: "string",
            default:
              "sleep 1;iec_wait_pwr_ready;sleep 1;draw_power_regulated 16,3;sleep 36000",
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

const with$id = { $id: "/paths/_startcharging", ...schema } as const;
export { with$id };

import componentsSchemasHTTPValidationError from "../components/schemas/HTTPValidationError";

const schema = {
  post: {
    tags: ["Context Management"],
    summary: "Startchargingiso15118",
    operationId: "startchargingiso15118_startchargingiso15118_post",
    parameters: {
      query: {
        properties: {
          commands: {
            type: "string",
            default:
              "sleep 1;iso_wait_slac_matched;iso_start_v2g_session contract,AC_three_phase_core;iso_wait_pwr_ready;iso_draw_power_regulated 16,3;sleep 36000",
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

const with$id = { $id: "/paths/_startchargingiso15118", ...schema } as const;
export { with$id };

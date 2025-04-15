const schema = {
  get: {
    tags: ["Logging"],
    summary: "Log Uuid",
    description:
      "Get log entries grouped by uuid as json\nArgs:\n    request: the request to handle\nReturns:\n    web.Response: event entries as json",
    operationId: "log_uuid_log_uuid_get",
    responses: {
      "200": {
        description: "Successful Response",
        content: {
          "application/json": {
            schema: {},
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = { $id: "/paths/_log_uuid", ...schema } as const;
export { with$id };

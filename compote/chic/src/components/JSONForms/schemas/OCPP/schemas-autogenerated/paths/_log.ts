const schema = {
  get: {
    tags: ["Logging"],
    summary: "Log",
    description:
      "Get log entries grouped by uuid as json\nArgs:\n    request: the request to handle\nReturns:\n    web.Response: logging entries as json",
    operationId: "log_log_get",
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

const with$id = { $id: "/paths/_log", ...schema } as const;
export { with$id };

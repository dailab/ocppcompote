const schema = {
  get: {
    tags: ["Context Management"],
    summary: "Show Context",
    operationId: "show_context_context_get",
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

const with$id = { $id: "/paths/_context", ...schema } as const;
export { with$id };

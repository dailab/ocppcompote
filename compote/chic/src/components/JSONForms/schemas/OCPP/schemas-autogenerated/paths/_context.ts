const schema = {
  get: {
    tags: ["Context"],
    summary: "List Contexts",
    description:
      "List all csms contexts and return as json response\nArgs:\n    id (str): the id to match to a specific csms context\nReturns:\n    aiohttp.web_response: the csms contexts as a json dictionary wrapped in a aiohttp web_response",
    operationId: "list_contexts_context_get",
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

import componentsSchemasValidationError from "./ValidationError";

const schema = {
  properties: {
    detail: {
      items: componentsSchemasValidationError,
      type: "array",
      title: "Detail",
    },
  },
  type: "object",
  title: "HTTPValidationError",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/HTTPValidationError",
  ...schema,
} as const;
export { with$id };

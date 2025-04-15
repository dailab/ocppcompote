const schema = {
  type: "string",
  description: "external id",
} as const;
export default schema;

const with$id = {
  $id: "/components/parameters/externalID",
  ...schema,
} as const;
export { with$id };

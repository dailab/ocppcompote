const schema = {
  type: "string",
  description: "The id of the provider",
} as const;
export default schema;

const with$id = {
  $id: "/components/parameters/providerID",
  ...schema,
} as const;
export { with$id };

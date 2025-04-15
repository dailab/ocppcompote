const schema = {
  type: "string",
  description: "The id of the operator",
} as const;
export default schema;

const with$id = {
  $id: "/components/parameters/operatorID",
  ...schema,
} as const;
export { with$id };

const schema = {
  type: "string",
  enum: ["Differential", "Full"],
  title: "UpdateType",
  description: "Type of update for a SendLocalList Request.",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ocpp__v201__enums__UpdateType",
  ...schema,
} as const;
export { with$id };

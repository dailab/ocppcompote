const schema = {
  type: "string",
  enum: ["Hard", "Soft"],
  title: "ResetType",
  description: "Type of reset requested by Reset.req",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/ResetType", ...schema } as const;
export { with$id };

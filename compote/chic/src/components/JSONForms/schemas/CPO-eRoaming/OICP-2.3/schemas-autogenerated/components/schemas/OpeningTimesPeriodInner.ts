const schema = {
  properties: {
    begin: {
      type: "string",
      title: "Begin",
      description: "The opening time",
    },
    end: {
      type: "string",
      title: "End",
      description: "The closing time",
    },
  },
  type: "object",
  required: ["begin", "end"],
  title: "OpeningTimesPeriodInner",
  description: "OpeningTimesPeriodInner",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OpeningTimesPeriodInner",
  ...schema,
} as const;
export { with$id };

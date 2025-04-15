import componentsSchemasOpeningTimesPeriodInner from "./OpeningTimesPeriodInner";

const schema = {
  properties: {
    Period: {
      items: componentsSchemasOpeningTimesPeriodInner,
      type: "array",
      title: "Period",
      description:
        "The starting and end time for pricing product applicability in the specified period ",
    },
    on: {
      type: "string",
      title: "On",
      description:
        "Day values to be used in specifying periods on which the product is available. Workdays = Monday â€“ Friday, Weekend = Saturday â€“ Sunday",
    },
  },
  type: "object",
  required: ["Period", "on"],
  title: "OpeningTimes",
  description: "OpeningTimes",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/OpeningTimes", ...schema } as const;
export { with$id };

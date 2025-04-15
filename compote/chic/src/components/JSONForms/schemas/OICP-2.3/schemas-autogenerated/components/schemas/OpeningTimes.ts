const schema = {
  type: "object",
  required: ["Period", "on"],
  properties: {
    Period: {
      type: "array",
      description:
        "The starting and end time for pricing product applicability in the specified period\n",
      items: {
        type: "object",
        required: ["begin", "end"],
        properties: {
          begin: {
            type: "string",
            description: "The opening time",
            pattern: "[0-9]{2}:[0-9]{2}",
          },
          end: {
            type: "string",
            description: "The closing time",
            pattern: "[0-9]{2}:[0-9]{2}",
          },
        },
      },
    },
    on: {
      type: "string",
      enum: [
        "Everyday",
        "Workdays",
        "Weekend",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      description:
        "Day values to be used in specifying periods on which the product is available. Workdays = Monday – Friday, Weekend = Saturday – Sunday",
    },
  },
} as const;
export default schema;

const with$id = { $id: "/components/schemas/OpeningTimes", ...schema } as const;
export { with$id };

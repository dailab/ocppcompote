const schema = {
  properties: {
    meterValues: {
      anyOf: [
        {
          items: {
            anyOf: [
              {
                type: "number",
              },
              {
                type: "integer",
              },
            ],
          },
          type: "array",
        },
        {
          type: "null",
        },
      ],
      title: "Metervalues",
    },
  },
  type: "object",
  title: "ERoamingChargeDetailRecordMeterValueInBetween",
  description:
    "List of meter values that may have been taken in between (kWh).",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingChargeDetailRecordMeterValueInBetween",
  ...schema,
} as const;
export { with$id };

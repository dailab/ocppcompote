const schema = {
  properties: {
    CO2Emission: {
      anyOf: [
        {
          type: "number",
          maximum: 99999,
        },
        {
          type: "integer",
          maximum: 99999,
        },
        {
          type: "null",
        },
      ],
      title: "Co2Emission",
      description:
        "Total CO2 emited by the energy source being used by this charging station to supply energy to EV. Units are in g/kWh",
    },
    NuclearWaste: {
      anyOf: [
        {
          type: "number",
          maximum: 99999,
        },
        {
          type: "integer",
          maximum: 99999,
        },
        {
          type: "null",
        },
      ],
      title: "Nuclearwaste",
      description:
        "Total NuclearWaste emited by the energy source being used by this charging station to supply energy to EV. Units are in g/kWh",
    },
  },
  type: "object",
  title: "PullEvseDataRecordEnvironmentalImpact",
  description: "PullEvseDataRecordEnvironmentalImpact",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/PullEvseDataRecordEnvironmentalImpact",
  ...schema,
} as const;
export { with$id };

const schema = {
  properties: {
    Energy: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Energy",
      description:
        "| Option | Description | | Solar | Energy coming from Solar radiation | | Wind | Energy produced by wind | | HydroPower | Energy produced by the movement of water | | GeothermalEnergy | Energy coming from the sub-surface of the earth | | Biomass | Energy produced using plant or animal material as fuel | | Coal | Energy produced using coal as fuel | | NuclearEnergy | Energy being produced by nuclear fission | | Petroleum | Energy produced by using Petroleum as fuel | | NaturalGas | Energy produced using Natural Gas as fuel | ",
    },
    Percentage: {
      anyOf: [
        {
          type: "integer",
          maximum: 99,
          minimum: 0,
        },
        {
          type: "null",
        },
      ],
      title: "Percentage",
      description:
        "Percentage of EnergyType being used by the charging stations",
    },
  },
  type: "object",
  title: "EnergySource",
  description:
    "energy source that the charging station uses to supply electric energy",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/EnergySource", ...schema } as const;
export { with$id };

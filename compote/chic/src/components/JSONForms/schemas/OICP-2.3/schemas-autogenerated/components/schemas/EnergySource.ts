const schema = {
  type: "object",
  description:
    "energy source that the charging station uses to supply electric energy",
  properties: {
    Energy: {
      type: "string",
      description:
        "| Option | Description |\n| Solar | Energy coming from Solar radiation |\n| Wind | Energy produced by wind |\n| HydroPower | Energy produced by the movement of water |\n| GeothermalEnergy | Energy coming from the sub-surface of the earth |\n| Biomass | Energy produced using plant or animal material as fuel |\n| Coal | Energy produced using coal as fuel |\n| NuclearEnergy | Energy being produced by nuclear fission |\n| Petroleum | Energy produced by using Petroleum as fuel |\n| NaturalGas | Energy produced using Natural Gas as fuel |\n",
      enum: [
        "Solar",
        "Wind",
        "HydroPower",
        "GeothermalEnergy",
        "Biomass",
        "Coal",
        "NuclearEnergy",
        "Petroleum",
        "NaturalGas",
      ],
    },
    Percentage: {
      type: "integer",
      description:
        "Percentage of EnergyType being used by the charging stations",
      maximum: 99,
      minimum: 0,
    },
  },
} as const;
export default schema;

const with$id = { $id: "/components/schemas/EnergySource", ...schema } as const;
export { with$id };

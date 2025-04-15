const schema = {
  properties: {
    PowerType: {
      type: "string",
      title: "Powertype",
      description: "Charging Facility power type (e.g. AC or DC)",
    },
    Voltage: {
      anyOf: [
        {
          type: "integer",
          maximum: 999,
          minimum: 0,
        },
        {
          type: "null",
        },
      ],
      title: "Voltage",
      description: "Voltage (Line to Neutral) of the Charging Facility",
    },
    Amperage: {
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
      title: "Amperage",
      description: "Amperage of the Charging Facility",
    },
    Power: {
      type: "integer",
      maximum: 999,
      minimum: 0,
      title: "Power",
      description: "Charging Facility power in kW",
    },
    ChargingModes: {
      anyOf: [
        {
          items: {
            type: "string",
          },
          type: "array",
        },
        {
          type: "null",
        },
      ],
      title: "Chargingmodes",
      description: "List of charging modes that are supported.",
    },
  },
  type: "object",
  required: ["PowerType", "Power"],
  title: "ChargingFacility",
  description: "ChargingFacility",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ChargingFacility",
  ...schema,
} as const;
export { with$id };

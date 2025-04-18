const schema = {
  type: "object",
  required: ["PowerType", "Power"],
  properties: {
    PowerType: {
      type: "string",
      description: "Charging Facility power type (e.g. AC or DC)",
      enum: ["AC_1_PHASE", "AC_3_PHASE", "DC"],
    },
    Voltage: {
      type: "integer",
      maximum: 999,
      minimum: 0,
      description: "Voltage (Line to Neutral) of the Charging Facility",
    },
    Amperage: {
      type: "integer",
      maximum: 99,
      minimum: 0,
      description: "Amperage of the Charging Facility",
    },
    Power: {
      type: "integer",
      maximum: 999,
      minimum: 0,
      description: "Charging Facility power in kW",
    },
    ChargingModes: {
      type: "array",
      items: {
        type: "string",
        description:
          "| Option | Description |\n| Mode_1 | conductive connection between a standard socket-outlet of an AC supply network and electric vehicle without communication or additional safety features (IEC 61851-1) |\n| Mode_2 | conductive connection between a standard socket-outlet of an AC supply network and electric vehicle with communication and additional safety features (IEC 61851-1) |\n| Mode_3 | conductive connection of an EV to an AC EV supply equipment permanently connected to an AC supply network with communication and additional safety features (IEC 61851-1) |\n| Mode_4 | conductive connection of an EV to an AC or DC supply network utilizing a DC EV supply equipment, with (high-level) communication and additional safety features (IEC 61851-1) |\n| CHAdeMO | CHAdeMo Specification |\n",
        enum: ["Mode_1", "Mode_2", "Mode_3", "Mode_4", "CHAdeMO"],
      },
      description: "List of charging modes that are supported.",
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ChargingFacility",
  ...schema,
} as const;
export { with$id };

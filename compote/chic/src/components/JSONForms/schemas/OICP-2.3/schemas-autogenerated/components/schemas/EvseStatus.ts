const schema = {
  type: "string",
  enum: [
    "Available",
    "Reserved",
    "Occupied",
    "OutOfService",
    "EvseNotFound",
    "Unknown",
  ],
  description:
    "| Option | Description |                \n| ------ | ----------- |\n| Available | Charging Spot is available for charging. |\n| Reserved | Charging Spot is reserved and not available for charging. |\n| Occupied | Charging Spot is busy. |\n| OutOfService | Charging Spot is out of service and not available for charging. |\n| EvseNotFound | The requested EvseID and EVSE status does not exist within the Hubject database. |\n| Unknown | No status information available. |\n",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/EvseStatus", ...schema } as const;
export { with$id };

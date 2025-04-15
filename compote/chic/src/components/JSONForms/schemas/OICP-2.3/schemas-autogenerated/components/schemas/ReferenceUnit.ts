const schema = {
  type: "string",
  description:
    "Default Reference Unit in time or kWh\n\n| Option | Description |\n| ------ | ----------- |\n| HOUR | Defined Reference Unit Type |\n| KILOWATT_HOUR | Defined Reference Unit Type |\n| MINUTE | Defined Reference Unit Type |\n",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ReferenceUnit",
  ...schema,
} as const;
export { with$id };

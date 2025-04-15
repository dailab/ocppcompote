const schema = {
  type: "string",
  enum: [
    "Free publicly accessible",
    "Restricted access",
    "Paying publicly accessible",
    "Test Station",
  ],
  description:
    "Specifies how the charging station can be accessed.\n\n| Option | Description |\n| ------ | ----------- |\n| Free publicly accessible | EV Driver can reach the charging point without paying a fee, e.g. street, free public place, free parking lot, etc. |\n| Restricted access | EV Driver needs permission to reach the charging point, e.g. Campus, building complex, etc. |\n| Paying publicly accessible | EV Driver needs to pay a fee in order to reach the charging point, e.g. payable parking garage, etc. |\n| Test Station | Station is just for testing purposes. Access may be restricted. |\n",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/Accessibility",
  ...schema,
} as const;
export { with$id };

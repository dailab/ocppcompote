const schema = {
  type: "string",
  enum: [
    "Free publicly accessible",
    "Restricted access",
    "Paying publicly accessible",
    "Test Station",
  ],
  title: "Accessibility",
  description:
    "Specifies how the charging station can be accessed.  | Option | Description | | ------ | ----------- | | Free publicly accessible | EV Driver can reach the charging point without paying a fee, e.g. street, free public place, free parking lot, etc. | | Restricted access | EV Driver needs permission to reach the charging point, e.g. Campus, building complex, etc. | | Paying publicly accessible | EV Driver needs to pay a fee in order to reach the charging point, e.g. payable parking garage, etc. | | Test Station | Station is just for testing purposes. Access may be restricted. | ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/Accessibility",
  ...schema,
} as const;
export { with$id };

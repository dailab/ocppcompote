const schema = {
  type: "string",
  description:
    "Defines the format of geo coordinates that shall be provided with the response.",
  enum: ["Google", "DegreeMinuteSeconds", "DecimalDegree"],
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/GeoCoordinatesResponseFormat",
  ...schema,
} as const;
export { with$id };

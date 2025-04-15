const schema = {
  properties: {
    Coordinates: {
      type: "string",
      title: "Coordinates",
      description:
        "A string that `MUST` be valid with respect to the following regular expression:  `^-?1?\\d{1,2}\\.\\d{1,6}\\s*\\,?\\s*-?1?\\d{1,2}\\.\\d{1,6}$` The expression validates the string as geo coordinates with respect to the Google standard. The string contains latitude and longitude (in this sequence) separated by a space.  Example: â€œ47.662249 9.360922â€ ",
    },
  },
  type: "object",
  required: ["Coordinates"],
  title: "GeoCoordinatesGoogle",
  description: "Geocoordinates using Google Structure Based on WGS84 ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/GeoCoordinatesGoogle",
  ...schema,
} as const;
export { with$id };

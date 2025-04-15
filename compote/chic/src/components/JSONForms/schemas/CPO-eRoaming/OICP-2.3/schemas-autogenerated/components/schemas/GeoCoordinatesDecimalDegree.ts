const schema = {
  properties: {
    Longitude: {
      type: "string",
      title: "Longitude",
      description:
        "A string that `MUST` be valid with respect to the following regular expression:  `^-?1?\\d{1,2}\\.\\d{1,6}$` The expression validates the string as a geo coordinate (longitude or latitude) with decimal degree syntax.  Examples: â€œ9.360922â€, â€œ-21.568201â€ ",
    },
    Latitude: {
      type: "string",
      title: "Latitude",
      description:
        "A string that `MUST` be valid with respect to the following regular expression:  `^-?1?\\d{1,2}\\.\\d{1,6}$` The expression validates the string as a geo coordinate (longitude or latitude) with decimal degree syntax.  Examples: â€œ9.360922â€, â€œ-21.568201â€ ",
    },
  },
  type: "object",
  required: ["Longitude", "Latitude"],
  title: "GeoCoordinatesDecimalDegree",
  description: "Geocoordinates using DecimalDegree Structure",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/GeoCoordinatesDecimalDegree",
  ...schema,
} as const;
export { with$id };

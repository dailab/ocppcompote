const schema = {
  properties: {
    Longitude: {
      type: "string",
      title: "Longitude",
      description:
        "A string that `MUST` be valid with respect to the following regular expression:  `^-?1?\\d{1,2}Â°[ ]?\\d{1,2}'[ ]?\\d{1,2}\\.\\d+''$` The expression validates the string as a geo coordinate (longitude or latitude) consisting of degree, minutes, and seconds  Examples: â€œ9Â°21'39.32''â€, â€œ-21Â°34'23.16'' ",
    },
    Latitude: {
      type: "string",
      title: "Latitude",
      description:
        "A string that `MUST` be valid with respect to the following regular expression:  `^-?1?\\d{1,2}Â°[ ]?\\d{1,2}'[ ]?\\d{1,2}\\.\\d+''$` The expression validates the string as a geo coordinate (longitude or latitude) consisting of degree, minutes, and seconds  Examples: â€œ9Â°21'39.32''â€, â€œ-21Â°34'23.16'' ",
    },
  },
  type: "object",
  required: ["Longitude", "Latitude"],
  title: "GeoCoordinatesDegreeMinuteSeconds",
  description: "Geocoordinates using DegreeMinutesSeconds Structure",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/GeoCoordinatesDegreeMinuteSeconds",
  ...schema,
} as const;
export { with$id };

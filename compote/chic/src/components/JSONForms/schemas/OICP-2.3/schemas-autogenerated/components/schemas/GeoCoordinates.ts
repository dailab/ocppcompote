const schema = {
  type: "object",
  description:
    "Important\n\n__One of the following three options `MUST` be provided__\n",
  properties: {
    Google: {
      type: "object",
      description: "Geocoordinates using Google Structure\nBased on WGS84\n",
      required: ["Coordinates"],
      properties: {
        Coordinates: {
          type: "string",
          pattern:
            "^-?1?\\d{1,2}\\.\\d{1,6}\\s*\\,?\\s*-?1?\\d{1,2}\\.\\d{1,6}$",
          description:
            "A string that `MUST` be valid with respect to the following regular expression:\n\n`^-?1?\\d{1,2}\\.\\d{1,6}\\s*\\,?\\s*-?1?\\d{1,2}\\.\\d{1,6}$`\nThe expression validates the string as geo coordinates with respect to the Google standard. The string contains latitude and longitude (in this sequence) separated by a space.\n\nExample: “47.662249 9.360922”\n",
        },
      },
    },
    DecimalDegree: {
      type: "object",
      description: "Geocoordinates using DecimalDegree Structure",
      required: ["Longitude", "Latitude"],
      properties: {
        Longitude: {
          type: "string",
          pattern: "^-?1?\\d{1,2}\\.\\d{1,6}$",
          description:
            "A string that `MUST` be valid with respect to the following regular expression:\n\n`^-?1?\\d{1,2}\\.\\d{1,6}$`\nThe expression validates the string as a geo coordinate (longitude or latitude) with decimal degree syntax.\n\nExamples: “9.360922”, “-21.568201”\n",
        },
        Latitude: {
          type: "string",
          pattern: "^-?1?\\d{1,2}\\.\\d{1,6}$",
          description:
            "A string that `MUST` be valid with respect to the following regular expression:\n\n`^-?1?\\d{1,2}\\.\\d{1,6}$`\nThe expression validates the string as a geo coordinate (longitude or latitude) with decimal degree syntax.\n\nExamples: “9.360922”, “-21.568201”\n",
        },
      },
    },
    DegreeMinuteSeconds: {
      type: "object",
      description: "Geocoordinates using DegreeMinutesSeconds Structure",
      required: ["Longitude", "Latitude"],
      properties: {
        Longitude: {
          type: "string",
          pattern: "^-?1?\\d{1,2}°[ ]?\\d{1,2}'[ ]?\\d{1,2}\\.\\d+''$",
          description:
            "A string that `MUST` be valid with respect to the following regular expression:\n\n`^-?1?\\d{1,2}°[ ]?\\d{1,2}'[ ]?\\d{1,2}\\.\\d+''$`\nThe expression validates the string as a geo coordinate (longitude or latitude) consisting of degree, minutes, and seconds\n\nExamples: “9°21'39.32''”, “-21°34'23.16''\n",
        },
        Latitude: {
          type: "string",
          pattern: "^-?1?\\d{1,2}°[ ]?\\d{1,2}'[ ]?\\d{1,2}\\.\\d+''$",
          description:
            "A string that `MUST` be valid with respect to the following regular expression:\n\n`^-?1?\\d{1,2}°[ ]?\\d{1,2}'[ ]?\\d{1,2}\\.\\d+''$`\nThe expression validates the string as a geo coordinate (longitude or latitude) consisting of degree, minutes, and seconds\n\nExamples: “9°21'39.32''”, “-21°34'23.16''\n",
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/GeoCoordinates",
  ...schema,
} as const;
export { with$id };

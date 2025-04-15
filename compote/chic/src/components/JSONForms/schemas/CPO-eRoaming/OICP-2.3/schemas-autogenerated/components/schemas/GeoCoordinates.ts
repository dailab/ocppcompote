import componentsSchemasGeoCoordinatesDegreeMinuteSeconds from "./GeoCoordinatesDegreeMinuteSeconds";
import componentsSchemasGeoCoordinatesDecimalDegree from "./GeoCoordinatesDecimalDegree";
import componentsSchemasGeoCoordinatesGoogle from "./GeoCoordinatesGoogle";

const schema = {
  properties: {
    Google: {
      anyOf: [
        componentsSchemasGeoCoordinatesGoogle,
        {
          type: "null",
        },
      ],
    },
    DecimalDegree: {
      anyOf: [
        componentsSchemasGeoCoordinatesDecimalDegree,
        {
          type: "null",
        },
      ],
    },
    DegreeMinuteSeconds: {
      anyOf: [
        componentsSchemasGeoCoordinatesDegreeMinuteSeconds,
        {
          type: "null",
        },
      ],
    },
  },
  type: "object",
  title: "GeoCoordinates",
  description:
    "Important  __One of the following three options `MUST` be provided__ ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/GeoCoordinates",
  ...schema,
} as const;
export { with$id };

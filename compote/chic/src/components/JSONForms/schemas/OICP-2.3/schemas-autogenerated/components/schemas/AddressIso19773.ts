import componentsSchemasCountryCode from "./CountryCode";

const schema = {
  type: "object",
  required: ["Country", "City", "Street", "PostalCode", "HouseNum"],
  properties: {
    Country: componentsSchemasCountryCode,
    City: {
      type: "string",
      maximum: 50,
      minimum: 1,
    },
    Street: {
      type: "string",
      maximum: 100,
      minimum: 2,
    },
    PostalCode: {
      type: "string",
      maximum: 10,
    },
    HouseNum: {
      type: "string",
      maximum: 10,
    },
    Floor: {
      type: "string",
      maximum: 5,
    },
    Region: {
      type: "string",
      maximum: 50,
    },
    ParkingFacility: {
      type: "boolean",
    },
    ParkingSpot: {
      type: "string",
      maximum: 5,
    },
    TimeZone: {
      type: "string",
      pattern: "[U][T][C][+,-][0-9][0-9][:][0-9][0-9]",
      description:
        "`[U][T][C][+,-][0-9][0-9][:][0-9][0-9]`\nThe expression validates a string as a Time zone with UTC offset.\n\nExamples:\n\nUTC+01:00\n\nUTC-05:00\n",
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/AddressIso19773",
  ...schema,
} as const;
export { with$id };

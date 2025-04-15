const schema = {
  properties: {
    Country: {
      type: "string",
      title: "Country",
      description:
        "The CountryCodeType allows for Alpha-3 country codes only as of OICP 2.2 and OICP 2.3  For Alpha-3 (three-letter) country codes as defined in ISO 3166-1.  __Examples:__  | Option | Description | | ------ | ----------- | | AUT | Austria | | DEU | Germany | | FRA | France | | USA | United States | ",
    },
    City: {
      type: "string",
      title: "City",
    },
    Street: {
      type: "string",
      title: "Street",
    },
    PostalCode: {
      type: "string",
      title: "Postalcode",
    },
    HouseNum: {
      type: "string",
      title: "Housenum",
    },
    Floor: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Floor",
    },
    Region: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Region",
    },
    ParkingFacility: {
      anyOf: [
        {
          type: "boolean",
        },
        {
          type: "null",
        },
      ],
      title: "Parkingfacility",
    },
    ParkingSpot: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Parkingspot",
    },
    TimeZone: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Timezone",
      description:
        "`[U][T][C][+,-][0-9][0-9][:][0-9][0-9]` The expression validates a string as a Time zone with UTC offset.  Examples:  UTC+01:00  UTC-05:00 ",
    },
  },
  type: "object",
  required: ["Country", "City", "Street", "PostalCode", "HouseNum"],
  title: "AddressIso19773",
  description: "AddressIso19773",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/AddressIso19773",
  ...schema,
} as const;
export { with$id };

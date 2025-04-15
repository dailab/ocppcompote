const schema = {
  type: "string",
  description:
    "The CountryCodeType allows for Alpha-3 country codes only as of OICP 2.2 and OICP 2.3\n\nFor Alpha-3 (three-letter) country codes as defined in ISO 3166-1.\n\n__Examples:__\n\n| Option | Description |\n| ------ | ----------- |\n| AUT | Austria |\n| DEU | Germany |\n| FRA | France |\n| USA | United States |\n",
  maximum: 3,
  minimum: 3,
} as const;
export default schema;

const with$id = { $id: "/components/schemas/CountryCode", ...schema } as const;
export { with$id };

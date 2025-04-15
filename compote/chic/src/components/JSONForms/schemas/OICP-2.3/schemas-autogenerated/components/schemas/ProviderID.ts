const schema = {
  type: "string",
  pattern:
    "^([A-Za-z]{2}\\-?[A-Za-z0-9]{3}|[A-Za-z]{2}[\\*|-]?[A-Za-z0-9]{3})$",
  description:
    "The ProviderID is defined by Hubject and is used to identify the EMP\n\nA string that `MUST` be valid with respect to the following regular expression: ISO | DIN\n\n`^([A-Za-z]{2}\\-?[A-Za-z0-9]{3}|[A-Za-z]{2}[\\*|-]?[A-Za-z0-9]{3})$`\n\nThe expression validates the string as ProviderID including the preceding country code, which is part of EvcoID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.\n\nIn case the ProviderID is provided corresponding to ISO, the country code `MUST` be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character “-” is optional.\n\nExamples ISO: “DE8EO”, “DE-8EO”\n\nExamples DIN: “DE8EO”, “DE*8EO”, “DE-8EO”\n",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/ProviderID", ...schema } as const;
export { with$id };

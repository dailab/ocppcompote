const schema = {
  type: "string",
  pattern: "^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3})|(\\+?[0-9]{1,3}\\*[0-9]{3}))$",
  description:
    "A string that MUST be valid with respect to the following regular expression: ISO | DIN\n\n^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3})|(\\+?[0-9]{1,3}\\*[0-9]{3}))$\nThe expression validates the string as OperatorID including the preceding country code, which is part of EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118. In case the OperatorID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character “*” is optional.\n\nIn case the OperatorID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character “*” is mandatory.\n\nExamples ISO: “DE*A36”, “DEA36”\n\nExample DIN: “+49*536”\n",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/OperatorID", ...schema } as const;
export { with$id };

const schema = {
  type: "string",
  pattern:
    "^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?E[A-Za-z0-9\\*]{1,30})|(\\+?[0-9]{1,3}\\*[0-9]{3}\\*[0-9\\*]{1,32}))$",
  description:
    "The ID that identifies the charging spot.\n\nA string that `MUST` be valid with respect to the following regular expression: ISO | DIN.\n\n`^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?E[A-Za-z0-9\\*]{1,30})|(\\+?[0-9]{1,3}\\*[0-9]{3}\\*[0-9\\*]{1,32}))$`\nThe expression validates the string as EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.\n\nIn case the EvseID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character “*” is optional. Furthermore the ID MUST provide an “E” after the OperatorID in order to identify the ID as ISO EvseID without doubt.\n\nIn case the EvseID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character “*” is mandatory.\n\nExamples ISO: “DE*AB7*E840*6487”, “DEAB7E8406487”\n\nExample DIN: “+49*810*000*438”\n",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/EvseID", ...schema } as const;
export { with$id };

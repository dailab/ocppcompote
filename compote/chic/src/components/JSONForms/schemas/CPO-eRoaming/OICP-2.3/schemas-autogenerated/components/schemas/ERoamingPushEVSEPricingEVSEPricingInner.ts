const schema = {
  properties: {
    EvseID: {
      type: "string",
      title: "Evseid",
      description:
        "The ID that identifies the charging spot.  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN.  `^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?E[A-Za-z0-9\\*]{1,30})|(\\+?[0-9]{1,3}\\*[0-9]{3}\\*[0-9\\*]{1,32}))$` The expression validates the string as EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the EvseID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional. Furthermore the ID MUST provide an â€œEâ€ after the OperatorID in order to identify the ID as ISO EvseID without doubt.  In case the EvseID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*AB7*E840*6487â€, â€œDEAB7E8406487â€  Example DIN: â€œ+49*810*000*438â€ ",
    },
    ProviderID: {
      type: "string",
      title: "Providerid",
      description:
        "The ProviderID is defined by Hubject and is used to identify the EMP  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN  `^([A-Za-z]{2}\\-?[A-Za-z0-9]{3}|[A-Za-z]{2}[\\*|-]?[A-Za-z0-9]{3})$`  The expression validates the string as ProviderID including the preceding country code, which is part of EvcoID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the ProviderID is provided corresponding to ISO, the country code `MUST` be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ-â€ is optional.  Examples ISO: â€œDE8EOâ€, â€œDE-8EOâ€  Examples DIN: â€œDE8EOâ€, â€œDE*8EOâ€, â€œDE-8EOâ€   In case the data is to be made available for all EMPs (e.g. for Offer-to-All prices), the asterix character (*) can be set as the value in this field.   ",
    },
    EvseIDProductList: {
      items: {
        type: "string",
      },
      type: "array",
      title: "Evseidproductlist",
      description: "A list of pricing products applicable per EvseID",
    },
  },
  type: "object",
  required: ["EvseID", "ProviderID", "EvseIDProductList"],
  title: "ERoamingPushEVSEPricingEVSEPricingInner",
  description: "ERoamingPushEVSEPricingEVSEPricingInner",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingPushEVSEPricingEVSEPricingInner",
  ...schema,
} as const;
export { with$id };

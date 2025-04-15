import componentsSchemasPricingProductDataRecord from "./PricingProductDataRecord";

const schema = {
  properties: {
    OperatorID: {
      type: "string",
      title: "Operatorid",
      description:
        "A string that MUST be valid with respect to the following regular expression: ISO | DIN  ^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3})|(\\+?[0-9]{1,3}\\*[0-9]{3}))$ The expression validates the string as OperatorID including the preceding country code, which is part of EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118. In case the OperatorID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional.  In case the OperatorID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*A36â€, â€œDEA36â€  Example DIN: â€œ+49*536â€ ",
    },
    OperatorName: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Operatorname",
      description: "Free text for operator",
    },
    ProviderID: {
      type: "string",
      title: "Providerid",
      description:
        "The ProviderID is defined by Hubject and is used to identify the EMP  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN  `^([A-Za-z]{2}\\-?[A-Za-z0-9]{3}|[A-Za-z]{2}[\\*|-]?[A-Za-z0-9]{3})$`  The expression validates the string as ProviderID including the preceding country code, which is part of EvcoID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the ProviderID is provided corresponding to ISO, the country code `MUST` be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ-â€ is optional.  Examples ISO: â€œDE8EOâ€, â€œDE-8EOâ€  Examples DIN: â€œDE8EOâ€, â€œDE*8EOâ€, â€œDE-8EOâ€   In case the data is to be made available for all EMPs (e.g. for Offer-to-All prices), the asterix character (*) can be set as the value in this field.   ",
    },
    PricingDefaultPrice: {
      anyOf: [
        {
          type: "number",
        },
        {
          type: "integer",
        },
      ],
      title: "Pricingdefaultprice",
      description: "A default price for pricing sessions at undefined EVSEs",
    },
    PricingDefaultPriceCurrency: {
      type: "string",
      title: "Pricingdefaultpricecurrency",
      description:
        "The ProductPriceCurrencyType allows for the list of active codes of the official ISO 4217 currency names.  For the full list of active codes of the official ISO 4217 currencies, see: [https://www.iso.org/iso-4217-currency-codes.html](https://www.iso.org/iso-4217-currency-codes.html)  Examples:  | Option | Description | | ------ | ----------- | | EUR | Euro | | CHF | Swiss franc | | CAD | Canadian Dollar | | GBP | Pound sterling ",
    },
    PricingDefaultReferenceUnit: {
      type: "string",
      title: "Pricingdefaultreferenceunit",
      description:
        "Default Reference Unit in time or kWh  | Option | Description | | ------ | ----------- | | HOUR | Defined Reference Unit Type | | KILOWATT_HOUR | Defined Reference Unit Type | | MINUTE | Defined Reference Unit Type | ",
    },
    PricingProductDataRecords: {
      items: componentsSchemasPricingProductDataRecord,
      type: "array",
      title: "Pricingproductdatarecords",
      description: "A list of pricing products",
    },
  },
  type: "object",
  required: [
    "OperatorID",
    "ProviderID",
    "PricingDefaultPrice",
    "PricingDefaultPriceCurrency",
    "PricingDefaultReferenceUnit",
    "PricingProductDataRecords",
  ],
  title: "ERoamingPushPricingProductDataPricingProductData",
  description:
    "Details of pricing products offered by a particular operator for a specific provider",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingPushPricingProductDataPricingProductData",
  ...schema,
} as const;
export { with$id };

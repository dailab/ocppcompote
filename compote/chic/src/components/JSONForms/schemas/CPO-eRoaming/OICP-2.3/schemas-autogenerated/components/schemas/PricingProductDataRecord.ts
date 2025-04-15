import componentsSchemasPricingProductDataRecordAdditionalReferencesInner from "./PricingProductDataRecordAdditionalReferencesInner";
import componentsSchemasPricingProductDataRecordProductAvailabilityTimesInner from "./PricingProductDataRecordProductAvailabilityTimesInner";

const schema = {
  properties: {
    ProductID: {
      type: "string",
      title: "Productid",
      description:
        "The ProductIDType defines some standard values (see below). The type however also supports custom ProductIDs that can be specified by partners (as a string of 50 characters maximum length). | Option | Description | |--------|-------------| | Standard Price | Standard Price | | AC1 | Product for AC 1 Phase charging | | AC3 | Product for AC 3 Phase charging | | DC | Product for DC charging | | CustomProductID | There is no option â€œCustomProductIDâ€, this sample option is meant to indicates that custom product ID specifications by partners (as a string of 50 characters maximum length) are allowed as well.| ",
    },
    ReferenceUnit: {
      type: "string",
      title: "Referenceunit",
      description:
        "Default Reference Unit in time or kWh  | Option | Description | | ------ | ----------- | | HOUR | Defined Reference Unit Type | | KILOWATT_HOUR | Defined Reference Unit Type | | MINUTE | Defined Reference Unit Type | ",
    },
    ProductPriceCurrency: {
      type: "string",
      title: "Productpricecurrency",
      description:
        "The ProductPriceCurrencyType allows for the list of active codes of the official ISO 4217 currency names.  For the full list of active codes of the official ISO 4217 currencies, see: [https://www.iso.org/iso-4217-currency-codes.html](https://www.iso.org/iso-4217-currency-codes.html)  Examples:  | Option | Description | | ------ | ----------- | | EUR | Euro | | CHF | Swiss franc | | CAD | Canadian Dollar | | GBP | Pound sterling ",
    },
    PricePerReferenceUnit: {
      anyOf: [
        {
          type: "number",
        },
        {
          type: "integer",
        },
      ],
      title: "Priceperreferenceunit",
      description: "A price per reference unit",
    },
    MaximumProductChargingPower: {
      anyOf: [
        {
          type: "number",
        },
        {
          type: "integer",
        },
      ],
      title: "Maximumproductchargingpower",
      description: "A value in kWh",
    },
    IsValid24hours: {
      type: "boolean",
      title: "Isvalid24Hours",
      description:
        "Set to TRUE if the respective pricing product is applicable 24 hours a day. If FALSE, the respective applicability times `SHOULD` be provided in the field â€œProductAvailabilityTimesâ€. ",
    },
    ProductAvailabilityTimes: {
      items:
        componentsSchemasPricingProductDataRecordProductAvailabilityTimesInner,
      type: "array",
      title: "Productavailabilitytimes",
      description: "A list indicating when the pricing product is applicable",
    },
    AdditionalReferences: {
      anyOf: [
        {
          items:
            componentsSchemasPricingProductDataRecordAdditionalReferencesInner,
          type: "array",
        },
        {
          type: "null",
        },
      ],
      title: "Additionalreferences",
      description:
        "A list of additional reference units and their respective prices",
    },
  },
  type: "object",
  required: [
    "ProductID",
    "ReferenceUnit",
    "ProductPriceCurrency",
    "PricePerReferenceUnit",
    "MaximumProductChargingPower",
    "IsValid24hours",
    "ProductAvailabilityTimes",
  ],
  title: "PricingProductDataRecord",
  description: "PricingProductDataRecord",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/PricingProductDataRecord",
  ...schema,
} as const;
export { with$id };

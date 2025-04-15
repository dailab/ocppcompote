const schema = {
  properties: {
    AdditionalReference: {
      type: "string",
      title: "Additionalreference",
      description:
        'Additional pricing components to be considered in addition to the base pricing  | Option | Description | | ------ | ----------- | | START FEE | Can be used in case a fixed fee is charged for the initiation of the charging session. This is a fee charged on top of the main base price defined in the field "PricePerReferenceUnit" for any particular pricing product. | | FIXED FEE | Can be used if a single price is charged irrespective of charging duration or energy consumption (for instance if all sessions are to be charged a single fixed fee). When used, the value set in the field "PricePerReferenceUnit" for the main base price of respective pricing product SHOULD be set to zero. | | PARKING FEE | Can be used in case sessions are to be charged for both parking and charging. When used, it needs to be specified in the corresponding service offer on the HBS Portal when parking applies (e.g. from session start to charging start and charging end to session end or for the entire session duration, or x-minutes after charging end, etc) | | MINIMUM FEE | Can be used in case there is a minimum fee to be paid for all charging sessions. When used, this implies that the eventual price to be paid cannot be less than this minimum fee but can however be a price above/greater than the minimum fee. | | MAXIMUM FEE | Can be used in case there is a maximum fee to be charged for all charging sessions. When used, this implies that the eventual price to be paid cannot be more than this maximum fee but can however be a price below/lower than the maximum fee. | ',
    },
    AdditionalReferenceUnit: {
      type: "string",
      title: "Additionalreferenceunit",
      description:
        "Default Reference Unit in time or kWh  | Option | Description | | ------ | ----------- | | HOUR | Defined Reference Unit Type | | KILOWATT_HOUR | Defined Reference Unit Type | | MINUTE | Defined Reference Unit Type | ",
    },
    PricePerAdditionalReferenceUnit: {
      anyOf: [
        {
          type: "number",
        },
        {
          type: "integer",
        },
      ],
      title: "Priceperadditionalreferenceunit",
      description: "A price in the given currency",
    },
  },
  type: "object",
  required: [
    "AdditionalReference",
    "AdditionalReferenceUnit",
    "PricePerAdditionalReferenceUnit",
  ],
  title: "PricingProductDataRecordAdditionalReferencesInner",
  description: "PricingProductDataRecordAdditionalReferencesInner",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/PricingProductDataRecordAdditionalReferencesInner",
  ...schema,
} as const;
export { with$id };

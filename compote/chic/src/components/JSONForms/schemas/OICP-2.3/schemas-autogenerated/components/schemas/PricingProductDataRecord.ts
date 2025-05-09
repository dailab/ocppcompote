import componentsSchemasCurrencyID from "./CurrencyID";
import componentsSchemasReferenceUnit from "./ReferenceUnit";
import componentsSchemasProductID from "./ProductID";

const schema = {
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
  properties: {
    ProductID: componentsSchemasProductID,
    ReferenceUnit: componentsSchemasReferenceUnit,
    ProductPriceCurrency: componentsSchemasCurrencyID,
    PricePerReferenceUnit: {
      type: "number",
      description: "A price per reference unit",
    },
    MaximumProductChargingPower: {
      type: "number",
      description: "A value in kWh",
    },
    IsValid24hours: {
      type: "boolean",
      description:
        "Set to TRUE if the respective pricing product is applicable 24 hours a day.\nIf FALSE, the respective applicability times `SHOULD` be provided in the field “ProductAvailabilityTimes”.\n",
    },
    ProductAvailabilityTimes: {
      type: "array",
      description: "A list indicating when the pricing product is applicable",
      items: {
        type: "object",
        required: ["Periods", "on"],
        properties: {
          Periods: {
            type: "array",
            items: {
              type: "object",
              description:
                "The starting and end time for pricing product applicability in the specified period\n",
              required: ["begin", "end"],
              properties: {
                begin: {
                  type: "string",
                  description: "The opening time",
                  pattern: "[0-9]{2}:[0-9]{2}",
                },
                end: {
                  type: "string",
                  description: "The closing time",
                  pattern: "[0-9]{2}:[0-9]{2}",
                },
              },
            },
          },
          on: {
            type: "string",
            enum: [
              "Everyday",
              "Workdays",
              "Weekend",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            description:
              "Day values to be used in specifying periods on which the product is available. Workdays = Monday – Friday, Weekend = Saturday – Sunday",
          },
        },
      },
    },
    AdditionalReferences: {
      type: "array",
      description:
        "A list of additional reference units and their respective prices",
      items: {
        type: "object",
        required: [
          "AdditionalReference",
          "AdditionalReferenceUnit",
          "PricePerAdditionalReferenceUnit",
        ],
        properties: {
          AdditionalReference: {
            type: "string",
            enum: [
              "START FEE",
              "FIXED FEE",
              "PARKING FEE",
              "MINIMUM FEE",
              "MAXIMUM FEE",
            ],
            description:
              'Additional pricing components to be considered in addition to the base pricing\n\n| Option | Description |\n| ------ | ----------- |\n| START FEE | Can be used in case a fixed fee is charged for the initiation of the charging session. This is a fee charged on top of the main base price defined in the field "PricePerReferenceUnit" for any particular pricing product. |\n| FIXED FEE | Can be used if a single price is charged irrespective of charging duration or energy consumption (for instance if all sessions are to be charged a single fixed fee). When used, the value set in the field "PricePerReferenceUnit" for the main base price of respective pricing product SHOULD be set to zero. |\n| PARKING FEE | Can be used in case sessions are to be charged for both parking and charging. When used, it needs to be specified in the corresponding service offer on the HBS Portal when parking applies (e.g. from session start to charging start and charging end to session end or for the entire session duration, or x-minutes after charging end, etc) |\n| MINIMUM FEE | Can be used in case there is a minimum fee to be paid for all charging sessions. When used, this implies that the eventual price to be paid cannot be less than this minimum fee but can however be a price above/greater than the minimum fee. |\n| MAXIMUM FEE | Can be used in case there is a maximum fee to be charged for all charging sessions. When used, this implies that the eventual price to be paid cannot be more than this maximum fee but can however be a price below/lower than the maximum fee. |\n',
          },
          AdditionalReferenceUnit: componentsSchemasReferenceUnit,
          PricePerAdditionalReferenceUnit: {
            type: "number",
            description: "A price in the given currency",
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/PricingProductDataRecord",
  ...schema,
} as const;
export { with$id };

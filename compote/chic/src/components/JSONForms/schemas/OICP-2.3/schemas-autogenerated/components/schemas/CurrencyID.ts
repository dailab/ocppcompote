const schema = {
  type: "string",
  description:
    "The ProductPriceCurrencyType allows for the list of active codes of the official ISO 4217 currency names.\n\nFor the full list of active codes of the official ISO 4217 currencies, see: [https://www.iso.org/iso-4217-currency-codes.html](https://www.iso.org/iso-4217-currency-codes.html)\n\nExamples:\n\n| Option | Description |\n| ------ | ----------- |\n| EUR | Euro |\n| CHF | Swiss franc |\n| CAD | Canadian Dollar |\n| GBP | Pound sterling\n",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/CurrencyID", ...schema } as const;
export { with$id };

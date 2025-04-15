const schema = {
  type: "string",
  description:
    "The ProductIDType defines some standard values (see below). The type however also supports custom ProductIDs that can be specified by partners (as a string of 50 characters maximum length).\n| Option | Description |\n|--------|-------------|\n| Standard Price | Standard Price |\n| AC1 | Product for AC 1 Phase charging |\n| AC3 | Product for AC 3 Phase charging |\n| DC | Product for DC charging |\n| CustomProductID | There is no option “CustomProductID”, this sample option is meant to indicates that custom product ID specifications by partners (as a string of 50 characters maximum length) are allowed as well.|\n",
  maximum: 50,
} as const;
export default schema;

const with$id = { $id: "/components/schemas/ProductID", ...schema } as const;
export { with$id };

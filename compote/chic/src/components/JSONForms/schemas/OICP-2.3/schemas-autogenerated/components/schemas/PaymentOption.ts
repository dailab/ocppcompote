const schema = {
  type: "string",
  enum: ["No Payment", "Direct", "Contract"],
  description:
    "| Option | Description |\n| ------ | ----------- |\n| No payment | Free. |\n| Direct | e. g. Cash, Card, SMS, ... |\n| Contract | i. e. Subscription  |\n\nNote\n\n`No Payment` can not be combined with other payment option\n",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/PaymentOption",
  ...schema,
} as const;
export { with$id };

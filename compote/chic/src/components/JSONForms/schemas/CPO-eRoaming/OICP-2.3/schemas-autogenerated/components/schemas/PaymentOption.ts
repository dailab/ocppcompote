const schema = {
  type: "string",
  enum: ["No Payment", "Direct", "Contract"],
  title: "PaymentOption",
  description:
    "| Option | Description | | ------ | ----------- | | No payment | Free. | | Direct | e. g. Cash, Card, SMS, ... | | Contract | i. e. Subscription  |  Note  `No Payment` can not be combined with other payment option ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/PaymentOption",
  ...schema,
} as const;
export { with$id };

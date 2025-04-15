const schema = {
  type: "string",
  enum: ["Start", "Progress", "End", "Error"],
  title: "ChargingNotificationType",
  description: "The type of ChargingNotification",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ChargingNotificationType",
  ...schema,
} as const;
export { with$id };

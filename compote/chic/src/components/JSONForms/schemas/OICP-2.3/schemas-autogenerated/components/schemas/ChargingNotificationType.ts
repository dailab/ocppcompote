const schema = {
  type: "string",
  description: "The type of ChargingNotification",
  enum: ["Start", "Progress", "End", "Error"],
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ChargingNotificationType",
  ...schema,
} as const;
export { with$id };

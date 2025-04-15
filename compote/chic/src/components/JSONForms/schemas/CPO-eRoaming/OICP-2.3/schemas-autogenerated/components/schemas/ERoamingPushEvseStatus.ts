import componentsSchemasERoamingPushEvseStatusOperatorEvseStatus from "./ERoamingPushEvseStatusOperatorEvseStatus";

const schema = {
  properties: {
    ActionType: {
      type: "string",
      title: "Actiontype",
      description:
        "Describes the action that has to be performed by Hubject with the provided data.",
    },
    OperatorEvseStatus:
      componentsSchemasERoamingPushEvseStatusOperatorEvseStatus,
  },
  type: "object",
  required: ["ActionType", "OperatorEvseStatus"],
  title: "ERoamingPushEvseStatus",
  description:
    "eRoamingPushEvseStatus is a message that is sent in order to upload EVSE status data to Hubject.",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingPushEvseStatus",
  ...schema,
} as const;
export { with$id };

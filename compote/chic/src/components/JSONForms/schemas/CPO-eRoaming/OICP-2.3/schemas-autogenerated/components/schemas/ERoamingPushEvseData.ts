import componentsSchemasERoamingPushEvseDataOperatorEvseData from "./ERoamingPushEvseDataOperatorEvseData";

const schema = {
  properties: {
    ActionType: {
      type: "string",
      title: "Actiontype",
      description:
        "Describes the action that has to be performed by Hubject with the provided data.",
    },
    OperatorEvseData: componentsSchemasERoamingPushEvseDataOperatorEvseData,
  },
  type: "object",
  required: ["ActionType", "OperatorEvseData"],
  title: "ERoamingPushEvseData",
  description: "ERoamingPushEvseData",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingPushEvseData",
  ...schema,
} as const;
export { with$id };

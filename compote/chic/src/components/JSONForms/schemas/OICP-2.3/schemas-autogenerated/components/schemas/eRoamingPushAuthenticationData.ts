import componentsSchemasProviderAuthenticationData from "./ProviderAuthenticationData";

const schema = {
  type: "object",
  description:
    "eRoamingPushAuthenticationData is a message that is sent in order to upload authentication data to Hubject.\n\nNote:\n* This message is only for EMPs onboarded to the Hubject platform as offline EMPs.\n",
  required: ["ActionType", "ProviderAuthenticationData"],
  properties: {
    ActionType: {
      type: "string",
      enum: ["fullLoad", "update", "insert", "delete"],
      description:
        "Describes the action that has to be performed by Hubject with the provided data.",
    },
    ProviderAuthenticationData: componentsSchemasProviderAuthenticationData,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingPushAuthenticationData",
  ...schema,
} as const;
export { with$id };

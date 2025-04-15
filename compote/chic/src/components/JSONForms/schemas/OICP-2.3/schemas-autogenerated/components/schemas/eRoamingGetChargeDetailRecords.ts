import componentsSchemasOperatorID from "./OperatorID";
import componentsSchemasSessionID from "./SessionID";
import componentsSchemasProviderID from "./ProviderID";

const schema = {
  type: "object",
  description:
    "eRoamingGetChargeDetailRecords is a message to request a list of charge detail records.\n\nImportant:\n* This message is only mandatory for offline EMPs.\n",
  required: ["ProviderID", "From", "To"],
  properties: {
    ProviderID: componentsSchemasProviderID,
    From: {
      type: "string",
      format: "date-time",
      description: "Start of the requested time range.",
    },
    To: {
      type: "string",
      format: "date-time",
      description: "End of the requested time range.",
    },
    SessionID: {
      type: "array",
      description: "The Hubject SessionID that identifies the process",
      items: componentsSchemasSessionID,
    },
    OperatorID: componentsSchemasOperatorID,
    CDRForwarder: {
      type: "boolean",
      description:
        "Indicates if the CDR was successfuly forwarded to the EMP or not.",
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingGetChargeDetailRecords",
  ...schema,
} as const;
export { with$id };

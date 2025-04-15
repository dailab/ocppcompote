const schema = {
  properties: {
    id_token: {
      type: "object",
      title: "Id Token",
    },
    remote_start_id: {
      type: "integer",
      title: "Remote Start Id",
    },
    evse_id: {
      type: "integer",
      title: "Evse Id",
    },
    group_id_token: {
      type: "object",
      title: "Group Id Token",
    },
    charging_profile: {
      type: "object",
      title: "Charging Profile",
    },
    custom_data: {
      type: "object",
      title: "Custom Data",
    },
  },
  type: "object",
  required: ["id_token", "remote_start_id"],
  title: "OCPP20RemoteStartTransactionProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20RemoteStartTransactionProcessorBody",
  ...schema,
} as const;
export { with$id };

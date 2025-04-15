const schema = {
  properties: {
    id: {
      type: "integer",
      title: "Id",
    },
    expiry_date_time: {
      type: "string",
      title: "Expiry Date Time",
    },
    id_token: {
      type: "object",
      title: "Id Token",
    },
    connector_type: {
      type: "string",
      title: "Connector Type",
    },
    evse_id: {
      type: "integer",
      title: "Evse Id",
    },
    group_id_token: {
      type: "object",
      title: "Group Id Token",
    },
    custom_data: {
      type: "object",
      title: "Custom Data",
    },
  },
  type: "object",
  required: ["id", "expiry_date_time", "id_token"],
  title: "OCPP20ReserveNowProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20ReserveNowProcessorBody",
  ...schema,
} as const;
export { with$id };

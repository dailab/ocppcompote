const schema = {
  properties: {
    connector_id: {
      type: "integer",
      title: "Connector Id",
    },
    expiry_date: {
      type: "string",
      title: "Expiry Date",
    },
    id_tag: {
      type: "string",
      title: "Id Tag",
    },
    reservation_id: {
      type: "integer",
      title: "Reservation Id",
    },
    parent_id_tag: {
      type: "string",
      title: "Parent Id Tag",
    },
  },
  type: "object",
  required: ["connector_id", "expiry_date", "id_tag", "reservation_id"],
  title: "OCPP16ReserveNowProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16ReserveNowProcessorBody",
  ...schema,
} as const;
export { with$id };

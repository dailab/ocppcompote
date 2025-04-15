const schema = {
  properties: {
    reservation_id: {
      type: "integer",
      title: "Reservation Id",
    },
    custom_data: {
      type: "object",
      title: "Custom Data",
    },
  },
  type: "object",
  required: ["reservation_id"],
  title: "OCPP20CancelReservationProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20CancelReservationProcessorBody",
  ...schema,
} as const;
export { with$id };

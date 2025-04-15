const schema = {
  properties: {
    reservation_id: {
      type: "integer",
      title: "Reservation Id",
    },
  },
  type: "object",
  required: ["reservation_id"],
  title: "OCPP16CancelReservationProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16CancelReservationProcessorBody",
  ...schema,
} as const;
export { with$id };

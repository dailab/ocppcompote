import componentsSchemasERoamingAcknowledgment from "./../components/schemas/eRoamingAcknowledgment";
import componentsSchemasERoamingAuthorizeRemoteReservationStop from "./../components/schemas/eRoamingAuthorizeRemoteReservationStop";

const schema = {
  post: {
    summary: "eRoamingAuthorizeRemoteReservationStop_V1.1",
    operationId: "eRoamingAuthorizeRemoteReservationStop_V1",
    description:
      "__Note:__\n  * To `RECEIVE`\n  * Implementation: `OPTIONAL`\n\n![Reservation stop diagram](images/reservationstop.png)\n\neRoamingAuthorizeRemoteReservationStop basically works in the same way as eRoamingAuthorizeRemoteReservationStart.\nThe only difference is that this request is sent in order to end the reservation of a charging spot.\nThe request `MUST` contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeRemoteReservationStart request.\nAfter the eRoamingAuthorizeRemoteReservationStop the CPO `MUST` provide a CDR.\n",
    tags: ["eRoamingReservation"],
    parameters: {
      path: {
        properties: {
          providerID: {
            type: "string",
          },
        },
        required: ["providerID"],
        type: "object",
      },
    },
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: componentsSchemasERoamingAuthorizeRemoteReservationStop,
        },
      },
    },
    responses: {
      "200": {
        description: "Expected response to a valid request",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingAcknowledgment,
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/paths/_reservation_v11_providers_{providerID}_reservation-stop-request",
  ...schema,
} as const;
export { with$id };

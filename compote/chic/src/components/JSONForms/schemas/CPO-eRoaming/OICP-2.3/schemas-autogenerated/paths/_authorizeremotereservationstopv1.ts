import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasERoamingAcknowledgment from "./../components/schemas/ERoamingAcknowledgment";
import componentsSchemasERoamingAuthorizeRemoteReservationStop from "./../components/schemas/ERoamingAuthorizeRemoteReservationStop";

const schema = {
  post: {
    tags: ["CPO OICP Server API"],
    summary: "Eroamingauthorizeremotereservationstop V1",
    description:
      "__Note:__\n  * To `RECEIVE`\n  * Implementation: `OPTIONAL`\n\n![Reservation stop diagram](images/reservationstop.png)\n\neRoamingAuthorizeRemoteReservationStop basically works in the same way as eRoamingAuthorizeRemoteReservationStart.\nThe only difference is that this request is sent in order to end the reservation of a charging spot.\nThe request `MUST` contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeRemoteReservationStart request.\nAfter the eRoamingAuthorizeRemoteReservationStop the CPO `MUST` provide a CDR.",
    operationId:
      "eRoamingAuthorizeRemoteReservationStop_V1_authorizeremotereservationstopv1_post",
    parameters: {
      query: {
        properties: {
          operatorID: {
            type: "string",
            title: "Operatorid",
          },
        },
        required: [],
        type: "object",
      },
    },
    requestBody: {
      content: {
        "application/json": {
          schema: componentsSchemasERoamingAuthorizeRemoteReservationStop,
        },
      },
    },
    responses: {
      "200": {
        description: "Successful Response",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingAcknowledgment,
          },
        },
      },
      "422": {
        description: "Validation Error",
        content: {
          "application/json": {
            schema: componentsSchemasHTTPValidationError,
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/paths/_authorizeremotereservationstopv1",
  ...schema,
} as const;
export { with$id };

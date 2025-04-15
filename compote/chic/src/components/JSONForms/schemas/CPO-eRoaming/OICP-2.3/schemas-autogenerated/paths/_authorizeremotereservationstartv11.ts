import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasERoamingAcknowledgment from "./../components/schemas/ERoamingAcknowledgment";
import componentsSchemasERoamingAuthorizeRemoteReservationStart from "./../components/schemas/ERoamingAuthorizeRemoteReservationStart";

const schema = {
  post: {
    tags: ["CPO OICP Server API"],
    summary: "Eroamingauthorizeremotereservationstart V11",
    description:
      "__Note:__\n  * To `RECEIVE`\n  * Implementation: `OPTIONAL`\n  * This operation is used by EMPs in order to remotely reserve a charging point.\n\n![Reservation start diagram](images/reservationstart.png)\n\n__Functional Description:__\n\nScenario:\n\nA customer of an EMP wants to reserve a charging point of a CPO for a later charging process.\nThe customer informs his EMP of his intention, e.g. via mobile phone or smart phone application.\nThe EMPâ€™s provider system can then initiate a reservation of the CPOâ€™s charging point by sending an eRoamingAuthorizeRemoteReservationStart request to Hubject.\nThe request `MUST` contain the ProviderID and the EvseID.\nThe demanded reservation product can be specified using the field PartnerProductID.\n\nHubject will derive the CPOâ€™s OperatorID from the EvseID.\n\nHubject will check whether there is a valid contract between the two partners for the service Reservation (EMP must be the subscriber). If so, Hubject continues with checking the charging point compatibility. In case that the CPO has uploaded at least one charging point data record, Hubject will check whether the requested EvseID is among the uploaded data. If not, Hubject will respond with the status code 603 â€œUnknown EvseIDâ€. If yes, Hubject will check whether the charging spotâ€™s property â€œIsHubjectCompatibleâ€ is set â€œtrueâ€. If the property is false, Hubject will respond with the status code 604 â€œEvseID is not Hubject compatibleâ€.\n\nIn case that the requested EvseID is compatible or the CPO has not uploaded any EVSE records at all, Hubject generates a SessionID for the reservation process and forwards the request (including the SessionID) to the CPO. The CPO MUST return an eRoamingAcknowledgement message that MUST contain the result indicating whether the reservation was successful and that MAY contain a status code for further information.\n\nIn case that the CPOâ€™s system cannot be addressed (e.g. due to technical problems), Hubject will return to the requestor a â€œfalseâ€ result and a message indicating the connection error.",
    operationId:
      "eRoamingAuthorizeRemoteReservationStart_V11_authorizeremotereservationstartv11_post",
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
          schema: componentsSchemasERoamingAuthorizeRemoteReservationStart,
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
  $id: "/paths/_authorizeremotereservationstartv11",
  ...schema,
} as const;
export { with$id };

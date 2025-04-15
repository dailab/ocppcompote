import componentsSchemasERoamingAcknowledgment from "./../components/schemas/eRoamingAcknowledgment";
import componentsSchemasERoamingAuthorizeRemoteReservationStart from "./../components/schemas/eRoamingAuthorizeRemoteReservationStart";

const schema = {
  post: {
    summary: "eRoamingAuthorizeRemoteReservationStart_V1.1",
    operationId: "eRoamingAuthorizeRemoteReservationStart_V1.1",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `OPTIONAL`\n  * This operation is used by EMPs in order to remotely reserve a charging point.\n\n![Reservation start diagram](images/reservationstart.png)\n\n__Functional Description:__\n\nScenario:\n\nA customer of an EMP wants to reserve a charging point of a CPO for a later charging process.\nThe customer informs his EMP of his intention, e.g. via mobile phone or smart phone application.\nThe EMP’s provider system can then initiate a reservation of the CPO’s charging point by sending an eRoamingAuthorizeRemoteReservationStart request to Hubject.\nThe request `MUST` contain the ProviderID and the EvseID.\nThe demanded reservation product can be specified using the field PartnerProductID.\n\nHubject will derive the CPO’s OperatorID from the EvseID.\n\nHubject will check whether there is a valid contract between the two partners for the service Reservation (EMP must be the subscriber). If so, Hubject continues with checking the charging point compatibility. In case that the CPO has uploaded at least one charging point data record, Hubject will check whether the requested EvseID is among the uploaded data. If not, Hubject will respond with the status code 603 “Unknown EvseID”. If yes, Hubject will check whether the charging spot’s property “IsHubjectCompatible” is set “true”. If the property is false, Hubject will respond with the status code 604 “EvseID is not Hubject compatible”.\n\nIn case that the requested EvseID is compatible or the CPO has not uploaded any EVSE records at all, Hubject generates a SessionID for the reservation process and forwards the request (including the SessionID) to the CPO. The CPO MUST return an eRoamingAcknowledgement message that MUST contain the result indicating whether the reservation was successful and that MAY contain a status code for further information.\n\nIn case that the CPO’s system cannot be addressed (e.g. due to technical problems), Hubject will return to the requestor a “false” result and a message indicating the connection error.\n",
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
          schema: componentsSchemasERoamingAuthorizeRemoteReservationStart,
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
  $id: "/paths/_reservation_v11_providers_{providerID}_reservation-start-request",
  ...schema,
} as const;
export { with$id };

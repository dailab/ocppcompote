import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasERoamingAcknowledgment from "./../components/schemas/ERoamingAcknowledgment";
import componentsSchemasERoamingAuthorizeRemoteStart from "./../components/schemas/ERoamingAuthorizeRemoteStart";

const schema = {
  post: {
    tags: ["CPO OICP Server API"],
    summary: "Eroamingauthorizeremotestart V21",
    description:
      "__Note:__\n  * To `RECEIVE`\n  * Implementation: `MANDATORY`\n  * This operation is used by EMPs in order to remotely start a charging process\n\nThe service that is offered by Hubject in order to allow customers to directly start a charging process via mobile app.\n\n![Remote start diagram](images/remotestart.png)\n\n\n__Functional Description:__\n\n__Scenario:__\n\nA customer of an EMP wants to charge a vehicle at a charging station of a CPO. The customer informs his EMP of his intention, e.g. via mobile phone or smart phone application. The EMPâ€™s provider system can then initiate a charging process at the CPOâ€™s charging station by sending an eRoamingAuthorizeRemoteStart request to Hubject. The request `MUST` contain the ProviderID and the EvseID.\n\nHubject will derive the CPOâ€™s OperatorID from the EvseID.\n\nHubject will check whether there is a valid contract between the two partners for the service (EMP must be the subscriber). If so, Hubject continues with checking the charging point compatibility. In case that the CPO has uploaded at least one charging point data record, Hubject will check whether the requested EvseID is among the uploaded data. If not, Hubject will respond with the status code 603 â€œUnknown EvseIDâ€. If yes, Hubject will check whether the charging spotâ€™s property â€œIsHubjectCompatibleâ€ is set â€œtrueâ€. If the property is false, Hubject will respond with the status code 604 â€œEvseID is not Hubject compatibleâ€.\n\nIn case that the requested EvseID is compatible or the CPO has not uploaded any EVSE records at all, Hubject generates a SessionID for the following process and forwards the request (including the SessionID) to the CPO. The CPO `MUST` return an eRoamingAcknowledgement message that `MUST` contain the result indicating whether the charging process will be started and that `MAY` contain a status code for further information.\n\nIn case that the CPOâ€™s system cannot be addressed (e.g. due to technical problems), Hubject will return to the requestor a â€œfalseâ€ result and a message indicating the connection error.\n\nBest Practices:\n  * Please ensure a request run time of under 10 seconds including network roundtrip.",
    operationId:
      "eRoamingAuthorizeRemoteStart_v21_authorizeremotestartv21_post",
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
          schema: componentsSchemasERoamingAuthorizeRemoteStart,
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

const with$id = { $id: "/paths/_authorizeremotestartv21", ...schema } as const;
export { with$id };

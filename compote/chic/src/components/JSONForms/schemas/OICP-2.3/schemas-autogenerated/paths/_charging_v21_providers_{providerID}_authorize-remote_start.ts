import componentsSchemasERoamingAcknowledgment from "./../components/schemas/eRoamingAcknowledgment";
import componentsSchemasERoamingAuthorizeRemoteStart from "./../components/schemas/eRoamingAuthorizeRemoteStart";

const schema = {
  post: {
    summary: "eRoamingAuthorizeRemoteStart_v2.1",
    operationId: "eRoamingAuthorizeRemoteStart_v2.1",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `MANDATORY`\n  * This operation is used by EMPs in order to remotely start a charging process\n\nThe service that is offered by Hubject in order to allow customers to directly start a charging process via mobile app.\n\n![Remote start diagram](images/remotestart.png)\n\n\n__Functional Description:__\n\n__Scenario:__\n\nA customer of an EMP wants to charge a vehicle at a charging station of a CPO. The customer informs his EMP of his intention, e.g. via mobile phone or smart phone application. The EMP’s provider system can then initiate a charging process at the CPO’s charging station by sending an eRoamingAuthorizeRemoteStart request to Hubject. The request `MUST` contain the ProviderID and the EvseID.\n\nHubject will derive the CPO’s OperatorID from the EvseID.\n\nHubject will check whether there is a valid contract between the two partners for the service (EMP must be the subscriber). If so, Hubject continues with checking the charging point compatibility. In case that the CPO has uploaded at least one charging point data record, Hubject will check whether the requested EvseID is among the uploaded data. If not, Hubject will respond with the status code 603 “Unknown EvseID”. If yes, Hubject will check whether the charging spot’s property “IsHubjectCompatible” is set “true”. If the property is false, Hubject will respond with the status code 604 “EvseID is not Hubject compatible”.\n\nIn case that the requested EvseID is compatible or the CPO has not uploaded any EVSE records at all, Hubject generates a SessionID for the following process and forwards the request (including the SessionID) to the CPO. The CPO `MUST` return an eRoamingAcknowledgement message that `MUST` contain the result indicating whether the charging process will be started and that `MAY` contain a status code for further information.\n\nIn case that the CPO’s system cannot be addressed (e.g. due to technical problems), Hubject will return to the requestor a “false” result and a message indicating the connection error.\n\nBest Practices:\n  * Please ensure a request run time of under 10 seconds including network roundtrip.\n",
    tags: ["eRoamingAuthorization"],
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
          schema: componentsSchemasERoamingAuthorizeRemoteStart,
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
  $id: "/paths/_charging_v21_providers_{providerID}_authorize-remote_start",
  ...schema,
} as const;
export { with$id };

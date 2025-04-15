import componentsSchemasERoamingAuthorizationStart from "./../components/schemas/eRoamingAuthorizationStart";
import componentsSchemasERoamingAuthorizeStart from "./../components/schemas/eRoamingAuthorizeStart";

const schema = {
  post: {
    summary: "eRoamingAuthorizeStart_v2.1",
    operationId: "eRoamingAuthorizeStart_v2.1",
    description:
      "__Note:__\n  * To `RECEIVE`\n  * Implementation: `MANDATORY`\n\n__Functional Description:__\n\nScenario:\n\nA customer of an EMP wants to charge a vehicle at a charging point of a CPO. The customer authenticates at the charging point. The CPO’s operator system does not recognize the customer’s authentication data. In order to authorize the charging process, the CPO’s system can send an eRoamingAuthorizeStart request to Hubject. The request MUST contain the OperatorID and the identification data (e.g. UID or EvcoID) and MAY contain the EvseID.\n\nHubject generates a SessionID for the charging process and persists important session data (SessionID, EvseID, identification data).\n\nRegarding the further service processing, there are three different options:\n\na. Hubject first tries to authorize the customer offline by checking authentication master data. Authentication data can be uploaded by EMPs using the eRoamingAuthenticationData service.\n![Authorize Start offline diagram](images/authorizestart_offline.png)\n\nb. In case offline authorization is not possible, Hubject tries to derive the EMP from the provided identification data. QR Code and Plug&Charge identification data contain the EvcoID. Hubject can derive the EMP’s ProviderID from the EvcoID. Hubject will directly forward eRoamingAuthorizeStart requests to the EMP. The EMP provider system checks the requested authentication data and responds accordingly, either by authorizing or not authorizing the request. The response `MUST` contain the ProviderID and the AuthorizationStatus and `MAY` contain a list of identification data that is authorized to stop the charging process. In case that the EMP provider system cannot be addressed (e.g. due to technical problems), the corresponding provider will be dealt with as if responding “NotAuthorized”.\n![Authorize evco diagram](images/authorize_evco.png)\n\nc. In case that Hubject cannot derive the EMP from the identification data (e.g. with RFID identification), Hubject identifies all EMPs that are under contract with the CPO (EMPs must be the service subscriber) and forwards the eRoamingAuthorizeStart request to all these EMPs (broadcast). Hubject consolidates all EMP responses and creates an overall response, authorizing the request in case that one EMP authorized the request.\n\n![Authorize Start online diagram](images/authorizestart_online.png)\n\nIn case that the request for authorization was not successful, Hubject deletes the corresponding SessionID for the charging process.\n\nThe response from Hubject to the CPO contains authorization details and in case of successful authorization the created SessionID and the ProviderID of the authorizing provider.\n",
    tags: ["eRoamingAuthorization"],
    parameters: {
      path: {
        properties: {
          operatorID: {
            type: "string",
          },
        },
        required: ["operatorID"],
        type: "object",
      },
    },
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: componentsSchemasERoamingAuthorizeStart,
        },
      },
    },
    responses: {
      "200": {
        description: "Expected response to a valid request",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingAuthorizationStart,
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/paths/_charging_v21_operators_{operatorID}_authorize_start",
  ...schema,
} as const;
export { with$id };

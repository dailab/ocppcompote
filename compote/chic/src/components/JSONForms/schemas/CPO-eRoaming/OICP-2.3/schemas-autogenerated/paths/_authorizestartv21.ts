import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasERoamingAuthorizationStart from "./../components/schemas/ERoamingAuthorizationStart";
import componentsSchemasERoamingAuthorizeStart from "./../components/schemas/ERoamingAuthorizeStart";

const schema = {
  post: {
    tags: ["CPO OICP Client API"],
    summary: "Eroamingauthorizestart V21",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `MANDATORY`\n\n__Functional Description:__\n\nScenario:\n\nA customer of an EMP wants to charge a vehicle at a charging point of a CPO. The customer authenticates at the charging point. The CPOâ€™s operator system does not recognize the customerâ€™s authentication data. In order to authorize the charging process, the CPOâ€™s system can send an eRoamingAuthorizeStart request to Hubject. The request MUST contain the OperatorID and the identification data (e.g. UID or EvcoID) and MAY contain the EvseID.\n\nHubject generates a SessionID for the charging process and persists important session data (SessionID, EvseID, identification data).\n\nRegarding the further service processing, there are three different options:\n\na. Hubject first tries to authorize the customer offline by checking authentication master data. Authentication data can be uploaded by EMPs using the eRoamingAuthenticationData service.\n![Authorize Start offline diagram](images/authorizestart_offline.png)\n\nb. In case offline authorization is not possible, Hubject tries to derive the EMP from the provided identification data. QR Code and Plug&amp;Charge identification data contain the EvcoID. Hubject can derive the EMPâ€™s ProviderID from the EvcoID. Hubject will directly forward eRoamingAuthorizeStart requests to the EMP. The EMP provider system checks the requested authentication data and responds accordingly, either by authorizing or not authorizing the request. The response `MUST` contain the ProviderID and the AuthorizationStatus and `MAY` contain a list of identification data that is authorized to stop the charging process. In case that the EMP provider system cannot be addressed (e.g. due to technical problems), the corresponding provider will be dealt with as if responding â€œNotAuthorizedâ€.\n![Authorize evco diagram](images/authorize_evco.png)\n\nc. In case that Hubject cannot derive the EMP from the identification data (e.g. with RFID identification), Hubject identifies all EMPs that are under contract with the CPO (EMPs must be the service subscriber) and forwards the eRoamingAuthorizeStart request to all these EMPs (broadcast). Hubject consolidates all EMP responses and creates an overall response, authorizing the request in case that one EMP authorized the request.\n\n![Authorize Start online diagram](images/authorizestart_online.png)\n\n__Pin Security:__\n\nThe eRoamingAuthorizeStart request contains one of the defined identification types (see IdentificationType). The identification type â€œQRCodeIdentificationTypeâ€ (see QRCodeIdentificationType) contains - besides the â€œEvcoIDâ€ field - a â€œPINâ€ field or a â€œHashedPINâ€ field (only one of the two options must be provided).\n\nFor security reasons and as a general rule, Hubject does not store PINs in clear text, but always as encrypted hash values. In order to prevent hashed PIN values that may have been picked illegally from being used to request the authorization for charging processes, the PIN value `MUST` always be provided in clear text within the eRoamingAuthorizeStart request. This means that this operation `MUST` always provide the â€œPINâ€ field (clear text). Hubject will always generate a hash value of the provided PIN before checking the offline authentication data. So, in case that a PIN is provided by mistake as hashed value, Hubject automatically generates a hash of a hash, which eventually leads to a denial of authorization\n\nIn order to create hash values, Hubject applies the hash algorithm that the EMP has assigned to the QR Code identification record",
    operationId: "eRoamingAuthorizeStart_v21_authorizestartv21_post",
    parameters: {
      query: {
        properties: {
          operatorID: {
            type: "string",
            title: "Operatorid",
          },
        },
        required: ["operatorID"],
        type: "object",
      },
    },
    requestBody: {
      content: {
        "application/json": {
          schema: componentsSchemasERoamingAuthorizeStart,
        },
      },
    },
    responses: {
      "200": {
        description: "Successful Response",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingAuthorizationStart,
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

const with$id = { $id: "/paths/_authorizestartv21", ...schema } as const;
export { with$id };

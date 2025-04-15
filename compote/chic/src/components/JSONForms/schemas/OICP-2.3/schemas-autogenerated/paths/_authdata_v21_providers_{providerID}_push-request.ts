import componentsSchemasERoamingAcknowledgment from "./../components/schemas/eRoamingAcknowledgment";
import componentsSchemasERoamingPushAuthenticationData from "./../components/schemas/eRoamingPushAuthenticationData";

const schema = {
  post: {
    summary: "eRoamingPushAuthenticationData_V2.1",
    operationId: "eRoamingPushAuthenticationData_V2.1",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `MANDATORY`\n\n![Push authentication data diagram](images/pushauthentificationdata.png)\n\nWhen an EMP sends an eRoamingPushAuthenticationData request, Hubject checks whether there is a valid contract between Hubject and the EMP for the service type (Hubject must be the subscriber). If so, the operation allows uploading authentication data to Hubject. Furthermore, it is possible to update authentication data that has been pushed with an earlier operation request. How Hubject handles the transferred data `MUST` be defined in the request field “ActionType”, which offers four options (see below).\n\nThe authentication data to be inserted or updated `MUST` be provided with the “ProviderAuthenticationData” field, which consists of “AuthenticationDataRecord” structures. Hubject keeps a history of all updated and changed data records. Every successful push operation – irrespective of the performed action – leads to a new version of currently valid data records. Furthermore, each operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of authentication data for every point in time in the past.\n\n__Action types:__\n\n* __fullLoad:__ The EMP uploads the full set of current authentication data. Hubject does not compare the new data to old (earlier pushed) data. It keeps a history of old data records and handles the newly provided data as valid. In order to allow an easy deletion of all records, it is possible to perform a fullLoad with an empty list of records.\n\n* __insert:__ The EMP adds further authentication data records to the current set of data. Hubject verifies that the provided data records do not already exist in the currently valid data status. If so, the transaction will be aborted, no data will be inserted, and the request will be answered with an error message. Error details will be provided with the “AdditionalInfo” field.\n\n* __update:__ The EMP updates data records of the current set of data. Hubject verifies that the provided data records do exist in the currently valid data status. If not, the transaction will be aborted, no data will be updated, and the request will be answered with an error message.\n\n* __delete:__ The EMP deletes data records of the current set of data.\n\n__PIN security:__\n\nThe authentication data records that are uploaded to Hubject contain one of the defined identification types. The identification type “QRCodeIdentificationType” contains – besides an “EvcoID” field – a “PIN” field or a “HashedPIN” field (only one of the two options must be provided). For security reasons, Hubject generally does not store PINs in clear text, but always as encrypted hash values. When uploading authentication data to Hubject, the EMPs can directly provide hashed PIN values (using the field “HashedPIN”). In case that the PINs are provided in clear text (field “PIN”), Hubject will generate a hash value for every PIN and will store only the hashes. Hubject by default generates a hash using Bcrypt as a hashing function.\n\nIn case that an EMP provides already hashed PINs, he `MUST` also specify the corresponding hash generation algorithm so that Hubject can reproduce the hash generation when processing a request for authorization. For this reason, the “HashedPIN” field contains detailed information concerning the hash function and the hash salt value (for salted hash functions) that must be used for hash generation.\n\n__EVCO consistency:__\n\nEvcoIDs contain the ID of the corresponding EMP. With every data upload operation Hubject checks whether the given EMP’s ProviderID (or Sub-ProviderIDs if necessary) matches every given EvcoID. If not, Hubject refuses the data upload and responds with the status code 019.\n\nNote:\n\nThe eRoamingPushAuthenticationData operation `MUST` always be used sequentially.\n",
    tags: ["eRoamingAuthenticationData"],
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
          schema: componentsSchemasERoamingPushAuthenticationData,
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
  $id: "/paths/_authdata_v21_providers_{providerID}_push-request",
  ...schema,
} as const;
export { with$id };

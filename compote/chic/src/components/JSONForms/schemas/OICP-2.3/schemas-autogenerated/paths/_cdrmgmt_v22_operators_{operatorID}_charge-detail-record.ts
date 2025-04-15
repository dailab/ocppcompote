import componentsSchemasERoamingAcknowledgment from "./../components/schemas/eRoamingAcknowledgment";
import componentsSchemasERoamingChargeDetailRecord from "./../components/schemas/eRoamingChargeDetailRecord";

const schema = {
  post: {
    summary: "eRoamingChargeDetailRecord_V2.2",
    operationId: "eRoamingChargeDetailRecord_V2.2",
    description:
      "__Note:__\n  * To `RECEIVE`\n  * Implementation: `MANDATORY`\n\n![Charge Detail Record diagram](images/cdr.png)\n\n__Functional Description:__\n\nScenario:\n\nA customer of an EMP has charged a vehicle at a charging station of a CPO. The charging process was started with an eRoamingAuthorizeStart or an eRoamingAuthorizeRemoteStart operation. The process may have been stopped with an eRoamingAuthorizeStop or an eRoamingAuthorizeRemoteStop operation. A preceding stop request is not a necessary precondition for the processing of an eRoamingChargeDetailRecord request. The CPO’s provider system `MUST` send an eRoamingChargeDetailRecord (CDR) after the end of the charging process in order to inform the EMP of the charging session data (e.g. meter values and consumed energy) and further charging process details.\n\nNote:\n\nThe CPO `MUST` provide the same SessionID that was assigned to the corresponding charging process. Based on this information Hubject will be able to assign the session data to the correct process.\n\nHubject will identify the receiving EMP and will forward the CDR to the corresponding EMP. The EMP `MUST` return an eRoamingAcknowledgement message that `MUST` contain the result indicating whether the session data was received successfully and that `MAY` contain a status code for further information.\n\nHubject will accept only one CDR per SessionID.\n\nIn addition to forwarding the CDR to the EMP, Hubject also stores the CDR. In case that the recipient provider’s system cannot be addressed (e.g. due to technical problems), Hubject will nevertheless return to the requestor a positive result provided that storing the CDR was successful.\n",
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
          schema: componentsSchemasERoamingChargeDetailRecord,
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
  $id: "/paths/_cdrmgmt_v22_operators_{operatorID}_charge-detail-record",
  ...schema,
} as const;
export { with$id };

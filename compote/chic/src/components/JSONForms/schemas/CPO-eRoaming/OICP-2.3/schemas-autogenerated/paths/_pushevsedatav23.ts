import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasERoamingAcknowledgment from "./../components/schemas/ERoamingAcknowledgment";
import componentsSchemasERoamingPushEvseData from "./../components/schemas/ERoamingPushEvseData";

const schema = {
  post: {
    tags: ["CPO OICP Client API"],
    summary: "Eroamingpushevsedata V23",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `MANDATORY`\n\n![Push evse data diagram](images/pushevsedata.png)\n\nWhen a CPO sends an eRoamingPushEvseData request, Hubject checks whether there is a valid contract between Hubject and the CPO for the service type (Hubject must be the subscriber). If so, the operation allows uploading EVSE data to Hubject.\nFurthermore, it is possible to update or delete EVSE data that has been pushed with an earlier operation request.\nHow Hubject handles the transferred data `MUST` be defined in the request field &quot;ActionType&quot;, which offers four options.\n\nThe EvseData that will be inserted or updated `MUST` be provided in the OperatorEvseData field, which consists of EvseDataRecord structures. Hubject keeps a history of all updated and changed data records. Every successful push operation â€“ irrespective of the performed action â€“ leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of EvseData for every point in time in the past.\n\nEVSE consistency:\n\nEvseIDs contain the ID of the corresponding CPO (With every data upload operation Hubject checks whether the given CPOâ€™s OperatorID or Sub-OperatorIDs if necessary) matches every given EvseID. If not, Hubject refuses the data upload and responds with the status code 018.\n\nNote:\n* The eRoamingPushEvseData operation `MUST` always be used sequentially as described in Data Push Operations.",
    operationId: "eRoamingPushEvseData_V23_pushevsedatav23_post",
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
          schema: componentsSchemasERoamingPushEvseData,
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

const with$id = { $id: "/paths/_pushevsedatav23", ...schema } as const;
export { with$id };

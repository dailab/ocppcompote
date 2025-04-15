import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasERoamingAcknowledgment from "./../components/schemas/ERoamingAcknowledgment";
import componentsSchemasERoamingPushEvseStatus from "./../components/schemas/ERoamingPushEvseStatus";

const schema = {
  post: {
    tags: ["CPO OICP Client API"],
    summary: "Eroamingpushevsestatus V21",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `Mandatory`\n\n![Push EVSE status](images/pushevsestatus.png)\n\nWhen a CPO sends an eRoamingPushEvseStatus request, Hubject checks whether there is a valid contract between Hubject and the CPO for the service type (Hubject must be the subscriber). If so, the operation allows uploading EVSE status data to Hubject. Furthermore, it is possible to update EVSE status data that has been pushed with an earlier operation request.\n\nThe way how Hubject handles the transferred data `MUST` be defined in the request field &quot;ActionType2, which offers four options. This option works in the same way as the eRoamingAuthenticationData service. The EVSE status data that will be inserted or updated MUST be provided with the field â€œOperatorEvseStatusâ€, which consists of â€œEvseStatusRecordâ€ structures. Hubject keeps a history of all updated and changed data records. Every successful push operation â€“ irrespective of the performed action â€“ leads to a new version of currently valid data records. Furthermore, every operation is logged with the current timestamp. Thus, Hubject can reconstruct the status of EVSE status data for every point in time in the past.\n\nNote:\n\nThe eRoamingPushEvseStatus operation `MUST` always be used sequentiallyas described in Data Push Operations\n\nBest Practices:\n\nPlease try to avoid race conditions by sending multiple status simultaneously. Status should be sent one by one.",
    operationId: "eRoamingPushEvseStatus_V21_pushevsestatusv21_post",
    parameters: {
      query: {
        properties: {
          operatorId: {
            type: "string",
            title: "Operatorid",
          },
        },
        required: ["operatorId"],
        type: "object",
      },
    },
    requestBody: {
      content: {
        "application/json": {
          schema: componentsSchemasERoamingPushEvseStatus,
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

const with$id = { $id: "/paths/_pushevsestatusv21", ...schema } as const;
export { with$id };

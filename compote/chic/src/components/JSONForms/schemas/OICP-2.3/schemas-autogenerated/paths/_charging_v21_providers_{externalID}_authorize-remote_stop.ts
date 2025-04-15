import componentsSchemasERoamingAcknowledgment from "./../components/schemas/eRoamingAcknowledgment";
import componentsSchemasERoamingAuthorizeRemoteStop from "./../components/schemas/eRoamingAuthorizeRemoteStop";

const schema = {
  post: {
    summary: "eRoamingAuthorizeRemoteStop_v2.1",
    operationId: "eRoamingAuthorizeRemoteStop_v2.1",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `MANDATORY`\n\n![Remote stop diagram](images/remotestop.png)\n\neRoamingAuthorizeRemoteStop basically works in the same way as eRoamingAuthorizeRemoteStart. The only difference is that this request is sent in order to initiate the stopping of a charging process. The request `MUST` contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeRemoteStart request.\n",
    tags: ["eRoamingAuthorization"],
    parameters: {
      path: {
        properties: {
          externalID: {
            type: "string",
          },
        },
        required: ["externalID"],
        type: "object",
      },
    },
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: componentsSchemasERoamingAuthorizeRemoteStop,
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
  $id: "/paths/_charging_v21_providers_{externalID}_authorize-remote_stop",
  ...schema,
} as const;
export { with$id };

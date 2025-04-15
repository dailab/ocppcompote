import componentsSchemasERoamingAuthorizationStop from "./../components/schemas/eRoamingAuthorizationStop";
import componentsSchemasERoamingAuthorizeStop from "./../components/schemas/eRoamingAuthorizeStop";

const schema = {
  post: {
    summary: "eRoamingAuthorizeStop_V2.1",
    operationId: "eRoamingAuthorizeStop_V2.1",
    description:
      "__Note:__\n  * To `RECEIVE`\n  * Implementation: `OPTIONAL`\n\n![Authorize stop diagram](images/authorizestop.png)\n\neRoamingAuthorizeStop basically works in a similar way to the operation eRoamingAuthorizeStart.\nThe request is sent in order to authorize the stopping of a charging process.\nThe request `MUST` contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeStart request.\nIn most cases, Hubject can derive the EMP that authorized the charging process from the SessionID and can directly and offline authorize the request or forward the request for stopping to the EMP.\nIn case the charging session was originally authorized offline by the HBS, the session `MUST` only be stopped with the same medium, which was used for starting the session\n",
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
          schema: componentsSchemasERoamingAuthorizeStop,
        },
      },
    },
    responses: {
      "200": {
        description: "Expected response to a valid request",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingAuthorizationStop,
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/paths/_charging_v21_operators_{operatorID}_authorize_stop",
  ...schema,
} as const;
export { with$id };

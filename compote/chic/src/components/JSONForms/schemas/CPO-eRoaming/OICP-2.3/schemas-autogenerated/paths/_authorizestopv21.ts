import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasERoamingAuthorizationStop from "./../components/schemas/ERoamingAuthorizationStop";
import componentsSchemasERoamingAuthorizeStop from "./../components/schemas/ERoamingAuthorizeStop";

const schema = {
  post: {
    tags: ["CPO OICP Client API"],
    summary: "Eroamingauthorizestop V21",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `OPTIONAL`\n\n![Authorize stop diagram](images/authorizestop.png)\n\neRoamingAuthorizeStop basically works in a similar way to the operation eRoamingAuthorizeStart.\nThe request is sent in order to authorize the stopping of a charging process.\nThe request `MUST` contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeStart request.\nIn most cases, Hubject can derive the EMP that authorized the charging process from the SessionID and can directly and offline authorize the request or forward the request for stopping to the EMP.\nIn case the charging session was originally authorized offline by the HBS, the session `MUST` only be stopped with the same medium, which was used for starting the session",
    operationId: "eRoamingAuthorizeStop_v21_authorizestopv21_post",
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
          schema: componentsSchemasERoamingAuthorizeStop,
        },
      },
    },
    responses: {
      "200": {
        description: "Successful Response",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingAuthorizationStop,
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

const with$id = { $id: "/paths/_authorizestopv21", ...schema } as const;
export { with$id };

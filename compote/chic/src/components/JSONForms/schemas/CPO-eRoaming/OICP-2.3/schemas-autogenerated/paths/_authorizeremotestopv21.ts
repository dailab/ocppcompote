import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasERoamingAcknowledgment from "./../components/schemas/ERoamingAcknowledgment";
import componentsSchemasERoamingAuthorizeRemoteStop from "./../components/schemas/ERoamingAuthorizeRemoteStop";

const schema = {
  post: {
    tags: ["CPO OICP Server API"],
    summary: "Eroamingauthorizeremotestop V21",
    description:
      "__Note:__\n  * To `RECEIVE`\n  * Implementation: `MANDATORY`\n\n![Remote stop diagram](images/remotestop.png)\n\neRoamingAuthorizeRemoteStop basically works in the same way as eRoamingAuthorizeRemoteStart. The only difference is that this request is sent in order to initiate the stopping of a charging process. The request `MUST` contain the SessionID that was created by Hubject after the initial eRoamingAuthorizeRemoteStart request.",
    operationId: "eRoamingAuthorizeRemoteStop_v21_authorizeremotestopv21_post",
    parameters: {
      query: {
        properties: {
          externalID: {
            type: "string",
            title: "Externalid",
          },
        },
        required: [],
        type: "object",
      },
    },
    requestBody: {
      content: {
        "application/json": {
          schema: componentsSchemasERoamingAuthorizeRemoteStop,
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

const with$id = { $id: "/paths/_authorizeremotestopv21", ...schema } as const;
export { with$id };

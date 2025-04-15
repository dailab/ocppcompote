import componentsSchemasERoamingAuthorizationStartAuthorizationStopIdentificationsInner from "./ERoamingAuthorizationStartAuthorizationStopIdentificationsInner";
import componentsSchemasStatusCode from "./StatusCode";

const schema = {
  properties: {
    SessionID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Sessionid",
      description:
        "The Hubject SessionID that identifies the process  A string that `MUST` be valid with respect to the following regular expression:  `^[A-Za-z0-9]{8}(-[A-Za-z0-9]{4}){3}-[A-Za-z0-9]{12}$`  The expression validates the string as a GUID.  Example: â€œb2688855-7f00-0002-6d8e-48d883f6abb6â€ ",
    },
    CPOPartnerSessionID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Cpopartnersessionid",
      description:
        "Optional field containing the session id assigned by the CPO to the related operation.",
    },
    EMPPartnerSessionID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Emppartnersessionid",
      description:
        "Optional field containing the session id assigned by an EMP to the related operation.",
    },
    ProviderID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Providerid",
      description:
        "The ProviderID is defined by Hubject and is used to identify the EMP  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN  `^([A-Za-z]{2}\\-?[A-Za-z0-9]{3}|[A-Za-z]{2}[\\*|-]?[A-Za-z0-9]{3})$`  The expression validates the string as ProviderID including the preceding country code, which is part of EvcoID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the ProviderID is provided corresponding to ISO, the country code `MUST` be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ-â€ is optional.  Examples ISO: â€œDE8EOâ€, â€œDE-8EOâ€  Examples DIN: â€œDE8EOâ€, â€œDE*8EOâ€, â€œDE-8EOâ€ ",
    },
    AuthorizationStatus: {
      type: "string",
      title: "Authorizationstatus",
      description:
        "Information specifying whether the user is authorized to charge or not.  | Option | Description | | ------ | ----------- | | Authorized | User is authorized | | NotAuthorized | User is not authorized | ",
    },
    StatusCode: componentsSchemasStatusCode,
    AuthorizationStopIdentifications: {
      anyOf: [
        {
          items:
            componentsSchemasERoamingAuthorizationStartAuthorizationStopIdentificationsInner,
          type: "array",
        },
        {
          type: "null",
        },
      ],
      title: "Authorizationstopidentifications",
      description:
        "A list of Identification data that is authorized to stop the charging process.",
    },
  },
  type: "object",
  required: ["AuthorizationStatus", "StatusCode"],
  title: "ERoamingAuthorizationStart",
  description:
    "Note:   * To `RECEIVE`   * Implementation: `MANDATORY`  eRoamingAuthorizationStart is a message that authorizes a user to charge a car. NOTE: This message describes the response which has to be receive in response to the eRoamingAuthorizeStart. ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingAuthorizationStart",
  ...schema,
} as const;
export { with$id };

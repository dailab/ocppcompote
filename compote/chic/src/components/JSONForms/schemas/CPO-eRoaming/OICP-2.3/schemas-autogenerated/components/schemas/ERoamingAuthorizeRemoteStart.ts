import componentsSchemasIdentification from "./Identification";

const schema = {
  properties: {
    SessionID: {
      type: "string",
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
      type: "string",
      title: "Providerid",
      description:
        "The ProviderID is defined by Hubject and is used to identify the EMP  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN  `^([A-Za-z]{2}\\-?[A-Za-z0-9]{3}|[A-Za-z]{2}[\\*|-]?[A-Za-z0-9]{3})$`  The expression validates the string as ProviderID including the preceding country code, which is part of EvcoID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the ProviderID is provided corresponding to ISO, the country code `MUST` be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ-â€ is optional.  Examples ISO: â€œDE8EOâ€, â€œDE-8EOâ€  Examples DIN: â€œDE8EOâ€, â€œDE*8EOâ€, â€œDE-8EOâ€ ",
    },
    EvseID: {
      type: "string",
      title: "Evseid",
      description:
        "The ID that identifies the charging spot.  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN.  `^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?E[A-Za-z0-9\\*]{1,30})|(\\+?[0-9]{1,3}\\*[0-9]{3}\\*[0-9\\*]{1,32}))$` The expression validates the string as EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the EvseID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional. Furthermore the ID MUST provide an â€œEâ€ after the OperatorID in order to identify the ID as ISO EvseID without doubt.  In case the EvseID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*AB7*E840*6487â€, â€œDEAB7E8406487â€  Example DIN: â€œ+49*810*000*438â€ ",
    },
    Identification: componentsSchemasIdentification,
    PartnerProductID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Partnerproductid",
      description:
        "The ProductIDType defines some standard values (see below). The type however also supports custom ProductIDs that can be specified by partners (as a string of 50 characters maximum length). | Option | Description | |--------|-------------| | Standard Price | Standard Price | | AC1 | Product for AC 1 Phase charging | | AC3 | Product for AC 3 Phase charging | | DC | Product for DC charging | | CustomProductID | There is no option â€œCustomProductIDâ€, this sample option is meant to indicates that custom product ID specifications by partners (as a string of 50 characters maximum length) are allowed as well.| ",
    },
  },
  type: "object",
  required: ["SessionID", "ProviderID", "EvseID", "Identification"],
  title: "ERoamingAuthorizeRemoteStart",
  description: "ERoamingAuthorizeRemoteStart",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingAuthorizeRemoteStart",
  ...schema,
} as const;
export { with$id };

import componentsSchemasIdentification from "./Identification";
import componentsSchemasChargingNotificationType from "./ChargingNotificationType";

const schema = {
  properties: {
    Type: componentsSchemasChargingNotificationType,
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
        "Optional field containing the session ID assigned by the CPO to the related operation.  Partner systems can use this field to link their own session handling to HBS processes. ",
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
        "Optional field containing the session ID assigned by an EMP to the related operation.  Partner systems can use this field to link their own session handling to HBS processes. ",
    },
    Identification: {
      anyOf: [
        componentsSchemasIdentification,
        {
          type: "null",
        },
      ],
    },
    EvseID: {
      type: "string",
      title: "Evseid",
      description:
        "The ID that identifies the charging spot.  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN.  `^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?E[A-Za-z0-9\\*]{1,30})|(\\+?[0-9]{1,3}\\*[0-9]{3}\\*[0-9\\*]{1,32}))$` The expression validates the string as EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the EvseID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional. Furthermore the ID MUST provide an â€œEâ€ after the OperatorID in order to identify the ID as ISO EvseID without doubt.  In case the EvseID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*AB7*E840*6487â€, â€œDEAB7E8406487â€  Example DIN: â€œ+49*810*000*438â€ ",
    },
    ChargingStart: {
      type: "string",
      format: "date-time",
      title: "Chargingstart",
      description: "The date and time at which the charging process started.",
    },
    SessionStart: {
      anyOf: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
      title: "Sessionstart",
      description:
        "The date and time at which the session started, e.g. swipe of RFID or cable connected.",
    },
    MeterValueStart: {
      anyOf: [
        {
          type: "number",
        },
        {
          type: "integer",
        },
        {
          type: "null",
        },
      ],
      title: "Metervaluestart",
      description: "The starting meter value in kWh.",
    },
    OperatorID: {
      type: "string",
      title: "Operatorid",
      description:
        "A string that MUST be valid with respect to the following regular expression: ISO | DIN  ^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3})|(\\+?[0-9]{1,3}\\*[0-9]{3}))$ The expression validates the string as OperatorID including the preceding country code, which is part of EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118. In case the OperatorID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional.  In case the OperatorID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*A36â€, â€œDEA36â€  Example DIN: â€œ+49*536â€ ",
    },
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
  required: ["Type", "SessionID", "EvseID", "ChargingStart", "OperatorID"],
  title: "ERoamingChargingNotificationStart",
  description:
    "A customer of EMP Authorizes the charging session at particular charging station (via any means for eg REFID card, Mobile etc). The charging session is authorized by Hubject / CPO system. The authorization of charging process and plugging the cable in EV does not guarantee that energy flow into the Vehicle is initiated. It is really important for for EMP and its end consumer to know if the charging has started.  The CPOâ€™s backend system MAY send a ChargingNotification of type â€œStartâ€ after the CPO considers the charging of an EV is started (since energy flow have started) in order to inform the EMP that the actual charging (the energy flow) of the vehicle has started.  The ChargingNotification of type â€œStartâ€ is a message that contains information about the charging start of a session (e.g. ChargingStart). ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingChargingNotificationStart",
  ...schema,
} as const;
export { with$id };

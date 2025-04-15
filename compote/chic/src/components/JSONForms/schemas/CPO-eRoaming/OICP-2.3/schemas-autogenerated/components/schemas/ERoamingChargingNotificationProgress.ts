import componentsSchemasERoamingChargeDetailRecordMeterValueInBetween from "./ERoamingChargeDetailRecordMeterValueInBetween";
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
    EventOccurred: {
      type: "string",
      format: "date-time",
      title: "Eventoccurred",
      description:
        "The date and time at which the charging progress parameters are captured.",
    },
    ChargingDuration: {
      anyOf: [
        {
          type: "integer",
        },
        {
          type: "null",
        },
      ],
      title: "Chargingduration",
      description:
        "Charging Duration = EventOccurred - Charging Duration. It is a time in millisecond.  Either ChargingDuration or ConsumedEnergyProgress should be provided. Both can also be provided with each progress notification. ",
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
    ConsumedEnergyProgress: {
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
      title: "Consumedenergyprogress",
      description:
        "This is consumed energy when from Start of charging process till the charging progress notification generated (EventOccurred)  Either ChargingDuration or ConsumedEnergyProgress should be provided. Both can also be provided with each progress notification. ",
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
    MeterValueInBetween: {
      anyOf: [
        componentsSchemasERoamingChargeDetailRecordMeterValueInBetween,
        {
          type: "null",
        },
      ],
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
  required: [
    "Type",
    "SessionID",
    "EvseID",
    "ChargingStart",
    "EventOccurred",
    "OperatorID",
  ],
  title: "ERoamingChargingNotificationProgress",
  description:
    "A customer of EMP has started the charging session. Just like as that of regular gasoline stations customer would like to know either how much charging Duration have passed or how much energy is consumed by the EV so far. This information will help Customer to decide if he/she wants to stop the charging session as per their affordability or journey planning.  The CPOâ€™s backend system MAY send a ChargingNotification of type â€œProgessâ€ after the CPO gets the charging energy or time information from EVSEID. This is required in order to inform the EMP that the progress energy or chargingduration for a perticular charging session.  The ChargingNotification of type â€œProgressâ€ is a message that contains information about the charging Duration or energy consumed during charging process (e.g. EventOccurred, ChargingDuration, ConsumedEnergyProgress). ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingChargingNotificationProgress",
  ...schema,
} as const;
export { with$id };

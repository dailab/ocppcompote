import componentsSchemasERoamingChargeDetailRecordCalibrationLawVerificationInfo from "./ERoamingChargeDetailRecordCalibrationLawVerificationInfo";
import componentsSchemasERoamingChargeDetailRecordSignedMeteringValuesInner from "./ERoamingChargeDetailRecordSignedMeteringValuesInner";
import componentsSchemasERoamingChargeDetailRecordMeterValueInBetween from "./ERoamingChargeDetailRecordMeterValueInBetween";
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
    EvseID: {
      type: "string",
      title: "Evseid",
      description:
        "The ID that identifies the charging spot.  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN.  `^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?E[A-Za-z0-9\\*]{1,30})|(\\+?[0-9]{1,3}\\*[0-9]{3}\\*[0-9\\*]{1,32}))$` The expression validates the string as EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the EvseID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional. Furthermore the ID MUST provide an â€œEâ€ after the OperatorID in order to identify the ID as ISO EvseID without doubt.  In case the EvseID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*AB7*E840*6487â€, â€œDEAB7E8406487â€  Example DIN: â€œ+49*810*000*438â€ ",
    },
    Identification: componentsSchemasIdentification,
    ChargingStart: {
      type: "string",
      format: "date-time",
      title: "Chargingstart",
      description: "The date and time at which the charging process started.",
    },
    ChargingEnd: {
      type: "string",
      format: "date-time",
      title: "Chargingend",
      description: "The date and time at which the charging process stoped.",
    },
    SessionStart: {
      type: "string",
      format: "date-time",
      title: "Sessionstart",
      description:
        "The date and time at which the session started, e.g. swipe of RFID or cable connected.",
    },
    SessionEnd: {
      type: "string",
      format: "date-time",
      title: "Sessionend",
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
    MeterValueEnd: {
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
      title: "Metervalueend",
      description: "The ending meter value in kWh.",
    },
    MeterValueInBetween: {
      anyOf: [
        componentsSchemasERoamingChargeDetailRecordMeterValueInBetween,
        {
          type: "null",
        },
      ],
    },
    ConsumedEnergy: {
      anyOf: [
        {
          type: "number",
        },
        {
          type: "integer",
        },
      ],
      title: "Consumedenergy",
      description:
        "The difference between MeterValueEnd and MeterValueStart in kWh.",
    },
    SignedMeteringValues: {
      anyOf: [
        {
          items:
            componentsSchemasERoamingChargeDetailRecordSignedMeteringValuesInner,
          type: "array",
        },
        {
          type: "null",
        },
      ],
      title: "Signedmeteringvalues",
      description:
        "Metering Signature basically contains all metering signature values (these values should be in Transparency software format) for different status of charging session for eg start, end or progress. In total you can provide maximum 10 metering signature values",
    },
    CalibrationLawVerificationInfo: {
      anyOf: [
        componentsSchemasERoamingChargeDetailRecordCalibrationLawVerificationInfo,
        {
          type: "null",
        },
      ],
    },
    HubOperatorID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Huboperatorid",
      description:
        "A string that MUST be valid with respect to the following regular expression: ISO | DIN  ^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3})|(\\+?[0-9]{1,3}\\*[0-9]{3}))$ The expression validates the string as OperatorID including the preceding country code, which is part of EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118. In case the OperatorID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional.  In case the OperatorID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*A36â€, â€œDEA36â€  Example DIN: â€œ+49*536â€ ",
    },
    HubProviderId: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Hubproviderid",
      description:
        "The ProviderID is defined by Hubject and is used to identify the EMP  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN  `^([A-Za-z]{2}\\-?[A-Za-z0-9]{3}|[A-Za-z]{2}[\\*|-]?[A-Za-z0-9]{3})$`  The expression validates the string as ProviderID including the preceding country code, which is part of EvcoID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the ProviderID is provided corresponding to ISO, the country code `MUST` be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ-â€ is optional.  Examples ISO: â€œDE8EOâ€, â€œDE-8EOâ€  Examples DIN: â€œDE8EOâ€, â€œDE*8EOâ€, â€œDE-8EOâ€ ",
    },
  },
  type: "object",
  required: [
    "SessionID",
    "EvseID",
    "Identification",
    "ChargingStart",
    "ChargingEnd",
    "SessionStart",
    "SessionEnd",
    "ConsumedEnergy",
  ],
  title: "ERoamingChargeDetailRecord",
  description:
    "eRoamingChargeDetailRecord is a message that contains charging process details (e.g. meter values).",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingChargeDetailRecord",
  ...schema,
} as const;
export { with$id };

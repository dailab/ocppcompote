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
    OperatorID: {
      type: "string",
      title: "Operatorid",
      description:
        "A string that MUST be valid with respect to the following regular expression: ISO | DIN  ^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3})|(\\+?[0-9]{1,3}\\*[0-9]{3}))$ The expression validates the string as OperatorID including the preceding country code, which is part of EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118. In case the OperatorID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional.  In case the OperatorID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*A36â€, â€œDEA36â€  Example DIN: â€œ+49*536â€ ",
    },
    EvseID: {
      type: "string",
      title: "Evseid",
      description:
        "The ID that identifies the charging spot.  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN.  `^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?E[A-Za-z0-9\\*]{1,30})|(\\+?[0-9]{1,3}\\*[0-9]{3}\\*[0-9\\*]{1,32}))$` The expression validates the string as EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the EvseID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional. Furthermore the ID MUST provide an â€œEâ€ after the OperatorID in order to identify the ID as ISO EvseID without doubt.  In case the EvseID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*AB7*E840*6487â€, â€œDEAB7E8406487â€  Example DIN: â€œ+49*810*000*438â€ ",
    },
    ErrorType: {
      type: "string",
      title: "Errortype",
      description:
        "| Option | Description | | ------ | ----------- | | ConnectorError | Charging process cannot be started or stopped. EV driver needs to check if the the Plug is properly inserted or taken out from socket. | | CriticalError | Charging process stopped abruptly. Reason: Physical check at the station is required. Station cannot be reset online. <br /> Or <br /> Error with the software or hardware of the station locally. <br /> Or <br /> Communication failure with the vehicle. <br /> Or <br /> The error needs to be investigated <br /> Or <br /> Ground Failure | ",
    },
    ErrorAdditionalInfo: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Erroradditionalinfo",
      description:
        "The CPO can put in the additional information about the error",
    },
  },
  type: "object",
  required: ["Type", "SessionID", "OperatorID", "EvseID", "ErrorType"],
  title: "ERoamingChargingNotificationError",
  description:
    "A customer of EMP Authorizes the charging session at particular charging station (via any means for eg REFID card, Mobile etc). Due to some errors sometime, it is possible that charging does not start or charging process is abruptly stopped or fluctuations in the charging process. It is really important for Customer as well as EMP to know what exactly is happening at the charging process. This notification eventually helps EMPs well informed about the problem occurred with the charging process. This information can be easily passed onto Customer so that he/she can take appropriate action.  The CPOâ€™s backend system MAY send a ChargingNotification of type â€œErrorâ€ after the CPO gets an information about the error at the charging station. The CPO can transmit one of the ErrorClass defined by Hubject along with the additional information which elaborated the Error. The customer has to take one of the three action EV needs to be charged at some different station, Cables is properly attached or the error is for information only no action required by customer.  The ChargingNotification of type â€œErrorâ€ is a message that contains information about the charging end of a session (e.g. ErrorClass, ErrorAdditionalInfo). ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingChargingNotificationError",
  ...schema,
} as const;
export { with$id };

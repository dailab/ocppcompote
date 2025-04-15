import componentsSchemasEvseID from "./EvseID";
import componentsSchemasOperatorID from "./OperatorID";
import componentsSchemasIdentification from "./Identification";
import componentsSchemasSessionID from "./SessionID";
import componentsSchemasChargingNotificationType from "./ChargingNotificationType";

const schema = {
  type: "object",
  description:
    "A customer of EMP Authorizes the charging session at particular charging station (via any means for eg REFID card, Mobile etc). Due to some errors sometime, it is possible that charging does not start or charging process is abruptly stopped or fluctuations in the charging process. It is really important for Customer as well as EMP to know what exactly is happening at the charging process. This notification eventually helps EMPs well informed about the problem occurred with the charging process. This information can be easily passed onto Customer so that he/she can take appropriate action.\n\nThe CPO’s backend system MAY send a ChargingNotification of type “Error” after the CPO gets an information about the error at the charging station. The CPO can transmit one of the ErrorClass defined by Hubject along with the additional information which elaborated the Error. The customer has to take one of the three action EV needs to be charged at some different station, Cables is properly attached or the error is for information only no action required by customer.\n\nThe ChargingNotification of type “Error” is a message that contains information about the charging end of a session (e.g. ErrorClass, ErrorAdditionalInfo).\n",
  required: ["Type", "SessionID", "EvseID", "ErrorType", "OperatorID"],
  properties: {
    Type: componentsSchemasChargingNotificationType,
    SessionID: componentsSchemasSessionID,
    CPOPartnerSessionID: {
      type: "string",
      description:
        "Optional field containing the session ID assigned by the CPO to the related operation.\n\nPartner systems can use this field to link their own session handling to HBS processes.\n",
      maximum: 250,
    },
    EMPPartnerSessionID: {
      type: "string",
      description:
        "Optional field containing the session ID assigned by an EMP to the related operation.\n\nPartner systems can use this field to link their own session handling to HBS processes.\n",
      maximum: 250,
    },
    Identification: componentsSchemasIdentification,
    OperatorID: componentsSchemasOperatorID,
    EvseID: componentsSchemasEvseID,
    ErrorType: {
      type: "string",
      enum: ["ConnectorError", "CriticalError"],
      description:
        "| Option | Description |\n| ------ | ----------- |\n| ConnectorError | Charging process cannot be started or stopped. EV driver needs to check if the the Plug is properly inserted or taken out from socket. |\n| CriticalError | Charging process stopped abruptly. Reason: Physical check at the station is required. Station cannot be reset online. <br /> Or <br /> Error with the software or hardware of the station locally. <br /> Or <br /> Communication failure with the vehicle. <br /> Or <br /> The error needs to be investigated <br /> Or <br /> Ground Failure |\n",
    },
    ErrorAdditionalInfo: {
      type: "string",
      description:
        "The CPO can put in the additional information about the error",
      maximum: 250,
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingChargingNotificationError",
  ...schema,
} as const;
export { with$id };

import componentsSchemasProductID from "./ProductID";
import componentsSchemasOperatorID from "./OperatorID";
import componentsSchemasEvseID from "./EvseID";
import componentsSchemasIdentification from "./Identification";
import componentsSchemasSessionID from "./SessionID";
import componentsSchemasChargingNotificationType from "./ChargingNotificationType";

const schema = {
  type: "object",
  description:
    "A customer of EMP has started the charging session. Just like as that of regular gasoline stations customer would like to know either how much charging Duration have passed or how much energy is consumed by the EV so far. This information will help Customer to decide if he/she wants to stop the charging session as per their affordability or journey planning.\n\nThe CPO’s backend system MAY send a ChargingNotification of type “Progess” after the CPO gets the charging energy or time information from EVSEID. This is required in order to inform the EMP that the progress energy or chargingduration for a perticular charging session.\n\nThe ChargingNotification of type “Progress” is a message that contains information about the charging Duration or energy consumed during charging process (e.g. EventOccurred, ChargingDuration, ConsumedEnergyProgress).\n",
  required: [
    "Type",
    "SessionID",
    "EvseID",
    "ChargingStart",
    "EventOccurred",
    "OperatorID",
  ],
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
    EvseID: componentsSchemasEvseID,
    ChargingStart: {
      type: "string",
      format: "date-time",
      description: "The date and time at which the charging process started.",
    },
    EventOccurred: {
      type: "string",
      format: "date-time",
      description:
        "The date and time at which the charging progress parameters are captured.",
    },
    ChargingDuration: {
      type: "integer",
      description:
        "Charging Duration = EventOccurred - Charging Duration. It is a time in millisecond.\n\nEither ChargingDuration or ConsumedEnergyProgress should be provided. Both can also be provided with each progress notification.\n",
    },
    SessionStart: {
      type: "string",
      format: "date-time",
      description:
        "The date and time at which the session started, e.g. swipe of RFID or cable connected.",
    },
    ConsumedEnergyProgress: {
      type: "number",
      description:
        "This is consumed energy when from Start of charging process till the charging progress notification generated (EventOccurred)\n\nEither ChargingDuration or ConsumedEnergyProgress should be provided. Both can also be provided with each progress notification.\n",
    },
    MeterValueStart: {
      type: "number",
      description: "The starting meter value in kWh.",
    },
    MeterValueInBetween: {
      type: "object",
      description:
        "List of meter values that may have been taken in between (kWh).",
      properties: {
        meterValues: {
          type: "array",
          items: {
            type: "number",
          },
        },
      },
    },
    OperatorID: componentsSchemasOperatorID,
    PartnerProductID: componentsSchemasProductID,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingChargingNotificationProgress",
  ...schema,
} as const;
export { with$id };

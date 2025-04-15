import componentsSchemasProductID from "./ProductID";
import componentsSchemasOperatorID from "./OperatorID";
import componentsSchemasEvseID from "./EvseID";
import componentsSchemasIdentification from "./Identification";
import componentsSchemasSessionID from "./SessionID";
import componentsSchemasChargingNotificationType from "./ChargingNotificationType";

const schema = {
  type: "object",
  description:
    "A customer of an EMP has fully charged a vehicle at a charging station of a CPO. The charging process was started with an eRoamingAuthorizeStart or an eRoamingAuthorizeRemoteStart operation. The energy flow has ended, but the process has not yet been stopped and the vehicle is blocking the charging station.\n\nThe CPO’s backend system MAY send a ChargingNotification of type “End” after the CPO considers the charging of an EV concluded (because no energy is transmitted anymore) in order to inform the EMP that the actual charging (the energy flow) of the vehicle has stopped. The charging process has not yet been stopped by the customer and the session is still active.\n\nThe ChargingNotification of type “End” is a message that contains information about the charging end of a session (e.g. ConsumedEnergy, ChargingEnd).\n",
  required: ["Type", "SessionID", "EvseID", "ChargingEnd", "OperatorID"],
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
    ChargingEnd: {
      type: "string",
      format: "date-time",
      description: "The date and time at which the charging process stoped.",
    },
    SessionStart: {
      type: "string",
      format: "date-time",
      description:
        "The date and time at which the session started, e.g. swipe of RFID or cable connected.",
    },
    SessionEnd: {
      type: "string",
      format: "date-time",
      description:
        "The date and time at which the session started, e.g. swipe of RFID or cable connected.",
    },
    ConsumedEnergy: {
      type: "number",
      description:
        "The difference between MeterValueEnd and MeterValueStart in kWh.",
    },
    MeterValueStart: {
      type: "number",
      description: "The starting meter value in kWh.",
    },
    MeterValueEnd: {
      type: "number",
      description: "The ending meter value in kWh.",
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
    PenaltyTimeStart: {
      type: "string",
      format: "date-time",
      description:
        "The date and time at which the penalty time start after the grace period.",
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingChargingNotificationEnd",
  ...schema,
} as const;
export { with$id };

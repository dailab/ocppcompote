import componentsSchemasProductID from "./ProductID";
import componentsSchemasOperatorID from "./OperatorID";
import componentsSchemasEvseID from "./EvseID";
import componentsSchemasIdentification from "./Identification";
import componentsSchemasSessionID from "./SessionID";
import componentsSchemasChargingNotificationType from "./ChargingNotificationType";

const schema = {
  type: "object",
  description:
    "A customer of EMP Authorizes the charging session at particular charging station (via any means for eg REFID card, Mobile etc). The charging session is authorized by Hubject / CPO system. The authorization of charging process and plugging the cable in EV does not guarantee that energy flow into the Vehicle is initiated. It is really important for for EMP and its end consumer to know if the charging has started.\n\nThe CPO’s backend system MAY send a ChargingNotification of type “Start” after the CPO considers the charging of an EV is started (since energy flow have started) in order to inform the EMP that the actual charging (the energy flow) of the vehicle has started.\n\nThe ChargingNotification of type “Start” is a message that contains information about the charging start of a session (e.g. ChargingStart).\n",
  required: ["Type", "SessionID", "EvseID", "ChargingStart", "OperatorID"],
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
    SessionStart: {
      type: "string",
      format: "date-time",
      description:
        "The date and time at which the session started, e.g. swipe of RFID or cable connected.",
    },
    MeterValueStart: {
      type: "number",
      description: "The starting meter value in kWh.",
    },
    OperatorID: componentsSchemasOperatorID,
    PartnerProductID: componentsSchemasProductID,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingChargingNotificationStart",
  ...schema,
} as const;
export { with$id };

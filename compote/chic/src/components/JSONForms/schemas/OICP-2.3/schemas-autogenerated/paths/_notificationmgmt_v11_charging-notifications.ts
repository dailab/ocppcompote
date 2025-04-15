import componentsSchemasERoamingAcknowledgment from "./../components/schemas/eRoamingAcknowledgment";
import componentsSchemasERoamingChargingNotificationError from "./../components/schemas/eRoamingChargingNotificationError";
import componentsSchemasERoamingChargingNotificationEnd from "./../components/schemas/eRoamingChargingNotificationEnd";
import componentsSchemasERoamingChargingNotificationProgress from "./../components/schemas/eRoamingChargingNotificationProgress";
import componentsSchemasERoamingChargingNotificationStart from "./../components/schemas/eRoamingChargingNotificationStart";

const schema = {
  post: {
    summary: "eRoamingChargingNotifications_V1.1",
    operationId: "eRoamingChargingNotifications_V1.1",
    description:
      "![Charging notifications diagram](images/chargingnotifications.png)\nThe ChargingNotification feature enables CPOs to notify EMPs about the end of charge\n\nThe ChargingNotification feature basically increases the transparency between CPO - EMP - End Consumer to the level of each charging session.\n\nThis feature enables CPO to send various notifications during a single Charging Session. These notifications give the details like\n\n1. When the charging session has started. The CPO can send ChargingNotification of type “Start” to Hubject containing information like ChargingStart, MeterStartValue, EVSEID etc.\n\n2. Consumed Energy values during the charging process or duration of successful charging process that has lapsed. The CPO can send ChargingNotification of type “Progress” to Hubject containing information like ChargingStart, EventOccurred, ChargingDuration, ConsumedEnergyProgress, EVSEID etc. The frequency between two progress notifications for one charging session should be at least 5 minutes.\n\n3. When the charging session has ended (because no energy is transmitted anymore). The CPO can send a ChargingNotification of type “End” to Hubject containing information such as ChargingEnd, ConsumedEnergy, EVSEID etc.\n\n4. Error occurred before charging starts or during charging process or abrupt changing end. The CPO can send a ChargingNotification of type “Error” to Hubject containing information such as ErrorClass, ErrorAdditionalInfo, EVSEID etc.\n\nHubject will forward Start, Progress, End and Error notification requests to the EMP. The EMP responds with an eRoamingAcknowledgement. This acknowledgement is then being forwarded to the CPO.\n\nThis feature should cover all the notifications that could happen between Session Start and Session End in future. Each bit of information increases transparency to the customer of EMP.\n",
    tags: ["eRoamingChargingNotifications"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            oneOf: [
              componentsSchemasERoamingChargingNotificationStart,
              componentsSchemasERoamingChargingNotificationProgress,
              componentsSchemasERoamingChargingNotificationEnd,
              componentsSchemasERoamingChargingNotificationError,
            ],
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Expected response to a valid request",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingAcknowledgment,
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/paths/_notificationmgmt_v11_charging-notifications",
  ...schema,
} as const;
export { with$id };

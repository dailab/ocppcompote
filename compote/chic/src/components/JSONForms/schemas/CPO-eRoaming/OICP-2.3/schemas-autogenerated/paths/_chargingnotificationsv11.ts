import componentsSchemasHTTPValidationError from "./../components/schemas/HTTPValidationError";
import componentsSchemasERoamingAcknowledgment from "./../components/schemas/ERoamingAcknowledgment";
import componentsSchemasERoamingChargingNotificationError from "./../components/schemas/ERoamingChargingNotificationError";
import componentsSchemasERoamingChargingNotificationEnd from "./../components/schemas/ERoamingChargingNotificationEnd";
import componentsSchemasERoamingChargingNotificationProgress from "./../components/schemas/ERoamingChargingNotificationProgress";
import componentsSchemasERoamingChargingNotificationStart from "./../components/schemas/ERoamingChargingNotificationStart";

const schema = {
  post: {
    tags: ["CPO OICP Client API"],
    summary: "Eroamingchargingnotifications V11",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `OPTIONAL`\n\n__Functional Description:__\n\n![Charging notifications diagram](images/chargingnotifications.png)\nThe ChargingNotification feature enables CPOs to notify EMPs about the end of charge\n\nThe ChargingNotification feature basically increases the transparency between CPO - EMP - End Consumer to the level of each charging session.\n\nThis feature enables CPO to send various notifications during a single Charging Session. These notifications give the details like\n\n1. When the charging session has started. The CPO can send ChargingNotification of type â€œStartâ€ to Hubject containing information like ChargingStart, MeterStartValue, EVSEID etc.\n\n2. Consumed Energy values during the charging process or duration of successful charging process that has lapsed. The CPO can send ChargingNotification of type â€œProgressâ€ to Hubject containing information like ChargingStart, EventOccurred, ChargingDuration, ConsumedEnergyProgress, EVSEID etc. The frequency between two progress notifications for one charging session should be at least 5 minutes.\n\n3. When the charging session has ended (because no energy is transmitted anymore). The CPO can send a ChargingNotification of type â€œEndâ€ to Hubject containing information such as ChargingEnd, ConsumedEnergy, EVSEID etc.\n\n4. Error occurred before charging starts or during charging process or abrupt changing end. The CPO can send a ChargingNotification of type â€œErrorâ€ to Hubject containing information such as ErrorClass, ErrorAdditionalInfo, EVSEID etc.\n\nHubject will forward Start, Progress, End and Error notification requests to the EMP. The EMP responds with an eRoamingAcknowledgement. This acknowledgement is then being forwarded to the CPO.\n\nThis feature should cover all the notifications that could happen between Session Start and Session End in future. Each bit of information increases transparency to the customer of EMP.",
    operationId:
      "eRoamingChargingNotifications_V11_chargingnotificationsv11_post",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            anyOf: [
              componentsSchemasERoamingChargingNotificationStart,
              componentsSchemasERoamingChargingNotificationProgress,
              componentsSchemasERoamingChargingNotificationEnd,
              componentsSchemasERoamingChargingNotificationError,
            ],
            title: "Body",
            default: {
              Type: "Start",
              SessionID: "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
              CPOPartnerSessionID: "1234XYZ",
              EMPPartnerSessionID: "2345ABC",
              Identification: {
                RFIDMifareFamilyIdentification: {
                  UID: "1234ABCD",
                },
              },
              EvseID: "DE*XYZ*ETEST1",
              ChargingStart: "2020-09-23T14:17:53.038000Z",
              SessionStart: "2020-09-23T14:17:53.038000Z",
              MeterValueStart: 0,
              OperatorID: "DE*ABC",
              PartnerProductID: "AC 1",
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Successful Response",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingAcknowledgment,
          },
        },
      },
      "422": {
        description: "Validation Error",
        content: {
          "application/json": {
            schema: componentsSchemasHTTPValidationError,
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = { $id: "/paths/_chargingnotificationsv11", ...schema } as const;
export { with$id };

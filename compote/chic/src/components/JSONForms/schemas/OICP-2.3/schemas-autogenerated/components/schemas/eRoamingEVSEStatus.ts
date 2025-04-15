import componentsSchemasStatusCode from "./StatusCode";
import componentsSchemasEvseStatus from "./EvseStatus";
import componentsSchemasEvseID from "./EvseID";
import componentsSchemasOperatorID from "./OperatorID";

const schema = {
  type: "object",
  description:
    "eRoamingEVSEStatus is sent in response to eRoamingPullEVSEStatus requests.\n\nNote:\n  * This message describes the response which will be received as response to the eRoamingPullEVSEStatus request.\n",
  required: ["EvseStatuses"],
  properties: {
    EvseStatuses: {
      type: "object",
      description:
        "A list of EVSE status blocks that are each assigned to a certain operator.",
      required: ["OperatorEvseStatus"],
      properties: {
        OperatorEvseStatus: {
          type: "array",
          items: {
            type: "object",
            required: ["OperatorID", "EvseStatusRecord"],
            properties: {
              OperatorID: componentsSchemasOperatorID,
              OperatorName: {
                type: "string",
                description: "Free text for operator",
              },
              EvseStatusRecord: {
                type: "array",
                items: {
                  type: "object",
                  required: ["EvseID", "EvseStatus"],
                  properties: {
                    EvseID: componentsSchemasEvseID,
                    EvseStatus: componentsSchemasEvseStatus,
                  },
                },
              },
            },
          },
        },
      },
    },
    StatusCode: componentsSchemasStatusCode,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingEVSEStatus",
  ...schema,
} as const;
export { with$id };

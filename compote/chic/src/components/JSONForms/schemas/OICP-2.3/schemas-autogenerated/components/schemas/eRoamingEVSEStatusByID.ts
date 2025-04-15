import componentsSchemasStatusCode from "./StatusCode";
import componentsSchemasEvseStatus from "./EvseStatus";
import componentsSchemasEvseID from "./EvseID";

const schema = {
  type: "object",
  description:
    "eRoamingEVSEStatusById is sent in response to eRoamingPullEVSEByIDStatus requests.\n\nNote:\n  * This message describes the response which will be received as response to the eRoamingPullEVSEByIDStatus request.\n",
  required: ["EVSEStatusRecords"],
  properties: {
    EVSEStatusRecords: {
      type: "object",
      description: "A list of the requested EVSE status blocks.",
      required: ["EvseStatusRecord"],
      properties: {
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
    StatusCode: componentsSchemasStatusCode,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingEVSEStatusByID",
  ...schema,
} as const;
export { with$id };

import componentsSchemasERoamingEVSEStatusByID from "./../components/schemas/eRoamingEVSEStatusByID";
import componentsSchemasERoamingEVSEStatus from "./../components/schemas/eRoamingEVSEStatus";
import componentsSchemasERoamingPullEVSEStatusByOperatorID from "./../components/schemas/eRoamingPullEVSEStatusByOperatorID";
import componentsSchemasERoamingPullEVSEStatusByID from "./../components/schemas/eRoamingPullEVSEStatusByID";
import componentsSchemasERoamingPullEVSEStatus from "./../components/schemas/eRoamingPullEVSEStatus";

const schema = {
  post: {
    summary: "eRoamingPullEvseStatus_V2.1",
    operationId: "eRoamingPullEvseStatus_V2.1",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `Mandatory`\n\n![Pull EVSE status](images/pullevsestatus.png)\n    \nWhen an EMP sends an eRoamingPullEVSEStatus request, Hubject checks whether there is a valid contract between Hubject and the EMP for the service type (EMP must be the subscriber). If so, the operation allows downloading EVSE status data from Hubject. When an EMP sends an eRoamingPullEVSEStatus request, Hubject identifies all currently valid EVSE status records of all operators.\n\nHubject groups all resulting EVSE status records according to the related CPO. The response structure contains an “EvseStatuses” node that envelopes an “OperatorEVSEStatus” node for every CPO with currently valid and accessible status data records.\n",
    tags: ["eRoamingEvseStatus"],
    parameters: {
      path: {
        properties: {
          providerID: {
            type: "string",
          },
        },
        required: ["providerID"],
        type: "object",
      },
    },
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            oneOf: [
              componentsSchemasERoamingPullEVSEStatus,
              componentsSchemasERoamingPullEVSEStatusByID,
              componentsSchemasERoamingPullEVSEStatusByOperatorID,
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
            schema: {
              oneOf: [
                componentsSchemasERoamingEVSEStatus,
                componentsSchemasERoamingEVSEStatusByID,
              ],
            },
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/paths/_evsepull_v21_providers_{providerID}_status-records",
  ...schema,
} as const;
export { with$id };

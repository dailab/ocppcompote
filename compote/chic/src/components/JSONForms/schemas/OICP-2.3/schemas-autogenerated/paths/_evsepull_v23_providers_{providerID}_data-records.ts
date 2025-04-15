import componentsSchemasERoamingEVSEData from "./../components/schemas/eRoamingEVSEData";
import componentsSchemasERoamingPullEVSEData from "./../components/schemas/eRoamingPullEVSEData";

const schema = {
  post: {
    summary: "eRoamingPullEvseData_V2.3",
    operationId: "eRoamingPullEvseData_V2.3",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: `MANDATORY`\n\n![Pull evse data diagram](images/pullevsedata.png)\n\nWhen an EMP sends an eRoamingPullEVSEData request, Hubject checks whether there is a valid contract between Hubject and the EMP for the service type (EMP must be the subscriber). If so, the operation allows downloading EVSEData from Hubject. When an EMP sends an eRoamingPullEVSEData request, Hubject identifies all currently valid EVSEData records of all operators.\n\nFor every EVSE data record Hubject identifies the timestamp of the last update, which has been performed on the record. The timestamp is returned with the attribute “lastUpdate”.\n\n__Delta pull:__\n\nAs mentioned above, the operation by default returns all currently valid EVSE data records. However, the requesting EMP has the possibility to download only the changes (delta) compared to a certain time in the past. In order to do so, the EMP MUST provide the optional date/time field “LastCall”, indicating his last EVSE pull request. In case that Hubject receives the LastCall parameter, Hubject compares the EVSE records from the time of the last call with the currently valid records. As a result, Hubject assigns the attribute “deltaType” (possible values: insert, update, delete) to every response EVSE data record indicating whether the particular record has been inserted, updated or deleted in the meantime. EVSE data records that have not changed will not be part of the response.\n\nNote:\n* The delta pull option cannot be combined with radial search, because in some cases this could lead to data inconsistency on the EMP’s side. This is why the API only allows the provision of either the attribute “SearchCenter” or “LastCall”.\n\n__Pagination:__\n\nStarting from OICP 2.3, eRoamingPullEvseData uses pagination. This is an implementation that EMPs `MUST` use in order to divide the amount of EvseDataRecords contained in the response of the pull request.\n\nThe parameters of the pagination are given at the end of the end point: `…​?page=0&size=20` where `page` indicates the number of the page for the response and `size` the amount of records to be provided in the response.\n\nImportant:\n* __The default number of records provided in the eRoamingEvseData response is 20 elements.__\n",
    tags: ["eRoamingEvseData"],
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
          schema: componentsSchemasERoamingPullEVSEData,
        },
      },
    },
    responses: {
      "200": {
        description: "Expected response to a valid request",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingEVSEData,
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/paths/_evsepull_v23_providers_{providerID}_data-records",
  ...schema,
} as const;
export { with$id };

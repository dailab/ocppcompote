import componentsSchemasERoamingChargeDetailRecords from "./../components/schemas/eRoamingChargeDetailRecords";
import componentsSchemasERoamingGetChargeDetailRecords from "./../components/schemas/eRoamingGetChargeDetailRecords";

const schema = {
  post: {
    summary: "eRoamingGetChargeDetailRecords_V2.2",
    operationId: "eRoamingGetChargeDetailRecords_V2.2",
    description:
      "__Note:__\n  * To `SEND`\n  * Implementation: EMP Online `OPTIONAL`, EMP Offline `MANDATORY`\n\n![Get Charge Detail Records diagram](images/getcdr.png)\n\nThe operation allows EMPs to download CDRs that have been sent to Hubject by partner CPOs. This means if for example Hubject was unable to forward a CDR from a CPO to an EMP due to technical problems in the EMP’s backend, the EMP will still have the option of obtaining these CDRs. The EMP `MUST` specify a date range in the request. Hubject will return a list of all CDRs received by the HBS within the specified date range for the requesting EMP (i.e. all CDRs within the date range where the corresponding charging process was authorized by the EMP or authorized by Hubject based on the EMP’s authentication data.\n\nHubject does not check whether a requested CDR has already been provided to the requesting EMP in the past.\n\nPagination:\n\nStarting from OICP 2.3, eRoaminGetChargeDetailRecords uses pagination. This is an implementation that EMPs `MUST` use in order to divide the amount of ChargeDetailRecords contained in the response of the pull request.\n\nThe parameters of the pagination are given at the end of the end point: `…​?page=0&size=20` where `page` indicates the number of the page for the response and `size` the amount of records to be provided in the response.\n\nExample:\n\nUsing OICP 2.3 GetChargeDetailRecords endpoint for PROD environment:\n\nhttps://service.hubject.com/api/oicp/cdrmgmt/v22/providers/{providerID}/get-charge-detail-records-request?page=0&size=1500\n\nIn the previous request we are telling to provide page __0__ with __1500__ records in it.\n\nImportant\n\nThe default number of records provided in the response are __20__ elements and the maximum number of records possible to obtain per page are __2000__.\n",
    tags: ["eRoamingAuthorization"],
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
          schema: componentsSchemasERoamingGetChargeDetailRecords,
        },
      },
    },
    responses: {
      "200": {
        description: "Expected response to a valid request",
        content: {
          "application/json": {
            schema: componentsSchemasERoamingChargeDetailRecords,
          },
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/paths/_cdrmgmt_v22_providers_{providerID}_get-charge-detail-records-request",
  ...schema,
} as const;
export { with$id };

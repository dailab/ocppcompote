import componentsSchemasStatusCode from "./StatusCode";
import componentsSchemasERoamingChargeDetailRecord from "./eRoamingChargeDetailRecord";

const schema = {
  type: "object",
  description:
    "eRoamingChargeDetailRecord is a message containing charging process details (such as meter values, etc.).",
  required: [
    "content",
    "number",
    "size",
    "totalElements",
    "last",
    "totalPages",
    "first",
    "numberOfElements",
    "StatusCode",
  ],
  properties: {
    content: {
      type: "array",
      items: componentsSchemasERoamingChargeDetailRecord,
    },
    number: {
      type: "integer",
      description: "Number of the page",
    },
    size: {
      type: "integer",
      description: "Size of records requested per page",
    },
    totalElements: {
      type: "integer",
      description:
        "Number of total charge detail records available from the request",
    },
    last: {
      type: "boolean",
      description: "Indicates if the current page is the last page",
    },
    totalPages: {
      type: "integer",
      description: "Number of total pages available for the request",
    },
    first: {
      type: "boolean",
      description: "indicates if the current page is the first page",
    },
    numberOfElements: {
      type: "integer",
      description: "Number of records in the page",
    },
    StatusCode: componentsSchemasStatusCode,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingChargeDetailRecords",
  ...schema,
} as const;
export { with$id };

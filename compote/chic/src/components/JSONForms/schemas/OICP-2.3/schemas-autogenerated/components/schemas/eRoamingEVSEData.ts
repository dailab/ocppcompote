import componentsSchemasStatusCode from "./StatusCode";
import componentsSchemasPullEvseDataRecord from "./PullEvseDataRecord";

const schema = {
  type: "object",
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
      description:
        "A list of EVSE data blocks that are each assigned to a certain operator.",
      items: componentsSchemasPullEvseDataRecord,
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
        "Number of total charging stations available from the request",
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
  $id: "/components/schemas/eRoamingEVSEData",
  ...schema,
} as const;
export { with$id };

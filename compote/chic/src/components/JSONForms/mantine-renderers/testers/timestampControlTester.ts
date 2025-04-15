import {
  rankWith,
  uiTypeIs,
  and,
  schemaTypeIs,
  scopeEndsWith,
} from "@jsonforms/core";

export default rankWith(
  11,
  and(uiTypeIs("Control"), schemaTypeIs("integer"), scopeEndsWith("startTime"))
);

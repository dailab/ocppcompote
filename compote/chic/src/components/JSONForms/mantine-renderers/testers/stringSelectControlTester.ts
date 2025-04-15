import {
  rankWith,
  uiTypeIs,
  and,
  schemaTypeIs,
  isEnumControl,
} from "@jsonforms/core";

export default rankWith(
  11,
  and(uiTypeIs("Control"), schemaTypeIs("string"), isEnumControl)
);

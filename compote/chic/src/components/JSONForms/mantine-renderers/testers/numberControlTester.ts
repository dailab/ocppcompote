import { rankWith, uiTypeIs, and, schemaTypeIs, or } from "@jsonforms/core";

export default rankWith(8, (a, b, c) => {
  if (b.type === "integer") {
    return true;
  }
  return and(
    uiTypeIs("Control"),
    or(schemaTypeIs("number"), schemaTypeIs("integer"))
  )(a, b, c);
});

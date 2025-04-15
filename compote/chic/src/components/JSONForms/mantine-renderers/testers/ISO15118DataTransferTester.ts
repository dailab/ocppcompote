import {
  rankWith,
  uiTypeIs,
  and,
  schemaTypeIs,
  schemaMatches,
} from "@jsonforms/core";

export default rankWith(
  11,
  and(
    uiTypeIs("Control"),
    schemaTypeIs("string"),
    schemaMatches(
      (schema, rootSchema) =>
        schema.title !== undefined &&
        schema.title.toLowerCase().includes("data") &&
        rootSchema.title !== undefined &&
        rootSchema.title.toLocaleLowerCase().includes("datatransfer")
    )
  )
);

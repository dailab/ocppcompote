import { rankWith, uiTypeIs, and, schemaTypeIs } from "@jsonforms/core";

export default rankWith(10, and(uiTypeIs("Control"), schemaTypeIs("string")));

import { rankWith, uiTypeIs, and, isAnyOfControl } from "@jsonforms/core";

export default rankWith(10, and(uiTypeIs("Control"), isAnyOfControl));

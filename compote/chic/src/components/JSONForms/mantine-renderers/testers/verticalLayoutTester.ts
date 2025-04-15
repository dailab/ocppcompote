import { rankWith, uiTypeIs } from "@jsonforms/core";

export default rankWith(
  2, // higher than 1
  uiTypeIs("VerticalLayout")
);

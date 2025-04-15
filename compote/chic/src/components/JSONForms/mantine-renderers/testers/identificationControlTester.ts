import {
  rankWith,
  uiTypeIs,
  and,
  schemaTypeIs,
  schemaMatches,
} from "@jsonforms/core";

const necessaryProperties = [
  "PlugAndChargeIdentification",
  "QRCodeIdentification",
  "RFIDIdentification",
  "RFIDMifareFamilyIdentification",
  "RemoteIdentification",
];

export default rankWith(
  11,
  and(
    uiTypeIs("Control"),
    schemaTypeIs("object"),
    schemaMatches(
      (schema) =>
        necessaryProperties.filter((p) => {
          if (!schema.properties) {
            return true;
          }
          return !Object.keys(schema.properties).includes(p);
        }).length === 0
    )
  )
);

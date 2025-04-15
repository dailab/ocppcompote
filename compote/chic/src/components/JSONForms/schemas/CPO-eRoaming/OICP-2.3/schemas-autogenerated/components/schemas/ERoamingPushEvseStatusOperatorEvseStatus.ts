import componentsSchemasERoamingPushEvseStatusOperatorEvseStatusEvseStatusRecordInner from "./ERoamingPushEvseStatusOperatorEvseStatusEvseStatusRecordInner";

const schema = {
  properties: {
    OperatorID: {
      type: "string",
      title: "Operatorid",
      description:
        "A string that MUST be valid with respect to the following regular expression: ISO | DIN  ^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3})|(\\+?[0-9]{1,3}\\*[0-9]{3}))$ The expression validates the string as OperatorID including the preceding country code, which is part of EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118. In case the OperatorID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional.  In case the OperatorID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*A36â€, â€œDEA36â€  Example DIN: â€œ+49*536â€ ",
    },
    OperatorName: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Operatorname",
      description: "Free text for operator",
    },
    EvseStatusRecord: {
      items:
        componentsSchemasERoamingPushEvseStatusOperatorEvseStatusEvseStatusRecordInner,
      type: "array",
      title: "Evsestatusrecord",
      description: "EvseStatus list",
    },
  },
  type: "object",
  required: ["OperatorID", "EvseStatusRecord"],
  title: "ERoamingPushEvseStatusOperatorEvseStatus",
  description: "Indicates the Eves status",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingPushEvseStatusOperatorEvseStatus",
  ...schema,
} as const;
export { with$id };

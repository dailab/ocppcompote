const schema = {
  properties: {
    EvcoID: {
      type: "string",
      title: "Evcoid",
      description:
        "A string that `MUST` be valid with respect to the following regular expression: ISO | DIN.  ^(([A-Za-z]{2}\\-?[A-Za-z0-9]{3}\\-?C[A-Za-z0-9]{8}\\-?[\\d|A-Za-z])|([A-Za-z]{2}[\\*|\\-]?[A-Za-z0-9]{3}[\\*|\\-]?[A-Za-z0-9]{6}[\\*|\\-]?[\\d|X]))$ The expression validates the string as EvcoID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the EvcoID is provided corresponding to ISO, the instance part MUST be eight characters long and MUST be provided with a prepended â€œCâ€. The optional separating character MUST be â€œ-â€œ.  In case the EvcoID is provided corresponding to DIN, the instance part MUST be six characters long. The optional separating character can either be â€œ*â€ or â€œ-â€œ.  Examples ISO: â€œDE-8EO-CAet5e4XY-3â€, â€œDE8EOCAet5e43X1â€  Examples DIN: â€œDE*8EO*Aet5e4*3â€, â€œDE-8EO-Aet5e4-3â€, â€œDE8EOAet5e43â€ ",
    },
  },
  type: "object",
  required: ["EvcoID"],
  title: "PlugAndChargeIdentification",
  description: "Authentication required for Plug&Charge (EMAID/EVCOID) ",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/PlugAndChargeIdentification",
  ...schema,
} as const;
export { with$id };

const schema = {
  type: "string",
  pattern:
    "^(([A-Za-z]{2}\\-?[A-Za-z0-9]{3}\\-?C[A-Za-z0-9]{8}\\-?[\\d|A-Za-z])|([A-Za-z]{2}[\\*|\\-]?[A-Za-z0-9]{3}[\\*|\\-]?[A-Za-z0-9]{6}[\\*|\\-]?[\\d|X]))$",
  description:
    "A string that `MUST` be valid with respect to the following regular expression: ISO | DIN.\n\n^(([A-Za-z]{2}\\-?[A-Za-z0-9]{3}\\-?C[A-Za-z0-9]{8}\\-?[\\d|A-Za-z])|([A-Za-z]{2}[\\*|\\-]?[A-Za-z0-9]{3}[\\*|\\-]?[A-Za-z0-9]{6}[\\*|\\-]?[\\d|X]))$\nThe expression validates the string as EvcoID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.\n\nIn case the EvcoID is provided corresponding to ISO, the instance part MUST be eight characters long and MUST be provided with a prepended “C”. The optional separating character MUST be “-“.\n\nIn case the EvcoID is provided corresponding to DIN, the instance part MUST be six characters long. The optional separating character can either be “*” or “-“.\n\nExamples ISO: “DE-8EO-CAet5e4XY-3”, “DE8EOCAet5e43X1”\n\nExamples DIN: “DE*8EO*Aet5e4*3”, “DE-8EO-Aet5e4-3”, “DE8EOAet5e43”\n",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/EvcoID", ...schema } as const;
export { with$id };

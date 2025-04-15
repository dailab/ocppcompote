const schema = {
  type: "string",
  pattern: "([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?P[A-Za-z0-9\\*]{1,30})",
  description:
    "VSEs may be grouped by using a charging pool id according to emi³ standard definition. The Evse Pool ID MUST match the following structure (the notation corresponds to the augmented Backus-Naur Form (ABNF) as defined in RFC5234):\n<Evse Pool ID> = <Country Code> <S> <Spot Operator ID> <S> <ID Type> <Pool ID>\n\nwith:\n\n<Country Code> = 2 ALPHA ; two character country code according to ISO-3166-1 (Alpha-2-Code).\n\n<Spot Operator ID> = 3 (ALPHA / DIGIT); three alphanumeric characters.\n\n<ID Type> = “P”; one character “P” indicating that this ID represents a “Pool”.\n\n<Pool Instance> = (ALPHA / DIGIT) 1 * 30 ( 1*(ALPHA / DIGIT) [/ <S>] ); between 1 and 31sequence of alphanumeric characters, including additional optional separators. Starts with alphanumeric character referring to a specific Pool in EVSE Operator data system.\n\nALPHA = %x41-5A / %x61-7A; according to RFC 5234 (7-Bit ASCII).\n\nDIGIT = %x30-39; according to RFC 5234 (7-Bit ASCII).\n\n<S> = *1 ( “*” ); optional separator\n\nAn example for a valid Evse Pool ID is “IT*123*P456*AB789” with :\n\n“IT” indicating Italy,\n\n“123” representing a particular Spot Operator,\n\n“P” indicating the Pool, and\n\n“456*AB789” representing one of its POOL.\n\nNote\n\nIn contrast to the eMA ID, no check digit is specified for the Evse Pool ID in this document. Alpha characters SHALL be interpreted case insensitively. emi³ strongly recommends that implementations SHOULD - use the separator between Country Code and Spot Operator ID - use the separator between Spot Operator ID and ID type\nThis leads to the following regular expression:\n\n`([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?P[A-Za-z0-9\\*]{1,30})`\n\nThis regular expression is similar to that of the ISO EvseIDType but E is replaced with P to indicate a pool.\n",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ChargingPoolID",
  ...schema,
} as const;
export { with$id };

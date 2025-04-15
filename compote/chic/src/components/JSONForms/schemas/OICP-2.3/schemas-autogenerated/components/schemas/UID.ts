const schema = {
  type: "string",
  pattern: "^([0-9A-F]{8,8}|[0-9A-F]{14,14}|[0-9A-F]{20,20})$",
  description:
    "Authentication data details. The data structure differs depending on the authentication technology\n\nThe expression validates the string as a unique RFID with a length of 8, 14 or 20 characters.\n\nExamples: “7568290FFF765F”\n",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/UID", ...schema } as const;
export { with$id };

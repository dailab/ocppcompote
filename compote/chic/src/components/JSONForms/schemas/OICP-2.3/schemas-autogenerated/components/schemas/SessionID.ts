const schema = {
  type: "string",
  pattern: "^[A-Za-z0-9]{8}(-[A-Za-z0-9]{4}){3}-[A-Za-z0-9]{12}$",
  description:
    "The Hubject SessionID that identifies the process\n\nA string that `MUST` be valid with respect to the following regular expression:\n\n`^[A-Za-z0-9]{8}(-[A-Za-z0-9]{4}){3}-[A-Za-z0-9]{12}$`\n\nThe expression validates the string as a GUID.\n\nExample: “b2688855-7f00-0002-6d8e-48d883f6abb6”\n",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/SessionID", ...schema } as const;
export { with$id };

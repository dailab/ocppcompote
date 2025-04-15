const schema = {
  type: "object",
  required: ["lang", "value"],
  properties: {
    lang: {
      type: "string",
      pattern:
        "^[a-z]{2,3}(?:-[A-Z]{2,3}(?:-[a-zA-Z]{4})?)?(?:-x-[a-zA-Z0-9]{1,8})?$",
      description:
        "`^[a-z]{2,3}(?:-[A-Z]{2,3}(?:-[a-zA-Z]{4})?)?(?:-x-[a-zA-Z0-9]{1,8})?$`\n\nThe language in which the additional info text is provided\n\nThe expression validates the string as a language code as per ISO-639-1 or ISO-639-2/T\n\nThe LanguageCodeType is used in the AdditionalInfo field, which is part of the EvseDataRecordType.\n",
    },
    value: {
      type: "string",
      maximum: 150,
      description: "The Additional Info text",
    },
  },
} as const;
export default schema;

const with$id = { $id: "/components/schemas/InfoTextType", ...schema } as const;
export { with$id };

const schema = {
  properties: {
    lang: {
      type: "string",
      title: "Lang",
      description:
        "`^[a-z]{2,3}(?:-[A-Z]{2,3}(?:-[a-zA-Z]{4})?)?(?:-x-[a-zA-Z0-9]{1,8})?$`  The language in which the additional info text is provided  The expression validates the string as a language code as per ISO-639-1 or ISO-639-2/T  The LanguageCodeType is used in the AdditionalInfo field, which is part of the EvseDataRecordType. ",
    },
    value: {
      type: "string",
      title: "Value",
      description: "The Additional Info text",
    },
  },
  type: "object",
  required: ["lang", "value"],
  title: "InfoTextType",
  description: "InfoTextType",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/InfoTextType", ...schema } as const;
export { with$id };

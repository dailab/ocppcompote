import componentsSchemasOcppV201EnumsUpdateType from "./ocpp__v201__enums__UpdateType";

const schema = {
  properties: {
    list_version: {
      type: "integer",
      title: "List Version",
    },
    update_type: componentsSchemasOcppV201EnumsUpdateType,
    local_authorization_list: {
      items: {},
      type: "array",
      title: "Local Authorization List",
    },
    custom_data: {
      anyOf: [
        {
          type: "object",
        },
        {
          type: "null",
        },
      ],
      title: "Custom Data",
    },
  },
  type: "object",
  required: ["list_version", "update_type"],
  title: "OCPP20SendLocalListProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP20SendLocalListProcessorBody",
  ...schema,
} as const;
export { with$id };

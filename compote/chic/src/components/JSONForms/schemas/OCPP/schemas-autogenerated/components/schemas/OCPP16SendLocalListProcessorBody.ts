import componentsSchemasOcppV16EnumsUpdateType from "./ocpp__v16__enums__UpdateType";

const schema = {
  properties: {
    list_version: {
      type: "integer",
      title: "List Version",
    },
    update_type: componentsSchemasOcppV16EnumsUpdateType,
    local_authorization_list: {
      items: {},
      type: "array",
      title: "Local Authorization List",
    },
  },
  type: "object",
  required: ["list_version", "update_type"],
  title: "OCPP16SendLocalListProcessorBody",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/OCPP16SendLocalListProcessorBody",
  ...schema,
} as const;
export { with$id };

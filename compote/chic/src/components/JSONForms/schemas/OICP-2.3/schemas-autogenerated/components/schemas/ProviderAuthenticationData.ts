import componentsSchemasIdentification from "./Identification";
import componentsSchemasProviderID from "./ProviderID";

const schema = {
  type: "object",
  required: ["ProviderID", "AuthenticationDataRecord"],
  properties: {
    ProviderID: componentsSchemasProviderID,
    AuthenticationDataRecord: {
      type: "array",
      items: {
        type: "object",
        required: ["Identification"],
        properties: {
          Identification: componentsSchemasIdentification,
        },
      },
    },
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ProviderAuthenticationData",
  ...schema,
} as const;
export { with$id };

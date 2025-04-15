import { openapiToTsJsonSchema } from "openapi-ts-json-schema";

const { outputPath } = await openapiToTsJsonSchema({
  openApiSchema: "./openapi_cpo.json",
  definitionPathsToGenerateFrom: ["paths", "components.schemas"],
});

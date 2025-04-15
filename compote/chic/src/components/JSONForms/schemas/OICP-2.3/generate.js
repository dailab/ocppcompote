import { openapiToTsJsonSchema } from "openapi-ts-json-schema";

const { outputPath } = await openapiToTsJsonSchema({
  openApiSchema: "./openapi.yaml",
  definitionPathsToGenerateFrom: ["paths", "components.schemas"],
});

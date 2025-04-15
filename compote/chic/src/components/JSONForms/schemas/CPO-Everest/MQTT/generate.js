import { openapiToTsJsonSchema } from "openapi-ts-json-schema";

const { outputPath } = await openapiToTsJsonSchema({
  openApiSchema: "./openapi.json",
  definitionPathsToGenerateFrom: ["paths", "components.schemas"],
});

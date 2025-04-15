import { useFormOptions } from "@/components/MessageEditor";
import { JsonForms, withJsonFormsControlProps } from "@jsonforms/react";
import { JsonSchema } from "@jsonforms/core";
import { Input, Paper, Select } from "@mantine/core";
import { renderers } from "@/utils";
import { vanillaCells } from "@jsonforms/vanilla-renderers";

interface AnyOfProps {
  data: { [index: string]: any } | undefined;
  handleChange(path: string, value: any): void;
  schema: JsonSchema;
  path: string;
  label?: string;
  required?: boolean;
}

const AnyOfControl = (props: AnyOfProps) => {
  const { data, schema, label, required, handleChange, path } = props;
  const { withDescriptions } = useFormOptions();

  // Helpers
  const defaultValues: { [index: string]: any } = {
    number: 0,
    integer: 0,
    string: "",
    array: [],
    object: {},
    null: null,
    boolean: false,
  };
  let type: string | undefined = undefined;
  if (typeof data === "number") {
    if (
      Number.isInteger(data) &&
      schema.anyOf &&
      schema.anyOf.find((a) => a.type && a.type === "integer")
    ) {
      type = "integer";
    } else {
      type = "number";
    }
  } else if (typeof data === "string") {
    type = "string";
  } else if (data === null) {
    type = "null";
  } else if (typeof data === "object" && Array.isArray(data)) {
    type = "array";
  } else if (typeof data === "object") {
    type = "object";
  } else if (typeof data === "boolean") {
    type = "boolean";
  }
  console.log(label, data, type);

  const typeProperties = schema.anyOf
    ? schema.anyOf.find((a) => a.type === type) || {}
    : {};

  return (
    <>
      <Input.Wrapper
        label={label}
        description={withDescriptions ? schema.description || null : null}
        withAsterisk={required}
      >
        <Paper
          withBorder
          shadow="0"
          p="sm"
          mt={
            withDescriptions &&
            schema.description &&
            schema.description.length > 0
              ? 4
              : 0
          }
        >
          <Select
            label={`Value Type`}
            data={schema.anyOf ? schema.anyOf.map((a) => String(a.type)) : []}
            value={type}
            onChange={(newValue) => {
              handleChange(
                path,
                newValue ? defaultValues[newValue] : undefined
              );
            }}
            allowDeselect={true}
            required={required}
            placeholder="Select Value Type"
            variant="default"
            mb={type && type !== "null" ? "sm" : undefined}
          />
          {type && type !== "null" && (
            <JsonForms
              schema={{
                ...typeProperties,
                $schema: undefined,
              }}
              data={data}
              renderers={renderers}
              cells={vanillaCells}
              onChange={({ data: newData }) => {
                handleChange(path, newData);
              }}
              validationMode="NoValidation"
            />
          )}
        </Paper>
      </Input.Wrapper>
    </>
  );
};

export default withJsonFormsControlProps(AnyOfControl);

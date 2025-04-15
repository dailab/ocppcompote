import { useFormOptions } from "@/components/MessageEditor";
import { JsonSchema } from "@jsonforms/core";
import { JsonForms, withJsonFormsControlProps } from "@jsonforms/react";
import { Input, Paper } from "@mantine/core";
import { renderers } from "@/utils";
import { vanillaCells } from "@jsonforms/vanilla-renderers";

interface ObjectControlProps {
  data: { [index: string]: any } | undefined;
  handleChange(path: string, value: any): void;
  schema: JsonSchema;
  path: string;
  label?: string;
  required?: boolean;
}

const ObjectControl = (props: ObjectControlProps) => {
  const { label, schema, data, handleChange, path, required } = props;
  const { withDescriptions } = useFormOptions();

  return (
    <>
      <Input.Wrapper
        label={label}
        description={withDescriptions ? schema.description : undefined}
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
          <JsonForms
            schema={{
              ...schema,
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
        </Paper>
      </Input.Wrapper>
    </>
  );
};

export default withJsonFormsControlProps(ObjectControl);

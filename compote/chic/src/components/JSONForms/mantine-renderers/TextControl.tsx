import { useFormOptions } from "@/components/MessageEditor";
import { JsonSchema } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { TextInput } from "@mantine/core";

interface TextControlProps {
  data: string | undefined;
  handleChange(path: string, value: any): void;
  path: string;
  label: string;
  schema: JsonSchema;
  required?: boolean;
}

const TextControl = ({
  data,
  handleChange,
  path,
  label,
  required,
  schema,
}: TextControlProps) => {
  const { withDescriptions } = useFormOptions();

  return (
    <>
      <TextInput
        label={label}
        variant="filled"
        placeholder=""
        value={data}
        onChange={(event) => {
          handleChange(path, event.currentTarget.value);
        }}
        required={required}
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
};

export default withJsonFormsControlProps(TextControl);

import { useFormOptions } from "@/components/MessageEditor";
import { JsonSchema } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { Checkbox } from "@mantine/core";

interface CheckboxControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
  label: string;
  schema: JsonSchema;
  required?: boolean;
}

const CheckboxControl = ({
  data,
  handleChange,
  path,
  label,
  required,
  schema,
}: CheckboxControlProps) => {
  const { withDescriptions } = useFormOptions();

  return (
    <>
      <Checkbox
        label={label}
        py="sm"
        size="sm"
        labelPosition="left"
        checked={data}
        onChange={(event) => {
          handleChange(path, event.target.checked);
        }}
        required={required}
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
};

export default withJsonFormsControlProps(CheckboxControl);

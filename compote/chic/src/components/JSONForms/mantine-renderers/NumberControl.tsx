import { useFormOptions } from "@/components/MessageEditor";
import { JsonSchema } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { NumberInput } from "@mantine/core";

interface NumberControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
  label: string;
  schema: JsonSchema;
  required?: boolean;
}

const NumberControl = ({
  data,
  handleChange,
  path,
  label,
  required,
  schema,
}: NumberControlProps) => {
  const { withDescriptions } = useFormOptions();

  return (
    <>
      <NumberInput
        label={label}
        variant="filled"
        value={data}
        onChange={(newValue) => {
          if (newValue === "") {
            handleChange(path, undefined);
          }
          handleChange(path, Number(newValue));
        }}
        required={required}
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
};

export default withJsonFormsControlProps(NumberControl);

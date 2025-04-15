import { useFormOptions } from "@/components/MessageEditor";
import { JsonSchema } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { DatePicker } from "@mantine/dates";

interface TimestampControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
  label: string;
  schema: JsonSchema;
  required?: boolean;
}

const TimestampControl = ({
  data,
  handleChange,
  path,
  label,
  required,
  schema,
}: TimestampControlProps) => {
  const { withDescriptions } = useFormOptions();

  return (
    <>
      <DatePicker
        label={label}
        placeholder="Pick a date"
        value={new Date(data * 1000)}
        onChange={(newValue) => {
          if (newValue) {
            handleChange(path, newValue.getTime() / 1000);
          }
        }}
        required={required}
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
};

export default withJsonFormsControlProps(TimestampControl);

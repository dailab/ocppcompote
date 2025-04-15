import { useFormOptions } from "@/components/MessageEditor";
import { EnumCellProps, JsonSchema } from "@jsonforms/core";
import { TranslateProps, withJsonFormsControlProps } from "@jsonforms/react";
import { VanillaRendererProps } from "@jsonforms/vanilla-renderers";
import { Select, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

interface StringSelectControlProps {
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
  schema,
  required,
}: StringSelectControlProps) => {
  const { withDescriptions } = useFormOptions();

  return (
    <>
      <Select
        label={label}
        data={schema.enum}
        value={data}
        onChange={(newValue) => {
          handleChange(path, newValue);
        }}
        required={required}
        placeholder="Select an option"
        variant="filled"
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
};

export default withJsonFormsControlProps(TimestampControl);

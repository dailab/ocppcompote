import { useFormOptions } from "@/components/MessageEditor";
import { JsonSchema } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { TextInput } from "@mantine/core";

interface TextControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
  label: string;
  schema: JsonSchema;
  required?: boolean;
}

const ISO15118DataTransferControl = ({
  data,
  label,
  required,
  handleChange,
  path,
  schema,
}: TextControlProps) => {
  const { isSelectedIso15118, withDescriptions } = useFormOptions();

  return (
    <>
      <TextInput
        label={label}
        variant="filled"
        onChange={(event) => {
          if (isSelectedIso15118) {
            return;
          }
          handleChange(path, event.currentTarget.value);
        }}
        disabled={isSelectedIso15118}
        placeholder={
          isSelectedIso15118
            ? "This field will be generated automatically"
            : undefined
        }
        value={data}
        required={required}
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
};

export default withJsonFormsControlProps(ISO15118DataTransferControl);

import { useFormOptions } from "@/components/MessageEditor";
import { JsonSchema } from "@jsonforms/core";
import { JsonForms, withJsonFormsControlProps } from "@jsonforms/react";
import { Input, Paper, Select } from "@mantine/core";
import { renderers } from "@/utils";
import { vanillaCells } from "@jsonforms/vanilla-renderers";
import { useState } from "react";

interface IdentificationControlProps {
  data: { [index: string]: any } | undefined;
  handleChange(path: string, value: any): void;
  schema: JsonSchema;
  path: string;
  label?: string;
  required?: boolean;
}

const IdentificationControl = (props: IdentificationControlProps) => {
  const { label, schema, data, handleChange, path, required } = props;
  const { withDescriptions } = useFormOptions();

  // Helpers
  const defaultIdentificationType =
    data && Object.keys(data).length > 0 ? Object.keys(data)[0] : null;

  // State
  const [selectedIdentificationType, setSelectedIdentificationType] = useState<
    string | null
  >(defaultIdentificationType);

  return (
    <>
      <Select
        label={label}
        variant="filled"
        description={withDescriptions ? schema.description : undefined}
        placeholder="Pick an identification type"
        data={schema.properties ? Object.keys(schema.properties) : []}
        value={selectedIdentificationType}
        onChange={(newValue) => {
          const dataCopy = { ...data };
          if (selectedIdentificationType) {
            delete dataCopy[selectedIdentificationType];
            handleChange(path, dataCopy);
          }
          setSelectedIdentificationType(newValue);
        }}
        withAsterisk={required}
      />
      {selectedIdentificationType && schema.properties && (
        <Input.Wrapper
          label={selectedIdentificationType}
          description={
            withDescriptions
              ? schema.properties[selectedIdentificationType].description
              : undefined
          }
          withAsterisk={
            schema.required &&
            schema.required.includes(selectedIdentificationType)
          }
          mt="xs"
        >
          <Paper
            withBorder
            shadow="0"
            p="sm"
            mt={
              withDescriptions &&
              schema.properties[selectedIdentificationType].description &&
              schema.properties[selectedIdentificationType].description.length >
                0
                ? 4
                : 0
            }
          >
            <JsonForms
              schema={{
                ...schema.properties[selectedIdentificationType],
                $schema: undefined,
              }}
              data={data ? data[selectedIdentificationType] : {}}
              renderers={renderers}
              cells={vanillaCells}
              onChange={({ data: newData }) => {
                const dataCopy = { ...data };
                dataCopy[selectedIdentificationType] = newData;
                handleChange(path, dataCopy);
              }}
              validationMode="NoValidation"
            />
          </Paper>
        </Input.Wrapper>
      )}
    </>
  );
};

export default withJsonFormsControlProps(IdentificationControl);

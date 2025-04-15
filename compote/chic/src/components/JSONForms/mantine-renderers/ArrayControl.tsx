import { useFormOptions } from "@/components/MessageEditor";
import { JsonSchema } from "@jsonforms/core";
import { JsonForms, withJsonFormsControlProps } from "@jsonforms/react";
import {
  ActionIcon,
  Button,
  Flex,
  Input,
  Paper,
  Stack,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { getCustomStyles, renderers } from "@/utils";
import { vanillaCells } from "@jsonforms/vanilla-renderers";
import { useState } from "react";

interface ArrayControlProps {
  data: any[] | undefined;
  handleChange(path: string, value: any): void;
  path: string;
  label: string;
  schema: JsonSchema;
  required?: boolean;
}

const ArrayControl = (props: ArrayControlProps) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { iconSize } = getCustomStyles(theme, colorScheme);
  const { label, schema, data, handleChange, path, required } = props;
  const { withDescriptions } = useFormOptions();

  // State
  const [isHoveringDelete, setIsHoveringDelete] = useState<number | null>(null);

  // Helpers
  let schemaItems: JsonSchema | null = null;
  if (schema.items && !Array.isArray(schema.items)) {
    schemaItems = schema.items;
  }
  if (!schemaItems) {
    return <>No applicable renderer found for '{label}'.</>;
  }

  return (
    <>
      <Input.Wrapper
        label={label}
        description={withDescriptions ? schema.description : undefined}
        withAsterisk={required}
      >
        <Paper
          withBorder={data !== undefined && data.length > 0}
          shadow="0"
          p={data !== undefined && data.length > 0 ? "sm" : 0}
          mt={
            withDescriptions &&
            schema.description &&
            schema.description.length > 0
              ? 4
              : 0
          }
        >
          <Stack align="stretch" justify="flex-start" gap="sm">
            {data !== undefined ? (
              data.map((item, i) => {
                return (
                  <Flex
                    gap="xs"
                    justify="flex-start"
                    align="center"
                    direction="row"
                    wrap="nowrap"
                    key={i}
                  >
                    <Paper
                      p={schemaItems.type === "object" ? "sm" : 0}
                      withBorder={schemaItems.type === "object"}
                      style={{
                        borderColor:
                          isHoveringDelete === i
                            ? theme.colors.red[6]
                            : undefined,
                      }}
                      flex={1}
                    >
                      <JsonForms
                        schema={{
                          ...schemaItems,
                          $schema: undefined,
                        }}
                        data={item}
                        renderers={renderers}
                        cells={vanillaCells}
                        onChange={({ data: newData }) => {
                          const dataCopy = [...data];
                          dataCopy[i] = newData;
                          handleChange(path, dataCopy);
                        }}
                        validationMode="NoValidation"
                      />
                    </Paper>
                    <Tooltip label="Delete Item">
                      <ActionIcon
                        variant="default"
                        onClick={() => {
                          const dataCopy = [...data];
                          dataCopy.splice(i, 1);
                          handleChange(path, dataCopy);
                          setIsHoveringDelete(null);
                        }}
                        size="input-sm"
                        aria-label="Delete Item"
                        onMouseEnter={() => {
                          setIsHoveringDelete(i);
                        }}
                        onMouseLeave={() => {
                          setIsHoveringDelete(null);
                        }}
                      >
                        <IconTrash size={iconSize} />
                      </ActionIcon>
                    </Tooltip>
                  </Flex>
                );
              })
            ) : (
              <></>
            )}
            <Button
              variant="default"
              leftSection={<IconPlus size={iconSize} />}
              onClick={() => {
                let defaultValue: any = "";
                if (schemaItems.type === "string" && schemaItems.enum) {
                  if (schemaItems.enum.length > 0) {
                    defaultValue = schemaItems.enum[0];
                  }
                } else if (schemaItems.type === "string") {
                  defaultValue = "";
                } else if (schemaItems.type === "object") {
                  defaultValue = {};
                }
                handleChange(path, [...(data || []), defaultValue]);
              }}
            >
              Add Item
            </Button>
          </Stack>
        </Paper>
      </Input.Wrapper>
    </>
  );
};

export default withJsonFormsControlProps(ArrayControl);

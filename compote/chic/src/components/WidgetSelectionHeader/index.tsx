import { Chip, Divider, Flex, ScrollArea, Text } from "@mantine/core";
import {
  useWidgetRegistration,
  useWidgetSelection,
  useWidgets,
} from "../WidgetsProvider";
import { usePathname } from "next/navigation";
import { scrollAreaProps } from "@/utils";

interface WidgetSelectionHeaderProps {
  title: string;
  disabledWidgets?: string[];
}

export default function WidgetSelectionHeader({
  title,
  disabledWidgets,
}: WidgetSelectionHeaderProps) {
  const widgets = useWidgets();
  const { isPageRegistered } = useWidgetRegistration();
  const { updateWidgetSelectionBulk } = useWidgetSelection();
  const pathname = usePathname();

  return (
    <Flex justify="flex-start" align="center" gap="xs">
      <Text size="lg" fw={400}>
        {title}
      </Text>
      <Divider orientation="vertical" />
      {isPageRegistered(pathname) && (
        <ScrollArea flex={1} {...scrollAreaProps}>
          <Chip.Group
            multiple
            value={Object.keys(widgets[pathname]).filter(
              (widgetId) => widgets[pathname][widgetId].selected
            )}
            onChange={(value: string[]) => {
              updateWidgetSelectionBulk(pathname, value);
            }}
          >
            <Flex justify="flex-start" align="center" gap="xs" h="auto">
              {Object.keys(widgets[pathname]).map((widgetId) => (
                <Chip
                  value={widgetId}
                  size="sm"
                  key={widgetId}
                  disabled={
                    disabledWidgets && disabledWidgets.includes(widgetId)
                  }
                >
                  {widgets[pathname][widgetId].name}
                </Chip>
              ))}
            </Flex>
          </Chip.Group>
        </ScrollArea>
      )}
    </Flex>
  );
}

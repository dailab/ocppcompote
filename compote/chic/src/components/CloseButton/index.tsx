import { ActionIcon, Transition, useMantineTheme } from "@mantine/core";
import classes from "./CloseButton.module.css";
import { IconX } from "@tabler/icons-react";
import { transitionDurations } from "@/utils";
import { useActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import { usePathname } from "next/navigation";

interface CloseButtonProps {
  widgetId: string;
}

export default function CloseButton({ widgetId }: CloseButtonProps) {
  const theme = useMantineTheme();
  const activeWidget = useActiveWidget();
  const { updateWidgetSelection } = useWidgetSelection();
  const pathname = usePathname();

  return (
    <Transition
      mounted={activeWidget === widgetId}
      transition="pop-top-right"
      duration={transitionDurations.short}
      timingFunction="ease"
    >
      {(transitionStyle) => (
        <ActionIcon
          pos="absolute"
          size="xs"
          className={classes.closeButton}
          radius="xl"
          color="red"
          onClick={() => {
            updateWidgetSelection(pathname, widgetId, false);
          }}
          style={transitionStyle}
        >
          <IconX size={theme.fontSizes.sm} />
        </ActionIcon>
      )}
    </Transition>
  );
}

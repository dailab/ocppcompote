import { Log, Log2, WidgetComponentProps } from "@/types";
import {
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  SemiCircleProgress,
  SimpleGrid,
  Text,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import { getCustomStyles, logLevels, widgetProps } from "@/utils";
import CloseButton from "../CloseButton";
import { useEffect, useMemo, useRef, useState } from "react";
import classes from "./LogsLevelOverview.module.css";
import { usePathname } from "next/navigation";
import { IconNumbers } from "@tabler/icons-react";

export const logsLevelOverviewWidgetId = "logs-level-overview";

interface LogsLevelOverviewProps extends WidgetComponentProps {
  logs: (Log | Log2)[] | undefined;
}

export default function LogsLevelOverview({
  logs,
  mt,
  withCloseButton,
}: LogsLevelOverviewProps) {
  const { isWidgetSelected } = useWidgetSelection();
  const pathname = usePathname();
  const updateActiveWidget = useUpdateActiveWidget();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, iconSize } = getCustomStyles(
    theme,
    colorScheme
  );

  // State
  const [colWidth, setColWidth] = useState<number>(0);
  const [showTotal, setShowTotal] = useState<boolean>(false);

  // Helpers
  const levelCompositionData = useMemo(() => {
    const initial = logLevels.map((l) => ({
      ...l,
      percentage: 0,
      total: 0,
    }));
    if (!logs) {
      return initial;
    }
    return initial.map((level) => {
      const total = logs.filter((l) => l.levelname === level.name).length;
      const percentage = (total * 100) / logs.length;
      return { ...level, percentage, total };
    });
  }, [logs]);

  const colRef = useRef(null);

  // Effects
  useEffect(() => {
    if (!colRef.current) {
      return;
    }
    setColWidth(colRef.current.offsetWidth);
  }, [colRef.current, colRef.current?.offsetWidth]);

  return (
    <Transition
      mounted={isWidgetSelected(pathname, logsLevelOverviewWidgetId)}
      transition="fade-left"
      duration={350}
      timingFunction="ease"
    >
      {(transitionStyle) => (
        <Paper
          p="md"
          shadow="md"
          bg={transparentBackground}
          mt={mt || 0}
          pos="relative"
          h="fit-content"
          style={transitionStyle}
          {...widgetProps(updateActiveWidget, logsLevelOverviewWidgetId)}
        >
          {withCloseButton !== false && (
            <CloseButton widgetId={logsLevelOverviewWidgetId} />
          )}
          <Group justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <Title order={1} size="h3" lineClamp={1}>
                Level Composition
              </Title>
              {/* Badges */}
            </Group>
            <Group gap="xs" wrap="nowrap">
              <Button
                onClick={() => {
                  setShowTotal(!showTotal);
                }}
                variant="default"
                leftSection={<IconNumbers size={iconSize} />}
              >
                {showTotal ? "Show Percentage" : "Show Total"}
              </Button>
              {/* Buttons */}
            </Group>
          </Group>
          <Divider my="md" />
          {!logs ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <>
              <SimpleGrid cols={3}>
                {levelCompositionData.map((level) => (
                  <Paper withBorder shadow="none" p="xs">
                    <Text ta="end" size="sm" ref={colRef}>
                      {level.name}
                    </Text>
                    <SemiCircleProgress
                      fillDirection="left-to-right"
                      orientation="up"
                      filledSegmentColor={level.colors[0]}
                      value={level.percentage}
                      size={colWidth}
                      label={
                        <Text
                          ff="text"
                          fw={900}
                          size={`${Math.round(
                            colWidth /
                              (showTotal
                                ? Math.max(6, String(level.total).length)
                                : 6)
                          )}px`}
                          variant="gradient"
                          gradient={{
                            from: level.colors[0],
                            to: level.colors[1],
                            deg: 90,
                          }}
                          className={classes.semiCircleLabel}
                          span
                        >
                          {showTotal
                            ? level.total
                            : level.percentage >= 1
                            ? `${Math.round(level.percentage)}%`
                            : level.percentage === 0
                            ? "0%"
                            : "< 1%"}
                        </Text>
                      }
                      labelPosition="bottom"
                    />
                  </Paper>
                ))}
              </SimpleGrid>
            </>
          )}
        </Paper>
      )}
    </Transition>
  );
}

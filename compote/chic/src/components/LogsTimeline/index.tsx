import { Log, Log2, WidgetComponentProps } from "@/types";
import {
  getCustomStyles,
  logLevels,
  transitionDurations,
  widgetProps,
} from "@/utils";
import {
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  Select,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import CloseButton from "../CloseButton";
import { usePathname } from "next/navigation";
import { LineChart } from "@mantine/charts";
import { useMemo, useState } from "react";

export const logsTimelineWidgetId = "logs-timeline";

interface LogsTimelineProps extends WidgetComponentProps {
  logs: Array<Log | Log2> | undefined;
}

export default function LogsTimeline({
  mt,
  withCloseButton,
  logs,
}: LogsTimelineProps) {
  const { isWidgetSelected } = useWidgetSelection();
  const pathname = usePathname();
  const updateActiveWidget = useUpdateActiveWidget();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground } = getCustomStyles(theme, colorScheme);

  // State
  const [timeFrame, setTimeFrame] = useState<string>("Today");

  // Helpers 2
  const now = new Date();
  const lastIntervalStartTime = (time: number, intervalLength: number) =>
    time - (time % intervalLength);
  const formatDate1 = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatDate2 = (date: Date) =>
    date.toLocaleDateString([], {
      month: "2-digit",
      day: "2-digit",
    });
  const formatDate3 = (date: Date) => {
    let d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    let dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return `KW ${Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    )}`;
  };
  const cutOffs = [
    {
      timeFrame: "Today",
      startTime: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).getTime(),
      intervalLength: 900000,
      formatDate: formatDate1,
    },
    {
      timeFrame: "Last Hour",
      startTime: lastIntervalStartTime(now.getTime() - 3600000, 900000),
      intervalLength: 900000,
      formatDate: formatDate1,
    },
    {
      timeFrame: "Last 12 Hours",
      startTime: lastIntervalStartTime(now.getTime() - 43200000, 900000),
      intervalLength: 900000,
      formatDate: formatDate1,
    },
    {
      timeFrame: "Last 24 Hours",
      startTime: lastIntervalStartTime(now.getTime() - 86400000, 3600000),
      intervalLength: 3600000,
      formatDate: formatDate1,
    },
    {
      timeFrame: "This Week",
      startTime: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - ((now.getDay() + 6) % 7)
      ).getTime(),
      intervalLength: 86400000,
      formatDate: formatDate2,
    },
    {
      timeFrame: "This Month",
      startTime: new Date(now.getFullYear(), now.getMonth(), 1).getTime(),
      intervalLength: 86400000,
      formatDate: formatDate2,
    },
    {
      timeFrame: "This Year",
      startTime: lastIntervalStartTime(
        new Date(now.getFullYear(), 0, 1).getTime(),
        604800000
      ),
      intervalLength: 604800000,
      formatDate: formatDate3,
    },
  ];
  const selectedCutOff =
    cutOffs.find((c) => c.timeFrame === timeFrame) || cutOffs[0];
  const processedLogs: Record<string, any>[] = useMemo(() => {
    if (!logs) {
      return [];
    }
    const values = [];
    for (
      let time = selectedCutOff.startTime;
      time <=
      lastIntervalStartTime(now.getTime(), selectedCutOff.intervalLength);
      time += selectedCutOff.intervalLength
    ) {
      const logsInTimeFrame = logs.filter(
        (l) =>
          new Date(l.asctime.replace(",", ".")).getTime() >= time &&
          new Date(l.asctime.replace(",", ".")).getTime() <
            time + selectedCutOff.intervalLength
      );
      values.push({
        ...logLevels.reduce((t: { [index: string]: any }, level) => {
          if (level.name === "Others") {
            t[level.name] = logsInTimeFrame.filter(
              (l) =>
                !logLevels.map((level2) => level2.name).includes(l.levelname)
            ).length;
            return t;
          }
          t[level.name] = logsInTimeFrame.filter(
            (l) => l.levelname === level.name
          ).length;
          return t;
        }, {}),
        time: selectedCutOff.formatDate(new Date(time)),
      });
    }
    return values;
  }, [logs, timeFrame]);

  return (
    <Transition
      mounted={isWidgetSelected(pathname, logsTimelineWidgetId)}
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
          style={transitionStyle}
          {...widgetProps(updateActiveWidget, logsTimelineWidgetId)}
        >
          {withCloseButton !== false && (
            <CloseButton widgetId={logsTimelineWidgetId} />
          )}
          <Group justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <Title order={1} size="h3">
                Timeline
              </Title>
              {/* Badges */}
            </Group>
            <Group gap="xs" wrap="nowrap">
              <Select
                value={timeFrame}
                data={cutOffs.map((c) => c.timeFrame)}
                onChange={(newValue) => {
                  if (!newValue) {
                    return;
                  }
                  setTimeFrame(newValue);
                }}
              />
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
              <LineChart
                h={150}
                data={processedLogs}
                dataKey="time"
                series={logLevels
                  .filter(
                    (level) =>
                      processedLogs.reduce((t, l) => t + l[level.name], 0) > 0 // Hide lines with only zeros
                  )
                  .map((l) => ({
                    name: l.name,
                    color: l.colors[0],
                  }))}
                withDots={false}
                tooltipAnimationDuration={transitionDurations.short}
                withXAxis={false}
              />
            </>
          )}
        </Paper>
      )}
    </Transition>
  );
}

import { Log, Log2, LogData, WidgetComponentProps } from "@/types";
import { getCustomStyles, scrollAreaProps, widgetProps } from "@/utils";
import {
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import CloseButton from "../CloseButton";
import { Dispatch, SetStateAction, useMemo } from "react";
import {
  IconRefresh,
  IconSnowflake,
  IconSnowflakeOff,
} from "@tabler/icons-react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import FrozenBadge from "../FrozenBadge";
import { usePathname } from "next/navigation";

export const logsOverviewTableWidgetId = "logs-overview-table";

interface LogsOverviewTableProps extends WidgetComponentProps {
  logs: Array<Log | Log2> | undefined;
  frozen: boolean;
  setFrozen: Dispatch<SetStateAction<boolean>>;
  refreshLogs?: () => void;
  isLoadingLogs?: boolean;
}

export default function LogsOverviewTable({
  mt,
  withCloseButton,
  logs,
  frozen,
  setFrozen,
  refreshLogs,
  isLoadingLogs,
}: LogsOverviewTableProps) {
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

  // Helpers
  // useMemo probably unnecessary here
  const convertedLogs: LogData[] = useMemo(() => {
    if (!logs) {
      return [];
    }
    return logs.map((log) => {
      const dateObject = new Date(log.asctime.replace(",", "."));
      return {
        date: dateObject.toLocaleDateString(),
        time: dateObject.toLocaleTimeString(),
        level: log.levelname,
        name: log.name,
        task: log.taskName,
        type: log.message_type,
        function: log.function,
        message: log.message,
        arguments: JSON.stringify(log.arguments),
      };
    });
  }, [logs]);
  const allLevels: string[] = useMemo(() => {
    if (!logs) {
      return [];
    }
    return logs.reduce(
      (t: string[], l) => (t.includes(l.levelname) ? t : [...t, l.levelname]),
      []
    );
  }, [logs]);
  const columns = useMemo<MRT_ColumnDef<LogData>[]>(
    () => [
      {
        header: "Date",
        accessorKey: "date",
        enableResizing: false,
        filterVariant: "date",
        filterFn: (row, id, filterValue) =>
          row.getValue(id) === filterValue.toLocaleDateString(),
        size: 130,
      },
      {
        header: "Time",
        accessorKey: "time",
        enableResizing: false,
        enableGrouping: false,
        size: 100,
      },
      {
        header: "Level",
        accessorKey: "level",
        filterVariant: "select",
        mantineFilterMultiSelectProps: {
          data: allLevels,
        },
        size: 150,
      },
      { header: "Name", accessorKey: "name", size: 200 },
      { header: "Task", accessorKey: "task", size: 120 },
      { header: "Type", accessorKey: "type", size: 180 },
      { header: "Function", accessorKey: "function", size: 180 },
      {
        header: "Message",
        accessorKey: "message",
        enableGrouping: false,
        size: 800,
        Cell: ({ cell }) => (
          <ScrollArea w={cell.column.getSize()} {...scrollAreaProps}>
            {cell.getValue<string>()}
          </ScrollArea>
        ),
      },
      {
        header: "Arguments",
        accessorKey: "arguments",
        enableGrouping: false,
        size: 400,
        Cell: ({ cell }) => (
          <ScrollArea w={cell.column.getSize()} {...scrollAreaProps}>
            {cell.getValue<string>()}
          </ScrollArea>
        ),
      },
    ],
    [allLevels]
  );
  const table = useMantineReactTable({
    columns,
    data: convertedLogs,
    enableColumnResizing: true,
    enableGrouping: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableRowPinning: true,
    enableColumnPinning: true,
    paginationDisplayMode: "pages",
    initialState: {
      density: "xs",
      expanded: true,
      grouping: [],
      pagination: { pageIndex: 0, pageSize: 20 },
      sorting: [
        { id: "date", desc: true },
        { id: "time", desc: true },
      ],
    },
    mantineToolbarAlertBannerBadgeProps: { color: "blue", variant: "outline" },
    mantineTableContainerProps: {
      style: { maxHeight: "fit-content" },
    },
    mantinePaperProps: {
      shadow: "none",
    },
    mantineTableBodyProps: {
      style: {
        border: "none",
      },
    },
  });

  return (
    <Transition
      mounted={isWidgetSelected(pathname, logsOverviewTableWidgetId)}
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
          {...widgetProps(updateActiveWidget, logsOverviewTableWidgetId)}
        >
          {withCloseButton !== false && (
            <CloseButton widgetId={logsOverviewTableWidgetId} />
          )}
          <Group justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <Title order={1} size="h3" lineClamp={1}>
                Status Logs
              </Title>
              <FrozenBadge mounted={frozen} />
            </Group>
            <Group gap="xs">
              {refreshLogs !== undefined && (
                <Button
                  onClick={() => {
                    refreshLogs();
                  }}
                  variant="default"
                  disabled={!frozen}
                  leftSection={<IconRefresh size={iconSize} />}
                  loading={isLoadingLogs && frozen}
                >
                  Refresh
                </Button>
              )}
              <Button
                onClick={() => {
                  setFrozen(!frozen);
                }}
                variant="default"
                leftSection={
                  frozen ? (
                    <IconSnowflakeOff size={iconSize} />
                  ) : (
                    <IconSnowflake size={iconSize} />
                  )
                }
              >
                {frozen ? "Unfreeze" : "Freeze"}
              </Button>
            </Group>
          </Group>
          <Divider my="md" />
          {!logs ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <MantineReactTable table={table} />
          )}
        </Paper>
      )}
    </Transition>
  );
}

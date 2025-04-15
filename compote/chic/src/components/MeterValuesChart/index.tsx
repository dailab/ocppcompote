import {
  CSMSContext,
  FillerMeterValue,
  isProcessedMeterValue,
  MeterValue,
  ProcessedMeterValue,
  WidgetComponentProps,
} from "@/types";
import {
  extractMeterValuesFromConnector,
  getCustomStyles,
  getMantineColorPalette,
  transitionDurations,
  widgetProps,
} from "@/utils";
import {
  ActionIcon,
  alpha,
  Button,
  Center,
  Collapse,
  Divider,
  Flex,
  Group,
  JsonInput,
  Loader,
  MultiSelect,
  Paper,
  Select,
  Switch,
  Table,
  Text,
  Title,
  Tooltip,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { CompositeChart, CompositeChartSeries } from "@mantine/charts";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import CloseButton from "../CloseButton";
import CSIndicator from "../CSIndicator";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  IconBraces,
  IconCircleFilled,
  IconGraph,
  IconSettings,
  IconSettingsOff,
} from "@tabler/icons-react";
import InputWrapperScrollArea from "../InputWrapperScrollArea";

export const meterValuesChartWidgetId = "meter-values-chart";

interface MeterValuesChartProps extends WidgetComponentProps {
  chargingStationId: string | null; // if null then is loading
  context: CSMSContext | undefined; // if undefined then is loading
}

export type MeterValuesVisualizationMode = "chart" | "json";

export default function MeterValuesChart({
  withCloseButton,
  mt,
  context,
  chargingStationId,
}: MeterValuesChartProps) {
  const pathname = usePathname();
  const { isWidgetSelected } = useWidgetSelection();
  const updateActiveWidget = useUpdateActiveWidget();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, iconSize } = getCustomStyles(
    theme,
    colorScheme
  );

  // Helpers 1
  const connectors = context && context.connectors ? context.connectors : {};
  const newMeterValuesDependency = JSON.stringify(connectors);
  const meterValues: MeterValue[] = useMemo(() => {
    if (!context || !context.connectors) {
      return [];
    }
    return Object.keys(context.connectors).reduce(
      (t: MeterValue[], connectorId) => {
        const connector = context.connectors[connectorId];
        return [
          ...t,
          ...extractMeterValuesFromConnector(connector, connectorId),
        ];
      },
      []
    );
  }, [newMeterValuesDependency]);
  const measurands = Array.from(
    new Set(meterValues.map((v) => v.measurand))
  ).filter((m) => m);
  const newLinesDependency = Object.keys(connectors).join(",");
  const colorPaletteLines = useMemo(() => {
    return getMantineColorPalette(
      theme,
      Object.keys(connectors),
      [6],
      ["dark", "gray"]
    );
  }, [newLinesDependency]);
  const series: CompositeChartSeries[] = Object.keys(connectors).map((cId) => ({
    name: `Connector ${cId}`,
    color: colorPaletteLines[cId],
    type: "line",
  }));

  // State
  const [measurand, setMeasurand] = useState<string | undefined>(
    measurands.includes("Energy.Active.Import.Register")
      ? "Energy.Active.Import.Register"
      : undefined
  );
  const [location, setLocation] = useState<string | null>(
    meterValues.find(
      (v) => v.location === "Outlet" && v.measurand === measurand
    )
      ? "Outlet"
      : null
  );
  const [phase, setPhase] = useState<string | null>(
    meterValues.find((v) => v.phase === "L1" && v.measurand === measurand)
      ? "L1"
      : null
  );
  const [transaction, setTransaction] = useState<string | null>(null);
  const [includeFillerValues, setIncludeFillerValues] = useState<boolean>(true);
  const [showAdvancedOptions, setShowAdvancedOptions] =
    useState<boolean>(false);
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const [visualizationMode, setVisualizationMode] =
    useState<MeterValuesVisualizationMode>("chart");
  const [showJsonProcessed, setShowJsonProcessed] = useState<boolean>(true);
  const [showTransactionInTooltip, setShowTransactionInTooltip] =
    useState<boolean>(false);

  // Helpers 2
  const locations = Array.from(new Set(meterValues.map((v) => v.location)))
    .filter((l) => l)
    .map((l) => ({
      label: l,
      value: l,
      disabled: !meterValues.find(
        (v) => v.location === l && v.measurand === measurand
      ),
    }));
  const phases = Array.from(new Set(meterValues.map((v) => v.phase)))
    .filter((p) => p)
    .map((p) => ({
      label: p,
      value: p,
      disabled: !meterValues.find(
        (v) => v.phase === p && v.measurand === measurand
      ),
    }))
    .concat([{ label: "No phase", value: "nophase", disabled: false }]);
  const transactions: string[] = Array.from(
    new Set(meterValues.map((v) => v.transactionId))
  ).filter((x) => typeof x === "string");
  const optionsChangeDependency = [
    transaction,
    measurand,
    phase,
    location,
    includeFillerValues,
    visualizationMode,
    ...hiddenSeries,
  ].join();
  const processedMeterValues: (ProcessedMeterValue | FillerMeterValue)[] =
    useMemo(() => {
      const temp: (ProcessedMeterValue | FillerMeterValue)[] = meterValues
        .filter(
          (v) =>
            v.measurand === measurand &&
            (v.transactionId === transaction || transaction === null) &&
            (v.phase === (phase === "nophase" ? undefined : phase) ||
              phase === null) &&
            (v.location === location || location === null)
        )
        .filter(
          // remove duplicate meter values
          (v, i, self) =>
            self.findIndex(
              (v2) =>
                v2.time.getTime() === v.time.getTime() &&
                v2.value === v.value &&
                v2.unit_of_measure.unit === v.unit_of_measure.unit &&
                v2.phase === v.phase
            ) === i
        )
        .reduce((t: ProcessedMeterValue[], v) => {
          if (hiddenSeries.includes(v.connectorName)) {
            return t;
          }
          const temp = [...t];
          const referenceTime = v.time;
          const timeString = referenceTime.toLocaleTimeString();
          const unit = v.unit_of_measure.unit;
          const clusteringTolerance = 1000; // in ms
          const index: number = t.findIndex(
            (e) =>
              Math.abs(referenceTime.getTime() - e.referenceTime.getTime()) <=
                clusteringTolerance &&
              unit === e.unit &&
              v.phase === e.phase &&
              !Object.keys(e).includes(v.connectorName)
          );
          if (index !== -1) {
            temp[index] = {
              ...temp[index],
              meterValues: [...temp[index].meterValues, v],
              [v.connectorName]: v.value,
            };
            return temp;
          }
          return [
            ...temp,
            {
              meterValues: [v],
              referenceTime,
              timeString,
              phase: v.phase,
              unit,
              [v.connectorName]: v.value,
            },
          ];
        }, []);
      if (includeFillerValues && visualizationMode === "chart") {
        const startTime = Math.min(
          ...temp.map((m) => m.referenceTime.getTime())
        );
        const endTime = Math.max(...temp.map((m) => m.referenceTime.getTime()));
        const fillerInterval = (endTime - startTime) / 50;
        for (
          let fillerTime = startTime + fillerInterval;
          fillerTime < endTime - fillerInterval;
          fillerTime += fillerInterval
        ) {
          temp.push({
            referenceTime: new Date(fillerTime),
            timeString: new Date(fillerTime).toLocaleTimeString(),
          });
        }
      }
      return temp.sort(
        (a, b) => a.referenceTime.getTime() - b.referenceTime.getTime()
      );
    }, [newMeterValuesDependency, optionsChangeDependency]);

  return (
    <Transition
      mounted={isWidgetSelected(pathname, meterValuesChartWidgetId)}
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
          style={transitionStyle}
          pos="relative"
          {...widgetProps(updateActiveWidget, meterValuesChartWidgetId)}
        >
          <>
            {withCloseButton !== false && (
              <CloseButton widgetId={meterValuesChartWidgetId} />
            )}
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap">
                <Title order={1} size="h3">
                  Meter Values
                  {chargingStationId !== null && context !== undefined
                    ? " of "
                    : ""}
                  <CSIndicator
                    chargingStationId={chargingStationId}
                    context={context}
                  />
                </Title>
                {/* Badges */}
              </Group>
              <Group gap="xs" wrap="nowrap">
                {/* Buttons */}
                <Button
                  variant="default"
                  onClick={() => {
                    setVisualizationMode(
                      visualizationMode === "chart" ? "json" : "chart"
                    );
                  }}
                  leftSection={
                    visualizationMode === "chart" ? (
                      <IconBraces size={iconSize} />
                    ) : (
                      <IconGraph size={iconSize} />
                    )
                  }
                  visibleFrom="xl"
                >
                  Show
                  {visualizationMode === "chart" ? " JSON" : " Chart"}
                </Button>
                <Tooltip
                  label={`${showAdvancedOptions ? "Hide" : "Show"} Advanced Options`}
                >
                  <ActionIcon
                    variant="default"
                    onClick={() => {
                      setVisualizationMode(
                        visualizationMode === "chart" ? "json" : "chart"
                      );
                    }}
                    size="input-sm"
                    aria-label={`Show ${visualizationMode === "chart" ? " JSON" : " Chart"}`}
                    hiddenFrom="xl"
                  >
                    {visualizationMode === "chart" ? (
                      <IconBraces size={iconSize} />
                    ) : (
                      <IconGraph size={iconSize} />
                    )}
                  </ActionIcon>
                </Tooltip>
                <Tooltip
                  label={`${showAdvancedOptions ? "Hide" : "Show"} Advanced Options`}
                >
                  <ActionIcon
                    variant="default"
                    onClick={() => {
                      setShowAdvancedOptions(!showAdvancedOptions);
                    }}
                    size="input-sm"
                    aria-label={`${showAdvancedOptions ? "Hide" : "Show"} Advanced Options`}
                    hiddenFrom="xl"
                  >
                    {showAdvancedOptions ? (
                      <IconSettingsOff size={iconSize} />
                    ) : (
                      <IconSettings size={iconSize} />
                    )}
                  </ActionIcon>
                </Tooltip>
                <Button
                  variant="default"
                  onClick={() => {
                    setShowAdvancedOptions(!showAdvancedOptions);
                  }}
                  leftSection={
                    showAdvancedOptions ? (
                      <IconSettingsOff size={iconSize} />
                    ) : (
                      <IconSettings size={iconSize} />
                    )
                  }
                  visibleFrom="xl"
                >
                  {showAdvancedOptions ? "Hide " : "Show "}
                  Advanced Options
                </Button>
              </Group>
            </Group>
            <Divider my="md" />
            {chargingStationId === null || !context ? (
              <Center>
                <Loader />
              </Center>
            ) : (
              <>
                <Flex
                  gap="md"
                  justify="flex-start"
                  align="center"
                  direction="row"
                  wrap="wrap"
                >
                  <Select
                    label="Select Measurand"
                    placeholder="Pick a Measurand"
                    value={measurand}
                    allowDeselect={false}
                    onChange={(newMeasurand) => {
                      if (newMeasurand === null) {
                        return;
                      }
                      setMeasurand(newMeasurand);
                      setLocation(null);
                      setPhase(null);
                    }}
                    data={measurands}
                    searchable
                    miw={250}
                    flex={2}
                    required
                  />
                  <Select
                    label="Filter by Location"
                    placeholder="Any Location"
                    allowDeselect
                    value={location}
                    onChange={(newLocation) => {
                      setLocation(newLocation);
                    }}
                    data={locations}
                    searchable
                    miw={200}
                    flex={1}
                  />
                  <Select
                    label="Filter by Phase"
                    placeholder="Any Phase"
                    allowDeselect
                    value={phase}
                    onChange={(newPhase) => {
                      setPhase(newPhase);
                    }}
                    data={phases}
                    searchable
                    miw={200}
                    flex={1}
                  />
                  <Select
                    label="Filter by Transaction"
                    placeholder="Any Transaction"
                    allowDeselect
                    value={transaction}
                    data={transactions}
                    onChange={(newTransaction) => {
                      setTransaction(newTransaction);
                    }}
                    searchable
                    miw={330}
                    flex={1}
                  />
                  {showAdvancedOptions && (
                    <>
                      <MultiSelect
                        flex={1}
                        miw={350}
                        label="Hidden Series"
                        placeholder="Select series to hide"
                        data={series.map((s) => s.name)}
                        value={hiddenSeries}
                        onChange={setHiddenSeries}
                        clearable
                        searchable
                      />
                      <Switch
                        defaultChecked
                        disabled={visualizationMode !== "chart"}
                        label="Include Filler Values"
                        checked={includeFillerValues}
                        onChange={(event) => {
                          setIncludeFillerValues(event.currentTarget.checked);
                        }}
                      />
                      <Switch
                        disabled={visualizationMode !== "chart"}
                        label="Transaction in Tooltip "
                        checked={showTransactionInTooltip}
                        onChange={(event) => {
                          setShowTransactionInTooltip(
                            event.currentTarget.checked
                          );
                        }}
                      />
                      <Switch
                        disabled={visualizationMode !== "json"}
                        label="Show Processed Values"
                        checked={showJsonProcessed}
                        onChange={(event) => {
                          setShowJsonProcessed(event.currentTarget.checked);
                        }}
                      />
                    </>
                  )}
                </Flex>
                <Collapse
                  in={measurand !== undefined}
                  transitionDuration={transitionDurations.medium}
                  transitionTimingFunction="linear"
                >
                  {visualizationMode === "chart" && (
                    <CompositeChart
                      mt="md"
                      h={300}
                      data={processedMeterValues}
                      tooltipAnimationDuration={200}
                      tooltipProps={{
                        content: ({ label, payload }) => (
                          <Paper
                            px="md"
                            py="sm"
                            withBorder
                            shadow="md"
                            radius="md"
                            bg={transparentBackground}
                          >
                            <Group justify="space-between" align="flex-start">
                              <Text fw={500}>{label}</Text>
                              {payload !== undefined &&
                                payload.length > 0 &&
                                payload[0].payload.phase !== undefined && (
                                  <Text fz="sm" c="dimmed">
                                    Phase: {payload[0].payload.phase}
                                  </Text>
                                )}
                            </Group>
                            <Divider my="xs" />
                            <Table withRowBorders={false} mt="xs">
                              {(payload || []).map((item: any) => {
                                const meterValue: MeterValue | undefined =
                                  item.payload.meterValues.find(
                                    (m: MeterValue) =>
                                      m.connectorName === item.name
                                  );
                                return (
                                  <>
                                    <Table.Tr key={item.name}>
                                      <Table.Td pl={0} pr="xs">
                                        <Flex
                                          gap={7}
                                          justify="flex-start"
                                          align="center"
                                          direction="row"
                                          wrap="nowrap"
                                        >
                                          <IconCircleFilled
                                            size={iconSize}
                                            color={alpha(item.color, 1)}
                                          />
                                          <Text fz="sm">
                                            {item.name}
                                            <Text span c="dimmed" inherit>
                                              {meterValue
                                                ? ` (${meterValue.location})`
                                                : ""}
                                            </Text>
                                            :
                                          </Text>
                                        </Flex>
                                      </Table.Td>
                                      <Table.Td px={0}>
                                        <Text fz="sm">{`${item.value}${item.payload.unit}`}</Text>
                                      </Table.Td>
                                    </Table.Tr>
                                    {showTransactionInTooltip &&
                                      meterValue &&
                                      meterValue.transactionId && (
                                        <Text fz="xs" c="dimmed">
                                          Extracted from Transaction{" "}
                                          {meterValue.transactionId}
                                        </Text>
                                      )}
                                  </>
                                );
                              })}
                            </Table>
                          </Paper>
                        ),
                      }}
                      dataKey="timeString"
                      withXAxis={false}
                      withLegend
                      unit={
                        processedMeterValues.length > 0
                          ? (
                              processedMeterValues.find((v) =>
                                isProcessedMeterValue(v)
                              ) || { unit: "" }
                            ).unit
                          : undefined
                      }
                      series={series.filter(
                        (s) => !hiddenSeries.includes(s.name)
                      )}
                    />
                  )}
                  {visualizationMode === "json" && (
                    <InputWrapperScrollArea
                      label="Processed Meter Values"
                      mt="md"
                      mah={575}
                    >
                      <JsonInput
                        onChange={() => {}}
                        value={JSON.stringify(
                          showJsonProcessed
                            ? processedMeterValues
                            : meterValues,
                          null,
                          2
                        )}
                        minRows={4}
                        autosize
                        formatOnBlur
                        variant="unstyled"
                      />
                    </InputWrapperScrollArea>
                  )}
                </Collapse>
              </>
            )}
          </>
        </Paper>
      )}
    </Transition>
  );
}

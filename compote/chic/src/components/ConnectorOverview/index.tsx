"use client";

import {
  extractMeterValuesFromConnector,
  getCustomStyles,
  timeDelta,
  widgetProps,
} from "@/utils";
import {
  ActionIcon,
  Center,
  Divider,
  Flex,
  Loader,
  Paper,
  rem,
  RingProgress,
  Table,
  Text,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import React, { useMemo, useRef } from "react";
import CloseButton from "../CloseButton";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import {
  ChargingStationConnector,
  ConnectorStatus,
  ConnectorStatus2,
  MeterValue,
  WidgetComponentProps,
} from "@/types";
import { IconChargingPile } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import carouselClasses from "../../styles/Carousel.module.css";
import { Sparkline } from "@mantine/charts";
import classes from "./ConnectorOverview.module.css";

export const conOverviewWidgetIdPrefix = "overview-con-";

interface ConnectorOverviewProps extends WidgetComponentProps {
  connector: ChargingStationConnector | null; // if null then is loading
  widgetId: string;
}

export default function ConnectorOverview({
  connector,
  mt,
  withCloseButton,
  widgetId,
}: ConnectorOverviewProps) {
  const pathname = usePathname();
  const { isWidgetSelected } = useWidgetSelection();
  const updateActiveWidget = useUpdateActiveWidget();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, connectorStatusColors } = getCustomStyles(
    theme,
    colorScheme
  );

  // Helper
  const getConnectorStatus: (
    status: Array<ConnectorStatus | ConnectorStatus2>
  ) => "Available" | "Stopped" | "Occupied" | "NoData" = (status) => {
    if (status.length === 0) {
      return "NoData";
    }
    const lastStatus = status[status.length - 1];
    const statusKeys = ["status", "connector_status"];
    for (let key of statusKeys) {
      if (key in lastStatus) {
        return lastStatus[key];
      }
    }
  };
  const newMeterValuesDependency = connector
    ? `${JSON.stringify(connector.transactions)};${JSON.stringify(connector.meter_values)}`
    : "";
  const meterValues: MeterValue[] = useMemo(() => {
    if (!connector) {
      return [];
    }
    return extractMeterValuesFromConnector(connector, connector.id);
  }, [newMeterValuesDependency]);
  const measurands: string[] = Array.from(
    new Set(meterValues.map((v) => v.measurand))
  ).filter((m) => m);
  const measurandPhases: { [index: string]: string } = measurands.reduce(
    (t: { [index: string]: string }, measurand) => {
      const mv = meterValues.find((v) => v.measurand === measurand);
      if (mv) {
        t[measurand] = mv.phase;
      }
      return t;
    },
    {}
  );
  const processedMeterValues: { [index: string]: number[] } = useMemo(() => {
    return measurands.reduce((t: { [index: string]: number[] }, measurand) => {
      t[measurand] = meterValues
        .filter(
          (v) =>
            v.measurand === measurand && v.phase === measurandPhases[measurand]
        )
        .filter(
          // remove duplicates
          (v, i, self) =>
            self.findIndex(
              (v2) =>
                v2.time.getTime() === v.time.getTime() && v2.value === v.value
            ) === i
        )
        .sort((a, b) => a.time.getTime() - b.time.getTime())
        .map((v) => v.value);
      return t;
    }, {});
  }, [newMeterValuesDependency]);
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  return (
    <Transition
      mounted={isWidgetSelected(pathname, widgetId)}
      transition="fade"
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
          {...widgetProps(
            updateActiveWidget,
            `${conOverviewWidgetIdPrefix}${connector ? connector.id : 0}`
          )}
        >
          {connector === null ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <>
              {withCloseButton !== false && <CloseButton widgetId={widgetId} />}
              <Flex gap="xs" justify="flex-start" direction="row" wrap="nowrap">
                <Flex direction="column" align="center">
                  <RingProgress
                    sections={[
                      {
                        value: 100,
                        color:
                          connectorStatusColors[
                            getConnectorStatus(connector.status)
                          ],
                      },
                    ]}
                    label={
                      <Center>
                        <ActionIcon
                          color={
                            connectorStatusColors[
                              getConnectorStatus(connector.status)
                            ]
                          }
                          variant="light"
                          radius="xl"
                          size="xl"
                        >
                          <IconChargingPile
                            style={{ width: rem(22), height: rem(22) }}
                          />
                        </ActionIcon>
                      </Center>
                    }
                  />
                  <Text>
                    {getConnectorStatus(connector.status)
                      .split(/(?=[A-Z])/)
                      .join(" ")}
                  </Text>
                </Flex>
                <div style={{ flex: 1, overflow: "auto" }}>
                  <Title order={1} size="h3">
                    Connector {connector.id}
                  </Title>
                  <Divider my="md" />
                  <Carousel
                    slideGap="md"
                    classNames={carouselClasses}
                    plugins={[autoplay.current]}
                    onMouseEnter={autoplay.current.stop}
                    onMouseLeave={autoplay.current.reset}
                  >
                    <Carousel.Slide>
                      <Table
                        bg={transparentBackground}
                        withTableBorder
                        highlightOnHover
                      >
                        <Table.Tbody>
                          <Table.Tr>
                            <Table.Td>
                              <Text size="sm" lineClamp={1}>
                                Last Status Update
                              </Text>
                            </Table.Td>
                            <Table.Td>
                              <Text size="sm" lineClamp={1}>
                                {connector.status.length > 0
                                  ? `${timeDelta(
                                      new Date(
                                        connector.status[
                                          connector.status.length - 1
                                        ].timestamp
                                      )
                                    )}`
                                  : "-"}
                              </Text>
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <Text size="sm" lineClamp={1}>
                                Total Meter Values
                              </Text>
                            </Table.Td>
                            {/* <Table.Td>{connector.meter_values.length}</Table.Td> */}
                            <Table.Td>
                              <Text size="sm" lineClamp={1}>
                                {meterValues.length}
                              </Text>
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>
                              <Text size="sm" lineClamp={1}>
                                Total Transactions
                              </Text>
                            </Table.Td>
                            <Table.Td>
                              <Text size="sm" lineClamp={1}>
                                {connector.transactions.length}
                              </Text>
                            </Table.Td>
                          </Table.Tr>
                        </Table.Tbody>
                      </Table>
                    </Carousel.Slide>
                    {measurands
                      .filter(
                        (m) =>
                          processedMeterValues[m] &&
                          processedMeterValues[m].length > 1
                      )
                      .map((measurand, i) => (
                        <Carousel.Slide key={i} w="100%">
                          <Flex
                            h="100%"
                            gap="md"
                            justify="flex-start"
                            align="flex-start"
                            direction="column"
                            wrap="nowrap"
                          >
                            <Text
                              size="sm"
                              maw="100%"
                              lineClamp={1}
                              className={classes.sparklineTitle}
                            >
                              {measurand}:
                            </Text>
                            <Sparkline
                              w="100%"
                              h="100%"
                              data={processedMeterValues[measurand]}
                              curveType="bump"
                              color={theme.primaryColor}
                              fillOpacity={0.48}
                              strokeWidth={2}
                              flex={1}
                            />
                          </Flex>
                        </Carousel.Slide>
                      ))}
                  </Carousel>
                </div>
              </Flex>
            </>
          )}
        </Paper>
      )}
    </Transition>
  );
}

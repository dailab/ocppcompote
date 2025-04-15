import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Paper,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
  Tooltip,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { BarChart, PieChart, PieChartCell } from "@mantine/charts";
import CloseButton from "../CloseButton";
import {
  defaultSWRConfig,
  fetcher,
  getCustomStyles,
  getMantineColorRandom,
  scrollAreaProps,
  transitionDurations,
  widgetProps,
} from "@/utils";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageCard from "./MessageCard";
import { ContextMessages, OCPPMessage2, WidgetComponentProps } from "@/types";
import useSWR, { mutate, SWRResponse } from "swr";
import {
  IconRefresh,
  IconSnowflake,
  IconSnowflakeOff,
} from "@tabler/icons-react";
import CSIndicator from "../CSIndicator";
import FrozenBadge from "../FrozenBadge";
import { usePathname } from "next/navigation";

export const messageHistoryWidgetId = "message-history-analytics";

interface MessageHistoryAnalyticsProps extends WidgetComponentProps {
  chargingStationId: string | null; // if null then is loading
  context: Object | undefined; // if undefined then is loading
}

export default function MessageHistoryAnalytics({
  chargingStationId,
  withCloseButton,
  mt,
  context,
}: MessageHistoryAnalyticsProps) {
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

  // State
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);
  const [isScrolledDown, setIsScrolledDown] = useState<boolean>(true);
  const [frozen, setFrozen] = useState<boolean>(true);
  const [onUnfreeze, setOnUnfreeze] = useState<{
    [index: string]: () => void;
  }>({});
  const [lastMessages, setLastMessages] = useState<OCPPMessage2[]>([]);
  const [colorPaletteMessages, setColorPaletteMessages] = useState<{
    [index: string]: string;
  }>({});

  // API calls
  const {
    data: messages,
    isLoading: isLoadingMessages,
    error: _loadingMessagesError,
  }: SWRResponse<ContextMessages> = useSWR(
    `${process.env.NEXT_PUBLIC_CSMS_OCPP}/context/${chargingStationId}/messages`,
    fetcher,
    {
      ...defaultSWRConfig,
      refreshInterval: frozen ? undefined : 1000,
    }
  );

  // Helpers
  const refreshMessages = () => {
    mutate(
      `${process.env.NEXT_PUBLIC_CSMS_OCPP}/context/${chargingStationId}/messages`
    );
  };
  const viewportScrollarea = useRef<HTMLDivElement>(null);
  const leftSection = useCallback(
    (n: any) => {
      if (!n) {
        return;
      }
      setScrollAreaHeight(n.getBoundingClientRect().height);
    },
    [messages]
  );
  const messagesInData: PieChartCell[] = messages
    ? Object.keys(messages.messages_in).map((key) => ({
        name: key,
        value: messages.messages_in[key],
        color: colorPaletteMessages[key],
      }))
    : [];
  const messagesOutData: PieChartCell[] = messages
    ? Object.keys(messages.messages_out).map((key) => ({
        name: key,
        value: messages.messages_out[key],
        color: colorPaletteMessages[key],
      }))
    : [];
  const messagesDeltaData: Record<string, any>[] = messages
    ? Object.keys(messages.messages_delta).map((key) => ({
        name: key,
        "Average Processing Time":
          messages.messages_delta[key].length > 0
            ? Number(
                (
                  messages.messages_delta[key].reduce(
                    (t, e) => t + e * 1000000,
                    0
                  ) / messages.messages_delta[key].length
                ).toFixed(2)
              )
            : 0,
        color: colorPaletteMessages[key],
      }))
    : [];

  // Effects
  // useEffect(() => {
  //   if (frozen && lastMessages.length === 0) {
  //     setTimeout(refreshMessages, 1000);
  //   }
  // }, []);
  useEffect(() => {
    if (viewportScrollarea.current) {
      const SCROLLED_DOWN_TOLERANCE = 50; // tolerance in px
      setIsScrolledDown(
        Math.abs(
          viewportScrollarea.current.scrollTop +
            scrollAreaHeight -
            viewportScrollarea.current.scrollHeight
        ) <= SCROLLED_DOWN_TOLERANCE
      );
    }
    if (!messages) {
      return;
    }
    const MAX_LAST_MESSAGES = 475;
    const newLastMessages = [
      ...lastMessages,
      ...messages.last_messages
        .filter(
          (m1) => !lastMessages.find((m2) => m2.time_start === m1.time_start)
        )
        .sort(
          (m1, m2) =>
            new Date(m1.time_start).getTime() -
            new Date(m2.time_start).getTime()
        ),
    ];
    setLastMessages(
      newLastMessages.length > MAX_LAST_MESSAGES
        ? newLastMessages.splice(0, MAX_LAST_MESSAGES)
        : newLastMessages
    );
    const messageKeys = Object.keys(messages.messages_in)
      .concat(Object.keys(messages.messages_out))
      .concat(Object.keys(messages.messages_delta));
    const colorPaletteKeys = Object.keys(colorPaletteMessages);
    const newKeys = messageKeys.filter(
      (key) => !colorPaletteKeys.includes(key)
    );
    if (newKeys.length > 0) {
      const colorPaletteTmp: { [index: string]: string } = {};
      for (let key of newKeys) {
        const newColor = getMantineColorRandom(
          theme,
          Object.values(colorPaletteMessages).concat(
            Object.values(colorPaletteTmp)
          ),
          [2, 3, 4, 5, 6, 7]
        );
        colorPaletteTmp[key] = newColor;
      }
      setColorPaletteMessages({
        ...colorPaletteMessages,
        ...colorPaletteTmp,
      });
    }
  }, [messages]);
  useEffect(() => {
    if (!viewportScrollarea.current) {
      return;
    }
    if (isScrolledDown) {
      viewportScrollarea.current.scrollTo({
        top: viewportScrollarea.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [viewportScrollarea.current?.scrollHeight]);

  return (
    <Transition
      mounted={isWidgetSelected(pathname, messageHistoryWidgetId)}
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
          {...widgetProps(updateActiveWidget, messageHistoryWidgetId)}
        >
          {withCloseButton !== false && (
            <CloseButton widgetId={messageHistoryWidgetId} />
          )}
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <div ref={leftSection}>
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="xs" wrap="nowrap">
                    <Title order={1} size="h3">
                      Message Analytics for{" "}
                      <CSIndicator
                        chargingStationId={chargingStationId}
                        context={context}
                      />
                    </Title>
                    <FrozenBadge mounted={frozen} visibleFrom="xl" />
                  </Group>
                  <Group gap="xs" wrap="nowrap">
                    <Tooltip label="Refresh">
                      <ActionIcon
                        variant="default"
                        onClick={() => {
                          refreshMessages();
                        }}
                        loading={isLoadingMessages && frozen}
                        size="input-sm"
                        aria-label="Refresh"
                        hiddenFrom="xl"
                      >
                        <IconRefresh size={iconSize} />
                      </ActionIcon>
                    </Tooltip>
                    <Button
                      onClick={() => {
                        refreshMessages();
                      }}
                      loading={isLoadingMessages && frozen}
                      variant="default"
                      leftSection={<IconRefresh size={iconSize} />}
                      visibleFrom="xl"
                    >
                      Refresh
                    </Button>
                    <Tooltip
                      label={
                        frozen ? "Enable Auto Refresh" : "Disable Auto Refresh"
                      }
                    >
                      <ActionIcon
                        variant="default"
                        onClick={() => {
                          if (frozen) {
                            setIsScrolledDown(true);
                            for (let key of Object.keys(onUnfreeze)) {
                              onUnfreeze[key]();
                            }
                          }
                          setFrozen(!frozen);
                        }}
                        size="input-sm"
                        aria-label="Refresh"
                        hiddenFrom="xl"
                      >
                        {frozen ? (
                          <IconSnowflakeOff size={iconSize} />
                        ) : (
                          <IconSnowflake size={iconSize} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                    <Button
                      onClick={() => {
                        if (frozen) {
                          setIsScrolledDown(true);
                          for (let key of Object.keys(onUnfreeze)) {
                            onUnfreeze[key]();
                          }
                        }
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
                      visibleFrom="xl"
                    >
                      {frozen ? "Unfreeze" : "Freeze"}
                    </Button>
                  </Group>
                </Group>
                <Divider my="md" />
                {!messages ? (
                  <Center>
                    <Loader />
                  </Center>
                ) : (
                  <Flex
                    gap="md"
                    align="center"
                    direction="column"
                    wrap="nowrap"
                  >
                    <SimpleGrid cols={{ base: 1, sm: 2 }} w="100%">
                      <Center>
                        <div>
                          <Text size="sm" ta="center">
                            Composition of Messages Processing In
                          </Text>
                          <PieChart
                            withLabelsLine
                            labelsPosition="outside"
                            labelsType="percent"
                            withLabels
                            withTooltip
                            tooltipDataSource="segment"
                            tooltipAnimationDuration={transitionDurations.short}
                            size={250}
                            data={messagesInData}
                          />
                        </div>
                      </Center>
                      <Center>
                        <div>
                          <Text size="sm" ta="center">
                            Composition of Messages Processing Out
                          </Text>
                          <PieChart
                            withLabelsLine
                            labelsPosition="outside"
                            labelsType="percent"
                            withLabels
                            withTooltip
                            tooltipDataSource="segment"
                            tooltipAnimationDuration={200}
                            size={250}
                            data={messagesOutData}
                          />
                        </div>
                      </Center>
                    </SimpleGrid>
                    <div style={{ width: "100%" }}>
                      <Text size="sm" ta="center" mb="xs">
                        Message Processing Time
                      </Text>
                      <BarChart
                        h={200}
                        data={messagesDeltaData}
                        dataKey="name"
                        series={[{ name: "Average Processing Time" }]}
                        tickLine="none"
                        withXAxis={false}
                        xAxisProps={{
                          padding: { left: 30, right: 30 },
                        }}
                        tooltipAnimationDuration={transitionDurations.short}
                        unit="µs"
                      />
                    </div>
                  </Flex>
                )}
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 0, md: 4 }} visibleFrom="md">
              {!messages ? (
                <Skeleton h="100%" w="100%" radius={theme.defaultRadius} />
              ) : (
                <Paper
                  px="xs"
                  py={0}
                  m={0}
                  shadow="0"
                  bg={
                    colorScheme === "dark"
                      ? theme.colors.dark[7]
                      : theme.colors.gray[1]
                  }
                >
                  {
                    <ScrollArea
                      h={scrollAreaHeight}
                      {...scrollAreaProps}
                      viewportRef={viewportScrollarea}
                    >
                      <Flex gap="xs" direction="column" wrap="nowrap" py="xs">
                        {lastMessages.map((message: OCPPMessage2, i) => {
                          return (
                            <MessageCard
                              key={i}
                              index={i}
                              message={message}
                              onExpand={() => {
                                // setFrozen(true);
                              }}
                              setOnUnfreeze={setOnUnfreeze}
                            />
                          );
                        })}
                      </Flex>
                    </ScrollArea>
                  }
                </Paper>
              )}
            </Grid.Col>
          </Grid>
        </Paper>
      )}
    </Transition>
  );
}

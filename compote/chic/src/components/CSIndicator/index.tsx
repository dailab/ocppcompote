import { getCustomStyles } from "@/utils";
import {
  Box,
  Flex,
  Indicator,
  Paper,
  Skeleton,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";

interface CSIndicatorProps {
  chargingStationId: string | null; // if null then is loading
  context: { [index: string]: any } | undefined; // if undefined then is loading
}

export default function CSIndicator({
  context,
  chargingStationId,
}: CSIndicatorProps) {
  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Helpers
  const isLive = context && context["liveness"] >= 0;

  return (
    <Indicator
      inline
      processing={isLive}
      disabled={!context}
      label={isLive ? undefined : "stale"}
      color={isLive ? "green" : "red"}
    >
      {chargingStationId === null ? (
        <Skeleton>Charging Station X</Skeleton>
      ) : (
        <Paper
          display="inline"
          p={5}
          shadow="0"
          radius="md"
          bg={
            colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1]
          }
        >
          <Text inherit display="inline">
            Charging Station {chargingStationId}
          </Text>
        </Paper>
      )}
    </Indicator>
  );
}

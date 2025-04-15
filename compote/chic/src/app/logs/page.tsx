"use client";

import { Container, SimpleGrid } from "@mantine/core";
import { defaultContainerSize, defaultSWRConfig, fetcher } from "@/utils";
import { Log, Log2, WidgetConfiguration } from "@/types";
import { useEffect, useState } from "react";
import WidgetSelectionHeader from "@/components/WidgetSelectionHeader";
import useSWR, { SWRResponse, mutate } from "swr";
import LogsLevelOverview, {
  logsLevelOverviewWidgetId,
} from "@/components/LogsLevelOverview";
import LogsTimeline, { logsTimelineWidgetId } from "@/components/LogsTimeline";
import LogsOverviewTable, {
  logsOverviewTableWidgetId,
} from "@/components/LogsOverviewTable";
import { useWidgetRegistration } from "@/components/WidgetsProvider";
import { usePathname } from "next/navigation";

export default function Logs() {
  const initialWidgets: WidgetConfiguration[] = [
    { widgetId: logsLevelOverviewWidgetId, name: "Level Composition" },
    { widgetId: logsTimelineWidgetId, name: "Timeline" },
    { widgetId: logsOverviewTableWidgetId, name: "Overview Table" },
  ];
  const pathname = usePathname();
  const { registerPage, isPageRegistered } = useWidgetRegistration();

  // State
  const [frozen, setFrozen] = useState<boolean>(true);

  // API calls
  const {
    data: logsRaw,
    isLoading: isLoadingLogs,
    error: _loadingLogsError,
  }: SWRResponse<(Log | Log2)[]> = useSWR(
    `${process.env.NEXT_PUBLIC_CSMS_OCPP}/log`,
    fetcher,
    {
      ...defaultSWRConfig,
      refreshInterval: frozen ? undefined : 2500,
    }
  );

  // Helpers
  const refreshLogs = () => {
    mutate(`${process.env.NEXT_PUBLIC_CSMS_OCPP}/log`);
  };
  const logs: (Log | Log2)[] = logsRaw || [];

  // Effects
  useEffect(() => {
    if (!isPageRegistered(pathname)) {
      registerPage(pathname, initialWidgets);
    }
  }, []);

  return (
    <Container size={defaultContainerSize} pt="md">
      <WidgetSelectionHeader title="Viewing Status Logs" />
      <SimpleGrid
        cols={{
          base: 1,
          md: 2,
        }}
        mt="md"
        spacing="md"
      >
        <LogsLevelOverview logs={logs} />
        <LogsTimeline logs={logs} />
      </SimpleGrid>
      <LogsOverviewTable
        mt="md"
        logs={logs}
        frozen={frozen}
        setFrozen={setFrozen}
        refreshLogs={refreshLogs}
        isLoadingLogs={isLoadingLogs}
      />
    </Container>
  );
}

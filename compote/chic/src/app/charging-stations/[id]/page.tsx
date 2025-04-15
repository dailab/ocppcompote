"use client";

import CSConfigurationInformation, {
  csConfigInfoWidgetId,
} from "@/components/CSConfigurationInformation";
import MessageEditor, {
  messageEditorWidgetId,
} from "@/components/MessageEditor";
import MessageSequenceVisualization, {
  messageSequenceVisualizationWidgetId,
} from "@/components/MessageSequenceVisualization";
import { CSMSContext, WidgetConfiguration } from "@/types";
import {
  chargingStationName,
  defaultContainerSize,
  defaultSWRConfig,
  fetcher,
  isSameProtocol,
  ocppV16,
} from "@/utils";
import { Container, SimpleGrid } from "@mantine/core";
import { useEffect } from "react";
import useSWR, { SWRResponse } from "swr";
import ConnectorOverview, {
  conOverviewWidgetIdPrefix,
} from "@/components/ConnectorOverview";
import MessageHistoryAnalytics, {
  messageHistoryWidgetId,
} from "@/components/MessageHistoryAnalytics";
import WidgetSelectionHeader from "@/components/WidgetSelectionHeader";
import chargingContext from "@/context_charging_ocpp201.json";
import MeterValuesChart, {
  meterValuesChartWidgetId,
} from "@/components/MeterValuesChart";
import { useWidgetRegistration } from "@/components/WidgetsProvider";
import { usePathname } from "next/navigation";
import { MessageEditorProvider } from "@/components/MessageEditor/MessageEditorProvider";

export default function ChargingStationDetail({
  params,
}: {
  params: { id: string };
}) {
  const initialWidgets: WidgetConfiguration[] = [
    { widgetId: csConfigInfoWidgetId, name: "Configuration Information" },
    { widgetId: messageEditorWidgetId, name: "Message Editor" },
    {
      widgetId: messageSequenceVisualizationWidgetId,
      name: "Message Sequence Visualization",
    },
    {
      widgetId: messageHistoryWidgetId,
      name: "Message History Analytics",
    },
    { widgetId: meterValuesChartWidgetId, name: "Meter Values Chart" },
  ];
  const { registerPage, registerWidget, isPageRegistered, isWidgetRegistered } =
    useWidgetRegistration();
  const pathname = usePathname();

  // API calls
  const {
    data: context,
    isLoading: _isLoadingContext,
    error: _loadingContextError,
  }: SWRResponse<CSMSContext> = useSWR(
    `${process.env.NEXT_PUBLIC_CSMS_OCPP}/context/${params.id}`,
    fetcher,
    defaultSWRConfig
  );
  // const context: { [indlex: string]: any } = chargingContext;

  // Helpers
  const newWidgetsDependency =
    context && context.connectors
      ? Object.keys(context.connectors).join(",")
      : "";

  // Effects
  useEffect(() => {
    const connectorWidgets: WidgetConfiguration[] =
      context && context.connectors
        ? Object.keys(context.connectors).map((cId) => ({
            widgetId: `${conOverviewWidgetIdPrefix}${cId}`,
            name: `Overview Connector ${cId}`,
          }))
        : [];
    if (!isPageRegistered(pathname)) {
      registerPage(pathname, initialWidgets.concat(connectorWidgets));
      return;
    }
    for (let w of connectorWidgets) {
      if (!isWidgetRegistered(pathname, w.widgetId)) {
        registerWidget(pathname, w);
      }
    }
  }, [newWidgetsDependency]);

  return (
    <Container size={defaultContainerSize} pt="md">
      <WidgetSelectionHeader
        title={`Viewing ${chargingStationName(params.id)}`}
      />
      {context && (
        <SimpleGrid
          cols={{
            base: 1,
            sm: Math.min(2, Object.keys(context.connectors).length),
            lg: Math.min(3, Object.keys(context.connectors).length),
            xl: Object.keys(context.connectors).length,
          }}
          mt="md"
          spacing="md"
        >
          {Object.keys(context.connectors).map((cId) => (
            <ConnectorOverview
              connector={{ id: cId, ...context.connectors[cId] }}
              widgetId={`${conOverviewWidgetIdPrefix}${cId}`}
              key={cId}
            />
          ))}
        </SimpleGrid>
      )}
      <CSConfigurationInformation
        chargingStationId={params.id}
        context={context}
        mt="md"
      />
      <MeterValuesChart
        chargingStationId={params.id}
        context={context}
        mt="md"
      />
      <MessageHistoryAnalytics
        chargingStationId={params.id}
        context={context}
        mt="md"
      />
      <MessageEditorProvider
        protocolSelectionAids={[
          {
            communicationPath: {
              senderRole: "CPO",
              recipientRole: "CS",
            },
            filterAvailableProtocolsCallback: (p) => p.name === "OCPP",
            findDefaultProtocolCallback: (p) => isSameProtocol(p, ocppV16),
          },
        ]}
        initialSender={{ name: "You", role: "CPO" }}
        initialRecipient={{
          id: params.id,
          name: chargingStationName(params.id),
          role: "CS",
        }}
      >
        <MessageEditor mt="md" />
        <MessageSequenceVisualization includeMessageEditor mt="md" />
      </MessageEditorProvider>
    </Container>
  );
}

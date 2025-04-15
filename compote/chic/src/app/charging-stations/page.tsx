"use client";

import {
  Container,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  chargingStationName,
  defaultContainerSize,
  getCustomStyles,
  isSameProtocol,
  mqtt,
} from "@/utils";
import { useCsmsContexts } from "@/components/ContextsProvider";
import CSTopology, { csTopologyWidgetId } from "@/components/CSTopology";
import { useEffect } from "react";
import WidgetSelectionHeader from "@/components/WidgetSelectionHeader";
import CSOVerviewTable, {
  csOverviewTableWidgetId,
} from "@/components/CSOverviewTable";
import { CSMSContext, WidgetConfiguration } from "@/types";
import { usePathname } from "next/navigation";
import { useWidgetRegistration } from "@/components/WidgetsProvider";
import { MessageEditorProvider } from "@/components/MessageEditor/MessageEditorProvider";
import MessageEditor, {
  messageEditorWidgetId,
} from "@/components/MessageEditor";
import MessageSequenceVisualization, {
  messageSequenceVisualizationWidgetId,
} from "@/components/MessageSequenceVisualization";

export default function ChargingStations() {
  const initialWidgets: WidgetConfiguration[] = [
    { widgetId: csTopologyWidgetId, name: "Topology" },
    { widgetId: csOverviewTableWidgetId, name: "Overview Table" },
    { widgetId: messageEditorWidgetId, name: "Everest Message Editor" },
    {
      widgetId: messageSequenceVisualizationWidgetId,
      name: "Message Sequence Visualization",
    },
  ];
  const { registerPage, isPageRegistered } = useWidgetRegistration();
  const pathname = usePathname();
  const contexts: { [index: string]: CSMSContext } | null = useCsmsContexts();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground } = getCustomStyles(theme, colorScheme);

  // Effects
  useEffect(() => {
    if (!isPageRegistered(pathname)) {
      registerPage(pathname, initialWidgets);
    }
  }, []);

  return (
    <Container size={defaultContainerSize} pt="md">
      <WidgetSelectionHeader title="Viewing Charging Stations" />
      <CSTopology contexts={contexts} bg={transparentBackground} mt="md" />
      <CSOVerviewTable contexts={contexts} mt="md" />
      <MessageEditorProvider
        protocolSelectionAids={[
          {
            communicationPath: {
              senderRole: "CPO",
              recipientRole: "Everest",
            },
            filterAvailableProtocolsCallback: (p) => p.name === "MQTT",
            findDefaultProtocolCallback: (p) => isSameProtocol(p, mqtt),
          },
        ]}
        initialSender={{
          role: "CPO",
          id: "DE*ABC",
        }}
        initialRecipient={{ name: "Everest", role: "Everest" }}
      >
        <MessageEditor mt="md" />
        <MessageSequenceVisualization includeMessageEditor mt="md" />
      </MessageEditorProvider>
    </Container>
  );
}

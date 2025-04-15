"use client";

import { authOverviewWidgetId } from "@/components/AuthOverview/AuthOverview";
import { useEmpmsContext } from "@/components/ContextsProvider";
import { csMapWidgetId } from "@/components/CSMap";
import MessageEditor, {
  messageEditorWidgetId,
} from "@/components/MessageEditor";
import { MessageEditorProvider } from "@/components/MessageEditor/MessageEditorProvider";
import MessageSequenceVisualization, {
  messageSequenceVisualizationWidgetId,
} from "@/components/MessageSequenceVisualization";
import WidgetSelectionHeader from "@/components/WidgetSelectionHeader";
import { useWidgetRegistration } from "@/components/WidgetsProvider";
import { WidgetConfiguration } from "@/types";
import { defaultContainerSize, isSameProtocol, oicpV23 } from "@/utils";
import { Container } from "@mantine/core";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Dynamically import components that depend on window
const CSMap = dynamic(() => import("@/components/CSMap"), { ssr: false });
const AuthOverview = dynamic(
  () => import("@/components/AuthOverview/AuthOverview"),
  { ssr: false }
);
export default function EMPPage() {
  const initialWidgets: WidgetConfiguration[] = [
    { widgetId: csMapWidgetId, name: "Charging Stations Map" },
    { widgetId: authOverviewWidgetId, name: "Authentication Overview" },
    { widgetId: messageEditorWidgetId, name: "Message Editor" },
    {
      widgetId: messageSequenceVisualizationWidgetId,
      name: "Message Sequence Visualization",
    },
  ];
  const pathname = usePathname();
  const { registerPage, isPageRegistered } = useWidgetRegistration();
  const context = useEmpmsContext();

  // Effects
  useEffect(() => {
    if (!isPageRegistered(pathname)) {
      registerPage(pathname, initialWidgets);
    }
  }, []);

  return (
    <Container size={defaultContainerSize} pt="md">
      <WidgetSelectionHeader title="EMP Page" />
      <MessageEditorProvider
        protocolSelectionAids={[
          {
            communicationPath: { senderRole: "EMP", recipientRole: "eRoaming" },
            filterAvailableProtocolsCallback: (p) => p.name === "OICP",
            findDefaultProtocolCallback: (p) => isSameProtocol(p, oicpV23),
          },
        ]}
        initialSender={{ name: "You", id: "DE*DCB", role: "EMP" }}
        initialRecipient={{ role: "eRoaming" }}
      >
        <CSMap mt="md" context={context} />
        <AuthOverview mt="md" context={context} />
        <MessageEditor mt="md" />
        <MessageSequenceVisualization includeMessageEditor mt="md" />
      </MessageEditorProvider>
    </Container>
  );
}

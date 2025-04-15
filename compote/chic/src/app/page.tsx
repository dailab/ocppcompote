"use client";

import MessageEditor, {
  messageEditorWidgetId,
} from "@/components/MessageEditor";
import MessageSequenceVisualization, {
  messageSequenceVisualizationWidgetId,
} from "@/components/MessageSequenceVisualization";
import {
  useUpdateUserExperience,
  useUser,
  useUserExperience,
} from "@/components/UserProvider";
import WidgetSelectionHeader from "@/components/WidgetSelectionHeader";
import {
  useWidgetRegistration,
  useWidgetSelection,
} from "@/components/WidgetsProvider";
import { ProtocolSelectionAid, WidgetConfiguration } from "@/types";
import {
  defaultContainerSize,
  getCustomStyles,
  isSameProtocol,
  mqtt,
  ocppV16,
  oicpV23,
  transitionDurations,
} from "@/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Alert,
  Container,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { MessageEditorProvider } from "@/components/MessageEditor/MessageEditorProvider";
import { IconMoodWink } from "@tabler/icons-react";
import DashboardTopology, {
  dashboardTopologyWidgetId,
} from "@/components/DashboardTopology";
import { ReactFlowProvider } from "@xyflow/react";

export default function Dashboard() {
  const user = useUser();
  const { registerPage, isPageRegistered } = useWidgetRegistration();
  const { updateWidgetSelection } = useWidgetSelection();
  const pathname = usePathname();
  const { showWelcomeMessage } = useUserExperience();
  const updateUserExperience = useUpdateUserExperience();
  const initialWidgets: WidgetConfiguration[] = [
    { widgetId: dashboardTopologyWidgetId, name: "Topology" },
    {
      widgetId: messageEditorWidgetId,
      name: "Message Editor",
      initialValue: false,
    },
    {
      widgetId: messageSequenceVisualizationWidgetId,
      name: "Message Sequence Visualization",
      initialValue: false,
    },
  ];

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { iconSize } = getCustomStyles(theme, colorScheme);

  // Helpers
  const protocolSelectionAids: ProtocolSelectionAid[] = [
    {
      communicationPath: {
        senderRole: "CPO",
        recipientRole: "CS",
      },
      filterAvailableProtocolsCallback: (p) => p.name === "OCPP",
      findDefaultProtocolCallback: (p) => isSameProtocol(p, ocppV16),
    },
    {
      communicationPath: {
        senderRole: "EMP",
        recipientRole: "eRoaming",
      },
      filterAvailableProtocolsCallback: (p) => p.name === "OICP",
      findDefaultProtocolCallback: (p) => isSameProtocol(p, oicpV23),
    },
    {
      communicationPath: {
        senderRole: "CPO",
        recipientRole: "eRoaming",
      },
      filterAvailableProtocolsCallback: (p) => p.name === "OICP",
      findDefaultProtocolCallback: (p) => isSameProtocol(p, oicpV23),
    },
    {
      communicationPath: {
        senderRole: "CPO",
        recipientRole: "Everest",
      },
      filterAvailableProtocolsCallback: (p) => p.name === "MQTT",
      findDefaultProtocolCallback: (p) => isSameProtocol(p, mqtt),
    },
  ];

  // Effects
  useEffect(() => {
    if (!isPageRegistered(pathname)) {
      registerPage(pathname, initialWidgets);
    }
  }, []);

  return (
    <Container size={defaultContainerSize} pt="md">
      <WidgetSelectionHeader title="Dashboard" />
      {user && (
        <Transition
          mounted={showWelcomeMessage}
          transition="fade-left"
          duration={transitionDurations.short}
          timingFunction="ease"
        >
          {(transitionStyle) => (
            <Alert
              variant="default"
              color="blue"
              withCloseButton
              title={`Welcome back, ${user.name}!`}
              icon={<IconMoodWink size={iconSize} />}
              style={{ ...transitionStyle }}
              onClose={() => {
                if (updateUserExperience === null) {
                  return;
                }
                updateUserExperience((prev) => ({
                  ...prev,
                  showWelcomeMessage: false,
                }));
              }}
              mt="md"
            >
              You are logged in as role {user.role.name}.
            </Alert>
          )}
        </Transition>
      )}
      <ReactFlowProvider>
        <MessageEditorProvider
          protocolSelectionAids={protocolSelectionAids}
          onCommunicationPathChange={(newSender, newRecipient) => {
            if (!isPageRegistered(pathname)) {
              return;
            }
            if (!newSender || !newRecipient) {
              return;
            }
            updateWidgetSelection(pathname, messageEditorWidgetId, true);
          }}
        >
          <DashboardTopology mt="md" />
          <MessageEditor mt="md" />
          <MessageSequenceVisualization includeMessageEditor={true} mt="md" />
        </MessageEditorProvider>
      </ReactFlowProvider>
    </Container>
  );
}

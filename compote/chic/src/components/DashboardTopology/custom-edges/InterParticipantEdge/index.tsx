import React from "react";
import { EdgeProps, useReactFlow } from "@xyflow/react";
import {
  BidirectionalMenuEdge,
  InterParticipantEdge,
  MessageRecipient,
  MessageSender,
  ParticipantRole,
} from "@/types";
import {
  Menu,
  ThemeIcon,
  Tooltip,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconMessageCog } from "@tabler/icons-react";
import {
  chargingStationName,
  getCustomStyles,
  recipientToString,
  senderToString,
  transitionDurations,
} from "@/utils";
import BidirectionalMenuEdgeComponent from "../BidirectionalMenuEdge";
import { useCsmsContexts } from "@/components/ContextsProvider";
import { useMessageEditor } from "@/components/MessageEditor/MessageEditorProvider";
import { useUser } from "@/components/UserProvider";

export default function InterParticipantEdgeComponent(
  props: EdgeProps<InterParticipantEdge>
) {
  const reactFlowState = useReactFlow();
  const csmsContexts = useCsmsContexts();
  const messageEditorContext = useMessageEditor();
  const user = useUser();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { primaryColor, iconSize } = getCustomStyles(theme, colorScheme);

  // Helpers
  const participants: {
    [index: string]: (MessageRecipient | MessageSender)[];
  } = {
    CPO: [{ role: "CPO", id: "DE*ABC" }],
    EMP: [{ role: "EMP", id: "DE*DCB" }],
    eRoaming: [{ role: "eRoaming" }],
    CS: csmsContexts
      ? Object.keys(csmsContexts).map((key) => ({
          role: "CS",
          id: csmsContexts[key].id,
          name: chargingStationName(key),
        }))
      : [],
    Everest: [{ role: "Everest", name: "Everest" }],
  };
  const senders = props.data
    ? participants[props.data.communicationPath.senderRole]
    : [];
  const recipients = props.data
    ? participants[props.data.communicationPath.recipientRole]
    : [];
  const isSelected: boolean = reactFlowState
    .getEdges()
    .some((e) => e.id === props.id && e.selected);
  const messageEditorSenderRole: undefined | null | ParticipantRole =
    !messageEditorContext
      ? undefined
      : !messageEditorContext.sender
        ? null
        : messageEditorContext.sender.role;
  const messageEditorRecipientRole: undefined | null | ParticipantRole =
    !messageEditorContext
      ? undefined
      : !messageEditorContext.recipient
        ? null
        : messageEditorContext.recipient.role;
  const isInMessageEditor = !props.data
    ? false
    : messageEditorSenderRole === props.data.communicationPath.senderRole &&
      messageEditorRecipientRole === props.data.communicationPath.recipientRole;
  const bidirectionalMenuEdgeProps: EdgeProps<BidirectionalMenuEdge> = {
    ...props,
    style: {
      ...props.style,
      ...(isSelected || isInMessageEditor
        ? {
            stroke: primaryColor,
          }
        : {}),
    },
    data: {
      menuDropdown: (setShowMenu) => (
        <>
          {senders.map((sender) => {
            const multipleSenders = senders.length > 1;
            return recipients.map((recipient) => {
              if (!props.data) {
                return;
              }
              const multipleRecipients = recipients.length > 1;
              const isAllowedCommuncationPath: boolean = user
                ? user.role.allowedCommunicationPaths.find(
                    (c) =>
                      c.senderRole === sender.role &&
                      c.recipientRole === recipient.role
                  ) !== undefined
                : false;
              return (
                <Tooltip
                  label={
                    user
                      ? `Warning: You (${user.role.name}) are not permitted to send messages on this communication path.`
                      : ""
                  }
                  disabled={isAllowedCommuncationPath || user === undefined}
                >
                  <Menu.Item
                    disabled={isInMessageEditor}
                    color={
                      isAllowedCommuncationPath || user === undefined
                        ? undefined
                        : "yellow"
                    }
                    leftSection={<IconMessageCog size={iconSize} />}
                    onClick={() => {
                      if (!props.data || !messageEditorContext) {
                        return;
                      }
                      messageEditorContext.changeCommunicationPath(
                        sender,
                        recipient
                      );
                      setShowMenu(false);
                      setTimeout(() => {
                        if (
                          messageEditorContext.widgetRef &&
                          messageEditorContext.widgetRef.current
                        ) {
                          messageEditorContext.widgetRef.current.scrollIntoView(
                            {
                              behavior: "smooth",
                            }
                          );
                        }
                      }, 10);
                    }}
                  >
                    Open Message Editor
                    {`${multipleRecipients || multipleSenders ? "(" : ""}${multipleSenders ? `Sender: ${senderToString(sender)}` : ""}${multipleRecipients ? `, Recipient: ${recipientToString(recipient)}` : ""}${multipleRecipients || multipleSenders ? ")" : ""}`}
                  </Menu.Item>
                </Tooltip>
              );
            });
          })}
        </>
      ),
      // subLabelOffset: isInMessageEditor ? 15 : 0,
      // subLabel: (
      //   <Transition
      //     mounted={isInMessageEditor}
      //     transition="fade"
      //     duration={transitionDurations.medium}
      //     timingFunction="ease"
      //   >
      //     {(transitionStyle) => (
      //       <Box style={transitionStyle}>
      //         <Text size="xs" c={primaryColor} td="underline">
      //           In Message Editor
      //         </Text>
      //       </Box>
      //     )}
      //   </Transition>
      // ),
      leftSection: (
        <Transition
          mounted={isInMessageEditor}
          transition="fade"
          duration={transitionDurations.medium}
          timingFunction="ease"
        >
          {(transitionStyle) => (
            <Tooltip label="Currently opened in Message Editor">
              <ThemeIcon variant="outline" size="xs" style={transitionStyle}>
                <IconMessageCog style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
            </Tooltip>
          )}
        </Transition>
      ),
    },
  };

  return (
    <>
      <BidirectionalMenuEdgeComponent {...bidirectionalMenuEdgeProps} />
    </>
  );
}

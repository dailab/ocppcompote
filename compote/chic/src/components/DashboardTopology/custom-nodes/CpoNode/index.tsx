import { CpoNode, HeaderBodyNode, ParticipantRole } from "@/types";
import { NodeProps } from "@xyflow/react";
import { IconMessageCog, IconUserCog } from "@tabler/icons-react";
import HeaderBodyNodeComponent from "../HeaderBodyNode";
import { useOnlineServices } from "@/components/ContextsProvider";
import {
  Menu,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useUser } from "@/components/UserProvider";
import { useMessageEditor } from "@/components/MessageEditor/MessageEditorProvider";
import { getCustomStyles } from "@/utils";

export default function CpoNodeComponent(props: NodeProps<CpoNode>) {
  const user = useUser();
  const onlineServices = useOnlineServices();
  const messageEditorContext = useMessageEditor();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { iconSize } = getCustomStyles(theme, colorScheme);

  // Helpers
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
  const isInEverestMessageEditor = !props.data
    ? false
    : messageEditorSenderRole === "CPO" &&
      messageEditorRecipientRole === "Everest";
  const isAllowedEverestCommuncationPath: boolean = user
    ? user.role.allowedCommunicationPaths.find(
        (c) => c.recipientRole === "Everest" && c.senderRole === "CPO"
      ) !== undefined
    : false;
  const headerBodyNodeProps: NodeProps<HeaderBodyNode> = {
    ...props,
    type: "headerbody",
    data: {
      label: "CPO",
      icon: IconUserCog,
      indicatorProps: {
        color: onlineServices.includes("csms") ? "green" : "red",
        processing: onlineServices.includes("csms"),
        label: "CSMS",
      },
      menuDropdown: (setShowMenu) => (
        <>
          <Tooltip
            label={
              user
                ? `Warning: You (${user.role.name}) are not permitted to send messages on this communication path.`
                : ""
            }
            disabled={isAllowedEverestCommuncationPath || user === undefined}
          >
            <Menu.Item
              disabled={isInEverestMessageEditor}
              color={
                isAllowedEverestCommuncationPath || user === undefined
                  ? undefined
                  : "yellow"
              }
              leftSection={<IconMessageCog size={iconSize} />}
              onClick={() => {
                if (!props.data || !messageEditorContext) {
                  return;
                }
                messageEditorContext.changeCommunicationPath(
                  {
                    role: "CPO",
                    id: "DE*ABC",
                  },
                  {
                    role: "Everest",
                    name: "Everest",
                  }
                );
                setShowMenu(false);
                setTimeout(() => {
                  if (
                    messageEditorContext.widgetRef &&
                    messageEditorContext.widgetRef.current
                  ) {
                    messageEditorContext.widgetRef.current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }
                }, 10);
              }}
            >
              Open Everest Message Editor
            </Menu.Item>
          </Tooltip>
        </>
      ),
    },
  };
  return (
    <HeaderBodyNodeComponent {...headerBodyNodeProps}></HeaderBodyNodeComponent>
  );
}

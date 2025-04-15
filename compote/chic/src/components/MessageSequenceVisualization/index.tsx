"use client";

import { ArchivedProtocolMessage, WidgetComponentProps } from "@/types";
import {
  generateMermaidSequenceDiagram,
  getCustomStyles,
  mermaidDirective,
  scrollAreaOptions,
  widgetProps,
} from "@/utils";
import { MermaidDiagram } from "@lightenna/react-mermaid-diagram";
import {
  Button,
  Center,
  Divider,
  Grid,
  Group,
  JsonInput,
  Loader,
  Paper,
  Stack,
  Table,
  Title,
  Tooltip,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconDetails,
  IconDetailsOff,
  IconLayoutCards,
  IconLayoutList,
} from "@tabler/icons-react";
import { useState } from "react";
import classes from "./MessageSequenceVisualization.module.css";
import CloseButton from "../CloseButton";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import { usePathname } from "next/navigation";
import { useMessageEditor } from "../MessageEditor/MessageEditorProvider";
import InputWrapperScrollArea from "../InputWrapperScrollArea";

export const messageSequenceVisualizationWidgetId = "message-sequence-vis";

interface MessageSequenceVisualizationProps extends WidgetComponentProps {
  includeMessageEditor: boolean; // Determines whether messages from the message editor are included
  messages?: ArchivedProtocolMessage[];
}

type MessageSequenceVisualizationLayout = "horizontal" | "vertical";

export default function MessageSequenceVisualization({
  messages,
  mt,
  withCloseButton,
  includeMessageEditor,
}: MessageSequenceVisualizationProps) {
  const pathname = usePathname();
  const { isWidgetSelected } = useWidgetSelection();
  const updateActiveWidget = useUpdateActiveWidget();
  const messageEditorContext = useMessageEditor();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, iconSize } = getCustomStyles(
    theme,
    colorScheme
  );

  // State
  const [layout, setLayout] =
    useState<MessageSequenceVisualizationLayout>("horizontal");
  const [diagramWithDetails, setDiagramWithDetails] = useState<boolean>(false);

  // Helpers
  const messagesMessageEditor =
    messageEditorContext !== null ? messageEditorContext.messageHistory : [];
  const allMessages: ArchivedProtocolMessage[] = !includeMessageEditor
    ? messages || []
    : [...(messages || []), ...messagesMessageEditor];
  const table = (
    <Table bg={transparentBackground} withTableBorder highlightOnHover>
      <Table.Thead>
        <Table.Tr style={{ whiteSpace: "nowrap" }}>
          <Table.Th w={30}></Table.Th>
          <Table.Th w={30}>Key</Table.Th>
          <Table.Th w={50}>Protocol</Table.Th>
          <Table.Th w={125}>Message</Table.Th>
          <Table.Th>Message Data</Table.Th>
          <Table.Th w={50}>Status</Table.Th>
          <Table.Th>Response Data</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {allMessages.map((message, i) => (
          <Table.Tr key={i}>
            <Table.Td>
              {message.response.ok ? (
                <IconCircleCheckFilled
                  color={theme.colors.teal[6]}
                  size={iconSize}
                  style={{ display: "block", margin: "auto" }}
                />
              ) : (
                <IconAlertTriangleFilled
                  color="red"
                  size={iconSize}
                  style={{ display: "block", margin: "auto" }}
                />
              )}
            </Table.Td>
            <Table.Td>{i}</Table.Td>
            <Table.Td>{message.protocol}</Table.Td>
            <Table.Td>{message.request.name}</Table.Td>
            <Table.Td>
              <InputWrapperScrollArea label="" mah={300}>
                <JsonInput
                  onChange={() => {}}
                  value={JSON.stringify(message.request.messageData, null, 2)}
                  minRows={1}
                  autosize
                  formatOnBlur
                  variant="unstyled"
                />
              </InputWrapperScrollArea>
              {/* {JSON.stringify(message.request.messageData, null, 2)} */}
            </Table.Td>
            <Table.Td>{message.response.status}</Table.Td>
            <Table.Td>
              <InputWrapperScrollArea label="" mah={300}>
                {message.response.data ? (
                  <JsonInput
                    onChange={() => {}}
                    value={JSON.stringify(message.response.data, null, 2)}
                    minRows={1}
                    autosize
                    formatOnBlur
                    variant="unstyled"
                  />
                ) : (
                  message.response.message
                )}
              </InputWrapperScrollArea>
              {/* {message.response.message} */}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
  const diagram = (
    <Tooltip label={`Click to ${diagramWithDetails ? "hide" : "show"} details`}>
      <Paper
        withBorder
        shadow="0"
        className={classes.pointer}
        onClick={() => {
          setDiagramWithDetails(!diagramWithDetails);
        }}
        pos="relative"
      >
        {diagramWithDetails ? (
          <IconDetails className={classes.detailsIcon} size={iconSize} />
        ) : (
          <IconDetailsOff className={classes.detailsIcon} size={iconSize} />
        )}
        <MermaidDiagram className={classes.sequenceDiagram}>
          {`
                      ${mermaidDirective(colorScheme)}
                      ${generateMermaidSequenceDiagram(
                        allMessages,
                        diagramWithDetails,
                        theme,
                        colorScheme
                      )}
                    `}
        </MermaidDiagram>
      </Paper>
    </Tooltip>
  );

  return (
    <Transition
      mounted={isWidgetSelected(pathname, messageSequenceVisualizationWidgetId)}
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
          {...widgetProps(
            updateActiveWidget,
            messageSequenceVisualizationWidgetId
          )}
          style={transitionStyle}
        >
          {false ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <>
              {withCloseButton !== false && (
                <CloseButton widgetId={messageSequenceVisualizationWidgetId} />
              )}
              <Group justify="space-between">
                <Group gap="xs" wrap="nowrap">
                  <Title order={1} size="h3" lineClamp={1}>
                    Message Sequence Visualization
                    {/* TODO specify what visualization is for in its context */}
                  </Title>
                  {/* Badges */}
                </Group>
                <Group gap="xs" wrap="nowrap">
                  <Button
                    onClick={() => {
                      setLayout(
                        layout === "horizontal" ? "vertical" : "horizontal"
                      );
                      // Hacky solution to force rerender of diagram
                      setDiagramWithDetails(!diagramWithDetails);
                      setTimeout(() => {
                        setDiagramWithDetails(diagramWithDetails);
                      }, 0);
                    }}
                    variant="default"
                    leftSection={
                      layout === "horizontal" ? (
                        <IconLayoutList size={iconSize} />
                      ) : (
                        <IconLayoutCards size={iconSize} />
                      )
                    }
                  >
                    {layout === "horizontal" ? "Vertical" : "Horizontal"} Layout
                  </Button>
                  {/* Buttons */}
                </Group>
              </Group>
              <Divider my="md" />
              {layout === "vertical" && (
                <Stack align="stretch" justify="flex-start" gap="md">
                  {table}
                  {diagram}
                </Stack>
              )}
              {layout === "horizontal" && (
                <Grid mt="0">
                  <Grid.Col span={5}>
                    <Table.ScrollContainer
                      minWidth={1200}
                      type="scrollarea"
                      {...scrollAreaOptions}
                    >
                      {table}
                    </Table.ScrollContainer>
                  </Grid.Col>
                  <Grid.Col span={7}>{diagram}</Grid.Col>
                </Grid>
              )}
            </>
          )}
        </Paper>
      )}
    </Transition>
  );
}

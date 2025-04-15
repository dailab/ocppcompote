"use client";

import {
  ProtocolMessage,
  ProtocolMessageResponse,
  WidgetComponentProps,
} from "@/types";
import {
  compatibleProtocolSpecificationExists,
  emptyObjectStateCallback,
  getCustomStyles,
  ISO15118SchemaKeys,
  ISO15118Schemas,
  isSameProtocol,
  mqtt,
  ocppV16,
  ocppV201,
  oicpV23,
  protocols,
  renderers,
  scrollAreaProps,
  transitionDurations,
  uniqueProtocolString,
  widgetProps,
} from "@/utils";
import { JsonForms } from "@jsonforms/react";
import { vanillaCells } from "@jsonforms/vanilla-renderers";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  Flex,
  Grid,
  Group,
  JsonInput,
  Loader,
  Notification,
  Paper,
  ScrollArea,
  Select,
  Text,
  Title,
  Tooltip,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconArticle,
  IconArticleOff,
  IconCheck,
  IconId,
  IconIdOff,
  IconInfoTriangle,
} from "@tabler/icons-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./MessageEditor.module.css";
import CloseButton from "../CloseButton";
import InputWrapperScrollArea from "../InputWrapperScrollArea";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import { usePathname } from "next/navigation";
import { useApiClients } from "../ApiClientsProvider";
import { AxiosError, AxiosResponse } from "axios";
import { useMessageEditor } from "./MessageEditorProvider";
import { useUser } from "../UserProvider";

// const ISO15118Context = React.createContext<boolean>(false);
// export const useISO15118 = () => useContext(ISO15118Context);
const formOptionsContext = React.createContext<{
  withDescriptions: boolean;
  isSelectedIso15118: boolean;
}>({
  withDescriptions: false,
  isSelectedIso15118: false,
});
export const useFormOptions = () => useContext(formOptionsContext);

export const messageEditorWidgetId = "message-editor";

interface MessageEditorProps extends WidgetComponentProps {}

export default function MessageEditor({
  mt,
  withCloseButton,
}: MessageEditorProps) {
  const {
    empmsClientApi,
    csmsOcppV16Api,
    csmsOcppV201Api,
    csmsOicpApi,
    everestMqttApi,
  } = useApiClients();
  const { isWidgetSelected } = useWidgetSelection();
  const pathname = usePathname();
  const updateActiveWidget = useUpdateActiveWidget();
  const messageEditorContext = useMessageEditor();
  const user = useUser();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, iconSize } = getCustomStyles(
    theme,
    colorScheme
  );

  // State
  const [selectedISO15118SchemaKey, setSelectedISO15118SchemaKey] = useState<
    string | null
  >(null);
  const [ISO15118MessageData, setISO15118MessageData] = useState<any>({});
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const [messageResponse, setMessageResponse] =
    useState<ProtocolMessageResponse | null>(null);
  const [isSelectedIso15118, setIsSelectedIso15118] = useState<boolean>(false);
  const [showJsonSchema, setShowJsonSchema] = useState<boolean>(false);
  const [showMessagePreview, setShowMessagePreview] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(true);
  const [displayMessageNames, setDisplayMessageNames] = useState<boolean>(true);
  const [withDescriptions, setWithDescriptions] = useState<boolean>(false);

  // Helpers 2
  const isAllowedCommuncationPath: boolean =
    user && messageEditorContext
      ? user.role.allowedCommunicationPaths.find(
          (c) =>
            messageEditorContext.sender &&
            c.senderRole === messageEditorContext.sender.role &&
            messageEditorContext.recipient &&
            c.recipientRole === messageEditorContext.recipient.role
        ) !== undefined
      : false;
  const getMessageDisplayName: (
    message: ProtocolMessage,
    messageKey: string
  ) => string = (message, messageKey) => {
    if (displayMessageNames) {
      return message.name;
    }
    return messageKey;
  };
  const handleSubmit = async () => {
    if (!messageEditorContext) {
      return;
    }
    const {
      selectedProtocol,
      specification,
      selectedMessage,
      messageData,
      sender,
      recipient,
      addMessageToHistory,
    } = messageEditorContext;
    if (
      !selectedProtocol ||
      !selectedMessage ||
      !specification ||
      !sender ||
      !recipient
    ) {
      return;
    }
    let request: null | void | Promise<AxiosResponse<any, any>> = null;
    if (
      isSameProtocol(selectedProtocol, ocppV16) &&
      specification.senderRole === "CPO" &&
      specification.recipientRole === "CS"
    ) {
      if (!csmsOcppV16Api) {
        setMessageResponse({
          message: "Could not find correct API client",
          ok: false,
        });
        return;
      }
      request = selectedMessage.send(
        csmsOcppV16Api,
        messageData,
        sender,
        recipient
      );
    } else if (
      isSameProtocol(selectedProtocol, ocppV201) &&
      specification.senderRole === "CPO" &&
      specification.recipientRole === "CS"
    ) {
      if (!csmsOcppV201Api) {
        setMessageResponse({
          message: "Could not find correct API client",
          ok: false,
        });
        return;
      }
      request = selectedMessage.send(
        csmsOcppV201Api,
        messageData,
        sender,
        recipient
      );
    } else if (
      isSameProtocol(selectedProtocol, oicpV23) &&
      specification.senderRole === "EMP" &&
      specification.recipientRole === "eRoaming"
    ) {
      if (!empmsClientApi) {
        setMessageResponse({
          message: "Could not find correct API client",
          ok: false,
        });
        return;
      }
      request = selectedMessage.send(
        empmsClientApi,
        messageData,
        sender,
        recipient
      );
    } else if (
      isSameProtocol(selectedProtocol, oicpV23) &&
      specification.senderRole === "CPO" &&
      specification.recipientRole === "eRoaming"
    ) {
      if (!csmsOicpApi) {
        setMessageResponse({
          message: "Could not find correct API client",
          ok: false,
        });
        return;
      }
      request = selectedMessage.send(
        csmsOicpApi,
        messageData,
        sender,
        recipient
      );
    } else if (
      isSameProtocol(selectedProtocol, mqtt) &&
      specification.senderRole === "CPO" &&
      specification.recipientRole === "Everest"
    ) {
      if (!everestMqttApi) {
        setMessageResponse({
          message: "Could not find correct API client",
          ok: false,
        });
        return;
      }
      request = selectedMessage.send(
        everestMqttApi,
        messageData,
        sender,
        recipient
      );
    }
    if (request === null) {
      setMessageResponse({
        message:
          "Communication path not properly implemented in 'MessageEditor'",
        ok: false,
      });
      return;
    } else if (request === undefined) {
      setMessageResponse({
        message:
          "Message could not be sent. Unexpected parameters where passed to the send function.",
        ok: false,
      });
      return;
    }
    setIsLoadingSubmit(true);
    let messageRes: ProtocolMessageResponse = {
      message: "No data",
      ok: false,
    };
    await request
      .then((response: AxiosResponse<any>) => {
        messageRes = {
          ok: true,
          status: response.status,
          message: response.statusText,
          data: response.data,
        };
      })
      .catch((error: AxiosError) => {
        if (error.isAxiosError) {
          messageRes = {
            ok: false,
            status: error.status,
            message: error.response
              ? error.response.statusText
              : "No response message",
            data: error.response ? error.response.data : undefined,
          };
        } else {
          console.log(error);
        }
      });
    setMessageResponse(messageRes);
    setTimeout(() => {
      setMessageResponse(null);
    }, 3000);
    addMessageToHistory(messageRes);
    setIsLoadingSubmit(false);
  };
  const widgetRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    if (messageEditorContext === null) {
      return;
    }
    messageEditorContext.setWidgetRef(widgetRef);
  }, []);

  return (
    <>
      <Transition
        mounted={messageResponse !== null}
        transition="slide-left"
        duration={transitionDurations.short}
        timingFunction="ease"
        keepMounted
      >
        {(transitionStyle) => (
          <Notification
            icon={
              messageResponse && messageResponse.ok ? (
                <IconCheck size={iconSize} visibility={0} />
              ) : (
                <IconAlertTriangle size={iconSize} visibility={0} />
              )
            }
            color={
              messageResponse === null
                ? "transparent"
                : messageResponse.ok
                  ? "teal"
                  : "red"
            }
            title={`Message Reponse${
              messageResponse && messageResponse.status
                ? `: HTTP ${messageResponse.status}`
                : ""
            }`}
            pos="fixed"
            style={{
              ...transitionStyle,
              zIndex: 10,
              right: theme.spacing.md,
              top: theme.spacing.md,
            }}
            onClose={() => {
              setMessageResponse(null);
            }}
            bg={transparentBackground}
          >
            {messageResponse
              ? messageResponse.ok
                ? "Success!"
                : messageResponse.status
                  ? "Something went wrong!"
                  : messageResponse.message
              : ""}
          </Notification>
        )}
      </Transition>
      <Transition
        mounted={isWidgetSelected(pathname, messageEditorWidgetId)}
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
            style={{ ...transitionStyle, scrollMargin: theme.spacing.md }}
            ref={widgetRef}
            {...widgetProps(updateActiveWidget, messageEditorWidgetId)}
          >
            {withCloseButton !== false && (
              <CloseButton widgetId={messageEditorWidgetId} />
            )}
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap">
                <Title order={1} size="h3" lineClamp={1}>
                  Message Editor
                  {messageEditorContext &&
                  messageEditorContext.recipient &&
                  messageEditorContext.recipient.name
                    ? ` for ${messageEditorContext.recipient.name}`
                    : ""}
                </Title>
                {messageEditorContext &&
                  messageEditorContext.selectedProtocol && (
                    <Badge variant="default" visibleFrom="xl">
                      {uniqueProtocolString(
                        messageEditorContext.selectedProtocol
                      )}
                    </Badge>
                  )}
                {!isAllowedCommuncationPath &&
                  user !== undefined &&
                  messageEditorContext &&
                  messageEditorContext.specification !== null && (
                    <Tooltip
                      label={`You${user ? ` (${user.role.name}) ` : " "}are not permitted to send messages on this communication path.`}
                    >
                      <Badge color="red">Unauthorized</Badge>
                    </Tooltip>
                  )}
              </Group>
              <Group gap="xs" wrap="nowrap">
                {messageEditorContext !== null && (
                  <Select
                    value={
                      messageEditorContext.selectedProtocol
                        ? uniqueProtocolString(
                            messageEditorContext.selectedProtocol
                          )
                        : null
                    }
                    data={messageEditorContext.availableProtocols.map((p) =>
                      uniqueProtocolString(p)
                    )}
                    placeholder="Select a protocol"
                    onChange={(value) => {
                      const newProtocol =
                        protocols.find(
                          (p) => uniqueProtocolString(p) === value
                        ) || null;
                      messageEditorContext.setSelectedProtocol(newProtocol);
                      messageEditorContext.setSelectedMessage(null);
                    }}
                  />
                )}
              </Group>
            </Group>
            <Divider my="md" />
            {!messageEditorContext ? (
              <Center>
                <Loader />
              </Center>
            ) : messageEditorContext.sender !== null &&
              messageEditorContext.recipient !== null ? (
              messageEditorContext.selectedProtocol !== null ? (
                messageEditorContext.specification !== null ? (
                  <Grid>
                    <Grid.Col span={6}>
                      <ScrollArea flex={1} {...scrollAreaProps}>
                        <Flex
                          justify="flex-start"
                          align="center"
                          gap="xs"
                          h="auto"
                        >
                          <Chip
                            checked={showDescription}
                            disabled={
                              !messageEditorContext.selectedMessage ||
                              !messageEditorContext.selectedMessage.schema
                                .description
                            }
                            onChange={() =>
                              setShowDescription(!showDescription)
                            }
                            variant="outline"
                          >
                            Description
                          </Chip>
                          <Chip
                            disabled={!messageEditorContext.selectedMessage}
                            checked={showJsonSchema}
                            onChange={() => setShowJsonSchema(!showJsonSchema)}
                            variant="outline"
                          >
                            JSON Schema
                          </Chip>
                          <Chip
                            checked={showMessagePreview}
                            onChange={() =>
                              setShowMessagePreview(!showMessagePreview)
                            }
                            variant="outline"
                          >
                            Message Preview
                          </Chip>
                        </Flex>
                      </ScrollArea>
                      <Flex gap="xs" mt="md">
                        <Select
                          placeholder="Select a message"
                          data={Object.keys(
                            messageEditorContext.specification.providedMessages
                          ).map((value) => ({
                            value,
                            label: getMessageDisplayName(
                              messageEditorContext.specification
                                .providedMessages[value],
                              value
                            ),
                          }))}
                          value={messageEditorContext.selectedMessageKey}
                          onChange={(newValue) => {
                            messageEditorContext.setSelectedMessage(newValue);
                          }}
                          flex={1}
                          searchable
                        />
                        <Tooltip
                          label={
                            displayMessageNames ? "Show IDs" : "Show Names"
                          }
                        >
                          <ActionIcon
                            variant="default"
                            onClick={() => {
                              setDisplayMessageNames(!displayMessageNames);
                            }}
                            size="input-sm"
                            aria-label="Refresh"
                            hiddenFrom="lg"
                            disabled={!messageEditorContext.selectedMessage}
                          >
                            {displayMessageNames ? (
                              <IconId size={iconSize} />
                            ) : (
                              <IconIdOff size={iconSize} />
                            )}
                          </ActionIcon>
                        </Tooltip>
                        <Button
                          leftSection={
                            displayMessageNames ? (
                              <IconId size={iconSize} />
                            ) : (
                              <IconIdOff size={iconSize} />
                            )
                          }
                          variant="default"
                          onClick={() => {
                            setDisplayMessageNames(!displayMessageNames);
                          }}
                          disabled={!messageEditorContext.selectedMessage}
                          visibleFrom="lg"
                        >
                          {displayMessageNames ? "Show IDs" : "Show Names"}
                        </Button>
                      </Flex>
                      {messageEditorContext.selectedMessageKey !== null &&
                        messageEditorContext.selectedMessage !== null && (
                          <>
                            {messageEditorContext.selectedMessage.schema
                              .description && (
                              <Collapse
                                in={showDescription}
                                transitionDuration={transitionDurations.medium}
                              >
                                <Text mt="md">
                                  {
                                    messageEditorContext.selectedMessage.schema
                                      .description
                                  }
                                </Text>
                              </Collapse>
                            )}
                            <Collapse
                              in={showJsonSchema}
                              transitionDuration={transitionDurations.long}
                            >
                              <InputWrapperScrollArea
                                label={`JSON Schema for "${getMessageDisplayName(messageEditorContext.selectedMessage, messageEditorContext.selectedMessageKey)}"`}
                                mt="md"
                                mah={575}
                              >
                                <JsonInput
                                  onChange={() => {}}
                                  value={JSON.stringify(
                                    messageEditorContext.selectedMessage.schema,
                                    null,
                                    2
                                  )}
                                  minRows={4}
                                  autosize
                                  formatOnBlur
                                  variant="unstyled"
                                />
                              </InputWrapperScrollArea>
                            </Collapse>
                          </>
                        )}
                    </Grid.Col>
                    <Grid.Col span={6}>
                      {messageEditorContext.selectedMessageKey !== null &&
                        messageEditorContext.selectedMessage &&
                        messageEditorContext.selectedMessage.schema
                          .properties &&
                        Object.keys(
                          messageEditorContext.selectedMessage.schema.properties
                        ).length > 0 && (
                          <Paper
                            withBorder
                            shadow="0"
                            bg={transparentBackground}
                            mb="md"
                            className={classes.jsonFormsPaper}
                          >
                            <Group justify="space-between" wrap="nowrap" m="md">
                              <Title order={2} size="h4" lineClamp={1}>
                                Form
                                {` "${getMessageDisplayName(
                                  messageEditorContext.selectedMessage,
                                  messageEditorContext.selectedMessageKey
                                )}"`}
                              </Title>
                              <Group gap="xs" wrap="nowrap">
                                <Button
                                  onClick={() => {
                                    setWithDescriptions(!withDescriptions);
                                  }}
                                  variant="default"
                                  leftSection={
                                    withDescriptions ? (
                                      <IconArticleOff size={iconSize} />
                                    ) : (
                                      <IconArticle size={iconSize} />
                                    )
                                  }
                                >
                                  {`${withDescriptions ? "Hide" : "Show"} Descriptions`}
                                </Button>
                                {/* Buttons */}
                              </Group>
                            </Group>
                            <Divider m="md" />
                            <formOptionsContext.Provider
                              value={{ withDescriptions, isSelectedIso15118 }}
                            >
                              <Box style={{ display: "flex" }}>
                                <ScrollArea
                                  mah={575}
                                  {...scrollAreaProps}
                                  flex={1}
                                >
                                  <Box mb="md" mx="md">
                                    <JsonForms
                                      schema={{
                                        ...messageEditorContext.selectedMessage
                                          .schema,
                                        $schema: undefined,
                                      }}
                                      data={messageEditorContext.messageData}
                                      renderers={renderers}
                                      cells={vanillaCells}
                                      onChange={({ data }) => {
                                        messageEditorContext.setMessageData(
                                          data
                                        );
                                      }}
                                      validationMode="NoValidation"
                                    />
                                    {isSameProtocol(
                                      messageEditorContext.selectedProtocol,
                                      ocppV16
                                    ) &&
                                      messageEditorContext.selectedMessageKey ===
                                        "datatransfer" && (
                                        <>
                                          <Checkbox
                                            checked={isSelectedIso15118}
                                            onChange={(event) =>
                                              setIsSelectedIso15118(
                                                event.currentTarget.checked
                                              )
                                            }
                                            label="ISO15118 Message"
                                            mt="md"
                                            size="sm"
                                          />
                                          {isSelectedIso15118 && (
                                            <>
                                              <Select
                                                data={ISO15118SchemaKeys}
                                                value={
                                                  selectedISO15118SchemaKey
                                                }
                                                onChange={(newValue) => {
                                                  setISO15118MessageData(
                                                    emptyObjectStateCallback
                                                  );
                                                  setSelectedISO15118SchemaKey(
                                                    newValue
                                                  );
                                                }}
                                                required
                                                placeholder="Select an ISO15118 Message"
                                                mt="xs"
                                              />
                                              {selectedISO15118SchemaKey !==
                                                null && (
                                                <JsonForms
                                                  schema={{
                                                    ...ISO15118Schemas[
                                                      selectedISO15118SchemaKey
                                                    ],
                                                    $schema: undefined,
                                                  }}
                                                  data={ISO15118MessageData}
                                                  renderers={renderers}
                                                  cells={vanillaCells}
                                                  onChange={({ data }) => {
                                                    setISO15118MessageData(
                                                      data
                                                    );
                                                    messageEditorContext.setMessageData(
                                                      (prev: any) => ({
                                                        ...prev,
                                                        data: JSON.stringify(
                                                          data
                                                        ),
                                                      })
                                                    );
                                                  }}
                                                />
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                  </Box>
                                </ScrollArea>
                              </Box>
                            </formOptionsContext.Provider>
                          </Paper>
                        )}
                      <Collapse
                        in={showMessagePreview}
                        transitionDuration={transitionDurations.medium}
                      >
                        <InputWrapperScrollArea
                          label="Message Preview"
                          my="md"
                          mah={575}
                        >
                          <JsonInput
                            onChange={() => {}}
                            value={JSON.stringify(
                              messageEditorContext.messageData,
                              null,
                              2
                            )}
                            minRows={1}
                            autosize
                            formatOnBlur
                            variant="unstyled"
                          />
                        </InputWrapperScrollArea>
                      </Collapse>
                      <Group justify="right">
                        <Button
                          onClick={handleSubmit}
                          disabled={
                            !messageEditorContext.selectedMessage ||
                            (!isAllowedCommuncationPath && user !== undefined)
                          }
                          loading={isLoadingSubmit}
                          px="xl"
                        >
                          Send
                        </Button>
                      </Group>
                    </Grid.Col>
                  </Grid>
                ) : (
                  <Alert
                    variant="outline"
                    color="red"
                    title="Something went wrong"
                    icon={<IconInfoTriangle size={iconSize} />}
                  >
                    Could not find a protocol specification for the
                    communication from {messageEditorContext.sender.role} to{" "}
                    {messageEditorContext.recipient.role} using{" "}
                    {uniqueProtocolString(
                      messageEditorContext.selectedProtocol
                    )}
                    .
                  </Alert>
                )
              ) : (
                <>
                  {compatibleProtocolSpecificationExists(
                    messageEditorContext.sender.role,
                    messageEditorContext.recipient.role
                  ) ? (
                    <Text>Please select a protocol.</Text>
                  ) : (
                    <Alert
                      variant="outline"
                      color="red"
                      title="Something went wrong"
                      icon={<IconInfoTriangle size={iconSize} />}
                    >
                      Could not find a protocol specification for the
                      communication from {messageEditorContext.sender.role} to{" "}
                      {messageEditorContext.recipient.role} using any of the
                      specified protocols{" "}
                      {`(${protocols.map((p) => uniqueProtocolString(p)).join(", ")})`}
                      .
                    </Alert>
                  )}
                </>
              )
            ) : (
              <Text>Please specify sender and recipient.</Text>
            )}
          </Paper>
        )}
      </Transition>
    </>
  );
}

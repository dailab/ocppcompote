"use client";

import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ArchivedProtocolMessage,
  MessageRecipient,
  MessageSender,
  Protocol,
  ProtocolMessage,
  ProtocolMessageResponse,
  ProtocolSelectionAid,
  ProtocolSpecification,
} from "@/types";
import {
  emptyObjectStateCallback,
  getAvailableProtocols,
  getDefaultProtocol,
  protocols,
  uniqueProtocolString,
} from "@/utils";

const messageEditorContext = React.createContext<{
  sender: MessageSender | null;
  recipient: MessageRecipient | null;
  selectedProtocol: Protocol | null;
  setSelectedProtocol: Dispatch<SetStateAction<Protocol | null>>;
  availableProtocols: Protocol[];
  messageData: any;
  setMessageData: Dispatch<SetStateAction<any>>;
  selectedMessage: ProtocolMessage | null;
  setSelectedMessage: (
    messageKey: string | null,
    defaultValuesCallback?: (
      sender: MessageSender,
      recipient: MessageRecipient
    ) => { [index: string]: any }
  ) => void;
  specification: ProtocolSpecification | null;
  selectedMessageKey: string | null;
  messageHistory: ArchivedProtocolMessage[];
  addMessageToHistory: (response: ProtocolMessageResponse) => void;
  widgetRef: React.RefObject<HTMLDivElement> | null;
  setWidgetRef: Dispatch<
    SetStateAction<React.RefObject<HTMLDivElement> | null>
  >;
  changeCommunicationPath: (
    newSender: MessageSender | null,
    newRecipient: MessageRecipient | null
  ) => void;
} | null>(null);

export const useMessageEditor = () => {
  return useContext(messageEditorContext);
};

interface MessageEditorProviderProps {
  children: React.ReactNode;
  initialSender?: MessageSender;
  initialRecipient?: MessageRecipient;
  protocolSelectionAids?: ProtocolSelectionAid[];
  setExternalMessageHistory?: Dispatch<
    SetStateAction<ArchivedProtocolMessage[]>
  >;
  onCommunicationPathChange?: (
    newSender: MessageSender | null,
    newRecipient: MessageRecipient | null
  ) => void;
}

export function MessageEditorProvider({
  children,
  initialSender,
  initialRecipient,
  protocolSelectionAids,
  setExternalMessageHistory,
  onCommunicationPathChange,
}: MessageEditorProviderProps) {
  // Helpers 1
  const initialProtocolSelectionAid: ProtocolSelectionAid | null =
    !protocolSelectionAids || !initialSender || !initialRecipient
      ? null
      : protocolSelectionAids.find(
          (a) =>
            a.communicationPath.senderRole === initialSender.role &&
            a.communicationPath.recipientRole === initialRecipient.role
        ) || null;

  // State
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(
    initialProtocolSelectionAid
      ? getDefaultProtocol(initialProtocolSelectionAid)
      : null
  );
  const [messageData, setMessageData] = useState<any>({});
  const [selectedMessageKey, setSelectedMessageKey] = useState<string | null>(
    null
  );
  const [messageHistory, setMessageHistory] = useState<
    ArchivedProtocolMessage[]
  >([]);
  const [widgetRef, setWidgetRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);
  const [sender, setSender] = useState<MessageSender | null>(
    initialSender || null
  );
  const [recipient, setRecipient] = useState<MessageRecipient | null>(
    initialRecipient || null
  );

  // Helpers 2
  const protocolSelectionAid: ProtocolSelectionAid | null =
    !protocolSelectionAids || !sender || !recipient
      ? null
      : protocolSelectionAids.find(
          (a) =>
            a.communicationPath.senderRole === sender.role &&
            a.communicationPath.recipientRole === recipient.role
        ) || null;
  const availableProtocols: Protocol[] = protocolSelectionAid
    ? getAvailableProtocols(protocolSelectionAid)
    : protocols;
  const accumulatedDefaultValuesCallback = (
    prev: any,
    defaultValuesCallbacks: ((
      sender: MessageSender,
      recipient: MessageRecipient
    ) => { [index: string]: any })[]
  ) => {
    if (!sender || !recipient) {
      return {};
    }
    const accumulatedDefaultValues = defaultValuesCallbacks.reduce(
      (t, callback) => {
        if (!callback) {
          return t;
        }
        return { ...t, ...callback(sender, recipient) };
      },
      {}
    );
    return { ...prev, ...accumulatedDefaultValues };
  };
  const specification: ProtocolSpecification | null =
    selectedProtocol !== null && recipient !== null && sender !== null
      ? selectedProtocol.specifications.find(
          (s) =>
            s.recipientRole === recipient.role && s.senderRole === sender.role
        ) || null
      : null;
  const selectedMessage: ProtocolMessage | null =
    specification && selectedMessageKey
      ? specification.providedMessages[selectedMessageKey]
      : null;
  const setSelectedMessage: (
    messageKey: string | null,
    defaultValuesCallback?: (
      sender: MessageSender,
      recipient: MessageRecipient
    ) => { [index: string]: any }
  ) => void = (messageKey, defaultValuesCallback) => {
    const message: ProtocolMessage | null =
      specification && messageKey
        ? specification.providedMessages[messageKey]
        : null;
    if (message !== null) {
      setMessageData((prev: any) =>
        accumulatedDefaultValuesCallback(emptyObjectStateCallback(prev), [
          message.defaultValuesCallback || (() => ({})),
          defaultValuesCallback || (() => ({})),
        ])
      );
    } else {
      setMessageData(emptyObjectStateCallback);
    }
    setSelectedMessageKey(messageKey);
  };
  const addMessageToHistory: (response: ProtocolMessageResponse) => void = (
    response
  ) => {
    if (!selectedMessage || !selectedProtocol || !sender || !recipient) {
      return;
    }
    const newMessage = {
      protocol: uniqueProtocolString(selectedProtocol),
      request: { ...selectedMessage, messageData },
      response,
      recipient,
      sender,
    };
    setMessageHistory((prev) => [...prev, newMessage]);
    if (setExternalMessageHistory !== undefined) {
      setExternalMessageHistory((prev) => [...prev, newMessage]);
    }
  };
  const changeCommunicationPath: (
    newSender: MessageSender | null,
    newRecipient: MessageRecipient | null
  ) => void = (newSender, newRecipient) => {
    const newProtocolSelectionAid =
      !protocolSelectionAids || !newSender || !newRecipient
        ? null
        : protocolSelectionAids.find(
            (a) =>
              a.communicationPath.senderRole === newSender.role &&
              a.communicationPath.recipientRole === newRecipient.role
          ) || null;
    setSender(newSender);
    setRecipient(newRecipient);
    setSelectedProtocol(
      newProtocolSelectionAid
        ? getDefaultProtocol(newProtocolSelectionAid)
        : null
    );
    setSelectedMessage(null);
    if (onCommunicationPathChange) {
      onCommunicationPathChange(newSender, newRecipient);
    }
  };

  // Effects
  const initialCommuncationPathDependency = [
    initialSender
      ? `${initialSender.role},${String(initialSender.id)},${String(initialSender.name)}`
      : "null",
    initialRecipient
      ? `${initialRecipient.role},${String(initialRecipient.id)},${String(initialRecipient.name)}`
      : "null",
  ].join(";");
  useEffect(() => {
    changeCommunicationPath(initialSender || null, initialRecipient || null);
  }, [initialCommuncationPathDependency]);

  return (
    <messageEditorContext.Provider
      value={{
        sender,
        recipient,
        selectedProtocol,
        setSelectedProtocol,
        availableProtocols,
        messageData,
        setMessageData,
        setSelectedMessage,
        selectedMessage,
        specification,
        selectedMessageKey,
        messageHistory,
        addMessageToHistory,
        widgetRef,
        setWidgetRef,
        changeCommunicationPath,
      }}
    >
      {children}
    </messageEditorContext.Provider>
  );
}

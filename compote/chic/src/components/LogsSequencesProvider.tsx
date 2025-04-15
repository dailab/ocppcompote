"use client";

import { LogConstraint, LogsSequence } from "@/types";
import { isValidLogConstraints } from "@/utils";
import React, { useState, useContext } from "react";
import ShortUniqueId from "short-unique-id";

const LogsSequencesContext = React.createContext<LogsSequence[]>([]);
const LogsSequencesConfigurationContext = React.createContext<{
  addLogsSequence: (logConstraints: LogConstraint[][]) => void;
  updateLogsSequence: (updatedSequence: LogsSequence) => void;
  removeLogsSequence: (id: string) => void;
}>({
  addLogsSequence: () => {},
  updateLogsSequence: () => {},
  removeLogsSequence: () => {},
});

export const useLogsSequences = () => {
  return useContext(LogsSequencesContext);
};
export const useLogsSequencesConfiguration = () => {
  return useContext(LogsSequencesConfigurationContext);
};

export function LogsSequencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const uid = new ShortUniqueId({ length: 16 });
  const [sequences, setSequences] = useState<LogsSequence[]>([
    {
      id: "alkjdsakljsfd",
      logConstraints: [
        [{ field: "levelname", operator: "must be equal to", value: "INFO" }],
      ],
    },
  ]);

  const addLogsSequence = (logConstraints: LogConstraint[][]) => {
    if (!isValidLogConstraints(logConstraints)) {
      return;
    }
    setSequences((prev) => [...prev, { id: uid.rnd(), logConstraints }]);
  };
  const updateLogsSequence = (updatedSequence: LogsSequence) => {
    const oldSequence = sequences.find((s) => s.id === updatedSequence.id);
    if (!oldSequence) {
      return;
    }
    if (!isValidLogConstraints(updatedSequence.logConstraints)) {
      return;
    }
    setSequences((prev) => [
      ...prev.filter((s) => s.id === updatedSequence.id),
      updatedSequence,
    ]);
  };
  const removeLogsSequence = (id: string) => {
    setSequences((prev) => [...prev.filter((s) => s.id === id)]);
  };

  return (
    <LogsSequencesContext.Provider value={sequences}>
      <LogsSequencesConfigurationContext.Provider
        value={{ addLogsSequence, updateLogsSequence, removeLogsSequence }}
      >
        {children}
      </LogsSequencesConfigurationContext.Provider>
    </LogsSequencesContext.Provider>
  );
}

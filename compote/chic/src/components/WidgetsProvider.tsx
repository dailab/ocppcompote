"use client";

import { WidgetConfiguration } from "@/types";
import React, { useState, useContext } from "react";

const ActiveWidgetContext = React.createContext<string | null>(null);
const UpdateActiveWidgetContext = React.createContext<Function>(() => {});
const WidgetsContext = React.createContext<{
  [index: string]: { [index: string]: { name: string; selected: boolean } };
}>({});
const WidgetRegistrationContext = React.createContext<{
  registerWidget: (pageId: string, widget: WidgetConfiguration) => void;
  registerPage: (pageId: string, initialWidgets: WidgetConfiguration[]) => void;
  isWidgetRegistered: (pageId: string, widgetId: string) => boolean;
  isPageRegistered: (pageId: string) => boolean;
}>({
  registerWidget: () => {},
  registerPage: () => {},
  isWidgetRegistered: () => false,
  isPageRegistered: () => false,
});
const WidgetSelectionContext = React.createContext<{
  updateWidgetSelection: (
    pageId: string,
    widgetId: string,
    value: boolean
  ) => void;
  updateWidgetSelectionBulk: (
    pageId: string,
    selectedWidgetIds: string[]
  ) => void;
  isWidgetSelected: (pageId: string, widgetId: string) => boolean;
}>({
  updateWidgetSelection: () => {},
  updateWidgetSelectionBulk: () => {},
  isWidgetSelected: () => false,
});

export const useActiveWidget = () => {
  return useContext(ActiveWidgetContext);
};
export const useUpdateActiveWidget = () => {
  return useContext(UpdateActiveWidgetContext);
};
export const useWidgets = () => {
  return useContext(WidgetsContext);
};
export const useWidgetRegistration = () => {
  return useContext(WidgetRegistrationContext);
};
export const useWidgetSelection = () => {
  return useContext(WidgetSelectionContext);
};

export function WidgetsProvider({ children }: { children: React.ReactNode }) {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<{
    [index: string]: { [index: string]: { name: string; selected: boolean } };
  }>({});

  const updateActiveWidget = (widgetId: string | null) => {
    setActiveWidget(widgetId);
  };
  const updateWidgetSelection = (
    pageId: string,
    widgetId: string,
    value: boolean
  ) => {
    if (!widgets[pageId]) {
      console.error(
        `Cannot change selection of widget in page ${pageId}. Because this page does exist.`
      );
      return;
    }
    if (!widgets[pageId][widgetId]) {
      console.error(
        `Cannot change selection of widget ${widgetId}. Because this widget does not exist on page ${pageId}.`
      );
      return;
    }
    setWidgets({
      ...widgets,
      [pageId]: {
        ...widgets[pageId],
        [widgetId]: { ...widgets[pageId][widgetId], selected: value },
      },
    });
  };
  const updateWidgetSelectionBulk = (
    pageId: string,
    selectedWidgetIds: string[]
  ) => {
    if (!widgets[pageId]) {
      console.error(
        `Cannot change selection of widget in page ${pageId}. Because this page does exist.`
      );
      return;
    }
    const updatedPage = widgets[pageId];
    for (let widgetId of Object.keys(updatedPage)) {
      updatedPage[widgetId] = {
        ...updatedPage[widgetId],
        selected: selectedWidgetIds.includes(widgetId),
      };
    }
    setWidgets({
      ...widgets,
      [pageId]: updatedPage,
    });
  };
  const registerWidget = (pageId: string, widget: WidgetConfiguration) => {
    if (!widgets[pageId]) {
      console.error(
        `Cannot register widget in page ${pageId}. Because this page does exist. Try registering the page first.`
      );
      return;
    }
    setWidgets((prev) => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [widget.widgetId]: {
          name: widget.name,
          selected:
            widget.initialValue === undefined ? true : widget.initialValue,
        },
      },
    }));
  };
  const registerPage = (
    pageId: string,
    initialWidgets: { widgetId: string; name: string; initialValue?: boolean }[]
  ) => {
    setWidgets({
      ...widgets,
      [pageId]: initialWidgets.reduce((t, w) => {
        return {
          ...t,
          [w.widgetId]: {
            name: w.name,
            selected: w.initialValue === undefined ? true : w.initialValue,
          },
        };
      }, {}),
    });
  };
  const isWidgetRegistered = (pageId: string, widgetId: string) => {
    if (!widgets[pageId]) {
      return false;
    }
    if (!widgets[pageId][widgetId]) {
      return false;
    }
    return true;
  };
  const isPageRegistered = (pageId: string) => {
    if (!widgets[pageId]) {
      return false;
    }
    return true;
  };
  const isWidgetSelected = (pageId: string, widgetId: string) => {
    if (!isWidgetRegistered(pageId, widgetId)) {
      return false;
    }
    return widgets[pageId][widgetId].selected;
  };

  return (
    <ActiveWidgetContext.Provider value={activeWidget}>
      <UpdateActiveWidgetContext.Provider value={updateActiveWidget}>
        <WidgetsContext.Provider value={widgets}>
          <WidgetSelectionContext.Provider
            value={{
              updateWidgetSelection,
              updateWidgetSelectionBulk,
              isWidgetSelected,
            }}
          >
            <WidgetRegistrationContext.Provider
              value={{
                registerWidget,
                registerPage,
                isWidgetRegistered,
                isPageRegistered,
              }}
            >
              {children}
            </WidgetRegistrationContext.Provider>
          </WidgetSelectionContext.Provider>
        </WidgetsContext.Provider>
      </UpdateActiveWidgetContext.Provider>
    </ActiveWidgetContext.Provider>
  );
}

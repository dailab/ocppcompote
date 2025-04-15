"use client";

import IframeWidget from "@/components/IframeWidget";
import WidgetSelectionHeader from "@/components/WidgetSelectionHeader";
import { useWidgetRegistration } from "@/components/WidgetsProvider";

import { WidgetConfiguration } from "@/types";
import { defaultContainerSize, getIframeWidgetId } from "@/utils";
import { Container } from "@mantine/core";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DocumentationEmpApis() {
  const iframeWidgetPropsEmpms = {
    url: `${process.env.NEXT_PUBLIC_EMPMS_OICP}/docs`,
  };
  const iframeWidgetPropsEmpTestToolkit = {
    url: `${process.env.NEXT_PUBLIC_EMP_TEST_TOOLKIT}/docs`,
  };
  const iframeWidgetPropsEmpPnc = {
    url: `${process.env.NEXT_PUBLIC_EMPMS_PNC}/docs`,
  };
  const iframeWidgetPropsEroamingMock = {
    url: `${process.env.NEXT_PUBLIC_EROAMING_OICP}/docs`,
  };
  const initialWidgets: WidgetConfiguration[] = [
    { widgetId: getIframeWidgetId(iframeWidgetPropsEmpms), name: "EMPMS" },
    {
      widgetId: getIframeWidgetId(iframeWidgetPropsEmpTestToolkit),
      name: "EMP Test Toolkit",
    },
    { widgetId: getIframeWidgetId(iframeWidgetPropsEmpPnc), name: "EMP PNC" },
    {
      widgetId: getIframeWidgetId(iframeWidgetPropsEroamingMock),
      name: "eRoaming Mock",
    },
  ];
  const pathname = usePathname();
  const { registerPage, isPageRegistered } = useWidgetRegistration();

  // Effects
  useEffect(() => {
    if (!isPageRegistered(pathname)) {
      registerPage(pathname, initialWidgets);
    }
  }, []);

  return (
    <Container size={defaultContainerSize} pt="md">
      <WidgetSelectionHeader title="Documentation for EMP-related APIs" />
      <IframeWidget mt="md" {...iframeWidgetPropsEmpms} />
      <IframeWidget mt="md" {...iframeWidgetPropsEmpTestToolkit} />
      <IframeWidget mt="md" {...iframeWidgetPropsEmpPnc} />
      <IframeWidget mt="md" {...iframeWidgetPropsEroamingMock} />
    </Container>
  );
}

"use client";

import IframeWidget from "@/components/IframeWidget";
import WidgetSelectionHeader from "@/components/WidgetSelectionHeader";
import { useWidgetRegistration } from "@/components/WidgetsProvider";
import { WidgetConfiguration } from "@/types";
import { defaultContainerSize, getIframeWidgetId } from "@/utils";
import { Container } from "@mantine/core";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DocumentationCpoApis() {
  const iframeWidgetPropsCsms = {
    url: `${process.env.NEXT_PUBLIC_CSMS_OCPP}/docs`,
  };
  const iframeWidgetPropsCsmsOicp = {
    url: `${process.env.NEXT_PUBLIC_CSMS_OICP}/docs`,
  };
  const iframeWidgetPropsCsmsPnc = {
    url: `${process.env.NEXT_PUBLIC_CSMS_PNC}/docs`,
  };
  const iframeWidgetPropsCsEverestMqtt = {
    url: `${process.env.NEXT_PUBLIC_CS_EVEREST_MQTT}/docs`,
  };
  const iframeWidgetPropsEroamingMock = {
    url: `${process.env.NEXT_PUBLIC_EROAMING_OICP}/docs`,
  };
  const initialWidgets: WidgetConfiguration[] = [
    { widgetId: getIframeWidgetId(iframeWidgetPropsCsms), name: "CSMS" },
    { widgetId: getIframeWidgetId(iframeWidgetPropsCsmsPnc), name: "CSMS PNC" },
    {
      widgetId: getIframeWidgetId(iframeWidgetPropsCsmsOicp),
      name: "CSMS OICP",
    },
    {
      widgetId: getIframeWidgetId(iframeWidgetPropsCsEverestMqtt),
      name: "CS Everest MQTT",
    },
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
      <WidgetSelectionHeader title="Documentation for CPO-related APIs" />
      <IframeWidget mt="md" {...iframeWidgetPropsCsms} />
      <IframeWidget mt="md" {...iframeWidgetPropsCsmsOicp} />
      <IframeWidget mt="md" {...iframeWidgetPropsCsmsPnc} />
      <IframeWidget mt="md" {...iframeWidgetPropsCsEverestMqtt} />
      <IframeWidget mt="md" {...iframeWidgetPropsEroamingMock} />
    </Container>
  );
}

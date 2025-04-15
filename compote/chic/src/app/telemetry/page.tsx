"use client";

import IframeWidget from "@/components/IframeWidget";
import WidgetSelectionHeader from "@/components/WidgetSelectionHeader";
import { useWidgetRegistration } from "@/components/WidgetsProvider";
import { WidgetConfiguration } from "@/types";
import { defaultContainerSize, getIframeWidgetId } from "@/utils";
import { Container } from "@mantine/core";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Telemetry() {
  const iframeWidgetProps = { url: String(process.env.NEXT_PUBLIC_ZIPKIN) };
  const initialWidgets: WidgetConfiguration[] = [
    { widgetId: getIframeWidgetId(iframeWidgetProps), name: "Zipkin" },
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
      <WidgetSelectionHeader title="Telemetry" />
      <IframeWidget mt="md" {...iframeWidgetProps} />
    </Container>
  );
}

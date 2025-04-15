"use client";

import NavbarSettings, {
  navbarSettingsWidgetId,
} from "@/components/NavbarSettings";
import WidgetSelectionHeader from "@/components/WidgetSelectionHeader";
import { useWidgetRegistration } from "@/components/WidgetsProvider";
import { WidgetConfiguration } from "@/types";
import { defaultContainerSize } from "@/utils";
import { Container } from "@mantine/core";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Settings() {
  const initialWidgets: WidgetConfiguration[] = [
    { widgetId: navbarSettingsWidgetId, name: "Navbar Settings" },
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
      <WidgetSelectionHeader title="Settings" />
      <NavbarSettings mt="md" />
    </Container>
  );
}

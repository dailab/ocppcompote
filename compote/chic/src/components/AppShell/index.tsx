"use client";

import {
  AppShell as MantineAppShell,
  Burger,
  rem,
  Group,
  useMantineTheme,
  useMantineColorScheme,
  Paper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NavbarMinimal from "./NavbarMinimal";
import Footer from "./Footer";

export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineAppShell
      header={{ height: 0 }}
      navbar={{
        width: rem("80px"),
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      bg={colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[0]}
    >
      <MantineAppShell.Header withBorder={false}>
        <Group
          p="md"
          bg={
            colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[3]
          }
          hiddenFrom="sm"
        >
          <Burger opened={opened} onClick={toggle} h={20} size={18} />
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar withBorder={false}>
        <NavbarMinimal />
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        <>
          <Paper radius={0} my="md" h={20} hiddenFrom="sm" />
          {children}
          <Footer />
        </>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}

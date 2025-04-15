"use client";

import { WidgetComponentProps } from "@/types";
import { getCustomStyles, pages, widgetProps } from "@/utils";
import {
  Button,
  Center,
  Chip,
  Divider,
  Group,
  Loader,
  Paper,
  Table,
  Text,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconRestore } from "@tabler/icons-react";
import CloseButton from "../CloseButton";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import { usePathname } from "next/navigation";
import {
  defaultNavbarSettings,
  useUpdateUserExperience,
  useUser,
  useUserExperience,
} from "../UserProvider";
import { isAllowedPath } from "@/permissions";

export const navbarSettingsWidgetId = "navbar-settings";

interface NavbarSettingsProps extends WidgetComponentProps {}

export default function NavbarSettings({
  mt,
  withCloseButton,
}: NavbarSettingsProps) {
  const pathname = usePathname();
  const { isWidgetSelected } = useWidgetSelection();
  const updateActiveWidget = useUpdateActiveWidget();
  const user = useUser();
  const userExperience = useUserExperience();
  const updateUserExperience = useUpdateUserExperience();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, iconSize, primaryColor } = getCustomStyles(
    theme,
    colorScheme
  );

  // Helpers
  const allowedPages = pages.filter((p) => isAllowedPath(p.href, user));

  return (
    <Transition
      mounted={isWidgetSelected(pathname, navbarSettingsWidgetId)}
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
          {...widgetProps(updateActiveWidget, navbarSettingsWidgetId)}
          style={transitionStyle}
        >
          {false ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <>
              {withCloseButton !== false && (
                <CloseButton widgetId={navbarSettingsWidgetId} />
              )}
              <Group justify="space-between">
                <Group gap="xs" wrap="nowrap">
                  <Title order={1} size="h3" lineClamp={1}>
                    Navbar Settings
                  </Title>
                  {/* Badges */}
                </Group>
                <Group gap="xs" wrap="nowrap">
                  <Button
                    onClick={() => {
                      if (updateUserExperience === null) {
                        return;
                      }
                      updateUserExperience((prev) => ({
                        ...prev,
                        navbarSettings: defaultNavbarSettings,
                      }));
                    }}
                    variant="default"
                    leftSection={<IconRestore size={iconSize} />}
                  >
                    Restore Default Values
                  </Button>
                  {/* Buttons */}
                </Group>
              </Group>
              <Divider my="md" />
              <Table
                bg={transparentBackground}
                withTableBorder
                variant="vertical"
                layout="fixed"
              >
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th w="30%">
                      <Text size="sm">
                        Select which pages you want to display or hide
                      </Text>
                    </Table.Th>
                    <Table.Td py="xs">
                      <Chip.Group
                        multiple
                        value={allowedPages
                          .filter(
                            (p) =>
                              !userExperience.navbarSettings.hiddenPagesNavbar.includes(
                                p.href
                              )
                          )
                          .map((p) => p.href)}
                        onChange={(newValue) => {
                          if (updateUserExperience === null) {
                            return;
                          }
                          updateUserExperience((prev) => ({
                            ...prev,
                            navbarSettings: {
                              ...prev.navbarSettings,
                              hiddenPagesNavbar: allowedPages
                                .filter((p) => !newValue.includes(p.href))
                                .map((p) => p.href),
                            },
                          }));
                        }}
                      >
                        <Group justify="flex-start" gap="xs">
                          {allowedPages.map((p, i) => (
                            <Chip
                              value={p.href}
                              key={i}
                              icon={
                                <p.icon
                                  width="100%"
                                  height="100%"
                                  color={primaryColor}
                                />
                              }
                              variant="outline"
                              // disabled={p.href === "/settings"}
                            >
                              {p.label}
                            </Chip>
                          ))}
                        </Group>
                      </Chip.Group>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </>
          )}
        </Paper>
      )}
    </Transition>
  );
}

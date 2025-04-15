import { Group, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { IconPennant } from "@tabler/icons-react";

export default function Footer() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  return (
    <Group justify="center" w="100%" py="md">
      <IconPennant
        size={50}
        color={
          colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[3]
        }
      />
    </Group>
  );
}

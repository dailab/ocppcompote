import { OCPPMessage2 } from "@/types";
import { getCustomStyles } from "@/utils";
import {
  Collapse,
  Divider,
  Flex,
  Paper,
  ScrollArea,
  Table,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import classes from "./MessageCard.module.css";
import { useEffect, useState } from "react";

interface MessageCardProps {
  message: OCPPMessage2;
  onExpand?: () => void;
  index?: number;
  setOnUnfreeze?: Function;
}

export default function MessageCard({
  message,
  onExpand,
  index,
  setOnUnfreeze,
}: MessageCardProps) {
  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, iconSize } = getCustomStyles(
    theme,
    colorScheme
  );

  // State
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Helpers
  const TYPE_ICONS: {
    [key: string]: typeof IconArrowRight;
  } = { req: IconArrowRight, resp: IconArrowLeft };
  const TypeIcon = TYPE_ICONS[message.type];

  useEffect(() => {
    if (!index || !setOnUnfreeze || !setIsExpanded) {
      return;
    }
    setOnUnfreeze((prev: { [index: string]: () => void }) => ({
      ...prev,
      [String(index)]: () => {
        setIsExpanded(false);
      },
    }));
  }, []);

  return (
    <Flex
      gap="xs"
      justify="flex-start"
      align="center"
      direction="row"
      wrap="nowrap"
    >
      <Text size="sm" c="dimmed" ff="monospace">
        {new Date(message.time_start).toLocaleTimeString()}
      </Text>
      <Paper
        bg={transparentBackground}
        shadow={isExpanded ? "md" : "0"}
        // withBorder={!isExpanded}
        withBorder={false}
        p="xs"
        flex={1}
      >
        <Flex
          gap={0}
          justify="flex-start"
          align="flex-start"
          direction="column"
          wrap="nowrap"
          flex={1}
        >
          <Flex
            gap="xs"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="nowrap"
            className={classes.pointer}
            onClick={() => {
              if (!isExpanded && onExpand !== undefined) {
                onExpand();
              }
              setIsExpanded(!isExpanded);
            }}
            w="100%"
          >
            <TypeIcon size={iconSize} />
            <Text truncate="start">{message.fun_name}</Text>
          </Flex>
          <Collapse in={isExpanded} w="100%">
            <Divider my="xs" />
            <Table
              bg={transparentBackground}
              withTableBorder
              highlightOnHover
              w="100%"
            >
              <Table.Tbody w="100%">
                <Table.Tr>
                  <Table.Td>Type</Table.Td>
                  <Table.Td>{message.type}</Table.Td>
                </Table.Tr>
                {message.type === "resp" ? (
                  <Table.Tr>
                    <Table.Td>args</Table.Td>
                    <Table.Td>
                      <ScrollArea w="100%">
                        {typeof message.args === "object"
                          ? JSON.stringify(message.args)
                          : message.args}
                      </ScrollArea>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  <Table.Tr>
                    <Table.Td>kwargs</Table.Td>
                    <Table.Td>
                      <ScrollArea w="100%">
                        {JSON.stringify(message.args.kwargs, null, " ")}
                      </ScrollArea>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Collapse>
        </Flex>
      </Paper>
    </Flex>
  );
}

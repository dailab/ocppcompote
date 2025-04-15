import { HeaderBodyNode } from "@/types";
import { getCustomStyles, transitionDurations } from "@/utils";
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Paper,
  Text,
  Transition,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
  Menu,
  Indicator,
} from "@mantine/core";
import { IconMenu3, IconX } from "@tabler/icons-react";
import {
  Handle,
  NodeProps,
  Position,
  useReactFlow,
  useViewport,
} from "@xyflow/react";
import { PropsWithChildren, useEffect, useState } from "react";

export default function HeaderBodyNodeComponent(
  props: PropsWithChildren<NodeProps<HeaderBodyNode>>
) {
  const { data, children, id } = props; // 'children' and 'data.body' can be used interchangeably to add a body; if both are used then their contents are joined together
  const reactFlowState = useReactFlow();
  const viewport = useViewport();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { iconSize, primaryColor, transparentBackground } = getCustomStyles(
    theme,
    colorScheme
  );

  // State
  const [showMenu, setShowMenu] = useState<boolean>(true);

  // Helpers
  const handleStyle = { background: primaryColor };
  const isSelected: boolean = reactFlowState
    .getNodes()
    .some((e) => e.id === id && e.selected);

  // Effects
  useEffect(() => {
    setShowMenu(false);
  }, [viewport.x, viewport.y, viewport.zoom]);
  useEffect(() => {
    setShowMenu(isSelected);
  }, [isSelected]);

  const node = (
    <Indicator
      size={13}
      offset={2}
      disabled={!data.indicatorProps}
      {...data.indicatorProps}
    >
      <Paper
        p="0"
        shadow="0"
        withBorder
        style={{ borderColor: isSelected ? primaryColor : undefined }}
      >
        {data.menuDropdown !== undefined && (
          <Box pos="absolute" top={-30} ta="center" w="100%">
            <Transition
              mounted={isSelected}
              transition="fade"
              duration={transitionDurations.medium}
              timingFunction="ease"
            >
              {(transitionStyle) => (
                <Tooltip label="Open Menu" disabled={showMenu}>
                  <ActionIcon
                    variant="default"
                    size="xs"
                    aria-label="Settings"
                    onClick={() => {
                      setShowMenu(true);
                    }}
                    style={transitionStyle}
                    disabled={showMenu}
                  >
                    <IconMenu3 style={{ width: "70%", height: "70%" }} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Transition>
          </Box>
        )}
        {data.includeHandlesLeft !== false && (
          <>
            <Handle
              type="source"
              style={handleStyle}
              position={Position.Left}
              id="source-left"
            />
            <Handle
              type="target"
              style={handleStyle}
              position={Position.Left}
              id="target-left"
            />
          </>
        )}
        {data.includeHandlesRight !== false && (
          <>
            <Handle
              type="source"
              style={handleStyle}
              position={Position.Right}
              id="source-right"
            />
            <Handle
              type="target"
              style={handleStyle}
              position={Position.Right}
              id="target-right"
            />
          </>
        )}
        <Group p="md">
          <data.icon size={iconSize} />
          <Divider variant="solid" orientation="vertical" />
          <Text>{data.label}</Text>
        </Group>
        {(children !== undefined || data.body !== undefined) && (
          <Divider variant="dashed" />
        )}
        {children !== undefined && <Box p="md">{children}</Box>}
        {data.body !== undefined && <Box p="md">{data.body}</Box>}
      </Paper>
    </Indicator>
  );

  // Without Menu
  if (!data.menuDropdown) {
    return node;
  }

  // With Menu
  return (
    <Menu shadow="md" opened={showMenu} withArrow offset={2}>
      <Menu.Target>{node}</Menu.Target>
      <Menu.Dropdown bg={transparentBackground}>
        <Menu.Label>Node Menu</Menu.Label>
        {data.menuDropdown(setShowMenu)}
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconX size={iconSize} />}
          onClick={() => {
            setShowMenu(false);
          }}
        >
          Close Menu
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

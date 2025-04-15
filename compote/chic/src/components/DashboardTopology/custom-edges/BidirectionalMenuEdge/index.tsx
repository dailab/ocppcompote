import React, { useEffect, useRef, useState } from "react";
import {
  getBezierPath,
  BaseEdge,
  EdgeProps,
  useReactFlow,
  EdgeLabelRenderer,
  useViewport,
} from "@xyflow/react";
import { BidirectionalMenuEdge } from "@/types";
import {
  ActionIcon,
  Box,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { getCustomStyles, transitionDurations } from "@/utils";
import { IconMenu3, IconX } from "@tabler/icons-react";

export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  offset: number
) => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return `M ${sourceX} ${sourceY} Q ${centerX} ${
    centerY + offset
  } ${targetX} ${targetY}`;
};

export default function BidirectionalMenuEdgeComponent({
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  data,
  label,
  id,
}: EdgeProps<BidirectionalMenuEdge>) {
  const reactFlowState = useReactFlow();
  const viewport = useViewport();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, iconSize } = getCustomStyles(
    theme,
    colorScheme
  );

  // State
  const [showMenu, setShowMenu] = useState<boolean>(false);

  // Helpers
  const isBidirectionalEdge: boolean = reactFlowState
    .getEdges()
    .some(
      (e) =>
        (e.source === target && e.target === source) ||
        (e.target === source && e.source === target)
    );
  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };
  let path = "";
  const specialPathDeviationY = 60;
  let deviationFactorY = 0;
  if (isBidirectionalEdge) {
    deviationFactorY = sourceX < targetX ? 1 : -1;
  }
  if (isBidirectionalEdge) {
    path = getSpecialPath(
      edgePathParams,
      deviationFactorY * specialPathDeviationY
    );
  } else {
    [path] = getBezierPath(edgePathParams);
  }
  const isSelected: boolean = reactFlowState
    .getEdges()
    .some((e) => e.id === id && e.selected);
  const menuPosition: { x: number; y: number } = {
    x: Math.max(sourceX, targetX) - Math.abs(sourceX - targetX) / 2,
    y:
      Math.max(sourceY, targetY) -
      Math.abs(sourceY - targetY) / 2 +
      deviationFactorY * (specialPathDeviationY / 2),
  };
  const labelOffsetY =
    (deviationFactorY === 0 ? 1 : deviationFactorY) *
    (15 + (data && data.subLabelOffset ? data.subLabelOffset : 0));

  // Effects
  useEffect(() => {
    setShowMenu(false);
  }, [viewport.x, viewport.y, viewport.zoom]);
  useEffect(() => {
    setShowMenu(isSelected);
  }, [isSelected]);

  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${menuPosition.x}px,${menuPosition.y + labelOffsetY}px)`,
            transformOrigin: "center",
            position: "absolute",
            pointerEvents: "all",
            overflow: "hidden",
          }}
        >
          <Stack align="center" justify="center" gap={4}>
            <Group gap={8}>
              <Text size="xs" c="dimmed">
                {label}
              </Text>
              {data && data.leftSection && <>{data.leftSection}</>}
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
            </Group>
            {data && data.subLabel && <>{data.subLabel}</>}
          </Stack>
        </div>
        {data && (
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${menuPosition.x}px,${menuPosition.y}px)`,
              transformOrigin: "center",
              position: "absolute",
              pointerEvents: "all",
              overflow: "hidden",
            }}
          >
            <Menu shadow="md" opened={showMenu} withArrow offset={2}>
              <Menu.Target>
                <Box h={0}>x</Box>
              </Menu.Target>
              <Menu.Dropdown bg={transparentBackground}>
                <Menu.Label>Edge Menu</Menu.Label>
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
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}

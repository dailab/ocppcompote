import * as React from "react";

import {
  action,
  ColaLayout,
  ComponentFactory,
  CREATE_CONNECTOR_DROP_TYPE,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  Edge,
  EdgeAnimationSpeed,
  EdgeModel,
  EdgeStyle,
  EdgeTerminalType,
  Graph,
  GraphComponent,
  LabelPosition,
  Layout,
  LayoutFactory,
  Model,
  ModelKind,
  Node,
  nodeDragSourceSpec,
  nodeDropTargetSpec,
  NodeModel,
  NodeShape,
  NodeStatus,
  SELECTION_EVENT,
  TopologyControlBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDndDrop,
  withDragNode,
  WithDragNodeProps,
  withSelection,
  WithSelectionProps,
} from "@patternfly/react-topology";
import {
  Center,
  Loader,
  Paper,
  Tooltip,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconChargingPileFilled,
  IconHelpHexagonFilled,
  IconPlug,
  IconSitemapFilled,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { widgetProps } from "@/utils";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import CloseButton from "../CloseButton";
import { CSMSContext, WidgetComponentProps } from "@/types";
import classes from "./CSTopology.module.css";

interface CustomNodeProps {
  element: Node;
}

interface DataEdgeProps {
  element: Edge;
}

const CONNECTOR_SOURCE_DROP = "connector-src-drop";
const CONNECTOR_TARGET_DROP = "connector-target-drop";

const DataEdge: React.FC<DataEdgeProps> = ({ element, ...rest }) => (
  <DefaultEdge
    element={element}
    startTerminalType={EdgeTerminalType.cross}
    endTerminalType={EdgeTerminalType.directionalAlt}
    {...rest}
  />
);

const CustomNode: React.FC<
  CustomNodeProps & WithSelectionProps & WithDragNodeProps
> = ({ element, selected, onSelect, ...rest }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const router = useRouter();

  const data = element.getData();
  let Icon = IconHelpHexagonFilled;
  if (data.type === "cs") {
    Icon = IconChargingPileFilled;
  } else if (data.type === "connector") {
    Icon = IconPlug;
  } else if (data.type === "csms") {
    Icon = IconSitemapFilled;
  }
  const isClickable = selected && data.href;
  return (
    <DefaultNode
      element={element}
      selected={selected}
      onSelect={onSelect}
      showStatusDecorator={element.getNodeStatus() !== "success"}
      labelPosition={element.getLabelPosition()}
      secondaryLabel={data.label2}
      onStatusDecoratorClick={() => {}}
      {...rest}
    >
      <g transform={`translate(25, 25)`}>
        <Tooltip
          label="Click icon to view Charging Station"
          disabled={!isClickable}
        >
          <Icon
            size={25}
            color={
              colorScheme === "dark"
                ? theme.colors.gray[3]
                : theme.colors.dark[8]
            }
            style={{
              fill:
                colorScheme === "dark"
                  ? theme.colors.gray[3]
                  : theme.colors.dark[8],
              cursor: isClickable ? "pointer" : "default",
            }}
            onClick={() => {
              if (!isClickable) {
                return;
              }
              router.push(data.href);
            }}
          />
        </Tooltip>
      </g>
    </DefaultNode>
  );
};

const customLayoutFactory: LayoutFactory = (
  type: string,
  graph: Graph
): Layout | undefined => new ColaLayout(graph, { layoutOnDrag: true });

const customComponentFactory: any = (kind: ModelKind, type: string) => {
  switch (type) {
    case "group":
      return DefaultGroup;
    case "node":
      return withDndDrop(
        nodeDropTargetSpec([
          CONNECTOR_SOURCE_DROP,
          CONNECTOR_TARGET_DROP,
          CREATE_CONNECTOR_DROP_TYPE,
        ])
      )(
        withDragNode(nodeDragSourceSpec("node", true, true))(
          withSelection()(CustomNode)
        )
      );
    case "data-edge":
      return DataEdge;
    default:
      switch (kind) {
        case ModelKind.graph:
          return GraphComponent;
        case ModelKind.node:
          return CustomNode;
        case ModelKind.edge:
          return DefaultEdge;
        default:
          return undefined;
      }
  }
};

const NODE_DIAMETER = 75;

interface CSTopologyProps extends WidgetComponentProps {
  contexts: { [index: string]: CSMSContext } | null;
  bg?: string;
}

export const csTopologyWidgetId = "cs-topology";

export default function CSTopology({
  contexts,
  bg,
  mt,
  withCloseButton,
}: CSTopologyProps) {
  const { isWidgetSelected } = useWidgetSelection();
  const updateActiveWidget = useUpdateActiveWidget();
  const pathname = usePathname();

  const [CSIds, setCSIds] = React.useState<null | string[]>(null);

  const NODES: NodeModel[] = !contexts
    ? []
    : Object.keys(contexts).reduce(
        (t: NodeModel[], key: string, i) => {
          return [
            ...t,
            {
              id: `node-${key}`,
              type: "node",
              label: contexts[key]["id"],
              labelPosition: LabelPosition.left,
              width: NODE_DIAMETER,
              height: NODE_DIAMETER,
              shape: NodeShape.hexagon,
              status:
                contexts[key]["liveness"] >= 0
                  ? NodeStatus.success
                  : NodeStatus.danger,
              data: {
                type: "cs",
                label2: contexts[key]["liveness"] >= 0 ? undefined : "stale",
                href: `/charging-stations/${key}`,
              },
            },
            ...Object.keys(contexts[key]["connectors"]).map((key2) => ({
              id: `node-${key}-${key2}`,
              type: "node",
              label: `Connector ${key2}`,
              labelPosition: LabelPosition.bottom,
              width: NODE_DIAMETER,
              height: NODE_DIAMETER,
              shape: NodeShape.circle,
              // status: NodeStatus.warning,
              data: {
                type: "connector",
              },
            })),
            {
              id: `group-${key}`,
              children: Object.keys(contexts[key]["connectors"]).map(
                (key2) => `node-${key}-${key2}`
              ),
              type: "group",
              group: true,
              style: {
                padding: 40,
              },
            },
          ];
        },
        [
          {
            id: "node-csms",
            type: "node",
            label: "CSMS",
            labelPosition: LabelPosition.top,
            width: NODE_DIAMETER,
            height: NODE_DIAMETER,
            shape: NodeShape.trapezoid,
            status: NodeStatus.default,
            data: {
              type: "csms",
            },
          },
        ]
      );
  const EDGES: EdgeModel[] = !contexts
    ? []
    : Object.keys(contexts).reduce((t: EdgeModel[], key: string) => {
        return [
          ...t,
          {
            id: `edge-csms-${key}`,
            type: "edge",
            source: "node-csms",
            target: `node-${key}`,
            edgeStyle: EdgeStyle.dashedMd,
            animationSpeed: EdgeAnimationSpeed.medium,
          },
          ...Object.keys(contexts[key]["connectors"]).map((key2) => ({
            id: `edge-${key}-${key2}`,
            type: "edge",
            source: `node-${key}`,
            target: `node-${key}-${key2}`,
            edgeStyle: EdgeStyle.dashedMd,
            animationSpeed: EdgeAnimationSpeed.medium,
          })),
        ];
      }, []);

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const controller = React.useMemo(() => {
    const model: Model = {
      nodes: NODES,
      edges: EDGES,
      graph: {
        id: "g1",
        type: "graph",
        layout: "Cola",
      },
    };

    const newController = new Visualization();
    newController.registerLayoutFactory(customLayoutFactory);
    newController.registerComponentFactory(customComponentFactory);

    newController.addEventListener(SELECTION_EVENT, setSelectedIds);

    newController.fromModel(model, false);

    return newController;
  }, [CSIds]);

  React.useEffect(() => {
    if (!contexts) {
      return;
    }
    if (!CSIds || Object.keys(contexts).length !== CSIds.length) {
      setCSIds(Object.keys(contexts));
    }
  }, [contexts]);

  React.useEffect(() => {
    if (!controller) {
      return;
    }
    setTimeout(() => {
      controller.getGraph().fit(80);
    }, 400);
  }, [controller]);

  return (
    <Transition
      mounted={isWidgetSelected(pathname, csTopologyWidgetId)}
      transition="fade-left"
      duration={350}
      timingFunction="ease"
    >
      {(transitionStyle) => (
        <Paper
          shadow="md"
          bg={bg}
          h={450}
          mt={mt || 0}
          style={{ ...transitionStyle }}
          pos="relative"
          {...widgetProps(updateActiveWidget, csTopologyWidgetId)}
        >
          {withCloseButton !== false && (
            <CloseButton widgetId={csTopologyWidgetId} />
          )}
          {!contexts ? (
            <Center h="100%">
              <Loader />
            </Center>
          ) : (
            <>
              <div className={classes.topologyContainer}>
                <TopologyView
                  controlBar={
                    <TopologyControlBar
                      controlButtons={createTopologyControlButtons({
                        ...defaultControlButtonsOptions,
                        zoomInCallback: action(() => {
                          controller.getGraph().scaleBy(4 / 3);
                        }),
                        zoomOutCallback: action(() => {
                          controller.getGraph().scaleBy(0.75);
                        }),
                        fitToScreenCallback: action(() => {
                          controller.getGraph().fit(80);
                        }),
                        resetViewCallback: action(() => {
                          controller.getGraph().reset();
                          controller.getGraph().layout();
                        }),
                        legend: false,
                      })}
                    />
                  }
                >
                  <VisualizationProvider controller={controller}>
                    <VisualizationSurface state={{ selectedIds }} />
                  </VisualizationProvider>
                </TopologyView>
              </div>
            </>
          )}
        </Paper>
      )}
    </Transition>
  );
}

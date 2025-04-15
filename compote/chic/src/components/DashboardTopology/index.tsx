import { ParticipantRole, WidgetComponentProps } from "@/types";
import {
  Center,
  Loader,
  Paper,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import { getCustomStyles, widgetProps } from "@/utils";
import CloseButton from "../CloseButton";
import { usePathname } from "next/navigation";
import {
  type Node,
  type Edge,
  MarkerType,
  ReactFlow,
  DefaultEdgeOptions,
  FitViewOptions,
  Controls,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import CsNodeComponent from "./custom-nodes/CsNode";
import CpoNodeComponent from "./custom-nodes/CpoNode";
import EmpNodeComponent from "./custom-nodes/EmpNode";
import ERoamingNodeComponent from "./custom-nodes/ERoamingNode";
import HeaderBodyNodeComponent from "./custom-nodes/HeaderBodyNode";
import BidirectionalMenuEdgeComponent from "./custom-edges/BidirectionalMenuEdge";
import InterParticipantEdgeComponent from "./custom-edges/InterParticipantEdge";
import { useMessageEditor } from "../MessageEditor/MessageEditorProvider";

export const dashboardTopologyWidgetId = "dashboard-topology";

const getLayoutedElements: (
  nodes: Node[],
  edges: Edge[],
  options?: { [index: string]: any }
) => { nodes: Node[]; edges: Edge[] } = (nodes, edges) => {
  const distance = 250;
  let total = 0;
  return {
    nodes: nodes.map((node, i) => {
      const nodeWidth =
        node.measured && node.measured.width ? node.measured.width : 0;
      const position = {
        x: total,
        y:
          node.measured && node.measured.height
            ? 0 - node.measured.height / 2
            : 0,
      };
      total += distance + nodeWidth;
      return {
        ...node,
        position,
      };
    }),
    edges,
  };
};

interface DashboardTopologyProps extends WidgetComponentProps {}

export default function DashboardTopology({
  mt,
  withCloseButton,
}: DashboardTopologyProps) {
  const { isWidgetSelected } = useWidgetSelection();
  const pathname = usePathname();
  const updateActiveWidget = useUpdateActiveWidget();
  const flow = useReactFlow();
  const { fitView } = flow;
  const messageEditorContext = useMessageEditor();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground } = getCustomStyles(theme, colorScheme);

  // Helpers 1
  const markerEnd = {
    type: MarkerType.Arrow,
    width: 20,
    height: 20,
  };
  const initialNodes: Node[] = [
    {
      id: "CS",
      position: { x: 0, y: 0 },
      data: {},
      type: "cs",
    },
    {
      id: "CPO",
      position: { x: 300, y: 0 },
      data: {},
      type: "cpo",
    },
    {
      id: "eRoaming",
      position: { x: 600, y: 0 },
      data: {},
      type: "eroaming",
    },
    {
      id: "EMP",
      position: { x: 900, y: 0 },
      data: {},
      type: "emp",
    },
  ];
  const initialEdges: Edge[] = [
    {
      id: "EMP->eRoaming",
      source: "EMP",
      target: "eRoaming",
      type: "interparticipant",
      targetHandle: "target-right",
      data: {
        communicationPath: {
          senderRole: "EMP",
          recipientRole: "eRoaming",
        },
      },
      label: "OICP",
      markerEnd,
    },
    {
      id: "eRoaming->EMP",
      source: "eRoaming",
      target: "EMP",
      type: "interparticipant",
      sourceHandle: "source-right",
      data: {
        communicationPath: {
          senderRole: "eRoaming",
          recipientRole: "EMP",
        },
      },
      label: "OICP",
      markerEnd,
    },
    {
      id: "CPO->eRoaming",
      source: "CPO",
      target: "eRoaming",
      type: "interparticipant",
      sourceHandle: "source-right",
      data: {
        communicationPath: {
          senderRole: "CPO",
          recipientRole: "eRoaming",
        },
      },
      label: "OICP",
      markerEnd,
    },
    {
      id: "eRoaming->CPO",
      source: "eRoaming",
      target: "CPO",
      type: "interparticipant",
      targetHandle: "target-right",
      data: {
        communicationPath: {
          senderRole: "eRoaming",
          recipientRole: "CPO",
        },
      },
      label: "OICP",
      markerEnd,
    },
    {
      id: "CS->CPO",
      source: "CS",
      target: "CPO",
      type: "interparticipant",
      sourceHandle: "source-right",
      data: {
        communicationPath: {
          senderRole: "CS",
          recipientRole: "CPO",
        },
      },
      label: "OCPP",
      markerEnd,
    },
    {
      id: "CPO->CS",
      source: "CPO",
      target: "CS",
      type: "interparticipant",
      targetHandle: "target-right",
      data: {
        communicationPath: {
          senderRole: "CPO",
          recipientRole: "CS",
        },
      },
      label: "OCPP",
      markerEnd,
    },
  ];

  // State
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // Helpers 2
  const fitViewOptions: FitViewOptions = {
    padding: 0.2,
  };
  const defaultEdgeOptions: DefaultEdgeOptions = {
    // animated: true,
  };
  const nodeTypes = {
    headerbody: HeaderBodyNodeComponent,
    cs: CsNodeComponent,
    cpo: CpoNodeComponent,
    emp: EmpNodeComponent,
    eroaming: ERoamingNodeComponent,
  };
  const edgeTypes = {
    bidirectionalmenu: BidirectionalMenuEdgeComponent,
    interparticipant: InterParticipantEdgeComponent,
  };
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const mustApplyLayout = changes.reduce(
        (t, change) => (t ? change.type === "dimensions" : false),
        true
      );
      setNodes((nds) => {
        const allowedChangeTypes = ["dimensions", "position", "select"];
        const changedNodes = applyNodeChanges(
          changes.filter((c) => allowedChangeTypes.includes(c.type)),
          nds
        );
        if (mustApplyLayout) {
          const layouted = getLayoutedElements(changedNodes, edges);
          setEdges([...layouted.edges]);
          return layouted.nodes;
        }
        return changedNodes;
      });
      if (mustApplyLayout) {
        window.requestAnimationFrame(() => {
          fitView();
        });
      }
    },
    [setNodes, nodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const allowedChangeTypes = ["select"];
      setEdges(
        (eds) =>
          applyEdgeChanges(
            changes.filter((c) => allowedChangeTypes.includes(c.type)),
            eds
          )
        // .map((e) => {
        //   const c = changes.find((c) => c.type === "select" && c.id === e.id);
        //   if (!c) {
        //     return e;
        //   }
        //   if ("selected" in c && c.selected) {
        //     return {
        //       ...e,
        //       animated: true,
        //     };
        //   }
        //   return {
        //     ...e,
        //     animated: false,
        //   };
        // })
      );
    },
    [setEdges]
  );
  const messageEditorSenderRole: undefined | null | ParticipantRole =
    !messageEditorContext
      ? undefined
      : !messageEditorContext.sender
        ? null
        : messageEditorContext.sender.role;
  const messageEditorRecipientRole: undefined | null | ParticipantRole =
    !messageEditorContext
      ? undefined
      : !messageEditorContext.recipient
        ? null
        : messageEditorContext.recipient.role;
  const messageEditorCommunicationPathDependency: string | null =
    messageEditorContext
      ? `${String(messageEditorSenderRole)}, ${String(messageEditorRecipientRole)}`
      : null;

  // Effects
  useEffect(() => {
    // Animate edge, which represents communication path, that is currently opened in message editor
    if (!messageEditorContext) {
      return;
    }
    setEdges(
      edges.map((e) => {
        if (
          e.data &&
          e.data.communicationPath &&
          messageEditorContext.sender &&
          messageEditorContext.recipient &&
          e.data.communicationPath.senderRole === messageEditorSenderRole &&
          e.data.communicationPath.recipientRole === messageEditorRecipientRole
        ) {
          return { ...e, animated: true };
        }
        return { ...e, animated: false };
      })
    );
  }, [messageEditorCommunicationPathDependency]);

  return (
    <Transition
      mounted={isWidgetSelected(pathname, dashboardTopologyWidgetId)}
      transition="fade-left"
      duration={350}
      timingFunction="ease"
    >
      {(transitionStyle) => (
        <Paper
          shadow="md"
          bg={transparentBackground}
          mt={mt || 0}
          pos="relative"
          h={350}
          style={transitionStyle}
          {...widgetProps(updateActiveWidget, dashboardTopologyWidgetId)}
        >
          {withCloseButton !== false && (
            <CloseButton widgetId={dashboardTopologyWidgetId} />
          )}
          {false ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                maxZoom={1.2}
                fitViewOptions={fitViewOptions}
                defaultEdgeOptions={defaultEdgeOptions}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                proOptions={{ hideAttribution: true }}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={12}
                  size={1}
                />
                <Controls />
              </ReactFlow>
            </>
          )}
        </Paper>
      )}
    </Transition>
  );
}

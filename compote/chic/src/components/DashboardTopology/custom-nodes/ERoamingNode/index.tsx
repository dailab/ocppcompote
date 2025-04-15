import { ERoamingNode, HeaderBodyNode } from "@/types";
import { NodeProps } from "@xyflow/react";
import { IconTopologyStar } from "@tabler/icons-react";
import HeaderBodyNodeComponent from "../HeaderBodyNode";
import { useOnlineServices } from "@/components/ContextsProvider";

export default function ERoamingNodeComponent(props: NodeProps<ERoamingNode>) {
  const onlineServices = useOnlineServices();
  const headerBodyNodeProps: NodeProps<HeaderBodyNode> = {
    ...props,
    type: "headerbody",
    data: {
      label: "e-Roaming Platform",
      icon: IconTopologyStar,
      indicatorProps: {
        color: onlineServices.includes("eroaming") ? "green" : "red",
        processing: onlineServices.includes("eroaming"),
        label: "eRoaming Mock",
      },
    },
  };
  return (
    <HeaderBodyNodeComponent {...headerBodyNodeProps}></HeaderBodyNodeComponent>
  );
}

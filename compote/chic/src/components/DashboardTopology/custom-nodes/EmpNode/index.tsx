import { EmpNode, HeaderBodyNode } from "@/types";
import { NodeProps } from "@xyflow/react";
import { IconUserBolt } from "@tabler/icons-react";
import HeaderBodyNodeComponent from "../HeaderBodyNode";
import { useOnlineServices } from "@/components/ContextsProvider";

export default function EmpNodeComponent(props: NodeProps<EmpNode>) {
  const onlineServices = useOnlineServices();
  const headerBodyNodeProps: NodeProps<HeaderBodyNode> = {
    ...props,
    type: "headerbody",
    data: {
      label: "EMP",
      icon: IconUserBolt,
      includeHandlesRight: false,
      indicatorProps: {
        color: onlineServices.includes("empms") ? "green" : "red",
        processing: onlineServices.includes("empms"),
        label: "EMPMS",
      },
    },
  };
  return (
    <HeaderBodyNodeComponent {...headerBodyNodeProps}></HeaderBodyNodeComponent>
  );
}

import { CsNode, HeaderBodyNode } from "@/types";
import { NodeProps } from "@xyflow/react";
import { IconChargingPile, IconEye } from "@tabler/icons-react";
import HeaderBodyNodeComponent from "../HeaderBodyNode";
import {
  List,
  Menu,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { chargingStationName, getCustomStyles } from "@/utils";
import {
  useCsmsContexts,
  useOnlineServices,
} from "@/components/ContextsProvider";
import Link from "next/link";
import { useMessageEditor } from "@/components/MessageEditor/MessageEditorProvider";
import { useUser } from "@/components/UserProvider";

export default function CsNodeComponent(props: NodeProps<CsNode>) {
  const contexts = useCsmsContexts();
  const onlineServices = useOnlineServices();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { iconSize } = getCustomStyles(theme, colorScheme);

  // Helpers
  const headerBodyNodeProps: NodeProps<HeaderBodyNode> = {
    ...props,
    type: "headerbody",
    data: {
      label: "Charging Stations",
      icon: IconChargingPile,
      includeHandlesLeft: false,
      indicatorProps: {
        color: onlineServices.includes("cseverest") ? "green" : "red",
        processing: onlineServices.includes("cseverest"),
        label: "CS Everest MQTT",
      },
      menuDropdown: () => (
        <>
          {contexts !== null && (
            <>
              {Object.keys(contexts).map((key) => (
                <Menu.Item
                  leftSection={<IconEye size={iconSize} />}
                  component={Link}
                  href={`/charging-stations/${key}`}
                  key={key}
                >
                  View {chargingStationName(key)}
                </Menu.Item>
              ))}
            </>
          )}
        </>
      ),
    },
  };
  return (
    <HeaderBodyNodeComponent {...headerBodyNodeProps}>
      {contexts !== null && Object.keys(contexts).length > 0 ? (
        <List size="sm" type="unordered" listStyleType="disc">
          {Object.keys(contexts).map((key) => (
            <List.Item
              key={key}
            >{`${chargingStationName(key)} (${contexts[key].id})`}</List.Item>
          ))}
        </List>
      ) : (
        <Text size="sm">Currently no charging station connected</Text>
      )}
    </HeaderBodyNodeComponent>
  );
}

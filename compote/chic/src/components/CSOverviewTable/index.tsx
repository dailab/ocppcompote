import { CSMSContext, WidgetComponentProps } from "@/types";
import { getCustomStyles, widgetProps } from "@/utils";
import {
  Button,
  Center,
  Divider,
  Indicator,
  Loader,
  Paper,
  Table,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import CloseButton from "../CloseButton";
import { usePathname } from "next/navigation";

export const csOverviewTableWidgetId = "cs-overview-table";

interface CSOverviewTableProps extends WidgetComponentProps {
  contexts: { [index: string]: CSMSContext } | null;
}

export default function CSOVerviewTable({
  mt,
  withCloseButton,
  contexts,
}: CSOverviewTableProps) {
  const { isWidgetSelected } = useWidgetSelection();
  const pathname = usePathname();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground } = getCustomStyles(theme, colorScheme);
  const updateActiveWidget = useUpdateActiveWidget();

  return (
    <Transition
      mounted={isWidgetSelected(pathname, csOverviewTableWidgetId)}
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
          style={transitionStyle}
          pos="relative"
          {...widgetProps(updateActiveWidget, csOverviewTableWidgetId)}
        >
          <>
            {withCloseButton !== false && (
              <CloseButton widgetId={csOverviewTableWidgetId} />
            )}
            <Title order={1} size="h3">
              Charging Stations
            </Title>
            <Divider my="md" />
            {contexts === null ? (
              <Center>
                <Loader />
              </Center>
            ) : (
              <Table
                bg={transparentBackground}
                withTableBorder
                highlightOnHover
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>OCPP Version</Table.Th>
                    <Table.Th>Authorization</Table.Th>
                    <Table.Th>Connectors</Table.Th>
                    <Table.Th>Last Seen</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {Object.keys(contexts).map((key) => {
                    const isLive = contexts[key].liveness >= 0;
                    return (
                      <Table.Tr key={key}>
                        <Table.Td>{key}</Table.Td>
                        <Table.Td>{contexts[key].id}</Table.Td>
                        <Table.Td>{contexts[key]["ocpp_version"]}</Table.Td>
                        <Table.Td>{String(contexts[key].auth)}</Table.Td>
                        <Table.Td>
                          {Object.keys(contexts[key].connectors).length}
                        </Table.Td>
                        <Table.Td>
                          {isLive
                            ? "live"
                            : `stale ${
                                Math.round(contexts[key].liveness * 10) / 10
                              } secs ago`}
                        </Table.Td>
                        <Table.Td>
                          <Indicator
                            inline
                            processing={isLive}
                            label={isLive ? undefined : "stale"}
                            color={isLive ? "green" : "red"}
                          >
                            <Button
                              size="xs"
                              variant="default"
                              component={Link}
                              href={`/charging-stations/${key}`}
                            >
                              View
                            </Button>
                          </Indicator>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            )}
          </>
        </Paper>
      )}
    </Transition>
  );
}

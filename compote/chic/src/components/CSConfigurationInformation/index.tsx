import {
  Center,
  Divider,
  Group,
  Loader,
  MantineSize,
  Paper,
  Table,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import CloseButton from "../CloseButton";
import { getCustomStyles, widgetProps } from "@/utils";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import CSIndicator from "../CSIndicator";
import { WidgetComponentProps } from "@/types";
import { usePathname } from "next/navigation";

export const csConfigInfoWidgetId = "cs-config-info";

interface CSConfigurationInformationProps extends WidgetComponentProps {
  chargingStationId: string | null; // if null then is loading
  context: { [index: string]: any } | undefined; // if undefined then is loading
}

export default function CSConfigurationInformation({
  chargingStationId,
  context,
  withCloseButton,
  mt,
}: CSConfigurationInformationProps) {
  const { isWidgetSelected } = useWidgetSelection();
  const pathname = usePathname();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground } = getCustomStyles(theme, colorScheme);

  // State
  const updateActiveWidget = useUpdateActiveWidget();

  const keys: { [index: string]: string } = {
    id: "Name",
    ocpp_version: "OCPP Version",
    charge_point_vendor: "Charge Point Vendor",
    charge_point_model: "Charge Point Model",
    registration_status: "Registration Status",
    // liveness: "Liveness",
  }; // Keys in the context object that should be displayed

  return (
    <Transition
      mounted={isWidgetSelected(pathname, csConfigInfoWidgetId)}
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
          pos="relative"
          style={transitionStyle}
          {...widgetProps(updateActiveWidget, csConfigInfoWidgetId)}
        >
          {withCloseButton !== false && (
            <CloseButton widgetId={csConfigInfoWidgetId} />
          )}
          {chargingStationId === null || !context ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <>
              <Group justify="space-between">
                <Title order={1} size="h3">
                  Configuration Information for{" "}
                  <CSIndicator
                    chargingStationId={chargingStationId}
                    context={context}
                  />
                </Title>
              </Group>
              <Divider my="md" />
              <Table
                bg={transparentBackground}
                withTableBorder
                highlightOnHover
              >
                <Table.Tbody>
                  {Object.keys(context)
                    .filter((k) => Object.keys(keys).includes(k))
                    .map((k, i) => (
                      <Table.Tr key={i}>
                        <Table.Td>{keys[k]}</Table.Td>
                        <Table.Td>
                          {k === "liveness"
                            ? context[k] > 0
                              ? "live"
                              : `stale ${
                                  Math.round(context[k] * 10) / 10
                                } secs ago`
                            : context[k]}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
            </>
          )}
        </Paper>
      )}
    </Transition>
  );
}

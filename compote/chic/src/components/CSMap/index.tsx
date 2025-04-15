import {
  ChargingStationStatusDatum,
  EMPMSContext,
  EVSEStatus,
  MessageRecipient,
  MessageSender,
  WidgetComponentProps,
} from "@/types";
import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Paper,
  Progress,
  rem,
  RingProgress,
  Table,
  Text,
  Tooltip,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import { getCustomStyles, isSameProtocol, oicpV23, widgetProps } from "@/utils";
import CloseButton from "../CloseButton";
import { usePathname } from "next/navigation";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { LatLngExpression, Map } from "leaflet";
import {
  IconBuildingBridge,
  IconBuildings,
  IconChargingPile,
} from "@tabler/icons-react";
import { useMemo, useRef, useState } from "react";
import { Carousel } from "@mantine/carousel";
import classes from "./CSMap.module.css";
import carouselClasses from "../../styles/Carousel.module.css";
import Autoplay from "embla-carousel-autoplay";
import { useMessageEditor } from "../MessageEditor/MessageEditorProvider";

export const csMapWidgetId = "cs-map";

interface CSMapProps extends WidgetComponentProps {
  context: EMPMSContext | null;
}

export default function CSMap({ mt, withCloseButton, context }: CSMapProps) {
  const { isWidgetSelected } = useWidgetSelection();
  const pathname = usePathname();
  const updateActiveWidget = useUpdateActiveWidget();
  const messageEditorContext = useMessageEditor();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, iconSize, connectorStatusColors } =
    getCustomStyles(theme, colorScheme);

  // State
  const [map, setMap] = useState<null | Map>(null);

  // Helpers
  const chargingStations: { [index: string]: any }[] =
    context &&
    context.data &&
    context.data.cs_data &&
    context.data.cs_data.length > 0
      ? context.data.cs_data[context.data.cs_data.length - 1]
      : [];
  const latestChargingStationStatusDatum: ChargingStationStatusDatum =
    context &&
    context.data &&
    context.data.cs_status_data &&
    context.data.cs_status_data.length > 0
      ? context.data.cs_status_data[context.data.cs_status_data.length - 1]
          .actual_instance
      : [];
  const evseStatuses: EVSEStatus[] =
    latestChargingStationStatusDatum.EvseStatuses
      ? latestChargingStationStatusDatum.EvseStatuses.OperatorEvseStatus.reduce(
          (t: EVSEStatus[], s) => [...t, ...s.EvseStatusRecord],
          []
        )
      : [];
  const progressColors = ["cyan", "pink", "orange", "teal", "indigo", "lime"];
  const latLngBerlin = { lat: 52.52437, lng: 13.41053 };
  const latLngLondon = { lat: 51.509865, lng: -0.118092 };
  const defaultZoom = 12;
  const setView = useMemo(() => {
    if (!map) {
      return () => {};
    }
    return (latLng: LatLngExpression) => {
      map.setView(latLng, defaultZoom);
    };
  }, [map]);
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const displayMapDependencyString = JSON.stringify(chargingStations);
  const displayMap = useMemo(
    () => (
      <MapContainer
        center={latLngBerlin}
        zoom={defaultZoom}
        scrollWheelZoom={false}
        style={{ height: 450 }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {chargingStations.map((cs, i) => {
          const names: { lang: string; value: string }[] =
            cs["ChargingStationNames"];
          const germanName: string | null = names
            ? names.find((n) => n.lang === "de")?.value || null
            : null;
          const englishName: string | null = names
            ? names.find((n) => n.lang === "en")?.value || null
            : null;
          const name: string | null = germanName || englishName || null;
          const evseId = cs["EvseID"];
          const status = evseStatuses.find((s) => s.EvseID === evseId);
          const handleLoadMessage = (
            messageId: string,
            defaultValuesCallback: (
              sender: MessageSender,
              recipient: MessageRecipient
            ) => {
              [index: string]: any;
            }
          ) => {
            if (!messageEditorContext) {
              return;
            }
            const { setSelectedMessage, selectedProtocol, widgetRef } =
              messageEditorContext;
            if (selectedProtocol && isSameProtocol(oicpV23, selectedProtocol)) {
              setSelectedMessage(messageId, defaultValuesCallback);
              setTimeout(() => {
                if (widgetRef && widgetRef.current) {
                  widgetRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }, 0);
            }
          };
          const latLng: LatLngExpression | null =
            cs.GeoCoordinates && cs.GeoCoordinates.DecimalDegree
              ? {
                  lat: cs.GeoCoordinates.DecimalDegree.Latitude,
                  lng: cs.GeoCoordinates.DecimalDegree.Longitude,
                }
              : null;
          if (!latLng) {
            return <></>;
          }
          return (
            <Marker position={latLng} key={i}>
              <Popup className={classes.popup}>
                <Grid w={500 - 44}>
                  <Grid.Col span={3}>
                    <Flex direction="column" align="center" flex={0}>
                      <RingProgress
                        sections={[
                          {
                            value: 100,
                            color:
                              connectorStatusColors[
                                status ? status.EvseStatus : "NoData"
                              ],
                          },
                        ]}
                        label={
                          <Center>
                            <ActionIcon
                              color={
                                connectorStatusColors[
                                  status ? status.EvseStatus : "NoData"
                                ]
                              }
                              variant="light"
                              radius="xl"
                              size="xl"
                            >
                              <IconChargingPile
                                style={{ width: rem(22), height: rem(22) }}
                              />
                            </ActionIcon>
                          </Center>
                        }
                      />
                      <Text m={0}>
                        {status ? status.EvseStatus : "No Data"}
                      </Text>
                    </Flex>
                  </Grid.Col>
                  <Grid.Col span={9}>
                    <Title order={1} size="h3" textWrap="nowrap">
                      {name}
                    </Title>
                    <Divider my="md" />
                    <Carousel
                      slideGap="md"
                      classNames={carouselClasses}
                      plugins={[autoplay.current]}
                      onMouseEnter={autoplay.current.stop}
                      onMouseLeave={autoplay.current.reset}
                    >
                      <Carousel.Slide>
                        <Table
                          bg={transparentBackground}
                          withTableBorder
                          highlightOnHover
                        >
                          <Table.Tbody>
                            <Table.Tr>
                              <Table.Td>
                                <Text my="0" size="sm" lineClamp={1}>
                                  EVSE ID
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text my="0" size="sm" lineClamp={1}>
                                  {evseId}
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                              <Table.Td>
                                <Text my="0" size="sm" lineClamp={1}>
                                  Operator
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text my="0" size="sm" lineClamp={1}>
                                  {cs["OperatorName"]}
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                              <Table.Td>
                                <Text my="0" size="sm" lineClamp={1}>
                                  Operator ID
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text my="0" size="sm" lineClamp={1}>
                                  {cs["OperatorID"]}
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                              <Table.Td>
                                <Text my="0" size="sm" lineClamp={1}>
                                  Address
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text my="0" size="sm" lineClamp={1}>
                                  {`${cs["Address"]["Street"]} ${cs["Address"]["HouseNum"]}, ${cs["Address"]["PostalCode"]} ${cs["Address"]["City"]}`}
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                              <Table.Td>
                                <Text my="0" size="sm" lineClamp={1}>
                                  Sub Operator
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text my="0" size="sm" lineClamp={1}>
                                  {cs["SubOperatorName"]}
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                          </Table.Tbody>
                        </Table>
                      </Carousel.Slide>
                      <Carousel.Slide>
                        <Button
                          fullWidth
                          variant="default"
                          onClick={() => {
                            handleLoadMessage(
                              "authorizeremotestartv21",
                              () => ({ EvseID: evseId })
                            );
                          }}
                        >
                          Authorize Remote Start
                        </Button>
                        <Button
                          fullWidth
                          display="block"
                          variant="default"
                          mt="xs"
                          onClick={() => {
                            handleLoadMessage("authorizeremotestopv21", () => ({
                              EvseID: evseId,
                            }));
                          }}
                        >
                          Authorize Remote Stop
                        </Button>
                        <Button
                          fullWidth
                          display="block"
                          variant="default"
                          mt="xs"
                          onClick={() => {
                            handleLoadMessage(
                              "authorizeremotereservationstartv11",
                              () => ({
                                EvseID: evseId,
                              })
                            );
                          }}
                        >
                          Authorize Remote Reservation Start
                        </Button>
                        <Button
                          fullWidth
                          display="block"
                          variant="default"
                          mt="xs"
                          onClick={() => {
                            handleLoadMessage(
                              "authorizeremotereservationstopv1",
                              () => ({
                                EvseID: evseId,
                              })
                            );
                          }}
                        >
                          Authorize Remote Reservation Stop
                        </Button>
                      </Carousel.Slide>
                      {cs["EnergySource"] &&
                        Array.isArray(cs["EnergySource"]) && (
                          <Carousel.Slide>
                            <Text my="0" size="sm">
                              Energy Sources:
                            </Text>
                            <Progress.Root size={20}>
                              {cs["EnergySource"].map((source, i) => (
                                <Tooltip
                                  label={`${source.Energy} - ${source.Percentage}%`}
                                >
                                  <Progress.Section
                                    value={source.Percentage}
                                    color={
                                      progressColors[i % progressColors.length]
                                    }
                                  >
                                    <Progress.Label>
                                      {source.Energy}
                                    </Progress.Label>
                                  </Progress.Section>
                                </Tooltip>
                              ))}
                            </Progress.Root>
                          </Carousel.Slide>
                        )}
                    </Carousel>
                  </Grid.Col>
                </Grid>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    ),
    [displayMapDependencyString, colorScheme]
  );

  return (
    <Transition
      mounted={isWidgetSelected(pathname, csMapWidgetId)}
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
          h="fit-content"
          style={transitionStyle}
          {...widgetProps(updateActiveWidget, csMapWidgetId)}
        >
          {withCloseButton !== false && (
            <CloseButton widgetId={csMapWidgetId} />
          )}
          <Group justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <Title order={1} size="h3" lineClamp={1}>
                Charging Stations Map
              </Title>
              {context !== null && (
                <Badge
                  variant={
                    chargingStations.length === 0 ? "outline" : "default"
                  }
                  color={chargingStations.length === 0 ? "red" : undefined}
                  visibleFrom="xl"
                >
                  {chargingStations.length === 0
                    ? "No Displayed Entities"
                    : `${chargingStations.length} Displayed Entit${chargingStations.length === 1 ? "y" : "ies"}`}
                </Badge>
              )}
              {/* Badges */}
            </Group>
            <Group gap="xs" wrap="nowrap">
              <Button
                onClick={() => {
                  setView(latLngBerlin);
                }}
                variant="default"
                leftSection={<IconBuildings size={iconSize} />}
              >
                Berlin
              </Button>
              <Button
                onClick={() => {
                  setView(latLngLondon);
                }}
                variant="default"
                leftSection={<IconBuildingBridge size={iconSize} />}
              >
                London
              </Button>
              {/* Buttons */}
            </Group>
          </Group>
          <Divider my="md" />
          {!context ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <>{displayMap}</>
          )}
        </Paper>
      )}
    </Transition>
  );
}

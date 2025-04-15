import { LogConstraint, LogsSequence, WidgetComponentProps } from "@/types";
import {
  capitalize,
  getCustomStyles,
  logConstraintsToString,
  stringifyNumber,
  widgetProps,
} from "@/utils";
import {
  Accordion,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  Loader,
  Paper,
  Table,
  Text,
  Timeline,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import CloseButton from "../CloseButton";
import { usePathname } from "next/navigation";
import { useLogsSequences } from "../LogsSequencesProvider";
import { Carousel, Embla } from "@mantine/carousel";
import carouselClasses from "../ConnectorOverview/Carousel.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IconFlag,
  IconFlagPlus,
  IconGitBranch,
  IconGitCommit,
  IconGitPullRequest,
  IconMessageDots,
  IconRoute,
  IconStepInto,
  IconZoomCode,
} from "@tabler/icons-react";

export const logsSequenceEditorWidgetId = "logs-sequence-editor";

interface LogsSequenceEditorProps extends WidgetComponentProps {}

export default function LogsSequenceEditor({
  mt,
  withCloseButton,
}: LogsSequenceEditorProps) {
  const { isWidgetSelected } = useWidgetSelection();
  const pathname = usePathname();
  const updateActiveWidget = useUpdateActiveWidget();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, iconSize } = getCustomStyles(
    theme,
    colorScheme
  );

  // State
  const sequences = useLogsSequences();
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [selectedSequence, setSelectedSequence] = useState<LogsSequence | null>(
    sequences.length > 0 ? sequences[0] : null
  );
  const [createdLogConstraints, setCreatedLogConstrains] = useState<
    LogConstraint[][]
  >([[]]);
  const [visualizedSequence, setVisualizedSequence] =
    useState<LogsSequence | null>(null);

  // Helpers
  const handleScroll = useCallback(() => {
    if (!embla) {
      return;
    }
    const selectedSnap = embla.selectedScrollSnap();
    if (selectedSnap === 0) {
      setVisualizedSequence(selectedSequence);
    } else {
      setVisualizedSequence({ id: "", logConstraints: createdLogConstraints });
    }
  }, [embla, setVisualizedSequence]);

  // Effects
  useEffect(() => {
    if (!embla) {
      return;
    }
    embla.on("scroll", handleScroll);
    handleScroll();
  }, [embla]);

  return (
    <Transition
      mounted={isWidgetSelected(pathname, logsSequenceEditorWidgetId)}
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
          {...widgetProps(updateActiveWidget, logsSequenceEditorWidgetId)}
        >
          <>
            {withCloseButton !== false && (
              <CloseButton widgetId={logsSequenceEditorWidgetId} />
            )}
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap">
                <Title order={1} size="h3">
                  Sequence Editor
                </Title>
                {/* Badges */}
              </Group>
              <Group gap="xs" wrap="nowrap">
                {/* Buttons */}
                <Button
                  variant="default"
                  leftSection={<IconFlagPlus size={iconSize} />}
                  onClick={() => {
                    if (!embla) {
                      return;
                    }
                    embla.scrollTo(1);
                  }}
                  disabled={embla !== null && embla.selectedScrollSnap() > 0}
                >
                  Add Sequence
                </Button>
              </Group>
            </Group>
            <Divider my="md" />
            {false ? (
              <Center>
                <Loader />
              </Center>
            ) : (
              <Carousel
                withIndicators={false}
                withControls={false}
                slideSize="50%"
                slideGap="md"
                align="start"
                slidesToScroll={1}
                classNames={carouselClasses}
                initialSlide={0}
                getEmblaApi={setEmbla}
              >
                <Carousel.Slide>
                  <Table
                    bg={transparentBackground}
                    withTableBorder
                    highlightOnHover
                  >
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th />
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Length</Table.Th>
                        <Table.Th>First Log Constraint</Table.Th>
                        {/* <Table.Th>Last Log Constraint</Table.Th> */}
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {sequences.map((sequence) => (
                        <Table.Tr
                          bg={
                            selectedSequence &&
                            selectedSequence.id === sequence.id
                              ? colorScheme === "dark"
                                ? theme.colors.dark[5]
                                : theme.colors.gray[1]
                              : undefined
                          }
                        >
                          <Table.Td>
                            <Checkbox
                              aria-label="Select row"
                              checked={
                                selectedSequence !== null &&
                                selectedSequence.id === sequence.id
                              }
                              onChange={(event) =>
                                setSelectedSequence(
                                  event.currentTarget.checked ? sequence : null
                                )
                              }
                            />
                          </Table.Td>
                          <Table.Td>{sequence.id}</Table.Td>
                          <Table.Td>{sequence.logConstraints.length}</Table.Td>
                          <Table.Td>
                            {/* <ScrollArea
                              type="hover"
                              scrollbarSize={8}
                              scrollHideDelay={20}
                              // classNames={scrollAreaClasses}
                            > */}
                            {sequence.logConstraints.length > 0
                              ? logConstraintsToString(
                                  sequence.logConstraints[0]
                                )
                              : ""}
                            {/* </ScrollArea> */}
                          </Table.Td>
                          {/* <Table.Td>
                            {sequence.logConstraints.length > 0
                              ? logConstraintsToString(
                                  sequence.logConstraints[
                                    sequence.logConstraints.length - 1
                                  ]
                                )
                              : ""}
                          </Table.Td> */}
                          <Table.Td>
                            <Button size="xs" variant="default">
                              Edit
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Carousel.Slide>
                <Carousel.Slide>
                  {visualizedSequence ? (
                    <Timeline active={0} bulletSize={24} lineWidth={2}>
                      <Timeline.Item
                        bullet={<IconRoute size={iconSize} />}
                        title="Sequence Start"
                      >
                        <Text c="dimmed" size="sm">
                          Once the first log of the sequence is detected the
                          sequence starts
                        </Text>
                        <Text size="xs" mt={4}>
                          Anytime
                        </Text>
                      </Timeline.Item>
                      {visualizedSequence.logConstraints.map((log, i) => {
                        const isFirstLog = i === 0;
                        const isLastLog =
                          i === visualizedSequence.logConstraints.length - 1;
                        return (
                          <Timeline.Item
                            bullet={<IconStepInto size={iconSize} />}
                            title={`${capitalize(stringifyNumber(i + 1))} Log`}
                            lineVariant={isLastLog ? "dashed" : "solid"}
                          >
                            <Text c="dimmed" size="sm">
                              If constraints are satisfied
                              {` (${logConstraintsToString(log)}) `}
                              {isFirstLog
                                ? "sequence is detected and waits for next log"
                                : "waits for next log else sequence fails"}
                            </Text>
                            <Text size="xs" mt={4}>
                              {isFirstLog
                                ? "Directly after sequence start"
                                : `Some time after log ${i}`}
                            </Text>
                          </Timeline.Item>
                        );
                      })}
                      <Timeline.Item
                        title="Sequence End"
                        bullet={<IconFlag size={iconSize} />}
                      >
                        <Text c="dimmed" size="sm">
                          If the sequence has not yet failed, it will succeed
                          now
                        </Text>
                        <Text size="xs" mt={4}>
                          After the last log in the sequence
                        </Text>
                      </Timeline.Item>
                    </Timeline>
                  ) : (
                    <Text>No Sequence selected.</Text>
                  )}
                </Carousel.Slide>
                <Carousel.Slide>
                  <Accordion defaultValue={"0"} variant="contained">
                    {createdLogConstraints.map((l, i) => (
                      <Accordion.Item key={i} value={String(i)}>
                        <Accordion.Control
                          icon={<IconZoomCode size={iconSize} />}
                        >
                          {capitalize(stringifyNumber(i + 1))} Log
                        </Accordion.Control>
                        <Accordion.Panel>saasdjklf</Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Carousel.Slide>
              </Carousel>
            )}
          </>
        </Paper>
      )}
    </Transition>
  );
}

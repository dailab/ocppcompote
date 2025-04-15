"use client";

import {
  AuthenticationDataRecord,
  EMPMSContext,
  WidgetComponentProps,
} from "@/types";
import {
  Button,
  Center,
  Divider,
  Group,
  JsonInput,
  Loader,
  Menu,
  Paper,
  ScrollArea,
  Table,
  Text,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import {
  flattenObject,
  getCustomStyles,
  isSameProtocol,
  oicpV23,
  widgetProps,
} from "@/utils";
import CloseButton from "../CloseButton";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import scrollAreaClasses from "../WidgetSelectionHeader/ScrollArea.module.css";
import { IconBraces, IconPlus, IconTable } from "@tabler/icons-react";
import { useMessageEditor } from "../MessageEditor/MessageEditorProvider";

export const authOverviewWidgetId = "auth-overview";

interface AuthOverviewProps extends WidgetComponentProps {
  context: EMPMSContext | null;
}

export default function AuthOverview({
  mt,
  withCloseButton,
  context,
}: AuthOverviewProps) {
  const { isWidgetSelected } = useWidgetSelection();
  const pathname = usePathname();
  const updateActiveWidget = useUpdateActiveWidget();
  const messageEditorContext = useMessageEditor();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, iconSize } = getCustomStyles(
    theme,
    colorScheme
  );

  // State
  const [showJson, setShowJson] = useState<boolean>(false);

  // Helpers
  const isEmp = true; // TODO
  const authenticationDataRecords: AuthenticationDataRecord[] =
    context &&
    context.data &&
    context.data.config &&
    context.data.config.authentication_data_records
      ? context.data.config.authentication_data_records
      : [];
  const convertedAuthenticationDataRecords: any[] = useMemo(() => {
    return authenticationDataRecords.reduce((t: any[], record) => {
      const keys = Object.keys(record.Identification);
      const values = Object.values(record.Identification);
      if (keys.length < 1) {
        return t;
      }
      return [
        ...t,
        {
          type: keys[0],
          ...flattenObject(values.length < 1 ? {} : values[0]),
        },
      ];
    }, []);
  }, [authenticationDataRecords.length]);
  const allTypes: string[] = useMemo(() => {
    const withDuplicates = convertedAuthenticationDataRecords.map(
      (convertedRecord) => convertedRecord.type
    );
    return withDuplicates.filter((e, i) => withDuplicates.indexOf(e) === i);
  }, [authenticationDataRecords.length]);
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: "Type",
        accessorKey: "type",
        filterVariant: "select",
        mantineFilterMultiSelectProps: {
          data: allTypes,
        },
        size: 250,
      },
      {
        header: "UID",
        accessorKey: "UID",
        size: 200,
      },
      {
        header: "EvcoID",
        accessorKey: "EvcoID",
        size: 200,
      },
      {
        header: "RFID",
        accessorKey: "RFID",
        size: 200,
      },
      {
        header: "PIN",
        accessorKey: "PIN",
        size: 200,
      },
      {
        header: "Hashed PIN Value",
        accessorKey: "HashedPIN Value",
        size: 250,
      },
      // {
      //   header: "Message",
      //   accessorKey: "message",
      //   enableGrouping: false,
      //   size: 800,
      //   Cell: ({ cell }) => (
      //     <ScrollArea
      //       w={cell.column.getSize()}
      //       type="hover"
      //       scrollbarSize={8}
      //       scrollHideDelay={20}
      //       classNames={scrollAreaClasses}
      //     >
      //       {cell.getValue<string>()}
      //     </ScrollArea>
      //   ),
      // },
    ],
    [allTypes]
  );
  const table = useMantineReactTable({
    columns,
    data: convertedAuthenticationDataRecords,
    enableColumnResizing: true,
    enableGrouping: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableRowPinning: true,
    enableColumnPinning: true,
    paginationDisplayMode: "pages",
    initialState: {
      density: "xs",
      expanded: true,
      grouping: [],
      pagination: { pageIndex: 0, pageSize: 20 },
      sorting: [],
    },
    mantineToolbarAlertBannerBadgeProps: {
      color: "blue",
      variant: "outline",
    },
    mantineTableContainerProps: {
      style: { maxHeight: "fit-content" },
    },
    mantinePaperProps: {
      shadow: "none",
    },
    mantineTableBodyProps: {
      style: {
        border: "none",
      },
    },
    enableRowActions: true,
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item
          onClick={() => {
            if (!messageEditorContext) {
              return;
            }
            const { setSelectedMessage, selectedProtocol, widgetRef } =
              messageEditorContext;
            if (selectedProtocol && isSameProtocol(oicpV23, selectedProtocol)) {
              const clickedAuth = { ...row.original };
              const type = clickedAuth.type;
              delete clickedAuth.type;
              setSelectedMessage("pushauthenticationdatav21", (sender) =>
                type
                  ? {
                      ActionType: "delete",
                      ProviderAuthenticationData: {
                        ProviderID: sender.id,
                        AuthenticationDataRecord: [
                          {
                            Identification: {
                              [type]: { ...clickedAuth },
                            },
                          },
                        ],
                      },
                    }
                  : { ActionType: "delete" }
              );
              setTimeout(() => {
                if (widgetRef && widgetRef.current) {
                  widgetRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }, 0);
            }
          }}
        >
          Delete
        </Menu.Item>
      </>
    ),
  });

  return (
    <Transition
      mounted={isWidgetSelected(pathname, authOverviewWidgetId)}
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
          {...widgetProps(updateActiveWidget, authOverviewWidgetId)}
        >
          {withCloseButton !== false && (
            <CloseButton widgetId={authOverviewWidgetId} />
          )}
          <Group justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <Title order={1} size="h3" lineClamp={1}>
                Authentication Records
              </Title>
              {/* Badges */}
            </Group>
            <Group gap="xs" wrap="nowrap">
              {isEmp && (
                <Button
                  onClick={() => {
                    if (!messageEditorContext) {
                      return;
                    }
                    const { setSelectedMessage, selectedProtocol, widgetRef } =
                      messageEditorContext;
                    if (
                      selectedProtocol &&
                      isSameProtocol(oicpV23, selectedProtocol)
                    ) {
                      setSelectedMessage("pushauthenticationdatav21", () => ({
                        ActionType: "insert",
                      }));
                      setTimeout(() => {
                        if (widgetRef && widgetRef.current) {
                          widgetRef.current.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      }, 0);
                    }
                  }}
                  variant="default"
                  leftSection={<IconPlus size={iconSize} />}
                >
                  Add Record
                </Button>
              )}
              <Button
                onClick={() => {
                  setShowJson(!showJson);
                }}
                variant="default"
                leftSection={
                  showJson ? (
                    <IconTable size={iconSize} />
                  ) : (
                    <IconBraces size={iconSize} />
                  )
                }
              >
                {showJson ? "Show Table " : "Show JSON"}
              </Button>
              {/* Buttons*/}
            </Group>
          </Group>
          <Divider my="md" />
          {!context ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <>
              {showJson ? (
                <JsonInput
                  onChange={() => {}}
                  value={JSON.stringify(authenticationDataRecords, null, 2)}
                  autosize
                  minRows={1}
                  formatOnBlur
                />
              ) : (
                <MantineReactTable table={table} />
              )}
            </>
          )}
        </Paper>
      )}
    </Transition>
  );
}

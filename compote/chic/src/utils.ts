import {
  MantineColor,
  MantineColorScheme,
  MantineColorShade,
  MantinePrimaryShade,
  MantineTheme,
  rgba,
  ScrollAreaProps,
  toRgba,
} from "@mantine/core";
import {
  IconBolt,
  IconChargingPile,
  IconFileOrientation,
  IconGauge,
  IconLogs,
  IconSettings,
  IconTelescope,
} from "@tabler/icons-react";
import {
  ArchivedProtocolMessage,
  ChargingStationConnectorRaw,
  isTransaction2,
  LogConstraint,
  MessageRecipient,
  MessageSender,
  MeterValue,
  MeterValueInContext,
  ParticipantRole,
  Protocol,
  ProtocolSelectionAid,
  Role,
  Transaction,
  Transaction2,
} from "./types";
import { isPublicPath, isRelatedPath, roles } from "./permissions";
import { vanillaRenderers } from "@jsonforms/vanilla-renderers";
import { Ocpp20Schemas } from "ocpp-standard-schema"; // Found on NPM
import mantineRenderers from "./components/JSONForms/mantine-renderers";
import protocolSpecifications from "@/protocol-specifications";
import {
  iframeWidgetIdPrefix,
  IframeWidgetProps,
} from "./components/IframeWidget";
import scrollAreaClasses from "./styles/ScrollArea.module.css";

export const pages = [
  { icon: IconGauge, label: "Dashboard", href: "/" },
  {
    icon: IconChargingPile,
    label: "Charging Stations",
    href: "/charging-stations",
  },
  { icon: IconBolt, label: "EMP Page", href: "/emp" },
  { icon: IconTelescope, label: "Telemetry", href: "/telemetry" },
  {
    icon: IconFileOrientation,
    label: "Documentation for CPO-related APIs",
    href: "/cpo/apis",
  },
  {
    icon: IconFileOrientation,
    label: "Documentation for EMP-related APIs",
    href: "/emp/apis",
  },
  { icon: IconLogs, label: "Status Logs", href: "/logs" },

  { icon: IconSettings, label: "Settings", href: "/settings" },
];

const isMantinePrimaryShade = (
  primaryShade: MantinePrimaryShade | MantineColorShade
): primaryShade is MantinePrimaryShade => {
  if (isNaN(Number(primaryShade))) {
    return true;
  }
  return false;
};

export const getCustomStyles: (
  theme: MantineTheme,
  colorScheme: MantineColorScheme
) => {
  transparentBackground: string;
  connectorStatusColors: {
    [key: string]: MantineColor;
  };
  iconSize: string;
  primaryColor: string;
} = (theme, colorScheme) => {
  return {
    transparentBackground:
      colorScheme === "dark"
        ? rgba(theme.colors.dark[8], 0.8)
        : rgba(theme.white, 0.8),
    connectorStatusColors: {
      NoData:
        colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3],
      Stopped: "yellow",
      Available: "teal",
      Occupied: "yellow",
    },
    iconSize: "1.125em",
    primaryColor:
      theme.colors[theme.primaryColor][
        isMantinePrimaryShade(theme.primaryShade)
          ? theme.primaryShade[colorScheme === "auto" ? "light" : colorScheme]
          : theme.primaryShade
      ],
  };
};
export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const fetcher2 = (...args) => fetch(...args).then((res) => res.text());

export const defaultSWRConfig = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
  revalidateIfStale: false,
  revalidateOnReconnect: false,
  dedupingInterval: 1000,
  refreshInterval: 250,
};

export const defaultContainerSize = 1300;

export const transitionDurations = {
  short: 200,
  medium: 250,
  long: 500,
};

export const ocppV16: Protocol = {
  name: "OCPP",
  version: "1.6",
  specifications: [protocolSpecifications.cpoToCsOcppV16],
};

export const ocppV201: Protocol = {
  name: "OCPP",
  version: "2.0.1",
  specifications: [protocolSpecifications.cpoToCsOcppV201],
};

export const oicpV23: Protocol = {
  name: "OICP",
  version: "2.3.0",
  specifications: [
    protocolSpecifications.empToEroaming,
    protocolSpecifications.cpoToEroaming,
  ],
};

export const mqtt: Protocol = {
  name: "MQTT",
  version: "5.0",
  specifications: [protocolSpecifications.cpoToEverest],
};

export const protocols: Protocol[] = [ocppV16, ocppV201, oicpV23, mqtt];

export const ISO15118SchemaKeys = [
  "AuthorizeRequest",
  "AuthorizeResponse",
  "CertificateSignedRequest",
  "CertificateSignedResponse",
  "DeleteCertificateRequest",
  "DeleteCertificateResponse",
  "Get15118EVCertificateRequest",
  "Get15118EVCertificateResponse",
  "GetCertificateStatusRequest",
  "GetCertificateStatusResponse",
  "GetInstalledCertificateIdsRequest",
  "GetInstalledCertificateIdsResponse",
  "InstallCertificateRequest",
  "InstallCertificateResponse",
  "SignCertificateRequest",
  "SignCertificateResponse",
  "TriggerMessageRequest",
  "TriggerMessageResponse",
];

export const ISO15118Schemas = Object.keys(Ocpp20Schemas).reduce(
  (schemas: { [key: string]: any }, key) => {
    if (!ISO15118SchemaKeys.includes(key)) {
      delete schemas[key];
    }
    return schemas;
  },
  { ...Ocpp20Schemas }
);

export const renderers = [...vanillaRenderers, ...mantineRenderers];

export const emptyObjectStateCallback = (prev: any) => {
  const emptyObject = { ...prev };
  for (let key of Object.keys(emptyObject)) {
    delete emptyObject[key];
  }
  return emptyObject;
};

export const isAllowedPathRole: (path: string, role: Role) => boolean = (
  path,
  role
) => {
  return Boolean(role.allowedRoutes.find((r) => isRelatedPath(r, path)));
};

export const determineRoleAffiliation: (path: string) => Role | undefined = (
  path
) => {
  if (isPublicPath(path)) {
    return undefined;
  }
  const affiliatedRoles = Object.values(roles).filter(
    (r: Role) => isAllowedPathRole(path, r) && r.combination === false
  );
  if (affiliatedRoles.length !== 1) {
    return undefined;
  }
  return affiliatedRoles[0];
};

export const mermaidDirective: (colorScheme: MantineColorScheme) => string = (
  colorScheme
) => `%%{init: {'theme': '${colorScheme === "dark" ? "dark" : "default"}'}}%%`;

const withLineBreaks: (str: string, interval: number) => string = (
  str,
  interval
) => {
  const lines = [];
  let remaining = str;
  while (remaining.length > 0) {
    lines.push(remaining.substring(0, interval));
    remaining = remaining.substring(interval);
  }
  return lines.join("<br/>");
};
const truncateString: (str: string, maxLength: number) => string = (
  str,
  maxLength
) => {
  if (str.length > maxLength) {
    return `${str.substring(0, maxLength)}...`;
  }
  return str;
};

const protocolParticipantRoleToString: (role: string) => string = (role) => {
  if (role === "eRoaming") {
    return "eRoaming Platform";
  }
  return role;
};
export const recipientToString: (recipient: MessageRecipient) => string = (
  recipient
) => {
  if (recipient.name) {
    return recipient.name;
  }
  const roleString = protocolParticipantRoleToString(recipient.role);
  if (recipient.id) {
    return `${recipient.id} (${roleString})`;
  }
  return `Unspecified ${protocolParticipantRoleToString(recipient.role)}`;
};
export const senderToString = (sender: MessageSender) => {
  return recipientToString(sender);
};

export const generateMermaidSequenceDiagram: (
  messageHistory: ArchivedProtocolMessage[],
  withDetails: boolean,
  theme: MantineTheme,
  colorScheme: MantineColorScheme
) => string = (messageHistory, withDetails, theme, colorScheme) => {
  const unknownSender: string = "Unspecified Sender";
  const unknownRecipient: string = "Unspecified Recipient";
  const participants = messageHistory.reduce(
    (t: string[], message: ArchivedProtocolMessage) => {
      const newParticipants: string[] = [];
      if (message.sender) {
        newParticipants.push(senderToString(message.sender));
      } else {
        if (!t.includes(unknownSender)) {
          newParticipants.push(unknownSender);
        }
      }
      if (message.recipient) {
        newParticipants.push(recipientToString(message.recipient));
      } else {
        if (!t.includes(unknownRecipient)) {
          newParticipants.push(unknownRecipient);
        }
      }
      return [...t, ...newParticipants];
    },
    []
  );
  const errorHighlightRgb =
    colorScheme === "dark"
      ? toRgba(theme.colors.red[9])
      : toRgba(theme.colors.red[2]);
  // const sender = "Message Editor";
  let diagram = "sequenceDiagram\n";
  // diagram += `participant ${sender}\n`;
  participants.forEach((p) => {
    diagram += `participant ${p}\n`;
  });
  messageHistory.forEach((message) => {
    const sender = message.sender
      ? senderToString(message.sender)
      : unknownSender;
    const recipient = message.recipient
      ? recipientToString(message.recipient)
      : unknownRecipient;
    const isRecipientRightOfSender: boolean =
      participants.indexOf(recipient) > participants.indexOf(sender);
    if (withDetails && !message.response.ok) {
      diagram += `rect rgb(${errorHighlightRgb.r}, ${errorHighlightRgb.g}, ${errorHighlightRgb.b})\n`;
    }
    diagram += `${sender} -${message.response.ok ? ">>" : "x"} ${
      recipient
    }: ${`${withDetails ? `${message.protocol} : ` : ""}${
      message.request.name
    }`}\n`;
    diagram += `activate ${recipient}\n`;
    if (withDetails) {
      diagram += `note ${isRecipientRightOfSender ? "right" : "left"} of ${sender}: ${withLineBreaks(
        truncateString(JSON.stringify(message.request.messageData), 260),
        45
      ).replaceAll(";", "#59;")}\n`;
    }
    if (withDetails && message.response.data) {
      diagram += `note ${isRecipientRightOfSender ? "left" : "right"} of ${recipient}: ${withLineBreaks(truncateString(JSON.stringify(message.response.data), 260), 45).replaceAll(";", "#59;")}\n`;
    }
    diagram += `${recipient} ${
      message.response.ok ? "-" : "--"
    }>> ${sender}: ${`${
      withDetails ? `Status ${message.response.status} : ` : ""
    }${withLineBreaks(truncateString(message.response.message, 180), 45)}`}\n`;
    diagram += `deactivate ${recipient}\n`;
    if (withDetails && !message.response.ok) {
      diagram += "end\n";
    }
  });
  return diagram;
};

export const chargingStationName: (id: string) => string = (id) =>
  `Charging Station ${id}`;

export const removeSuffix: (key: string, suffixes: Array<string>) => string = (
  key,
  suffixes
) => {
  for (let suffix of suffixes) {
    if (key.substring(key.length - suffix.length) === suffix) {
      return key.substring(0, key.length - suffix.length);
    }
  }
  return key;
};

export const widgetProps = (
  updateActiveWidget: Function,
  widgetId: string
) => ({
  onMouseEnter: () => {
    updateActiveWidget(widgetId);
  },
  onMouseLeave: () => {
    updateActiveWidget(null);
  },
});

export const timeDelta: (date: Date) => string = (date) => {
  const minutes = Math.floor(
    Math.abs(new Date().getTime() - date.getTime()) / 1000 / 60
  );
  return `${minutes} mins`;
};

export const getMantineColorRandom: (
  theme: MantineTheme,
  usedColors?: Array<string>,
  includedShades?: Array<number>,
  excludedColors?: Array<string>
) => string = (
  theme,
  usedColors = [],
  includedShades,
  excludedColors = ["dark"]
) => {
  const shades =
    includedShades ||
    Array(10)
      .fill(1)
      .map((x, y) => x + y - 1);
  const possibleColors = [];
  for (let baseColor of Object.keys(theme.colors).filter(
    (c) => !excludedColors.includes(c)
  )) {
    for (let shade of shades) {
      possibleColors.push(`${baseColor}.${shade}`);
    }
  }
  if (possibleColors.filter((c) => !usedColors.includes(c)).length === 0) {
    usedColors = [];
  }
  let color;
  do {
    color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
  } while (usedColors.includes(color));
  return color;
};

export const getMantineColorPalette: (
  theme: MantineTheme,
  keys: string[],
  includedShades?: Array<number>,
  excludedColors?: Array<string>
) => { [index: string]: string } = (
  theme,
  keys,
  includedShades,
  excludedColors
) => {
  const colorPalette: { [index: string]: string } = {};
  for (let key of keys) {
    if (colorPalette[key] !== undefined) {
      continue;
    }
    colorPalette[key] = getMantineColorRandom(
      theme,
      Object.values(colorPalette),
      includedShades,
      excludedColors
    );
  }
  return colorPalette;
};

export const organizeMeterValues = (
  meterValues: MeterValueInContext[],
  connectorId: string,
  transactionId?: string
): MeterValue[] => {
  return meterValues
    .filter((c) => c !== null)
    .flat()
    .reduce((t: MeterValue[], c) => {
      return [
        ...t,
        ...c.sampled_value.map((v) => ({
          ...v,
          time: new Date(c.timestamp),
          connectorId,
          connectorName: `Connector ${connectorId}`,
          transactionId,
        })),
      ];
    }, []);
};

export const extractMeterValuesFromTransaction: (
  transaction: Transaction | Transaction2,
  connectorId: string
) => MeterValue[] = (transaction, connectorId) => {
  if (isTransaction2(transaction)) {
    return [];
  }
  return organizeMeterValues(
    [
      ...(transaction.meter_start || []),
      ...(transaction.meter_values || []),
      ...(transaction.meter_stop || []),
    ],
    connectorId,
    transaction.id
  );
};

export const extractMeterValuesFromConnector: (
  connector: ChargingStationConnectorRaw,
  connectorId: string
) => MeterValue[] = (connector, connectorId) => {
  return [
    ...connector.transactions
      .map((t) => extractMeterValuesFromTransaction(t, connectorId))
      .flat(),
    ...organizeMeterValues(connector.meter_values, connectorId),
  ];
};

export const logLevels: { name: string; colors: string[] }[] = [
  {
    name: "INFO",
    colors: ["blue", "cyan"],
  },
  {
    name: "ERROR",
    colors: ["red", "yellow"],
  },
  {
    name: "Others",
    colors: ["gray", "dark"],
  },
];

export const isValidLogConstraints = (logConstraints: LogConstraint[][]) => {
  if (logConstraints.map((cs) => cs.length).includes(0)) {
    return false;
  }
  if (
    logConstraints
      .map((cs) => cs.length === new Set(cs.map((c) => c.field)).size)
      .includes(false)
  ) {
    return false;
  }
  return true;
};

export const logConstraintsToString = (logConstraints: LogConstraint[]) => {
  return logConstraints
    .map((c) => `${c.field} ${c.operator} ${c.value}`)
    .join(", ");
};

export const stringifyNumber = (n: number) => {
  if (n > 99) {
    return `${n}.`;
  }
  const special = [
    "zeroth",
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "ninth",
    "tenth",
    "eleventh",
    "twelfth",
    "thirteenth",
    "fourteenth",
    "fifteenth",
    "sixteenth",
    "seventeenth",
    "eighteenth",
    "nineteenth",
  ];
  const deca = [
    "twent",
    "thirt",
    "fort",
    "fift",
    "sixt",
    "sevent",
    "eight",
    "ninet",
  ];
  if (n < 20) return special[n];
  if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + "ieth";
  return deca[Math.floor(n / 10) - 2] + "y-" + special[n % 10];
};

export const capitalize = (str: string) => {
  if (str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const uniqueProtocolString = (protocol: Protocol) =>
  `${protocol.name} v${protocol.version}`; // Must be unique for every protocol

export const isSameProtocol = (protocol1: Protocol, protocol2: Protocol) => {
  return uniqueProtocolString(protocol1) === uniqueProtocolString(protocol2);
};

export const flattenObject: (
  obj: { [index: string]: any },
  parentKey?: string
) => { [index: string]: any } = (obj, parentKey = "") => {
  const result: { [index: string]: any } = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey} ${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(result, flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
};

export const compatibleProtocolSpecificationExists: (
  senderRole: ParticipantRole,
  recipientRole: ParticipantRole
) => boolean = (senderRole, recipientRole) =>
  protocols.reduce((t, protocol) => {
    const compatibleSpecifications = protocol.specifications.filter(
      (s) => s.recipientRole === recipientRole && s.senderRole === senderRole
    );
    if (compatibleSpecifications.length > 0) {
      return true;
    }
    return t;
  }, false);

export const getAvailableProtocols: (
  aid: ProtocolSelectionAid
) => Protocol[] = (aid) =>
  protocols.filter((p) =>
    aid.filterAvailableProtocolsCallback
      ? aid.filterAvailableProtocolsCallback(p)
      : true
  );

export const getDefaultProtocol: (
  aid: ProtocolSelectionAid
) => Protocol | null = (aid) => {
  const availableProtocols = getAvailableProtocols(aid);
  return (
    availableProtocols.find((p) =>
      aid.findDefaultProtocolCallback
        ? aid.findDefaultProtocolCallback(p)
        : false
    ) || null
  );
};

export const getIframeWidgetId: (widgetProps: IframeWidgetProps) => string = (
  widgetProps
) => {
  return `${iframeWidgetIdPrefix}${widgetProps.url}`;
};

export const isUrlReachable: (url: string) => Promise<boolean> = async (
  url
) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "HEAD",
    })
      .then((response) => {
        resolve(response.ok);
        // resolve(response.status.toString()[0] === "2");
      })
      .catch((error) => {
        reject(false);
      });
  });
};

export const scrollAreaOptions = {
  scrollbarSize: 8,
  scrollHideDelay: 20,
  classNames: scrollAreaClasses,
};

export const scrollAreaProps: ScrollAreaProps = {
  ...scrollAreaOptions,
  type: "hover",
};

export const isServiceOnline = (traces: any, serviceName: string): boolean => {
  return true;
};

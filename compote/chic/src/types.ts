import { JsonSchema } from "@jsonforms/core";
import { IndicatorProps, MantineSize } from "@mantine/core";
// import { Ocpp16Schemas, Ocpp20Schemas } from "ocpp-standard-schema";
import { EMPOICPClientAPIApi } from "./components/API clients/EMPMS";
import { AxiosResponse } from "axios";
import { OCPPv16Api, OCPPv201Api } from "./components/API clients/CSMS";
import { BuiltInNode, Edge, Node } from "@xyflow/react";
import {
  Dispatch,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  SetStateAction,
} from "react";
import { Icon, IconProps } from "@tabler/icons-react";
import { CPOOICPClientAPIApi } from "./components/API clients/CSMS-OICP-API";
import { ContextManagementApi } from "./components/API clients/Everest";

export interface Role {
  name: string;
  allowedRoutes: string[];
  allowedCommunicationPaths: CommuncationPath[];
  color: string;
  combination?: boolean; // Indicates if the role is a combination of other roles (e. g. CPO and EMP)
}
export interface UserMetadata {
  id: string;
  name: string;
  role: Role;
}
export interface ProtocolMessage {
  name: string;
  schema: JsonSchema | any;
  send: (
    api:
      | EMPOICPClientAPIApi
      | OCPPv16Api
      | OCPPv201Api
      | CPOOICPClientAPIApi
      | ContextManagementApi,
    schemaData: any,
    sender?: MessageSender,
    recipient?: MessageRecipient
  ) => void | Promise<AxiosResponse<any>>; // void if unexpected params are passed
  defaultValuesCallback?: (
    sender: MessageSender,
    recipient: MessageRecipient
  ) => { [index: string]: any };
}
export type ParticipantRole = "CS" | "CPO" | "EMP" | "eRoaming" | "Everest";
export interface ProtocolSpecification {
  senderRole: ParticipantRole;
  recipientRole: ParticipantRole;
  providedMessages: { [index: string]: ProtocolMessage };
}
export interface Protocol {
  name: string;
  version: string;
  specifications: ProtocolSpecification[];
}
export interface ProtocolMessageRequest extends ProtocolMessage {
  messageData: any;
}
export interface ProtocolMessageResponse {
  ok: boolean;
  message: string;
  data?: any;
  status?: number;
}
export interface ArchivedProtocolMessage {
  protocol: string; // unique string
  request: ProtocolMessageRequest;
  response: ProtocolMessageResponse;
  recipient?: MessageRecipient;
  sender?: MessageSender;
}
export interface OCPPMessage2 {
  fun_name: string;
  type: "req" | "resp";
  args:
    | {
        args: null | Object;
        kwargs: { vendor_id: string; message_id: string; data: string };
        fun_name: string;
        func: null;
        type: "req" | "resp";
      }
    | { status: string }
    | string;
  time_start: string;
}
export interface WidgetConfiguration {
  widgetId: string;
  name: string;
  initialValue?: boolean;
}
export interface MeterValueRaw {
  // interface derived from context_charging_ocpp201.json
  context: string;
  location: string;
  measurand: string;
  phase: string;
  unit_of_measure: {
    unit: string;
  };
  value: number;
}
export interface MeterValuesCluster {
  // interface derived from context_charging_ocpp201.json
  sampled_value: MeterValueRaw[];
  timestamp: string;
}
export interface MeterValue extends MeterValueRaw {
  time: Date;
  connectorId: string;
  connectorName: string;
  transactionId?: string;
}
export interface ProcessedMeterValue {
  meterValues: MeterValue[];
  referenceTime: Date;
  phase: string;
  timeString: string;
  unit: string;
}
export const isProcessedMeterValue = (
  x: ProcessedMeterValue | FillerMeterValue
): x is ProcessedMeterValue => {
  if ("unit" in x) {
    return true;
  }
  return false;
};
export interface FillerMeterValue {
  referenceTime: Date;
  timeString: string;
}
export type MeterValueInContext =
  | MeterValuesCluster[]
  | MeterValuesCluster
  | null;
export interface Transaction {
  // interface derived from context_charging_ocpp201.json
  id: string;
  status: string;
  idTag: string;
  meter_start: MeterValueInContext[];
  meter_values: MeterValueInContext[];
  meter_stop: MeterValueInContext[];
}
export interface Transaction2 {
  // interface derived from context_charging_ocpp201.json
  id: number;
  status: string;
  idTag: string;
  meter_start: number;
  meter_stop: number;
  timestamp_start: string;
  timestamp_stop: string;
}
export const isTransaction2 = (
  x: Transaction | Transaction2
): x is Transaction2 => {
  if (
    typeof x.meter_start === "number" ||
    typeof x.meter_stop === "number" ||
    !("meter_values" in x)
  ) {
    return true;
  }
  return false;
};
export interface ChargingStationConnectorRaw {
  status: Array<ConnectorStatus | ConnectorStatus2>;
  transactions: (Transaction | Transaction2)[];
  meter_values: MeterValueInContext[];
}
export interface ChargingStationConnector extends ChargingStationConnectorRaw {
  id: string;
}
export interface ConnectorStatus {
  [index: string]: any;
  connector_id: number;
  error_code: string;
  kwargs: Object;
  timestamp: string;
  status: "Available" | "Stopped" | "Occupied";
}
export interface ConnectorStatus2 {
  [index: string]: any;
  connector_id: number;
  evse_id: number;
  kwargs: Object;
  timestamp: string;
  connector_status: "Available" | "Stopped" | "Occupied";
}
export interface ContextMessages {
  messages_in: {
    [index: string]: number;
  };
  messages_out: {
    [index: string]: number;
  };
  last_messages: OCPPMessage2[];
  messages_delta: { [index: string]: number[] };
}
export interface WidgetComponentProps {
  withCloseButton?: boolean;
  mt?: MantineSize | number;
  radius?: MantineSize | number;
}
export interface Log {
  asctime: string;
  message: string;
  levelname: string;
  name: string;
  taskName: string;
  message_type: string;
  function: string;
  arguments: { [index: string]: any };
}
export interface Log2 extends Log {
  remote_address: string;
  request_start_time: string;
  first_request_line: string;
  response_status: number;
  response_size: number;
  request_header: {
    Referer: string;
    "User-Agent": string;
  };
}
export interface LogData {
  date: string;
  time: string;
  level: string;
  name: string;
  task: string;
  type: string;
  function: string;
  message: string;
  arguments: string;
}
export interface LogConstraint {
  field: string;
  operator: "must include" | "must be equal to";
  value: string;
}
export interface LogsSequence {
  id: string;
  logConstraints: LogConstraint[][]; // One log can have multiple constraints
}
export interface MessageRecipient {
  role: ParticipantRole;
  id?: string;
  name?: string;
}
export interface MessageSender {
  role: ParticipantRole;
  id?: string;
  name?: string;
}
export interface CSMSContext {
  connectors: { [index: string]: ChargingStationConnectorRaw };
  [index: string]: any;
}
export interface EMPMSContext {
  [index: string]: any;
}
export interface AuthenticationDataRecord {
  Identification: {
    RFIDMifareFamilyIdentification?: {
      UID: string;
    };
    RFIDIdentification?: {
      UID: string;
      RFID: string;
      EvcoID?: string;
      PrintedNumber?: string;
      ExpiryData?: string;
    };
    QRCodeIdentification?: {
      EvcoID: string;
      HashedPIN?: {
        Value: string;
        Function: "Bcrypt";
        LegacyHashData?: {
          Function: "MD5" | "SHA-1";
          Salt?: string;
          Value?: string;
        };
      };
      PIN?: string;
    };
    PlugAndChargeIdentification: {
      EvcoID: string;
    };
    RemoteIdentification: {
      EvcoID: string;
    };
  };
}
export type CsNode = Node<{}, "cs">;
export type CpoNode = Node<{}, "cpo">;
export type EmpNode = Node<{}, "emp">;
export type ERoamingNode = Node<{}, "eroaming">;
export type HeaderBodyNode = Node<
  {
    label: string;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
    includeHandlesRight?: boolean;
    includeHandlesLeft?: boolean;
    body?: ReactNode;
    menuDropdown?: (
      setShowMenu: Dispatch<SetStateAction<boolean>>
    ) => ReactNode;
    indicatorProps?: IndicatorProps;
  },
  "headerbody"
>;
export type AppNode =
  | CsNode
  | CpoNode
  | EmpNode
  | ERoamingNode
  | HeaderBodyNode
  | BuiltInNode;
export type BidirectionalMenuEdge = Edge<
  {
    menuDropdown: (setShowMenu: Dispatch<SetStateAction<boolean>>) => ReactNode;
    subLabel?: ReactNode;
    subLabelOffset?: number;
    leftSection?: ReactNode;
  },
  "bidirectionalmenu"
>;
export interface CommuncationPath {
  senderRole: ParticipantRole;
  recipientRole: ParticipantRole;
}
export type InterParticipantEdge = Edge<
  {
    communicationPath: CommuncationPath;
  },
  "interparticipant"
>;
export interface ProtocolSelectionAid {
  communicationPath: CommuncationPath;
  filterAvailableProtocolsCallback?: (protocol: Protocol) => boolean;
  findDefaultProtocolCallback?: (protocol: Protocol) => boolean;
}
export interface EVSEStatus {
  EvseID: string;
  EvseStatus: string;
}
export interface OperatorEVSEStatus {
  OperatorID: string;
  OperatorName: string;
  EvseStatusRecord: EVSEStatus[];
}
export interface ChargingStationStatusDatum {
  EvseStatuses: { OperatorEvseStatus: OperatorEVSEStatus[] };
  StatusCode: { Code: string; Description: string; AdditionalInfo: string };
}

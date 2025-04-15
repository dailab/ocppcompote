import { OCPPv16Api, OCPPv201Api } from "@/components/API clients/CSMS";
import OcppSchemas from "@/components/JSONForms/schemas/OCPP"; // Generated from OpenAPI spec of CSMS
import { ProtocolSpecification } from "@/types";
import { Ocpp16Schemas } from "ocpp-standard-schema"; // Found on NPM

// from CPO to CS through OCPP v1.6
export const cpoToCsOcppV16: ProtocolSpecification = {
  senderRole: "CPO",
  recipientRole: "CS",
  providedMessages: {
    cancelreservation: {
      name: "Cancel Reservation",
      schema: OcppSchemas.OCPP16CancelReservationProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16CancelreservationPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        reservation_id: 0,
      }),
    },
    changeavailability: {
      name: "Change Availability",
      schema: OcppSchemas.OCPP16ChangeAvailabilityProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16ChangeavailabilityPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        connector_id: 0,
        type: "string",
      }),
    },
    changeconfiguration: {
      name: "Change Configuration",
      schema: OcppSchemas.OCPP16ChangeConfigurationProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16ChangeconfigurationPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        key: "string",
        value: "string",
      }),
    },
    clearcache: {
      name: "Clear Cache",
      schema: OcppSchemas.OCPP16ClearCacheProcessorBody,
      // schema: OcppSchemas.OCPP16ClearCacheProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16ClearcachePost(
          Number(recipient.id),
          schemaData
        );
      },
    },
    clearchargingprofile: {
      name: "Clear Charging Profile",
      schema: Ocpp16Schemas.ClearChargingProfileRequest,
      // schema: OcppSchemas.OCPP16ClearChargingProfileProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16ClearchargingprofilePost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        id: 0,
        connector_id: 0,
        charging_profile_purpose: "ChargePointMaxProfile",
        stack_level: 0,
      }),
    },
    datatransfer: {
      name: "Data Transfer",
      schema: OcppSchemas.OCPP16SendDataTransferProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16DatatransferPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        vendor_id: "org.openchargealliance.iso15118pnc",
      }),
    },
    extendedtriggermessage: {
      name: "Extended Trigger Message",
      schema: Ocpp16Schemas.ExtendedTriggerMessageRequest,
      // schema: OcppSchemas.OCPP16ExtendedTriggerMessageProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16ExtendedtriggermessagePost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        requested_message: "BootNotification",
        connector_id: 0,
      }),
    },
    getconfiguration: {
      name: "Get Configuration",
      schema: Ocpp16Schemas.GetConfigurationRequest,
      // schema: OcppSchemas.OCPP16GetConfigurationProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16GetconfigurationPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        key: ["string"],
      }),
    },
    getcompositeschedule: {
      name: "Get Composite Schedule",
      schema: OcppSchemas.OCPP16GetCompositeScheduleProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16GetcompositeschedulePost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        connector_id: 0,
        duration: 0,
        charging_rate_unit: "W",
      }),
    },
    getdiagnostics: {
      name: "Get Diagnostics",
      schema: OcppSchemas.OCPP16GetDiagnosticsProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16GetdiagnosticsPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        location: "string",
        retries: 0,
        retry_interval: 0,
        start_time: "string",
        stop_time: "string",
      }),
    },
    getlocallistversion: {
      name: "Get Local List Version",
      schema: OcppSchemas.OCPP16GetLocalListVersionProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16GetlocallistversionPost(
          Number(recipient.id),
          schemaData
        );
      },
    },
    heartbeat: {
      name: "Heartbeat",
      schema: OcppSchemas.OCPP16HeartbeatProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16HeartbeatPost(
          Number(recipient.id),
          schemaData
        );
      },
    },
    reset: {
      name: "Reset",
      schema: OcppSchemas.OCPP16ResetProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16ResetPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        type: "Hard",
      }),
    },
    reservenow: {
      name: "Reserve Now",
      schema: OcppSchemas.OCPP16ReserveNowProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16ReservenowPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        connector_id: 0,
        expiry_date: "string",
        id_tag: "string",
        reservation_id: 0,
        parent_id_tag: "string",
      }),
    },
    remotestarttransaction: {
      name: "Remote Start Transaction",
      schema: OcppSchemas.OCPP16RemoteStartTransactionProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16RemotestarttransactionPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        id_tag: "string",
        connector_id: 0,
        charging_profile: {},
      }),
    },
    remotestoptransaction: {
      name: "Remote Stop Transaction",
      schema: OcppSchemas.OCPP16RemoteStopTransactionProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16RemotestoptransactionPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        transaction_id: 0,
      }),
    },
    sendlocallist: {
      name: "Send Local List",
      schema: OcppSchemas.OCPP16SendLocalListProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16SendlocallistPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        list_version: 0,
        update_type: "Differential",
        local_authorization_list: ["string"],
      }),
    },
    setchargingprofile: {
      name: "Set Charging Profile",
      schema: Ocpp16Schemas.SetChargingProfileRequest,
      // schema: OcppSchemas.OCPP16SetChargingProfileProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16SetchargingprofilePost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        connector_id: 1,
        charging_profile: "string",
      }),
    },
    triggermessage: {
      name: "Trigger Message",
      schema: Ocpp16Schemas.TriggerMessageRequest,
      // schema: OcppSchemas.OCPP16TriggerMessageProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16TriggermessagePost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        requested_message: "BootNotification",
        connector_id: 0,
      }),
    },
    unlockconnector: {
      name: "Unlock Connector",
      schema: OcppSchemas.OCPP16UnlockConnectorProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv16Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV16UnlockconnectorPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        connector_id: 0,
      }),
    },
  },
};

// from CPO to CS through OCPP v2.0.1
export const cpoToCsOcppV201: ProtocolSpecification = {
  senderRole: "CPO",
  recipientRole: "CS",
  providedMessages: {
    reservenow: {
      name: "Reserve Now",
      schema: OcppSchemas.OCPP20ReserveNowProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20ReservenowPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        id: 0,
        expiry_date_time: "string",
        id_token: {},
        connector_type: "string",
        evse_id: 0,
        group_id_token: {},
        custom_data: {},
      }),
    },
    reset: {
      name: "Reset",
      schema: OcppSchemas.OCPP20ResetProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20ResetPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        type: "Hard",
        evse_id: 0,
        custom_data: {},
      }),
    },
    cancelreservation: {
      name: "Cancel Reservation",
      schema: OcppSchemas.OCPP20CancelReservationProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20CancelreservationPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        reservation_id: 0,
        custom_data: {},
      }),
    },
    changeavailability: {
      name: "Change Availability",
      schema: OcppSchemas.OCPP20ChangeAvailabilityProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20ChangeavailabilityPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        operational_status: "string",
        evse: {},
        custom_data: {},
      }),
    },
    clearcache: {
      name: "Clear Cache",
      schema: OcppSchemas.OCPP20ClearCacheProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20ClearcachePost(
          Number(recipient.id),
          schemaData
        );
      },
    },
    clearchargingprofile: {
      name: "Clear Charging Profile",
      schema: OcppSchemas.OCPP20ClearChargingProfileProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20ClearchargingprofilePost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        connector_id: 0,
        charging_profile_id: 0,
        charging_profile_criteria: {},
        custom_data: {},
      }),
    },
    datatransfer: {
      name: "Data Transfer",
      schema: OcppSchemas.OCPP20SendDataTransferProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20DatatransferPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        vendor_id: "string",
        message_id: "string",
        data: "string",
        custom_data: {},
      }),
    },
    getbasereport: {
      name: "Get Base Report",
      schema: OcppSchemas.OCPP20GetBaseReportProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20GetbasereportPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        request_id: 0,
        report_base: "string",
        custom_data: {},
      }),
    },
    getlocallistversion: {
      name: "Get Local List Version",
      schema: OcppSchemas.OCPP20GetLocalListVersionProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20GetlocallistversionPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        custom_data: {},
      }),
    },
    getvariables: {
      name: "Get Variables",
      schema: OcppSchemas.OCPP20GetVariablesProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20GetvariablesPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        get_variable_data: ["string"],
        custom_data: {},
      }),
    },
    getreport: {
      name: "Get Report",
      schema: OcppSchemas.OCPP20GetReportProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20GetreportPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        request_id: 0,
        component_variable: ["string"],
        component_criteria: ["string"],
        custom_data: {},
      }),
    },
    requeststarttransaction: {
      name: "Request Start Transaction",
      schema: OcppSchemas.OCPP20RemoteStartTransactionProcessorBody, // Ist es das Richtige?
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20RequeststarttransactionPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        id_token: {},
        remote_start_id: 0,
        evse_id: 0,
        group_id_token: {},
        charging_profile: {},
        custom_data: {},
      }),
    },
    requeststoptransaction: {
      name: "Request Stop Transaction",
      schema: OcppSchemas.OCPP20RemoteStopTransactionProcessorBody, // Ist es das Richtige?
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20RequeststoptransactionPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        transaction_id: "string",
        custom_data: {},
      }),
    },
    sendlocallist: {
      name: "Send Local List",
      schema: OcppSchemas.OCPP20SendLocalListProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20SendlocallistPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        list_version: 0,
        update_type: "Differential",
        local_authorization_list: ["string"],
        custom_data: {},
      }),
    },
    setvariables: {
      name: "Set Variables",
      schema: OcppSchemas.OCPP20SetVariablesProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20SetvariablesPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        set_variable_data: ["string"],
        custom_data: {},
      }),
    },
    unlockconnector: {
      name: "Unlock Connector",
      schema: OcppSchemas.OCPP20UnlockConnectorProcessorBody,
      send: (api, schemaData, _sender, recipient) => {
        if (!(api instanceof OCPPv201Api)) {
          return;
        }
        if (!recipient) {
          return;
        }
        return api.routeHandlerContextIdV20UnlockconnectorPost(
          Number(recipient.id),
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        evse_id: 0,
        connector_id: 0,
        custom_data: {},
      }),
    },
  },
};

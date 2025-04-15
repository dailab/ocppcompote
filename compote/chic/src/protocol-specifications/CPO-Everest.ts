import { ContextManagementApi } from "@/components/API clients/Everest";
import everestSchemas from "@/components/JSONForms/schemas/CPO-Everest/MQTT"; // Generated from OpenAPI spec of CSMS
import { ProtocolSpecification } from "@/types";

export const cpoToEverest: ProtocolSpecification = {
  senderRole: "CPO",
  recipientRole: "Everest",
  providedMessages: {
    showcontext: {
      name: "Show Context",
      schema: {},
      send: (api) => {
        if (!(api instanceof ContextManagementApi)) {
          return;
        }
        return api.showContextContextGet();
      },
    },
    updatecontext: {
      name: "Update Context",
      schema: everestSchemas.UpdateContext.post.parameters.query,
      send: (api, schemaData) => {
        if (!(api instanceof ContextManagementApi)) {
          return;
        }
        if (typeof schemaData !== "object") {
          return;
        }
        return api.updateContextUpdateContextPost(
          schemaData["key"],
          schemaData["value"]
        );
      },
    },
    getconnectorstate: {
      name: "Get Connector State",
      schema: everestSchemas.ConnectorStateId.get.parameters.query,
      send: (api, schemaData) => {
        if (!(api instanceof ContextManagementApi)) {
          return;
        }
        if (typeof schemaData !== "object") {
          return;
        }
        return api.getConnectorStateConnectorStateIdGet(
          schemaData["connector_id"]
        );
      },
    },
    startcharging: {
      name: "Start Charging",
      schema: everestSchemas.StartCharging.post.parameters.query,
      send: (api, schemaData) => {
        if (!(api instanceof ContextManagementApi)) {
          return;
        }
        if (typeof schemaData !== "object") {
          return;
        }
        return api.startchargingStartchargingPost(
          schemaData["commands"],
          schemaData["connector_id"]
        );
      },
      defaultValuesCallback: () => ({
        commands:
          everestSchemas.StartCharging.post.parameters.query.properties.commands
            .default,
        connector_id:
          everestSchemas.StartCharging.post.parameters.query.properties
            .connector_id.default,
      }),
    },
    startchargingiso15118: {
      name: "Start Charging ISO15118",
      schema: everestSchemas.StartChargingIso15118.post.parameters.query,
      send: (api, schemaData) => {
        if (!(api instanceof ContextManagementApi)) {
          return;
        }
        if (typeof schemaData !== "object") {
          return;
        }
        return api.startchargingStartchargingPost(
          schemaData["commands"],
          schemaData["connector_id"]
        );
      },
      defaultValuesCallback: () => ({
        commands:
          everestSchemas.StartChargingIso15118.post.parameters.query.properties
            .commands.default,
        connector_id:
          everestSchemas.StartChargingIso15118.post.parameters.query.properties
            .connector_id.default,
      }),
    },
    unplug: {
      name: "Unplug",
      schema: everestSchemas.Unplug.post.parameters.query,
      send: (api, schemaData) => {
        if (!(api instanceof ContextManagementApi)) {
          return;
        }
        if (typeof schemaData !== "object") {
          return;
        }
        return api.unplugUnplugPost(
          schemaData["commands"],
          schemaData["connector_id"]
        );
      },
      defaultValuesCallback: () => ({
        commands:
          everestSchemas.Unplug.post.parameters.query.properties.commands
            .default,
        connector_id:
          everestSchemas.Unplug.post.parameters.query.properties.connector_id
            .default,
      }),
    },
    authorize: {
      name: "Authorize",
      schema: everestSchemas.Authorize.post.parameters.query,
      send: (api, schemaData) => {
        if (!(api instanceof ContextManagementApi)) {
          return;
        }
        if (typeof schemaData !== "object") {
          return;
        }
        return api.authorizeAuthorizePost(
          schemaData["token"],
          schemaData["connector_id"]
        );
      },
      defaultValuesCallback: () => ({
        token:
          everestSchemas.Authorize.post.parameters.query.properties.token
            .default,
        connector_id:
          everestSchemas.Authorize.post.parameters.query.properties.connector_id
            .default,
      }),
    },
  },
};

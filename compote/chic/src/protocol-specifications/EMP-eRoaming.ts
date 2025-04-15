import { ProtocolSpecification } from "@/types";
import oicp23Schemas from "@/components/JSONForms/schemas/OICP-2.3"; // Generated from OpenAPI spec of EMPMS
import { EMPOICPClientAPIApi } from "@/components/API clients/EMPMS";

// from EMP to eRoaming through OICP v2.3.0
export const empToEroaming: ProtocolSpecification = {
  senderRole: "EMP",
  recipientRole: "eRoaming",
  providedMessages: {
    pullpricingproductdatav10: {
      name: "Pull Pricing Product Data",
      schema: oicp23Schemas.eRoamingPullPricingProductData,
      send: (api, schemaData, sender) => {
        if (!(api instanceof EMPOICPClientAPIApi)) {
          return;
        }
        if (!sender) {
          return;
        }
        return api.eRoamingPullPricingProductDataV10Pullpricingproductdatav10Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        LastCall: "2020-09-23T14:33:42.246000+00:00",
        OperatorIDs: ["DE*ABC"],
      }),
    },
    pullevsepricingv10: {
      name: "Pull EVSE Pricing",
      schema: oicp23Schemas.eRoamingPullEVSEPricing,
      send: (api, schemaData, sender) => {
        if (!(api instanceof EMPOICPClientAPIApi)) {
          return;
        }
        if (!sender) {
          return;
        }
        return api.eRoamingPullEVSEPricingV10Pullevsepricingv10Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        ProviderID: sender.id,
        LastCall: "2020-09-23T14:33:42.246000Z",
        OperatorIDs: ["DE*ABC"],
      }),
    },
    authorizeremotereservationstartv11: {
      name: "Authorize Remote Reservation Start",
      schema: oicp23Schemas.eRoamingAuthorizeRemoteReservationStart,
      send: (api, schemaData, sender) => {
        if (!(api instanceof EMPOICPClientAPIApi)) {
          return;
        }
        if (!sender) {
          return;
        }
        return api.eRoamingAuthorizeRemoteReservationStartV11Authorizeremotereservationstartv11Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        SessionID: "b2688855-7f00-0002-6d8e-48d883f6abb6",
        CPOPartnerSessionID: "1234XYZ",
        ProviderID: sender.id,
        EvseID: "DE*XYZ*ETEST1",
        Identification: {
          RFIDMifareFamilyIdentification: {
            UID: "1234ABCD",
          },
          RFIDIdentification: {
            UID: "1234ABCD",
            EvcoID: "DE-DCB-C12345678-X",
            RFID: "mifareCls",
            PrintedNumber: "9876655",
            ExpiryDate: "2021-01-23T14:23:54.228Z",
          },
          QRCodeIdentification: {
            EvcoID: "DE-DCB-C12345678-X",
            HashedPIN: {
              Value: "a5ghdhf73h",
              Function: "Bcrypt",
              LegacyHashData: {
                Function: "MD5",
                Salt: "a5ghdhf73h",
                Value: "a5ghdhf73h",
              },
            },
            PIN: "1234",
          },
          PlugAndChargeIdentification: {
            EvcoID: "DE-DCB-C12345678-X",
          },
          RemoteIdentification: {
            EvcoID: "DE-DCB-C12345678-X",
          },
        },
        PartnerProductID: "Reservation",
        Duration: 15,
      }),
    },
    authorizeremotereservationstopv1: {
      name: "Authorize Remote Reservation Stop",
      schema: oicp23Schemas.eRoamingAuthorizeRemoteReservationStop,
      send: (api, schemaData, sender) => {
        if (!(api instanceof EMPOICPClientAPIApi)) {
          return;
        }
        if (!sender) {
          return;
        }
        return api.eRoamingAuthorizeRemoteReservationStopV1Authorizeremotereservationstopv1Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        SessionID: "b2688855-7f00-0002-6d8e-48d883f6abb6",
        CPOPartnerSessionID: "1234XYZ",
        ProviderID: sender.id,
        EvseID: "DE*XYZ*ETEST1",
      }),
    },
    authorizeremotestartv21: {
      name: "Authorize Remote Start",
      schema: oicp23Schemas.eRoamingAuthorizeRemoteStart,
      send: (api, schemaData, sender) => {
        if (!(api instanceof EMPOICPClientAPIApi)) {
          return;
        }
        if (!sender) {
          return;
        }
        return api.eRoamingAuthorizeRemoteStartV21Authorizeremotestartv21Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        SessionID: "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
        CPOPartnerSessionID: "1234XYZ",
        EMPPartnerSessionID: "2345ABC",
        ProviderID: "DE-DCB",
        EvseID: "DE*XYZ*ETEST1",
        Identification: {
          RFIDMifareFamilyIdentification: {
            UID: "1234ABCD",
          },
          RFIDIdentification: {
            UID: "1234ABCD",
            EvcoID: "DE-DCB-C12345678-X",
            RFID: "mifareCls",
            PrintedNumber: "9876655",
            ExpiryDate: "2021-01-23T14:21:36.954Z",
          },
          QRCodeIdentification: {
            EvcoID: "DE-DCB-C12345678-X",
            HashedPIN: {
              Value: "string123456",
              Function: "Bcrypt",
              LegacyHashData: {
                Function: "MD5",
                Salt: "string",
                Value: "string123456",
              },
            },
            PIN: "1234",
          },
          PlugAndChargeIdentification: {
            EvcoID: "DE-DCB-C12345678-X",
          },
          RemoteIdentification: {
            EvcoID: "DE-DCB-C12345678-X",
          },
        },
        PartnerProductID: "AC 1",
      }),
    },
    authorizeremotestopv21: {
      name: "Authorize Remote Stop",
      schema: oicp23Schemas.eRoamingAuthorizeRemoteStop,
      send: (api, schemaData, sender) => {
        if (!(api instanceof EMPOICPClientAPIApi)) {
          return;
        }
        if (!sender) {
          return;
        }
        return api.eRoamingAuthorizeRemoteStopV21Authorizeremotestopv21Post(
          sender.id,
          schemaData
        ); // sender.id richtig? Was ist mit externalId gemeint?
      },
      defaultValuesCallback: (sender) => ({
        SessionID: "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
        CPOPartnerSessionID: "1234XYZ",
        EMPPartnerSessionID: "2345ABC",
        ProviderID: sender.id,
        EvseID: "DE*XYZ*ETEST1",
      }),
    },
    getchargedetailrecordsv22: {
      name: "Get Charge Detail Records",
      schema: oicp23Schemas.eRoamingGetChargeDetailRecords,
      send: (api, schemaData, sender) => {
        if (!(api instanceof EMPOICPClientAPIApi)) {
          return;
        }
        if (!sender) {
          return;
        }
        return api.eRoamingGetChargeDetailRecordsV22Getchargedetailrecordsv22Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        ProviderID: sender.id,
        From: "2020-08-23T14:20:10.285000Z",
        To: "2020-09-23T14:20:10.285000Z",
        SessionID: ["f98efba4-02d8-4fa0-b810-9a9d50d2c527"],
        OperatorID: "DE*ABC",
      }),
    },
    pushauthenticationdatav21: {
      name: "Push Authentication Data",
      schema: oicp23Schemas.eRoamingPushAuthenticationData,
      send: (api, schemaData, sender) => {
        if (!(api instanceof EMPOICPClientAPIApi)) {
          return;
        }
        if (!sender) {
          return;
        }
        return api.eRoamingPushAuthenticationDataV21Pushauthenticationdatav21Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        ActionType: "fullLoad",
        ProviderAuthenticationData: {
          ProviderID: sender.id,
          AuthenticationDataRecord: [
            {
              Identification: {
                RFIDMifareFamilyIdentification: {
                  UID: "2A83155EE288040047C1",
                },
                RFIDIdentification: {
                  UID: "2A83155EE288040047C1",
                  EvcoID: "AB-123C12345678A",
                  RFID: "mifareFamily",
                  PrintedNumber: "string",
                  ExpiryDate: "string",
                },
                QRCodeIdentification: {
                  EvcoID: "AB-123C12345678A",
                  PIN: "1234",
                },
                PlugAndChargeIdentification: {
                  EvcoID: "AB-123C12345678A",
                },
                RemoteIdentification: {
                  EvcoID: "AB-123C12345678A",
                },
              },
            },
          ],
        },
      }),
    },
    pullevsedatav23: {
      name: "Pull EVSE Data",
      schema: oicp23Schemas.eRoamingPullEVSEData,
      send: (api, schemaData, sender) => {
        if (!(api instanceof EMPOICPClientAPIApi)) {
          return;
        }
        if (!sender) {
          return;
        }
        return api.eRoamingPullEvseDataV23Pullevsedatav23Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender, recipientRole) => ({
        ProviderID: sender.id,
        SearchCenter: {
          GeoCoordinates: {
            Google: {
              Coordinates: "52.480495 13.356465",
            },
            DecimalDegree: {
              Longitude: "13.356465",
              Latitude: "52.480495",
            },
            DegreeMinuteSeconds: {
              Longitude: "9°21'39.32''",
              Latitude: "9°21'39.32''",
            },
          },
          Radius: 0,
        },
        LastCall: "2020-09-23T14:27:43.052000Z",
        GeoCoordinatesResponseFormat: "Google",
        CountryCodes: ["DEU"],
        OperatorIds: ["DE*ABC"],
        AuthenticationModes: ["PnC"],
        Accessibility: ["Free publicly accessible"],
        CalibrationLawDataAvailability: ["Local"],
        RenewableEnergy: true,
        IsHubjectCompatible: true,
        IsOpen24Hours: true,
      }),
    },
    pullevsestatus21: {
      name: "Pull EVSE Status",
      schema: oicp23Schemas.eRoamingPullEVSEStatus,
      send: (api, schemaData, sender) => {
        if (!(api instanceof EMPOICPClientAPIApi)) {
          return;
        }
        if (!sender) {
          return;
        }
        return api.eRoamingPullEvseStatusV21Pullevsestatusv21Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        ProviderID: sender.id,
      }),
    },
  },
};

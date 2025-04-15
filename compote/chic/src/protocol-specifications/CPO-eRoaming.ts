import { CPOOICPClientAPIApi } from "@/components/API clients/CSMS-OICP-API";
import { ProtocolSpecification } from "@/types";
import schemas from "@/components/JSONForms/schemas/CPO-eRoaming/OICP-2.3"; // Generated from OpenAPI spec of CSMS OICP

// from CPO to eRoaming through OICP v2.3.0
export const cpoToEroaming: ProtocolSpecification = {
  senderRole: "CPO",
  recipientRole: "eRoaming",
  providedMessages: {
    pushpricingproductdatav10: {
      name: "Push Pricing Product Data",
      schema: schemas.ERoamingPushPricingProductData,
      send: (api, schemaData, sender) => {
        if (!(api instanceof CPOOICPClientAPIApi)) {
          return;
        }
        if (!sender || !sender.id) {
          return;
        }
        return api.eRoamingPushPricingProductDataV10Pushpricingproductdatav10Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        ActionType: "fullLoad",
        PricingProductData: {
          OperatorID: sender.id,
          OperatorName: "ABC technologies",
          ProviderID: "*",
          PricingDefaultPrice: 0,
          PricingDefaultPriceCurrency: "EUR",
          PricingDefaultReferenceUnit: "HOUR",
          PricingProductDataRecords: [
            {
              ProductID: "AC 1",
              ReferenceUnit: "HOUR",
              ProductPriceCurrency: "EUR",
              PricePerReferenceUnit: 1,
              MaximumProductChargingPower: 22,
              IsValid24hours: false,
              ProductAvailabilityTimes: [
                {
                  Periods: [
                    {
                      begin: "09:00",
                      end: "18:00",
                    },
                  ],
                  on: "Everyday",
                },
              ],
              AdditionalReferences: [
                {
                  AdditionalReference: "PARKING FEE",
                  AdditionalReferenceUnit: "HOUR",
                  PricePerAdditionalReferenceUnit: 2,
                },
              ],
            },
          ],
        },
      }),
    },
    pushevsepricingv10: {
      name: "Push EVSE Pricing",
      schema: schemas.ERoamingPushEVSEPricing,
      send: (api, schemaData, sender) => {
        if (!(api instanceof CPOOICPClientAPIApi)) {
          return;
        }
        if (!sender || !sender.id) {
          return;
        }
        return api.eRoamingPushEVSEPricingV10Pushevsepricingv10Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: () => ({
        ActionType: "fullLoad",
        EVSEPricing: [
          {
            EvseID: "DE*XYZ*ETEST1",
            ProviderID: "*",
            EvseIDProductList: ["AC 1"],
          },
        ],
      }),
    },
    authorizestartv21: {
      name: "Authorize Start",
      schema: schemas.ERoamingAuthorizeStart,
      send: (api, schemaData, sender) => {
        if (!(api instanceof CPOOICPClientAPIApi)) {
          return;
        }
        if (!sender || !sender.id) {
          return;
        }
        return api.eRoamingAuthorizeStartV21Authorizestartv21Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        SessionID: "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
        CPOPartnerSessionID: "1234XYZ",
        EMPPartnerSessionID: "2345ABC",
        OperatorID: sender.id,
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
    authorizestopv21: {
      name: "Authorize Stop",
      schema: schemas.ERoamingAuthorizeStop,
      send: (api, schemaData, sender) => {
        if (!(api instanceof CPOOICPClientAPIApi)) {
          return;
        }
        if (!sender || !sender.id) {
          return;
        }
        return api.eRoamingAuthorizeStopV21Authorizestopv21Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        SessionID: "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
        CPOPartnerSessionID: "1234XYZ",
        EMPPartnerSessionID: "2345ABC",
        OperatorID: sender.id,
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
      }),
    },
    chargedetailrecordv22: {
      name: "Charge Detail Record",
      schema: schemas.ERoamingChargeDetailRecord,
      send: (api, schemaData, sender) => {
        if (!(api instanceof CPOOICPClientAPIApi)) {
          return;
        }
        if (!sender || !sender.id) {
          return;
        }
        return api.eRoamingChargeDetailRecordV22Chargedetailrecordv22Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        SessionID: "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
        CPOPartnerSessionID: "1234XYZ",
        EMPPartnerSessionID: "9876655",
        PartnerProductID: "AC 1",
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
            ExpiryDate: "2021-01-23T14:17:53.039Z",
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
        ChargingStart: "2020-09-23T14:17:53.038000Z",
        ChargingEnd: "2020-09-23T14:17:53.038000Z",
        SessionStart: "2020-09-23T14:17:53.039000Z",
        SessionEnd: "2020-09-23T14:17:53.039000Z",
        MeterValueStart: 0,
        MeterValueEnd: 10,
        MeterValueInBetween: {
          meterValues: [10],
        },
        ConsumedEnergy: 10,
        SignedMeteringValues: [
          {
            SignedMeteringValue:
              "AAAAAAAAAAAAAAABasdno2e89d2ekasdeBBBBBBBBBBBBBBBBCCCCCCCCC23423BBBBBBBBBBBBBAS",
            MeteringStatus: "Start",
          },
          {
            SignedMeteringValue:
              "AAAAAAAAAAAAAAABBBBdaskjhadksiqwd2309nede9owineBBBBBBBBBBBBBCCCCCCCCC23423BBBBBBBBBBBBBAS",
            MeteringStatus: "End",
          },
        ],
        CalibrationLawVerificationInfo: {
          CalibrationLawCertificateID: "CD-12BD-2783T",
          PublicKey: "a9sdh839alskldh/WEDjaskdjis20ij2wdpasodpjlkofi3ed3ed",
          MeteringSignatureUrl: "http://www.meteringexample1234.com",
          MeteringSignatureEncodingFormat: "UTF-8",
          SignedMeteringValuesVerificationInstruction:
            "please follow instructions provided in the mentioned URL",
        },
        HubOperatorID: sender.id,
      }),
    },
    pushevsedatav23: {
      name: "Push EVSE Data",
      schema: schemas.ERoamingPushEvseData,
      send: (api, schemaData, sender) => {
        if (!(api instanceof CPOOICPClientAPIApi)) {
          return;
        }
        if (!sender || !sender.id) {
          return;
        }
        return api.eRoamingPushEvseDataV23Pushevsedatav23Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        ActionType: "fullLoad",
        OperatorEvseData: {
          OperatorID: sender.id,
          OperatorName: "ABC technologies",
          EvseDataRecord: [
            {
              deltaType: "insert",
              EvseID: "DE*XYZ*ETEST1",
              ChargingPoolID: "DE*ABC*P1234TEST*1",
              ChargingStationNames: [
                {
                  lang: "en",
                  value: "ABC Charging Station Test",
                },
                {
                  lang: "de",
                  value: "ABC Testladestation",
                },
              ],
              HardwareManufacturer: "Charger Hardware Muster Company",
              ChargingStationImage: "http://www.testlink.com",
              SubOperatorName: "XYZ Technologies",
              Address: {
                Country: "DEU",
                City: "Berlin",
                Street: "EUREF CAMPUS",
                PostalCode: "10829",
                HouseNum: "22",
                Floor: "6OG",
                Region: "Berlin",
                ParkingFacility: true,
                ParkingSpot: "E36",
                TimeZone: "UTC+01:00",
              },
              GeoCoordinates: {
                Google: {
                  Coordinates: "52.480495 13.356465",
                },
                DecimalDegree: {
                  Longitude: "13.356465",
                  Latitude: "52.480495",
                },
              },
              Plugs: ["Type 2 Outlet"],
              DynamicPowerLevel: true,
              ChargingFacilities: [
                {
                  PowerType: "AC_3_PHASE",
                  Voltage: 480,
                  Amperage: 32,
                  Power: 22,
                  ChargingModes: ["Mode_4"],
                },
              ],
              RenewableEnergy: true,
              EnergySource: [
                {
                  Energy: "Solar",
                  Percentage: 85,
                },
                {
                  Energy: "Wind",
                  Percentage: 15,
                },
              ],
              EnvironmentalImpact: {
                CO2Emission: 30.3,
              },
              CalibrationLawDataAvailability: "Local",
              AuthenticationModes: ["NFC RFID Classic", "REMOTE"],
              MaxCapacity: 50,
              PaymentOptions: ["No Payment"],
              ValueAddedServices: ["Reservation"],
              Accessibility: "Restricted access",
              AccessibilityLocation: "ParkingGarage",
              HotlinePhoneNumber: "+49123123123123",
              AdditionalInfo: [
                {
                  lang: "en",
                  value: "This charging station is for testing purposes",
                },
              ],
              ChargingStationLocationReference: [
                {
                  lang: "en",
                  value:
                    "Charging station is inside Hubject Office Parking Lot",
                },
              ],
              GeoChargingPointEntrance: {
                Google: {
                  Coordinates: "52.480495 13.356465",
                },
                DecimalDegree: {
                  Longitude: "13.356465",
                  Latitude: "52.480495",
                },
              },
              IsOpen24Hours: false,
              OpeningTimes: [
                {
                  Period: [
                    {
                      begin: "09:00",
                      end: "18:00",
                    },
                  ],
                  on: "Everyday",
                },
              ],
              HubOperatorID: sender.id,
              ClearinghouseID: "TEST ID",
              IsHubjectCompatible: true,
              DynamicInfoAvailable: "true",
            },
          ],
        },
      }),
    },
    pushevsestatusv21: {
      name: "Push EVSE Status",
      schema: schemas.ERoamingPushEvseStatus,
      send: (api, schemaData, sender) => {
        if (!(api instanceof CPOOICPClientAPIApi)) {
          return;
        }
        if (!sender || !sender.id) {
          return;
        }
        return api.eRoamingPushEvseStatusV21Pushevsestatusv21Post(
          sender.id,
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        ActionType: "fullLoad",
        OperatorEvseStatus: {
          OperatorID: sender.id,
          OperatorName: "ABC technologies",
          EvseStatusRecord: [
            {
              EvseID: "DE*XYZ*ETEST1",
              EvseStatus: "Available",
            },
          ],
        },
      }),
    },
    chargingnotificationsv11: {
      name: "Charging Notifications",
      schema: schemas.ERoamingChargingNotificationStart,
      send: (api, schemaData, sender) => {
        if (!(api instanceof CPOOICPClientAPIApi)) {
          return;
        }
        if (!sender || !sender.id) {
          return;
        }
        return api.eRoamingChargingNotificationsV11Chargingnotificationsv11Post(
          schemaData
        );
      },
      defaultValuesCallback: (sender) => ({
        Type: "Start",
        SessionID: "f98efba4-02d8-4fa0-b810-9a9d50d2c527",
        CPOPartnerSessionID: "1234XYZ",
        EMPPartnerSessionID: "2345ABC",
        Identification: {
          RFIDMifareFamilyIdentification: {
            UID: "1234ABCD",
          },
        },
        EvseID: "DE*XYZ*ETEST1",
        ChargingStart: "2020-09-23T14:17:53.038000Z",
        SessionStart: "2020-09-23T14:17:53.038000Z",
        MeterValueStart: 0,
        OperatorID: sender.id,
        PartnerProductID: "AC 1",
      }),
    },
  },
};

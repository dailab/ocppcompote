import componentsSchemasProviderID from "./ProviderID";
import componentsSchemasOperatorID from "./OperatorID";
import componentsSchemasIdentification from "./Identification";
import componentsSchemasEvseID from "./EvseID";
import componentsSchemasProductID from "./ProductID";
import componentsSchemasSessionID from "./SessionID";

const schema = {
  type: "object",
  description:
    "eRoamingChargeDetailRecord is a message that contains charging process details (e.g. meter values).",
  required: [
    "SessionID",
    "EvseID",
    "Identification",
    "ChargingStart",
    "ChargingEnd",
    "SessionStart",
    "SessionEnd",
    "ConsumedEnergy",
  ],
  properties: {
    SessionID: componentsSchemasSessionID,
    CPOPartnerSessionID: {
      type: "string",
      maximum: 250,
      description:
        "Optional field containing the session id assigned by the CPO to the related operation.",
    },
    EMPPartnerSessionID: {
      type: "string",
      maximum: 250,
      description:
        "Optional field containing the session id assigned by an EMP to the related operation.",
    },
    PartnerProductID: componentsSchemasProductID,
    EvseID: componentsSchemasEvseID,
    Identification: componentsSchemasIdentification,
    ChargingStart: {
      type: "string",
      format: "date-time",
      description: "The date and time at which the charging process started.",
    },
    ChargingEnd: {
      type: "string",
      format: "date-time",
      description: "The date and time at which the charging process stoped.",
    },
    SessionStart: {
      type: "string",
      format: "date-time",
      description:
        "The date and time at which the session started, e.g. swipe of RFID or cable connected.",
    },
    SessionEnd: {
      type: "string",
      format: "date-time",
      description:
        "The date and time at which the session started, e.g. swipe of RFID or cable connected.",
    },
    MeterValueStart: {
      type: "number",
      description: "The starting meter value in kWh.",
    },
    MeterValueEnd: {
      type: "number",
      description: "The ending meter value in kWh.",
    },
    MeterValueInBetween: {
      type: "object",
      description:
        "List of meter values that may have been taken in between (kWh).",
      properties: {
        meterValues: {
          type: "array",
          items: {
            type: "number",
          },
        },
      },
    },
    ConsumedEnergy: {
      type: "number",
      description:
        "The difference between MeterValueEnd and MeterValueStart in kWh.",
    },
    SignedMeteringValues: {
      type: "array",
      description:
        "Metering Signature basically contains all metering signature values (these values should be in Transparency software format) for different status of charging session for eg start, end or progress. In total you can provide maximum 10 metering signature values",
      items: {
        type: "object",
        properties: {
          SignedMeteringValue: {
            type: "string",
            description:
              'Metering signature value (in the Transparency software format)\n\nSignedMeteringValue `SHOULD` be always sent in following order\n1. SignedMeteringValue for Metering Status “Start”\n2. SignedMeteringValue for Metering Status “Progress1”\n3. SignedMeteringValue for Metering Status “Progress2”\n4. …\n5. SignedMeteringValue for Metering Status “Progress8”\n6. SignedMeteringValue for Metering Status “End”\n\nNote:\n\n1. This field `MUST` be provided when the EVSEID in the ChargeDetailRecord contains the "External" value in the CalibrationLawDataAvailability field.\n2. The MeteringSignatureValue format provided `MUST` be supported by the Transparency Software used by the CPO\n',
            maximum: 3000,
          },
          MeteringStatus: {
            type: "string",
            enum: ["Start", "Progress", "End"],
            description:
              "| Option | Description |\n| ------ | ----------- |\n| Start | Metering signature value of the beginning of charging process. |\n| Progress | An intermediate metering signature value of the charging process. |\n| End | Metering Signature Value of the end of the charging process. |\n",
          },
        },
      },
    },
    CalibrationLawVerificationInfo: {
      type: "object",
      description:
        "This field provides additional information which could help directly or indirectly to verify the signed metering value by using respective Transparency Software",
      properties: {
        CalibrationLawCertificateID: {
          type: "string",
          description:
            "The Calibration Law Compliance ID from respective authority along with the revision and issueing date (Compliance ID : Revision : Date) For eg PTB - X-X-XXXX : V1 : 01Jan2020",
          maximum: 100,
        },
        PublicKey: {
          type: "string",
          description: "Unique PublicKey for EVSEID can be provided here",
          maximum: 1000,
        },
        MeteringSignatureUrl: {
          type: "string",
          description:
            "In this field CPO can also provide a url for xml file. This xml file can give the compiled Calibration Law Data information which can be simply added to invoices for Customer of EMP.\n\nThe information can contain for eg Charging Station Details, Charging Session Date/Time, SignedMeteringValues (Transparency Software format), SignedMeterValuesVerificationInstruction etc.\n",
          maximum: 200,
        },
        MeteringSignatureEncodingFormat: {
          type: "string",
          description:
            "Encoding format of the metering signature data as well as the version (e.g. EDL40 Mennekes: V1)",
          maximum: 50,
        },
        SignedMeteringValuesVerificationInstruction: {
          type: "string",
          description:
            "Additional information (e.g. instruction on how to use the transparency software)",
          maximum: 400,
        },
      },
    },
    HubOperatorID: componentsSchemasOperatorID,
    HubProviderId: componentsSchemasProviderID,
  },
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/eRoamingChargeDetailRecord",
  ...schema,
} as const;
export { with$id };

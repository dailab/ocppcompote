const schema = {
  properties: {
    CalibrationLawCertificateID: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Calibrationlawcertificateid",
      description:
        "The Calibration Law Compliance ID from respective authority along with the revision and issueing date (Compliance ID : Revision : Date) For eg PTB - X-X-XXXX : V1 : 01Jan2020",
    },
    PublicKey: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Publickey",
      description: "Unique PublicKey for EVSEID can be provided here",
    },
    MeteringSignatureUrl: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Meteringsignatureurl",
      description:
        "In this field CPO can also provide a url for xml file. This xml file can give the compiled Calibration Law Data information which can be simply added to invoices for Customer of EMP.  The information can contain for eg Charging Station Details, Charging Session Date/Time, SignedMeteringValues (Transparency Software format), SignedMeterValuesVerificationInstruction etc. ",
    },
    MeteringSignatureEncodingFormat: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Meteringsignatureencodingformat",
      description:
        "Encoding format of the metering signature data as well as the version (e.g. EDL40 Mennekes: V1)",
    },
    SignedMeteringValuesVerificationInstruction: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Signedmeteringvaluesverificationinstruction",
      description:
        "Additional information (e.g. instruction on how to use the transparency software)",
    },
  },
  type: "object",
  title: "ERoamingChargeDetailRecordCalibrationLawVerificationInfo",
  description:
    "This field provides additional information which could help directly or indirectly to verify the signed metering value by using respective Transparency Software",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingChargeDetailRecordCalibrationLawVerificationInfo",
  ...schema,
} as const;
export { with$id };

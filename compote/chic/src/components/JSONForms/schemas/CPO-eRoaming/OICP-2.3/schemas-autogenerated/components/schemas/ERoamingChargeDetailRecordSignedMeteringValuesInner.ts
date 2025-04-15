const schema = {
  properties: {
    SignedMeteringValue: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Signedmeteringvalue",
      description:
        'Metering signature value (in the Transparency software format)  SignedMeteringValue `SHOULD` be always sent in following order 1. SignedMeteringValue for Metering Status â€œStartâ€ 2. SignedMeteringValue for Metering Status â€œProgress1â€ 3. SignedMeteringValue for Metering Status â€œProgress2â€ 4. â€¦ 5. SignedMeteringValue for Metering Status â€œProgress8â€ 6. SignedMeteringValue for Metering Status â€œEndâ€  Note:  1. This field `MUST` be provided when the EVSEID in the ChargeDetailRecord contains the "External" value in the CalibrationLawDataAvailability field. 2. The MeteringSignatureValue format provided `MUST` be supported by the Transparency Software used by the CPO ',
    },
    MeteringStatus: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Meteringstatus",
      description:
        "| Option | Description | | ------ | ----------- | | Start | Metering signature value of the beginning of charging process. | | Progress | An intermediate metering signature value of the charging process. | | End | Metering Signature Value of the end of the charging process. | ",
    },
  },
  type: "object",
  title: "ERoamingChargeDetailRecordSignedMeteringValuesInner",
  description: "ERoamingChargeDetailRecordSignedMeteringValuesInner",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingChargeDetailRecordSignedMeteringValuesInner",
  ...schema,
} as const;
export { with$id };

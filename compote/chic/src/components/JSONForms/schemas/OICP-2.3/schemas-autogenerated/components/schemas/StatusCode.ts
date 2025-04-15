const schema = {
  type: "object",
  description:
    "The structure consists of a defined code, an optional functional description of the status, and optional additional information. It can be used e.g. to send error details or detailed reasons for a certain process or system behavior. The optional AdditionalInfo field can be used in order to provide further individual (non-standardized) information.\n",
  required: ["Code"],
  properties: {
    Code: {
      type: "string",
      description:
        "| Option | Description | Area of Usage |\n| -------|-------------|---------------|\n| 000 | Success. | General codes |\n| 001 | Hubject system error. | Internal system codes |\n| 002 | Hubject database error. |Internal system codes|\n| 009 |Data transaction error. | Internal system codes|\n|017 |Unauthorized Access. |Internal system codes |\n|018 |Inconsistent EvseID. |Internal system codes |\n|019 |Inconsistent EvcoID. |Internal system codes |\n|021 |System error. |General codes |\n|022 |Data error. |General codes |\n|101 |QR Code Authentication failed – Invalid Credentials. |Authentication codes |\n|102 |RFID Authentication failed – invalid UID. |Authentication codes |\n|103 |RFID Authentication failed – card not readable. |Authentication codes |\n|105 |PLC Authentication failed - invalid EvcoID. |Authentication codes |\n|106 |No positive authentication response. |Authentication codes / Internal system codes |\n|110 |QR Code App Authentication failed – time out error. |Authentication codes |\n|120 |PLC (ISO/ IEC 15118) Authentication failed – invalid underlying EvcoID. |Authentication codes |\n|121 |PLC (ISO/ IEC 15118) Authentication failed – invalid certificate. |Authentication codes |\n|122 |PLC (ISO/ IEC 15118) Authentication failed – time out error. |Authentication codes |\n|200 |EvcoID locked. |Authentication codes |\n|210 |No valid contract. |Session codes |\n|300 |Partner not found. |Session codes |\n|310 |Partner did not respond. |Session codes |\n|320 |Service not available. |Session codes |\n|400 |Session is invalid. |Session codes |\n|501 |Communication to EVSE failed. |EVSE codes |\n|510 |No EV connected to EVSE. |EVSE codes |\n|601 |EVSE already reserved. |EVSE codes |\n|602 |EVSE already in use/ wrong token. |EVSE codes |\n|603 |Unknown EVSE ID. |EVSE codes |\n|604 |EVSE ID is not Hubject compatible. |EVSE codes |\n|700 |EVSE out of service. |EVSE codes |\n",
    },
    Description: {
      type: "string",
      description: "description",
      maximum: 200,
    },
    AdditionalInfo: {
      type: "string",
      description: "More information can be provided here",
      maximum: 1000,
    },
  },
} as const;
export default schema;

const with$id = { $id: "/components/schemas/StatusCode", ...schema } as const;
export { with$id };

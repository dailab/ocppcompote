const schema = {
  properties: {
    Code: {
      type: "string",
      title: "Code",
      description:
        "| Option | Description | Area of Usage | | -------|-------------|---------------| | 000 | Success. | General codes | | 001 | Hubject system error. | Internal system codes | | 002 | Hubject database error. |Internal system codes| | 009 |Data transaction error. | Internal system codes| |017 |Unauthorized Access. |Internal system codes | |018 |Inconsistent EvseID. |Internal system codes | |019 |Inconsistent EvcoID. |Internal system codes | |021 |System error. |General codes | |022 |Data error. |General codes | |101 |QR Code Authentication failed â€“ Invalid Credentials. |Authentication codes | |102 |RFID Authentication failed â€“ invalid UID. |Authentication codes | |103 |RFID Authentication failed â€“ card not readable. |Authentication codes | |105 |PLC Authentication failed - invalid EvcoID. |Authentication codes | |106 |No positive authentication response. |Authentication codes / Internal system codes | |110 |QR Code App Authentication failed â€“ time out error. |Authentication codes | |120 |PLC (ISO/ IEC 15118) Authentication failed â€“ invalid underlying EvcoID. |Authentication codes | |121 |PLC (ISO/ IEC 15118) Authentication failed â€“ invalid certificate. |Authentication codes | |122 |PLC (ISO/ IEC 15118) Authentication failed â€“ time out error. |Authentication codes | |200 |EvcoID locked. |Authentication codes | |210 |No valid contract. |Session codes | |300 |Partner not found. |Session codes | |310 |Partner did not respond. |Session codes | |320 |Service not available. |Session codes | |400 |Session is invalid. |Session codes | |501 |Communication to EVSE failed. |EVSE codes | |510 |No EV connected to EVSE. |EVSE codes | |601 |EVSE already reserved. |EVSE codes | |602 |EVSE already in use/ wrong token. |EVSE codes | |603 |Unknown EVSE ID. |EVSE codes | |604 |EVSE ID is not Hubject compatible. |EVSE codes | |700 |EVSE out of service. |EVSE codes | ",
    },
    Description: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Description",
      description: "description",
    },
    AdditionalInfo: {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
      title: "Additionalinfo",
      description: "More information can be provided here",
    },
  },
  type: "object",
  required: ["Code"],
  title: "StatusCode",
  description:
    "The structure consists of a defined code, an optional functional description of the status, and optional additional information. It can be used e.g. to send error details or detailed reasons for a certain process or system behavior. The optional AdditionalInfo field can be used in order to provide further individual (non-standardized) information. ",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/StatusCode", ...schema } as const;
export { with$id };

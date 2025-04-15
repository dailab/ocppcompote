const schema = {
  properties: {
    EvseID: {
      type: "string",
      title: "Evseid",
      description:
        "The ID that identifies the charging spot.  A string that `MUST` be valid with respect to the following regular expression: ISO | DIN.  `^(([A-Za-z]{2}\\*?[A-Za-z0-9]{3}\\*?E[A-Za-z0-9\\*]{1,30})|(\\+?[0-9]{1,3}\\*[0-9]{3}\\*[0-9\\*]{1,32}))$` The expression validates the string as EvseID. It supports both definitions DIN SPEC 91286:2011-11 as well as ISO 15118-1.  In case the EvseID is provided corresponding to ISO, the country code MUST be provided as Alpha-2-Code (DIN EN ISO-3166-1) and the separator character â€œ*â€ is optional. Furthermore the ID MUST provide an â€œEâ€ after the OperatorID in order to identify the ID as ISO EvseID without doubt.  In case the EvseID is provided corresponding to DIN, the country code MUST be provided according to the international telecommunication numbering plan (ITU-T E.164:11/2010) and the separator character â€œ*â€ is mandatory.  Examples ISO: â€œDE*AB7*E840*6487â€, â€œDEAB7E8406487â€  Example DIN: â€œ+49*810*000*438â€ ",
    },
    EvseStatus: {
      type: "string",
      title: "Evsestatus",
      description:
        "| Option | Description |                 | ------ | ----------- | | Available | Charging Spot is available for charging. | | Reserved | Charging Spot is reserved and not available for charging. | | Occupied | Charging Spot is busy. | | OutOfService | Charging Spot is out of service and not available for charging. | | EvseNotFound | The requested EvseID and EVSE status does not exist within the Hubject database. | | Unknown | No status information available. | ",
    },
  },
  type: "object",
  required: ["EvseID", "EvseStatus"],
  title: "ERoamingPushEvseStatusOperatorEvseStatusEvseStatusRecordInner",
  description: "ERoamingPushEvseStatusOperatorEvseStatusEvseStatusRecordInner",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ERoamingPushEvseStatusOperatorEvseStatusEvseStatusRecordInner",
  ...schema,
} as const;
export { with$id };

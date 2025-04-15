const schema = {
  type: "string",
  enum: [
    "ChargePointMaxProfile",
    "TxDefaultProfile",
    "TxProfile",
    "ChargePointMaxProfile",
    "TxDefaultProfile",
    "TxProfile",
  ],
  title: "ChargingProfilePurposeType",
  description:
    "In load balancing scenarios, the Charge Point has one or more local\ncharging profiles that limit the power or current to be shared by all\nconnectors of the Charge Point. The Central System SHALL configure such\na profile with ChargingProfilePurpose set to “ChargePointMaxProfile”.\nChargePointMaxProfile can only be set at Charge Point ConnectorId 0.\n\nDefault schedules for new transactions MAY be used to impose charging\npolicies. An example could be a policy that prevents charging during\nthe day. For schedules of this purpose, ChargingProfilePurpose SHALL\nbe set to TxDefaultProfile. If TxDefaultProfile is set to ConnectorId 0,\nthe TxDefaultProfile is applicable to all Connectors. If ConnectorId is\nset >0, it only applies to that specific connector. In the event a\nTxDefaultProfile for connector 0 is installed, and the Central\nSystem sends a new profile with ConnectorId >0, the TxDefaultProfile\nSHALL be replaced only for that specific connector.\n\nIf a transaction-specific profile with purpose TxProfile is present,\nit SHALL overrule the default charging profile with purpose\nTxDefaultProfile for the duration of the current transaction only.\nAfter the transaction is stopped, the profile SHOULD be deleted.\nIf there is no transaction active on the connector specified in a\ncharging profile of type TxProfile, then the Charge Point SHALL\ndiscard it and return an error status in SetChargingProfile.conf.\nTxProfile SHALL only be set at Charge Point ConnectorId >0.\n\nIt is not possible to set a ChargingProfile with purpose set to\nTxProfile without presence of an active transaction, or in advance of\na transaction.\n\nIn order to ensure that the updated charging profile applies only to the\ncurrent transaction, the chargingProfilePurpose of the ChargingProfile\nMUST be set to TxProfile.",
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/ChargingProfilePurposeType",
  ...schema,
} as const;
export { with$id };

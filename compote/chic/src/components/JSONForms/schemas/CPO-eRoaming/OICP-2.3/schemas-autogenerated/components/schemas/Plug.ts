const schema = {
  type: "string",
  enum: [
    "Small Paddle Inductive",
    "Large Paddle Inductive",
    "AVCON Connector",
    "Tesla Connector",
    "NEMA 5-20",
    "Type E French Standard",
    "Type F Schuko",
    "Type G British Standard",
    "Type J Swiss Standard",
    "Type 1 Connector (Cable Attached)",
    "Type 2 Outlet",
    "Type 2 Connector (Cable Attached)",
    "Type 3 Outlet",
    "IEC 60309 Single Phase",
    "IEC 60309 Three Phase",
    "CCS Combo 2 Plug (Cable Attached)",
    "CCS Combo 1 Plug (Cable Attached)",
    "CHAdeMO",
  ],
  title: "Plug",
  description:
    "| Option | Description | |Small Paddle Inductive | Defined plug type. | | Large Paddle Inductive | Defined plug type.| | AVCON Connector | Defined plug type.| | Tesla Connector | Defined plug type.| | NEMA 5-20 | Defined plug type.| | Type E French Standard | CEE 7/5. | | Type F Schuko | CEE 7/4. | | Type G British Standard | BS 1363. | | Type J Swiss Standard | SEV 1011. | | Type 1 Connector (Cable Attached) | Cable attached to IEC 62196-1 type 1, SAE J1772 connector. | | Type 2 Outlet | IEC 62196-1 type 2. | | Type 2 Connector (Cable Attached) | Cable attached to IEC 62196-1 type 2 connector. | | Type 3 Outlet | IEC 62196-1 type 3. | | IEC 60309 Single Phase | IEC 60309. | | IEC 60309 Three Phase | IEC 60309. | | CCS Combo 2 Plug (Cable Attached) | IEC 62196-3 CDV DC Combined Charging Connector DIN SPEC 70121 refers to ISO / IEC 15118-1 DIS, -2 DIS and 15118-3. | | CCS Combo 1 Plug (Cable Attached) | IEC 62196-3 CDV DC Combined Charging Connector with IEC 62196-1 type 2 SAE J1772 connector. | | CHAdeMO | DC CHAdeMO Connector. | ",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/Plug", ...schema } as const;
export { with$id };

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
  description:
    "| Option | Description |\n|Small Paddle Inductive | Defined plug type. |\n| Large Paddle Inductive | Defined plug type.|\n| AVCON Connector | Defined plug type.|\n| Tesla Connector | Defined plug type.|\n| NEMA 5-20 | Defined plug type.|\n| Type E French Standard | CEE 7/5. |\n| Type F Schuko | CEE 7/4. |\n| Type G British Standard | BS 1363. |\n| Type J Swiss Standard | SEV 1011. |\n| Type 1 Connector (Cable Attached) | Cable attached to IEC 62196-1 type 1, SAE J1772 connector. |\n| Type 2 Outlet | IEC 62196-1 type 2. |\n| Type 2 Connector (Cable Attached) | Cable attached to IEC 62196-1 type 2 connector. |\n| Type 3 Outlet | IEC 62196-1 type 3. |\n| IEC 60309 Single Phase | IEC 60309. |\n| IEC 60309 Three Phase | IEC 60309. |\n| CCS Combo 2 Plug (Cable Attached) | IEC 62196-3 CDV DC Combined Charging Connector DIN SPEC 70121 refers to ISO / IEC 15118-1 DIS, -2 DIS and 15118-3. |\n| CCS Combo 1 Plug (Cable Attached) | IEC 62196-3 CDV DC Combined Charging Connector with IEC 62196-1 type 2 SAE J1772 connector. |\n| CHAdeMO | DC CHAdeMO Connector. |\n",
} as const;
export default schema;

const with$id = { $id: "/components/schemas/Plug", ...schema } as const;
export { with$id };

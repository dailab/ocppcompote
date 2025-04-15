import componentsSchemasEvcoID from "./EvcoID";
import componentsSchemasUID from "./UID";

const schema = {
  type: "object",
  description:
    "Authentication data details. The data structure differs depending on the authentication technology\n",
  properties: {
    UID: componentsSchemasUID,
    EvcoID: componentsSchemasEvcoID,
    RFID: {
      type: "string",
      description: "Defined RFID Type\n",
      enum: ["mifareCls", "mifareDes", "calypso", "nfc", "mifareFamily"],
    },
    PrintedNumber: {
      type: "string",
      maximum: 150,
      description:
        "A number printed on a customer’s card for manual authorization (e.q. via a call center)",
    },
    ExpiryDate: {
      type: "string",
      description:
        "Until when this card is valid. Should not be set if card does not have an expiration",
    },
  },
  required: ["UID", "RFID"],
} as const;
export default schema;

const with$id = {
  $id: "/components/schemas/RFIDIdentification",
  ...schema,
} as const;
export { with$id };

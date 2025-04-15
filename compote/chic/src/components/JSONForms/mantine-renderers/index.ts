import AnyOfControl from "./AnyOfControl";
import ArrayControl from "./ArrayControl";
import CheckboxControl from "./CheckboxControl";
import IdentificationControl from "./IdentificationControl";
import ISO15118DataTransferControl from "./ISO15118DataTransferControl";
import NumberControl from "./NumberControl";
import ObjectControl from "./ObjectControl";
import StringSelectControl from "./StringSelectControl";
import anyOfTester from "./testers/anyOfTester";
import arrayControlTester from "./testers/arrayControlTester";
import checkboxControlTester from "./testers/checkboxControlTester";
import identificationControlTester from "./testers/identificationControlTester";
import ISO15118DataTransferTester from "./testers/ISO15118DataTransferTester";
import numberControlTester from "./testers/numberControlTester";
import objectControlTester from "./testers/objectControlTester";
import stringSelectControlTester from "./testers/stringSelectControlTester";
import textControlTester from "./testers/textControlTester";
import timestampControlTester from "./testers/timestampControlTester";
import verticalLayoutTester from "./testers/verticalLayoutTester";
import TextControl from "./TextControl";
import TimestampControl from "./TimestampControl";
import VerticalLayout from "./VerticalLayout";

export default [
  { renderer: ArrayControl, tester: arrayControlTester },
  { renderer: CheckboxControl, tester: checkboxControlTester },
  { renderer: ISO15118DataTransferControl, tester: ISO15118DataTransferTester },
  { renderer: NumberControl, tester: numberControlTester },
  { renderer: StringSelectControl, tester: stringSelectControlTester },
  { renderer: TextControl, tester: textControlTester },
  { renderer: TimestampControl, tester: timestampControlTester },
  { renderer: ObjectControl, tester: objectControlTester },
  { renderer: IdentificationControl, tester: identificationControlTester },
  { renderer: AnyOfControl, tester: anyOfTester },
  { renderer: VerticalLayout, tester: verticalLayoutTester },
];

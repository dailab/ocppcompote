import { getCustomStyles, scrollAreaProps } from "@/utils";
import {
  Input,
  MantineSize,
  Paper,
  ScrollArea,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { PropsWithChildren, ReactNode, Ref, useState } from "react";

export interface InputWrapperScrollArea {
  label: string;
  mah?: number;
  mt?: MantineSize | number;
  my?: MantineSize | number;
  mb?: MantineSize | number;
  error?: ReactNode;
}

export default function InputWrapperScrollArea({
  children,
  label,
  mah,
  mt,
  my,
  mb,
  error,
}: PropsWithChildren<InputWrapperScrollArea>) {
  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { primaryColor } = getCustomStyles(theme, colorScheme);

  // State
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <Input.Wrapper
      label={label}
      mt={mt}
      mb={mb}
      my={my}
      error={error}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Paper
        shadow="none"
        p={0}
        withBorder
        display="flex"
        style={{
          transitionProperty: "border-color",
          transitionDuration: "100ms",
          transitionTimingFunction: "ease",
          borderColor: error
            ? theme.colors.red[6]
            : isHovering
              ? primaryColor
              : undefined,
        }}
      >
        <ScrollArea mah={mah} {...scrollAreaProps} flex={1} px="md">
          {children}
        </ScrollArea>
      </Paper>
    </Input.Wrapper>
  );
}

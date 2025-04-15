import { WidgetComponentProps } from "@/types";
import {
  Alert,
  Box,
  Center,
  Loader,
  Paper,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useUpdateActiveWidget, useWidgetSelection } from "../WidgetsProvider";
import {
  getIframeWidgetId,
  getCustomStyles,
  widgetProps,
  isUrlReachable,
} from "@/utils";
import CloseButton from "../CloseButton";
import { usePathname } from "next/navigation";
import Iframe from "react-iframe";
import { useEffect, useState } from "react";
import { IconInfoTriangle } from "@tabler/icons-react";
import classes from "./IframeWidget.module.css";

export const iframeWidgetIdPrefix = "iframe-widget-";

export interface IframeWidgetProps extends WidgetComponentProps {
  url: string;
}

export default function IframeWidget(props: IframeWidgetProps) {
  const { mt, withCloseButton, url, radius } = props;
  const { isWidgetSelected } = useWidgetSelection();
  const pathname = usePathname();
  const updateActiveWidget = useUpdateActiveWidget();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground, iconSize } = getCustomStyles(
    theme,
    colorScheme
  );

  // State
  const [isReachable, setIsReachable] = useState<boolean | undefined>(
    undefined
  );

  // Helpers
  const widgetId = getIframeWidgetId(props);
  const iframeHeight = 650;

  // Effects
  useEffect(() => {
    if (isReachable !== undefined) {
      return;
    }
    isUrlReachable(url)
      .then((res) => {
        setIsReachable(res);
      })
      .catch(() => {
        setIsReachable(false);
      });
  }, []);

  return (
    <Transition
      mounted={isWidgetSelected(pathname, widgetId)}
      transition="fade-left"
      duration={350}
      timingFunction="ease"
    >
      {(transitionStyle) => (
        <Paper
          shadow="md"
          bg={transparentBackground}
          h={isReachable !== true ? "fit-content" : iframeHeight}
          mt={mt || 0}
          p={isReachable !== true ? "md" : 0}
          style={transitionStyle}
          pos="relative"
          radius={radius !== undefined ? radius : undefined}
          {...widgetProps(updateActiveWidget, widgetId)}
        >
          {withCloseButton !== false && <CloseButton widgetId={widgetId} />}
          {isReachable === undefined ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <>
              {isReachable ? (
                <Box
                  h={iframeHeight}
                  className={classes.iframeContainer}
                  style={{
                    borderRadius:
                      radius === undefined
                        ? "var(--mantine-radius-default)"
                        : radius,
                  }}
                >
                  <Iframe url={url} width="100%" styles={{ height: "100%" }} />
                </Box>
              ) : (
                <Alert
                  variant="outline"
                  color="red"
                  title="Something went wrong"
                  icon={<IconInfoTriangle size={iconSize} />}
                >
                  {url} is not reachable.
                </Alert>
              )}
            </>
          )}
        </Paper>
      )}
    </Transition>
  );
}

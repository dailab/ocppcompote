import { Badge, Transition, Tooltip, MantineBreakpoint } from "@mantine/core";
import classes from "./FrozenBadge.module.css";
import { transitionDurations } from "@/utils";

interface FrozenBadgeProps {
  mounted: boolean;
  visibleFrom?: MantineBreakpoint;
}

export default function FrozenBadge({
  mounted,
  visibleFrom,
}: FrozenBadgeProps) {
  return (
    <Transition
      mounted={mounted}
      transition="fade"
      duration={transitionDurations.short}
      timingFunction="ease"
    >
      {(transitionStyle) => (
        <Tooltip label={"Auto Refresh is Disabled"}>
          <Badge
            className={classes.pointer}
            variant="default"
            style={transitionStyle}
            visibleFrom={visibleFrom}
          >
            Frozen
          </Badge>
        </Tooltip>
      )}
    </Transition>
  );
}

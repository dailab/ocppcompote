import {
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  useMantineColorScheme,
  Flex,
  Paper,
  useMantineTheme,
  Divider,
  Indicator,
} from "@mantine/core";
import { IconLogin, IconLogout, IconMoon, IconSun } from "@tabler/icons-react";
import classes from "./NavbarMinimal.module.css";
import { determineRoleAffiliation, getCustomStyles, pages } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import CompoteLogo from "../../../../public/compote-logo.svg";
import {
  useUpdateUserExperience,
  useUser,
  useUserExperience,
} from "@/components/UserProvider";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { Role } from "@/types";
import { isAllowedPath } from "@/permissions";

interface NavbarLinkProps {
  icon: typeof IconMoon;
  label: string;
  href?: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
  href,
}: NavbarLinkProps) {
  const [isHoveringRoleIndicator, setIsHoveringRoleIndicator] =
    useState<boolean>(false);
  if (!href) {
    return (
      <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
        <UnstyledButton
          onClick={onClick}
          className={classes.link}
          data-active={active || undefined}
        >
          <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    );
  }
  const role: Role | undefined = determineRoleAffiliation(href);
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <Indicator
        withBorder
        size={13}
        offset={2}
        disabled={!role || (!active && !isHoveringRoleIndicator)}
        color={role ? role.color : undefined}
        label={role && active ? role.name : null}
        onMouseEnter={() => setIsHoveringRoleIndicator(true)}
        onMouseLeave={() => setIsHoveringRoleIndicator(false)}
      >
        <UnstyledButton
          onClick={onClick}
          className={classes.link}
          data-active={active || undefined}
          component={Link}
          href={href}
        >
          <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </UnstyledButton>
      </Indicator>
    </Tooltip>
  );
}

export default function NavbarMinimal() {
  const pathname = usePathname();
  const user = useUser();
  const userExperience = useUserExperience();
  const updateUserExperience = useUpdateUserExperience();
  const [_cookies, _setCookie, removeCookie] = useCookies();

  // Style
  const theme = useMantineTheme();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const { transparentBackground } = getCustomStyles(theme, colorScheme);

  // State
  const [isHoveringRoleIndicator, setIsHoveringRoleIndicator] =
    useState<boolean>(false);

  // Helpers
  const role: Role | undefined = user ? user.role : undefined;
  const links = pages
    .filter((link) => isAllowedPath(link.href, user))
    .filter(
      (link) =>
        !userExperience.navbarSettings.hiddenPagesNavbar.includes(link.href)
    )
    .map((link) => (
      <NavbarLink
        {...link}
        key={link.label}
        active={link.href === pathname}
        href={link.href}
      />
    ));

  // Effects
  // PatternFly dark theme management
  useEffect(() => {
    if (
      colorScheme === "dark" &&
      !document.documentElement.classList.contains("pf-v6-theme-dark")
    ) {
      document.documentElement.classList.add("pf-v6-theme-dark");
      return;
    }
    if (document.documentElement.classList.contains("pf-v6-theme-dark")) {
      document.documentElement.classList.remove("pf-v6-theme-dark");
    }
  }, [colorScheme]);

  return (
    <Paper
      h="100%"
      w={rem(80)}
      p="md"
      bg={transparentBackground}
      radius={0}
      shadow="md"
    >
      <Flex direction="column" h="100%" align="center">
        <Indicator
          withBorder
          offset={2}
          size={13}
          disabled={!user}
          color={role ? role.color : undefined}
          label={role && isHoveringRoleIndicator ? role.name : null}
          onMouseEnter={() => setIsHoveringRoleIndicator(true)}
          onMouseLeave={() => setIsHoveringRoleIndicator(false)}
        >
          <Image
            src={CompoteLogo}
            alt="OCPP Compote"
            className={classes.logo}
          />
        </Indicator>
        <Divider my="sm" variant="dashed" w="100%" />
        <Stack justify="flex-start" gap={0} flex={1}>
          {links}
        </Stack>
        <Stack justify="center" gap={0}>
          {user !== undefined &&
            (user === null ? (
              <NavbarLink
                icon={IconLogin}
                label="Login"
                href="/login"
                active={pathname === "/login"}
              />
            ) : (
              <NavbarLink
                icon={IconLogout}
                label="Logout"
                onClick={() => {
                  removeCookie("user");
                  if (updateUserExperience !== null) {
                    updateUserExperience((prev) => ({
                      ...prev,
                      showWelcomeMessage: true,
                    }));
                  }
                }}
                href={"/login"}
              />
            ))}
          <NavbarLink
            icon={colorScheme === "dark" ? IconSun : IconMoon}
            onClick={() => {
              if (colorScheme === "dark") {
                setColorScheme("light");
              } else {
                setColorScheme("dark");
              }
            }}
            label="Toggle Color Scheme"
          />
        </Stack>
      </Flex>
    </Paper>
  );
}

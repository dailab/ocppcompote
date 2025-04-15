"use client";

import { ALL_USERS } from "@/permissions";
import { defaultContainerSize, getCustomStyles } from "@/utils";
import {
  Button,
  Paper,
  Container,
  Title,
  Divider,
  useMantineTheme,
  useMantineColorScheme,
  TextInput,
  PasswordInput,
  Flex,
  Notification,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";

export default function Login() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const router = useRouter();

  // Style
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground } = getCustomStyles(theme, colorScheme);

  const [nameInput, setNameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = () => {
    const user = ALL_USERS.find((u) => u.name === nameInput);
    if (!user) {
      setLoginError("User with this name does not exist.");
      return;
    }
    if (user.password !== passwordInput) {
      setLoginError("Wrong password.");
      return;
    }
    // Correct credentials
    setCookie("user", { ...user, password: undefined }, { path: "/" });
    if (cookies && cookies.hasHiddenWelcomeMessage) {
      removeCookie("hasHiddenWelcomeMessage", { path: "/" });
    }
    router.push("/");
  };

  return (
    <Container size={defaultContainerSize} pt="md">
      {loginError !== null && (
        <Notification
          title="Something went wrong"
          mb="md"
          color="red"
          onClose={() => setLoginError(null)}
        >
          {loginError}
        </Notification>
      )}
      <Paper p="md" shadow="md" bg={transparentBackground}>
        <Title order={1} size="h3">
          Login
        </Title>
        <Divider mb="md" mt="xs" />
        <Flex gap="md" align="flex-end">
          <TextInput
            label="Name"
            placeholder="Enter your name here"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.currentTarget.value);
            }}
            flex={1}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password here"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.currentTarget.value);
            }}
            flex={1}
          />
          <Button
            onClick={handleLogin}
            disabled={nameInput.length === 0 || passwordInput.length === 0}
          >
            Login
          </Button>
        </Flex>
      </Paper>
    </Container>
  );
}

"use client";
import React from "react";
import { Button, Text } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <Text size="md" p="md">
      404 Page Not Found. Return to the{" "}
      <Text component={Link} href="/" td="underline">
        Dashboard
      </Text>
      .
    </Text>
  );
}

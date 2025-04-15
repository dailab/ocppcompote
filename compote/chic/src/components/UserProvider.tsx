"use client";

import React, { useState, useContext, useEffect } from "react";
import { UserMetadata } from "@/types";
import { useCookies } from "react-cookie";

export interface NavbarSettings {
  hiddenPagesNavbar: string[];
}
export interface UserExperience {
  navbarSettings: NavbarSettings;
  showWelcomeMessage: boolean;
}
export const defaultNavbarSettings: NavbarSettings = {
  hiddenPagesNavbar: [],
};
export const defaultUserExperience: UserExperience = {
  navbarSettings: defaultNavbarSettings,
  showWelcomeMessage: true,
};

const userContext = React.createContext<UserMetadata | null | undefined>(
  undefined
); // undefined -> login status not determined; null -> login status determined but not logged in
const userExperienceContext = React.createContext<UserExperience>(
  defaultUserExperience
);
const updateUserExperienceContext = React.createContext<
  | ((p: UserExperience | ((prev: UserExperience) => UserExperience)) => void)
  | null
>(null);

export const useUser = () => {
  return useContext(userContext);
};
export const useUserExperience = () => {
  return useContext(userExperienceContext);
};
export const useUpdateUserExperience = () => {
  return useContext(updateUserExperienceContext);
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [cookies, setCookie] = useCookies();

  // State
  const [user, setUser] = useState<UserMetadata | null | undefined>(undefined);

  // Helpers
  const isUserExperience = (x: any): x is UserExperience => {
    if (typeof x !== "object") {
      return false;
    }
    if (!("showWelcomeMessage" in x)) {
      return false;
    }
    if (!("navbarSettings" in x)) {
      return false;
    }
    if (typeof x.navbarSettings !== "object") {
      return false;
    }
    if (!("hiddenPagesNavbar" in x.navbarSettings)) {
      return false;
    }
    return true;
  };
  const userExperience: UserExperience =
    cookies["userExperience"] && isUserExperience(cookies["userExperience"])
      ? cookies["userExperience"]
      : defaultUserExperience;
  const updateUserExperience = (
    p: UserExperience | ((prev: UserExperience) => UserExperience)
  ) => {
    if (typeof p === "function") {
      setCookie("userExperience", p(userExperience), { path: "/" });
      return;
    }
    setCookie("userExperience", p, { path: "/" });
  };

  // Effects
  useEffect(() => {
    if (!cookies) {
      return;
    }
    if (!cookies.user) {
      setUser(null);
      return;
    }
    if (user && user.id === cookies.user.id) {
      return;
    }
    setUser(cookies.user);
  }, [cookies]);

  return (
    <userContext.Provider value={user}>
      <updateUserExperienceContext.Provider value={updateUserExperience}>
        <userExperienceContext.Provider value={userExperience}>
          {children}
        </userExperienceContext.Provider>
      </updateUserExperienceContext.Provider>
    </userContext.Provider>
  );
}

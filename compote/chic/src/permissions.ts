import { CommuncationPath, Role, UserMetadata } from "./types";
import users from "./users.json";

export const isRelatedPath: (route: string, path: string) => boolean = (
  route,
  path
) => {
  if (route === "/") {
    return path === "/";
  }
  return path.substring(0, route.length) === route;
};

export const isPublicPath: (path: string) => boolean = (path) =>
  !criticalRoutes.find((r) => isRelatedPath(r, path));

export const isAllowedPath: (
  path: string,
  user: UserMetadata | null | undefined
) => boolean = (path, user) => {
  if (isPublicPath(path)) {
    return true;
  }
  if (!user) {
    return false;
  }
  return Boolean(user.role.allowedRoutes.find((r) => isRelatedPath(r, path)));
};

export const criticalRoutes = [
  "/",
  "/telemetry",
  "/charging-stations",
  "/cpo",
  "/emp",
  "/logs",
];

export const allowedRoutesCPO = [
  "/",
  "/cpo",
  "/telemetry",
  "/charging-stations",
  "/logs",
];

export const allowedRoutesEMP = ["/", "/telemetry", "/emp"];

export const allowedCommunicationPathsCPO: CommuncationPath[] = [
  { senderRole: "CPO", recipientRole: "eRoaming" },
  { senderRole: "CS", recipientRole: "CPO" },
  { senderRole: "CPO", recipientRole: "CS" },
  { senderRole: "CPO", recipientRole: "Everest" },
];

export const allowedCommunicationPathsEMP: CommuncationPath[] = [
  {
    senderRole: "EMP",
    recipientRole: "eRoaming",
  },
];

const cpoRole: Role = {
  name: "CPO",
  allowedRoutes: allowedRoutesCPO,
  allowedCommunicationPaths: allowedCommunicationPathsCPO,
  color: "teal",
  combination: false,
};

const empRole: Role = {
  name: "EMP",
  allowedRoutes: allowedRoutesEMP,
  allowedCommunicationPaths: allowedCommunicationPathsEMP,
  color: "red",
  combination: false,
};

const cpoEmpRole: Role = {
  name: "CPO&EMP",
  allowedRoutes: [...allowedRoutesCPO, ...allowedRoutesEMP],
  allowedCommunicationPaths: [
    ...allowedCommunicationPathsCPO,
    ...allowedCommunicationPathsEMP,
  ],
  color: "gray",
  combination: true,
};

export const roles: { [index: string]: Role } = {
  CPO: cpoRole,
  EMP: empRole,
  CPOEMP: cpoEmpRole,
};

// temporary
export const ALL_USERS = users.map((u) => ({ ...u, role: roles[u.role] }));

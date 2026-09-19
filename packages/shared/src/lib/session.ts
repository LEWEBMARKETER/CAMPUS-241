import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

import { auth } from "./auth";

export async function requireUser(loginPath = "/connexion") {
  const session = await auth();
  if (!session?.user) {
    redirect(loginPath);
  }
  return session.user;
}

export async function requireRole(
  roles: UserRole[],
  options?: { loginPath?: string; deniedPath?: string },
) {
  const user = await requireUser(options?.loginPath);
  if (!roles.includes(user.role)) {
    redirect(options?.deniedPath ?? "/dashboard");
  }
  return user;
}

export async function requireAdmin(options?: { loginPath?: string; deniedPath?: string }) {
  return requireRole(["SUPER_ADMIN", "ADMIN"], options);
}

export async function requireEditor(options?: { loginPath?: string; deniedPath?: string }) {
  return requireRole(
    ["SUPER_ADMIN", "ADMIN", "EDITOR", "VALIDATEUR_PEDAGOGIQUE"],
    options,
  );
}

export async function requireValidator(options?: { loginPath?: string; deniedPath?: string }) {
  return requireRole(["SUPER_ADMIN", "ADMIN", "VALIDATEUR_PEDAGOGIQUE"], options);
}

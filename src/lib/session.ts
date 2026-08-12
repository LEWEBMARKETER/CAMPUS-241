import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/connexion");
  }
  return session.user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    redirect("/dashboard");
  }
  return user;
}

export async function requireAdmin() {
  return requireRole(["SUPER_ADMIN", "ADMIN"]);
}

export async function requireEditor() {
  return requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
}

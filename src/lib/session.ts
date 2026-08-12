import { redirect, notFound } from "next/navigation";
import type { UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

export async function requireEstablishmentOwner(establishmentId: string) {
  const user = await requireUser();
  if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
    return user;
  }
  const establishment = await prisma.establishment.findUnique({
    where: { id: establishmentId },
    select: { ownerUserId: true },
  });
  if (!establishment) {
    notFound();
  }
  if (establishment.ownerUserId !== user.id) {
    redirect("/dashboard");
  }
  return user;
}

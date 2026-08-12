"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(establishmentId: string) {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const userId = session.user.id;
  const key = { userId_establishmentId: { userId, establishmentId } };

  const existing = await prisma.favorite.findUnique({ where: key });

  if (existing) {
    await prisma.favorite.delete({ where: key });
  } else {
    await prisma.favorite.create({ data: { userId, establishmentId } });
  }

  revalidatePath(`/annuaire/${establishmentId}`);
  revalidatePath("/dashboard/favoris");
}

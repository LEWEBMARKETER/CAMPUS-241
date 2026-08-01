"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function recordDownload(leadMagnetId: string) {
  const user = await requireUser();

  await prisma.download.upsert({
    where: { userId_leadMagnetId: { userId: user.id, leadMagnetId } },
    update: {},
    create: { userId: user.id, leadMagnetId },
  });

  revalidatePath("/dashboard/telechargements");
}

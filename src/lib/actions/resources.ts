"use server";

import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function recordView(resourceId: string) {
  const session = await auth();
  await prisma.$transaction([
    prisma.resourceView.create({
      data: { resourceId, userId: session?.user?.id ?? null },
    }),
    prisma.resource.update({
      where: { id: resourceId },
      data: { viewCount: { increment: 1 } },
    }),
  ]);
}

export async function recordDownload(resourceId: string) {
  const session = await auth();

  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource || !resource.fileUrl) {
    notFound();
  }

  if (resource.isPremium && !session?.user) {
    redirect("/connexion");
  }

  await prisma.$transaction([
    prisma.resourceDownload.create({
      data: { resourceId, userId: session?.user?.id ?? null },
    }),
    prisma.resource.update({
      where: { id: resourceId },
      data: { downloadCount: { increment: 1 } },
    }),
  ]);

  redirect(resource.fileUrl);
}

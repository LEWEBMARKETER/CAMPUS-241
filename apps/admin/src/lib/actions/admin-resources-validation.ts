"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@campus241/shared/prisma";
import { requireEditor, requireValidator } from "@/lib/session";

function revalidateResourcePaths() {
  revalidatePath("/ressources");
  revalidatePath("/ressources/validation");
  revalidatePath("/ressources/tableau-de-bord");
  revalidatePath("/ressources");
}

export async function submitResourceForValidation(id: string) {
  await requireEditor();
  const resource = await prisma.resource.findUnique({ where: { id }, select: { status: true } });
  if (!resource || resource.status !== "BROUILLON") {
    return;
  }
  await prisma.resource.update({ where: { id }, data: { status: "EN_ATTENTE" } });
  revalidateResourcePaths();
}

export async function validateResource(id: string) {
  const validator = await requireValidator();
  await prisma.resource.update({
    where: { id },
    data: {
      status: "VALIDE",
      validatedById: validator.id,
      validatedAt: new Date(),
      rejectionNote: null,
    },
  });
  revalidateResourcePaths();
}

const noteSchema = z.object({
  note: z.string().trim().min(3, "Merci de préciser un motif."),
});

export async function rejectResource(id: string, formData: FormData) {
  const validator = await requireValidator();
  const parsed = noteSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    redirect(
      `/ressources/validation?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Motif requis.")}`,
    );
  }
  await prisma.resource.update({
    where: { id },
    data: {
      status: "BROUILLON",
      validatedById: validator.id,
      validatedAt: new Date(),
      rejectionNote: parsed.data.note,
    },
  });
  revalidateResourcePaths();
  redirect("/ressources/validation");
}

export async function publishResource(id: string) {
  await requireEditor();
  const resource = await prisma.resource.findUnique({ where: { id }, select: { status: true } });
  if (resource?.status !== "VALIDE") {
    redirect(
      `/ressources?error=${encodeURIComponent(
        "Cette ressource doit d'abord être validée par un validateur pédagogique.",
      )}`,
    );
  }
  await prisma.resource.update({
    where: { id },
    data: { status: "PUBLIE", publishedAt: new Date() },
  });
  revalidateResourcePaths();
}

export async function unpublishResource(id: string) {
  await requireEditor();
  await prisma.resource.update({ where: { id }, data: { status: "VALIDE" } });
  revalidateResourcePaths();
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/session";

type ResourceInput = {
  title: string;
  slug: string;
  description: string | null;
  author: string | null;
  type:
    | "COURS"
    | "FICHE_REVISION"
    | "ANNALE"
    | "EXERCICE"
    | "CORRIGE"
    | "MEMOIRE"
    | "GUIDE"
    | "LIVRE_NUMERIQUE"
    | "SUPPORT_PEDAGOGIQUE";
  format: "PDF" | "IMAGE" | "DOCUMENT" | "VIDEO" | "AUDIO" | "INTERACTIF";
  fileUrl: string | null;
  coverImageUrl: string | null;
  niveauId: string | null;
  domaineId: string | null;
  filiereId: string | null;
  subjectId: string | null;
  isPremium: boolean;
  priceLabel: string | null;
  status: "BROUILLON" | "EN_ATTENTE" | "VALIDE" | "PUBLIE" | "ARCHIVE";
};

const resourceSchema = z.object({
  title: z.string().trim().min(3, "Titre trop court."),
  slug: z
    .string()
    .trim()
    .min(3, "Slug trop court.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (minuscules, chiffres, tirets)."),
  description: z.string().trim().optional(),
  author: z.string().trim().optional(),
  type: z.enum([
    "COURS",
    "FICHE_REVISION",
    "ANNALE",
    "EXERCICE",
    "CORRIGE",
    "MEMOIRE",
    "GUIDE",
    "LIVRE_NUMERIQUE",
    "SUPPORT_PEDAGOGIQUE",
  ]),
  format: z.enum(["PDF", "IMAGE", "DOCUMENT", "VIDEO", "AUDIO", "INTERACTIF"]),
  fileUrl: z.string().trim().optional(),
  coverImageUrl: z.string().trim().optional(),
  niveauId: z.string().optional(),
  domaineId: z.string().optional(),
  filiereId: z.string().optional(),
  subjectId: z.string().optional(),
  isPremium: z.string().optional(),
  priceLabel: z.string().trim().optional(),
  status: z.enum(["BROUILLON", "EN_ATTENTE", "VALIDE", "PUBLIE", "ARCHIVE"]),
});

function parseResourceForm(formData: FormData): { error: string } | { data: ResourceInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = resourceSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const { data } = parsed;
  return {
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      author: data.author || null,
      type: data.type,
      format: data.format,
      fileUrl: data.fileUrl || null,
      coverImageUrl: data.coverImageUrl || null,
      niveauId: data.niveauId || null,
      domaineId: data.domaineId || null,
      filiereId: data.filiereId || null,
      subjectId: data.subjectId || null,
      isPremium: data.isPremium === "on",
      priceLabel: data.priceLabel || null,
      status: data.status,
    },
  };
}

export async function createResource(formData: FormData) {
  const user = await requireEditor();
  const result = parseResourceForm(formData);
  if ("error" in result) {
    redirect(`/admin/ressources/nouveau?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.resource.create({
    data: {
      ...result.data,
      publishedAt: result.data.status === "PUBLIE" ? new Date() : null,
      createdById: user.id,
    },
  });
  revalidatePath("/admin/ressources");
  redirect("/admin/ressources");
}

export async function updateResource(id: string, formData: FormData) {
  await requireEditor();
  const result = parseResourceForm(formData);
  if ("error" in result) {
    redirect(`/admin/ressources/${id}?error=${encodeURIComponent(result.error)}`);
  }

  const existing = await prisma.resource.findUnique({ where: { id } });
  const becomesPublished = result.data.status === "PUBLIE" && existing?.status !== "PUBLIE";

  await prisma.resource.update({
    where: { id },
    data: {
      ...result.data,
      publishedAt: becomesPublished ? new Date() : existing?.publishedAt,
    },
  });
  revalidatePath("/admin/ressources");
  redirect("/admin/ressources");
}

export async function deleteResource(id: string) {
  await requireEditor();
  await prisma.resource.delete({ where: { id } });
  revalidatePath("/admin/ressources");
}

export async function togglePremium(id: string, current: boolean) {
  await requireEditor();
  await prisma.resource.update({ where: { id }, data: { isPremium: !current } });
  revalidatePath("/admin/ressources");
}

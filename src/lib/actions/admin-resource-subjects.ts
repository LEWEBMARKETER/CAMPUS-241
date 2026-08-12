"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/session";

type SubjectInput = { name: string; slug: string; isActive: boolean };

const subjectSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug trop court.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (minuscules, chiffres, tirets)."),
  isActive: z.string().optional(),
});

function parseSubjectForm(formData: FormData): { error: string } | { data: SubjectInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = subjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }
  return {
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      isActive: parsed.data.isActive === "on",
    },
  };
}

export async function createResourceSubject(formData: FormData) {
  await requireEditor();
  const result = parseSubjectForm(formData);
  if ("error" in result) {
    redirect(`/admin/ressources/matieres/nouveau?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.resourceSubject.create({ data: result.data });
  revalidatePath("/admin/ressources/matieres");
  redirect("/admin/ressources/matieres");
}

export async function updateResourceSubject(id: string, formData: FormData) {
  await requireEditor();
  const result = parseSubjectForm(formData);
  if ("error" in result) {
    redirect(`/admin/ressources/matieres/${id}?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.resourceSubject.update({ where: { id }, data: result.data });
  revalidatePath("/admin/ressources/matieres");
  redirect("/admin/ressources/matieres");
}

export async function deleteResourceSubject(id: string) {
  await requireEditor();
  await prisma.resourceSubject.delete({ where: { id } });
  revalidatePath("/admin/ressources/matieres");
}

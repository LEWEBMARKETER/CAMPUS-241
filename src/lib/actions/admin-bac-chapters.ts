"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/session";

type ChapterInput = {
  subjectId: string;
  name: string;
  order: number;
  isActive: boolean;
};

const chapterSchema = z.object({
  subjectId: z.string().trim().min(1, "Matière requise."),
  name: z.string().trim().min(2, "Nom trop court."),
  order: z.coerce.number().int().default(0),
  isActive: z.string().optional(),
});

function parseChapterForm(formData: FormData): { error: string } | { data: ChapterInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = chapterSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }
  return {
    data: {
      subjectId: parsed.data.subjectId,
      name: parsed.data.name,
      order: parsed.data.order,
      isActive: parsed.data.isActive === "on",
    },
  };
}

export async function createChapter(formData: FormData) {
  await requireEditor();
  const result = parseChapterForm(formData);
  if ("error" in result) {
    redirect(`/admin/bac/chapitres/nouveau?error=${encodeURIComponent(result.error)}`);
  }

  const existing = await prisma.chapter.findUnique({
    where: { subjectId_name: { subjectId: result.data.subjectId, name: result.data.name } },
  });
  if (existing) {
    redirect(
      `/admin/bac/chapitres/nouveau?error=${encodeURIComponent("Ce chapitre existe déjà pour cette matière.")}`,
    );
  }

  await prisma.chapter.create({ data: result.data });
  revalidatePath("/admin/bac/chapitres");
  redirect("/admin/bac/chapitres");
}

export async function updateChapter(id: string, formData: FormData) {
  await requireEditor();
  const result = parseChapterForm(formData);
  if ("error" in result) {
    redirect(`/admin/bac/chapitres/${id}?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.chapter.update({ where: { id }, data: result.data });
  revalidatePath("/admin/bac/chapitres");
  redirect("/admin/bac/chapitres");
}

export async function deleteChapter(id: string) {
  await requireEditor();
  await prisma.chapter.delete({ where: { id } });
  revalidatePath("/admin/bac/chapitres");
}

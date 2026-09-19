"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@campus241/shared/prisma";
import { requireEditor, requireValidator } from "@/lib/session";

function revalidateQuestionPaths() {
  revalidatePath("/bac/questions");
  revalidatePath("/bac/validation");
  revalidatePath("/bac/tableau-de-bord");
}

export async function submitForValidation(id: string) {
  await requireEditor();
  const question = await prisma.question.findUnique({ where: { id }, select: { validationStatus: true } });
  if (!question || !["BROUILLON", "A_CORRIGER"].includes(question.validationStatus)) {
    return;
  }
  await prisma.question.update({
    where: { id },
    data: { validationStatus: "EN_ATTENTE_VALIDATION" },
  });
  revalidateQuestionPaths();
}

export async function validateQuestion(id: string) {
  const validator = await requireValidator();
  await prisma.question.update({
    where: { id },
    data: {
      validationStatus: "VALIDEE",
      validatedById: validator.id,
      validatedAt: new Date(),
      rejectionNote: null,
    },
  });
  revalidateQuestionPaths();
}

const noteSchema = z.object({
  note: z.string().trim().min(3, "Merci de préciser un motif."),
});

export async function rejectQuestion(id: string, formData: FormData) {
  const validator = await requireValidator();
  const parsed = noteSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    redirect(
      `/bac/validation?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Motif requis.")}`,
    );
  }
  await prisma.question.update({
    where: { id },
    data: {
      validationStatus: "REJETEE",
      validatedById: validator.id,
      validatedAt: new Date(),
      rejectionNote: parsed.data.note,
      published: false,
    },
  });
  revalidateQuestionPaths();
  redirect("/bac/validation");
}

export async function requestCorrection(id: string, formData: FormData) {
  const validator = await requireValidator();
  const parsed = noteSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    redirect(
      `/bac/validation?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Motif requis.")}`,
    );
  }
  await prisma.question.update({
    where: { id },
    data: {
      validationStatus: "A_CORRIGER",
      validatedById: validator.id,
      validatedAt: new Date(),
      rejectionNote: parsed.data.note,
      published: false,
    },
  });
  revalidateQuestionPaths();
  redirect("/bac/validation");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/session";
import { CHOICE_BASED_TYPES } from "@/lib/bac";

const choiceSchema = z.object({
  label: z.string().trim().min(1),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  seriesId: z.string().trim().min(1, "Série requise."),
  subjectId: z.string().trim().min(1, "Matière requise."),
  chapterId: z.string().trim().min(1, "Chapitre requis."),
  type: z.enum(["QCM", "QCM_MULTIPLE", "VRAI_FAUX", "REPONSE_COURTE"]),
  difficulty: z.enum(["FACILE", "MOYEN", "DIFFICILE"]),
  prompt: z.string().trim().min(5, "Énoncé trop court."),
  explanation: z.string().trim().optional(),
  source: z.string().trim().optional(),
  examYear: z.string().optional(),
  correctAnswerText: z.string().trim().optional(),
  choicesJson: z.string().optional(),
  published: z.string().optional(),
});

type QuestionInput = {
  seriesId: string;
  subjectId: string;
  chapterId: string;
  type: "QCM" | "QCM_MULTIPLE" | "VRAI_FAUX" | "REPONSE_COURTE";
  difficulty: "FACILE" | "MOYEN" | "DIFFICILE";
  prompt: string;
  explanation: string | null;
  source: string | null;
  examYear: number | null;
  correctAnswerText: string | null;
  published: boolean;
  choices: { label: string; isCorrect: boolean; order: number }[];
};

function parseQuestionForm(formData: FormData): { error: string } | { data: QuestionInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = questionSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const { data } = parsed;
  const isChoiceBased = CHOICE_BASED_TYPES.includes(data.type);

  let choices: { label: string; isCorrect: boolean; order: number }[] = [];
  if (isChoiceBased) {
    try {
      const rawChoices = JSON.parse(data.choicesJson || "[]") as unknown;
      const parsedChoices = z.array(choiceSchema).min(2, "Au moins 2 propositions.").parse(rawChoices);
      if (!parsedChoices.some((c) => c.isCorrect)) {
        return { error: "Sélectionnez au moins une réponse correcte." };
      }
      choices = parsedChoices.map((c, index) => ({ ...c, order: index }));
    } catch {
      return { error: "Propositions invalides." };
    }
  } else if (!data.correctAnswerText) {
    return { error: "Réponse correcte requise pour ce type de question." };
  }

  return {
    data: {
      seriesId: data.seriesId,
      subjectId: data.subjectId,
      chapterId: data.chapterId,
      type: data.type,
      difficulty: data.difficulty,
      prompt: data.prompt,
      explanation: data.explanation || null,
      source: data.source || null,
      examYear: data.examYear ? Number(data.examYear) : null,
      correctAnswerText: isChoiceBased ? null : data.correctAnswerText || null,
      published: data.published === "on",
      choices,
    },
  };
}

export async function createQuestion(formData: FormData) {
  const user = await requireEditor();
  const result = parseQuestionForm(formData);
  if ("error" in result) {
    redirect(`/admin/bac/questions/nouveau?error=${encodeURIComponent(result.error)}`);
  }

  const { choices, ...data } = result.data;
  await prisma.question.create({
    data: {
      ...data,
      createdById: user.id,
      choices: { create: choices },
    },
  });
  revalidatePath("/admin/bac/questions");
  redirect("/admin/bac/questions");
}

export async function updateQuestion(id: string, formData: FormData) {
  await requireEditor();
  const result = parseQuestionForm(formData);
  if ("error" in result) {
    redirect(`/admin/bac/questions/${id}?error=${encodeURIComponent(result.error)}`);
  }

  const { choices, ...data } = result.data;
  await prisma.$transaction([
    prisma.questionChoice.deleteMany({ where: { questionId: id } }),
    prisma.question.update({
      where: { id },
      data: {
        ...data,
        choices: { create: choices },
      },
    }),
  ]);
  revalidatePath("/admin/bac/questions");
  redirect("/admin/bac/questions");
}

export async function deleteQuestion(id: string) {
  await requireEditor();
  await prisma.question.delete({ where: { id } });
  revalidatePath("/admin/bac/questions");
}

export async function togglePublished(id: string, current: boolean) {
  await requireEditor();
  await prisma.question.update({ where: { id }, data: { published: !current } });
  revalidatePath("/admin/bac/questions");
}

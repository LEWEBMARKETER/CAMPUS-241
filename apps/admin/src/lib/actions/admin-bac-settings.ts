"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@campus241/shared/prisma";
import { requireAdmin } from "@/lib/session";
import { getQuestionBankSettings } from "@campus241/shared/question-bank-settings";

export { getQuestionBankSettings };

const settingsSchema = z.object({
  weightTresFrequente: z.coerce.number().min(0).max(100),
  weightFrequente: z.coerce.number().min(0).max(100),
  weightOccasionnelle: z.coerce.number().min(0).max(100),
  weightRare: z.coerce.number().min(0).max(100),
  masteryThreshold1: z.coerce.number().int().min(0).max(100),
  masteryThreshold2: z.coerce.number().int().min(0).max(100),
  masteryThreshold3: z.coerce.number().int().min(0).max(100),
  masteryThreshold4: z.coerce.number().int().min(0).max(100),
  masteryThreshold5: z.coerce.number().int().min(0).max(100),
});

export async function updateQuestionBankSettings(formData: FormData) {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    redirect(
      `/bac/reglages?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Réglages invalides.")}`,
    );
  }

  const {
    masteryThreshold1,
    masteryThreshold2,
    masteryThreshold3,
    masteryThreshold4,
    masteryThreshold5,
  } = parsed.data;

  const thresholds = [
    masteryThreshold1,
    masteryThreshold2,
    masteryThreshold3,
    masteryThreshold4,
    masteryThreshold5,
  ];
  for (let i = 1; i < thresholds.length; i++) {
    if (thresholds[i] <= thresholds[i - 1]) {
      redirect(
        `/bac/reglages?error=${encodeURIComponent("Les seuils de maîtrise doivent être strictement croissants.")}`,
      );
    }
  }

  await prisma.questionBankSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/bac/reglages");
  redirect("/bac/reglages");
}

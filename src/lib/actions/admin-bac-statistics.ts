"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

type BacStatisticInput = {
  year: number;
  seriesId: string | null;
  province: string | null;
  candidatesCount: number | null;
  maleCandidates: number | null;
  femaleCandidates: number | null;
  admissibleCount: number | null;
  admittedCount: number | null;
  postponedCount: number | null;
  passRate: number | null;
  status: "OFFICIEL" | "NON_DISPONIBLE";
  source: string | null;
  notes: string | null;
};

const statisticSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  seriesId: z.string().trim().optional(),
  province: z.string().trim().optional(),
  candidatesCount: z.string().trim().optional(),
  maleCandidates: z.string().trim().optional(),
  femaleCandidates: z.string().trim().optional(),
  admissibleCount: z.string().trim().optional(),
  admittedCount: z.string().trim().optional(),
  postponedCount: z.string().trim().optional(),
  passRate: z.string().trim().optional(),
  status: z.enum(["OFFICIEL", "NON_DISPONIBLE"]),
  source: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

function toIntOrNull(value: string | undefined) {
  if (!value) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : Math.round(n);
}

function parseStatisticForm(formData: FormData): { error: string } | { data: BacStatisticInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = statisticSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }
  const { data } = parsed;

  if (data.status === "OFFICIEL" && !data.source) {
    return { error: "Une donnée marquée officielle doit préciser sa source." };
  }

  return {
    data: {
      year: data.year,
      seriesId: data.seriesId || null,
      province: data.province || null,
      candidatesCount: toIntOrNull(data.candidatesCount),
      maleCandidates: toIntOrNull(data.maleCandidates),
      femaleCandidates: toIntOrNull(data.femaleCandidates),
      admissibleCount: toIntOrNull(data.admissibleCount),
      admittedCount: toIntOrNull(data.admittedCount),
      postponedCount: toIntOrNull(data.postponedCount),
      passRate: data.passRate ? Number(data.passRate) : null,
      status: data.status,
      source: data.source || null,
      notes: data.notes || null,
    },
  };
}

export async function createBacStatistic(formData: FormData) {
  await requireAdmin();
  const result = parseStatisticForm(formData);
  if ("error" in result) {
    redirect(`/admin/bac/statistiques/nouveau?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.bacStatistic.create({ data: result.data });
  revalidatePath("/admin/bac/statistiques");
  redirect("/admin/bac/statistiques");
}

export async function updateBacStatistic(id: string, formData: FormData) {
  await requireAdmin();
  const result = parseStatisticForm(formData);
  if ("error" in result) {
    redirect(`/admin/bac/statistiques/${id}?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.bacStatistic.update({ where: { id }, data: result.data });
  revalidatePath("/admin/bac/statistiques");
  redirect("/admin/bac/statistiques");
}

export async function deleteBacStatistic(id: string) {
  await requireAdmin();
  await prisma.bacStatistic.delete({ where: { id } });
  revalidatePath("/admin/bac/statistiques");
}

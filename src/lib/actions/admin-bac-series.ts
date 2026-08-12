"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/session";

type SeriesInput = {
  code: string;
  name: string;
  country: string;
  order: number;
  isActive: boolean;
};

const seriesSchema = z.object({
  code: z.string().trim().min(1, "Code requis.").toUpperCase(),
  name: z.string().trim().min(2, "Nom trop court."),
  country: z.string().trim().min(2, "Pays requis."),
  order: z.coerce.number().int().default(0),
  isActive: z.string().optional(),
});

function parseSeriesForm(formData: FormData): { error: string } | { data: SeriesInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = seriesSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }
  return {
    data: {
      code: parsed.data.code,
      name: parsed.data.name,
      country: parsed.data.country,
      order: parsed.data.order,
      isActive: parsed.data.isActive === "on",
    },
  };
}

export async function createSeries(formData: FormData) {
  await requireEditor();
  const result = parseSeriesForm(formData);
  if ("error" in result) {
    redirect(`/admin/bac/series/nouveau?error=${encodeURIComponent(result.error)}`);
  }

  const existing = await prisma.series.findUnique({
    where: { country_code: { country: result.data.country, code: result.data.code } },
  });
  if (existing) {
    redirect(
      `/admin/bac/series/nouveau?error=${encodeURIComponent("Cette série existe déjà pour ce pays.")}`,
    );
  }

  await prisma.series.create({ data: result.data });
  revalidatePath("/admin/bac/series");
  redirect("/admin/bac/series");
}

export async function updateSeries(id: string, formData: FormData) {
  await requireEditor();
  const result = parseSeriesForm(formData);
  if ("error" in result) {
    redirect(`/admin/bac/series/${id}?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.series.update({ where: { id }, data: result.data });
  revalidatePath("/admin/bac/series");
  redirect("/admin/bac/series");
}

export async function deleteSeries(id: string) {
  await requireEditor();
  await prisma.series.delete({ where: { id } });
  revalidatePath("/admin/bac/series");
}

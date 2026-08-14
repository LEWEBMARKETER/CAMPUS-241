"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/session";

type SubjectInput = {
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  seriesCoefficients: { seriesId: string; coefficient: number | null }[];
};

const subjectSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug trop court.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (minuscules, chiffres, tirets)."),
  order: z.coerce.number().int().default(0),
  isActive: z.string().optional(),
});

function parseSubjectForm(formData: FormData): { error: string } | { data: SubjectInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = subjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const seriesIds = formData.getAll("seriesIds").map(String);
  const seriesCoefficients = seriesIds.map((seriesId) => {
    const raw = formData.get(`coefficient_${seriesId}`)?.toString().trim();
    const coefficient = raw ? Number(raw) : null;
    return { seriesId, coefficient: coefficient && !Number.isNaN(coefficient) ? coefficient : null };
  });

  return {
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      order: parsed.data.order,
      isActive: parsed.data.isActive === "on",
      seriesCoefficients,
    },
  };
}

export async function createSubject(formData: FormData) {
  await requireEditor();
  const result = parseSubjectForm(formData);
  if ("error" in result) {
    redirect(`/admin/bac/matieres/nouveau?error=${encodeURIComponent(result.error)}`);
  }

  const { seriesCoefficients, ...data } = result.data;
  await prisma.subject.create({
    data: {
      ...data,
      series: {
        create: seriesCoefficients.map(({ seriesId, coefficient }) => ({ seriesId, coefficient })),
      },
    },
  });
  revalidatePath("/admin/bac/matieres");
  redirect("/admin/bac/matieres");
}

export async function updateSubject(id: string, formData: FormData) {
  await requireEditor();
  const result = parseSubjectForm(formData);
  if ("error" in result) {
    redirect(`/admin/bac/matieres/${id}?error=${encodeURIComponent(result.error)}`);
  }

  const { seriesCoefficients, ...data } = result.data;
  await prisma.$transaction([
    prisma.subject.update({ where: { id }, data }),
    prisma.seriesSubject.deleteMany({ where: { subjectId: id } }),
    prisma.seriesSubject.createMany({
      data: seriesCoefficients.map(({ seriesId, coefficient }) => ({
        subjectId: id,
        seriesId,
        coefficient,
      })),
    }),
  ]);
  revalidatePath("/admin/bac/matieres");
  redirect("/admin/bac/matieres");
}

export async function deleteSubject(id: string) {
  await requireEditor();
  await prisma.subject.delete({ where: { id } });
  revalidatePath("/admin/bac/matieres");
}

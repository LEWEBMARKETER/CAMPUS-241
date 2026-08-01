"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const advisorSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court."),
  specialty: z.string().trim().optional(),
  city: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  photoUrl: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  calendlyUrl: z.string().trim().optional(),
});

type AdvisorInput = {
  name: string;
  specialty: string | null;
  city: string | null;
  bio: string | null;
  photoUrl: string | null;
  whatsapp: string | null;
  calendlyUrl: string | null;
};

function parseAdvisorForm(
  formData: FormData,
): { error: string } | { data: AdvisorInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = advisorSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." } as const;
  }

  return {
    data: {
      name: parsed.data.name,
      specialty: parsed.data.specialty || null,
      city: parsed.data.city || null,
      bio: parsed.data.bio || null,
      photoUrl: parsed.data.photoUrl || null,
      whatsapp: parsed.data.whatsapp || null,
      calendlyUrl: parsed.data.calendlyUrl || null,
    },
  } as const;
}

export async function createAdvisor(formData: FormData) {
  await requireAdmin();
  const result = parseAdvisorForm(formData);
  if ("error" in result) {
    redirect(`/admin/conseillers/nouveau?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.advisor.create({ data: result.data });
  revalidatePath("/admin/conseillers");
  revalidatePath("/conseillers");
  redirect("/admin/conseillers");
}

export async function updateAdvisor(id: string, formData: FormData) {
  await requireAdmin();
  const result = parseAdvisorForm(formData);
  if ("error" in result) {
    redirect(`/admin/conseillers/${id}?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.advisor.update({ where: { id }, data: result.data });
  revalidatePath("/admin/conseillers");
  revalidatePath(`/conseillers/${id}`);
  revalidatePath("/conseillers");
  redirect("/admin/conseillers");
}

export async function deleteAdvisor(id: string) {
  await requireAdmin();
  await prisma.advisor.delete({ where: { id } });
  revalidatePath("/admin/conseillers");
  revalidatePath("/conseillers");
}

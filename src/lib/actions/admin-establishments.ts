"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const establishmentSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court."),
  type: z.enum(["COLLEGE_LYCEE", "UNIVERSITE", "GRANDE_ECOLE", "CENTRE_FORMATION"]),
  description: z.string().trim().optional(),
  logoUrl: z.string().trim().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  publicOrPrivate: z.enum(["PUBLIC", "PRIVE", ""]).optional(),
  niveauAdmission: z.string().trim().optional(),
  admissionInfo: z.string().trim().optional(),
  budgetRange: z.string().trim().optional(),
  contactEmail: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  isPartner: z.string().optional(),
});

type EstablishmentInput = {
  name: string;
  type: "COLLEGE_LYCEE" | "UNIVERSITE" | "GRANDE_ECOLE" | "CENTRE_FORMATION";
  description: string | null;
  logoUrl: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  publicOrPrivate: "PUBLIC" | "PRIVE" | null;
  niveauAdmission: string | null;
  admissionInfo: string | null;
  budgetRange: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  isPartner: boolean;
  filieres: string[];
};

function parseEstablishmentForm(
  formData: FormData,
): { error: string } | { data: EstablishmentInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = establishmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." } as const;
  }

  const filieres = formData.getAll("filieres").map(String);

  return {
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      description: parsed.data.description || null,
      logoUrl: parsed.data.logoUrl || null,
      address: parsed.data.address || null,
      city: parsed.data.city || null,
      country: parsed.data.country || null,
      publicOrPrivate: parsed.data.publicOrPrivate || null,
      niveauAdmission: parsed.data.niveauAdmission || null,
      admissionInfo: parsed.data.admissionInfo || null,
      budgetRange: parsed.data.budgetRange || null,
      contactEmail: parsed.data.contactEmail || null,
      contactPhone: parsed.data.contactPhone || null,
      isPartner: parsed.data.isPartner === "on",
      filieres,
    },
  } as const;
}

export async function createEstablishment(formData: FormData) {
  await requireAdmin();
  const result = parseEstablishmentForm(formData);
  if ("error" in result) {
    redirect(`/admin/etablissements/nouveau?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.establishment.create({ data: result.data });
  revalidatePath("/admin/etablissements");
  revalidatePath("/annuaire");
  redirect("/admin/etablissements");
}

export async function updateEstablishment(id: string, formData: FormData) {
  await requireAdmin();
  const result = parseEstablishmentForm(formData);
  if ("error" in result) {
    redirect(`/admin/etablissements/${id}?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.establishment.update({ where: { id }, data: result.data });
  revalidatePath("/admin/etablissements");
  revalidatePath(`/annuaire/${id}`);
  revalidatePath("/annuaire");
  redirect("/admin/etablissements");
}

export async function deleteEstablishment(id: string) {
  await requireAdmin();
  await prisma.establishment.delete({ where: { id } });
  revalidatePath("/admin/etablissements");
  revalidatePath("/annuaire");
}

export async function togglePartnerStatus(id: string, current: boolean) {
  await requireAdmin();
  await prisma.establishment.update({
    where: { id },
    data: { isPartner: !current },
  });
  revalidatePath("/admin/etablissements");
  revalidatePath("/annuaire");
  revalidatePath(`/annuaire/${id}`);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

type EstablishmentInput = {
  name: string;
  acronym: string | null;
  logoUrl: string | null;
  publicOrPrivate: "PUBLIC" | "PRIVE";
  levels: ("PRIMAIRE" | "COLLEGE" | "LYCEE" | "SUPERIEUR")[];
  description: string | null;
  province: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  classesOffered: string[];
  filieresSuperieur: string[];
  diplomasOffered: string[];
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  secretariatContact: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  tiktokUrl: string | null;
  schedule: string | null;
  registrationPeriod: string | null;
  admissionConditions: string | null;
  tuitionFees: string | null;
};

const establishmentSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court."),
  acronym: z.string().trim().optional(),
  logoUrl: z.string().trim().optional(),
  publicOrPrivate: z.enum(["PUBLIC", "PRIVE"]),
  description: z.string().trim().optional(),
  province: z.string().trim().optional(),
  city: z.string().trim().optional(),
  district: z.string().trim().optional(),
  address: z.string().trim().optional(),
  latitude: z.string().trim().optional(),
  longitude: z.string().trim().optional(),
  googleMapsUrl: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  email: z.string().trim().optional(),
  secretariatContact: z.string().trim().optional(),
  websiteUrl: z.string().trim().optional(),
  facebookUrl: z.string().trim().optional(),
  instagramUrl: z.string().trim().optional(),
  linkedinUrl: z.string().trim().optional(),
  tiktokUrl: z.string().trim().optional(),
  schedule: z.string().trim().optional(),
  registrationPeriod: z.string().trim().optional(),
  admissionConditions: z.string().trim().optional(),
  tuitionFees: z.string().trim().optional(),
});

function parseTagList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseEstablishmentForm(
  formData: FormData,
): { error: string } | { data: EstablishmentInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = establishmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const levels = formData.getAll("levels").map(String) as (
    | "PRIMAIRE"
    | "COLLEGE"
    | "LYCEE"
    | "SUPERIEUR"
  )[];
  if (levels.length === 0) {
    return { error: "Sélectionnez au moins un niveau." };
  }

  const classesOffered = formData.getAll("classesOffered").map(String);
  const filieresSuperieur = parseTagList(formData.get("filieresSuperieur")?.toString());
  const diplomasOffered = parseTagList(formData.get("diplomasOffered")?.toString());

  const latitude = parsed.data.latitude ? Number(parsed.data.latitude) : null;
  const longitude = parsed.data.longitude ? Number(parsed.data.longitude) : null;
  if (parsed.data.latitude && Number.isNaN(latitude)) {
    return { error: "Latitude invalide." };
  }
  if (parsed.data.longitude && Number.isNaN(longitude)) {
    return { error: "Longitude invalide." };
  }

  return {
    data: {
      name: parsed.data.name,
      acronym: parsed.data.acronym || null,
      logoUrl: parsed.data.logoUrl || null,
      publicOrPrivate: parsed.data.publicOrPrivate,
      levels,
      description: parsed.data.description || null,
      province: parsed.data.province || null,
      city: parsed.data.city || null,
      district: parsed.data.district || null,
      address: parsed.data.address || null,
      latitude,
      longitude,
      googleMapsUrl: parsed.data.googleMapsUrl || null,
      classesOffered,
      filieresSuperieur,
      diplomasOffered,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      email: parsed.data.email || null,
      secretariatContact: parsed.data.secretariatContact || null,
      websiteUrl: parsed.data.websiteUrl || null,
      facebookUrl: parsed.data.facebookUrl || null,
      instagramUrl: parsed.data.instagramUrl || null,
      linkedinUrl: parsed.data.linkedinUrl || null,
      tiktokUrl: parsed.data.tiktokUrl || null,
      schedule: parsed.data.schedule || null,
      registrationPeriod: parsed.data.registrationPeriod || null,
      admissionConditions: parsed.data.admissionConditions || null,
      tuitionFees: parsed.data.tuitionFees || null,
    },
  };
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

export async function toggleArchived(id: string, current: boolean) {
  await requireAdmin();
  await prisma.establishment.update({ where: { id }, data: { archived: !current } });
  revalidatePath("/admin/etablissements");
  revalidatePath("/annuaire");
  revalidatePath(`/annuaire/${id}`);
}

export async function toggleVerified(id: string, current: boolean) {
  await requireAdmin();
  await prisma.establishment.update({ where: { id }, data: { verified: !current } });
  revalidatePath("/admin/etablissements");
  revalidatePath(`/admin/etablissements/${id}`);
  revalidatePath("/annuaire");
  revalidatePath(`/annuaire/${id}`);
}

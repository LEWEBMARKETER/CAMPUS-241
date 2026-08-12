"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { requireEstablishmentOwner, requireUser } from "@/lib/session";

const signupSchema = z.object({
  prenom: z.string().trim().min(2, "Prénom trop court."),
  nom: z.string().trim().min(2, "Nom trop court."),
  email: z.email("Adresse email invalide."),
  password: z.string().min(8, "8 caractères minimum."),
  name: z.string().trim().min(2, "Nom de l'établissement trop court."),
  type: z.enum(["COLLEGE_LYCEE", "UNIVERSITE", "GRANDE_ECOLE", "CENTRE_FORMATION"]),
  city: z.string().trim().optional(),
  address: z.string().trim().optional(),
  description: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  websiteUrl: z.string().trim().optional(),
});

export type EstablishmentSignupState = { error?: string } | null;

export async function registerEstablishment(
  _prevState: EstablishmentSignupState,
  formData: FormData,
): Promise<EstablishmentSignupState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const responsableNom = `${parsed.data.prenom} ${parsed.data.nom}`;

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        nom: parsed.data.nom,
        prenom: parsed.data.prenom,
        email: parsed.data.email,
        passwordHash,
        role: "ETABLISSEMENT",
      },
    });

    await tx.establishment.create({
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        city: parsed.data.city || null,
        address: parsed.data.address || null,
        description: parsed.data.description || null,
        contactEmail: parsed.data.email,
        contactPhone: parsed.data.contactPhone || null,
        websiteUrl: parsed.data.websiteUrl || null,
        ownerUserId: user.id,
        responsableNom,
        responsableEmail: parsed.data.email,
        responsablePhone: parsed.data.contactPhone || null,
        status: "PENDING_REVIEW",
        plan: "FREE",
      },
    });
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard/etablissement",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Fiche créée, mais la connexion automatique a échoué. Merci de vous connecter.",
      };
    }
    throw error;
  }

  return null;
}

type OwnEstablishmentInput = {
  name: string;
  type: "COLLEGE_LYCEE" | "UNIVERSITE" | "GRANDE_ECOLE" | "CENTRE_FORMATION";
  description: string | null;
  logoUrl: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  publicOrPrivate: "PUBLIC" | "PRIVE" | null;
  filieres: string[];
  niveauAdmission: string | null;
  admissionInfo: string | null;
  budgetRange: string | null;
  websiteUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
};

const ownEstablishmentSchema = z.object({
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
  websiteUrl: z.string().trim().optional(),
  contactEmail: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
});

function parseOwnEstablishmentForm(
  formData: FormData,
): { error: string } | { data: OwnEstablishmentInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = ownEstablishmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
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
      filieres,
      niveauAdmission: parsed.data.niveauAdmission || null,
      admissionInfo: parsed.data.admissionInfo || null,
      budgetRange: parsed.data.budgetRange || null,
      websiteUrl: parsed.data.websiteUrl || null,
      contactEmail: parsed.data.contactEmail || null,
      contactPhone: parsed.data.contactPhone || null,
    },
  };
}

export async function updateOwnEstablishment(id: string, formData: FormData) {
  await requireEstablishmentOwner(id);
  const result = parseOwnEstablishmentForm(formData);
  if ("error" in result) {
    redirect(`/dashboard/etablissement?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.establishment.update({ where: { id }, data: result.data });
  revalidatePath("/dashboard/etablissement");
  revalidatePath("/annuaire");
  revalidatePath(`/annuaire/${id}`);
  redirect("/dashboard/etablissement");
}

export async function claimEstablishment(token: string) {
  const user = await requireUser();

  const establishment = await prisma.establishment.findUnique({ where: { claimToken: token } });
  if (!establishment) {
    notFound();
  }
  if (establishment.ownerUserId || establishment.claimedAt) {
    redirect("/dashboard");
  }

  await prisma.$transaction(async (tx) => {
    await tx.establishment.update({
      where: { id: establishment.id },
      data: { ownerUserId: user.id, claimedAt: new Date(), claimToken: null },
    });
    if (user.role === "UTILISATEUR") {
      await tx.user.update({ where: { id: user.id }, data: { role: "ETABLISSEMENT" } });
    }
  });

  revalidatePath("/admin/etablissements");
  revalidatePath("/dashboard/etablissement");
  redirect("/dashboard/etablissement");
}

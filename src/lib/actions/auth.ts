"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";

import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";

const registerSchema = z.object({
  nom: z.string().trim().min(2, "Nom trop court."),
  prenom: z.string().trim().min(2, "Prénom trop court."),
  email: z.email("Adresse email invalide."),
  whatsapp: z.string().trim().optional(),
  dateNaissance: z.string().optional(),
  niveau: z.string().trim().optional(),
  classeOuNiveauUniv: z.string().trim().optional(),
  serie: z.string().trim().optional(),
  ville: z.string().trim().optional(),
  password: z.string().min(8, "8 caractères minimum."),
});

export type RegisterState = { error?: string } | null;

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = registerSchema.safeParse(raw);

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

  await prisma.user.create({
    data: {
      nom: parsed.data.nom,
      prenom: parsed.data.prenom,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp || null,
      dateNaissance: parsed.data.dateNaissance
        ? new Date(parsed.data.dateNaissance)
        : null,
      niveau: parsed.data.niveau || null,
      classeOuNiveauUniv: parsed.data.classeOuNiveauUniv || null,
      serie: parsed.data.serie || null,
      ville: parsed.data.ville || null,
      passwordHash,
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Compte créé, mais la connexion automatique a échoué. Merci de vous connecter." };
    }
    throw error;
  }

  return null;
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}

export type LoginState = { error?: string } | null;

export async function loginUser(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Merci de renseigner votre email et votre mot de passe." };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect." };
    }
    throw error;
  }

  return null;
}

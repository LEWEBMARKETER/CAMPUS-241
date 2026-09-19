"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@campus241/shared/auth";

export async function logoutAdmin() {
  await signOut({ redirectTo: "/connexion" });
}

export type LoginState = { error?: string } | null;

export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Merci de renseigner votre email et votre mot de passe." };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect." };
    }
    throw error;
  }

  return null;
}

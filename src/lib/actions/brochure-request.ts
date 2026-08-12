"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";

const brochureRequestSchema = z.object({
  establishmentId: z.string().min(1),
  name: z.string().trim().min(2, "Merci d'indiquer votre nom."),
  email: z.email("Adresse email invalide."),
  whatsapp: z.string().trim().optional(),
});

export type BrochureRequestState = {
  success: boolean;
  error?: string;
} | null;

export async function requestBrochure(
  _prevState: BrochureRequestState,
  formData: FormData,
): Promise<BrochureRequestState> {
  const parsed = brochureRequestSchema.safeParse({
    establishmentId: formData.get("establishmentId"),
    name: formData.get("name"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Formulaire invalide.",
    };
  }

  const establishment = await prisma.establishment.findUnique({
    where: { id: parsed.data.establishmentId },
    select: { id: true },
  });

  if (!establishment) {
    return { success: false, error: "Établissement introuvable." };
  }

  await prisma.brochureRequest.create({ data: parsed.data });

  return { success: true };
}

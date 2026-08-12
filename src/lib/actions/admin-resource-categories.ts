"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/session";

type CategoryInput = {
  name: string;
  slug: string;
  kind: "NIVEAU" | "DOMAINE" | "FILIERE";
  parentId: string | null;
  order: number;
  isActive: boolean;
};

const categorySchema = z.object({
  name: z.string().trim().min(2, "Nom trop court."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug trop court.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (minuscules, chiffres, tirets)."),
  kind: z.enum(["NIVEAU", "DOMAINE", "FILIERE"]),
  parentId: z.string().optional(),
  order: z.coerce.number().int().default(0),
  isActive: z.string().optional(),
});

function parseCategoryForm(formData: FormData): { error: string } | { data: CategoryInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }
  if (parsed.data.kind === "FILIERE" && !parsed.data.parentId) {
    return { error: "Une filière doit être rattachée à un domaine." };
  }
  return {
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      kind: parsed.data.kind,
      parentId: parsed.data.kind === "FILIERE" ? parsed.data.parentId || null : null,
      order: parsed.data.order,
      isActive: parsed.data.isActive === "on",
    },
  };
}

export async function createResourceCategory(formData: FormData) {
  await requireEditor();
  const result = parseCategoryForm(formData);
  if ("error" in result) {
    redirect(`/admin/ressources/categories/nouveau?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.resourceCategory.create({ data: result.data });
  revalidatePath("/admin/ressources/categories");
  redirect("/admin/ressources/categories");
}

export async function updateResourceCategory(id: string, formData: FormData) {
  await requireEditor();
  const result = parseCategoryForm(formData);
  if ("error" in result) {
    redirect(`/admin/ressources/categories/${id}?error=${encodeURIComponent(result.error)}`);
  }

  await prisma.resourceCategory.update({ where: { id }, data: result.data });
  revalidatePath("/admin/ressources/categories");
  redirect("/admin/ressources/categories");
}

export async function deleteResourceCategory(id: string) {
  await requireEditor();
  await prisma.resourceCategory.delete({ where: { id } });
  revalidatePath("/admin/ressources/categories");
}

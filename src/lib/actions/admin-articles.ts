"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const articleSchema = z.object({
  title: z.string().trim().min(2, "Titre trop court."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug trop court.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (minuscules, chiffres, tirets)."),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(10, "Contenu trop court."),
  coverImageUrl: z.string().trim().optional(),
  category: z.string().trim().optional(),
  authorName: z.string().trim().optional(),
  published: z.string().optional(),
});

type ArticleInput = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  category: string | null;
  authorName: string | null;
  publishedAt: Date | null;
};

function parseArticleForm(
  formData: FormData,
): { error: string } | { data: ArticleInput } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." } as const;
  }

  return {
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      coverImageUrl: parsed.data.coverImageUrl || null,
      category: parsed.data.category || null,
      authorName: parsed.data.authorName || null,
      publishedAt: parsed.data.published === "on" ? new Date() : null,
    },
  } as const;
}

export async function createArticle(formData: FormData) {
  await requireAdmin();
  const result = parseArticleForm(formData);
  if ("error" in result) {
    redirect(`/admin/articles/nouveau?error=${encodeURIComponent(result.error)}`);
  }

  const existing = await prisma.article.findUnique({ where: { slug: result.data.slug } });
  if (existing) {
    redirect(`/admin/articles/nouveau?error=${encodeURIComponent("Ce slug est déjà utilisé.")}`);
  }

  await prisma.article.create({ data: result.data });
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();
  const result = parseArticleForm(formData);
  if ("error" in result) {
    redirect(`/admin/articles/${id}?error=${encodeURIComponent(result.error)}`);
  }

  const existing = await prisma.article.findUnique({ where: { slug: result.data.slug } });
  if (existing && existing.id !== id) {
    redirect(`/admin/articles/${id}?error=${encodeURIComponent("Ce slug est déjà utilisé.")}`);
  }

  await prisma.article.update({ where: { id }, data: result.data });
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
}

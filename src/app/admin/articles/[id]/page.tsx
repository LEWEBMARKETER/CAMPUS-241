import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleForm } from "@/components/admin/article-form";
import { updateArticle } from "@/lib/actions/admin-articles";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Modifier l'article" };

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">
        Modifier {article.title}
      </h2>
      <div className="mt-4 max-w-2xl">
        <ArticleForm
          article={article}
          action={updateArticle.bind(null, id)}
          error={error}
        />
      </div>
    </div>
  );
}

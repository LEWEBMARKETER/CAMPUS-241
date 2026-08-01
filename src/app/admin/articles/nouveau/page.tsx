import type { Metadata } from "next";

import { ArticleForm } from "@/components/admin/article-form";
import { createArticle } from "@/lib/actions/admin-articles";

export const metadata: Metadata = { title: "Nouvel article" };

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Nouvel article</h2>
      <div className="mt-4 max-w-2xl">
        <ArticleForm action={createArticle} error={error} />
      </div>
    </div>
  );
}

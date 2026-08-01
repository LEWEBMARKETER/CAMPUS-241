import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteArticle } from "@/lib/actions/admin-articles";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Gestion des articles" };

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {articles.length} article{articles.length > 1 ? "s" : ""}
        </p>
        <Button asChild size="sm">
          <Link href="/admin/articles/nouveau">Nouvel article</Link>
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">{article.title}</td>
                <td className="px-4 py-3 text-neutral-600">{article.category ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      article.publishedAt
                        ? "rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark"
                        : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                    }
                  >
                    {article.publishedAt ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/articles/${article.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form action={deleteArticle.bind(null, article.id)}>
                      <Button type="submit" variant="outline" size="sm">
                        <Trash2 className="size-4" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

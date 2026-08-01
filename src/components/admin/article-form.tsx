import type { Article } from "@prisma/client";

import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function ArticleForm({
  article,
  action,
  error,
}: {
  article?: Article;
  action: (formData: FormData) => void;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div>
        <label className={labelClass}>Titre</label>
        <input type="text" name="title" required defaultValue={article?.title} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Slug (URL)</label>
        <input
          type="text"
          name="slug"
          required
          placeholder="bac-2026-calendrier"
          defaultValue={article?.slug}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Catégorie</label>
          <input
            type="text"
            name="category"
            placeholder="Révisions Bac, Orientation scolaire..."
            defaultValue={article?.category ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Auteur</label>
          <input
            type="text"
            name="authorName"
            defaultValue={article?.authorName ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Extrait</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={article?.excerpt ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Contenu</label>
        <textarea
          name="content"
          rows={10}
          required
          defaultValue={article?.content}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Image de couverture (URL)</label>
        <input
          type="text"
          name="coverImageUrl"
          placeholder="https://..."
          defaultValue={article?.coverImageUrl ?? ""}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="published"
          defaultChecked={Boolean(article?.publishedAt)}
        />
        Publier
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        {article ? "Enregistrer les modifications" : "Créer l'article"}
      </Button>
    </form>
  );
}

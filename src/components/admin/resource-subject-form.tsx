import type { ResourceSubject } from "@prisma/client";

import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function ResourceSubjectForm({
  subject,
  action,
  error,
}: {
  subject?: ResourceSubject;
  action: (formData: FormData) => void;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div>
        <label className={labelClass}>Nom</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={subject?.name}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Slug</label>
        <input
          type="text"
          name="slug"
          placeholder="comptabilite"
          required
          defaultValue={subject?.slug}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="isActive" defaultChecked={subject?.isActive ?? true} />
        Active
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        {subject ? "Enregistrer les modifications" : "Créer la matière"}
      </Button>
    </form>
  );
}

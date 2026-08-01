import type { Advisor } from "@prisma/client";

import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function AdvisorForm({
  advisor,
  action,
  error,
}: {
  advisor?: Advisor;
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
        <label className={labelClass}>Nom</label>
        <input type="text" name="name" required defaultValue={advisor?.name} className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Spécialité</label>
          <input
            type="text"
            name="specialty"
            defaultValue={advisor?.specialty ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Ville</label>
          <input type="text" name="city" defaultValue={advisor?.city ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Bio</label>
        <textarea name="bio" rows={3} defaultValue={advisor?.bio ?? ""} className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>WhatsApp</label>
          <input
            type="tel"
            name="whatsapp"
            defaultValue={advisor?.whatsapp ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Lien Calendly</label>
          <input
            type="text"
            name="calendlyUrl"
            placeholder="https://calendly.com/..."
            defaultValue={advisor?.calendlyUrl ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>URL de la photo</label>
        <input
          type="text"
          name="photoUrl"
          placeholder="https://..."
          defaultValue={advisor?.photoUrl ?? ""}
          className={inputClass}
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        {advisor ? "Enregistrer les modifications" : "Créer le conseiller"}
      </Button>
    </form>
  );
}

import type { Establishment } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  ESTABLISHMENT_TYPE_LABELS,
  FILIERES,
  PUBLIC_PRIVATE_LABELS,
} from "@/lib/establishment";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function EstablishmentForm({
  establishment,
  action,
  error,
}: {
  establishment?: Establishment;
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
        <input
          type="text"
          name="name"
          required
          defaultValue={establishment?.name}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Type</label>
          <select
            name="type"
            required
            defaultValue={establishment?.type ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Sélectionner
            </option>
            {Object.entries(ESTABLISHMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Secteur</label>
          <select
            name="publicOrPrivate"
            defaultValue={establishment?.publicOrPrivate ?? ""}
            className={inputClass}
          >
            <option value="">Non renseigné</option>
            {Object.entries(PUBLIC_PRIVATE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={establishment?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Ville</label>
          <input
            type="text"
            name="city"
            defaultValue={establishment?.city ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Pays</label>
          <input
            type="text"
            name="country"
            defaultValue={establishment?.country ?? "Gabon"}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Adresse</label>
        <input
          type="text"
          name="address"
          defaultValue={establishment?.address ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Filières</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FILIERES.map((filiere) => (
            <label key={filiere} className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                name="filieres"
                value={filiere}
                defaultChecked={establishment?.filieres.includes(filiere)}
              />
              {filiere}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Niveau d&apos;admission</label>
          <input
            type="text"
            name="niveauAdmission"
            defaultValue={establishment?.niveauAdmission ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Budget indicatif</label>
          <input
            type="text"
            name="budgetRange"
            defaultValue={establishment?.budgetRange ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Informations d&apos;admission</label>
        <textarea
          name="admissionInfo"
          rows={2}
          defaultValue={establishment?.admissionInfo ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Email de contact</label>
          <input
            type="email"
            name="contactEmail"
            defaultValue={establishment?.contactEmail ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Téléphone de contact</label>
          <input
            type="tel"
            name="contactPhone"
            defaultValue={establishment?.contactPhone ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>URL du logo</label>
        <input
          type="text"
          name="logoUrl"
          placeholder="https://..."
          defaultValue={establishment?.logoUrl ?? ""}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="isPartner"
          defaultChecked={establishment?.isPartner}
        />
        Établissement partenaire
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        {establishment ? "Enregistrer les modifications" : "Créer l'établissement"}
      </Button>
    </form>
  );
}

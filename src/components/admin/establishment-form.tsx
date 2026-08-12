"use client";

import { useState } from "react";
import type { Establishment } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  CLASSES_BY_LEVEL,
  ESTABLISHMENT_LEVEL_LABELS,
  GABON_PROVINCES,
  PUBLIC_PRIVATE_LABELS,
} from "@/lib/establishment";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

type Level = "PRIMAIRE" | "COLLEGE" | "LYCEE" | "SUPERIEUR";

export function EstablishmentForm({
  establishment,
  action,
  error,
}: {
  establishment?: Establishment;
  action: (formData: FormData) => void;
  error?: string;
}) {
  const [levels, setLevels] = useState<Level[]>(
    (establishment?.levels as Level[] | undefined) ?? [],
  );

  function toggleLevel(level: Level) {
    setLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  }

  const showScolaire = levels.some((l) => l !== "SUPERIEUR");
  const showSuperieur = levels.includes("SUPERIEUR");

  return (
    <form action={action} className="flex flex-col gap-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <p className="text-sm font-semibold text-neutral-900">Identité</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Nom officiel</label>
          <input
            type="text"
            name="name"
            required
            defaultValue={establishment?.name}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Sigle</label>
          <input
            type="text"
            name="acronym"
            defaultValue={establishment?.acronym ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>URL du logo</label>
        <input
          type="text"
          name="logoUrl"
          placeholder="https://…"
          defaultValue={establishment?.logoUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Type</label>
        <select
          name="publicOrPrivate"
          required
          defaultValue={establishment?.publicOrPrivate ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Sélectionner
          </option>
          {Object.entries(PUBLIC_PRIVATE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Niveaux</label>
        <div className="flex flex-wrap gap-3">
          {Object.entries(ESTABLISHMENT_LEVEL_LABELS).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                name="levels"
                value={value}
                checked={levels.includes(value as Level)}
                onChange={() => toggleLevel(value as Level)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Description courte</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={establishment?.description ?? ""}
          className={inputClass}
        />
      </div>

      <p className="mt-2 text-sm font-semibold text-neutral-900">Localisation</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Province</label>
          <select
            name="province"
            defaultValue={establishment?.province ?? ""}
            className={inputClass}
          >
            <option value="">Non renseignée</option>
            {GABON_PROVINCES.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Ville</label>
          <input
            type="text"
            name="city"
            defaultValue={establishment?.city ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Quartier</label>
          <input
            type="text"
            name="district"
            defaultValue={establishment?.district ?? ""}
            className={inputClass}
          />
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
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Latitude</label>
          <input
            type="text"
            name="latitude"
            placeholder="0.4162"
            defaultValue={establishment?.latitude ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Longitude</label>
          <input
            type="text"
            name="longitude"
            placeholder="9.4673"
            defaultValue={establishment?.longitude ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Lien Google Maps</label>
          <input
            type="text"
            name="googleMapsUrl"
            placeholder="https://maps.google.com/…"
            defaultValue={establishment?.googleMapsUrl ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <p className="mt-2 text-sm font-semibold text-neutral-900">Enseignement</p>

      {showScolaire && (
        <div>
          <label className={labelClass}>Classes proposées</label>
          <div className="flex flex-wrap gap-3">
            {(["PRIMAIRE", "COLLEGE", "LYCEE"] as const)
              .filter((level) => levels.includes(level))
              .flatMap((level) => CLASSES_BY_LEVEL[level])
              .map((classe) => (
                <label key={classe} className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    name="classesOffered"
                    value={classe}
                    defaultChecked={establishment?.classesOffered.includes(classe)}
                  />
                  {classe}
                </label>
              ))}
          </div>
        </div>
      )}

      {showSuperieur && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Filières / formations</label>
            <input
              type="text"
              name="filieresSuperieur"
              placeholder="Informatique, Droit, Gestion…"
              defaultValue={establishment?.filieresSuperieur.join(", ") ?? ""}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-neutral-500">Séparées par des virgules.</p>
          </div>
          <div>
            <label className={labelClass}>Diplômes préparés</label>
            <input
              type="text"
              name="diplomasOffered"
              placeholder="Licence, Master…"
              defaultValue={establishment?.diplomasOffered.join(", ") ?? ""}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-neutral-500">Séparés par des virgules.</p>
          </div>
        </div>
      )}

      <p className="mt-2 text-sm font-semibold text-neutral-900">Contact</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Téléphone</label>
          <input
            type="tel"
            name="phone"
            defaultValue={establishment?.phone ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>WhatsApp</label>
          <input
            type="tel"
            name="whatsapp"
            defaultValue={establishment?.whatsapp ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            name="email"
            defaultValue={establishment?.email ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Contact secrétariat</label>
          <input
            type="text"
            name="secretariatContact"
            placeholder="Nom - téléphone"
            defaultValue={establishment?.secretariatContact ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Site officiel</label>
        <input
          type="text"
          name="websiteUrl"
          placeholder="https://…"
          defaultValue={establishment?.websiteUrl ?? ""}
          className={inputClass}
        />
      </div>

      <p className="mt-2 text-sm font-semibold text-neutral-900">Réseaux sociaux</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Facebook</label>
          <input
            type="text"
            name="facebookUrl"
            placeholder="https://facebook.com/…"
            defaultValue={establishment?.facebookUrl ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Instagram</label>
          <input
            type="text"
            name="instagramUrl"
            placeholder="https://instagram.com/…"
            defaultValue={establishment?.instagramUrl ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>LinkedIn</label>
          <input
            type="text"
            name="linkedinUrl"
            placeholder="https://linkedin.com/…"
            defaultValue={establishment?.linkedinUrl ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>TikTok</label>
          <input
            type="text"
            name="tiktokUrl"
            placeholder="https://tiktok.com/@…"
            defaultValue={establishment?.tiktokUrl ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <p className="mt-2 text-sm font-semibold text-neutral-900">Informations pratiques</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Horaires</label>
          <input
            type="text"
            name="schedule"
            placeholder="Lundi-Vendredi 7h30-15h30"
            defaultValue={establishment?.schedule ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Période d&apos;inscription</label>
          <input
            type="text"
            name="registrationPeriod"
            defaultValue={establishment?.registrationPeriod ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Conditions d&apos;admission</label>
        <textarea
          name="admissionConditions"
          rows={2}
          defaultValue={establishment?.admissionConditions ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Frais de scolarité (facultatif)</label>
        <input
          type="text"
          name="tuitionFees"
          placeholder="Ex : 500 000 FCFA/an"
          defaultValue={establishment?.tuitionFees ?? ""}
          className={inputClass}
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        {establishment ? "Enregistrer les modifications" : "Créer l'établissement"}
      </Button>
    </form>
  );
}

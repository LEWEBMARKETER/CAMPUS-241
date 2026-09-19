import type { Metadata } from "next";

import { ResourceImportForm } from "@/components/admin/resource-import-form";

export const metadata: Metadata = { title: "Importer des ressources" };

export default function ImportResourcesPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">
        Importer des ressources en masse
      </h2>
      <p className="mt-1 text-sm text-neutral-600">
        Colonnes attendues : Titre, Slug, Description, Auteur, Type, Format, FichierURL,
        ImageCouvertureURL, Niveau, Domaine, Filiere, Matiere, Premium, PrixLibelle. Les niveaux,
        domaines, filières et matières doivent déjà exister. Les lignes invalides sont ignorées et
        détaillées dans le rapport après import. Les ressources importées sont placées directement
        en attente de validation pédagogique.
      </p>
      <div className="mt-6 max-w-2xl">
        <ResourceImportForm />
      </div>
    </div>
  );
}

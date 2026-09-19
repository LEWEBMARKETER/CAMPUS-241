import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rejectResource, validateResource } from "@/lib/actions/admin-resources-validation";
import { RESOURCE_TYPE_LABELS } from "@/lib/resources";
import { prisma } from "@/lib/prisma";
import { requireValidator } from "@/lib/session";

export const metadata: Metadata = { title: "Validation des ressources" };

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";

export default async function ResourceValidationQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireValidator();
  const { error } = await searchParams;

  const resources = await prisma.resource.findMany({
    where: { status: "EN_ATTENTE" },
    include: { niveau: true, domaine: true, filiere: true, subject: true, createdBy: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <p className="text-sm text-neutral-500">
        {resources.length} ressource{resources.length > 1 ? "s" : ""} en attente de validation
      </p>
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {resources.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-12 text-center text-neutral-500">
          Aucune ressource en attente. La file de validation est à jour.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader>
                <CardTitle className="text-base">{resource.title}</CardTitle>
                <p className="mt-1 text-xs text-neutral-500">
                  {RESOURCE_TYPE_LABELS[resource.type]}
                  {resource.subject ? ` · ${resource.subject.name}` : ""}
                  {resource.niveau ? ` · ${resource.niveau.name}` : ""}
                  {resource.domaine ? ` · ${resource.domaine.name}` : ""}
                  {resource.filiere ? ` · ${resource.filiere.name}` : ""}
                  {resource.createdBy
                    ? ` · Créée par ${resource.createdBy.prenom} ${resource.createdBy.nom}`
                    : ""}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {resource.description && (
                  <p className="text-sm text-neutral-600">{resource.description}</p>
                )}
                {resource.fileUrl && (
                  <p className="text-sm text-neutral-600">
                    Fichier :{" "}
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:underline"
                    >
                      {resource.fileUrl}
                    </a>
                  </p>
                )}
                {resource.author && (
                  <p className="text-sm text-neutral-600">Auteur : {resource.author}</p>
                )}

                <div className="mt-2 flex flex-wrap gap-2 border-t border-black/5 pt-3">
                  <form action={validateResource.bind(null, resource.id)}>
                    <Button type="submit" size="sm">
                      Valider
                    </Button>
                  </form>
                  <details className="w-full">
                    <summary className="cursor-pointer text-sm font-medium text-neutral-600 hover:text-brand-blue">
                      Rejeter (renvoyer en brouillon)
                    </summary>
                    <form
                      action={rejectResource.bind(null, resource.id)}
                      className="mt-2 flex gap-2"
                    >
                      <input type="text" name="note" placeholder="Motif du rejet" className={inputClass} />
                      <Button type="submit" variant="outline" size="sm">
                        Rejeter
                      </Button>
                    </form>
                  </details>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

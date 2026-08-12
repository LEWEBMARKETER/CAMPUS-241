import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Download, Eye, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recordDownload, recordView } from "@/lib/actions/resources";
import { RESOURCE_FORMAT_LABELS, RESOURCE_TYPE_LABELS } from "@/lib/resources";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getResource(slug: string) {
  return prisma.resource.findUnique({
    where: { slug },
    include: { niveau: true, domaine: true, filiere: true, subject: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResource(slug);
  return { title: resource?.title ?? "Ressource" };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await getResource(slug);

  if (!resource || resource.status !== "PUBLIE") {
    notFound();
  }

  const session = await auth();
  const canDownload = !resource.isPremium || Boolean(session?.user);

  await recordView(resource.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/ressources" className="text-sm font-medium text-brand-blue hover:underline">
        ← Retour aux ressources
      </Link>

      <div className="mt-4 flex items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-blue-light text-brand-blue">
          <BookOpen className="size-8" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{resource.title}</h1>
            {resource.isPremium && (
              <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-brand-gold/30 px-2.5 py-1 text-xs font-medium text-brand-blue">
                <Lock className="size-3" />
                Premium
              </span>
            )}
          </div>
          <p className="mt-1 text-neutral-600">
            {RESOURCE_TYPE_LABELS[resource.type]} · {RESOURCE_FORMAT_LABELS[resource.format]}
            {resource.subject ? ` · ${resource.subject.name}` : ""}
            {resource.niveau ? ` · ${resource.niveau.name}` : ""}
          </p>
          {resource.author && (
            <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
              <User className="size-4" />
              {resource.author}
            </p>
          )}
        </div>
      </div>

      {resource.description && (
        <p className="mt-6 text-neutral-700">{resource.description}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {resource.niveau && (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
            {resource.niveau.name}
          </span>
        )}
        {resource.domaine && (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
            {resource.domaine.name}
          </span>
        )}
        {resource.filiere && (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
            {resource.filiere.name}
          </span>
        )}
        {resource.subject && (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
            {resource.subject.name}
          </span>
        )}
      </div>

      <div className="mt-6 flex items-center gap-4 text-sm text-neutral-500">
        <span className="flex items-center gap-1">
          <Eye className="size-4" />
          {resource.viewCount} vue{resource.viewCount > 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1">
          <Download className="size-4" />
          {resource.downloadCount} téléchargement{resource.downloadCount > 1 ? "s" : ""}
        </span>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Télécharger cette ressource</CardTitle>
        </CardHeader>
        <CardContent>
          {resource.fileUrl ? (
            canDownload ? (
              <form action={recordDownload.bind(null, resource.id)}>
                <Button type="submit">
                  <Download className="size-4" />
                  Télécharger
                </Button>
              </form>
            ) : (
              <div>
                <p className="text-sm text-neutral-600">
                  Cette ressource est réservée aux membres CAMPUS 241. Connectez-vous pour la
                  télécharger.
                </p>
                <Button asChild className="mt-3">
                  <Link href="/connexion">Se connecter</Link>
                </Button>
              </div>
            )
          ) : (
            <p className="text-sm text-neutral-500">Fichier indisponible pour le moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

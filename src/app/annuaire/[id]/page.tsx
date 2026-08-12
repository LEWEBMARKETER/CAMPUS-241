import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Clock,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Globe,
  Map as MapIcon,
} from "lucide-react";

import { FavoriteButton } from "@/components/annuaire/favorite-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ESTABLISHMENT_LEVEL_LABELS, PUBLIC_PRIVATE_LABELS } from "@/lib/establishment";

async function getEstablishment(id: string) {
  return prisma.establishment.findUnique({ where: { id } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const establishment = await getEstablishment(id);
  return { title: establishment?.name ?? "Établissement" };
}

function whatsappHref(whatsapp: string) {
  const digits = whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}`;
}

function mapsHref(establishment: {
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string | null;
  name: string;
}) {
  if (establishment.googleMapsUrl) return establishment.googleMapsUrl;
  if (establishment.latitude && establishment.longitude) {
    return `https://www.google.com/maps?q=${establishment.latitude},${establishment.longitude}`;
  }
  const query = [establishment.name, establishment.address, establishment.city]
    .filter(Boolean)
    .join(", ");
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default async function EstablishmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const establishment = await getEstablishment(id);

  if (!establishment || establishment.archived) {
    notFound();
  }

  const session = await auth();
  const isFavorited = session?.user
    ? Boolean(
        await prisma.favorite.findUnique({
          where: {
            userId_establishmentId: {
              userId: session.user.id,
              establishmentId: establishment.id,
            },
          },
        }),
      )
    : false;

  const maps = mapsHref(establishment);
  const hasSocials =
    establishment.facebookUrl ||
    establishment.instagramUrl ||
    establishment.linkedinUrl ||
    establishment.tiktokUrl;
  const hasPracticalInfo =
    establishment.schedule ||
    establishment.registrationPeriod ||
    establishment.admissionConditions ||
    establishment.tuitionFees;
  const isScolaire = establishment.levels.some((level) => level !== "SUPERIEUR");
  const isSuperieur = establishment.levels.includes("SUPERIEUR");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 sm:px-6">
      <Link href="/annuaire" className="text-sm font-medium text-brand-blue hover:underline">
        ← Retour à l&apos;annuaire
      </Link>

      {/* Logo + Nom + Badge */}
      <div className="mt-4 flex items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-blue-light text-brand-blue">
          {establishment.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={establishment.logoUrl} alt="" className="size-16 object-cover" />
          ) : (
            <GraduationCap className="size-8" />
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              {establishment.name}
            </h1>
            {establishment.verified && (
              <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark">
                <BadgeCheck className="size-3.5" />
                Vérifié
              </span>
            )}
          </div>
          {establishment.acronym && (
            <p className="text-sm text-neutral-500">{establishment.acronym}</p>
          )}
          <p className="mt-1 text-neutral-600">
            {PUBLIC_PRIVATE_LABELS[establishment.publicOrPrivate]}
            {establishment.levels.length > 0
              ? ` · ${establishment.levels.map((level) => ESTABLISHMENT_LEVEL_LABELS[level]).join(", ")}`
              : ""}
          </p>
        </div>
      </div>

      {/* Boutons d'action - visibles en priorité sur mobile */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {establishment.phone && (
          <Button asChild className="w-full sm:w-auto">
            <a href={`tel:${establishment.phone}`}>
              <Phone className="size-4" />
              Appeler
            </a>
          </Button>
        )}
        {establishment.whatsapp && (
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <a href={whatsappHref(establishment.whatsapp)} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
        )}
        {establishment.email && (
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <a href={`mailto:${establishment.email}`}>
              <Mail className="size-4" />
              Email
            </a>
          </Button>
        )}
        {establishment.websiteUrl && (
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <a href={establishment.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="size-4" />
              Site officiel
            </a>
          </Button>
        )}
        {maps && (
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <a href={maps} target="_blank" rel="noopener noreferrer">
              <MapIcon className="size-4" />
              Voir sur Maps
            </a>
          </Button>
        )}
      </div>

      <div className="mt-4">
        <FavoriteButton
          establishmentId={establishment.id}
          isFavorited={isFavorited}
          isLoggedIn={Boolean(session?.user)}
        />
      </div>

      {establishment.description && (
        <p className="mt-6 text-neutral-700">{establishment.description}</p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {(establishment.province || establishment.city || establishment.district || establishment.address) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4 text-brand-blue" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-600">
              {[establishment.address, establishment.district, establishment.city, establishment.province]
                .filter(Boolean)
                .join(", ")}
            </CardContent>
          </Card>
        )}

        {(isScolaire || isSuperieur) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="size-4 text-brand-blue" />
                Niveaux et formations
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-neutral-600">
              {isScolaire && establishment.classesOffered.length > 0 && (
                <div>
                  <p className="font-medium text-neutral-900">Classes proposées</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {establishment.classesOffered.map((classe) => (
                      <span
                        key={classe}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                      >
                        {classe}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {isSuperieur && establishment.filieresSuperieur.length > 0 && (
                <div>
                  <p className="font-medium text-neutral-900">Filières / formations</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {establishment.filieresSuperieur.map((filiere) => (
                      <span
                        key={filiere}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                      >
                        {filiere}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {isSuperieur && establishment.diplomasOffered.length > 0 && (
                <div>
                  <p className="font-medium text-neutral-900">Diplômes préparés</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {establishment.diplomasOffered.map((diplome) => (
                      <span
                        key={diplome}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                      >
                        {diplome}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {(establishment.phone || establishment.whatsapp || establishment.email || establishment.secretariatContact) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Phone className="size-4 text-brand-blue" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-neutral-600">
              {establishment.phone && <p>Téléphone : {establishment.phone}</p>}
              {establishment.whatsapp && <p>WhatsApp : {establishment.whatsapp}</p>}
              {establishment.email && <p>Email : {establishment.email}</p>}
              {establishment.secretariatContact && (
                <p>Secrétariat : {establishment.secretariatContact}</p>
              )}
            </CardContent>
          </Card>
        )}

        {hasSocials && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Réseaux sociaux</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {establishment.facebookUrl && (
                <a
                  href={establishment.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-brand-blue hover:underline"
                >
                  <ExternalLink className="size-4" />
                  Facebook
                </a>
              )}
              {establishment.instagramUrl && (
                <a
                  href={establishment.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-brand-blue hover:underline"
                >
                  <ExternalLink className="size-4" />
                  Instagram
                </a>
              )}
              {establishment.linkedinUrl && (
                <a
                  href={establishment.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-brand-blue hover:underline"
                >
                  <ExternalLink className="size-4" />
                  LinkedIn
                </a>
              )}
              {establishment.tiktokUrl && (
                <a
                  href={establishment.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-brand-blue hover:underline"
                >
                  <ExternalLink className="size-4" />
                  TikTok
                </a>
              )}
            </CardContent>
          </Card>
        )}

        {hasPracticalInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="size-4 text-brand-blue" />
                Informations pratiques
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-neutral-600">
              {establishment.schedule && <p>Horaires : {establishment.schedule}</p>}
              {establishment.registrationPeriod && (
                <p>Période d&apos;inscription : {establishment.registrationPeriod}</p>
              )}
              {establishment.admissionConditions && (
                <p>Conditions d&apos;admission : {establishment.admissionConditions}</p>
              )}
              {establishment.tuitionFees && <p>Frais de scolarité : {establishment.tuitionFees}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

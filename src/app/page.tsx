import Link from "next/link";
import { BookOpen, GraduationCap, Library } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuickSearch } from "@/components/quick-search";
import { EstablishmentCard } from "@/components/establishment-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

const pillars = [
  {
    icon: GraduationCap,
    title: "CAMPUS BAC",
    description:
      "Simulez des épreuves du Baccalauréat en conditions d'examen, mesurez vos points forts et vos lacunes par chapitre.",
    href: "/bac",
    cta: "Faire une simulation",
  },
  {
    icon: Library,
    title: "CAMPUS RESSOURCES",
    description:
      "Cours, fiches de révision, annales et supports pédagogiques classés par niveau, domaine et filière.",
    href: "/ressources",
    cta: "Explorer les ressources",
  },
  {
    icon: BookOpen,
    title: "ANNUAIRE",
    description:
      "Trouvez le collège, lycée, université ou centre de formation qui correspond à votre projet.",
    href: "/annuaire",
    cta: "Chercher un établissement",
  },
];

export default async function Home() {
  const featuredEstablishments = await prisma.establishment.findMany({
    where: { isPartner: true },
    orderBy: { name: "asc" },
    take: 3,
  });

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-blue-light to-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
            S&apos;informer, apprendre, s&apos;entraîner, s&apos;orienter
          </h1>
          <p className="max-w-2xl text-lg text-neutral-600">
            CAMPUS 241 accompagne les élèves et étudiants d&apos;Afrique
            francophone dans leur préparation au Baccalauréat, l&apos;accès
            aux ressources académiques et le choix de leur établissement.
          </p>

          <QuickSearch />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/bac">
                <GraduationCap className="size-4" />
                Simuler une épreuve du Bac
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/ressources">
                <Library className="size-4" />
                Explorer les ressources
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/annuaire">
                <BookOpen className="size-4" />
                Trouver une école
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="flex h-full flex-col">
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                  <pillar.icon className="size-5" />
                </div>
                <CardTitle className="mt-2">{pillar.title}</CardTitle>
                <CardDescription>{pillar.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link
                  href={pillar.href}
                  className="text-sm font-medium text-brand-blue hover:underline"
                >
                  {pillar.cta} →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Établissements partenaires
              </h2>
              <p className="mt-1 text-neutral-600">
                Un aperçu de l&apos;annuaire CAMPUS 241.
              </p>
            </div>
            <Link
              href="/annuaire"
              className="hidden text-sm font-medium text-brand-blue hover:underline sm:block"
            >
              Voir l&apos;annuaire
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEstablishments.map((establishment) => (
              <EstablishmentCard
                key={establishment.id}
                id={establishment.id}
                name={establishment.name}
                type={establishment.type}
                city={establishment.city}
                isPartner={establishment.isPartner}
                description={establishment.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { Download, ShoppingBag, School } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuickSearch } from "@/components/quick-search";
import { EstablishmentCard } from "@/components/establishment-card";
import { ProductCard } from "@/components/product-card";
import { ArticleCard } from "@/components/article-card";

const featuredEstablishments = [
  { name: "Lycée d'Excellence Libreville", type: "Lycée", city: "Libreville", isPartner: true },
  { name: "Université Omar Bongo", type: "Université", city: "Libreville", isPartner: true },
  { name: "Institut Supérieur de Technologie", type: "Grande école", city: "Port-Gentil", isPartner: false },
];

const featuredProducts = [
  {
    title: "Guide d'orientation post-Bac",
    description: "Comprendre les filières et choisir la bonne voie après le Bac.",
    priceLabel: "5 000 FCFA",
  },
  {
    title: "Méthodologie de révision",
    description: "Les techniques pour organiser ses révisions efficacement.",
    priceLabel: "3 500 FCFA",
  },
  {
    title: "Pack lettres de motivation",
    description: "Modèles et conseils pour candidater aux grandes écoles.",
    priceLabel: "4 000 FCFA",
  },
];

const recentArticles = [
  {
    title: "Bac 2026 : le calendrier à connaître",
    excerpt: "Toutes les dates clés pour préparer sereinement votre session.",
    category: "Révisions Bac",
  },
  {
    title: "Comment choisir son université ?",
    excerpt: "Les critères essentiels pour bien orienter son choix.",
    category: "Orientation scolaire",
  },
  {
    title: "5 conseils pour organiser ses révisions",
    excerpt: "Une méthode simple pour progresser sans s'épuiser.",
    category: "Méthodologie",
  },
];

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-b from-brand-blue-light to-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
            Réussissez votre orientation scolaire et universitaire
          </h1>
          <p className="max-w-2xl text-lg text-neutral-600">
            CAMPUS 241 accompagne collégiens, lycéens et étudiants d&apos;Afrique
            francophone : annuaire d&apos;établissements, conseillers, ressources
            pédagogiques et boutique de guides digitaux.
          </p>

          <QuickSearch />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/annuaire">
                <School className="size-4" />
                Trouver une école
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/orientation">
                <Download className="size-4" />
                Télécharger un guide gratuit
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/boutique">
                <ShoppingBag className="size-4" />
                Accéder à la boutique
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
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
            <EstablishmentCard key={establishment.name} {...establishment} />
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Produits digitaux
              </h2>
              <p className="mt-1 text-neutral-600">
                Guides et méthodologies pour réussir votre parcours.
              </p>
            </div>
            <Link
              href="/boutique"
              className="hidden text-sm font-medium text-brand-blue hover:underline sm:block"
            >
              Voir la boutique
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Articles récents
            </h2>
            <p className="mt-1 text-neutral-600">
              Conseils d&apos;orientation, méthodologie et vie étudiante.
            </p>
          </div>
          <Link
            href="/ressources"
            className="hidden text-sm font-medium text-brand-blue hover:underline sm:block"
          >
            Voir le blog
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentArticles.map((article) => (
            <ArticleCard key={article.title} {...article} />
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Logo } from "@campus241/shared/layout/logo";
import { Button } from "@campus241/shared/ui/button";
import { logoutAdmin } from "@/lib/actions/auth";
import { requireEditor } from "@/lib/session";

const adminOnlyNav = [
  { label: "Tableau de bord", href: "/" },
  { label: "Établissements", href: "/etablissements" },
  { label: "Utilisateurs", href: "/utilisateurs" },
];

const bacNav = [
  { label: "Tableau de bord", href: "/bac/tableau-de-bord" },
  { label: "Séries", href: "/bac/series" },
  { label: "Matières", href: "/bac/matieres" },
  { label: "Chapitres", href: "/bac/chapitres" },
  { label: "Questions", href: "/bac/questions" },
  { label: "Import CSV", href: "/bac/questions/importer" },
  { label: "Validation pédagogique", href: "/bac/validation" },
  { label: "Statistiques officielles", href: "/bac/statistiques" },
  { label: "Réglages", href: "/bac/reglages" },
];

const ressourcesNav = [
  { label: "Tableau de bord", href: "/ressources/tableau-de-bord" },
  { label: "Catégories", href: "/ressources/categories" },
  { label: "Matières", href: "/ressources/matieres" },
  { label: "Ressources", href: "/ressources" },
  { label: "Import CSV", href: "/ressources/importer" },
  { label: "Validation pédagogique", href: "/ressources/validation" },
];

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireEditor();
  const isAdmin = user.role === "SUPER_ADMIN" || user.role === "ADMIN";
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-brand-blue-light px-2.5 py-1 text-xs font-medium text-brand-blue">
              Back-office
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-neutral-600 sm:inline">
              {user.name}
            </span>
            <Button asChild variant="outline" size="sm">
              <a href={webUrl}>
                <ExternalLink className="size-4" />
                Voir la plateforme
              </a>
            </Button>
            <form action={logoutAdmin}>
              <Button type="submit" size="sm">
                Déconnexion
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <nav className="flex flex-col gap-4">
              {isAdmin && (
                <div className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
                  {adminOnlyNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-brand-blue-light hover:text-brand-blue"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
              <div>
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  CAMPUS BAC
                </p>
                <div className="mt-1 flex flex-row gap-1 overflow-x-auto lg:flex-col">
                  {bacNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-brand-blue-light hover:text-brand-blue"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  CAMPUS RESSOURCES
                </p>
                <div className="mt-1 flex flex-row gap-1 overflow-x-auto lg:flex-col">
                  {ressourcesNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-brand-blue-light hover:text-brand-blue"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div>{children}</div>
          </div>
        </div>
      </main>
    </>
  );
}

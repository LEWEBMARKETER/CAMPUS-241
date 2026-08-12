import Link from "next/link";

import { requireEditor } from "@/lib/session";

const adminOnlyNav = [
  { label: "Tableau de bord", href: "/admin" },
  { label: "Établissements", href: "/admin/etablissements" },
  { label: "Utilisateurs", href: "/admin/utilisateurs" },
];

const bacNav = [
  { label: "Séries", href: "/admin/bac/series" },
  { label: "Matières", href: "/admin/bac/matieres" },
  { label: "Chapitres", href: "/admin/bac/chapitres" },
  { label: "Questions", href: "/admin/bac/questions" },
  { label: "Import CSV", href: "/admin/bac/questions/importer" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireEditor();
  const isAdmin = user.role === "SUPER_ADMIN" || user.role === "ADMIN";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900">Back-office</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
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
        </nav>

        <div>{children}</div>
      </div>
    </div>
  );
}

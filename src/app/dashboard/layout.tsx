import Link from "next/link";

import { requireUser } from "@/lib/session";

const dashboardNav = [
  { label: "Profil", href: "/dashboard" },
  { label: "CAMPUS BAC", href: "/dashboard/bac" },
  { label: "Mes favoris", href: "/dashboard/favoris" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900">Mon espace</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
          {dashboardNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-brand-blue-light hover:text-brand-blue"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div>{children}</div>
      </div>
    </div>
  );
}

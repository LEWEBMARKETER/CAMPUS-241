"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Menu, ShieldCheck, X } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/actions/auth";
import { mainNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

type HeaderUser = {
  name?: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VALIDATEUR_PEDAGOGIQUE" | "UTILISATEUR";
} | null;

const ADMIN_AREA_ROLES = ["SUPER_ADMIN", "ADMIN"];

export function SiteHeader({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex">
          {mainNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-neutral-600 transition-colors hover:text-brand-blue",
                  active && "text-brand-blue",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              {ADMIN_AREA_ROLES.includes(user.role) && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">
                    <ShieldCheck className="size-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <LayoutDashboard className="size-4" />
                  Mon espace
                </Link>
              </Button>
              <form action={logoutUser}>
                <Button type="submit" size="sm">
                  Déconnexion
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/connexion">Connexion</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/inscription">Inscription</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-black/5 bg-white px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-neutral-700 hover:bg-brand-blue-light hover:text-brand-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                {ADMIN_AREA_ROLES.includes(user.role) && (
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                <Button asChild variant="outline" onClick={() => setOpen(false)}>
                  <Link href="/dashboard">Mon espace</Link>
                </Button>
                <form action={logoutUser}>
                  <Button type="submit" className="w-full">
                    Déconnexion
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild variant="outline" onClick={() => setOpen(false)}>
                  <Link href="/connexion">Connexion</Link>
                </Button>
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/inscription">Inscription</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

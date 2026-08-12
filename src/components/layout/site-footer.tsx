import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { mainNav } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-brand-blue-light">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-neutral-600">
            La plateforme d&apos;orientation, de préparation académique et
            d&apos;accès aux ressources éducatives pour les élèves et
            étudiants du Gabon.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            Navigation
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {mainNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-neutral-600 hover:text-brand-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Compte</h3>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link
                href="/connexion"
                className="text-sm text-neutral-600 hover:text-brand-blue"
              >
                Connexion
              </Link>
            </li>
            <li>
              <Link
                href="/inscription"
                className="text-sm text-neutral-600 hover:text-brand-blue"
              >
                Inscription
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5 px-4 py-5 text-center text-xs text-neutral-500 sm:px-6">
        © {new Date().getFullYear()} CAMPUS 241. Tous droits réservés.
      </div>
    </footer>
  );
}

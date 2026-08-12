export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "CAMPUS BAC", href: "/bac" },
  { label: "Ressources", href: "/ressources" },
  { label: "Annuaire", href: "/annuaire" },
  { label: "Contact", href: "/contact" },
];

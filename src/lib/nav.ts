export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Annuaire", href: "/annuaire" },
  { label: "Orientation", href: "/orientation" },
  { label: "Ressources", href: "/ressources" },
  { label: "Boutique", href: "/boutique" },
  { label: "Conseillers", href: "/conseillers" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Contact", href: "/contact" },
];

# CAMPUS 241

CAMPUS 241 est une plateforme numérique éducative visant à promouvoir l'apprentissage, la formation, l'orientation scolaire et universitaire, ainsi que la gestion académique pour les apprenants allant du collège à l'université.

Cette phase du projet (Phase 1 — MVP web) couvre : site vitrine, annuaire d'établissements et de conseillers, boutique (redirection Chariow), blog, espace utilisateur élève/étudiant et back-office admin. Voir le cahier des charges pour le détail des phases 2 et 3.

## Stack technique

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS v4)
- [Prisma](https://www.prisma.io) + PostgreSQL (Neon en production)
- Composants UI de style [shadcn/ui](https://ui.shadcn.com)
- Hébergement cible : Vercel

## Structure du monorepo

Le projet est un monorepo npm workspaces avec deux applications Next.js
déployées séparément et un package partagé :

- `apps/web` — la plateforme publique (accueil, CAMPUS BAC, CAMPUS RESSOURCES,
  annuaire, espace utilisateur). Tourne sur le port 3000 en dev.
- `apps/admin` — le back-office (dissocié de la plateforme pour être déployé
  sur son propre sous-domaine, ex. `admin.campus241.ga`). Tourne sur le port
  3001 en dev.
- `packages/shared` — schéma Prisma, authentification NextAuth, logique
  métier et composants UI partagés entre les deux apps.

Les deux apps partagent la même base de données. L'authentification est
partagée via un cookie de session commun une fois `AUTH_COOKIE_DOMAIN`
configuré sur un vrai domaine (voir `apps/*/. env.example`) ; en local, comme
les cookies ne sont pas isolés par port sur `localhost`, la session est déjà
partagée entre `:3000` et `:3001` par défaut.

## Démarrage

```bash
npm install
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/admin/.env.example packages/shared/.env   # DATABASE_URL, pour les commandes prisma en local
# renseigner DATABASE_URL (Postgres local ou Neon) dans les trois fichiers
npx prisma migrate dev --schema=packages/shared/prisma/schema.prisma
npm run dev         # plateforme sur http://localhost:3000
npm run dev:admin   # back-office sur http://localhost:3001
```

## Scripts (à la racine)

- `npm run dev` / `npm run dev:admin` — serveurs de développement
- `npm run build` / `npm run build:admin` — build de production
- `npm run lint` — ESLint sur les deux apps
- `npm run db:migrate:deploy` — applique les migrations Prisma
- `npm run db:seed` — recharge les données de démonstration
- `npx prisma studio --schema=packages/shared/prisma/schema.prisma` —
  explorer la base de données

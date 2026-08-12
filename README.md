# CAMPUS 241

CAMPUS 241 est une plateforme numérique éducative visant à promouvoir l'apprentissage, la formation, l'orientation scolaire et universitaire, ainsi que la gestion académique pour les apprenants allant du collège à l'université.

Cette phase du projet (Phase 1 — MVP web) couvre : site vitrine, annuaire d'établissements et de conseillers, boutique (redirection Chariow), blog, espace utilisateur élève/étudiant et back-office admin. Voir le cahier des charges pour le détail des phases 2 et 3.

## Stack technique

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS v4)
- [Prisma](https://www.prisma.io) + PostgreSQL (Neon en production)
- Composants UI de style [shadcn/ui](https://ui.shadcn.com)
- Hébergement cible : Vercel

## Démarrage

```bash
npm install
cp .env.example .env   # renseigner DATABASE_URL (Postgres local ou Neon)
npx prisma migrate dev
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run start` — démarrer le build de production
- `npm run lint` — ESLint
- `npx prisma studio` — explorer la base de données

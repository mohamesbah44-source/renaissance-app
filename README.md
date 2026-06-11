# Renaissance

> Plus qu'un accompagnement : une rencontre avec vous-même.

Application web mobile-first pour un programme d'accompagnement transformationnel
de 8 semaines : dashboard, parcours hebdomadaire, Radar Renaissance™, journal,
ressources, calendrier, messagerie client/praticien et espace admin.

## Stack technique

- [Next.js 16](https://nextjs.org) (App Router, Server Components & Server Actions), TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (configuration CSS-first via `@theme` dans `app/globals.css`)
- [Supabase](https://supabase.com) (Auth, Postgres, RLS) via `@supabase/ssr`
- Déploiement cible : [Vercel](https://vercel.com)

## Mise en route

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer le projet Supabase

1. Créer un nouveau projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécuter le contenu de
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   Ce script crée :
   - les tables `profiles`, `weeks`, `resources`, `user_progress`,
     `radar_assessments`, `journal_entries`, `appointments`, `messages` ;
   - les politiques RLS (Row Level Security) pour chaque table, ainsi que la
     fonction `is_admin()` ;
   - le trigger `on_auth_user_created` qui crée automatiquement une ligne
     `profiles` (rôle `client`) à chaque inscription ;
   - le contenu initial des 8 semaines du parcours.
3. Dans **Authentication > URL Configuration**, renseigner :
   - **Site URL** : l'URL de déploiement (ou `http://localhost:3000` en local) ;
   - **Redirect URLs** : ajouter `<URL_DU_SITE>/auth/confirm` (utilisée pour la
     confirmation d'inscription et la réinitialisation de mot de passe).
4. (Optionnel) Pour passer un compte en administrateur, mettre à jour sa ligne
   dans `profiles` : `update profiles set role = 'admin' where email = '...'`.

### 3. Configurer les variables d'environnement

Copier `.env.local.example` vers `.env.local` et renseigner les valeurs depuis
**Project Settings > API** du projet Supabase :

```bash
cp .env.local.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé `service_role`, usage strictement serveur |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (utilisée pour les redirections d'email Supabase). En local : `http://localhost:3000`. En production, optionnelle si déployé sur Vercel (voir ci-dessous). |

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement sur Vercel

1. Importer le dépôt dans Vercel.
2. Renseigner les variables d'environnement (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
   `NEXT_PUBLIC_SITE_URL`) dans **Project Settings > Environment Variables**.
   - Sans `NEXT_PUBLIC_SITE_URL`, l'application retombe sur la variable
     `VERCEL_URL` fournie automatiquement par Vercel.
3. Mettre à jour **Site URL** et **Redirect URLs** dans Supabase avec l'URL de
   déploiement Vercel (cf. étape 2 ci-dessus).
4. Déployer (commande de build par défaut : `next build`).

## Scripts

```bash
npm run dev     # serveur de développement (Turbopack)
npm run build   # build de production
npm run start   # lance le build de production
npm run lint    # ESLint
```

## Structure du projet

```
app/
├── page.tsx                 # landing
├── (auth)/                  # login, register, forgot-password
├── (app)/                   # espace connecté (dashboard, parcours, radar,
│                             # journal, ressources, calendrier, messages, profil)
├── admin/                    # espace praticien (clients, semaines, ressources)
└── globals.css               # thème (couleurs, polices)
components/
├── ui/                       # design system (Button, GlassCard, RadarChart, ...)
├── layout/                    # CosmicBackground, AppShell, AdminShell, BottomNav
└── features/                  # composants par domaine fonctionnel
lib/
├── supabase/                  # clients Supabase (browser/server) + requêtes
├── types/database.types.ts    # types générés
└── */actions.ts                # Server Actions par domaine
supabase/
└── migrations/0001_init.sql    # schéma, RLS, trigger, seed des 8 semaines
```

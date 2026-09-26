-- =====================================================================
-- Le Programme Re-Naissance™ — Radar Re-Naissance™ v2
-- Refonte du modèle : 3 Cercles (Moi / Nous / Monde) / 12 Piliers /
-- 5 capacités transversales / 4 méta-indicateurs.
-- Remplacement direct de la structure de radar_bilans (décision validée).
-- =====================================================================

alter table public.radar_bilans
  rename column score_survie to score_charge;

alter table public.radar_bilans
  rename column score_alignement to score_ouverture;

alter table public.radar_bilans
  add column cercle_scores jsonb not null default '{}'::jsonb,
  add column capacite_scores jsonb not null default '{}'::jsonb,
  add column meta_indicateurs jsonb not null default '{}'::jsonb;

alter table public.radar_bilans
  alter column cercle_scores drop default,
  alter column capacite_scores drop default,
  alter column meta_indicateurs drop default;

comment on column public.radar_bilans.score_charge is
  'sR — charge protectrice : moyenne des ratios de tension des piliers des cercles Moi + Nous.';
comment on column public.radar_bilans.score_ouverture is
  'aR — ouverture : moyenne des 5 capacités transversales (Conscience, Régulation, Compréhension, Action, Intégration).';
comment on column public.radar_bilans.cercle_scores is
  'Scores de tension (0 à 1) par cercle : { moi, nous, monde }.';
comment on column public.radar_bilans.capacite_scores is
  'Scores de ressource (0 à 1) par capacité transversale : { conscience, regulation, comprehension, action, integration }.';
comment on column public.radar_bilans.meta_indicateurs is
  'Méta-indicateurs (0 à 1, ecartIncarnation peut être négatif) : { equilibre, flexibilite, vitalite, ecartIncarnation }.';

-- =====================================================================
-- Carnet Re-Naissance™ — pont entre le Re-Naissance Analyzer™ et l'app
-- cliente : une synthèse par analyse, poussée manuellement par le
-- praticien depuis l'Analyzer vers le Carnet du client.
-- =====================================================================

create table public.carnet_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  source text not null default 'analyzer' check (source in ('analyzer', 'manuel')),
  titre text not null,
  synthese text not null,
  hypotheses jsonb not null default '[]'::jsonb,
  pilier_ids integer[] not null default '{}'::integer[],
  published_by uuid references public.profiles (id) on delete set null
);

create index idx_carnet_entries_user on public.carnet_entries (user_id, created_at desc);

alter table public.carnet_entries enable row level security;

create policy "carnet_entries_owner_select"
  on public.carnet_entries for select
  using (auth.uid() = user_id);

create policy "carnet_entries_admin_all"
  on public.carnet_entries for all
  using (public.is_admin())
  with check (public.is_admin());

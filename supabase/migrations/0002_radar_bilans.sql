-- =====================================================================
-- Renaissance — Radar Renaissance™ v2
-- Nouvelle table de bilans (40 questions / 8 piliers), additive :
-- ne modifie pas la table radar_assessments existante.
-- =====================================================================

create table public.radar_bilans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  etat text not null check (etat in ('SURVIE', 'ADAPTATION', 'ALIGNEMENT', 'EXPANSION')),
  lune text not null,
  fenetre_transformation numeric not null,
  score_survie numeric not null,
  score_alignement numeric not null,
  score_global numeric not null,
  raw_answers jsonb not null,
  pillar_scores jsonb not null,
  top_priorities jsonb not null
);

create index idx_radar_bilans_user on public.radar_bilans (user_id, created_at desc);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

alter table public.radar_bilans enable row level security;

-- radar_bilans : chacun lit/crée ses propres bilans, lecture admin
create policy "radar_bilans_owner_select"
  on public.radar_bilans for select
  using (auth.uid() = user_id);

create policy "radar_bilans_owner_insert"
  on public.radar_bilans for insert
  with check (auth.uid() = user_id);

create policy "radar_bilans_admin_select"
  on public.radar_bilans for select
  using (public.is_admin());

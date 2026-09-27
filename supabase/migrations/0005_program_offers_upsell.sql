-- =====================================================================
-- Le Programme Re-Naissance™ — Upsell fin de parcours
-- Offre de suite (abonnement, 2e cohorte, accompagnement approfondi...)
-- affichée dans le dashboard et mise en avant à la semaine 8.
-- =====================================================================

create table public.program_offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  cta_label text not null default 'En savoir plus',
  cta_url text not null,
  price_label text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.program_offers is
  'Offres de suite (upsell) proposées aux clients : abonnement, accompagnement approfondi, 2e cohorte, etc. Une seule offre active affichée à la fois.';

create index idx_program_offers_active on public.program_offers (is_active, updated_at desc);

alter table public.program_offers enable row level security;

create policy "program_offers_select_active_or_admin"
  on public.program_offers for select
  using (is_active = true or public.is_admin());

create policy "program_offers_admin_all"
  on public.program_offers for all
  using (public.is_admin())
  with check (public.is_admin());

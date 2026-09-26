-- =====================================================================
-- Le Programme Re-Naissance™ — Espace membre 8 semaines
-- Typage des séances (2 breathwork + 6 courtes + thème natal/Human Design)
-- et Chansons personnalisées (4 chansons livrées toutes les 2 semaines).
-- =====================================================================

alter table public.appointments
  add column session_type text not null default 'autre'
  check (session_type in ('breathwork', 'courte', 'theme_natal', 'autre'));

comment on column public.appointments.session_type is
  'Type de séance : breathwork (1h30, 2/mois), courte (30 min, 6/mois : méditation/visualisation/EFT), theme_natal (thème natal / Human Design avec Emmanuel), autre.';

create table public.client_songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  titre text not null,
  message text,
  media_url text not null,
  published_by uuid references public.profiles (id) on delete set null
);

comment on table public.client_songs is
  'Chansons personnalisées Re-Naissance™ : 4 chansons livrées au client, une toutes les 2 semaines, composées à partir de son parcours.';

create index idx_client_songs_user on public.client_songs (user_id, created_at desc);

alter table public.client_songs enable row level security;

create policy "client_songs_owner_select"
  on public.client_songs for select
  using (auth.uid() = user_id);

create policy "client_songs_admin_all"
  on public.client_songs for all
  using (public.is_admin())
  with check (public.is_admin());

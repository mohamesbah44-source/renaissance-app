-- =====================================================================
-- Le Programme Re-Naissance™ — Tracker d'habitudes
-- Habitudes quotidiennes reliées aux piliers du Radar Re-Naissance™ de
-- chaque membre : suggérées automatiquement depuis ses zones prioritaires
-- (top_priorities du dernier bilan Radar), ou ajoutées manuellement par
-- l'accompagnant·e depuis l'admin. Suivi par pointage quotidien (streak).
-- =====================================================================

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pilier_id smallint not null check (pilier_id between 1 and 12),
  titre text not null,
  source text not null default 'auto' check (source in ('auto', 'manuel')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.habits is
  'Habitudes quotidiennes suivies par un membre, reliées à un pilier du Radar Re-Naissance™ (suggérées automatiquement ou ajoutées par l''accompagnant·e).';

create index idx_habits_user_active on public.habits (user_id, is_active);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

comment on table public.habit_logs is
  'Pointage quotidien (un jour = une case cochée) d''une habitude, pour calculer les séries (streaks).';

create index idx_habit_logs_user_date on public.habit_logs (user_id, log_date desc);

alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

create policy "habits_owner_select"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "habits_owner_insert"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "habits_owner_update"
  on public.habits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "habits_admin_all"
  on public.habits for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "habit_logs_owner_select"
  on public.habit_logs for select
  using (auth.uid() = user_id);

create policy "habit_logs_owner_insert"
  on public.habit_logs for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid())
  );

create policy "habit_logs_owner_delete"
  on public.habit_logs for delete
  using (auth.uid() = user_id);

create policy "habit_logs_admin_all"
  on public.habit_logs for all
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- Renaissance — schéma initial
-- Tables, RLS, trigger de création de profil et contenu des 8 semaines.
-- =====================================================================

create extension if not exists "pgcrypto";

-- =====================================================================
-- TABLES
-- =====================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  role text not null default 'client' check (role in ('client', 'admin')),
  program_start_date date,
  current_week integer not null default 1 check (current_week between 1 and 8),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.weeks (
  id uuid primary key default gen_random_uuid(),
  week_number integer not null unique check (week_number between 1 and 8),
  title text not null,
  intention text,
  description text,
  video_url text,
  audio_breathwork_url text,
  audio_meditation_url text,
  audio_visualization_url text,
  journaling_prompts jsonb not null default '[]'::jsonb,
  pdf_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (
    type in ('breathwork', 'meditation', 'visualization', 'pdf', 'exercise', 'replay')
  ),
  description text,
  duration text,
  media_url text,
  week_id uuid references public.weeks (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  week_id uuid not null references public.weeks (id) on delete cascade,
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'completed')
  ),
  journaling_responses jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, week_id)
);

create table public.radar_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  phase text not null check (phase in ('before', 'week4', 'week8')),
  securite_physique smallint not null check (securite_physique between 1 and 10),
  securite_financiere smallint not null check (securite_financiere between 1 and 10),
  securite_relationnelle smallint not null check (securite_relationnelle between 1 and 10),
  securite_identitaire smallint not null check (securite_identitaire between 1 and 10),
  besoin_controle smallint not null check (besoin_controle between 1 and 10),
  hypervigilance smallint not null check (hypervigilance between 1 and 10),
  capacite_recevoir smallint not null check (capacite_recevoir between 1 and 10),
  capacite_etre smallint not null check (capacite_etre between 1 and 10),
  created_at timestamptz not null default now(),
  unique (user_id, phase)
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_date date not null default current_date,
  title text,
  content text not null,
  mood text,
  week_id uuid references public.weeks (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  scheduled_at timestamptz not null,
  title text,
  meeting_url text,
  status text not null default 'upcoming' check (
    status in ('upcoming', 'completed', 'cancelled')
  ),
  notes text,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- INDEX
-- =====================================================================

create index idx_user_progress_user on public.user_progress (user_id);
create index idx_user_progress_week on public.user_progress (week_id);
create index idx_radar_assessments_user on public.radar_assessments (user_id);
create index idx_journal_entries_user on public.journal_entries (user_id);
create index idx_journal_entries_week on public.journal_entries (week_id);
create index idx_appointments_user on public.appointments (user_id);
create index idx_resources_week on public.resources (week_id);
create index idx_messages_sender on public.messages (sender_id);
create index idx_messages_recipient on public.messages (recipient_id);

-- =====================================================================
-- FONCTIONS UTILITAIRES
-- =====================================================================

-- security definer + search_path fixe : évite la récursion RLS sur
-- profiles et empêche le détournement du search_path.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Crée automatiquement le profil "client" à l'inscription.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role, current_week, program_start_date)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    'client',
    1,
    current_date
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.weeks enable row level security;
alter table public.resources enable row level security;
alter table public.user_progress enable row level security;
alter table public.radar_assessments enable row level security;
alter table public.journal_entries enable row level security;
alter table public.appointments enable row level security;
alter table public.messages enable row level security;

-- profiles : chacun voit/modifie sa fiche, l'admin voit/modifie tout
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- profiles : tout utilisateur connecté peut retrouver son accompagnateur·rice (messagerie)
create policy "profiles_select_admin_for_messaging"
  on public.profiles for select
  to authenticated
  using (role = 'admin');

-- weeks : lecture pour tout utilisateur connecté, écriture admin
create policy "weeks_select_authenticated"
  on public.weeks for select
  to authenticated
  using (true);

create policy "weeks_write_admin"
  on public.weeks for all
  using (public.is_admin())
  with check (public.is_admin());

-- resources : lecture pour tout utilisateur connecté, écriture admin
create policy "resources_select_authenticated"
  on public.resources for select
  to authenticated
  using (true);

create policy "resources_write_admin"
  on public.resources for all
  using (public.is_admin())
  with check (public.is_admin());

-- user_progress : CRUD sur ses propres lignes, lecture admin
create policy "user_progress_owner_all"
  on public.user_progress for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "user_progress_admin_select"
  on public.user_progress for select
  using (public.is_admin());

-- radar_assessments : CRUD sur ses propres lignes, lecture admin
create policy "radar_assessments_owner_all"
  on public.radar_assessments for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "radar_assessments_admin_select"
  on public.radar_assessments for select
  using (public.is_admin());

-- journal_entries : CRUD sur ses propres lignes, lecture admin
create policy "journal_entries_owner_all"
  on public.journal_entries for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "journal_entries_admin_select"
  on public.journal_entries for select
  using (public.is_admin());

-- appointments : lecture sur ses propres lignes, CRUD admin
create policy "appointments_select_own"
  on public.appointments for select
  using (user_id = auth.uid());

create policy "appointments_admin_all"
  on public.appointments for all
  using (public.is_admin())
  with check (public.is_admin());

-- messages : lecture/écriture si participant, accès total admin
create policy "messages_select_participants"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id or public.is_admin());

create policy "messages_insert_sender"
  on public.messages for insert
  with check (auth.uid() = sender_id or public.is_admin());

create policy "messages_update_participants"
  on public.messages for update
  using (auth.uid() = sender_id or auth.uid() = recipient_id or public.is_admin())
  with check (auth.uid() = sender_id or auth.uid() = recipient_id or public.is_admin());

-- =====================================================================
-- CONTENU INITIAL — les 8 semaines du parcours Renaissance
-- =====================================================================

insert into public.weeks (week_number, title, intention, description, journaling_prompts, pdf_urls)
values
  (
    1,
    'Sécurité intérieure',
    'Poser les bases : retrouver un socle stable à l''intérieur de toi, même quand tout bouge autour.',
    'Cette première semaine est une rencontre en douceur avec ton état actuel. Tu vas apprendre à reconnaître les signaux de ton système nerveux et à créer, ici et maintenant, un espace où tu peux poser les armes.',
    '[
      {"id":"s1-1","label":"Qu''est-ce qui, dans ta vie actuelle, te fait sentir en sécurité ?"},
      {"id":"s1-2","label":"Où loge la tension dans ton corps quand tu penses à ton quotidien ?"},
      {"id":"s1-3","label":"De quoi aurais-tu besoin pour te sentir un peu plus chez toi, en toi ?"}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    2,
    'Corps et régulation',
    'Cette semaine, tu reviens dans ton corps.',
    'Le corps garde la mémoire de ce que le mental a appris à ignorer. À travers la respiration et des pratiques douces, tu apprends à réguler ton système nerveux et à sortir, petit à petit, des modes de survie.',
    '[
      {"id":"s2-1","label":"Comment décrirais-tu ton niveau d''énergie aujourd''hui, sans le juger ?"},
      {"id":"s2-2","label":"Quels signaux ton corps t''envoie-t-il quand tu es en hypercontrôle ?"},
      {"id":"s2-3","label":"Qu''est-ce qui t''aide, concrètement, à te sentir apaisé(e) dans ton corps ?"}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    3,
    'Relations et attachement',
    'Regarder, sans jugement, comment tu te lies aux autres.',
    'Tes relations sont un miroir de ta relation à toi-même. Cette semaine, tu explores tes schémas d''attachement, tes besoins relationnels et la manière dont tu poses, ou non, tes limites.',
    '[
      {"id":"s3-1","label":"Dans quelles relations te sens-tu le plus en sécurité ? Le moins ?"},
      {"id":"s3-2","label":"Comment réagis-tu, en général, quand tu as peur de perdre quelqu''un ?"},
      {"id":"s3-3","label":"Quelle limite n''as-tu jamais osé poser, et avec qui ?"}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    4,
    'Mental, croyances et lucidité',
    'Faire la lumière sur les histoires que tu te racontes depuis longtemps.',
    'Certaines croyances t''ont protégé, d''autres te freinent aujourd''hui. Cette semaine, tu identifies les pensées automatiques qui orientent tes choix, et tu retrouves ta capacité de discernement. C''est aussi le moment de remplir ton deuxième Radar Renaissance™.',
    '[
      {"id":"s4-1","label":"Quelle croyance sur toi-même revient sans cesse ?"},
      {"id":"s4-2","label":"D''où vient cette croyance, à ta connaissance ?"},
      {"id":"s4-3","label":"Si elle n''était pas vraie, que deviendrait possible pour toi ?"}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    5,
    'Carrière, mission et place',
    'Réinterroger ta place, sans te perdre dans la performance.',
    'Réussite extérieure et alignement intérieur ne sont pas toujours la même chose. Cette semaine t''invite à clarifier ce qui t''anime réellement, et la place que tu as envie d''occuper, pour de vrai.',
    '[
      {"id":"s5-1","label":"Qu''est-ce qui, dans ton activité, te donne encore de l''énergie ?"},
      {"id":"s5-2","label":"Qu''est-ce qui, au contraire, t''en prend sans rien te donner en retour ?"},
      {"id":"s5-3","label":"Si la pression de réussir disparaissait, que choisirais-tu ?"}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    6,
    'Émotions et libération',
    'Laisser circuler ce qui a été retenu trop longtemps.',
    'Les émotions non exprimées ne disparaissent pas : elles s''accumulent. Cette semaine, tu apprends à accueillir, traverser et libérer ce qui demande à sortir, en toute sécurité.',
    '[
      {"id":"s6-1","label":"Quelle émotion as-tu le plus appris à cacher ?"},
      {"id":"s6-2","label":"Si cette émotion pouvait parler, que dirait-elle ?"},
      {"id":"s6-3","label":"De quoi as-tu besoin pour te sentir autorisé(e) à la ressentir ?"}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    7,
    'Santé, énergie et vitalité',
    'Réapprendre à écouter ce que ton corps te dit depuis longtemps.',
    'Ta vitalité est un langage. Cette semaine, tu observes ton énergie, ton sommeil, ton alimentation et ton rapport au repos, sans culpabilité, simplement pour mieux te connaître.',
    '[
      {"id":"s7-1","label":"À quel moment de la journée te sens-tu le plus vivant(e) ?"},
      {"id":"s7-2","label":"Qu''est-ce qui grignote ton énergie sans que tu t''en rendes compte ?"},
      {"id":"s7-3","label":"Quel petit geste pourrais-tu poser cette semaine pour prendre soin de ton corps ?"}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    8,
    'Renaissance identitaire',
    'Accueillir qui tu es devenu(e).',
    'Dernière étape du parcours : tu prends le temps de mesurer le chemin parcouru, d''intégrer ce qui a changé en toi, et de poser une intention claire pour la suite. C''est le moment de remplir ton dernier Radar Renaissance™.',
    '[
      {"id":"s8-1","label":"Qu''est-ce qui a changé en toi depuis le début de ce parcours ?"},
      {"id":"s8-2","label":"De quoi es-tu fier ou fière d''avoir traversé ?"},
      {"id":"s8-3","label":"Quelle intention veux-tu poser pour les prochains mois ?"}
    ]'::jsonb,
    '[]'::jsonb
  );

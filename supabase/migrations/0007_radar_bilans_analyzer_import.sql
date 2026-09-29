-- =====================================================================
-- Le Programme Re-Naissance™ — Import des bilans depuis l'app
-- Re-Naissance Analyzer™ (séances enregistrées et analysées par
-- l'accompagnant·e), en plus des bilans issus du questionnaire Radar.
-- =====================================================================

alter table public.radar_bilans
  add column source text not null default 'questionnaire' check (source in ('questionnaire', 'analyzer')),
  add column analyzer_session_id uuid unique;

comment on column public.radar_bilans.source is
  'Origine du bilan : questionnaire (60 questions dans l''appli) ou analyzer (importé depuis Re-Naissance Analyzer™).';
comment on column public.radar_bilans.analyzer_session_id is
  'Id de la séance Analyzer déjà importée, pour éviter les doublons d''import.';

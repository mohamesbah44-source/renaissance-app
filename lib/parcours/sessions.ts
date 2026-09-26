import type { Appointment, SessionType } from "@/lib/types/database.types";

export const SESSION_TYPE_LABEL: Record<SessionType, string> = {
  breathwork: "Breathwork",
  courte: "Séance courte",
  theme_natal: "Thème natal · Human Design",
  autre: "Autre",
};

/**
 * Cible du suivi des séances de l'accompagnement 8 semaines : 2 séances de
 * breathwork (1h30) et 6 séances courtes (30 min : méditation, visualisation
 * ou EFT). Le rendez-vous thème natal / Human Design est distinct du suivi.
 */
export const SESSION_TARGETS: Partial<Record<SessionType, number>> = {
  breathwork: 2,
  courte: 6,
};

export interface SessionCount {
  type: SessionType;
  label: string;
  completed: number;
  target: number;
}

/** Compte les séances terminées par type, pour le suivi des 8 séances du programme. */
export function computeSessionCounts(appointments: Appointment[]): SessionCount[] {
  return (Object.keys(SESSION_TARGETS) as SessionType[]).map((type) => ({
    type,
    label: SESSION_TYPE_LABEL[type],
    completed: appointments.filter((a) => a.session_type === type && a.status === "completed").length,
    target: SESSION_TARGETS[type] ?? 0,
  }));
}

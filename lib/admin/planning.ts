import type { SessionType } from "@/lib/types/database.types";

export type PlanningLine = {
  scheduledAt: string; // ISO UTC
  sessionType: SessionType;
  title: string;
  durationMinutes: number | null;
  notes: string | null;
};

export type PlanningParseResult = { lines: PlanningLine[]; errors: string[] };

const TZ = "Europe/Paris";

/** Convertit une date/heure locale de Paris en instant UTC (ISO), heure d'été comprise. */
function parisToISO(y: number, m: number, d: number, hh: number, mm: number): string {
  const wanted = Date.UTC(y, m - 1, d, hh, mm);
  let guess = wanted;
  for (let i = 0; i < 3; i += 1) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(guess));
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? "0");
    const asUTC = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
    guess += wanted - asUTC;
  }
  return new Date(guess).toISOString();
}

function parseTime(raw: string): { h: number; m: number } | null {
  const t = raw.trim().toLowerCase().replace(/\s+/g, "");
  const match = t.match(/^(\d{1,2})(?:[h:](\d{2})?)?$/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = match[2] ? Number(match[2]) : 0;
  if (h > 23 || m > 59) return null;
  return { h, m };
}

function parseDuration(raw: string): number | null {
  const t = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (!t) return null;
  let match = t.match(/^(\d{1,2})h(\d{2})?$/);
  if (match) return Number(match[1]) * 60 + (match[2] ? Number(match[2]) : 0);
  match = t.match(/^(\d{1,3})(?:min|mn|m)?$/);
  if (match) return Number(match[1]);
  return null;
}

function parseDate(raw: string): { y: number; m: number; d: number } | null {
  const match = raw.trim().match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (!match) return null;
  const d = Number(match[1]);
  const m = Number(match[2]);
  let y = match[3] ? Number(match[3]) : new Date().getFullYear();
  if (y < 100) y += 2000;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { y, m, d };
}

function sessionTypeOf(format: string): SessionType {
  if (/breath/i.test(format)) return "breathwork";
  if (/natal|human/i.test(format)) return "theme_natal";
  return "courte";
}

/**
 * Format d'une ligne : JJ/MM/AAAA | HHhMM | Format | durée | Intention
 * Exemple : 02/11/2026 | 10h | Breathwork 1 | 1h30 | Sécurité intérieure et relâchement
 * Le titre du rendez-vous est « Format · Intention ».
 */
export function parsePlanning(text: string): PlanningParseResult {
  const lines: PlanningLine[] = [];
  const errors: string[] = [];

  text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .forEach((line, index) => {
      if (!line || line.startsWith("#")) return;
      const parts = line.split("|").map((p) => p.trim());
      const label = `Ligne ${index + 1}`;
      if (parts.length < 3) {
        errors.push(`${label} : il manque des informations (date | heure | format | durée | intention).`);
        return;
      }
      const date = parseDate(parts[0]);
      const time = parseTime(parts[1]);
      const format = parts[2];
      if (!date) return void errors.push(`${label} : date illisible (« ${parts[0]} »).`);
      if (!time) return void errors.push(`${label} : heure illisible (« ${parts[1]} »).`);
      if (!format) return void errors.push(`${label} : le format de séance est vide.`);
      const duration = parts[3] ? parseDuration(parts[3]) : null;
      const intention = parts[4] ?? "";
      lines.push({
        scheduledAt: parisToISO(date.y, date.m, date.d, time.h, time.m),
        sessionType: sessionTypeOf(format),
        title: intention ? `${format} · ${intention}` : format,
        durationMinutes: duration,
        notes: intention || null,
      });
    });

  return { lines, errors };
}

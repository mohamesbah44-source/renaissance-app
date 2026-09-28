function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Nombre de jours consécutifs cochés jusqu'à aujourd'hui (ou jusqu'à hier si
 * aujourd'hui n'est pas encore coché, pour ne pas casser une série en cours
 * de journée).
 */
export function computeStreak(logDates: string[]): number {
  const dates = new Set(logDates);
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!dates.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dates.has(toISODate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function todayISODate(): string {
  return toISODate(new Date());
}

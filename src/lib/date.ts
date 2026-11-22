export const BOGOTA_TZ = "America/Bogota";

const bogotaPartsFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: BOGOTA_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Devuelve la fecha calendario (YYYY-MM-DD) en la zona horaria America/Bogota.
 * Evita el desfase de toISOString() que usa UTC y cambia de día a las 7:00 p. m. en Colombia.
 */
export function localIsoDate(d: Date = new Date()): string {
  const parts = bogotaPartsFmt.formatToParts(d);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${day}`;
}

/** Convierte YYYY-MM-DD a Date fijado al mediodía UTC para evitar saltos por zona horaria. */
function isoToUtcNoon(isoStr: string): Date {
  const [y, m, d] = isoStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

/** Suma o resta días calendario a una fecha YYYY-MM-DD y devuelve YYYY-MM-DD. */
export function addDays(isoStr: string, days: number): string {
  const d = isoToUtcNoon(isoStr);
  d.setUTCDate(d.getUTCDate() + days);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/** Diferencia en días enteros entre dos fechas YYYY-MM-DD (target - base). */
export function daysDiff(targetIso: string, baseIso: string): number {
  const t = isoToUtcNoon(targetIso).getTime();
  const b = isoToUtcNoon(baseIso).getTime();
  return Math.round((t - b) / 86400000);
}

/** Formatea una fecha YYYY-MM-DD en español de Colombia. */
export function formatBogotaDate(
  isoStr: string,
  options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" },
): string {
  return isoToUtcNoon(isoStr).toLocaleDateString("es-CO", {
    ...options,
    timeZone: BOGOTA_TZ,
  });
}

/** Formatea la hora de un timestamp ISO en español de Colombia (America/Bogota). */
export function formatBogotaTime(tsIso: string): string {
  return new Date(tsIso).toLocaleTimeString("es-CO", {
    timeZone: BOGOTA_TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Indica si un timestamp ISO corresponde a una fecha YYYY-MM-DD en America/Bogota. */
export function isSameBogotaDay(tsIso: string, referenceIso: string): boolean {
  return localIsoDate(new Date(tsIso)) === referenceIso;
}

/** Devuelve los próximos `count` días calendario (YYYY-MM-DD) excluyendo domingos. */
export function nextBusinessDays(count: number, startIso: string): string[] {
  const out: string[] = [];
  let cursor = startIso;
  while (out.length < count) {
    cursor = addDays(cursor, 1);
    if (isoToUtcNoon(cursor).getUTCDay() !== 0) {
      out.push(cursor);
    }
  }
  return out;
}

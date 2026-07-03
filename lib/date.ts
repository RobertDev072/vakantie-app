// Alle datums worden als ISO-strings (YYYY-MM-DD) opgeslagen en met UTC-arithmetiek
// bewerkt, zodat tijdzones nooit een dag laten verschuiven.

export const TRIP_START = "2026-08-28";
export const TRIP_END = "2026-09-23";

export function addDaysISO(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

function toUTCms(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function dateDiffDays(a: string, b: string): number {
  return Math.round((toUTCms(b) - toUTCms(a)) / 86400000);
}

export function generateDateRange(startISO: string, endISO: string): string[] {
  const result: string[] = [];
  let cur = startISO;
  while (cur <= endISO) {
    result.push(cur);
    cur = addDaysISO(cur, 1);
  }
  return result;
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateNL(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function totalTripDays(tripStart: string, tripEnd: string): number {
  return dateDiffDays(tripStart, tripEnd) + 1;
}

export function getDaysRemaining(tripStart: string, tripEnd: string): number {
  const today = todayISO();
  if (today < tripStart) return totalTripDays(tripStart, tripEnd);
  if (today > tripEnd) return 0;
  return dateDiffDays(today, tripEnd) + 1;
}

export function getTripProgressText(tripStart: string, tripEnd: string): string {
  const today = todayISO();
  const total = totalTripDays(tripStart, tripEnd);
  if (today < tripStart) {
    const untilStart = dateDiffDays(today, tripStart);
    return `nog ${untilStart} ${untilStart === 1 ? "dag" : "dagen"} tot vertrek`;
  }
  if (today > tripEnd) {
    return "vakantie afgelopen";
  }
  const dayNum = dateDiffDays(tripStart, today) + 1;
  return `dag ${dayNum} van ${total}`;
}

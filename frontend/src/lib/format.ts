// Datums- und Zeit-Helfer (deutsche Formatierung, ohne externe Bibliothek).

const WOCHENTAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
const MONATE = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
]

/** "2026-06-18" -> "Do, 18. Juni 2026" */
export function formatDatum(iso: string): string {
  const [j, m, t] = iso.split("-").map(Number)
  const d = new Date(j, m - 1, t)
  return `${WOCHENTAGE[d.getDay()]}, ${t}. ${MONATE[m - 1]} ${j}`
}

/** "2026-06-18" -> "Do 18.06." */
export function formatDatumKurz(iso: string): string {
  const [j, m, t] = iso.split("-").map(Number)
  const d = new Date(j, m - 1, t)
  return `${WOCHENTAGE[d.getDay()]} ${String(t).padStart(2, "0")}.${String(m).padStart(2, "0")}.`
}

/** Dauer in Minuten zwischen "HH:MM" und "HH:MM" */
export function dauerMinuten(von: string, bis: string): number {
  const [vh, vm] = von.split(":").map(Number)
  const [bh, bm] = bis.split(":").map(Number)
  return bh * 60 + bm - (vh * 60 + vm)
}

/** "10:00"–"11:30" -> "1,5 Std" */
export function dauerText(von: string, bis: string): string {
  const min = dauerMinuten(von, bis)
  const std = min / 60
  return Number.isInteger(std) ? `${std} Std` : `${std.toString().replace(".", ",")} Std`
}

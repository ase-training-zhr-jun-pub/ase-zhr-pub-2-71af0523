import { type Raum, istVerfuegbar } from "@/lib/mock-data"
import { dauerMinuten } from "@/lib/format"

export interface SucheParams {
  datum: string
  von: string
  bis: string
  teilnehmer: number
}

function minutenZuZeit(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

/**
 * Findet die nächsten freien Zeitfenster gleicher Dauer am selben Tag (CLVN-012).
 * Gibt bis zu `anzahl` Vorschläge im Raster von 30 Minuten zurück.
 */
export function alternativeSlots(
  raum: Raum,
  datum: string,
  von: string,
  bis: string,
  anzahl = 3,
): { von: string; bis: string }[] {
  const dauer = dauerMinuten(von, bis)
  const result: { von: string; bis: string }[] = []
  const TAG_START = 8 * 60
  const TAG_ENDE = 18 * 60
  for (let start = TAG_START; start + dauer <= TAG_ENDE; start += 30) {
    const sVon = minutenZuZeit(start)
    const sBis = minutenZuZeit(start + dauer)
    if (sVon === von) continue
    if (istVerfuegbar(raum, datum, sVon, sBis)) {
      result.push({ von: sVon, bis: sBis })
      if (result.length >= anzahl) break
    }
  }
  return result
}

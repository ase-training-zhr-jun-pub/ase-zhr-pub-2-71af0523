import type { Raum } from "@/lib/mock-data"
import { belegungenAmTag } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const START = 8 // 08:00
const ENDE = 18 // 18:00

function minutenSeit8(zeit: string): number {
  const [h, m] = zeit.split(":").map(Number)
  return (h - START) * 60 + m
}

const GESAMT = (ENDE - START) * 60

/**
 * Visualisiert die Tagesbelegung eines Raums (CLVN-011).
 * Optional wird der gewünschte Zeitraum hervorgehoben.
 */
export function BelegungTimeline({
  raum,
  datum,
  wunschVon,
  wunschBis,
}: {
  raum: Raum
  datum: string
  wunschVon?: string
  wunschBis?: string
}) {
  const belegt = belegungenAmTag(raum, datum)

  return (
    <div className="space-y-2">
      <div className="relative h-9 w-full overflow-hidden rounded-md border bg-muted/40">
        {/* Stundenraster */}
        {Array.from({ length: ENDE - START }, (_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full border-l border-border/50 first:border-l-0"
            style={{ left: `${((i * 60) / GESAMT) * 100}%` }}
          />
        ))}
        {/* Belegte Slots */}
        {belegt.map((b, i) => (
          <div
            key={i}
            className="absolute top-0 flex h-full items-center justify-center overflow-hidden bg-muted-foreground/25 px-1"
            style={{
              left: `${(minutenSeit8(b.von) / GESAMT) * 100}%`,
              width: `${((minutenSeit8(b.bis) - minutenSeit8(b.von)) / GESAMT) * 100}%`,
            }}
            title={`${b.von}–${b.bis} ${b.titel}`}
          >
            <span className="truncate text-[10px] text-muted-foreground">{b.titel}</span>
          </div>
        ))}
        {/* Wunsch-Zeitraum */}
        {wunschVon && wunschBis && (
          <div
            className={cn(
              "absolute top-0 h-full border-2",
              "border-primary bg-primary/15",
            )}
            style={{
              left: `${(minutenSeit8(wunschVon) / GESAMT) * 100}%`,
              width: `${((minutenSeit8(wunschBis) - minutenSeit8(wunschVon)) / GESAMT) * 100}%`,
            }}
          />
        )}
      </div>
      {/* Stundenbeschriftung */}
      <div className="flex justify-between px-0.5 text-[10px] text-muted-foreground">
        {Array.from({ length: ENDE - START + 1 }, (_, i) => (
          <span key={i}>{String(START + i).padStart(2, "0")}</span>
        ))}
      </div>
    </div>
  )
}

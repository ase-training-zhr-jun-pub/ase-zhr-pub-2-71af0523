import { useMemo, useState } from "react"
import { SlidersHorizontal, Star, Map, List, X } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { RaumCard } from "@/components/raum-card"
import { BuchungDialog } from "@/components/buchung-dialog"
import { EtagenPlan } from "@/components/etagen-plan"
import { ZEITEN } from "@/components/zeit-select"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useApp } from "@/lib/app-context"
import {
  ALLE_AUSSTATTUNGEN,
  HEUTE,
  RAEUME,
  istVerfuegbar,
  standortName,
  type Ausstattung,
  type Raum,
} from "@/lib/mock-data"
import type { SucheParams } from "@/lib/slots"

export function RaeumeSuchenPage() {
  const { standortId, favoriten } = useApp()

  // Suchparameter
  const [datum, setDatum] = useState(HEUTE)
  const [von, setVon] = useState("10:00")
  const [bis, setBis] = useState("11:00")
  const [teilnehmer, setTeilnehmer] = useState(6)

  // Filter
  const [minKapazitaet, setMinKapazitaet] = useState(1)
  const [ausstattungFilter, setAusstattungFilter] = useState<Ausstattung[]>([])
  const [nurFavoriten, setNurFavoriten] = useState(false)
  const [ansicht, setAnsicht] = useState<"liste" | "plan">("liste")

  // Buchungsdialog
  const [gewaehlterRaum, setGewaehlterRaum] = useState<Raum | null>(null)
  const [dialogOffen, setDialogOffen] = useState(false)

  const suche: SucheParams = { datum, von, bis, teilnehmer }

  function toggleAusstattung(a: Ausstattung) {
    setAusstattungFilter((f) => (f.includes(a) ? f.filter((x) => x !== a) : [...f, a]))
  }

  const raeume = useMemo(() => {
    return RAEUME.filter((r) => r.standortId === standortId)
      .filter((r) => r.kapazitaet >= Math.max(minKapazitaet, teilnehmer))
      .filter((r) => ausstattungFilter.every((a) => r.ausstattung.includes(a)))
      .filter((r) => (nurFavoriten ? favoriten.includes(r.id) : true))
      .sort((a, b) => {
        // verfügbare zuerst, dann nach Kapazität
        const av = istVerfuegbar(a, datum, von, bis) ? 0 : 1
        const bv = istVerfuegbar(b, datum, von, bis) ? 0 : 1
        return av - bv || a.kapazitaet - b.kapazitaet
      })
  }, [standortId, minKapazitaet, teilnehmer, ausstattungFilter, nurFavoriten, favoriten, datum, von, bis])

  const anzahlFrei = raeume.filter((r) => istVerfuegbar(r, datum, von, bis)).length
  const filterAktiv = minKapazitaet > 1 || ausstattungFilter.length > 0 || nurFavoriten

  function oeffneDialog(raum: Raum) {
    setGewaehlterRaum(raum)
    setDialogOffen(true)
  }

  function zuruecksetzen() {
    setMinKapazitaet(1)
    setAusstattungFilter([])
    setNurFavoriten(false)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        titel="Räume suchen"
        beschreibung={`Konferenzräume in ${standortName(standortId)} finden und buchen`}
      />

      {/* Suchleiste */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="datum">Datum</Label>
            <Input
              id="datum"
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className="w-[160px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-von">Von</Label>
            <select
              id="s-von"
              className="h-9 w-[100px] rounded-md border bg-transparent px-3 text-sm"
              value={von}
              onChange={(e) => setVon(e.target.value)}
            >
              {ZEITEN.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-bis">Bis</Label>
            <select
              id="s-bis"
              className="h-9 w-[100px] rounded-md border bg-transparent px-3 text-sm"
              value={bis}
              onChange={(e) => setBis(e.target.value)}
            >
              {ZEITEN.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="teiln">Teilnehmer</Label>
            <Input
              id="teiln"
              type="number"
              min={1}
              max={30}
              value={teilnehmer}
              onChange={(e) => setTeilnehmer(Math.max(1, Number(e.target.value)))}
              className="w-[110px]"
            />
          </div>
          <div className="ml-auto flex items-center gap-1 self-end rounded-md border p-0.5">
            <Button
              variant={ansicht === "liste" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setAnsicht("liste")}
            >
              <List className="size-4" /> Liste
            </Button>
            <Button
              variant={ansicht === "plan" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setAnsicht("plan")}
            >
              <Map className="size-4" /> Plan
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        {/* Filter-Sidebar */}
        <aside className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="size-4" /> Filter
            </span>
            {filterAktiv && (
              <button
                onClick={zuruecksetzen}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" /> Zurücksetzen
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Mindestkapazität: {minKapazitaet} Pers.</Label>
            <Slider
              min={1}
              max={20}
              step={1}
              value={[minKapazitaet]}
              onValueChange={(v) => setMinKapazitaet(Array.isArray(v) ? v[0] : v)}
            />
          </div>

          <Separator />

          <div className="space-y-2.5">
            <Label>Ausstattung</Label>
            {ALLE_AUSSTATTUNGEN.map((a) => (
              <label key={a} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={ausstattungFilter.includes(a)}
                  onCheckedChange={() => toggleAusstattung(a)}
                />
                {a}
              </label>
            ))}
          </div>

          <Separator />

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={nurFavoriten}
              onCheckedChange={(c) => setNurFavoriten(Boolean(c))}
            />
            <Star className="size-4 text-amber-400" /> Nur Favoriten
          </label>
        </aside>

        {/* Ergebnisse */}
        <section className="space-y-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{raeume.length}</span> Räume ·{" "}
            <span className="font-medium text-emerald-600 dark:text-emerald-400">{anzahlFrei}</span>{" "}
            verfügbar {von}–{bis}
          </div>

          {raeume.length === 0 ? (
            <Card className="p-10 text-center text-sm text-muted-foreground">
              Keine Räume entsprechen den Filterkriterien.
              {filterAktiv && (
                <Button variant="link" onClick={zuruecksetzen} className="px-1">
                  Filter zurücksetzen
                </Button>
              )}
            </Card>
          ) : ansicht === "liste" ? (
            <div className="space-y-3">
              {raeume.map((r) => (
                <RaumCard
                  key={r.id}
                  raum={r}
                  datum={datum}
                  von={von}
                  bis={bis}
                  ausgewaehlt={gewaehlterRaum?.id === r.id}
                  onAuswaehlen={oeffneDialog}
                />
              ))}
            </div>
          ) : (
            <EtagenPlan
              raeume={raeume}
              datum={datum}
              von={von}
              bis={bis}
              onAuswaehlen={oeffneDialog}
            />
          )}
        </section>
      </div>

      <BuchungDialog
        raum={gewaehlterRaum}
        suche={suche}
        open={dialogOffen}
        onOpenChange={setDialogOffen}
      />
    </div>
  )
}

import { useState } from "react"
import { toast } from "sonner"
import { Users, MapPin, CheckCircle2, AlertTriangle, Clock, ArrowLeft, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AusstattungBadges } from "@/components/ausstattung-badges"
import { BelegungTimeline } from "@/components/belegung-timeline"
import { ZEITEN } from "@/components/zeit-select"
import { useApp } from "@/lib/app-context"
import {
  istVerfuegbar,
  standortName,
  type Buchung,
  type Raum,
} from "@/lib/mock-data"
import { alternativeSlots, type SucheParams } from "@/lib/slots"
import { dauerText, formatDatum } from "@/lib/format"
import { cn } from "@/lib/utils"

export function BuchungDialog({
  raum,
  suche,
  open,
  onOpenChange,
}: {
  raum: Raum | null
  suche: SucheParams
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { addBuchung } = useApp()
  const [schritt, setSchritt] = useState<1 | 2>(1)
  const [titel, setTitel] = useState("")
  const [von, setVon] = useState(suche.von)
  const [bis, setBis] = useState(suche.bis)
  const [notiz, setNotiz] = useState("")

  // bei Raumwechsel Zeiten aus der Suche übernehmen und auf Schritt 1 zurücksetzen
  const [letzteRaumId, setLetzteRaumId] = useState<string | null>(null)
  if (raum && raum.id !== letzteRaumId) {
    setLetzteRaumId(raum.id)
    setVon(suche.von)
    setBis(suche.bis)
    setTitel("")
    setNotiz("")
    setSchritt(1)
  }

  if (!raum) return null

  const verfuegbar = von < bis && istVerfuegbar(raum, suche.datum, von, bis)
  const zeitUngueltig = von >= bis
  const alternativen = !verfuegbar && !zeitUngueltig
    ? alternativeSlots(raum, suche.datum, von, bis)
    : []

  function absenden() {
    if (!raum || !verfuegbar) return
    const buchung: Buchung = {
      id: `b-${Math.round(performance.now())}`,
      raumId: raum.id,
      standortId: raum.standortId,
      titel: titel.trim() || "Ohne Titel",
      datum: suche.datum,
      von,
      bis,
      teilnehmer: suche.teilnehmer,
      notiz: notiz.trim() || undefined,
      status: "bestätigt",
    }
    addBuchung(buchung)
    onOpenChange(false)
    toast.success("Raum verbindlich gebucht", {
      description: `${raum.name} · ${formatDatum(suche.datum)} · ${von}–${bis}`,
      icon: <CheckCircle2 className="size-4" />,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {raum.name}
            <Badge variant="outline" className="font-normal">
              {raum.kategorie}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" /> {standortName(raum.standortId)} · {raum.etage}. OG ·
              Raum {raum.raumnummer}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3.5" /> {raum.kapazitaet}
            </span>
          </DialogDescription>
        </DialogHeader>

        {schritt === 1 ? (
          <>
            {/* Schritt 1: Raumauswahl bestätigen */}
            <div
              className="flex h-28 items-center justify-center rounded-lg text-3xl font-semibold text-white/90"
              style={{ backgroundColor: raum.farbe }}
            >
              {raum.name}
            </div>

            <AusstattungBadges ausstattung={raum.ausstattung} />

            <div>
              <div className="mb-1.5 text-sm font-medium">Tagesbelegung · {formatDatum(suche.datum)}</div>
              <BelegungTimeline raum={raum} datum={suche.datum} wunschVon={suche.von} wunschBis={suche.bis} />
            </div>

            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
              <Clock className="size-4 text-muted-foreground" />
              <span>
                {suche.von}–{suche.bis}{" "}
                <span className="text-muted-foreground">({dauerText(suche.von, suche.bis)})</span>
              </span>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
              <Button onClick={() => setSchritt(2)}>
                Weiter <ArrowRight className="ml-1 size-4" />
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            {/* Schritt 2: Buchungsdetails */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="titel">Meetingtitel</Label>
                <Input
                  id="titel"
                  placeholder="z.B. Sprint Review"
                  value={titel}
                  onChange={(e) => setTitel(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="von">Von</Label>
                  <select
                    id="von"
                    className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
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
                  <Label htmlFor="bis">Bis</Label>
                  <select
                    id="bis"
                    className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
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
              </div>

              {zeitUngueltig ? (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertTriangle className="size-4" /> Endzeit muss nach der Startzeit liegen.
                </div>
              ) : verfuegbar ? (
                <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" /> Raum ist {von}–{bis} verfügbar ({dauerText(von, bis)}
                  ).
                </div>
              ) : (
                <div className="space-y-2 rounded-md bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4" /> Im gewünschten Zeitraum belegt.
                  </div>
                  {alternativen.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs">Alternativen:</span>
                      {alternativen.map((a) => (
                        <button
                          key={a.von}
                          onClick={() => {
                            setVon(a.von)
                            setBis(a.bis)
                          }}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-background px-2 py-0.5 text-xs font-medium text-foreground hover:bg-muted",
                          )}
                        >
                          <Clock className="size-3" />
                          {a.von}–{a.bis}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="notiz">Notiz (optional)</Label>
                <Textarea
                  id="notiz"
                  placeholder="z.B. Beamer für Demo vorbereiten"
                  value={notiz}
                  onChange={(e) => setNotiz(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSchritt(1)}>
                <ArrowLeft className="mr-1 size-4" /> Zurück
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
              <Button disabled={!verfuegbar} onClick={absenden}>
                Verbindlich buchen
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

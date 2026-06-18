import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  Share2,
  Trash2,
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { BelegungTimeline } from "@/components/belegung-timeline"
import { AusstattungBadges } from "@/components/ausstattung-badges"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { raumById, standortName } from "@/lib/mock-data"
import { formatDatum, dauerText } from "@/lib/format"

export function BuchungsdetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { buchungen, stornieren } = useApp()
  const [stornoOffen, setStornoOffen] = useState(false)

  const buchung = buchungen.find((b) => b.id === id)

  if (!buchung) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader titel="Buchung nicht gefunden" beschreibung="Die Buchung existiert nicht." />
        <Button variant="outline" onClick={() => navigate("/buchungen")}>
          <ArrowLeft className="size-4" /> Zurück zu Meine Buchungen
        </Button>
      </div>
    )
  }

  const raum = raumById(buchung.raumId)
  const aktiv = buchung.status === "bestätigt"

  function teilen() {
    const text = `Raumbuchung: ${buchung.titel}\n${raum?.name} · ${standortName(
      buchung.standortId,
    )}\n${formatDatum(buchung.datum)} · ${buchung.von}–${buchung.bis}`
    navigator.clipboard?.writeText(text).catch(() => {})
    toast.success("Buchungsdetails kopiert", {
      description: "In die Zwischenablage – bereit zum Teilen.",
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        titel={buchung.titel}
        beschreibung={
          raum
            ? `${raum.name} · ${standortName(buchung.standortId)}`
            : standortName(buchung.standortId)
        }
      />

      {/* Raumkarte mit farbigem Streifen */}
      <Card className="overflow-hidden p-0">
        <div className="flex">
          <div className="w-2 shrink-0" style={{ backgroundColor: raum?.farbe }} />
          <div className="flex-1 p-6">
            {/* Status-Badge */}
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-lg font-semibold">{buchung.titel}</h2>
              {buchung.status === "storniert" && (
                <Badge variant="secondary" className="text-destructive">
                  <XCircle className="size-3.5" /> storniert
                </Badge>
              )}
              {buchung.status === "bestätigt" && (
                <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" /> bestätigt
                </Badge>
              )}
              {buchung.status === "vergangen" && (
                <Badge variant="secondary">vergangen</Badge>
              )}
            </div>

            {/* Details-Grid */}
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Standort */}
              <div>
                <dt className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <MapPin className="size-3.5" /> Standort
                </dt>
                <dd className="text-sm font-medium">
                  {raum?.name} · {standortName(buchung.standortId)}
                  {raum && (
                    <span className="block text-xs text-muted-foreground">
                      {raum.etage}. OG, Raum {raum.raumnummer}
                    </span>
                  )}
                </dd>
              </div>

              {/* Datum */}
              <div>
                <dt className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <CalendarDays className="size-3.5" /> Datum
                </dt>
                <dd className="text-sm font-medium">{formatDatum(buchung.datum)}</dd>
              </div>

              {/* Zeitraum */}
              <div>
                <dt className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Clock className="size-3.5" /> Zeitraum
                </dt>
                <dd className="text-sm font-medium">
                  {buchung.von}–{buchung.bis}
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    ({dauerText(buchung.von, buchung.bis)})
                  </span>
                </dd>
              </div>

              {/* Teilnehmer */}
              <div>
                <dt className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Users className="size-3.5" /> Teilnehmer
                </dt>
                <dd className="text-sm font-medium">{buchung.teilnehmer} Personen</dd>
              </div>

              {/* Notiz (falls vorhanden) */}
              {buchung.notiz && (
                <div className="sm:col-span-2">
                  <dt className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <FileText className="size-3.5" /> Notiz
                  </dt>
                  <dd className="text-sm">{buchung.notiz}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </Card>

      {/* Ausstattung */}
      {raum && raum.ausstattung.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-medium">Ausstattung</h3>
          <AusstattungBadges ausstattung={raum.ausstattung} />
        </section>
      )}

      {/* Tagesbelegung */}
      {raum && (
        <section>
          <h3 className="mb-2 text-sm font-medium">Tagesbelegung</h3>
          <BelegungTimeline
            raum={raum}
            datum={buchung.datum}
            wunschVon={buchung.von}
            wunschBis={buchung.bis}
          />
        </section>
      )}

      {/* Aktions-Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => navigate("/buchungen")}>
          <ArrowLeft className="size-4" /> Zurück zu Meine Buchungen
        </Button>
        <Button variant="ghost" onClick={teilen}>
          <Share2 className="size-4" /> Teilen
        </Button>
        {aktiv && (
          <Button variant="destructive" onClick={() => setStornoOffen(true)}>
            <Trash2 className="size-4" /> Buchung stornieren
          </Button>
        )}
      </div>

      {/* Stornieren-Dialog */}
      <Dialog open={stornoOffen} onOpenChange={setStornoOffen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Buchung stornieren?</DialogTitle>
            <DialogDescription>
              „{buchung.titel}" am {formatDatum(buchung.datum)} ({buchung.von}–{buchung.bis}) wird
              storniert. Der Raum wird wieder für andere verfügbar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStornoOffen(false)}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                stornieren(buchung.id)
                setStornoOffen(false)
                toast.success("Buchung storniert")
                navigate("/buchungen")
              }}
            >
              Stornieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

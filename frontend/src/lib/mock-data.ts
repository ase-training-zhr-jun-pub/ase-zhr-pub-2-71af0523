// Zentrale Mock-Daten für den Calvin-Prototyp.
// Kein Backend — alle Daten werden hier gemockt.

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

export type Ausstattung =
  | "Bildschirm"
  | "Whiteboard"
  | "Videokonferenz"
  | "Telefon"
  | "Beamer"

export const ALLE_AUSSTATTUNGEN: Ausstattung[] = [
  "Bildschirm",
  "Whiteboard",
  "Videokonferenz",
  "Telefon",
  "Beamer",
]

export type RaumKategorie = "Konferenzraum" | "Telefonbox"

export interface Belegung {
  /** ISO-Datum, z.B. "2026-06-18" */
  datum: string
  /** "HH:MM" */
  von: string
  /** "HH:MM" */
  bis: string
  titel: string
}

export interface Raum {
  id: string
  name: string
  standortId: string
  kategorie: RaumKategorie
  kapazitaet: number
  etage: number
  raumnummer: string
  ausstattung: Ausstattung[]
  /** akzentfarbe für das Platzhalter-Raumbild */
  farbe: string
  belegungen: Belegung[]
}

export interface Standort {
  id: string
  name: string
  /** Land für die Gruppierung (DE / CH) */
  land: "DE" | "CH"
}

export type BuchungsStatus = "bestätigt" | "vergangen" | "storniert"

export interface Buchung {
  id: string
  raumId: string
  standortId: string
  titel: string
  datum: string
  von: string
  bis: string
  teilnehmer: number
  notiz?: string
  status: BuchungsStatus
}

export interface Kollege {
  id: string
  name: string
  initialen: string
  standortId: string
  /** ISO-Daten, an denen die Person im Büro ist */
  imBueroAn: string[]
}

// ---------------------------------------------------------------------------
// Standorte (die acht INNOQ-Standorte)
// ---------------------------------------------------------------------------

export const STANDORTE: Standort[] = [
  { id: "koeln", name: "Köln", land: "DE" },
  { id: "monheim", name: "Monheim", land: "DE" },
  { id: "berlin", name: "Berlin", land: "DE" },
  { id: "hamburg", name: "Hamburg", land: "DE" },
  { id: "muenchen", name: "München", land: "DE" },
  { id: "offenbach", name: "Offenbach", land: "DE" },
  { id: "zuerich", name: "Zürich", land: "CH" },
  { id: "baar", name: "Baar", land: "CH" },
]

// Aktueller Nutzer (Persona)
export const AKTUELLER_NUTZER = {
  name: "Alex Berger",
  rolle: "Senior Consultant",
  initialen: "AB",
  standortId: "koeln",
}

// Referenzdatum des Prototyps (heute)
export const HEUTE = "2026-06-18"

// ---------------------------------------------------------------------------
// Räume
// ---------------------------------------------------------------------------

const FARBEN = [
  "#2563eb",
  "#0891b2",
  "#059669",
  "#d97706",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#475569",
]

export const RAEUME: Raum[] = [
  // ---- Köln (reich ausgestattet, Alex' Standort) ----
  {
    id: "koeln-rheinblick",
    name: "Rheinblick",
    standortId: "koeln",
    kategorie: "Konferenzraum",
    kapazitaet: 12,
    etage: 3,
    raumnummer: "304",
    ausstattung: ["Bildschirm", "Whiteboard", "Videokonferenz"],
    farbe: FARBEN[0],
    belegungen: [{ datum: HEUTE, von: "13:00", bis: "14:00", titel: "Architektur-Sync" }],
  },
  {
    id: "koeln-dom-lounge",
    name: "Dom-Lounge",
    standortId: "koeln",
    kategorie: "Konferenzraum",
    kapazitaet: 8,
    etage: 2,
    raumnummer: "210",
    ausstattung: ["Bildschirm", "Whiteboard"],
    farbe: FARBEN[1],
    belegungen: [
      { datum: HEUTE, von: "10:00", bis: "11:00", titel: "Daily" },
      { datum: HEUTE, von: "14:00", bis: "15:30", titel: "Kundenworkshop" },
    ],
  },
  {
    id: "koeln-veedel",
    name: "Veedel",
    standortId: "koeln",
    kategorie: "Konferenzraum",
    kapazitaet: 6,
    etage: 2,
    raumnummer: "208",
    ausstattung: ["Bildschirm", "Whiteboard", "Videokonferenz", "Beamer"],
    farbe: FARBEN[2],
    belegungen: [],
  },
  {
    id: "koeln-kranhaus",
    name: "Kranhaus",
    standortId: "koeln",
    kategorie: "Konferenzraum",
    kapazitaet: 20,
    etage: 4,
    raumnummer: "401",
    ausstattung: ["Bildschirm", "Whiteboard", "Videokonferenz", "Beamer"],
    farbe: FARBEN[3],
    belegungen: [{ datum: HEUTE, von: "09:00", bis: "12:00", titel: "Workshop Domain Modelling" }],
  },
  {
    id: "koeln-box-1",
    name: "Quiet Box 1",
    standortId: "koeln",
    kategorie: "Telefonbox",
    kapazitaet: 1,
    etage: 3,
    raumnummer: "B01",
    ausstattung: ["Telefon"],
    farbe: FARBEN[4],
    belegungen: [],
  },
  {
    id: "koeln-box-2",
    name: "Quiet Box 2",
    standortId: "koeln",
    kategorie: "Telefonbox",
    kapazitaet: 2,
    etage: 3,
    raumnummer: "B02",
    ausstattung: ["Telefon", "Bildschirm"],
    farbe: FARBEN[5],
    belegungen: [{ datum: HEUTE, von: "11:00", bis: "12:00", titel: "Kunden-Call" }],
  },
  {
    id: "koeln-severin",
    name: "Severin",
    standortId: "koeln",
    kategorie: "Konferenzraum",
    kapazitaet: 4,
    etage: 1,
    raumnummer: "112",
    ausstattung: ["Bildschirm"],
    farbe: FARBEN[6],
    belegungen: [],
  },
  {
    id: "koeln-rheinauhafen",
    name: "Rheinauhafen",
    standortId: "koeln",
    kategorie: "Konferenzraum",
    kapazitaet: 10,
    etage: 4,
    raumnummer: "405",
    ausstattung: ["Bildschirm", "Videokonferenz"],
    farbe: FARBEN[7],
    belegungen: [{ datum: HEUTE, von: "15:00", bis: "16:00", titel: "Retro" }],
  },
  {
    id: "koeln-belgisches-viertel",
    name: "Belgisches Viertel",
    standortId: "koeln",
    kategorie: "Konferenzraum",
    kapazitaet: 14,
    etage: 1,
    raumnummer: "105",
    ausstattung: ["Bildschirm", "Whiteboard", "Beamer"],
    farbe: FARBEN[0],
    belegungen: [],
  },
  // ---- Berlin ----
  {
    id: "berlin-spree",
    name: "Spree",
    standortId: "berlin",
    kategorie: "Konferenzraum",
    kapazitaet: 10,
    etage: 5,
    raumnummer: "512",
    ausstattung: ["Bildschirm", "Whiteboard", "Videokonferenz"],
    farbe: FARBEN[1],
    belegungen: [],
  },
  {
    id: "berlin-fernsehturm",
    name: "Fernsehturm",
    standortId: "berlin",
    kategorie: "Konferenzraum",
    kapazitaet: 16,
    etage: 5,
    raumnummer: "520",
    ausstattung: ["Bildschirm", "Whiteboard", "Videokonferenz", "Beamer"],
    farbe: FARBEN[2],
    belegungen: [{ datum: HEUTE, von: "10:00", bis: "11:30", titel: "All-Hands" }],
  },
  {
    id: "berlin-box-1",
    name: "Quiet Box Mitte",
    standortId: "berlin",
    kategorie: "Telefonbox",
    kapazitaet: 1,
    etage: 5,
    raumnummer: "B05",
    ausstattung: ["Telefon"],
    farbe: FARBEN[3],
    belegungen: [],
  },
  // ---- München ----
  {
    id: "muenchen-isar",
    name: "Isar",
    standortId: "muenchen",
    kategorie: "Konferenzraum",
    kapazitaet: 8,
    etage: 2,
    raumnummer: "201",
    ausstattung: ["Bildschirm", "Whiteboard"],
    farbe: FARBEN[4],
    belegungen: [],
  },
  {
    id: "muenchen-englischer-garten",
    name: "Englischer Garten",
    standortId: "muenchen",
    kategorie: "Konferenzraum",
    kapazitaet: 12,
    etage: 2,
    raumnummer: "208",
    ausstattung: ["Bildschirm", "Whiteboard", "Videokonferenz"],
    farbe: FARBEN[5],
    belegungen: [{ datum: HEUTE, von: "13:00", bis: "14:00", titel: "1:1" }],
  },
  // ---- Hamburg ----
  {
    id: "hamburg-elbe",
    name: "Elbe",
    standortId: "hamburg",
    kategorie: "Konferenzraum",
    kapazitaet: 10,
    etage: 3,
    raumnummer: "302",
    ausstattung: ["Bildschirm", "Videokonferenz"],
    farbe: FARBEN[6],
    belegungen: [],
  },
  {
    id: "hamburg-speicherstadt",
    name: "Speicherstadt",
    standortId: "hamburg",
    kategorie: "Konferenzraum",
    kapazitaet: 6,
    etage: 3,
    raumnummer: "310",
    ausstattung: ["Bildschirm", "Whiteboard"],
    farbe: FARBEN[7],
    belegungen: [],
  },
  // ---- weitere Standorte (je 2 generische Räume) ----
  ...generischeRaeume("monheim", ["Rheinpark", "Marienburg"]),
  ...generischeRaeume("offenbach", ["Hafen", "Wilhelmsplatz"]),
  ...generischeRaeume("zuerich", ["Limmat", "Üetliberg"]),
  ...generischeRaeume("baar", ["Lorzen", "Höllgrotten"]),
]

function generischeRaeume(standortId: string, namen: string[]): Raum[] {
  return namen.map((name, i) => ({
    id: `${standortId}-${name.toLowerCase().replace(/[^a-z]/g, "")}`,
    name,
    standortId,
    kategorie: "Konferenzraum" as RaumKategorie,
    kapazitaet: i === 0 ? 8 : 12,
    etage: i + 1,
    raumnummer: `${i + 1}0${i + 1}`,
    ausstattung:
      i === 0
        ? (["Bildschirm", "Whiteboard"] as Ausstattung[])
        : (["Bildschirm", "Whiteboard", "Videokonferenz"] as Ausstattung[]),
    farbe: FARBEN[(i + 2) % FARBEN.length],
    belegungen: [],
  }))
}

// ---------------------------------------------------------------------------
// Buchungen des aktuellen Nutzers
// ---------------------------------------------------------------------------

export const BUCHUNGEN: Buchung[] = [
  {
    id: "b-1001",
    raumId: "koeln-rheinblick",
    standortId: "koeln",
    titel: "Sprint Review",
    datum: HEUTE,
    von: "10:00",
    bis: "11:00",
    teilnehmer: 6,
    notiz: "Beamer für Demo vorbereiten",
    status: "bestätigt",
  },
  {
    id: "b-1002",
    raumId: "koeln-dom-lounge",
    standortId: "koeln",
    titel: "Kundenworkshop ACME",
    datum: "2026-06-20",
    von: "14:00",
    bis: "15:30",
    teilnehmer: 8,
    notiz: "Externe Gäste anmelden",
    status: "bestätigt",
  },
  {
    id: "b-1003",
    raumId: "koeln-box-2",
    standortId: "koeln",
    titel: "Kunden-Call Telco",
    datum: "2026-06-25",
    von: "09:00",
    bis: "09:30",
    teilnehmer: 1,
    status: "bestätigt",
  },
  {
    id: "b-0900",
    raumId: "koeln-veedel",
    standortId: "koeln",
    titel: "Team-Retro",
    datum: "2026-06-04",
    von: "11:00",
    bis: "12:00",
    teilnehmer: 5,
    status: "vergangen",
  },
  {
    id: "b-0901",
    raumId: "koeln-kranhaus",
    standortId: "koeln",
    titel: "Onboarding Workshop",
    datum: "2026-05-28",
    von: "09:00",
    bis: "12:00",
    teilnehmer: 14,
    status: "vergangen",
  },
]

// ---------------------------------------------------------------------------
// Kollegen (für "Kollegen heute im Büro")
// ---------------------------------------------------------------------------

export const KOLLEGEN: Kollege[] = [
  { id: "k1", name: "Mara Koch", initialen: "MK", standortId: "koeln", imBueroAn: [HEUTE, "2026-06-20"] },
  { id: "k2", name: "Jonas Peters", initialen: "JP", standortId: "koeln", imBueroAn: [HEUTE] },
  { id: "k3", name: "Lea Schmidt", initialen: "LS", standortId: "koeln", imBueroAn: [HEUTE, "2026-06-25"] },
  { id: "k4", name: "Tobias Wirth", initialen: "TW", standortId: "koeln", imBueroAn: [HEUTE] },
  { id: "k5", name: "Nina Albers", initialen: "NA", standortId: "koeln", imBueroAn: [HEUTE] },
  { id: "k6", name: "Sven Brandt", initialen: "SB", standortId: "koeln", imBueroAn: ["2026-06-20"] },
  { id: "k7", name: "Pia Hoffmann", initialen: "PH", standortId: "koeln", imBueroAn: [HEUTE, "2026-06-19"] },
  { id: "k8", name: "David Lang", initialen: "DL", standortId: "berlin", imBueroAn: [HEUTE] },
  { id: "k9", name: "Carla Mertens", initialen: "CM", standortId: "berlin", imBueroAn: [HEUTE] },
  { id: "k10", name: "Ferdinand Voss", initialen: "FV", standortId: "muenchen", imBueroAn: [HEUTE] },
]

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

export function standortName(id: string): string {
  return STANDORTE.find((s) => s.id === id)?.name ?? id
}

export function raumById(id: string): Raum | undefined {
  return RAEUME.find((r) => r.id === id)
}

/** Prüft, ob ein Raum für einen Zeitraum frei ist (CLVN-010). */
export function istVerfuegbar(raum: Raum, datum: string, von: string, bis: string): boolean {
  return !raum.belegungen.some(
    (b) => b.datum === datum && zeitUeberlappt(b.von, b.bis, von, bis),
  )
}

export function zeitUeberlappt(aVon: string, aBis: string, bVon: string, bBis: string): boolean {
  return aVon < bBis && bVon < aBis
}

/** Belegungen eines Raums an einem Tag, sortiert (CLVN-011). */
export function belegungenAmTag(raum: Raum, datum: string): Belegung[] {
  return raum.belegungen
    .filter((b) => b.datum === datum)
    .sort((a, b) => a.von.localeCompare(b.von))
}

export const ICON_FUER_AUSSTATTUNG: Record<Ausstattung, string> = {
  Bildschirm: "Monitor",
  Whiteboard: "PenLine",
  Videokonferenz: "Video",
  Telefon: "Phone",
  Beamer: "Projector",
}

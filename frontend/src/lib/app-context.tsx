import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { AKTUELLER_NUTZER, BUCHUNGEN, type Buchung } from "@/lib/mock-data"

type Theme = "light" | "dark"

interface AppState {
  // Standort
  standortId: string
  setStandortId: (id: string) => void
  // Favoriten (Raum-IDs)
  favoriten: string[]
  toggleFavorit: (raumId: string) => void
  istFavorit: (raumId: string) => boolean
  // Buchungen (clientseitig veränderbar)
  buchungen: Buchung[]
  addBuchung: (b: Buchung) => void
  stornieren: (id: string) => void
  aendern: (id: string, patch: Partial<Buchung>) => void
  // Theme
  theme: Theme
  toggleTheme: () => void
}

const AppContext = createContext<AppState | null>(null)

function ladePersist<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [standortId, setStandortId] = useState<string>(() =>
    ladePersist("calvin.standort", AKTUELLER_NUTZER.standortId),
  )
  const [favoriten, setFavoriten] = useState<string[]>(() =>
    ladePersist("calvin.favoriten", ["koeln-rheinblick"]),
  )
  const [buchungen, setBuchungen] = useState<Buchung[]>(() =>
    ladePersist("calvin.buchungen", BUCHUNGEN),
  )
  const [theme, setTheme] = useState<Theme>(() => ladePersist<Theme>("calvin.theme", "light"))

  useEffect(() => {
    localStorage.setItem("calvin.standort", JSON.stringify(standortId))
  }, [standortId])
  useEffect(() => {
    localStorage.setItem("calvin.favoriten", JSON.stringify(favoriten))
  }, [favoriten])
  useEffect(() => {
    localStorage.setItem("calvin.buchungen", JSON.stringify(buchungen))
  }, [buchungen])
  useEffect(() => {
    localStorage.setItem("calvin.theme", JSON.stringify(theme))
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const value = useMemo<AppState>(
    () => ({
      standortId,
      setStandortId,
      favoriten,
      toggleFavorit: (raumId) =>
        setFavoriten((f) => (f.includes(raumId) ? f.filter((x) => x !== raumId) : [...f, raumId])),
      istFavorit: (raumId) => favoriten.includes(raumId),
      buchungen,
      addBuchung: (b) => setBuchungen((bs) => [b, ...bs]),
      stornieren: (id) =>
        setBuchungen((bs) => bs.map((b) => (b.id === id ? { ...b, status: "storniert" } : b))),
      aendern: (id, patch) =>
        setBuchungen((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b))),
      theme,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    }),
    [standortId, favoriten, buchungen, theme],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp muss innerhalb von AppProvider verwendet werden")
  return ctx
}

import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import {
  LayoutDashboard,
  Search,
  CalendarDays,
  Users,
  Star,
  Moon,
  Sun,
  Menu,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/lib/app-context"
import { AKTUELLER_NUTZER, STANDORTE, standortName } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/raeume", label: "Räume suchen", icon: Search },
  { to: "/buchungen", label: "Meine Buchungen", icon: CalendarDays },
  { to: "/kollegen", label: "Kollegen heute", icon: Users },
  { to: "/favoriten", label: "Favoriten", icon: Star },
]

function StandortSwitcher() {
  const { standortId, setStandortId } = useApp()
  const de = STANDORTE.filter((s) => s.land === "DE")
  const ch = STANDORTE.filter((s) => s.land === "CH")
  return (
    <Select value={standortId} onValueChange={(v) => v && setStandortId(v)}>
      <SelectTrigger className="w-[180px]" aria-label="Standort wählen">
        <MapPin className="size-4 text-muted-foreground" />
        <SelectValue>{(value: string) => standortName(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Deutschland</SelectLabel>
          {de.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Schweiz</SelectLabel>
          {ch.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useApp()
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Darstellung wechseln">
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  )
}

function SidebarInhalt({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )
          }
        >
          <item.icon className="size-4.5 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AppShell() {
  const [mobileOffen, setMobileOffen] = useState(false)

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      {/* Desktop-Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            C
          </div>
          <div className="leading-tight">
            <div className="font-semibold">Calvin</div>
            <div className="text-xs text-muted-foreground">Raumbuchung</div>
          </div>
        </div>
        <SidebarInhalt />
        <div className="mt-auto border-t p-4 text-xs text-muted-foreground">
          INNOQ · Multi-Standort
        </div>
      </aside>

      {/* Mobile-Sidebar (Overlay) */}
      {mobileOffen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOffen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r bg-sidebar">
            <div className="flex h-16 items-center gap-2 border-b px-5 font-semibold">Calvin</div>
            <SidebarInhalt onNavigate={() => setMobileOffen(false)} />
          </aside>
        </div>
      )}

      {/* Hauptbereich */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOffen(true)}
            aria-label="Menü öffnen"
          >
            <Menu className="size-5" />
          </Button>
          <StandortSwitcher />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <div className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3">
              <Avatar className="size-7">
                <AvatarFallback className="text-xs">{AKTUELLER_NUTZER.initialen}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{AKTUELLER_NUTZER.name}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

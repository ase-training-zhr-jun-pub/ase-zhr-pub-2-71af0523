import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { RaumCard } from "@/components/raum-card"
import { AppProvider } from "@/lib/app-context"
import type { Raum } from "@/lib/mock-data"

const testRaum: Raum = {
  id: "test-raum",
  name: "Testroom",
  standortId: "koeln",
  kategorie: "Konferenzraum",
  kapazitaet: 8,
  etage: 2,
  raumnummer: "201",
  ausstattung: ["Bildschirm"],
  farbe: "#3b82f6",
  belegungen: [],
}

function renderRaumCard(ausgewaehlt?: boolean) {
  return render(
    <AppProvider>
      <RaumCard
        raum={testRaum}
        datum="2026-06-18"
        von="10:00"
        bis="11:00"
        ausgewaehlt={ausgewaehlt}
        onAuswaehlen={() => {}}
      />
    </AppProvider>,
  )
}

describe("RaumCard – visuelle Auswahlmarkierung", () => {
  it("zeigt keine Hervorhebung wenn nicht ausgewählt", () => {
    const { container } = renderRaumCard(false)
    const card = container.firstChild as HTMLElement
    expect(card).not.toHaveClass("ring-2")
  })

  it("zeigt Hervorhebung wenn ausgewählt", () => {
    const { container } = renderRaumCard(true)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("ring-2")
  })

  it("zeigt keine Hervorhebung wenn prop weggelassen wird", () => {
    const { container } = renderRaumCard()
    const card = container.firstChild as HTMLElement
    expect(card).not.toHaveClass("ring-2")
  })

  it("zeigt Raumname an", () => {
    renderRaumCard()
    expect(screen.getByText("Testroom")).toBeInTheDocument()
  })
})

---
Ticket-ID: CLVN-028
Type: Task
Story: CLVN-016
Epic: CLVN-015
Status: TODO
---
# RaumCard – visuelle Auswahlmarkierung

## Beschreibung

Damit der INNOQ-Mitarbeiter jederzeit sieht, welcher Konferenzraum für die Buchung ausgewählt ist,
soll die `RaumCard` eine optische Hervorhebung erhalten, sobald sie ausgewählt wurde. Die
Markierung bleibt sichtbar, solange der `BuchungDialog` offen ist — auch wenn die Karte im
Hintergrund liegt.

## Umsetzung

**`frontend/src/components/raum-card.tsx`**
- Optionales Prop `ausgewaehlt?: boolean` hinzufügen.
- Bei `ausgewaehlt=true` visuelle Hervorhebung via Tailwind-Klassen (z.B. `ring-2 ring-primary`).

**`frontend/src/pages/raeume-suchen.tsx`**
- Jede `RaumCard` bekommt `ausgewaehlt={gewaehlterRaum?.id === r.id}`.

## Akzeptanzkriterien

- [ ] Die ausgewählte `RaumCard` wird visuell hervorgehoben
- [ ] Andere Karten werden nicht hervorgehoben
- [ ] Die Hervorhebung bleibt aktiv, solange der Dialog offen ist
- [ ] Beim Schließen des Dialogs verschwindet die Hervorhebung

## Zugehörige Story

[CLVN-016 – Raumauswahl bestätigen](CLVN-016-STORY-raumauswahl-bestaetigen.md)

---
Ticket-ID: CLVN-029
Type: Task
Story: CLVN-016
Epic: CLVN-015
Status: TODO
---
# BuchungDialog – zweistufiger Buchungsflow

## Beschreibung

Der `BuchungDialog` soll in zwei klar getrennte Schritte unterteilt werden. Im ersten Schritt
bestätigt der Mitarbeiter seine Raumauswahl und sieht alle relevanten Details. Erst nach der
Bestätigung gelangt er zum Buchungsformular.

## Umsetzung

**`frontend/src/components/buchung-dialog.tsx`**

`schritt: 1 | 2` State einführen. Beim Öffnen (Raumwechsel-Logik via `letzteRaumId`) immer
auf Schritt 1 zurücksetzen.

**Schritt 1 – Raumauswahl bestätigen:**
- Anzeige: Farb-Banner, Name, Standort + Etage + Raumnummer, Kapazität, Ausstattung-Badges,
  Tagesbelegung-Timeline, gewählter Zeitraum (von–bis inkl. Dauer)
- Footer: „Abbrechen" (schließt Dialog) | „Weiter →" (wechselt zu Schritt 2)

**Schritt 2 – Buchungsdetails:**
- Bestehendes Formular: Meetingtitel, Von/Bis-Zeitwahl, Verfügbarkeitsstatus, Notiz
- Footer: „← Zurück" (zurück zu Schritt 1, Dialog bleibt offen) | „Verbindlich buchen"

## Akzeptanzkriterien

- [ ] Dialog öffnet immer auf Schritt 1
- [ ] Schritt 1 zeigt Raumdetails und gewählten Zeitraum, kein Buchungsformular
- [ ] „Weiter" führt zu Schritt 2
- [ ] Schritt 2 zeigt das Buchungsformular
- [ ] „← Zurück" kehrt zu Schritt 1 zurück ohne den Dialog zu schließen
- [ ] „Abbrechen" schließt den Dialog (in beiden Schritten)
- [ ] Nach Absenden erscheint Bestätigungs-Toast wie bisher

## Zugehörige Story

[CLVN-016 – Raumauswahl bestätigen](CLVN-016-STORY-raumauswahl-bestaetigen.md)

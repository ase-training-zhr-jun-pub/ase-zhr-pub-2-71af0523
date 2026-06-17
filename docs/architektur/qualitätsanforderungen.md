# Qualitätsanforderungen Calvin

Qualitätsszenarien nach dem Template:
**Umgebung · Quelle · Ereignis · Artefakt · Reaktion · Maß**

---

## QS-1: Antwortzeit bei der Raumsuche

**Qualitätsmerkmal**: Performance

Im normalen Betrieb sucht ein INNOQ-Mitarbeiter auf der Calvin-Weboberfläche nach verfügbaren Konferenzräumen an einem Standort für einen gewählten Zeitraum. Das System liefert die vollständige, gefilterte Ergebnisliste in unter 500 ms – bei bis zu 150 gleichzeitig aktiven Nutzern, in mindestens 95 % der Anfragen.

| Feld | Wert |
|------|------|
| Umgebung | Normaler Betrieb, gleichmäßige Last über den Tag |
| Quelle | INNOQ-Mitarbeiter |
| Ereignis | Startet eine Raumsuche mit Standort- und Zeitraumfilter |
| Artefakt | Suchergebnis-Liste im Frontend |
| Reaktion | Gefilterte Raumliste wird vollständig angezeigt |
| Maß | < 500 ms bei ≤ 150 gleichzeitigen Nutzern, in ≥ 95 % der Anfragen |

---

## QS-2: Verhinderung von Doppelbuchungen

**Qualitätsmerkmal**: Zuverlässigkeit / Datenintegrität

Im normalen Betrieb versuchen zwei INNOQ-Mitarbeiter gleichzeitig – innerhalb derselben Sekunde – denselben Konferenzraum für denselben Zeitraum zu buchen. Der Booking Service verarbeitet die zuerst vollständig eingegangene Anfrage und bestätigt die Buchung. Die zweite Anfrage wird mit einer verständlichen Fehlermeldung abgelehnt. Doppelbuchungen werden in 99,9 % der Fälle serverseitig verhindert.

| Feld | Wert |
|------|------|
| Umgebung | Normaler Betrieb |
| Quelle | Zwei INNOQ-Mitarbeiter |
| Ereignis | Gleichzeitiger Buchungsversuch desselben Raums im selben Zeitraum (< 1 s Abstand) |
| Artefakt | Booking Service / Buchungslogik |
| Reaktion | Erste Buchung bestätigt, zweite mit Fehlermeldung abgelehnt |
| Maß | ≥ 99,9 % der konkurrierenden Buchungsversuche enden ohne Doppelbuchung |

---

## QS-3: Verfügbarkeit an buchungsintensiven Tagen

**Qualitätsmerkmal**: Verfügbarkeit / Wiederherstellbarkeit

Dienstag bis Donnerstag während der Kernarbeitszeiten (08:00–18:00 Uhr) – den Tagen, an denen die meisten INNOQ-Mitarbeiter ins Büro kommen – fällt das Calvin-System unerwartet aus. Da kein zentrales Buchungssystem mehr verfügbar ist, greift als Notfallprozess das First-Come-First-Served-Prinzip. Das System wird innerhalb von 15 Minuten wiederhergestellt. Die Verfügbarkeit beträgt an diesen Kerntagen mindestens 99 %.

| Feld | Wert |
|------|------|
| Umgebung | Dienstag–Donnerstag, 08:00–18:00 Uhr |
| Quelle | Infrastruktur / unerwarteter Systemfehler |
| Ereignis | Ungeplantem Ausfall des Calvin-Systems |
| Artefakt | Calvin-System (Frontend + Booking Service) |
| Reaktion | System wird wiederhergestellt; Fallback ist First-Come-First-Served |
| Maß | ≥ 99 % Verfügbarkeit Di–Do; Wiederherstellungszeit ≤ 15 Minuten |

---

## QS-4: Transparenz von Buchungsinformationen

**Qualitätsmerkmal**: Transparenz / Benutzbarkeit

Im normalen Betrieb öffnet ein INNOQ-Mitarbeiter die Belegungsübersicht eines Konferenzraums oder Standorts. Das System zeigt alle relevanten Buchungsinformationen – Zeitraum, Titel und buchende Person – vollständig und für alle Mitarbeiter sichtbar an. Es findet keine Anonymisierung statt. Die Übersicht lädt in unter 500 ms.

| Feld | Wert |
|------|------|
| Umgebung | Normaler Betrieb |
| Quelle | Beliebiger INNOQ-Mitarbeiter |
| Ereignis | Aufruf der Belegungsübersicht eines Raums oder Standorts |
| Artefakt | Belegungsansicht im Frontend |
| Reaktion | Buchungsdetails (Zeitraum, Titel, Bucher) vollständig angezeigt, ohne Einschränkung |
| Maß | 100 % der Buchungen sichtbar für alle Mitarbeiter; Ladezeit ≤ 500 ms |

---

## QS-5: Erste Buchung ohne Einarbeitung

**Qualitätsmerkmal**: Benutzbarkeit / Erlernbarkeit

Ein neuer INNOQ-Mitarbeiter öffnet Calvin zum ersten Mal ohne jede Schulung oder Anleitung und möchte einen Konferenzraum für den nächsten Tag buchen. Er navigiert eigenständig durch die Oberfläche und schließt die Buchung erfolgreich ab. 90 % der neuen Mitarbeiter schaffen dies ohne fremde Hilfe, in maximal 5 Minuten und maximal 20 Klicks.

| Feld | Wert |
|------|------|
| Umgebung | Erstmalige Nutzung, kein Onboarding oder Schulung vorausgegangen |
| Quelle | Neuer INNOQ-Mitarbeiter |
| Ereignis | Erste Buchung eines Konferenzraums |
| Artefakt | Buchungsflow / Gesamte UI |
| Reaktion | Buchung wird eigenständig und erfolgreich abgeschlossen |
| Maß | ≤ 5 Minuten, ≤ 20 Klicks; ≥ 90 % ohne Hilfe |

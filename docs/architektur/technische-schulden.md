# Technische Schulden

Bekannte technische Schulden, die bewusst eingegangen wurden und vor dem Produktivbetrieb abgebaut werden müssen.

---

## TS-001: Mock-Daten statt Resource Service

**Priorität**: Hoch — vor Produktivbetrieb

**Beschreibung**:
Standorte, Räume und Ausstattungen sind als statische Mock-Daten in der SPA hinterlegt. Ein eigenständiger Resource Service, der diese Stammdaten verwaltet und pflegt, existiert nicht. Der Booking Service arbeitet nur mit den IDs aus diesen Mock-Daten und hat keine eigene Kenntnis über Räume oder Standorte.

**Warum eingegangen**:
Für den Prototypen war ein separater Resource Service nicht notwendig. Die Mock-Daten ermöglichen schnelle Entwicklung und Iteration ohne Abhängigkeit zu einem weiteren Dienst.

**Risiken**:
- Stammdaten (neue Räume, geänderte Ausstattung) können nur über einen Code-Änderung aktualisiert werden
- Inkonsistenz zwischen Mock-Daten in der SPA und den gespeicherten IDs im Booking Service, wenn Mock-Daten nachträglich geändert werden

**Abbaustrategie**:
Eigenständigen Resource Service implementieren, der Stammdaten persistent verwaltet. SPA und Booking Service konsumieren den Resource Service über eine API. Bestehende Buchungen müssen auf die neuen IDs migriert werden.

---

## TS-002: Basic-Auth statt Okta

**Priorität**: Hoch — vor Produktivbetrieb

**Beschreibung**:
Der Booking Service verwendet Basic-Auth ohne Passwörter statt einer Okta-Integration. Der Nutzername wird im Request-Header mitgesendet, ohne Passwort-Validierung. Dies dient ausschließlich dazu, im Prototypen schnell mit verschiedenen Nutzern testen zu können.

**Warum eingegangen**:
Okta-Integration erfordert eine externe Abhängigkeit (Okta-Tenant), die im Prototypen vermieden werden sollte. Basic-Auth ohne Passwörter macht den Testbetrieb mit mehreren Nutzeridentitäten einfach und ohne Konfigurationsaufwand.

**Risiken**:
- Keinerlei Authentifizierungssicherheit — jeder kann unter jedem Nutzernamen buchen
- Nicht produktionstauglich; Deployment in Produktion ohne Okta-Integration wäre ein kritisches Sicherheitsproblem

**Abbaustrategie**:
`okta-spring-boot-starter` in den Booking Service integrieren. Spring Security ist bereits im Stack und unterstützt OIDC/OAuth2 nativ — der Stack-Wechsel ist nicht nötig. Basic-Auth-Konfiguration wird entfernt und durch Okta-OIDC ersetzt.

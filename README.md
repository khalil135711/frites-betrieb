# Frites Betrieb – Verwaltung (Testversion)

Einfache Web-App für Schichtplan, Arbeitszeiten, Bestellungen und MHD.
Reine HTML/CSS/JavaScript-Seite, ohne Installation und ohne Server.

## Lokal testen
`index.html` per Doppelklick im Browser öffnen.

## Auf GitHub Pages hosten
1. Auf github.com ein neues Repository anlegen (z. B. `frites-betrieb`).
2. Alle Dateien aus diesem Ordner hochladen („Add file" > „Upload files").
3. Im Repository: Settings > Pages > Branch `main`, Ordner `/ (root)` > Save.
4. Nach ca. 1 Minute ist die Seite unter `https://khalil135711.github.io/frites-betrieb/` erreichbar.

## Wichtig
- **Nur Testdaten eintragen.** GitHub Pages ist öffentlich im Internet erreichbar. Echte Mitarbeiterdaten (DSGVO) gehören nicht in eine öffentliche Testseite.
- Die Daten liegen im `localStorage` des Browsers: nur auf diesem Gerät, nicht geteilt. Mit „Daten exportieren/importieren" lässt sich ein Stand sichern oder auf ein anderes Gerät übertragen.
- Für den echten Einsatz mit Inhaber und Mitarbeitern braucht es ein Backend mit Anmeldung und Rollen. Die Stelle dafür ist `storage.js`.

## Inhalt
- `index.html`, `style.css`, `app.js`, `storage.js`: die App
- `docs/Datenschutzinformation_Mitarbeiter.pdf`: Vorlage zur Unterschrift (Platzhalter ausfüllen, rechtlich prüfen lassen)

---
name: punktgenau-short
description: Erstellt ein neues YouTube-Short für den Kanal Punktgenau (Physik/Informatik/Mathe für Laien) von der Themenwahl bis zum fertigen Video mit Thumbnail und Upload-Texten. Nutzen, wenn ein neues Video, ein neues Thema oder ein neues Skript für den Kanal gemacht werden soll.
---

# Punktgenau-Short erstellen

Arbeite in Phasen. **Nach jeder Phase mit Freigabe-Punkt anhalten und auf den Nutzer warten.**
Alle Regeln zu Look, Layout, Skript und Ton stehen in `CLAUDE.md` – vorher lesen und strikt einhalten.
Befehle laufen in `remotion-shorts/` (`npm run pg -- …`).

## Phase 1 – Thema (Freigabe)
- Hat der Nutzer kein Thema genannt: 8–12 Vorschläge als Tabelle (Thema, Hook-Satz, was man sieht, Aufwand).
- Kriterien: Ergebnis ab Sekunde 1 sichtbar, aus wenigen Punkten/Linien darstellbar, überraschende Auflösung, die man *zeigen* kann, Zuschauer kann raten.
- Bereits gemachte Themen nicht wiederholen (`npm run pg -- list`).
- Der Nutzer entscheidet das Thema.

## Phase 2 – Bildtest (Freigabe)
- Kurzer Prototyp (Python/Node) des Kernbilds, gerendert in **Handy-Größe** (ca. 390 px breit).
- Mathe/Physik vorher **nachrechnen** (Simulation, Zählung) – keine Behauptung, die das Bild nicht zeigt.
- Ergebnis dem Nutzer schicken: Trägt das Bild?

## Phase 3 – Skript (Freigabe)
- `npm run pg -- new <nn-slug> "<Titel>"` (nn = nächste freie Nummer).
- Skript in `videos/<slug>/script.md` (nummerierte Zeilen, ein Satz = eine Audiodatei), Fakten-Check-Abschnitt füllen.
- Skript-Regeln aus CLAUDE.md (vollständige Sätze, Kontext im Hook, Loop am Ende, ca. 150 Wörter).
- Skript vollständig im Chat zeigen. Der Nutzer entscheidet und spricht es danach ein.

## Phase 4 – Vorschau-Video (optional, ohne Stimme)
- `npm run pg -- words <slug>` (geschätzte Zeiten), Szenen in `src/videos/<slug>/Video.tsx` bauen.
- Bausteine nur aus `src/shared` importieren. Beispiele für Szenen-Code: `src/zeno/` (3D-Hook, Strecke, Quadrat-Beweis), `src/spiral/` (Canvas mit vielen Punkten), `src/phantom/` (Simulation).

## Phase 5 – Stimme
- Nutzer legt `audio1.mp3 … audioN.mp3` nach `videos/<slug>/voice/`.
- `npm run pg -- voice <slug>` (Whisper-Wortzeiten, Tonspur, Musik).
- Weicht die Aufnahme vom Skript ab (Whisper-Text in `videos/<slug>/whisper.json` vergleichen), `script.md` an das tatsächlich Gesprochene anpassen und `voice` erneut ausführen.

## Phase 6 – Video bauen und prüfen (Freigabe)
- Szenen an die echten Wortzeiten hängen, `npm run typecheck`.
- `npm run pg -- audit <slug>` und **alle** Kontaktbögen ansehen: Überschneidungen, abgeschnittene Labels, Standbilder, Captions über Grafik. Beheben, erneut prüfen.
- `npm run pg -- render <slug>`, Video dem Nutzer schicken. Feedback einarbeiten (gezielt, nicht neu bauen). Bei "sehe ich nicht"/"passt nicht": Ursache erst messen und erklären.

## Phase 7 – Upload-Paket
- Thumbnail 1080×1920 als eigene Komposition (Vorbild `src/zeno/Thumbnail.tsx`), Szene + große Schlagzeile, Text nicht über wichtigen Bildteilen.
- Kurz: 3 Titel-Varianten, Beschreibung (2–3 Sätze + Bildnachweise), Hashtags inkl. `#shorts #punktgenau`.
- In `videos/<slug>/upload.md` speichern und im Chat zeigen.

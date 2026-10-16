# Punktgenau – YouTube-Shorts-Studio

Deutscher Shorts-Kanal **Punktgenau**: Physik, Informatik und Mathe für Laien, visuell erklärt.
Neue Videos immer mit dem Skill `/punktgenau-short` erstellen (Ablauf in Phasen, mit Freigaben).

## Ordner
- `videos/<slug>/` – pro Video: `script.md`, `voice/audio1.mp3 …`, `whisper.json`, `audit/`, `export/`
- `remotion-shorts/` – Remotion-Projekt (Rendern, Studio)
  - `src/videos/<slug>/Video.tsx` – Szenen-Code des Videos, `words.json`, `meta.json`
  - `src/shared/index.ts` – **einziger** Import-Punkt für Stil und Werkzeuge (Farben, Schrift, Captions, Punktraster, Stimme+Musik, Timeline)
  - `public/<slug>/voice.wav`, `music.wav` – erzeugt, nicht von Hand ändern
- `scripts/` – Werkzeuge (`pg.mjs`, Whisper, Abgleich, Musik-Generator)
- `branding/` – Logo, Banner, Profilbild
- Alte Einzelvideos (`src/zeno`, `src/spiral`, …) dienen als Beispiele für Szenen-Code.

## Befehle (aus `remotion-shorts/`)
| Befehl | Zweck |
|---|---|
| `npm run pg -- new 04-monty-hall "Titel"` | Video anlegen |
| `npm run pg -- words <slug>` | Wortzeiten aus Skript schätzen (Vorschau ohne Stimme) |
| `npm run pg -- voice <slug>` | Whisper-Wortzeiten + Tonspur + Musik |
| `npm run pg -- audit <slug>` | Kontaktbögen alle 0,5 s nach `videos/<slug>/audit/` |
| `npm run pg -- scene <slug> <n>` | Longform: Abschnitt n als eigenen Clip im **Remotion Studio** öffnen (abspielen, Regler, speichern). Clips immer dort öffnen, nie das ganze Video rendern. `--mp4`: zusätzlich 720p-Datei |
| `npm run pg -- render <slug>` | Finales Video nach `videos/<slug>/export/` (Longform in 4K, in Teilstücken), danach automatisch im Browser (offener Tab lädt neu, kein neues Fenster). Nur für den Export |
| `npm run pg -- preview <slug>` | Letzten Export im Browser zeigen |
| `npm run pg -- list` | Übersicht |
| `npm run studio` | Remotion Studio (Vorschau, Regler) |
| `npm run typecheck` | TypeScript prüfen |

## Look (verbindlich)
- Weißer Hintergrund mit gleichmäßigem **Punktraster**. Das Raster ist die Leinwand: **keine festen Kästchen/Panels**, in denen etwas passiert.
- Flach: **keine Schatten, keine Verläufe, keine Farbwolken/Glow, kein Glas** (keine halbtransparenten Panels), keine abgerundeten Kästchen.
- Farben: Blau `#1f7ae0`, Orange `#f97316`, Magenta `#d61f69` (Akzent), Schwarz-Text, Grau `#c4c4c4` (Raster). Kein Navy.
- Schrift: Inter (über `FONT`). Text über Grafik bekommt eine **weiße Kontur** (paint-order stroke), keinen Schatten.
- Kein Fortschrittsbalken.

## Layout
- Format 1080×1920, 30 fps.
- Safe Zone: wichtige Inhalte etwa x 90–950, y 250–1150. Oben, unten (Plattform-Beschreibung) und rechts (Buttons) frei lassen.
- **Word-by-Word-Captions** (`<Captions />`) mittig bei y ≈ 1360. Nichts Wichtiges darunter platzieren.
- Elemente dürfen sich **nie überschneiden** (Zahlen, Labels, Grafik, Captions). Nach jedem Render-Schritt `audit` prüfen.
- **Kein Standbild**: jede Sekunde passiert etwas (Kamera, Aufbau, Zoom). Auch am Ende.

## Skript
- Vollständige, zusammenhängende Sätze – **kein Telegrammstil**. Ca. 150 Wörter.
- Starker Hook im ersten Satz, mit Kontext (wer behauptet was). Hook muss auch **visuell** sofort fesseln (Bewegung ab Frame 0).
- Wörter, die auf Bildinhalte zeigen ("diese Tür"), müssen auch im Bild zu sehen sein.
- Mehrdeutigkeiten vermeiden (z. B. "gerade Linien" vs. "gerade Zahlen"). Zahlen und Jahre ausschreiben.
- Letzter Satz endet offen und führt in den ersten (Loop).
- Jede Behauptung belegen (Quelle oder eigene Nachrechnung) und im Abschnitt "Fakten-Check" des Skripts festhalten.

## Ton
- Stimme nimmt der Nutzer auf: eine Datei pro Satz (`audio1.mp3 …`).
- Musik: eigener Klangteppich (`scripts/make-ambient.py`), unter der Stimme abgesenkt – kein Lizenzrisiko.
- **Keine Soundeffekte** (wurden ausprobiert und abgelehnt).

## Technik-Regeln
- Alle Zeitpunkte aus der Timeline ableiten (`TL.lineStart(i)`, `TL.lineEnd(i)`, `TL.wordStart(i, k)`), nie feste Sekunden – sonst bricht das Timing, sobald die echte Stimme da ist.
- Viele Punkte (> ~2000): Canvas statt SVG. 3D: `@remotion/three`, beim Rendern `--gl=angle`, `ThreeCanvas flat`.
- Sichtbarkeit in **Handy-Größe** (ca. 390 px Breite) prüfen, bevor man ein Muster/Detail im Skript verspricht.
- Downloads (Bilder, Audio, Modelle) nur nach Freigabe durch den Nutzer; Lizenz prüfen und im Skript vermerken.

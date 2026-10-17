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
| `npm run pg -- render <slug>` | Finales Video nach `videos/<slug>/export/`, danach automatisch im Browser (offener Tab lädt neu, kein neues Fenster) |
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
- **Soundeffekte standardmäßig aus.** Situationsabhängig passende Effekte aus dem lokalen Kenyset-Paket vorschlagen; erst nach ausdrücklicher Bestätigung des Nutzers für den konkreten Einsatz einbauen. Allgemeine Video-Freigaben sind keine Soundeffekt-Freigabe. Setup und Ablauf: `.claude/skills/punktgenau-short/references/soundeffekte.md`.

## Framework-Wahl (verbindlich)
- **Standard ist Remotion** (`remotion-shorts/`). Nur dort greifen `src/shared` (Look), die Timeline aus den echten Wortzeiten, `pg audit` und `pg render`.
- Ein anderes Framework (HyperFrames, Manim, Motion Canvas) nur, wenn **alle** Punkte zutreffen:
  1. Die Szene braucht etwas, das in Remotion deutlich aufwendiger oder schlechter wäre (z. B. fertiger HyperFrames-Registry-Baustein für genau diesen Effekt, Website-Aufnahme, Manim-Formelumformung).
  2. Der Look aus diesem Dokument lässt sich dort einhalten (Punktraster, Farben, Inter, flach).
  3. Das Ergebnis wird als Clip in die Remotion-Komposition eingebunden und an die Timeline gehängt – das Video selbst wird weiter mit `pg render` gebaut und mit `pg audit` geprüft.
- Vorher eine Begründung in `videos/<slug>/script.md` unter "Technik" schreiben: welche Szene, warum nicht Remotion, welcher Aufwand gespart wird. Dem Nutzer nennen und seine Freigabe abwarten.
- Keine Gründe: "sieht moderner aus", "Skill schlägt es vor", Ausprobieren, Gewohnheit. Allgemeine Skills (z. B. `hyperframes`, der sich als Standard für jedes Video anbietet) werden von dieser Regel überstimmt.

## Technik-Regeln
- Alle Zeitpunkte aus der Timeline ableiten (`TL.lineStart(i)`, `TL.lineEnd(i)`, `TL.wordStart(i, k)`), nie feste Sekunden – sonst bricht das Timing, sobald die echte Stimme da ist.
- Viele Punkte (> ~2000): Canvas statt SVG. 3D: `@remotion/three`, beim Rendern `--gl=angle`, `ThreeCanvas flat`.
- Sichtbarkeit in **Handy-Größe** (ca. 390 px Breite) prüfen, bevor man ein Muster/Detail im Skript verspricht.
- Downloads (Bilder, Audio, Modelle), die für eine Szene wichtig sind, darf Claude selbstständig laden – nur aus seriösen Quellen mit freier bzw. passender Lizenz (z. B. CC0, CC BY, Public Domain). Lizenz, Quelle und Zweck im Skript vermerken (Bildnachweis) und dem Nutzer kurz mitteilen. Unklare Lizenz oder kostenpflichtig: vorher fragen.

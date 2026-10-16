# AGENTS.md – Punktgenau-Studio (für Codex und andere Agenten)

Verbindliche Regeln stehen in **`CLAUDE.md`** (Look, Layout, Skript, Ton, Technik). Zuerst lesen.

Longform-Videos (16:9) folgen **`.claude/skills/punktgenau-longform/SKILL.md`**, Shorts folgen `.claude/skills/punktgenau-short/SKILL.md`. Beide Dateien vollständig lesen und befolgen, als wären es Anweisungen dieses Agenten.

## Die wichtigsten Arbeitsregeln (Kurzfassung)
- Sprache mit dem Nutzer: **Deutsch**.
- **Immer nur eine Szene in Arbeit.** Szene bauen → Selbstkontrolle → im Remotion Studio öffnen → auf Feedback warten → verbessern oder nächste Szene. Nie mehrere Szenen gleichzeitig bauen oder rendern.
- **Selbstkontrolle vor dem Zeigen:** Einzelbilder der Szene (etwa jede Sekunde, `renderStill` mit `scale: 0.25`) ansehen. Gesucht wird nach Überschneidungen, Elementen außerhalb des Bilds oder in den Captions (y > 880) und Bildern, die nicht zum gesprochenen Satz passen.
- **Remotion Studio:** `npm run studio` in `remotion-shorts/` (Port 3000). Szenen-Clips heißen `<CompId>-SzeneNN`, z. B. `http://localhost:3000/V04UnendlichZaehlen-Szene02`. Clips immer dort öffnen, nie das ganze Video rendern.
- **4K nur beim finalen Export:** `npm run pg -- render <slug>`.
- **Keine Stimme generieren (kein TTS).** Der Nutzer liefert die Aufnahmen selbst (z. B. `Downloads/<Thema>/`, Dateiname = Satz). Aufnahmen nie kürzen, die Animation passt sich an.
- Alle Zeitpunkte aus gesprochenen Wörtern ableiten (`cue(...)`, `TL.lineStart(...)`), nie feste Sekunden.
- **Keine einfachen Strich-Icons.** Gegenstände eigens zeichnen oder echte Fotos verwenden (freigestellt, Lizenz in `storyboard/assets.md` notieren).
- Jede Rechnung und Grafik vorher wissenschaftlich prüfen (`storyboard/pruefung.mjs`).
- **Git:** nur Pipeline-Dateien committen (scripts/, Skills, shared, Root/Registry-Mechanik, AGENTS.md/CLAUDE.md). Einzelne Videos (`src/videos/<slug>`, `public/<slug>`, `videos/<slug>`) **nicht** committen. Commit-Format: `<type>: <beschreibung>`.

## Laufendes Video
Stand und nächste Schritte für das aktuelle Longform-Video: `videos/04-unendlich-zaehlen/HANDOFF.md`.

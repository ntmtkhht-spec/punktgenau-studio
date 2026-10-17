# AGENTS.md – Punktgenau-Studio (für Codex und andere Agenten)

Verbindliche Regeln stehen in **`CLAUDE.md`** (Look, Layout, Skript, Ton, Technik). Sie gelten für jeden Agenten, nicht nur für Claude. Zuerst lesen.

Welcher Skill für welches Video – die jeweilige Datei vollständig lesen und befolgen, als wären es Anweisungen dieses Agenten:
- Punktgenau-Shorts (9:16): `.claude/skills/punktgenau-short/SKILL.md`
- Punktgenau-Longform (16:9): `.claude/skills/punktgenau-longform/SKILL.md`
- Editorial-Stil (zweiter Kanal): `.claude/skills/editorial-video/SKILL.md` (+ `editorial-typography`)
- Thumbnails (beide Kanäle): `.claude/skills/thumbnail-design/SKILL.md`

## Die wichtigsten Arbeitsregeln (Kurzfassung)
- Sprache mit dem Nutzer: **Deutsch**.
- **Framework (Punktgenau):** Remotion (`remotion-shorts/`). HyperFrames, Manim oder Motion Canvas nur nach „Framework-Wahl“ in CLAUDE.md: mit schriftlicher Begründung im Skript und Freigabe des Nutzers. „Ist moderner“ oder „macht Spaß“ ist kein Grund.
- **Editorial:** Jede Szene wählt ihr Tool (Remotion+Three, HyperFrames+GSAP, Manim) mit Begründung im Storyboard; `npm run ed -- check` muss bestehen.
- **Thumbnails:** immer 3 Konzepte in `thumbnail-plan.json`, dann `pg thumbnail` bzw. `ed thumbnail` mit Feed-Test.
- **Immer nur eine Szene in Arbeit (Longform).** Szene bauen → Selbstkontrolle → im Remotion Studio öffnen → auf Feedback warten → verbessern oder nächste Szene.
- **Selbstkontrolle vor dem Zeigen:** Einzelbilder der Szene ansehen (Überschneidungen, Elemente außerhalb des Bilds oder in den Captions, Bilder, die nicht zum gesprochenen Satz passen).
- **Remotion Studio:** `npm run studio` in `remotion-shorts/` (Port 3000). Longform-Szenen-Clips heißen `<CompId>-SzeneNN` (`npm run pg -- scene <slug> <n>`). 4K nur beim finalen Export (`npm run pg -- render <slug>`).
- **Keine Stimme generieren (kein TTS).** Der Nutzer liefert die Aufnahmen selbst. Aufnahmen nie kürzen, die Animation passt sich an.
- Alle Zeitpunkte aus gesprochenen Wörtern ableiten (`TL.lineStart(...)`, `TL.wordStart(...)`), nie feste Sekunden.
- Soundeffekte nur nach ausdrücklicher Bestätigung.
- Jede Rechnung und Grafik vorher prüfen (nachrechnen oder simulieren).
- **Git:** nur Pipeline-Dateien committen (scripts/, Skills, shared, Root/Registry-Mechanik, AGENTS.md/CLAUDE.md). Einzelne Videos (`src/videos/<slug>`, `public/<slug>`, `videos/<slug>`) **nicht** committen. Commit-Format: `<type>: <beschreibung>`.

# Hinweise für Codex und andere Agenten

Alle Projektregeln stehen in [CLAUDE.md](CLAUDE.md). Sie gelten für jeden Agenten, nicht nur für Claude. Vor jeder Arbeit lesen und einhalten.
Der Ablauf für neue Videos steht in `.claude/skills/punktgenau-short/SKILL.md`.

Besonders wichtig, weil es oft falsch gemacht wird:
- **Framework (Punktgenau):** Punktgenau-Videos werden mit **Remotion** (`remotion-shorts/`) gebaut. HyperFrames, Manim oder Motion Canvas nur nach dem Abschnitt "Framework-Wahl" in CLAUDE.md: mit schriftlicher Begründung im Skript und Freigabe des Nutzers. "Ist moderner" oder "macht Spaß" ist kein Grund.
- **Editorial-Stil (zweiter Kanal):** Skill `.claude/skills/editorial-video/SKILL.md`. Dort wählt jede Szene ihr Tool (Remotion+Three, HyperFrames+GSAP, Manim) mit Begründung im Storyboard; `npm run ed -- check` muss bestehen.
- Soundeffekte nur nach ausdrücklicher Bestätigung.
- Keine TTS-Stimme, die Stimme liefert der Nutzer.

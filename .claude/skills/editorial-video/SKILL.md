---
name: editorial-video
description: Erstellt ein Video im Editorial-Stil (angelehnt an Ultralativ) für den zweiten Kanal – 16:9 oder 9:16 – mit Szenen, die pro Szene Archetyp, 2D/2.5D/3D, Tapete, Licht, Charaktere und Render-Tool (Remotion+Three, HyperFrames+GSAP, Manim) selbst wählen und begründen. Nutzen für Video-Essays und Erklärvideos außerhalb von Punktgenau. Nicht für Punktgenau-Shorts (dafür /punktgenau-short).
---

# Editorial-Video erstellen

Eigenständiger Stil neben Punktgenau. **Die Punktgenau-Regeln (weißes Punktraster, flach, Inter, nur Remotion) gelten hier nicht** – bestehende Punktgenau-Videos werden nicht angefasst.
Grundlage: `research/ultralativ-editorial-pipeline-spec.md` (Stilanalyse, Archetypen, Messwerte). **Pflicht-Aufruf:** Zu Beginn von Phase 3 und erneut zu Beginn von Phase 4 den Skill `/editorial-typography` aufrufen (Skill-Tool) und seinen Entscheidungsbaum für jedes Textelement durchlaufen.
Befehle laufen in `editorial/` als `npm run ed -- …`. Archetypen, Tool-Router und Format-Regeln: [references/regie.md](references/regie.md).
**Reinheitsgebot:** Asset-Klassen, Manifest und die 6 Verbote stehen in [references/assets.md](references/assets.md) – vor jedem Storyboard lesen. Nichts erfinden, was Ultralativ nicht auch tun würde.

Arbeite in Phasen. **Nach jeder Phase mit Freigabe anhalten und auf den Nutzer warten.**

## Phase 1 – Thema & Format (Freigabe)
- Thema klären oder vorschlagen. **Format fragen**, falls nicht genannt: `16x9` (Widescreen 1920×1080, Video-Essay) oder `9x16` (Short 1080×1920).
- `npm run ed -- new <nn-slug> "<Titel>" --format 16x9|9x16` legt `editorial/projects/<slug>/` an.

## Phase 2 – Skript (Freigabe)
- `projects/<slug>/script.md`: nummerierte Sätze, Fakten-Check, Quellen & Lizenzen.
- Kapitelstruktur für 16:9: jedes Kapitel bekommt ein eigenes Tapeten-Motiv; Kapitel-Karten markieren Wechsel.

## Phase 3 – Storyboard (Freigabe) – Kern dieses Skills
Für **jede Szene einzeln** entscheiden, nichts aus der Vorszene übernehmen, ohne neu zu prüfen. Kein festes Muster.
Pro Szene in `storyboard.md` (Begründung in Prosa) **und** `storyboard.json` (Maschinenformat, siehe `projects/00-beweis/storyboard.json`):

1. **Satz & Zeitfenster:** Satz aus `script.md`, Dauer, Wort-Anker für wichtige Momente.
2. **Archetyp & Dimensionalität:** einer der 7 Archetypen + `2D`/`2.5D`/`3D`. Begründen: *Warum zeigt genau dieser Aufbau, was der Satz sagt?*
3. **Hintergrund & Licht:** Tapeten-Motiv (`damast`, `arkaden`, `blaetter`, `birken`), Modus `these` (farbig: Erzählung, Behauptung) oder `kritik` (abgedunkelt: Analyse, Widerspruch, Bruch), Licht `vignette`/`spotlight`/`sunburst`/`none`. Moduswechsel nur an einem inhaltlichen Bruch.
4. **Charaktere:** `keine`, `meeple`, `roboter`, `portraet`, `silhouetten-publikum`, `panel-figur` – mit Begründung, welche Rolle sie im Argument spielen. Keine Figur als Deko.
5. **Bühne & Typografie:** konkrete Objekte. Für **jedes** sichtbare Textelement nach dem Entscheidungsbaum aus `/editorial-typography` eine der 7 Rollen wählen und in `typography` festhalten: `text`, `role`, `font` (Familie, Schnitt, Neigung, Schatten/Extrusion), bei Zahlen `beleg`. Sans-Serif nur für nachgebaute App-UIs; Dachzeilen über Rolle 2/3 in kursiver Didone; genau ein Akzentwort pro Zeile.
6. **Choreografie & Kamera:** Schritt für Schritt mit Zeitangaben; Kamera `push-in`, `isometric-zoom`, `whip-pan`, `3d-orbit`, `static-drift` … Kein Moment ohne Bewegung.
7. **Übergang:** `cut`, `fade`, `light-switch`, `whip-pan`, `zoom-through`, `chapter-card`.
8. **Assets & freie Bühne:** jedes sichtbare Element in `assets` einer Asset-Klasse zuordnen (5 aus der Spec plus `formel-graph`/`eigene-grafik`) (Herkunft, Lizenz, Quellenzeile), `focusObjects` 1–3. Jede Zahl im Bild mit `beleg`. Verbote aus `references/assets.md` beachten: keine erfundenen Zahlen/Zitate, nichts Unechtes als echt ausgeben, kein Dashboard/Bento/Glas/Neon, keine Emojis, Logos immer laden, kein Idle-Wackeln.
9. **Tool & technische Begründung:** `remotion-three`, `remotion-dom`, `hyperframes-gsap`, `manim-python` oder `blender-python` – nach dem Router in `references/regie.md`. Begründung nennt, was dieses Tool für *diese* Szene besser kann (mind. ein Satz, kein „passt gut“).

**Thumbnail-Plan:** Skill `/thumbnail-design` aufrufen (Modus B `editorial`) und in `projects/<slug>/thumbnail-plan.json` **3 Konzepte mit unterschiedlichen Archetypen** planen (`conceptual-split-pun`, `diegetic-ui-overload`, `symbolic-metaphor-contrast`, `cutout-portrait-mashup`, `emblem-medallion-centerpiece`): höchstens 3 Wörter, Schrift-Rolle aus `/editorial-typography` mit 3D-Extrusion, Gold-Bevel oder hartem Schatten, höchstens 2 Fokus-Elemente, Logos geladen. Vorbild: `projects/00-beweis/thumbnail-plan.json`.

Danach `npm run ed -- check <slug>` (prüft alle Pflichtfelder, Enums, Dateien, Schrift-Rollen). Storyboard vollständig im Chat zeigen, auf Freigabe warten. **Keine Standbilder** für das Storyboard erzeugen.

## Phase 4 – Assets beschaffen & Szenen bauen (je Szene prüfen)
- **Pflicht zuerst:** `npm run ed -- assets <slug>` (sucht und lädt alle Archivwerke und Logos aus dem Storyboard), **jedes geladene Bild mit dem Read-Tool ansehen**, falschen Treffer mit `assets <slug> <id>=<n>` tauschen, dann `npm run ed -- approve <slug> <id>`. Ohne Freigabe rendert nichts. Logos und Tapeten nie selbst generieren (Tapeten sind echte historische Digitalisate in `shared/wallpapers`); Diagramme, Formen und Requisiten dürfen selbst gebaut werden (`references/assets.md`).
- **Gemeinsame Komponenten benutzen, nichts nachbauen:**
  - Schrift: Remotion nur über `remotion/shared/typography.tsx` (`<RoleText role=…>`, `roleStyle`, `kickerStyle`); HyperFrames nur über `roles.css` (Klassen `.role-*`, `.kicker`, `.caption`, `.bubble-fill`). Eigenes `fontFamily`/`font-family` lehnt `check` ab.
  - Archivwerke: `remotion/shared/FramedArtwork.tsx` (Rahmen + Pflicht-Quellenzeile, Spotlight über `lit`).
  - Tapete und Licht: `remotion/shared/Wallpaper.tsx` (kommt automatisch aus `wallpaper` der Szene).
- Remotion: Komponente in `editorial/remotion/scenes/`, in `scenes/registry.ts` eintragen. Format kommt als Prop – nie feste Pixel, immer relativ zu `width`/`height`.
- HyperFrames: `projects/<slug>/hf/<id>/index.html` mit Platzhaltern `__W__ __H__ __U__ __DUR__`, `<link href="roles.css">`, Tapete als `bg.png` (beides setzt die Pipeline ein), GSAP-Timeline in `window.__timelines["main"]`, kein `repeat: -1`/`yoyo`.
- Blender: `projects/<slug>/blender/<id>.py`, Aufruf `blender -b -P <datei> -- <ausgabe-ordner> [frame …]`, Auflösung und Dauer aus `ED_WIDTH`/`ED_HEIGHT`/`ED_DURATION`, PNG mit Alpha (`film_transparent`) als `f0000.png …`. Wird über die Remotion-Tapete gelegt. Selbstkontrolle mit einzelnen Frames, Vorschau in 1280×720. Ganze Animation in einem `render(animation=True)`-Aufruf, `taa_render_samples` aus `ED_SAMPLES` (Standard 16). Zwischenstände mit `ED_PREVIEW=1` (halbe Auflösung), Full HD nur für den finalen Clip. Vorlage: `projects/04-enigma/blender/s3.py`.
- Manim: `projects/<slug>/manim/<id>.py`, Layout über `config.frame_width/height`, Dauer aus `ED_DURATION`. Wird transparent über die Remotion-Tapete gelegt.
- Jede Szene einzeln: `npm run ed -- scene <slug> <id>`, Frames ansehen, korrigieren.

## Phase 5 – Stimme & Musik
- Nutzer liefert die Stimme (keine TTS). `projects/<slug>/audio/voice.wav`, optional `music.wav` (eigener Klangteppich, `scripts/make-ambient.py`).
- Szenendauern an die echte Aufnahme anpassen, dann neu rendern.

## Phase 6 – Zusammenführen & Audit (Freigabe)
- `npm run ed -- build <slug>` (alle Szenen) oder `join <slug>` (nur zusammenführen): Clips + Übergänge + Ton → `export/<slug>.mp4`, Kontaktbögen alle 0,5 s → `audit/`.
- **Alle** Kontaktbögen ansehen: Verstöße gegen das Reinheitsgebot (Wackeln, mehr als 3 Fokus-Objekte, falsche Bilder), Überschneidungen, verpixelte Übergänge, Standbilder, Text in den Plattform-Zonen (9:16: oben ~12 %, unten ~20 %, rechts ~12 % freihalten), unlesbare Schrift in Handygröße. Beheben, neu prüfen, dann dem Nutzer zeigen.

## Phase 7 – Thumbnail (Freigabe)
- Gewähltes Konzept bauen: Remotion-Komponente in `remotion/scenes/` (in `registry.ts` eintragen) oder HyperFrames-HTML (`render.html`). Assets wie im Video über `ed assets` laden.
- `npm run ed -- thumbnail <slug>`: rendert `thumbnail/thumbnail_full.png` (1920×1080 bzw. 1080×1920), Feed-Testbild `320×180` bzw. `270×480`, Sperrzonen-Bild (16:9 `x > 1580, y > 920`; 9:16 `y > 1450`) und misst Y/σ. Rechnerische Checks müssen PASS sein; Feed-Testbild und Sperrzonen-Bild **mit dem Read-Tool ansehen** (Checks 3 und 5). Bei FAIL ändern und neu prüfen, dann dem Nutzer zeigen.

## Soundeffekte, Downloads, Stimme
Wie in `CLAUDE.md`: Soundeffekte nur nach ausdrücklicher Bestätigung; Downloads ohne Lizenzfilter, aber Quelle/Urheber/Lizenz immer festhalten; keine TTS-Stimme.

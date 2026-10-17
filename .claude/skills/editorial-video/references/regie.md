# Regie-Referenz: Archetypen, Tool-Router, Formate

Quelle der Stilwerte: `research/ultralativ-editorial-pipeline-spec.md` (Referenz `kUuwvJfQfIk`, Kontaktbögen in `downloads/kUuwvJfQfIk/contact_sheets/`).

## Die 7 Archetypen – wann welcher?

| Archetyp | Wählen, wenn der Satz … | Typisch | Standard-Tool |
|---|---|---|---|
| `3d-isometric-diorama` | Größenordnungen, Mengen, Systeme oder Abläufe im Raum zeigt („einer – dann tausend“) | 3D, dunkler Schieferboden, Toon-Shading, Zoom-out | `remotion-three` |
| `2.5d-kinetic-typography` | ein Schlagwort, einen Slogan oder einen Begriffswechsel betont (`TALENT → ARBEIT`) | geneigte, extrudierte Schrift, Sprechblase baut sich auf | `hyperframes-gsap` oder `remotion-dom` |
| `gallery-spotlight-stage` | zwei Dinge vergleicht oder ein Werk/Beleg ausstellt | gerahmte Bilder, Spotlight-Kegel, Quellenzeile, ggf. Sunburst | `remotion-dom` oder `hyperframes-gsap` |
| `2.5d-parallax-deconstruct` | ein Medium (Bild, Video, Seite) zerlegt oder hinter die Fassade schaut | gekippte Ebenen im Raum, Tiefenunschärfe, Kamerafahrt durch Ebenen | `remotion-three` |
| `symbolic-actors-collage` | Rollen, Beziehungen oder Verantwortung zwischen Akteuren erklärt | Meeples, Roboterköpfe, Papierzitate, weiche Schatten | `remotion-dom` / `hyperframes-gsap` |
| `diegetic-ui-retro` | über Software, Computer, Eingaben oder Algorithmen spricht | CRT mit Scanlines, Prompt-Leiste, Button-Text wechselt | `hyperframes-gsap` |
| `math-simulation-graph` | eine Formel, Rechnung, Funktion oder Simulation zeigt | LaTeX, Achsen, Graph-Morphing | `manim-python` |

Zwei aufeinanderfolgende Szenen mit gleichem Archetyp nur, wenn der Gedanke weiterläuft. Sonst wechseln.

## Tool-Router – technische Entscheidung pro Szene

Frage in dieser Reihenfolge, erste passende Antwort gewinnt:

1. **Exakte Mathematik** (LaTeX-Formel, Funktionsgraph, Vektorfeld, Gleichungsumformung)? → `manim-python`. Wird transparent über die Remotion-Tapete gelegt.
2. **Echter Raum** (Perspektive, Kamera im 3D-Raum, Licht/Schatten auf Objekten, viele Objekte in Tiefe, Ebenen im Raum)? → `remotion-three`.
3. **HTML-typische Effekte** (CSS-Scanlines/Glow, Tipp-Effekte, SVG-Stroke-Zeichnen, UI-Nachbau, Registry-Block für genau diesen Effekt)? → `hyperframes-gsap`.
4. **Sonst** (Layout, Bilder, Rahmen, Text, Collage, an Wortzeiten gebunden) → `remotion-dom`.

Die Begründung im Storyboard nennt den konkreten Vorteil („Kamera fährt durch 961 Objekte in Tiefe – braucht echtes 3D“), nicht nur den Toolnamen.

## Pipeline-Ablauf (`scripts/ed.mjs`)

```
storyboard.json ──check──▶ pro Szene: Router
   remotion-three / remotion-dom ─▶ npx remotion render (Format + Dauer als Props, Tapete darunter)
   hyperframes-gsap ─▶ Platzhalter füllen, Tapete als bg.png ─▶ npx hyperframes render
   manim-python ─▶ manim --transparent (Seitenverhältnis per format.cfg) ─▶ ffmpeg-Overlay auf Tapete
 ─▶ clips/<id>.mp4 (gleiches Format, 30 fps, exakte Dauer)
 ─▶ ffmpeg xfade-Kette + voice.wav/music.wav ─▶ export/<slug>.mp4 ─▶ audit/sheet_*.jpg
```

Übergänge → ffmpeg: `light-switch`/`chapter-card` = `fadeblack`, `whip-pan` = `smoothleft`, `zoom-through` = `circleopen`, `fade` = `fade`, `cut` = 1 Frame. (`zoomin` ist verboten: verpixelt sichtbar, Audit 00-beweis.)

## Formate

| | 16:9 (1920×1080) | 9:16 (1080×1920) |
|---|---|---|
| Einsatz | Video-Essay, Kapitel, längere Argumente | Short, ein Gedanke |
| Freizonen | Ränder ~5 % | oben ~12 %, unten ~20 % (Beschreibung), rechts ~12 % (Buttons) |
| Layout | Bühne breit, Vergleich nebeneinander | übereinander stapeln, Text größer (relativ zur kurzen Seite) |

Alles relativ zu `width`/`height` bzw. `__U__` (1 % der kurzen Seite) bauen; Manim über `config.frame_width/height`. Jedes Projekt hat genau ein Format.

## Bekannte Grenzen (Stand Beweistest)
- Tapeten-Motive sind prozedural (4 Stück). Echte Tapeten-/Bildtexturen nur mit freier Lizenz laden und im Skript vermerken.
- HyperFrames lädt GSAP und Google Fonts per CDN – Rendern braucht Internet.
- Manim braucht `manim-scenes/.venv` (uv) und MiKTeX unter `~/scoop/apps/miktex`.

# Asset-Protokoll & Reinheitsgebot

Quelle: `research/ultralativ-editorial-pipeline-spec.md`, Abschnitt 4. Grundsatz: **Nichts erfinden, was Ultralativ nicht auch tun würde.** `npm run ed -- check` lehnt Verstöße ab.

## Die 5 Asset-Klassen (Feld `assets` pro Szene)

Jedes sichtbare Element gehört zu genau einer Klasse:

| `class` | Was | Woher, wie | Pflichtfelder |
|---|---|---|---|
| `archiv-werk` | Gemälde, Archivfotos, Buchcover, Partituren | Suche über **Wikimedia Commons / Wikipedia / Openverse API** per Skript. Nur echte Werke mit freier Lizenz. Unter jedem Rahmen die Quellenzeile in `literary-book-serif` (z. B. „Caspar David Friedrich, ca. 1818“). | `license` (`public-domain`, `cc0`, `cc-by`, `cc-by-sa`), `caption`, `manifestId` |
| `logo-icon` | Marken-Logos, Symbol-Icons | **Nie von Hand zeichnen.** Logos: `npx hyperframes media-use resolve --type logo --entity <name>`, SimpleIcons oder Wikimedia-SVG. Icons: media-use `--type icon`, Lucide, Tabler oder Kenney. Einheitlich gestylt: cremeweiße/farbige Fläche + `drop-shadow(0 8px 16px rgba(0,0,0,0.45))`. | `source` (`simpleicons`, `wikimedia`, `media-use`, `lucide`, `tabler`, `kenney`), `manifestId` |
| `tapete` | Ornament-Tapete, Oberfläche | Nahtlos kachelbar (`remotion/shared/Wallpaper.tsx`), Papierkorn + Vignette, zwei Zustände: These (farbig) und Kritik (Anthrazit). Keine Stock-Fotos. | `wallpaper` der Szene gesetzt |
| `zitat-ui` | Zitate, Buchauszüge, UI-Nachbauten | `kind: "zitat"`: **wortwörtlich** aus echter Quelle mit Seite/Jahr, auf Papierzettel oder neben dem Buch. `kind: "ui"`: Suchleiste, Button, Terminal, Chat als **scharfe DOM-/Vektor-Komponente** (`build: "dom"`), nie als Screenshot, damit Wörter auf die Stimme einrasten. | `kind`; bei Zitat `quoteSource`, bei UI `build: "dom"` |
| `3d-requisite` | Schachfiguren, Meeples, Bücher, Staffelei, Roboter | Parametrische Three.js-Geometrie (`LatheGeometry`, `ExtrudeGeometry`) mit `MeshToonMaterial` + Papierkorn oder geprüftes CC0-GLB. Kein Plastikglanz, keine harten Glanzlichter. | `source` (`three-parametric`, `cc0-glb`) |

Ergänzung der Pipeline: `formel-graph` für LaTeX-Formeln und Graphen, nur mit `manim-python`.

## assets-manifest.json (pro Projekt)

Jedes geladene Bild, Logo oder Icon (`archiv-werk`, `logo-icon`, CC0-GLB) bekommt einen Eintrag:

```json
{"assets": [{
  "id": "friedrich-wanderer", "file": "assets/friedrich-wanderer.jpg",
  "url": "https://commons.wikimedia.org/wiki/File:…", "license": "public-domain",
  "author": "Caspar David Friedrich", "year": "ca. 1818", "resolution": "3000x3900",
  "visuallyChecked": true
}]}
```

`visuallyChecked: true` erst setzen, **nachdem** das Bild mit dem Read-Tool angesehen wurde: richtiges Motiv, nicht verpixelt, nicht kaputt, Auflösung reicht für das Format. Downloads nur mit freier Lizenz (siehe `CLAUDE.md`).

## Die 6 Verbote

1. **Keine erfundenen Zahlen, Fake-Charts oder Phantasie-Zitate.** Jede Zahl im Bild braucht in `typography[].beleg` eine Herkunft (Skriptsatz mit Quelle oder eigene Nachrechnung). Diagramme nur mit belegten Daten.
2. **Keine KI-generierten Bilder und keine Stock-Fotos.** Nur echte Quellenwerke, echte Icons/Logos oder eigene 2D/2.5D/3D-Komponenten.
3. **Keine SaaS-Dashboards, Bento-Boxen, Glas-Panels, Neon-Glows.** Gesetz der freien Bühne: Die Tapete ist ein durchgehender Raum; pro Szene **1 bis 3 fokussierte Objekte** (`focusObjects`). Eine Gruppe gleicher Objekte (z. B. ein Figurenraster) zählt als eines.
4. **Keine System-Emojis und keine selbstgekritzelten SVGs** für Gesichter, Hände, Tiere oder Logos. Dafür Klasse 1 oder 2 laden. Einfache Geometrie (Rahmen, Sprechblase, Pfeil, Achsen) darf gebaut werden.
5. **Kein Idle-Wackeln, Schweben oder Pulsieren.** Bewegung entsteht nur durch Kamera (Push-in, Isometrie-Fahrt, Whip-Pan), Licht (Spotlight an/aus, Tapete dunkelt ab, Sunburst dreht langsam) oder Einrasten auf das gesprochene Wort. GSAP-`repeat: -1`/`yoyo` sind gesperrt.
6. **Sichtprüfung jedes geladenen Assets** vor dem Rendern (Manifest, siehe oben).

## Was der Check automatisch prüft – und was nicht

Automatisch: Pflichtfelder je Klasse, Lizenzwerte, Quellenzeile, Manifest-Einträge samt Datei und Sichtprüfungs-Flag, Belege für Zahlen, `focusObjects` 1–3, Sperrwörter in allen Szenentexten (Dashboard, Bento, Glas, Neon, KI-Bild, Stock-Foto, Schweben/Wackeln/Pulsieren, Freihand), Emojis, `backdrop-filter` und Endlos-/Yoyo-Animationen im HyperFrames-/Manim-Quelltext.

Nicht automatisch, sondern im Audit mit den Augen: ob ein Zitat wirklich wortwörtlich stimmt, ob ein Bild das richtige Motiv zeigt und ob eine Remotion-Komponente heimlich wackelt. Darum gilt: Kontaktbögen vollständig ansehen.

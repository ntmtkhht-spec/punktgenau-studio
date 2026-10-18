# Asset-Protokoll & Reinheitsgebot

Quelle: `research/ultralativ-editorial-pipeline-spec.md`, Abschnitt 4. Grundsatz: **Nichts erfinden, was Ultralativ nicht auch tun würde.** `npm run ed -- check` lehnt Verstöße ab.

## Selbst bauen oder laden?

Selbst bauen ist **erlaubt und oft richtig** – eingegrenzt, nicht verboten:

| Darf selbst gebaut werden | Muss geladen werden |
|---|---|
| Diagramme mit belegten Daten, Pfeile, Rahmen, Sprechblasen, UI-Nachbauten, 3D-Requisiten, Formeln/Graphen, einfache Illustrationen (`eigene-grafik` mit `reason`) | **Logos und Marken – immer, ohne Ausnahme** (`logo-icon`, SimpleIcons/Wikimedia/media-use). Selbst gezeichnete Logos sehen falsch aus; `check` lehnt `eigene-grafik` mit „Logo/Marke/Brand“ ab. |
| | **Echte Werke, Fotos, Buchcover, historische Dokumente** (`archiv-werk`) – nie nachbauen oder generieren, weil sie als echt gezeigt werden. |
| | **Hintergrund-Tapeten & Texturen** (`tapete`) – **NIEMALS per Hand prozedural zeichnen und NIEMALS per KI generieren!** Tapeten müssen echte, hochauflösende Scans historischer Textilmuster, Holzstiche, Radierungen oder Museums-Tapeten (z. B. Met, Victoria and Albert Museum, NGA, Rijksmuseum) sein. |

> **Korrektur-Notiz & Regelhistorie (Warum anfangs prozedurale SVGs verwendet wurden):**  
> In der ersten Entwicklungsstufe wurden in `Wallpaper.tsx` vier einfache SVG-Pfad-Generatoren (`MotifTile`) als schneller Platzhalter-Fallback eingesetzt. Dies verletzte das Ultralativ-Reinheitsgebot: Die Hintergründe wirkten flach, künstlich und wie KI-/Synthetik-Muster. Alle prozeduralen SVG-Tapeten wurden daher aus dem Repo gelöscht und durch echte gemeinfreie Digitalisate in `editorial/remotion/shared/wallpapers/` ersetzt.

Faustregel für alles andere: Wenn eine einfache, saubere Form reicht, selbst bauen. Wenn es realistisch aussehen muss (Gesichter, Hände, Tiere, Fotos, historische Texturen), zwingend ein echtes Asset laden – der Agent entscheidet und begründet das in `reason`.

## Suchen und laden: `npm run ed -- assets <slug>` (Pflicht in Phase 4)

1. Im Storyboard pro Asset `manifestId` setzen und bei `archiv-werk` einen Suchbegriff `query` (englische Werktitel finden auf Commons am meisten), bei `logo-icon` den Namen `entity` (z. B. `openai`, `youtube`).
2. `npm run ed -- assets <slug>` sucht Wikimedia Commons (Fallback Openverse) bzw. SimpleIcons, lädt den besten Treffer (Lizenz wird nur protokolliert, nicht gefiltert) nach `assets/` und schreibt den Manifest-Eintrag mit `visuallyChecked: false`. Die Ausgabe listet bis zu 5 Kandidaten.
3. Jedes Bild **mit dem Read-Tool ansehen**. Falscher Treffer → `npm run ed -- assets <slug> <id>=<n>` lädt Kandidat n.
4. Erst dann `npm run ed -- approve <slug> <id>`. Ohne Freigabe blockiert `check` (und damit `scene`/`build`) das Rendern.
5. Icons, die keine Marke sind (Glühbirne, Hammer): aus Lucide/Tabler/Kenney oder media-use laden **oder** als einfache `eigene-grafik` bauen.

## Die 5 Asset-Klassen (Feld `assets` pro Szene)

Jedes sichtbare Element gehört zu genau einer Klasse:

| `class` | Was | Woher, wie | Pflichtfelder |
|---|---|---|---|
| `archiv-werk` | Gemälde, Archivfotos, Buchcover, Partituren | Suche über **Wikimedia Commons / Wikipedia / Openverse API** per Skript. Nur echte Werke; Lizenz egal, wird aber festgehalten. Unter jedem Rahmen die Quellenzeile in `literary-book-serif` (z. B. „Caspar David Friedrich, ca. 1818“). Rahmen muss ein physisch plastischer Museums-Prunkrahmen sein (`FramedArtwork.tsx`). | `license` (Text aus der Quelle, nur Protokoll), `caption`, `manifestId` |
| `logo-icon` | Marken-Logos, Symbol-Icons | **Nie von Hand zeichnen.** Logos: `npx hyperframes media-use resolve --type logo --entity <name>`, SimpleIcons oder Wikimedia-SVG. Icons: media-use `--type icon`, Lucide, Tabler oder Kenney. Einheitlich gestylt: cremeweiße/farbige Fläche + `drop-shadow(0 8px 16px rgba(0,0,0,0.45))`. | `source` (`simpleicons`, `wikimedia`, `media-use`, `lucide`, `tabler`, `kenney`), `manifestId` |
| `tapete` | Authentische historische Tapete / Oberfläche | **Keine KI-Generierung, keine prozeduralen SVGs.** Echte Museums-Digitalisate (`remotion/shared/wallpapers/`), kombiniert mit Film-/Papierkorn + Vignette/Lichtregie. Zwei kalibrierte Zustände: These (farbig getönt) und Kritik (Anthrazit `#383838`, $Y \approx 55\text{--}70$). | `wallpaper` der Szene gesetzt |
| `zitat-ui` | Zitate, Buchauszüge, UI-Nachbauten | `kind: "zitat"`: **wortwörtlich** aus echter Quelle mit Seite/Jahr, auf Papierzettel oder neben dem Buch. `kind: "ui"`: Suchleiste, Button, Terminal, Chat als **scharfe DOM-/Vektor-Komponente** (`build: "dom"`), nie als Screenshot, damit Wörter auf die Stimme einrasten. | `kind`; bei Zitat `quoteSource`, bei UI `build: "dom"` |
| `3d-requisite` | Schachfiguren, Meeples, Bücher, Staffelei, Roboter | Parametrische Three.js-Geometrie (`LatheGeometry`, `ExtrudeGeometry`) mit `MeshToonMaterial` + Papierkorn oder geprüftes CC0-GLB. Kein Plastikglanz, keine harten Glanzlichter. | `source` (`three-parametric`, `cc0-glb`) |

Ergänzungen der Pipeline: `formel-graph` für LaTeX-Formeln und Graphen (nur `manim-python`) und `eigene-grafik` für alles Selbstgebaute (Pflichtfeld `reason`).

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

`visuallyChecked: true` erst setzen, **nachdem** das Bild mit dem Read-Tool angesehen wurde: richtiges Motiv, nicht verpixelt, nicht kaputt, Auflösung reicht für das Format. Die Lizenz ist kein Ausschlusskriterium; die Verantwortung trägt der Nutzer (siehe `CLAUDE.md`).

## Die 6 Verbote

1. **Keine erfundenen Zahlen, Fake-Charts oder Phantasie-Zitate.** Jede Zahl im Bild braucht in `typography[].beleg` eine Herkunft (Skriptsatz mit Quelle oder eigene Nachrechnung). Diagramme nur mit belegten Daten.
2. **Nichts als echt ausgeben, was nicht echt ist.** Archivwerke, Fotos und Dokumente kommen aus echten Quellen. Generische Stock-Fotos vermeiden; eigene Grafiken sind erlaubt, solange sie als Grafik erkennbar sind.
3. **Keine SaaS-Dashboards, Bento-Boxen, Glas-Panels, Neon-Glows.** Gesetz der freien Bühne: Die Tapete ist ein durchgehender Raum; pro Szene **1 bis 3 fokussierte Objekte** (`focusObjects`). Eine Gruppe gleicher Objekte (z. B. ein Figurenraster) zählt als eines.
4. **Keine System-Emojis, keine selbstgebauten Logos.** Logos immer laden. Andere Formen dürfen gebaut werden (siehe oben); für realistische Motive lieber laden.
5. **Kein Idle-Wackeln, Schweben oder Pulsieren.** Bewegung entsteht nur durch Kamera (Push-in, Isometrie-Fahrt, Whip-Pan), Licht (Spotlight an/aus, Tapete dunkelt ab, Sunburst dreht langsam) oder Einrasten auf das gesprochene Wort. GSAP-`repeat: -1`/`yoyo` sind gesperrt.
6. **Sichtprüfung jedes geladenen Assets** vor dem Rendern (Manifest, siehe oben).

## Was der Check automatisch prüft – und was nicht

Automatisch: Pflichtfelder je Klasse, Lizenzangabe vorhanden (nicht deren Wert), Quellenzeile, Manifest-Einträge samt Datei und Sichtprüfungs-Flag, Belege für Zahlen, `focusObjects` 1–3, Sperrwörter in allen Szenentexten (Dashboard, Bento, Glas, Neon, Schweben/Wackeln/Pulsieren), selbstgebaute Logos (`eigene-grafik` mit Logo-Wörtern), Emojis, `backdrop-filter` und Endlos-/Yoyo-Animationen im HyperFrames-/Manim-Quelltext.

Nicht automatisch, sondern im Audit mit den Augen: ob ein Zitat wirklich wortwörtlich stimmt, ob ein Bild das richtige Motiv zeigt und ob eine Remotion-Komponente heimlich wackelt. Darum gilt: Kontaktbögen vollständig ansehen.

# Spezifikation: Szenen-unabhängige Multi-Tool-Pipeline & Ultralativ-Visual-Style

> **Wichtiger Hinweis für Claude:**
> Lies dieses Dokument vollständig durch und berücksichtige alle hier festgelegten Ergebnisse, Messdaten und Nutzer-Entscheidungen bei deinem aktuellen Umbau der Pipeline!

---

## 1. Was bereits analysiert und entschieden wurde

Das Referenzvideo **„Künstliche Intelligenz: Für euch reicht’s“** (`https://www.youtube.com/watch?v=kUuwvJfQfIk`, Kanal: *Ultralativ*, 60 FPS, 1221 s, 16:9) liegt inklusive **244 Einzel-Screenshots** und **20 Kontaktbögen** lokal vor unter:
- Video: `downloads/kUuwvJfQfIk/video.mp4`
- 244 HD-Frames (alle 5 s): `downloads/kUuwvJfQfIk/frames_interval/frame_0001.jpg` … `frame_0244.jpg`
- 20 Kontaktbögen (alle 4 s mit Zeitstempel): `downloads/kUuwvJfQfIk/contact_sheets/sheet_001.jpg` … `sheet_020.jpg`

### Verbindliche Nutzer-Entscheidungen (bereits abgestimmt):
1. **Neuer Stil / Zweiter Kanal-Modus neben `Punktgenau`**:
   - Es geht um einen **neuen visuellen Stil (angelehnt an Ultralativ)** für einen anderen YouTube-Kanal (bzw. als eigenständiger Skill/Modus neben `/punktgenau-short`, sodass bestehende Punktgenau-Videos unangetastet bleiben).
   - **Kein starres Muster**: Anders als bei `Punktgenau` (wo weißes Punktraster, flacher Look ohne Schatten/Glow/Texturen Pflicht sind) soll die KI hier **pro Szene unabhängig** über Aufbau, Dimensionalität (`2D`, `2.5D`, `3D`), Hintergrund-Textur/Beleuchtung, Charaktere, Animation und das beste Rendering-Tool entscheiden!
2. **Format-Unterstützung**:
   - Die Pipeline muss **beide Formate pro Video wählbar** unterstützen: **`16:9` Widescreen (`1920×1080`)** und **`9:16` Shorts (`1080×1920`)**.
3. **Charakter-System**:
   - Wenn eine Szene Akteure/Rollen benötigt, werden eingesetzt:
     - **Symbolische 3D-Spielfiguren (Meeples / Pawns)** mit Rollen-Labels (z. B. *Auftraggeber*, *Schöpfer*, *Nutzer*)
     - **2.5D-Roboter / System-Akteure** mit animierten Sprechblasen
     - **Gerahmte Porträts / Gemälde / Fotos** mit Spotlight-Kegeln und optionalem **Silhouetten-Publikum** am unteren Bildrand
     - **Stilisierte 2D-Comic-/Vektor-Charaktere** in Panel-Szenen
4. **Echte 3-Engine Multi-Tool-Integration (Nicht nur Remotion-Monolith!)**:
   - Alle 3 Engines sollen fest in die Pipeline integriert werden, sodass jede Szene mit dem für sie besten Tool gebaut und am Ende automatisch zu einem Gesamtvideo zusammengeführt wird:
     1. **`Remotion + @remotion/three` (Three.js / React Three Fiber)**: Für echte 3D-Isometrie-Welten, 3D-Kameraflüge, 3D-Meeple-Figuren, 2.5D-Parallax-Ebenen-Trennung im Raum und Spotlight-Galerien.
     2. **`HyperFrames` (`HTML/CSS + GSAP + Registry-Blocks`)**: Für komplexe kinetische 2.5D-Typografie (extrudierte Condensed-Schrift in schrägen Sprechblasen), Retro-CRT-Monitor-/Terminal-Simulationen (Phosphor-Glow, Scanlines, ASCII-Flowcharts), Fake-UI-Interaktionen (`Generate`-Buttons, Chat-Verläufe) und Papier-/Buch-Collagen.
     3. **`Manim` (`Python + LaTeX + SciPy`)**: Für mathematische Gleichungen, $\LaTeX$-Morphing, präzise Funktionsgraphen und Differentialgleichungen (Export mit `--transparent` als Overlay auf den Szenen-Hintergrund oder als Vollbild-Clip).
   - **Technischer Befund zu Manim (WICHTIG)**: In der globalen Python-3.13-Installation (`py`) fehlt aktuell das Modul `manim` (`No module named manim`), während `faster_whisper` dort läuft und `miktex` unter `C:\Users\ntmtk\scoop\apps\miktex` installiert ist. Richte für `manim-scenes/` eine funktionierende Python-Umgebung (z. B. via `uv` / `.venv`) ein und führe einen echten Test-Render durch!

---

## 2. Empirische Stilanalyse des Ultralativ-Videos (Was der Skill wissen muss)

### 2.1 Dynamisches Hintergrund- & Licht-System (Kein Einheits-Hintergrund!)
Pixel-Messungen über alle 6 Kapitel von `kUuwvJfQfIk` belegen:
- Jedes Kapitel hat ein eigenes **Tapeten-/Textur-Motiv** (z. B. *Birkenwald mit Sternen*, *Blätter-Muster*, *Barockes Weinlaub/Damast*, *Klassische Arkaden-Bögen*, *Vertikale Birkenstämme*).
- **Innerhalb eines Kapitels wechselt der Hintergrund szenenabhängig zwischen zwei Zuständen derselben Tapete**:
  1. **These / Positiv / Erzählung (Farbig & Hell/Warm)**: z. B. Tiefblau (`#235097`), Warm-Orange (`#e38450`, Luminanz $Y=149$), Kupfer-Rotgold (`#713f23`), Türkis/Petrol (`#1380a4`), Lachsorange (`#c37664`).
  2. **Analyse / Kritik / Dekonstruktion (Abgedunkelt & Entsättigt)**: Dieselbe Tapete schaltet (oft synchron mit einem Argumentationsbruch oder Lichtschalter-Effekt) auf **Anthrazit / Dunkel-Schiefer (`#343434` bis `#4c4c4c`, Luminanz $Y \approx 52\text{–}76$)** mit starker Vignette oder gerichteten **Spotlight-Lichtkegeln** um.

### 2.2 Die 6 visuellen Szenen-Archetypen (Auswahl pro Szene im Storyboard)
Der KI-Regie-Skill muss im Storyboard für **jede Szene einzeln** entscheiden und begründen, welcher dieser Archetypen (oder welcher zusätzliche mathematische/algorithmische Archetyp) gewählt wird:

1. **`3d-isometric-diorama`** *(Referenz: `00:00–01:10`, `frame_0003.jpg`)*
   - Echte 3D-Szene (Isometrie oder Perspektive) auf dunklem Schieferboden, Toon-/Cel-Shading mit feiner Papier-Körnung, Tilt-Shift/Depth-of-Field-Unschärfe, dynamische Kamerafahrten (z. B. Fokus auf 1 Figur $\rightarrow$ exponentieller Zoom-out auf $1000\times$ Raster).
   - **Optimales Tool**: `Remotion + @remotion/three`
2. **`2.5d-kinetic-typography`** *(Referenz: `02:32–03:12`, `16:32–17:16`, `frame_0035.jpg`)*
   - Schräg gestellte ($\approx 6^\circ\text{–}8^\circ$), 3D-extrudierte Condensed-Blockschrift mit hartem schwarzem Blockschatten auf gemusterter Tapete; Linien bauen sich um den Text zu einer Sprechblase auf; Wörter werden durchgestrichen/ersetzt (`TALENT` $\rightarrow$ `ARBEIT`).
   - **Optimales Tool**: `HyperFrames (HTML/CSS + GSAP)` oder `Remotion DOM/SVG`
3. **`gallery-spotlight-stage`** *(Referenz: `03:36–05:36`, `frame_0055.jpg`)*
   - Abgedunkelte Galerie-Tapete, physische Gold-/Holzrahmen mit feiner Serif-Quellenangabe darunter, volumetrische **Spotlight-Lichtkegel** von oben (aktives Element beleuchtet, inaktives abgedunkelt), visuelle Prozess-Vergleiche (z. B. Rausch-Diffusion mit laufender Stoppuhr `6,1 Sek.`) oder rotierende **Sunburst-Strahlen** im Hintergrund.
   - **Optimales Tool**: `Remotion` oder `HyperFrames`
4. **`2.5d-parallax-deconstruct`** *(Referenz: `05:40–06:00`, `11:24–12:40`, `19:00–19:12`, `frame_0071.jpg`)*
   - 2D-Medien (Bilder, Videos, Buchseiten, Partituren, Kommentar-Karten) werden im **echten 3D-Raum schräg gekippt und in Tiefen-Ebenen zerlegt** (z. B. Vordergrund-Person löst sich räumlich vom Bluescreen-Hintergrund; Kamera fliegt durch eine 3D-Wolke aus Zitaten mit Tiefenunschärfe).
   - **Optimales Tool**: `Remotion + @remotion/three` (oder CSS-3D-Transforms in `HyperFrames`)
5. **`symbolic-actors-collage`** *(Referenz: `07:16–09:12`, `19:24–19:50`, `frame_0095.jpg`)*
   - Taktile Objekt-Collage mit weichen Schlagschatten (`drop-shadow`), abgerissenen Papier-Zitaten, leuchtenden 3D-Icons, symbolischen **3D-Meeple-Spielfiguren** (*Schöpfer* / *Auftraggeber*) und **2.5D-Roboter-Köpfen** im Dialog über Sprechblasen.
   - **Optimales Tool**: `Remotion` / `HyperFrames`
6. **`diegetic-ui-retro`** *(Referenz: `06:24–06:34`, `12:44–13:02`, `14:00–15:34`, `frame_0172.jpg`)*
   - Diegetische Interfaces: ein physischer 80er/90er **Retro-CRT-Monitor** mit Bildschirm-Wölbung, Glas-Spiegelung, Phosphor-Bloom und animiertem ASCII-/Flussdiagramm (`ELIZA`), oder interaktive Prompt-Leisten, deren Button-Text sich im Klick-Moment verändert (`Generate` $\rightarrow$ `Verantwortung abgeben`).
   - **Optimales Tool**: `HyperFrames (GSAP + CRT/Scanline-Effects)`
7. **`math-simulation-graph`** *(Ergänzung für wissenschaftliche/mathematische Szenen)*
   - Exakte mathematische Formelumformungen ($\LaTeX$), Vektorfelder, Differentialgleichungen, Graphen-Morphing.
   - **Optimales Tool**: `Manim (Python)` (transparent gerendert und über die Szenen-Tapete gelegt).

---

## 3. Pflicht-Struktur für das Storyboard & die Pipeline

1. **Verbindlicher Storyboard-Schritt vor dem Bauen (`storyboard.md` + `storyboard.json`)**:
   - Nichts darf geraten werden. Vor dem Coden muss für **jede Szene $i$** explizit geplant und vom Nutzer freigegeben werden:
     1. **Zeitfenster & Wort-Anker**: Satz aus `script.md`, Start-/End-Zeit (`TL.lineStart(i)` / `TL.wordStart(i, k)`).
     2. **Visueller Archetyp & Dimensionalität**: `2D` / `2.5D` / `3D` + gewählter Archetyp.
     3. **Hintergrund & Beleuchtung**: Tapeten-Motiv, Farbmodus (*These/Farbig* vs. *Kritik/Dunkel*), Lichtregie (Vignette, Spotlight, Sunburst).
     4. **Charaktere / Akteure**: Keine vs. 3D-Meeple vs. 2.5D-Roboter vs. Porträt vs. Silhouetten-Publikum (mit Begründung).
     5. **Bühnen-Elemente & Typografie**: Konkrete Objekte, Rahmen, Zitate, Schrift-Stil (Condensed 3D-Block vs. Serif-Zitat vs. Monospace-Terminal).
     6. **Animations-Choreografie & Kamera**: Was passiert Sekunde für Sekunde? Welche Kamerafahrt (`push-in`, `isometric-zoom`, `whip-pan`, `3d-orbit`)?
     7. **Übergang zur Folgeszene**: `whip-pan`, `light-switch` (Tapete dunkelt ab), `zoom-through`, `chapter-card`.
     8. **Tool-Entscheidung & Begründung**: Welches Tool (`remotion-three`, `hyperframes-gsap`, `manim-python`, `remotion-dom`) baut diese Szene und **warum** ist es für genau diese Szene technisch überlegen?
2. **Modulare Szenen-Architektur & Zusammenführung**:
   - Jede Szene wird in ihrem zugewiesenen Tool gebaut/gerendert und einzeln geprüft.
   - Anschließend führt die Pipeline alle Szenen-Clips (bzw. Sub-Kompositionen) + Übergänge + Sprachspur (`voice.wav`) + Musik (`music.wav`) frame-genau zum finalen Video zusammen und erstellt die Audit-Kontaktbögen.
3. **Wissenschaftliche Verifikation (Pflicht-Test)**:
   - Repariere die Manim-Umgebung und führe einen **empirischen 3-Szenen-Beweistest** durch (Szene 1: `Remotion + Three.js`, Szene 2: `HyperFrames + GSAP`, Szene 3: `Manim + Python`), die zu einem nahtlosen Video zusammengefügt und per Kontaktbogen verifiziert werden.


---

## 4. Verbindliches Asset-Such-Protokoll & Strikte Verbotsliste („Ultralativ-Reinheitsgebot“)

> **KRITISCHE REGEL FÜR DIE KI / FÜR CLAUDE:**
> Die KI darf sich **NICHTS** für das Video ausdenken, was Ultralativ nicht auch tun würde (keine erfundenen Fakten/Zitate, keine typischen „KI-Stock-Grafiken“, keine überladenen SaaS-Dashboards, keine krumm selbstgezeichneten SVG-Kritzeleien).

### 4.1 Wie die Asset-Suche und -Auswahl in der Pipeline funktioniert (Die 5 Asset-Klassen)

Jedes visuelle Element einer Szene muss im Storyboard einer dieser **5 Asset-Klassen** zugeordnet und nach genau diesem Protokoll beschafft werden:

| Asset-Klasse | Beispiele aus dem Ultralativ-Referenzvideo (`kUuwvJfQfIk`) | Wie die Pipeline das Asset sucht, prüft & einbindet |
|---|---|---|
| **1. Historische Gemälde, Archiv-Fotos, Buchcover & Partituren** | *Caspar David Friedrich (1818)*, *Vermeer (1666)*, *Van Gogh (1888)*, *Velázquez (1656)*, *Mozart-Partitur (1787)*, *Goethes Werther (1774)*, *Schimpanse an Schreibmaschine* | **Automatisierte Suche über Wikimedia Commons API / Wikipedia API / Openverse API** (per Python/Node-Skript).<br>- **Pflicht**: Nur echte historische/reale Werke mit freier Lizenz (`Public Domain`, `CC0`, `CC-BY`).<br>- **Pflicht im Bild**: Jedes gerahmte Werk bekommt automatisch die kleine Antiqua-Quellenzeile direkt unter dem Rahmen (z. B. `Caspar David Friedrich, ca. 1818`) + Eintrag in `videos/<slug>/assets-manifest.json`. |
| **2. Offizielle Marken-Logos & Kuratierte Symbol-Icons** | *Photoshop (`Ps`)*, *Fiverr*, *OpenAI*, *YouTube*, *Kamera*, *Hammer*, *Glühbirne*, *Sparkle-Stern* | **NIEMALS Marken-Logos oder komplexe Symbole per Hand mit SVG-Pfaden raten!**<br>- **Für Marken-Logos**: Abruf über `npx hyperframes media-use resolve --type logo --entity <name> --intent "<name> logo"` oder **SimpleIcons / Wikimedia SVG**.<br>- **Für Symbol-Icons**: Abruf aus einer einheitlichen Vektor-Bibliothek (`npx hyperframes media-use resolve --type icon`, Lucide/Tabler/Kenney) + einheitliches **Ultralativ-Styling** (cremeweiße/farbige Fläche mit weichem `drop-shadow(0 8px 16px rgba(0,0,0,0.45))`). |
| **3. Hintergrund-Tapeten & Oberflächen-Texturen** | *Blätter-Tapete*, *Barockes Weinlaub/Damast*, *Birkenwald*, *Arkaden-Bögen*, *Schieferboden* | **Keine beliebigen Stock-Fotos!**<br>- Nahtlose, kachelbare Ornament-/Muster-Tapeten (`Seamless Pattern Wallpapers` in `shared/editorial/wallpapers/`), kombiniert mit feinem Papierkorn (`noise`) und radialer Vignette.<br>- Jede Tapete besitzt zwei kalibrierte Zustände: **These-Modus** (farbig/warm, Luminanz $Y \approx 100\text{–}180$) und **Kritik-/Analyse-Modus** (abgedunkelt/entsättigt auf Anthrazit `#343434`–`#4c4c4c`, Luminanz $Y \approx 50\text{–}80$). |
| **4. Zitate, Buch-Exzerpte & Diegetische UI-Nachbauten** | *Reclam-Zitat S. 49*, *ELIZA-Terminal (1966)*, *Prompt-Leiste (`Generate` $\rightarrow$ `Verantwortung abgeben`)*, *Fiverr-Chat* | - **Text-Zitate**: Werden **wortwörtlich** aus realen Quellen übernommen (mit Seiten-/Jahresangabe) und als abgerissener Papier-Zettel oder neben dem 2.5D-Buch in klassischer Serif-Schrift gesetzt.<br>- **UI-Elemente (Suchleisten, Buttons, Terminals, Chats)**: Werden **nicht** als unscharfe Browser-Screenshots eingefügt, sondern als **reduzierte, gestochen scharfe DOM/Vektor-Komponenten** gebaut, damit einzelne Wörter/Buttons synchron zur Sprache animiert werden können. |
| **5. 3D-Requisiten & Symbol-Charaktere** | *3D-Schachbrett & Figuren*, *3D-Meeple/Spielfigur*, *2.5D-Roboter*, *Staffelei*, *3D-Buch* | - Entweder als präzise parametrische Three.js-Geometrien (`LatheGeometry` für Schachfiguren/Meeples, `ExtrudeGeometry` für 3D-Bücher/Text) mit **flachem Toon-/Cel-Shading (`MeshToonMaterial`) + Papier-Textur**, oder als geprüfte CC0-GLB-Modelle.<br>- **Verbot von Plastik-Glanz**: Keine unnatürlichen Specular-Highlights; immer gedämpfter Editorial-Look. |

---

### 4.2 Strikte Verbotsliste: Was sich die KI NIEMALS ausdenken oder einbauen darf!

Bei jedem Storyboard-Entwurf und jedem Szenen-Render gilt diese **harte Sperrliste** (Verstoß = Storyboard wird abgelehnt):

1. **KEINE erfundenen Zahlen, Fake-Charts oder Phantasie-Zitate**:
   - Wenn das Skript keine belegte Statistik nennt, darf die KI **niemals** ein Diagramm mit erfundenen Kurven/Balken („Kreativität sinkt um 73 %“) oder ein ausgedachtes Zitat erfinden.
2. **KEINE KI-generierten Bilder (AI-Slop) oder Stock-Fotos**:
   - Ultralativ nutzt 0 % KI-generierte Deko-Bilder. Es werden ausschließlich echte historische/reale Quellenwerke (mit Quellenangabe), echte Vektor-Icons/Logos oder unsere eigenen 2D/2.5D/3D-Komponenten verwendet.
3. **KEINE SaaS-Dashboards, Bento-Boxen, Glas-Panels oder Neon-Glows**:
   - KI-Modelle neigen dazu, Bildschirme in 4–6 abgerundete Kästchen (`border-radius: 16px`, `backdrop-filter: blur`, Neon-Verläufe) aufzuteilen. **Das macht Ultralativ NIE!**
   - **Gesetz der freien Bühne**: Die Tapete ist ein durchgehender Raum. Pro Szene stehen dort **maximal 1 bis 3 klar fokussierte Objekte** (z. B. 2 Bilderrahmen im Vergleich, 1 Sprechblase, 1 CRT-Monitor oder 1 Bilderrahmen + 1 Spielfigur + 1 Roboter).
4. **KEINE System-Emojis (`🤖`, `💡`, `🎨`) und KEINE selbstgekritzelten Freihand-SVGs**:
   - Emojis aus der Systemschriftart sind streng verboten. Ebenso darf die KI niemals versuchen, komplexe organische Objekte (Gesichter, Hände, Tiere, Markenlogos) mit ein paar eigenen `<path>`-Befehlen zu „malen“. Dafür müssen zwingend echte Assets aus Klasse 1 oder 2 geladen werden!
5. **KEINE sinnlosen Dauer-Wackel-Animationen (Idle-Floating / Pulsieren)**:
   - Bei Ultralativ wabern oder pulsieren Elemente niemals grundlos. Bewegung entsteht ausschließlich durch:
     - **Kamera-Führung** (langsamer Push-In, Isometrie-Fahrt, Reißschwenk/Whip-Pan zur nächsten Szene),
     - **Licht-Regie** (Spotlight-Kegel schaltet an/aus, Tapete dunkelt bei Kritik schlagartig ab, Sunburst-Strahlen drehen sich langsam),
     - **Präzises Wort-Einrasten** (Elemente, Stempel, Sprechblasen oder Buchstaben rasten exakt auf das gesprochene Wort ein).
6. **Visuelle Prüfschleife für jedes heruntergeladene Asset**:
   - Jedes per Skript geladene Bild/Icon/Logo muss in `videos/<slug>/assets-manifest.json` (mit URL, Lizenz, Urheber/Jahr, Auflösung) protokolliert und vor dem Rendern einmal per `view_file` visuell kontrolliert werden, damit niemals ein kaputtes, falsches oder verpixeltes Bild im Video landet.


---

## 5. Eigener Skill für die Schriftart-Auswahl: `/editorial-typography` (`.claude/skills/editorial-typography/SKILL.md`)

Anhand von 12 hochauflösenden Typografie-Frames aus `kUuwvJfQfIk` (`frame_0021.jpg`, `frame_0028.jpg`, `frame_0029.jpg`, `frame_0035.jpg`, `frame_0055.jpg`, `frame_0061.jpg`, `frame_0090.jpg`, `frame_0102.jpg`, `frame_0123.jpg`, `frame_0150.jpg`, `frame_0206.jpg`, `frame_0221.jpg`) wurde der eigenständige Skill **`.claude/skills/editorial-typography/SKILL.md`** erstellt.

### Wichtigste empirische Erkenntnis für die Pipeline:
Ultralativ nutzt **NIEMALS** eine Standard-Sans-Serif (`Inter`, `Arial`, `Roboto`) für Überschriften, Kapitel-Titel, Thesen oder Zitate!
Stattdessen arbeitet das System mit **7 streng getrennten Schrift-Rollen**, aus denen der Skill pro Szene und pro Textelement im Storyboard die exakte Schriftart auswählt und begründet:

1. **`editorial-didone`** (`Playfair Display` / `Bodoni Moda` + `Cormorant Garamond` für Ultra-Light Sublines):
   - Für Kapitel-Trenner (`frame_0029.jpg`: `KAPITEL I:` in Bold Uppercase + `Mühelose Exzellenz` in Ultra-Light Didone), zentrale Thesen-Fragen (`frame_0028.jpg`), Kernaussagen (`frame_0102.jpg`: `UMSETZUNGS-AUTOMAT`) und Figuren-Labels (`Schöpfer` / `Auftraggeber`).
2. **`tall-condensed-serif`** (`Prata` / `DM Serif Display` mit `scaleX(0.74)` / `Instrument Serif`):
   - Für monumentale, oft um `-6deg` geneigte und 3D-extrudierte Leitbegriffe (`frame_0061.jpg`: `MÜHELOSE EXZELLENZ`, `frame_0221.jpg`: `ÖKONOMIE` mit Gold-Creme-Verlauf, `frame_0206.jpg`: `TALENT` $\rightarrow$ `ARBEIT`, `frame_0021.jpg`: `Na ja, für euch reicht's.`).
3. **`heavy-plakat-grotesk`** (`Anton` / `Bebas Neue` / `Oswald Heavy`):
   - Für laute gesellschaftliche Buzzwords in schrägen 2.5D-Sprechblasen (`frame_0035.jpg`: `PARADIGMENWECHSEL` in Kaminrot `#a51c1c` mit harter schwarzer 3D-Block-Extrusion; Dachzeile darüber immer in `editorial-didone italic`).
4. **`literary-book-serif`** (`Cormorant Garamond Italic` / `EB Garamond` / `Lora`):
   - Für mehrzeilige wörtliche Buchzitate frei vor der Tapete (`frame_0150.jpg`), für Sätze in beigen Argument-Sprechblasen (`frame_0206.jpg`) und für die kleine Museums-Quellenzeile direkt unter jedem Bilderrahmen (`frame_0055.jpg`).
5. **`typewriter-archival`** (`Special Elite` / `Courier Prime`):
   - Für historische Zitate und Zeitungs-/Akten-Ausschnitte auf abgerissenem Papier (`frame_0090.jpg`: Kaiser Wilhelm II. über das Auto).
6. **`retro-crt-terminal`** (`VT323` / `IBM Plex Mono`):
   - Für Terminal-Bildschirme, ASCII-Art und algorithmische Flussdiagramme auf dem Retro-CRT-Monitor (`frame_0172.jpg`: `ELIZA, 1966`).
7. **`diegetic-ui-sans`** (`Inter` / `DM Sans`):
   - **AUSSCHLIESSLICH** für nachgebaute moderne App-Interfaces (Prompt-Suchfeld, `Generate`-Button, Fiverr-Chat) und trockene 1-Satz-Roboter-Sprechblasen (`Kein Plan, lol.`). Streng verboten für Bühnen-Titel oder Thesen!

> **Integrationspflicht**: Der Haupt-Video-Skill muss bei der Erstellung des Storyboards (und beim Bauen der Szenen) zwingend `.claude/skills/editorial-typography/SKILL.md` laden und für jedes Text-Element die gewählte Schrift-Rolle (`1–7`), die Font-Family und das Schatten-/3D-Treatment im Storyboard dokumentieren!

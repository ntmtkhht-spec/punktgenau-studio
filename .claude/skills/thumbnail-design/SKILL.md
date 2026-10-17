---
name: thumbnail-design
description: "Deterministischer Thumbnail-Design- & Audit-Skill für beide Kanäle: (A) Punktgenau (nach empirischem Vorbild von @100SekundenPhysik) und (B) Editorial / Ultralativ (nach empirischem Vorbild von @Ultralativ). Steuert Archetyp-Auswahl, Typografie-Kopplung (/editorial-typography), Asset-Suche, Anti-Slop-Verbote und wissenschaftliche Feed-Size-Prüfung."
---

# Thumbnail Design & Verification Skill (`/thumbnail-design`)

Du bist der **Thumbnail Art Director** für das Video-Studio. Ein Thumbnail ist **kein verkleinertes Video-Standbild** und **kein vollgeschriebenes Text-Poster**, sondern ein eigenständiges visuelles Artefakt, das in **unter 0,5 Sekunden auf Feed-Größe (`320×180` bzw. `270×480`)** eine kognitive Lücke (Curiosity Gap) öffnet.

Dieser Skill basiert auf einer **empirischen Pixel-, Kontrast- und Archetypen-Analyse** von:
- **12 Widescreen- + 5 Shorts-Thumbnails von `@100SekundenPhysik`** (`downloads/thumbnails/100sek_grid.jpg`, `downloads/thumbnails/100sek_shorts_grid.jpg`) → Vorbild für **Modus A (`Punktgenau`)**
- **12 Widescreen-Thumbnails von `@Ultralativ`** (`downloads/thumbnails/ultralativ_grid.jpg`) → Vorbild für **Modus B (`Editorial / Ultralativ`)**

---

## 1. Empirische Basis: Was unterscheidet beide Kanäle messbar?

| Messgröße / Merkmal | Modus A: `Punktgenau` (`@100SekundenPhysik`) | Modus B: `Editorial` (`@Ultralativ`) |
|---|---|---|
| **Mittlere Luminanz ($Y$)** | **High-Key Hell**: $Y = 220\text{–}242$ (`#dfdfdd` bis `#f1f1f1`) in 11 von 12 Thumbnails (Ausnahme: 3D-Simulationsboden $Y = 173$) | **Mid-to-Dark Saturated / Textured**: $Y = 75\text{–}159$ (`#2c5163`, `#505e48`, `#905443`, `#1a1d24`) |
| **Luminanz-Kontrast ($\sigma$)** | $\sigma = 48\text{–}80$ (harte schwarze Outlines `#111111` + 1 gesättigter Farb-Fokus auf hellem Grund) | $\sigma = 60\text{–}92.5$ (extreme Hell-Dunkel-Spannung durch Spotlight, Goldrahmen, 3D-Block-Schatten) |
| **Wortanzahl im Thumbnail** | **0 bis 4 Wörter Maximum!** (4/12 haben **0 Wörter**, 6/12 haben **2–3 Wörter** wie `Warum überlebt er?`, `Plötzlich lebt es!`, `ERROR`) | **0 bis 3 Wörter Monumental-Typografie!** (`AI\|RT`, `DAS INTERNET / EINE ZUMUTUNG`, `MINDSET`, `Chatbot LIEBE`, `MUSKs TWITTER`, `AllesGPT`) |
| **Typografie-System** | Clean Geometric/Humanist Sans-Serif ExtraBold (`Inter` / `Rubik` / `Montserrat`, Weight `800–900`), flach `#111111` oder 1 Akzentwort | `/editorial-typography` Display-Rollen (`tall-condensed-serif`, `heavy-plakat-grotesk`, `editorial-didone`) mit **3D-Extrusion, Gold-Bevel oder hartem Schlagschatten** |
| **Visueller Kern** | **1 Paradox-Szene, Strichmännchen-Reaktion oder visuelle Gleichung** (`∞ > ∞`) auf freigestellter heller Bühne | **Visuelles Wortspiel, Collage-Mashup, Diegetic Retro-UI oder Symbol-Silhouette** auf strukturierter Bühne |

---

## 2. Modus A: `Punktgenau` Thumbnail-System (Vorbild: `@100SekundenPhysik`)

### 2.1 Die 4 erlaubten Archetypen für `Punktgenau`
Jedes `Punktgenau`-Thumbnail MUSS exakt einem dieser 4 empirisch nachgewiesenen Archetypen aus `downloads/thumbnails/100sek_grid.jpg` folgen:

1. **`paradox-stick-reaction` (Die Paradox-Szene mit Figur)**
   - *Referenz*: `06_P3df1-4219U` (gebrochene Uhr + geschockte Figur), `09_7hM_vdeL-fI` (Schildkröte jagt Läufer), `12_rho6HLrU5ro` (Figur blickt in Spiegel und sieht grünes Alien).
   - *Aufbau*: Heller Canvas (`#F4F4F1` bis `#FFFFFF` mit minimalem radialem Vignette-Verlauf), 1–2 klare Vektor-Figuren mit starken schwarzen Outlines (`strokeWidth: 4–6px`, `#111111`) und 1 farbig hervorgehobenes Paradox-Objekt.
   - *Text*: 0 bis 3 Wörter oben (`Warum...`, `Plötzlich lebt es!`) oder komplett textfrei, wenn die Bild-Pointe selbsterklärend ist.

2. **`visual-equation-diagram` (Die visuelle Gleichung / Achsen-Anomalie)**
   - *Referenz*: `05_f1tX2E_b1bU` (`∞ > ∞` mit Krone + `Super-Unendlich`), `08_5e-zB2qCgWI` (3D-Koordinatenachsen `1, 2, 3` auf Perspektiv-Grid + `Warum genau 3?`), `10_vX8tC-18-hU` (`X ➔ Atom`).
   - *Aufbau*: Ein mathematisches oder physikalisches Symbol wird durch ein einziges visuelles Detail (Krone auf dem zweiten $\infty$, durchgestrichenes Symbol, rot markierte Achse) sofort als Rätsel lesbar.
   - *Verbot*: Keine komplexen Formeln wie $\sum_{n=1}^{\infty} (1/2)^n = 1$ in kleiner Schrift! Nur 1 riesige, aus 2 Metern lesbare Relation.

3. **`single-word-error-state` (Der Systemfehler / Objekt-Kollaps)**
   - *Referenz*: `04_x_ZhqjbgdAQ` (rauchender Roboter hält Blatt Papier + riesiges Wort `ERROR`), `03_Wiederholt_sich_alles` (Sanduhr mit Universum).
   - *Aufbau*: Zentrales Hero-Objekt im Zustand der Überlastung (Rauch, Riss, glühender Kern) + maximal 1 einzelnes Signalwort (`ERROR`, `UNMÖGLICH`, `STOPP`).

4. **`isometric-grid-outlier` (Der Ausreißer in der Menge)**
   - *Referenz*: `01_g-g-NdyYwsY` (Raster aus grünen Zombie-Figuren vs. 1 einzelne beige Figur im roten Quadrat + roter Pfeil + `Warum überlebt er?`).
   - *Aufbau*: 3D- oder 2.5D-Isometrie-Ansicht einer großen Gruppe gleichartiger Elemente, in der **genau 1 Element** durch Farbe + Rahmen/Pfeil als Ausreißer markiert ist.

### 2.2 Punktgenau-Farb-, Typografie- & Layout-Gesetze
- **Hintergrund**: Immer High-Key Hell (`#F3F3F0` bis `#FFFFFF`, $Y \ge 215$). Keine dunklen Boxen oder schwere Text-Banner!
- **Schriftart**: `Inter` / `Rubik` (`fontWeight: 800` oder `900`), Tracking `-0.03em`.
- **Wortlimit**: **Maximal 4 Wörter** (Ideal: 0–3 Wörter). Ein Satz wie *"Du erreichst diese Tür nie"* (5 Wörter) + zusätzliche Gleichung unten ist **zu textlastig** im Vergleich zu `@100SekundenPhysik`. Besser: Nur die visuelle Szene (Läufer + Schildkröte / Tür mit $\infty$-Schloss) + `Unmöglich?` oder `0 Wörter`.
- **Linien & Outlines**: Alle Vektor-Objekte und Figuren im Thumbnail brauchen durchgehende, kräftige Outlines (`#111111`, `4px–8px`), damit sie sich wie bei `@100SekundenPhysik` glasklar vom weißen Hintergrund abheben.

---

## 3. Modus B: `Editorial / Ultralativ` Thumbnail-System (Vorbild: `@Ultralativ`)

### 3.1 Die 5 erlaubten Archetypen für `Editorial / Ultralativ`
Jedes `Editorial`-Thumbnail MUSS exakt einem dieser 5 empirisch nachgewiesenen Archetypen aus `downloads/thumbnails/ultralativ_grid.jpg` folgen:

1. **`conceptual-split-pun` (Der 50/50 Konzept-Split)**
   - *Referenz*: `01_kUuwvJfQfIk` (*"Künstliche Intelligenz: Für euch reicht's"* → Links kaltes graues Programmfenster `Umsetzungsautomat.exe` mit 3D-Buchstaben `AI`, rechts echter goldener Museumsrahmen mit bunten Regenbogen-3D-Buchstaben `RT` → zusammen `ART` / `AI`).
   - *Aufbau*: Exakter vertikaler oder diagonaler Schnitt (`50/50`), der zwei Welten kollidieren lässt (Kalt/Maschine vs. Warm/Kultur, Alt vs. Neu, Versprechen vs. Realität).
   - *Text*: Das Wortspiel **ist** das Motiv (2–6 Buchstaben riesig in der Mitte). Kein zusätzlicher Untertitel nötig!

2. **`diegetic-ui-overload` (Retro-OS Collage + 3D-Monument-Titel)**
   - *Referenz*: `02_ZxELGk76ngc` (*"DAS INTERNET: EINE ZUMUTUNG"* → Gestapelte Windows-95-Dialogfenster im Hintergrund, darüber diagonal um `-6°` gekippte riesige 3D-Block-Typografie mit hartem schwarzem Extrusions-Schatten).
   - *Aufbau*: 3–5 echte oder präzise nachgebaute UI-Fenster (Win95, Terminal, Browser-Fehlermeldungen) als strukturierte Hintergrund-Collage (`brightness(0.75)`), darüber ein massiver zweizeiliger 3D-Textblock (`tall-condensed-serif` + `heavy-plakat-grotesk`).

3. **`symbolic-metaphor-contrast` (Symbol-Silhouette / Mechanische Metapher)**
   - *Referenz*: `03_r_p2-K9c-bI` (*"GEFAHR: SOCIAL MEDIA"* → Schwarze Kopf-Silhouette mit iOS-Toggle-Switch im Gehirn auf rotem Grund), `04_MINDSET` (Goldene Menschenmenge formt Fabrik-Rauchwolke), `05_Chatbot_LIEBE` (Menschliche Hand vs. Roboterhand vor diagonal geteiltem Rot/Schwarz-Hintergrund).
   - *Aufbau*: 1 ikonische Silhouette oder 2 kollidierende Hände/Symbole auf einem tief gesättigten Zweifarb-Hintergrund (Karmesinrot `#A31621`, Tiefschwarz `#121316`, Petrol `#1D3547`), gekrönt von 1–2 extrem starken Wörtern.

4. **`cutout-portrait-mashup` (Freigestelltes Porträt + Objekt-/Papier-Eingriff)**
   - *Referenz*: `07_MUSKs_TWITTER` & `12_MUSKs_TWITTER_2` (Halftone-/Duotone-Porträt von Elon Musk kombiniert mit brennender Papierkante bzw. Uhr-Zifferblatt + `X`-Logo + `MUSKs TWITTER` in Didone-Serif), `06_Fehlzündung` (Porträt + brennendes Auto).
   - *Aufbau*: Echte historische oder zeitgenössische Person (via Wikimedia Commons Public Domain / CC) als scharfer Cutout mit gezieltem Editorial-Effekt (Halftone-Raster, Papier-Abrisskante, Spotlight-Kegel), kombiniert mit 1 symbolischen Objekt (Uhr, Flamme, Aktenordner).

5. **`emblem-medallion-centerpiece` (Das mystische / korporative Zentral-Emblem)**
   - *Referenz*: `08_DIE_NEUE_ESOTERIK` (Goldenes Medaillon auf dunkelgrünem Okkult-Sternen-Wandteppich), `09_AllesGPT` (Aufgebrochene OpenAI-Weltkugel vor Sternenhimmel mit riesigem `AllesGPT`-Schriftzug).
   - *Aufbau*: Streng achsensymmetrisches Zentralmotiv (Logo-Kugel, Wappen, Siegel, Bilderrahmen) vor einem reichhaltigen Textur-Hintergrund (Damast, Sternenhimmel, Marmor), durchbrochen von großer Serif- oder Grotesk-Typografie im unteren Drittel.

### 3.2 Kopplung an `/editorial-typography` (Pflicht!)
Für jedes `Editorial`-Thumbnail MUSS eine der folgenden Schrift-Kombinationen aus `.claude/skills/editorial-typography/SKILL.md` gewählt werden:
- **Kombination 1 (Plakat-Block)**: Zeile 1 in `tall-condensed-serif` (`Instrument Serif` / `Bodoni Moda Condensed`) + Zeile 2 in `heavy-plakat-grotesk` (`Syne` / `Space Grotesk` / `Arial Black`), beide mit **hartem 3D-Block-Extrusions-Schatten** (`12px–24px` in `#0A0A0C`) und leichter Rotation (`-5°` bis `-7°`).
- **Kombination 2 (Klassisches Essay-Cover)**: `editorial-didone` (`Playfair Display` / `Bodoni Moda`, Weight `800–900`) in gebrochenem Weiß (`#F4F1EA`) oder Gold-Verlauf (`#F5D061` → `#C28E26`) mit tiefem Drop-Shadow (`0 12px 24px rgba(0,0,0,0.85)`).
- **Kombination 3 (Stilbruch / Kontrast-Duo)**: 1 technisches Wort in `typewriter-archival` oder `diegetic-ui-sans` (`Chatbot`) + 1 emotionales Wort in expressiver Display-/Script-Schrift (`LIEBE`).

---

## 4. Asset-Suche & Auswahl-Protokoll für Thumbnails

Genau wie im Video darf die KI im Thumbnail **nichts generisch zusammenfantasieren**. Jedes Bildelement im Thumbnail stammt aus einer dieser **5 verifizierten Asset-Quellen**:

| Asset-Typ im Thumbnail | Woher wird es bezogen / wie wird es gebaut? | Pflicht-Nachbearbeitung (Treatment) |
|---|---|---|
| **1. Echte Gemälde, Statuen & Porträts** | `npm run ed -- assets <slug>` mit `query` (Wikimedia Commons / Openverse), danach Sichtprüfung + `ed approve` | Scharfer Cutout (`drop-shadow`), Bilderrahmen (Gold/Holz) oder Halftone-/Duotone-Kontrast |
| **2. Offizielle Tech-/Marken-Logos** | `npm run ed -- assets <slug>` mit `entity` (SimpleIcons) oder `npx hyperframes media-use resolve --type logo` – nie selbst zeichnen | Als 3D-extrudiertes Objekt, Siegel, Stempel oder im Zifferblatt/Monitor eingebettet (nie einfach flach in die Ecke geklebt) |
| **3. Diegetische UI-Fenster** | Programmierte SVG/HTML-Komponenten (`Win95Window`, `CRTMonitor`, `ErrorDialog`) | Echte System-Rahmen (`#C0C0C0` Bevel), Pixel-Icons, niemals verschwommene Screenshots |
| **4. Hintergrund-Texturen** | Prozedurale SVG-Filter (`feTurbulence` Noise, Halftone-Pattern, Damast-Tapete, Schachbrett-Boden) oder CC0-Texturen | Abgedunkelt (`brightness(0.45–0.75)`) + starker radialer Spotlight-Kegel auf das Hero-Objekt |
| **5. Hero-Vektoren & 3D-Objekte** | Remotion Three.js (`Meeple`, `3DTextExtrude`, `Chessboard`) oder handgebaute SVG-Paradox-Objekte | In Modus A: `#111111` Outline (`4–6px`). In Modus B: Plastisches Shading / Gold- oder Metall-Material |

---

## 5. Strikte Anti-Slop-Verbote für Thumbnails (Was NIEMALS gemacht werden darf)

1. **KEIN AI-Image-Generator-Slop (Kein Midjourney/DALL-E-Plastik-Look)**:
   - Weder `@Ultralativ` noch `@100SekundenPhysik` benutzen vollflächige KI-generierte Fantasy-Bilder mit glänzender Plastik-Haut, 6 Fingern oder unleserlichem KI-Textsalat.
2. **KEINE Text-Romane (> 4 Wörter sind verboten!)**:
   - Wenn ein Thumbnail mehr als 4 Wörter hat (Ausnahme: winziger diegetischer Fenstertitel wie `Umsetzungsautomat.exe`, der nicht gelesen werden muss), fällt es durch das Audit!
   - Niemals den Video-Titel 1:1 ins Thumbnail kopieren. Titel und Thumbnail ergänzen sich!
3. **KEINE kleinen Beschriftungen, Achsen-Zahlenkolonnen oder Fußnoten**:
   - In `zeno/Thumbnail.tsx` war unten eine kleine Gleichung `1/2 + 1/4 + 1/8 + ... = 1` in `34px` eingebaut. Auf Smartphone-Feed-Größe (`168×94`) ist alles unter `90px` (bei `1920×1080`) unlesbarer Matsch!
   - **Gesetz**: Jedes lesbare Text-Element im Thumbnail MUSS mindestens **`110px` bis `260px` Schriftgröße** (auf `1920×1080` Canvas) haben.
4. **KEIN "Rechts-Unten-Todeszonen"-Fehler (`Bottom-Right Timestamp Collision`)**:
   - Bei `16:9` Widescreen-Thumbnails überdeckt YouTube die untere rechte Ecke (`x: 1580–1900, y: 920–1060`) mit dem schwarzen Zeitstempel-Badge (`20:21`). Dort darf NIEMALS Text oder ein entscheidendes Bildelement liegen!
5. **KEINE unruhigen Multi-Box-Layouts**:
   - Maximal **2 visuelle Fokus-Elemente** im gesamten Thumbnail (z. B. `1 Hero-Objekt/Split + 1 Monumental-Schriftzug` oder `1 Figur + 1 Paradox-Objekt`).

---

## 6. Pflicht-Workflow & Wissenschaftlicher Verifikations-Test (`thumbnail-audit`)

Jede Thumbnail-Erstellung durchläuft zwingend diese **4 Schritte**:

### Schritt 1: 3 Konzepte im Storyboard vorschlagen (Vor dem Coden!)
Bevor Code geschrieben wird, erstelle in `thumbnail-plan.json` (bzw. im Storyboard) **3 unterschiedliche Thumbnail-Entwürfe** aus verschiedenen Archetypen des gewählten Kanal-Modus:
```json
{
  "channelMode": "editorial",
  "aspectRatio": "16:9",
  "videoTitle": "Künstliche Intelligenz: Für euch reicht's",
  "concepts": [
    {
      "id": "concept-1",
      "archetype": "conceptual-split-pun",
      "text": "AI | RT",
      "wordCount": 2,
      "typographyRole": "heavy-plakat-grotesk",
      "typographyTreatment": "3d-extrude-split-grey-vs-rainbow",
      "heroAssets": ["Win95 Window Umsetzungsautomat.exe", "Gold Museum Frame (Wikimedia CC0)"],
      "curiosityGap": "Ist KI das Ende der Kunst oder nur ein billiger Umsetzungsautomat?"
    }
  ],
  "selectedConcept": "concept-1"
}
```

### Schritt 2: Umsetzung als dedizierte Komponente (`Thumbnail.tsx` oder HyperFrames `thumbnail.html`)
- Für `16:9` Widescreen: `1920×1080` (`Still` in Remotion oder Single-Frame in HyperFrames)
- Für `9:16` Shorts: `1080×1920` (mit sicherer Zone für das Shorts-Titel-Overlay im unteren Viertel `y: 1450–1920`!)

### Schritt 3: Render in Originalgröße + Feed-Größe (`thumbnail-test`)
Automatisch über `npm run pg -- thumbnail <slug>` (Punktgenau, aus `remotion-shorts/`) bzw. `npm run ed -- thumbnail <slug>` (Editorial, aus `editorial/`): prüft `thumbnail-plan.json`, rendert, erzeugt Feed-Testbild und Sperrzonen-Bild und misst Y/σ (`thumbnail/audit.json`). Manuell entspricht das:
Rendere das Thumbnail immer in **zwei Auflösungen**:
1. `thumbnail_full.png` (`1920×1080` bzw. `1080×1920`)
2. `thumbnail_feed_test.png` (herunterskaliert mit FFmpeg auf **`320×180`** bei 16:9 bzw. **`270×480`** bei 9:16):
   ```bash
   ffmpeg -y -i thumbnail_full.png -vf "scale=320:180" thumbnail_feed_test.png
   ```

### Schritt 4: Wissenschaftliches Thumbnail-Audit (Alle 6 Checks müssen `PASS` sein)
Prüfe beide gerenderten Bilder visuell (`Read` / `view_file`) und rechnerisch:
- [ ] **Check 1 (Wortlimit)**: Hat das Thumbnail $\le 4$ Wörter (Modus A) bzw. $\le 3$ Wörter (Modus B)?
- [ ] **Check 2 (Luminanz & Kontrast)**:
  - Modus A (`Punktgenau`): Ist die mittlere Luminanz $Y \ge 210$ (heller Hintergrund) und $\sigma \ge 45$?
  - Modus B (`Editorial`): Ist die Kontrast-Standardabweichung $\sigma \ge 60$?
- [ ] **Check 3 (Feed-Größen-Lesbarkeit)**: Ist der Text und das Hero-Objekt auf `thumbnail_feed_test.png` (`320×180`) in unter 0,5 Sekunden ohne Heranzoomen glasklar erkennbar?
- [ ] **Check 4 (Minimale Schriftgröße)**: Ist jede lesbare Schrift $\ge 110\text{px}$ hoch (keine kleinen Formeln oder Untertitel)?
- [ ] **Check 5 (Safe-Zone / Timestamp)**: Ist die rechte untere Ecke (`16:9`: `x > 1580, y > 920`) bzw. das untere Viertel (`9:16`: `y > 1450`) frei von wichtigem Text?
- [ ] **Check 6 (Kanal-Authentizität / Anti-Slop)**: Wurde exakt einer der 4 (`Punktgenau`) bzw. 5 (`Editorial`) empirischen Archetypen verwendet und auf KI-Plastikbilder verzichtet?

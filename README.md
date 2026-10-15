# Punktgenau – YouTube-Shorts-Studio

Werkzeugkette für den deutschen Shorts-Kanal **Punktgenau** (Physik, Informatik, Mathe für Laien).
Videos werden mit [Remotion](https://www.remotion.dev/) als Code gebaut, die Stimme wird per Whisper
wortgenau getaktet, und jedes fertige Rendering erscheint automatisch im Browser.

## Installation

### 1. Voraussetzungen

| Programm | Version | Zweck |
|---|---|---|
| [Node.js](https://nodejs.org/) | 20 oder neuer | Remotion, `pg`-Befehle |
| [Python](https://www.python.org/) | 3.10 oder neuer | Whisper-Wortzeiten, Musik |
| [FFmpeg](https://ffmpeg.org/) | aktuell, im `PATH` | Tonspur, Audit-Bilder |
| [Git](https://git-scm.com/) | – | Klonen |
| [Claude Code](https://claude.com/claude-code) | optional | Skill `/punktgenau-short` |

Windows (mit winget):

```bash
winget install OpenJS.NodeJS.LTS Python.Python.3.12 Gyan.FFmpeg Git.Git
```

macOS (mit Homebrew):

```bash
brew install node python ffmpeg git
```

### 2. Projekt holen und einrichten

```bash
git clone https://github.com/ntmtkhht-spec/punktgenau-studio.git
cd punktgenau-studio
pip install -r requirements.txt
cd remotion-shorts
npm install
npm run typecheck
```

Beim ersten `voice`-Lauf lädt `faster-whisper` sein Sprachmodell (einmalig, einige hundert MB).

## Ablauf eines Videos

Alle Befehle aus `remotion-shorts/`:

```bash
npm run pg -- new 04-monty-hall "Das Ziegenproblem"   # Video anlegen
npm run pg -- words 04-monty-hall                     # Vorschau-Timing ohne Stimme
npm run studio                                        # Szenen bauen, live ansehen
npm run pg -- voice 04-monty-hall                     # Stimme (videos/<slug>/voice/audio1.mp3 …) + Musik
npm run pg -- audit 04-monty-hall                     # Kontaktbögen prüfen
npm run pg -- render 04-monty-hall                    # Finales MP4 + Browser-Vorschau
```

Mit Claude Code geht das Ganze geführt über den Skill **`/punktgenau-short`** (Thema → Skript → Szenen → Stimme → Render).

## Browser-Vorschau nach dem Rendern

`npm run pg -- render <slug>` zeigt das fertige Video sofort im Browser:

- **Erstes Rendering:** Ein lokaler Vorschau-Server startet im Hintergrund (`http://localhost:4747`) und öffnet einen Tab.
- **Jedes weitere Rendering:** Der bereits offene Tab lädt das neue Video automatisch nach – es geht **kein neues Fenster** auf.
  Erst wenn der Tab geschlossen wurde, öffnet sich wieder einer.

Weitere Optionen:

```bash
npm run pg -- preview <slug>             # letzten Export erneut zeigen
npm run pg -- render <slug> --no-preview # ohne Browser rendern
```

Anderer Port: Umgebungsvariable `PG_PREVIEW_PORT` setzen. Der Server lauscht nur auf `127.0.0.1`.

## Ordner

| Pfad | Inhalt |
|---|---|
| `videos/<slug>/` | Skript, Sprachaufnahmen, Audit, Export je Video |
| `remotion-shorts/src/videos/<slug>/` | Szenen-Code (`Video.tsx`), Wortzeiten, Metadaten |
| `remotion-shorts/src/shared/` | Gemeinsamer Stil: Farben, Schrift, Captions, Punktraster, Timeline |
| `scripts/` | `pg.mjs` (CLI), Vorschau-Server, Whisper, Musik-Generator, Vorlagen |
| `branding/` | Logo, Banner, Profilbild |
| `.claude/skills/punktgenau-short/` | Claude-Code-Skill für den Gesamtablauf |
| `CLAUDE.md` | Verbindliche Stil- und Layoutregeln |

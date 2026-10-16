---
name: punktgenau-longform
description: Erstellt ein Longform-Skript (ca. 6–15 Minuten) für Punktgenau nach dem Vorbild eines bestehenden YouTube-Videos – Download, Transkript, Aufbau-Analyse, eigenes Skript im gleichen Aufbau. Nutzen, wenn der Nutzer ein YouTube-Video als Vorlage für ein längeres Video gibt.
---

# Punktgenau-Longform nach Vorlage

Longform ist **kein** Short. `content-principles` und die Short-Regeln aus `CLAUDE.md` (150 Wörter, Loop, Hook in 3 Sekunden) gelten hier **nicht**. Maßstab ist der Aufbau des Vorlage-Videos.
Look-Regeln (Punktraster, flach, Farben) aus `CLAUDE.md` gelten weiter für die Bildanweisungen.

Arbeite in Phasen, nach jeder Phase auf Freigabe warten.

## Phase 1 – Vorlage holen
- Ordner `videos/_source/<youtube-id>/`.
- Ton + Metadaten: `yt-dlp -f bestaudio -x --audio-format mp3 --write-info-json -o "audio.%(ext)s" <url>`
  (Untertitel liefern oft HTTP 429 → nicht darauf verlassen.)
- Transkript im Hintergrund: `python scripts/transcribe-source.py <audio.mp3> <transcript.txt>` (faster-whisper small, CPU, ca. 0,4× Videolänge). Sprache im Skript auf die des Videos setzen. Nicht mit `python -I` starten (findet sonst `av` nicht).
- Dem Nutzer Titel, Kanal, Länge, Sprache nennen.

## Phase 2 – Aufbau-Analyse (Freigabe)
Tabelle der Vorlage, Abschnitt für Abschnitt: Zeit, Funktion (Hook, Einstieg, Erklärung, Twist, Exkurs, Höhepunkt, Ausklang, Nachspann), Kernaussage, welche Frage offen bleibt, welches Bild.
Zielläng festlegen (Nutzer fragt meist nach Minuten → ca. 140 Wörter/min Deutsch).

## Phase 3 – Skript (Freigabe)
- **Aufbau komplett übernehmen**: gleiche Abschnitte, gleiche Reihenfolge, gleiche Twists und Spannungsbögen, gleiches Verhältnis der Abschnittslängen (auf die Ziellänge skaliert). Kürzen durch Straffen innerhalb der Abschnitte, nicht durch Streichen ganzer Abschnitte – außer der Nutzer will es.
- **Formulierung komplett eigen**: nicht Satz für Satz übersetzen, keine markanten Wendungen, Witze oder Wortschöpfungen der Vorlage übernehmen. Wo die Vorlage ein eigenes Beispiel/einen Gag hat, ein **eigenes gleichwertiges** Beispiel erfinden (gleiche Funktion, anderer Inhalt) – bevorzugt deutsch/lokal.
- Mathematik/Fakten sind frei; jede Behauptung im Abschnitt „Fakten-Check“ belegen, Fehler der Vorlage korrigieren.
- Format: Abschnitte mit Zeitbereich, `[Bild: …]`-Anweisungen im Punktgenau-Stil, Sprechtext in vollständigen Sätzen. Am Ende Wortzahl und geschätzte Dauer.
- Ablage: `videos/_source/<id>/script-longform.md`, Vorlage im Kopf vermerken („Aufbau nach …“).
- Ziellänge ist ein Richtwert: Lieber vollständig und flüssig als auf Minuten gekürzt (9 statt 8 Minuten war okay).

### Sprachstil (vom Nutzer als „extrem gut“ bestätigt)
- **Nah am Original:** gleicher Gedankengang, gleiche Beispiele (Zahlen, Mengen, Gedankenexperimente), gleiche Fragen an den Zuschauer an denselben Stellen. Keine erfundenen Ersatzbeispiele, wenn das Original eins hat – nur dessen markanteste Formulierungen eigen umschreiben.
- **Natürliches gesprochenes Deutsch:** kurze, vollständige Sätze, wie man es einem Freund erklärt. Keine verdrehten Bilder, keine gestelzten Wortspiele, keine Telegramm-Fragmente.
- **Direkte Ansprache:** „Stell dir vor …“, „Was ist die größte Zahl, die dir einfällt?“, „Aber Moment.“ als Wendepunkte.
- **Jeder Begriff wird beim ersten Auftreten erklärt** (fett im Skript), dann konsequent gleich benannt.
- **Aufzählungen nie als Satzfetzen** („Nur die Fünf. Alle außer fünf.“). Erst erklären, wie man es liest (Tabelle, Punkt = dabei), dann Beispiele in ganzen Sätzen.
- Jede Abschnitts-Überschrift trägt Zeitbereich und `[Bild: …]`-Anweisung.

## Phase 4 – Szenen- und Animationsplan (Freigabe)
Alles, was erzählt wird, muss zu sehen sein. **Erst komplett planen, dann animieren**, damit alles zusammenpasst.
- Format Longform: **1920×1080, 30 fps**. Look aus `CLAUDE.md` (Punktraster, flach, Farben, Inter, weiße Kontur), Captions optional unten.
- Datei `videos/_source/<id>/storyboard.md`:
  1. **Bildsprache** (gilt fürs ganze Video): welches Objekt steht wofür (z. B. blauer Punkt = Element, oranger Strich = „das Neue“, magenta = Wendepunkt/Beweis), feste Positionen, wiederkehrende Bauteile.
  2. **Bauteile-Liste**: wiederverwendbare Komponenten (z. B. `NumberLine`, `TickRow`, `SetTable`) mit Props – jede Szene setzt sich daraus zusammen.
  3. **Pro Szene**: Satz/Wörter des Skripts → was erscheint, wo, wie es animiert (Einblenden, Kamera, Übergang), Dauer in Wörtern, Übergang zur nächsten Szene. Zu jedem Satz mit Bildbezug („das hier“, Zahlen, Beispiele) ein sichtbares Element.
  4. **Übergänge**: Szenen gehen ineinander über (Kamera fährt weiter, Elemente verwandeln sich), keine harten Schnitte ohne Grund.
- Erst nach Freigabe Code bauen: Bauteile zuerst, dann Szene für Szene.

## Phase 5 – Szenen einzeln bauen und prüfen (je Szene Freigabe)
- Das Video hat `src/videos/<slug>/sections.json` (erste Skriptzeile je Abschnitt). Daran erkennt `pg` ein Longform.
- `Video.tsx` exportiert `SECTION_FRAMES`; der Registry-Eintrag bekommt `sections: <Alias>_SEC`. Dann legt `Root.tsx` automatisch für jeden Abschnitt einen eigenen Studio-Clip `<CompId>-Szene01`, `-Szene02`, … an.
- **Clips immer im Remotion Studio öffnen**, nie als einzelne MP4 im Browser-Player: `npm run pg -- scene <slug> <n>` startet bei Bedarf das Studio und öffnet den Clip der Szene. Dort kann der Nutzer abspielen, Regler ändern und mit „Save“ speichern.
- Jede Szene bekommt beim Bauen **Regler** (Zod-Schema + `defaultProps`): Positionen, Größen, Farben, Tempo/Verzögerungen, Kamera, Beschriftungen. Werte, die der Nutzer im Studio speichert, nie überschreiben.
- **Nie das ganze Video rendern, solange gebaut wird.** Nur bei Bedarf eine Szene als Datei: `pg scene <slug> <n> --mp4` (720p).
- Ablauf: Szene n bauen → `pg scene` → Nutzer bewertet/justiert im Studio → verbessern → nächste Szene.
- Kontrolle zwischendurch über Einzelbilder (Remotion `renderStill`, halbe Größe), nicht über Komplett-Renders.

## Phase 6 – Export (nur auf Wunsch des Nutzers)
- `npm run pg -- render <slug>` rendert Longform in **4K** (3840×2160, `--scale=2`) in Teilstücken zu 2.000 Bildern (`--concurrency=4`, sonst stürzt der Browser ab), fügt sie zusammen und öffnet das Ergebnis im Browser. Bricht es ab: Befehl erneut starten, fertige Teile werden übersprungen.
- 4K **ausschließlich** für den finalen Export – nie für Zwischenstände.
- Einzelne Videos (Code unter `src/videos/<slug>`, `public/<slug>`, `videos/<slug>`) werden **nicht committet**, nur Pipeline-Dateien.

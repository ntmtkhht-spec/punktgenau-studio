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

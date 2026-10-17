---
name: punktgenau-short
description: Erstellt ein neues YouTube-Short für den Kanal Punktgenau (Physik/Informatik/Mathe für Laien) von der Themenwahl bis zum fertigen Video mit Thumbnail und Upload-Texten. Nutzen, wenn ein neues Video, ein neues Thema oder ein neues Skript für den Kanal gemacht werden soll.
---

# Punktgenau-Short erstellen

Arbeite in Phasen. **Nach jeder Phase mit Freigabe-Punkt anhalten und auf den Nutzer warten.**
Alle Regeln zu Look, Layout, Skript und Ton stehen in `CLAUDE.md` – vorher lesen und strikt einhalten.
Befehle laufen in `remotion-shorts/` (`npm run pg -- …`).

## Phase 1 – Thema (Freigabe)
- Hat der Nutzer kein Thema genannt: 8–12 Vorschläge als Tabelle (Thema, Hook-Satz, was man sieht, Aufwand).
- Kriterien: Ergebnis ab Sekunde 1 sichtbar, aus wenigen Punkten/Linien darstellbar, überraschende Auflösung, die man *zeigen* kann, Zuschauer kann raten.
- Bereits gemachte Themen nicht wiederholen (`npm run pg -- list`).
- Der Nutzer entscheidet das Thema.

## Phase 2 – Bildtest (Freigabe)
- Kurzer Prototyp (Python/Node) des Kernbilds, gerendert in **Handy-Größe** (ca. 390 px breit).
- Mathe/Physik vorher **nachrechnen** (Simulation, Zählung) – keine Behauptung, die das Bild nicht zeigt.
- Ergebnis dem Nutzer schicken: Trägt das Bild?

## Phase 3 – Skript (Freigabe)
- `npm run pg -- new <nn-slug> "<Titel>"` (nn = nächste freie Nummer).
- Skript in `videos/<slug>/script.md` (nummerierte Zeilen, ein Satz = eine Audiodatei), Fakten-Check-Abschnitt füllen.
- Skript-Regeln aus CLAUDE.md (vollständige Sätze, Kontext im Hook, Loop am Ende, ca. 150 Wörter).
- Skript vollständig im Chat zeigen. Der Nutzer entscheidet und spricht es danach ein.

## Phase 4 – Storyboard (Freigabe)
- Nach der Skript-Freigabe, **vor jedem Szenen-Code**. Datei: `videos/<slug>/storyboard.md`.
- Pro Skriptzeile eine Szene mit diesem Aufbau:
  - **Gesprochen:** der Satz aus `script.md`.
  - **Ablauf Schritt für Schritt:** eine vollständige, durchdachte Szenenbeschreibung, kein einzelner Satz. Was steht zu Beginn auf der Leinwand, was erscheint wann (an welchem Wort), wie bewegt es sich, wohin geht die Kamera, wie endet die Szene, wie geht sie in die nächste über. Positionen grob in der Safe Zone angeben, damit nichts mit den Captions kollidiert.
  - **Warum so:** Für jedes Bildelement und jede Bewegung beantworten: *Warum genau das? Wie hilft es, den gesprochenen Satz und das Thema zu verstehen?* Was der Zuschauer in diesem Moment begreifen soll und wie das Bild genau das sichtbar macht. Elemente ohne Begründung streichen – keine Deko, keine Bewegung nur gegen Langeweile.
  - **Werkzeug:** Remotion-Baustein (SVG, Canvas, `@remotion/three` …). Anderes Framework nur mit Begründung nach "Framework-Wahl" in CLAUDE.md.
- Danach prüfen, ob das Storyboard als Ganzes trägt: Hook-Bild ab Frame 0, roter Faden von Szene zu Szene, jedes "dieses/hier" im Bild zu sehen, kein Moment ohne Bewegung, Loop vom Ende zum Anfang.
- **Keine Standbilder oder Skizzen** der Szenen erzeugen – das Storyboard ist reiner Text.
- Storyboard vollständig im Chat zeigen. Der Nutzer gibt frei oder ändert; erst dann wird gebaut. Beim Bauen dem Storyboard folgen, Abweichungen nennen und begründen.

## Phase 5 – Vorschau-Video (optional, ohne Stimme)
- `npm run pg -- words <slug>` (geschätzte Zeiten), Szenen nach dem freigegebenen Storyboard in `src/videos/<slug>/Video.tsx` bauen.
- Framework: Remotion. Anderes Framework nur nach "Framework-Wahl" in CLAUDE.md (Begründung in script.md + Freigabe).
- Bausteine nur aus `src/shared` importieren. Beispiele für Szenen-Code: `src/zeno/` (3D-Hook, Strecke, Quadrat-Beweis), `src/spiral/` (Canvas mit vielen Punkten), `src/phantom/` (Simulation).

## Phase 6 – Stimme
- Nutzer legt `audio1.mp3 … audioN.mp3` nach `videos/<slug>/voice/`.
- `npm run pg -- voice <slug>` (Whisper-Wortzeiten, Tonspur, Musik).
- Weicht die Aufnahme vom Skript ab (Whisper-Text in `videos/<slug>/whisper.json` vergleichen), `script.md` an das tatsächlich Gesprochene anpassen und `voice` erneut ausführen.

## Optionale Soundeffekte – nur nach Nachfrage und Bestätigung
- Lokales Setup: [references/soundeffekte.md](references/soundeffekte.md). Dieses Dokument lesen, wenn Soundeffekte vorgeschlagen, angehört oder eingebaut werden sollen. Die enthaltene Bibliothek ist vorbereitet, aber standardmäßig deaktiviert.
- Situationen beurteilen: etwa ein Objekt erscheint, ein Maßstab wechselt, eine Eingabe erfolgt oder ein Ergebnis sichtbar wird. Nur bei einem passenden gestalterischen Zweck wenige konkrete Effekte vorschlagen; nicht automatisch jede Bewegung vertonen.
- Vor dem Einbau den konkreten Einsatz nennen (Datei, Szene/Ereignis, Häufigkeit, beabsichtigte Lautstärke), bei Bedarf kurze Hörproben anbieten und **ausdrücklich fragen, ob diese Effekte eingesetzt werden sollen**. Zusammengehörige Einsätze dürfen als ein konkreter Plan gemeinsam bestätigt werden.
- **Erst nach ausdrücklicher Bestätigung einsetzen.** Schweigen, die Bereitstellung des ZIPs, eine Skill-Freigabe, „Video vollständig erstellen“ oder die Freigabe eines Bildtests erlauben keinen Soundeffekt-Einbau. Keine Effekte in Vorschauen oder Exporten vor der Bestätigung. Eine angeforderte isolierte Hörprobe ist keine Freigabe für den Videoeinsatz.
- Bestätigten Umfang im jeweiligen Projekt dokumentieren; neue Effekte oder zusätzliche Einsätze erneut bestätigen lassen. Ablehnung oder Widerruf beachten. Bestehende Videos nicht durch dieses Setup verändern.

## Phase 7 – Video bauen und prüfen (Freigabe)
- Szenen an die echten Wortzeiten hängen, `npm run typecheck`.
- `npm run pg -- audit <slug>` und **alle** Kontaktbögen ansehen: Überschneidungen, abgeschnittene Labels, Standbilder, Captions über Grafik. Beheben, erneut prüfen.
- `npm run pg -- render <slug>`, Video dem Nutzer schicken. Feedback einarbeiten (gezielt, nicht neu bauen). Bei "sehe ich nicht"/"passt nicht": Ursache erst messen und erklären.

## Phase 8 – Upload-Paket
- Thumbnail 1080×1920 als eigene Komposition (Vorbild `src/zeno/Thumbnail.tsx`), Szene + große Schlagzeile, Text nicht über wichtigen Bildteilen.
- Kurz: 3 Titel-Varianten, Beschreibung (2–3 Sätze + Bildnachweise), Hashtags inkl. `#shorts #punktgenau`.
- In `videos/<slug>/upload.md` speichern und im Chat zeigen.

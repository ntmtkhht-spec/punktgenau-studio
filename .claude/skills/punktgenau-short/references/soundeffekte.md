# Soundeffekt-Setup für Punktgenau

## Bibliothek

- Paket: **Kenyset [FREE SFX PACK]**, vom Nutzer bereitgestellt.
- Originalarchiv: `C:/Users/ntmtk/Downloads/Kenyset [FREE SFX PACK].zip`; unverändert belassen.
- Dauerhafte lokale Arbeitskopie: [../assets/sfx/kenyset/](../assets/sfx/kenyset/).
- Maschinenlesbarer Katalog: [../assets/sfx/kenyset/manifest.json](../assets/sfx/kenyset/manifest.json).
- 114 Audioeinträge im ZIP, 94 inhaltlich unterschiedliche Dateien. 20 identische Einträge/Aliase anhand SHA-256 zusammengefasst; Namen und Zuordnungen bleiben im Manifest erhalten.
- Alle 94 Dateien mit `ffprobe` auf Lesbarkeit geprüft; Dauer, Kanäle, Abtastrate und Hash stehen im Manifest. Kategorien stammen nur aus Dateinamen, nicht aus einer Hörprüfung.
- Kein Lizenzdokument im Archiv. Keine pauschale Lizenzfreiheit aus „FREE“ im Paketnamen ableiten; Herkunft/Lizenz bei tatsächlicher Medienverwendung dokumentieren.

## Situationsabhängige Vorauswahl

Die Dateinamen sind Suchhilfen. Vor einer Empfehlung den gewählten Effekt anhören und Dauer/Klang auf die konkrete Szene abstimmen.

| Situation | Kategorie im Manifest | Mögliche Suchnamen |
|---|---|---|
| Kleines Objekt erscheint oder ein Punkt rastet ein | `pop` | `creatorshome-plop`, `soft-subtle-ui-pop`, `soft-pop-sfx` |
| Schneller Zoom oder klarer Szenenwechsel | `whoosh` | `simple-whoosh`, `swoosh-010`, `quick-double-swish` |
| Sichtbarer Klick, Schalter oder umklappende Karte | `click` | `computer-mouse-click`, `minimal-click`, `flipcard`, `App Click` |
| Eine sichtbare Nachricht oder Bestätigung | `notification` | `happy-message-ping`, `confirm-tap`, `success` |
| Sichtbares Tippen | `typing` | `keyboard-typing-fast`, `phone-typing` |
| Ein hervorgehobenes Ergebnis oder Glanzmoment | `shine` | `shine-1`, `shine-6` |
| Tatsächlich passende digitale Handlung | `digital` | `ui-sounds`, `processing-data`, `sci-fi` |

`other` einzeln anhören und zuordnen. Der Musiktrack in `music` ist kein Soundeffekt und ersetzt nicht die bestehende eigene Hintergrundmusik. Erkennbare Spiel-, Geräte- oder Meme-Samples nur bei einem inhaltlich passenden, separat bestätigten Vorschlag berücksichtigen; nicht als generische Übergänge behandeln.

## Bestätigung vor Verwendung

Soundeffekte bleiben standardmäßig aus. Das Setup ist keine Erlaubnis, sie in ein Video einzubauen.

Einen kurzen konkreten Vorschlag machen, zum Beispiel:

> Für die beiden schnellen Maßstabswechsel schlage ich einen leisen Whoosh aus `simple-whoosh-382724.mp3` vor, jeweils einmal und deutlich unter der Stimme. Soll ich diese zwei Einsätze einbauen?

Bei mehreren Effekten einen gemeinsamen nachvollziehbaren Plan nennen. Falls die Auswahl noch nicht nachvollziehbar ist, isolierte Hörproben anbieten. Ohne ausdrückliches Ja keine Effekte in der Komposition aktivieren und keine Vorschau mit Effekten rendern. Eine positive Antwort gilt für den beschriebenen Plan im betreffenden Video; spätere Videos und zusätzliche Einsätze brauchen erneut eine Bestätigung.

## Einbau nach bestätigtem Plan

- In `videos/<slug>/sfx-plan.md` festhalten: bestätigte Dateien, Szenen/Ereignisse, Häufigkeit, Lautstärkeabsicht und die ausdrückliche Nutzeraussage als Freigabe. Tatsächlich verwendete Herkunft/Lizenz und Zuschnitte dazuschreiben.
- Nur benötigte Dateien nach `remotion-shorts/public/<slug>/sfx/` kopieren. Das Skill-Paket unverändert als Bibliothek erhalten; weder das gesamte Paket in jeden Film kopieren noch Effekte im gemeinsamen Player automatisch aktivieren.
- Zeitpunkte von tatsächlichen Wort-/Szenenzeiten der vorhandenen Timeline ableiten; keine pauschalen festen Sekunden setzen, die nach Sprachänderungen verrutschen. Bei vorläufigem Timing als solches dokumentieren.
- Effekt auf die sichtbare Handlung zuschneiden, bei Bedarf kurze Rand-Fades setzen. Lautstärke durch Anhören mit Musik und Stimme bestimmen, Stimme verständlich halten; Peaks im finalen Mix auf Übersteuerung prüfen. Keine künstliche Streckung der Sprecherstimme.
- Nach dem Mischen die betreffenden Übergänge mit Ton prüfen und sicherstellen, dass ausschließlich die bestätigten Einsätze enthalten sind. Nicht verwendete/abgelehnte Vorschläge bleiben deaktiviert.

Eine neue Datei, ein zusätzlicher Einsatz oder ein anderer gestalterischer Zweck braucht eine erneute Bestätigung. Routinekorrekturen innerhalb des bestätigten Plans, etwa einen Click exakt auf denselben bestätigten Klick zu schieben oder leiser zu mischen, sind keine zusätzlichen Einsätze.

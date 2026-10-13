"""Baut logo-varianten.html aus den SVG-Dateien in logos/."""
VARIANTS = [
    ("01-rasterpunkt", "Rasterpunkt", "Ein 5×5-Punktraster, ein Punkt ist hervorgehoben. Das ist die Kernidee: genau dieser Punkt, und es ist der visuelle Stil der Videos."),
    ("02-fadenkreuz", "Fadenkreuz", "Eckige Zielmarken rahmen einen Punkt im Raster ein. Punktgenau im Wortsinn: anvisiert und getroffen."),
    ("03-halbierung", "Halbierung", "Balken halbieren sich in den Kanalfarben und laufen auf eine Linie zu, genau wie die Strecke im Zenon-Video. Steht für „Unendliches wird endlich“."),
    ("04-p-monogramm", "P-Monogramm", "Ein P aus Rasterquadraten, die Öffnung ist ein blauer Punkt im Raster. Gut als Profilbild, auch winzig noch lesbar."),
    ("05-treffer", "Treffer", "Zwei eckige Rahmen und ein Mittelpunkt in Magenta. Eine Zielscheibe im flachen, kantigen Kanal-Look."),
    ("06-koordinate", "Koordinate", "Achsenkreuz mit Hilfslinien zu genau einem Punkt. Wie ein Diagramm, passt zu Mathe und Physik."),
    ("07-wortmarke", "Wortmarke", "Der Name selbst, der Schlusspunkt ist das Logo. Für Banner, Video-Abspann und Wasserzeichen."),
]
cards = []
for i, (key, name, why) in enumerate(VARIANTS, 1):
    svg = open(f"logos/{key}.svg", encoding="utf-8").read()
    avatar = "" if key == "07-wortmarke" else svg
    cards.append(f'<article><div class="tile">{svg}</div><div class="avatar">{avatar}</div><h2>{i}. {name}</h2><p>{why}</p><code>branding/logos/{key}.svg</code></article>')
html = f"""<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Punktgenau Logos</title>
<style>body{{margin:0;background:#fff;color:#000;font-family:Inter,Arial,sans-serif}}
main{{max-width:1100px;margin:0 auto;padding:40px 16px}}h1{{font-size:40px;margin:0 0 6px;letter-spacing:-1px}}.sub{{color:#555;margin:0 0 32px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px}}
article{{background:#fff;outline:3px solid #000;padding:20px}}.tile{{aspect-ratio:1;display:flex;align-items:center;justify-content:center;outline:1px solid #ddd}}.tile svg{{width:70%}}
.avatar{{width:48px;height:48px;border-radius:50%;overflow:hidden;outline:1px solid #ddd;margin-top:12px;display:flex;align-items:center;justify-content:center}}.avatar svg{{width:80%}}.avatar:empty{{display:none}}
h2{{margin:14px 0 4px;font-size:20px}}p{{margin:0 0 8px;color:#555;line-height:1.45}}code{{font-size:12px;color:#555}}</style></head>
<body><main><h1>Punktgenau</h1><p class="sub">7 Logo-Varianten. Unter jedem Logo: die Vorschau als rundes Profilbild in YouTube-Größe.</p><div class="grid">{''.join(cards)}</div></main></body></html>"""
open("logo-varianten.html", "w", encoding="utf-8").write(html)
print("ok")

// Browser-Vorschau fuer gerenderte Videos und einzelne Szenen.
// Zeigt videos/<slug>/export/<slug>.mp4 (oder ?file=scenes/szene-03.mp4) an und laedt den offenen Tab neu,
// sobald pg.mjs nach einem Render POST /reload?slug=<slug>&file=<datei> schickt (Server-Sent Events).
//
//   node scripts/preview-server.mjs            (startet normalerweise automatisch durch "pg render" / "pg scene")
import {createReadStream, existsSync, statSync} from 'node:fs';
import {createServer} from 'node:http';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const PREVIEW_PORT = Number(process.env.PG_PREVIEW_PORT ?? 4747);

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
// Nur Dateien aus export/ oder scenes/ (kein Pfad-Ausbruch moeglich).
const FILE_RE = /^(export|scenes)\/[a-z0-9-]+\.mp4$/;
const fileOf = (slug, f) => (f && FILE_RE.test(f) ? f : `export/${slug}.mp4`);
const clients = new Set();

const page = (slug, file) => `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Punktgenau – ${slug}</title>
<style>
  :root{color-scheme:light dark}
  body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;
       font-family:Inter,system-ui,sans-serif;background:#f4f4f4;color:#111}
  @media (prefers-color-scheme:dark){body{background:#151515;color:#eee}}
  video{max-height:86vh;max-width:96vw;background:#000}
  #info{font-size:14px;opacity:.7}
</style></head>
<body>
  <video id="v" controls autoplay playsinline src="/video/${slug}?file=${file}&t=${Date.now()}"></video>
  <div id="info">${slug} · ${file} · wartet auf neue Renderings …</div>
<script>
  const v = document.getElementById('v'), info = document.getElementById('info');
  const es = new EventSource('/events');
  es.addEventListener('reload', (e) => {
    const [slug, file] = e.data.split('|');
    history.replaceState(null, '', '/v/' + slug + '?file=' + file);
    v.src = '/video/' + slug + '?file=' + file + '&t=' + Date.now();
    v.play().catch(() => {});
    info.textContent = slug + ' · ' + file + ' · neu geladen ' + new Date().toLocaleTimeString('de-DE');
  });
</script>
</body></html>`;

const sendVideo = (req, res, slug, rel) => {
  const file = join(ROOT, 'videos', slug, rel);
  if (!existsSync(file)) return res.writeHead(404).end('Noch kein Render.');
  const size = statSync(file).size;
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '');
  if (!range) {
    res.writeHead(200, {'Content-Type': 'video/mp4', 'Content-Length': size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store'});
    return createReadStream(file).pipe(res);
  }
  const start = range[1] ? Number(range[1]) : 0;
  const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
  if (start > end || start >= size) return res.writeHead(416, {'Content-Range': `bytes */${size}`}).end();
  res.writeHead(206, {
    'Content-Type': 'video/mp4',
    'Content-Range': `bytes ${start}-${end}/${size}`,
    'Content-Length': end - start + 1,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store',
  });
  createReadStream(file, {start, end}).pipe(res);
};

const handle = (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const [, kind, slug] = url.pathname.split('/');
  if (kind === 'status') {
    return res.writeHead(200, {'Content-Type': 'application/json'}).end(JSON.stringify({clients: clients.size}));
  }
  if (kind === 'events') {
    res.writeHead(200, {'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive'});
    res.write(': ok\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  if (kind === 'reload' && req.method === 'POST') {
    const target = url.searchParams.get('slug') ?? '';
    if (!SLUG_RE.test(target)) return res.writeHead(400).end('Ungueltiger Slug.');
    const rel = fileOf(target, url.searchParams.get('file'));
    for (const c of clients) c.write(`event: reload\ndata: ${target}|${rel}\n\n`);
    return res.writeHead(200, {'Content-Type': 'application/json'}).end(JSON.stringify({clients: clients.size}));
  }
  if ((kind === 'v' || kind === 'video') && SLUG_RE.test(slug ?? '')) {
    const rel = fileOf(slug, url.searchParams.get('file'));
    if (kind === 'video') return sendVideo(req, res, slug, rel);
    return res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}).end(page(slug, rel));
  }
  res.writeHead(404).end('Nicht gefunden.');
};

// Nur an localhost binden: die Vorschau ist nicht fuer das Netzwerk gedacht.
createServer(handle)
  .on('error', (e) => {
    console.error(`Vorschau-Server: ${e.message}`);
    process.exit(1);
  })
  .listen(PREVIEW_PORT, '127.0.0.1', () => console.log(`Vorschau: http://localhost:${PREVIEW_PORT}/v/<slug>`));
// Keepalive, damit Proxys/Browser die SSE-Verbindung nicht schliessen.
setInterval(() => clients.forEach((c) => c.write(': ping\n\n')), 25000).unref();

#!/usr/bin/env node
// Punktgenau-Werkzeug: ein Befehl pro Workflow-Schritt.
//
//   npm run pg -- new <slug> "<Titel>"   Video anlegen (Ordner, Skript-Vorlage, Komposition)
//   npm run pg -- words <slug>           Wortzeiten aus dem Skript schaetzen (Vorschau ohne Stimme)
//   npm run pg -- voice <slug>           Stimme: Whisper-Wortzeiten, Tonspur zusammenfuegen, Musik erzeugen
//   npm run pg -- audit <slug>           Kontaktboegen (alle 0,5 s ein Bild) zur Pruefung auf Ueberschneidungen
//   npm run pg -- scene <slug> <n>       Longform: nur Abschnitt n in 720p rendern und im Browser zeigen (zum Pruefen)
//   npm run pg -- render <slug>          Finales Video rendern (Longform: 4K in Teilstuecken) – nur fuer den Export
//   npm run pg -- preview <slug>         Letzten Export im Browser zeigen (Render macht das automatisch)
//   npm run pg -- list                   Alle Videos anzeigen
//
// Aufruf aus remotion-shorts/ (dort liegt das npm-Skript "pg").
import {execFileSync, spawn} from 'node:child_process';
import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RS = join(ROOT, 'remotion-shorts');
const SCRIPTS = join(ROOT, 'scripts');
const REGISTRY = join(RS, 'src', 'videos', 'registry.ts');

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, {stdio: 'inherit', ...opts});
const fail = (msg) => {
  console.error(`Fehler: ${msg}`);
  process.exit(1);
};

const videoDir = (slug) => join(ROOT, 'videos', slug);
const srcDir = (slug) => join(RS, 'src', 'videos', slug);
const publicDir = (slug) => join(RS, 'public', slug);

/** "04-monty-hall" -> "V04MontyHall" (gueltige Kompositions-ID). */
const compId = (slug) => {
  const [num, ...rest] = slug.split('-');
  return `V${num}${rest.map((p) => p[0].toUpperCase() + p.slice(1)).join('')}`;
};

const checkSlug = (slug) => {
  if (!slug || !/^\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    fail('Slug muss so aussehen: 04-monty-hall (zwei Ziffern, dann kleine Woerter mit Bindestrich)');
  }
};

const requireVideo = (slug) => {
  checkSlug(slug);
  if (!existsSync(srcDir(slug))) fail(`Video ${slug} gibt es nicht. Erst: npm run pg -- new ${slug} "<Titel>"`);
};

const readMeta = (slug) => JSON.parse(readFileSync(join(srcDir(slug), 'meta.json'), 'utf8'));
const writeMeta = (slug, meta) => writeFileSync(join(srcDir(slug), 'meta.json'), JSON.stringify(meta, null, 2));

const estimateWords = (slug) =>
  run('node', [join(SCRIPTS, 'estimate-words.mjs'), join(videoDir(slug), 'script.md'), join(srcDir(slug), 'words.json')]);

const cmdNew = (slug, title) => {
  checkSlug(slug);
  if (!title) fail('Titel fehlt: npm run pg -- new 04-monty-hall "Das Monty-Hall-Problem"');
  if (existsSync(srcDir(slug))) fail(`${slug} existiert schon`);
  const id = compId(slug);
  for (const d of [videoDir(slug), join(videoDir(slug), 'voice'), join(videoDir(slug), 'export'), srcDir(slug), publicDir(slug)]) {
    mkdirSync(d, {recursive: true});
  }
  const fill = (tpl) => tpl.replaceAll('__TITLE__', title).replaceAll('__SLUG__', slug);
  writeFileSync(join(videoDir(slug), 'script.md'), fill(readFileSync(join(SCRIPTS, 'template', 'script.md.tpl'), 'utf8')));
  writeFileSync(join(srcDir(slug), 'Video.tsx'), fill(readFileSync(join(SCRIPTS, 'template', 'Video.tsx.tpl'), 'utf8')));
  writeMeta(slug, {title, hasVoice: false, hasMusic: false});
  estimateWords(slug);

  const reg = readFileSync(REGISTRY, 'utf8');
  const alias = id;
  const updated = reg
    .replace('// </pg:imports>', `import {DURATION as ${alias}_DUR, Video as ${alias}} from './${slug}/Video';\n// </pg:imports>`)
    .replace('  // </pg:entries>', `  {id: '${id}', slug: '${slug}', component: ${alias}, durationSec: ${alias}_DUR},\n  // </pg:entries>`);
  writeFileSync(REGISTRY, updated);
  console.log(`\nAngelegt: ${slug}  (Komposition im Studio: ${id})`);
  console.log(`  Skript:      videos/${slug}/script.md`);
  console.log(`  Stimme rein: videos/${slug}/voice/audio1.mp3, audio2.mp3, ...`);
  console.log(`  Szenen-Code: remotion-shorts/src/videos/${slug}/Video.tsx`);
};

const cmdVoice = (slug) => {
  requireVideo(slug);
  const vdir = join(videoDir(slug), 'voice');
  const files = readdirSync(vdir)
    .map((f) => ({f, m: f.match(/^audio(\d+)\.(mp3|wav|m4a)$/i)}))
    .filter((x) => x.m)
    .sort((a, b) => Number(a.m[1]) - Number(b.m[1]))
    .map((x) => join(vdir, x.f));
  if (files.length === 0) fail(`Keine Audiodateien in videos/${slug}/voice (erwartet: audio1.mp3, audio2.mp3, ...)`);
  const whisperJson = join(videoDir(slug), 'whisper.json');
  console.log(`Whisper: ${files.length} Dateien ...`);
  run('python', [join(SCRIPTS, 'whisper-words.py'), whisperJson, ...files]);
  mkdirSync(publicDir(slug), {recursive: true});
  run('node', [join(SCRIPTS, 'align-whisper.mjs'), join(videoDir(slug), 'script.md'), whisperJson, join(publicDir(slug), 'voice.wav'), join(srcDir(slug), 'words.json')]);
  const words = JSON.parse(readFileSync(join(srcDir(slug), 'words.json'), 'utf8'));
  const total = words[words.length - 1].end + 1.5;
  run('python', [join(SCRIPTS, 'make-ambient.py'), join(publicDir(slug), 'music.wav'), total.toFixed(1)]);
  writeMeta(slug, {...readMeta(slug), hasVoice: true, hasMusic: true});
  console.log(`\nStimme + Musik fertig. Dauer ca. ${total.toFixed(1)} s`);
};

const cmdAudit = (slug) => {
  requireVideo(slug);
  const out = join(videoDir(slug), 'audit');
  rmSync(out, {recursive: true, force: true});
  mkdirSync(out, {recursive: true});
  const mp4 = join(out, 'audit.mp4');
  run('npx', ['remotion', 'render', 'src/index.ts', compId(slug), mp4, '--scale=0.3', '--gl=angle'], {cwd: RS, shell: true});
  run('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-vf', 'fps=2,scale=216:-1', join(out, 'f_%03d.png')]);
  const frames = readdirSync(out).filter((f) => f.startsWith('f_')).length;
  const sheets = Math.ceil(frames / 20);
  for (let i = 0; i < sheets; i++) {
    run('ffmpeg', ['-v', 'error', '-y', '-start_number', String(i * 20 + 1), '-i', join(out, 'f_%03d.png'), '-frames:v', '1', '-vf', 'tile=10x2:padding=4:color=gray', join(out, `bogen-${String(i + 1).padStart(2, '0')}.png`)]);
  }
  console.log(`\nAudit: ${sheets} Kontaktboegen (je 10 s, alle 0,5 s ein Bild) in videos/${slug}/audit/`);
};

// ---------------------------------------------------------------- Browser-Vorschau
const PREVIEW_PORT = Number(process.env.PG_PREVIEW_PORT ?? 4747);
const PREVIEW = `http://localhost:${PREVIEW_PORT}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const previewUp = async () => {
  try {
    return await (await fetch(`${PREVIEW}/status`)).json();
  } catch {
    return null;
  }
};

/** Startet den Vorschau-Server bei Bedarf, laedt offene Tabs neu, sonst oeffnet er einen neuen Tab. */
const showInBrowser = async (slug, rel = `export/${slug}.mp4`) => {
  if (!existsSync(join(videoDir(slug), rel))) fail(`${rel} gibt es noch nicht.`);
  if (!(await previewUp())) {
    spawn('node', [join(SCRIPTS, 'preview-server.mjs')], {detached: true, stdio: 'ignore', windowsHide: true}).unref();
    for (let i = 0; i < 20 && !(await previewUp()); i++) await sleep(150);
  }
  const query = `slug=${slug}&file=${encodeURIComponent(rel)}`;
  const res = await fetch(`${PREVIEW}/reload?${query}`, {method: 'POST'})
    .then((r) => r.json())
    .catch(() => ({clients: 0}));
  if (res.clients > 0) return console.log(`Vorschau neu geladen: ${rel}`);
  const url = `${PREVIEW}/v/${slug}?file=${encodeURIComponent(rel)}`;
  const [cmd, args] = process.platform === 'win32' ? ['cmd', ['/c', 'start', '""', url]] : [process.platform === 'darwin' ? 'open' : 'xdg-open', [url]];
  spawn(cmd, args, {detached: true, stdio: 'ignore', windowsHide: true}).unref();
  console.log(`Vorschau: ${url}`);
};

// ---------------------------------------------------------------- Longform (16:9, Abschnitte)
const FPS = 30;
const sectionsFile = (slug) => join(srcDir(slug), 'sections.json');
const isLongform = (slug) => existsSync(sectionsFile(slug));

/** Bildbereiche je Abschnitt aus Wortzeiten + sections.json (gleiche Logik wie lib.ts im Video). */
const sectionFrames = (slug) => {
  const words = JSON.parse(readFileSync(join(srcDir(slug), 'words.json'), 'utf8'));
  const starts = JSON.parse(readFileSync(sectionsFile(slug), 'utf8')).map((line) => words.find((w) => w.line === line).start);
  const total = words[words.length - 1].end + 0.6 + 1;
  return starts.map((t, i) => [Math.round(t * FPS), Math.round((starts[i + 1] ?? total) * FPS) - 1]);
};

const renderRange = (slug, out, frames, scale, extra = []) =>
  run('npx', ['remotion', 'render', 'src/index.ts', compId(slug), out, `--frames=${frames[0]}-${frames[1]}`, `--scale=${scale}`, '--gl=angle', ...extra], {cwd: RS, shell: true});

/** Einen Abschnitt in 720p rendern: zum Bewerten reicht das und es geht ein Vielfaches schneller als 4K. */
const cmdScene = async (slug, n) => {
  requireVideo(slug);
  if (!isLongform(slug)) fail(`${slug} hat keine Abschnitte (sections.json fehlt) – scene gibt es nur fuer Longform.`);
  const ranges = sectionFrames(slug);
  const i = Number(n) - 1;
  if (!Number.isInteger(i) || i < 0 || i >= ranges.length) fail(`Abschnitt muss 1 bis ${ranges.length} sein.`);
  mkdirSync(join(videoDir(slug), 'scenes'), {recursive: true});
  const rel = `scenes/szene-${String(i + 1).padStart(2, '0')}.mp4`;
  renderRange(slug, join(videoDir(slug), rel), ranges[i], 2 / 3, ['--crf=23', '--concurrency=50%']);
  console.log(`\nSzene ${i + 1}: videos/${slug}/${rel} (${((ranges[i][1] - ranges[i][0] + 1) / FPS).toFixed(1)} s, 720p)`);
  await showInBrowser(slug, rel);
};

/** Finaler Longform-Export: 4K in Teilstuecken (stabil bei wenig Speicher), danach ohne Neukodierung zusammenfuegen. */
const renderLongform4k = (slug, out) => {
  const parts = join(videoDir(slug), 'export', 'parts');
  mkdirSync(parts, {recursive: true});
  const total = sectionFrames(slug).at(-1)[1] + 1;
  const CHUNK = 2000;
  const list = [];
  for (let s = 0; s < total; s += CHUNK) {
    const f = join(parts, `part_${String(s).padStart(5, '0')}.mp4`);
    list.push(`file '${f.replaceAll('\\', '/')}'`);
    if (existsSync(f)) continue; // fertige Teile beim Neustart ueberspringen
    renderRange(slug, f, [s, Math.min(total, s + CHUNK) - 1], 2, ['--crf=18', '--concurrency=4', '--timeout=120000']);
  }
  writeFileSync(join(parts, 'list.txt'), list.join('\n'));
  run('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', join(parts, 'list.txt'), '-c', 'copy', out]);
  rmSync(parts, {recursive: true, force: true});
};

const cmdRender = async (slug, flag) => {
  requireVideo(slug);
  const out = join(videoDir(slug), 'export', `${slug}.mp4`);
  if (isLongform(slug)) renderLongform4k(slug, out);
  else run('npx', ['remotion', 'render', 'src/index.ts', compId(slug), out, '--crf=18', '--gl=angle'], {cwd: RS, shell: true});
  console.log(`\nFertig: videos/${slug}/export/${slug}.mp4${isLongform(slug) ? ' (4K)' : ''}`);
  if (flag !== '--no-preview') await showInBrowser(slug);
};

const cmdList = () => {
  const dir = join(ROOT, 'videos');
  if (!existsSync(dir)) return console.log('Noch keine Videos.');
  for (const slug of readdirSync(dir)) {
    const meta = existsSync(join(srcDir(slug), 'meta.json')) ? readMeta(slug) : {};
    console.log(`${slug.padEnd(28)} ${compId(slug).padEnd(24)} Stimme: ${meta.hasVoice ? 'ja' : 'nein'}   ${meta.title ?? ''}`);
  }
};

const [cmd, a, b] = process.argv.slice(2);
const commands = {preview: () => (requireVideo(a), showInBrowser(a)), new: () => cmdNew(a, b), words: () => (requireVideo(a), estimateWords(a)), voice: () => cmdVoice(a), audit: () => cmdAudit(a), scene: () => cmdScene(a, b), render: () => cmdRender(a, b), list: cmdList};
if (!commands[cmd]) {
  console.log('Befehle: new <slug> "<Titel>" | words <slug> | voice <slug> | audit <slug> | scene <slug> <n> | render <slug> [--no-preview] | preview <slug> | list');
  process.exit(cmd ? 1 : 0);
}
commands[cmd]();

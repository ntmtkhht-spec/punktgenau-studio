#!/usr/bin/env node
// Punktgenau-Werkzeug: ein Befehl pro Workflow-Schritt.
//
//   npm run pg -- new <slug> "<Titel>"   Video anlegen (Ordner, Skript-Vorlage, Komposition)
//   npm run pg -- words <slug>           Wortzeiten aus dem Skript schaetzen (Vorschau ohne Stimme)
//   npm run pg -- voice <slug>           Stimme: Whisper-Wortzeiten, Tonspur zusammenfuegen, Musik erzeugen
//   npm run pg -- audit <slug>           Kontaktboegen (alle 0,5 s ein Bild) zur Pruefung auf Ueberschneidungen
//   npm run pg -- render <slug>          Finales Video rendern
//   npm run pg -- preview <slug>         Letzten Export im Browser zeigen (Render macht das automatisch)
//   npm run pg -- thumbnail <slug>       Thumbnail aus thumbnail-plan.json rendern + Feed-Test + Audit
//   npm run pg -- list                   Alle Videos anzeigen
//
// Aufruf aus remotion-shorts/ (dort liegt das npm-Skript "pg").
import {execFileSync, spawn} from 'node:child_process';
import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {auditThumbnail, checkPlan, thumbDir} from './thumbnail.mjs';

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

const cmdRender = (slug) => {
  requireVideo(slug);
  const out = join(videoDir(slug), 'export', `${slug}.mp4`);
  run('npx', ['remotion', 'render', 'src/index.ts', compId(slug), out, '--crf=18', '--gl=angle'], {cwd: RS, shell: true});
  console.log(`\nFertig: videos/${slug}/export/${slug}.mp4`);
};

/** Thumbnail (Skill thumbnail-design, Modus A): Plan pruefen, Remotion-Still rendern, Feed-Test + Audit. */
const cmdThumbnail = (slug) => {
  checkSlug(slug);
  try {
    const {plan, selected} = checkPlan(videoDir(slug), 'punktgenau');
    if (selected.render.tool !== 'remotion') fail('Punktgenau-Thumbnails werden mit Remotion gebaut (render.tool: "remotion")');
    const full = join(thumbDir(videoDir(slug)), 'thumbnail_full.png');
    run('npx', ['remotion', 'still', 'src/index.ts', selected.render.component, full, '--gl=angle'], {cwd: RS, shell: true});
    console.log(`
Thumbnail-Audit (${selected.id}, ${selected.archetype}):`);
    auditThumbnail(full, plan, selected);
  } catch (e) {
    fail(e.message);
  }
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
const commands = {preview: () => (requireVideo(a), showInBrowser(a)), new: () => cmdNew(a, b), words: () => (requireVideo(a), estimateWords(a)), voice: () => cmdVoice(a), audit: () => cmdAudit(a), thumbnail: () => cmdThumbnail(a), render: () => cmdRender(a), list: cmdList};
if (!commands[cmd]) {
  console.log('Befehle: new <slug> "<Titel>" | words <slug> | voice <slug> | audit <slug> | thumbnail <slug> | render <slug> [--no-preview] | preview <slug> | list');
  process.exit(cmd ? 1 : 0);
}
commands[cmd]();

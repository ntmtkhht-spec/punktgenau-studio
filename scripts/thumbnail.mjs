// Gemeinsames Thumbnail-Modul fuer beide Kanaele (Skill thumbnail-design).
//   checkPlan(dir)            thumbnail-plan.json streng pruefen (Modus, 3 Konzepte, Archetypen, Woerter, Schrift)
//   auditThumbnail(png, plan) Feed-Testbild, Sperrzonen-Overlay, Luminanz Y und Kontrast sigma -> audit.json
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

export const MODES = {
  punktgenau: {
    archetypes: ['paradox-stick-reaction', 'visual-equation-diagram', 'single-word-error-state', 'isometric-grid-outlier'],
    maxWords: 4,
    fonts: /\b(inter|rubik)\b/i,
  },
  editorial: {
    archetypes: ['conceptual-split-pun', 'diegetic-ui-overload', 'symbolic-metaphor-contrast', 'cutout-portrait-mashup', 'emblem-medallion-centerpiece'],
    maxWords: 3,
    roles: ['tall-condensed-serif', 'heavy-plakat-grotesk', 'editorial-didone', 'typewriter-archival', 'diegetic-ui-sans'],
    treatments: /(3d-extrude|gold-bevel|hard-shadow)/i,
  },
};
export const ASPECTS = {
  '16:9': {full: [1920, 1080], feed: [320, 180], zone: {x: 1580, y: 920, w: 340, h: 160}, zoneText: 'x > 1580, y > 920 (YouTube-Zeitstempel)'},
  '9:16': {full: [1080, 1920], feed: [270, 480], zone: {x: 0, y: 1450, w: 1080, h: 470}, zoneText: 'y > 1450 (Shorts-Titel-Overlay)'},
};
const HERO_SOURCES = ['archiv-werk', 'logo', 'ui', 'textur', 'hero-objekt'];
const MIN_FONT_PX = 110;
const MAX_FOCUS = 2;
const SLOP = /(ki-generiert|ai-generated|midjourney|dall-?e|stable diffusion|stock-?foto)/i;
const EMOJI = /\p{Extended_Pictographic}/u;

const text = (v) => typeof v === 'string' && v.trim().length > 0;
/** Woerter zaehlen: "AI | RT" = 2, Trennstriche zaehlen nicht. */
export const countWords = (t) => (t ?? '').split(/[\s|/]+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

const checkConcept = (c, mode, plan) => {
  const m = MODES[mode];
  const at = (f) => `Konzept ${c?.id ?? '?'}: ${f}`;
  const errs = [];
  if (!text(c.id)) errs.push(at('id fehlt'));
  if (!m.archetypes.includes(c.archetype)) errs.push(at(`archetype muss einer von ${m.archetypes.join(', ')} sein (Modus ${mode})`));
  const words = countWords(c.text);
  if (c.wordCount !== words) errs.push(at(`wordCount ${c.wordCount} stimmt nicht (gezaehlt: ${words})`));
  if (words > m.maxWords) errs.push(at(`${words} Woerter – Modus ${mode} erlaubt hoechstens ${m.maxWords}`));
  if (text(c.text) && !(c.minFontPx >= MIN_FONT_PX)) errs.push(at(`minFontPx muss >= ${MIN_FONT_PX} sein (auch fuer Symbole/Formeln, auf Vollformat)`));
  if (text(plan.videoTitle) && text(c.text) && c.text.trim().toLowerCase() === plan.videoTitle.trim().toLowerCase()) errs.push(at('Text ist der Videotitel 1:1 – Titel und Thumbnail sollen sich ergaenzen'));
  if (!(Number.isInteger(c.focusElements) && c.focusElements >= 1 && c.focusElements <= MAX_FOCUS)) errs.push(at(`focusElements muss 1 bis ${MAX_FOCUS} sein`));
  if (!text(c.curiosityGap)) errs.push(at('curiosityGap fehlt (welche Frage oeffnet das Bild?)'));
  if (mode === 'editorial') {
    if (words > 0 && !m.roles.includes(c.typographyRole)) errs.push(at(`typographyRole muss eine von ${m.roles.join(', ')} sein (/editorial-typography)`));
    if (words > 0 && !m.treatments.test(c.typographyTreatment ?? '')) errs.push(at('typographyTreatment braucht 3d-extrude, gold-bevel oder hard-shadow'));
  } else if (words > 0 && !m.fonts.test(c.font ?? '')) errs.push(at('font muss Inter oder Rubik (800-900) sein'));
  if (!Array.isArray(c.heroAssets) || c.heroAssets.length === 0) errs.push(at('heroAssets fehlt'));
  else
    c.heroAssets.forEach((a, k) => {
      if (!text(a?.name)) errs.push(at(`heroAssets[${k}].name fehlt`));
      if (!HERO_SOURCES.includes(a?.source)) errs.push(at(`heroAssets[${k}].source muss ${HERO_SOURCES.join('/')} sein`));
      if (a?.source === 'logo' && !text(a.manifestId)) errs.push(at(`heroAssets[${k}]: Logos immer laden (manifestId aus ed assets / media-use)`));
    });
  const prose = JSON.stringify(c);
  if (SLOP.test(prose)) errs.push(at(`Anti-Slop: ${prose.match(SLOP)[0]} ist verboten`));
  if (EMOJI.test(prose)) errs.push(at('keine Emojis'));
  return errs;
};

/** Liest und prueft <dir>/thumbnail-plan.json. Wirft mit allen Fehlern. */
export const checkPlan = (dir, expectedMode) => {
  const file = join(dir, 'thumbnail-plan.json');
  if (!existsSync(file)) throw new Error(`${file} fehlt – erst 3 Konzepte planen (Skill thumbnail-design, Schritt 1)`);
  const plan = JSON.parse(readFileSync(file, 'utf8'));
  const errs = [];
  if (!(plan.channelMode in MODES)) errs.push('channelMode muss punktgenau oder editorial sein');
  else if (expectedMode && plan.channelMode !== expectedMode) errs.push(`channelMode muss hier ${expectedMode} sein`);
  if (!(plan.aspectRatio in ASPECTS)) errs.push('aspectRatio muss "16:9" oder "9:16" sein');
  const concepts = Array.isArray(plan.concepts) ? plan.concepts : [];
  if (concepts.length < 3) errs.push('mindestens 3 Konzepte planen');
  if (new Set(concepts.map((c) => c.archetype)).size < Math.min(3, concepts.length)) errs.push('die 3 Konzepte brauchen unterschiedliche Archetypen');
  if (plan.channelMode in MODES) concepts.forEach((c) => errs.push(...checkConcept(c, plan.channelMode, plan)));
  const sel = concepts.find((c) => c.id === plan.selectedConcept);
  if (!sel) errs.push('selectedConcept zeigt auf kein Konzept');
  else if (!sel.render || !['remotion', 'hyperframes'].includes(sel.render.tool) || !(text(sel.render.component) || text(sel.render.html))) errs.push('selectedConcept.render braucht tool (remotion|hyperframes) und component bzw. html');
  if (errs.length) throw new Error(`thumbnail-plan.json ungueltig:\n  - ${errs.join('\n  - ')}`);
  return {plan, selected: sel};
};

const ffmpeg = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], {stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 64 * 1024 * 1024});

/** Mittlere Luminanz Y (0-255) und Standardabweichung sigma, gemessen auf 480 px Breite. */
export const measureLuma = (png) => {
  const raw = ffmpeg(['-i', png, '-vf', 'scale=480:-2,format=gray', '-f', 'rawvideo', '-']);
  let sum = 0;
  let sq = 0;
  for (const v of raw) {
    sum += v;
    sq += v * v;
  }
  const mean = sum / raw.length;
  return {Y: +mean.toFixed(1), sigma: +Math.sqrt(sq / raw.length - mean * mean).toFixed(1)};
};

/**
 * Erzeugt thumbnail_feed_test.png und thumbnail_safezone.png neben full.png, misst Y/sigma
 * und schreibt audit.json. Checks 3 und 5 sind Sichtpruefungen (Bilder mit dem Read-Tool ansehen).
 */
export const auditThumbnail = (fullPng, plan, selected) => {
  const dir = join(fullPng, '..');
  const a = ASPECTS[plan.aspectRatio];
  const feed = join(dir, 'thumbnail_feed_test.png');
  const zonePng = join(dir, 'thumbnail_safezone.png');
  ffmpeg(['-i', fullPng, '-vf', `scale=${a.feed[0]}:${a.feed[1]}:flags=area`, feed]);
  const z = a.zone;
  ffmpeg(['-i', fullPng, '-vf', `drawbox=x=${z.x}:y=${z.y}:w=${z.w}:h=${z.h}:color=red@0.45:t=fill,scale=${a.full[0] / 2}:-2`, zonePng]);
  const {Y, sigma} = measureLuma(fullPng);
  const words = countWords(selected.text);
  const mode = plan.channelMode;
  const lumaPass = mode === 'punktgenau' ? Y >= 210 && sigma >= 45 : sigma >= 60;
  const checks = [
    {id: 1, name: 'Wortlimit', status: words <= MODES[mode].maxWords ? 'PASS' : 'FAIL', detail: `${words} Woerter (max ${MODES[mode].maxWords})`},
    {id: 2, name: 'Luminanz & Kontrast', status: lumaPass ? 'PASS' : 'FAIL', detail: `Y=${Y}, sigma=${sigma} (${mode === 'punktgenau' ? 'Ziel Y>=210, sigma>=45' : 'Ziel sigma>=60, Y 75-159'})`},
    {id: 3, name: 'Feed-Lesbarkeit', status: 'SICHTPRUEFUNG', detail: `${feed} ansehen: Text und Hero in <0,5 s erkennbar?`},
    {id: 4, name: 'Mindestschriftgroesse', status: !text(selected.text) || selected.minFontPx >= MIN_FONT_PX ? 'PASS' : 'FAIL', detail: `minFontPx=${selected.minFontPx ?? '-'}`},
    {id: 5, name: 'Sperrzone', status: 'SICHTPRUEFUNG', detail: `${zonePng} ansehen: im roten Feld (${a.zoneText}) kein Text, kein Hero`},
    {id: 6, name: 'Archetyp / Anti-Slop', status: MODES[mode].archetypes.includes(selected.archetype) ? 'PASS' : 'FAIL', detail: selected.archetype},
  ];
  const out = {concept: selected.id, mode, aspect: plan.aspectRatio, measured: {Y, sigma}, checks};
  writeFileSync(join(dir, 'audit.json'), JSON.stringify(out, null, 2) + '\n');
  for (const c of checks) console.log(`  [${c.status.padEnd(13)}] ${c.id} ${c.name}: ${c.detail}`);
  const failed = checks.filter((c) => c.status === 'FAIL');
  if (failed.length) throw new Error(`Thumbnail-Audit: ${failed.length} Check(s) FAIL`);
  console.log('  Rechnerische Checks bestanden. Checks 3 und 5 jetzt visuell pruefen.');
  return out;
};

export const thumbDir = (base) => {
  const d = join(base, 'thumbnail');
  mkdirSync(d, {recursive: true});
  return d;
};

// storyboard.json lesen und streng pruefen. Fehler nennen Szene und Feld, damit nichts geraten wird.
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

export const FORMATS = {'16x9': {width: 1920, height: 1080}, '9x16': {width: 1080, height: 1920}};
export const FPS = 30;

export const ARCHETYPES = [
  '3d-isometric-diorama',
  '2.5d-kinetic-typography',
  'gallery-spotlight-stage',
  '2.5d-parallax-deconstruct',
  'symbolic-actors-collage',
  'diegetic-ui-retro',
  'math-simulation-graph',
];
export const DIMENSIONS = ['2D', '2.5D', '3D'];
export const TOOLS = ['remotion-three', 'remotion-dom', 'hyperframes-gsap', 'manim-python'];
export const CHARACTERS = ['keine', 'meeple', 'roboter', 'portraet', 'silhouetten-publikum', 'panel-figur'];
export const MOTIFS = ['damast', 'arkaden', 'blaetter', 'birken'];
export const MODES = ['these', 'kritik'];
export const COLORS = ['tiefblau', 'orange', 'kupfer', 'petrol', 'lachs'];
export const LIGHTS = ['none', 'vignette', 'spotlight', 'sunburst'];
// Schrift-Rollen aus dem Skill editorial-typography, plus latex-math fuer Manim-Formelsatz.
export const FONT_ROLES = [
  'editorial-didone', 'tall-condensed-serif', 'heavy-plakat-grotesk', 'literary-book-serif',
  'typewriter-archival', 'retro-crt-terminal', 'diegetic-ui-sans', 'latex-math',
];
// Asset-Klassen (Spec 4.1). formel-graph = Manim-Formelsatz/Graph, nur mit manim-python.
export const ASSET_CLASSES = ['archiv-werk', 'logo-icon', 'tapete', 'zitat-ui', '3d-requisite', 'formel-graph'];
export const FREE_LICENSES = ['public-domain', 'cc0', 'cc-by', 'cc-by-sa'];
const ICON_SOURCES = ['simpleicons', 'wikimedia', 'media-use', 'lucide', 'tabler', 'kenney'];
const PROP_SOURCES = ['three-parametric', 'cc0-glb'];
const MAX_FOCUS = 3; // Gesetz der freien Buehne
// Verbotsliste (Spec 4.2): Woerter, die auf Dashboard-, Slop- oder Idle-Muster hindeuten.
const BANNED = [
  [/dashboard|bento|kachel-raster|card-grid/i, 'keine SaaS-Dashboards/Bento-Boxen'],
  [/glas-?panel|glassmorph|backdrop-filter|milchglas/i, 'keine Glas-Panels'],
  [/neon/i, 'keine Neon-Glows'],
  [/ki-generiert|ai-generated|midjourney-bild|dall-?e|stable diffusion|stock-?foto/i, 'keine KI-Bilder oder Stock-Fotos'],
  [/schweb|wackel|pulsier|idle|\bfloat(ing)?\b|bobbing/i, 'kein Idle-Wackeln: Bewegung nur durch Kamera, Licht oder Wort-Einrasten'],
  [/handgezeichnet|freihand|selbst gemalt/i, 'keine selbstgekritzelten SVGs'],
];
const EMOJI = /\p{Extended_Pictographic}/u;

const GENERIC_SANS = /\b(inter|arial|roboto|helvetica|dm sans)\b/i;
// Uebergang -> ffmpeg-xfade-Name. "cut" = harter Schnitt.
export const TRANSITIONS = {
  'cut': null,
  'fade': 'fade',
  'light-switch': 'fadeblack',
  'whip-pan': 'smoothleft',
  'zoom-through': 'circleopen', // ffmpeg-zoomin verpixelt sichtbar (Audit 00-beweis)
  'chapter-card': 'fadeblack',
};

const MIN_REASON = 40; // Begruendungen muessen mehr als ein Stichwort sein

const text = (v) => typeof v === 'string' && v.trim().length > 0;

const checkScene = (s, i, projectDir) => {
  const errs = [];
  const at = (f) => `Szene ${s?.id ?? i + 1}: ${f}`;
  if (!/^[a-z0-9-]+$/.test(s.id ?? '')) errs.push(at('id fehlt oder ungueltig (a-z, 0-9, -)'));
  if (!text(s.sentence)) errs.push(at('sentence fehlt'));
  if (!ARCHETYPES.includes(s.archetype)) errs.push(at(`archetype muss einer von ${ARCHETYPES.join(', ')} sein`));
  if (!DIMENSIONS.includes(s.dimension)) errs.push(at(`dimension muss ${DIMENSIONS.join('/')} sein`));
  if (!TOOLS.includes(s.tool)) errs.push(at(`tool muss einer von ${TOOLS.join(', ')} sein`));
  if (!text(s.toolReason) || s.toolReason.length < MIN_REASON) errs.push(at('toolReason: technische Begruendung fehlt oder ist zu kurz'));
  if (!CHARACTERS.includes(s.characters?.type)) errs.push(at(`characters.type muss einer von ${CHARACTERS.join(', ')} sein`));
  if (!text(s.characters?.reason)) errs.push(at('characters.reason fehlt'));
  for (const f of ['stage', 'choreography', 'camera']) if (!text(s[f])) errs.push(at(`${f} fehlt`));
  if (!Array.isArray(s.typography)) errs.push(at('typography fehlt (Liste der Textelemente, leer wenn kein Text im Bild)'));
  else
    s.typography.forEach((t, k) => {
      if (!text(t?.text)) errs.push(at(`typography[${k}].text fehlt`));
      if (!FONT_ROLES.includes(t?.role)) errs.push(at(`typography[${k}].role muss eine von ${FONT_ROLES.join(', ')} sein`));
      if (!text(t?.font)) errs.push(at(`typography[${k}].font fehlt`));
      else if (GENERIC_SANS.test(t.font) && t.role !== 'diegetic-ui-sans') errs.push(at(`typography[${k}]: ${t.font} ist nur fuer diegetic-ui-sans erlaubt`));
    });
  if (!(s.durationSec > 0 && s.durationSec <= 120)) errs.push(at('durationSec muss zwischen 0 und 120 liegen'));
  if (!(s.transition?.type in TRANSITIONS)) errs.push(at(`transition.type muss einer von ${Object.keys(TRANSITIONS).join(', ')} sein`));
  if (s.transition && !(s.transition.durationSec >= 0 && s.transition.durationSec < s.durationSec)) errs.push(at('transition.durationSec ungueltig'));

  const w = s.wallpaper;
  // Pflicht-Belege: jede Zahl im Bild braucht eine Herkunft (keine erfundenen Zahlen/Charts).
  (s.typography ?? []).forEach((t, k) => {
    if (/\d/.test(t?.text ?? '') && !text(t?.beleg)) errs.push(at(`typography[${k}] enthaelt eine Zahl: beleg (Skriptsatz, Quelle oder Nachrechnung) fehlt`));
  });

  if (!Number.isInteger(s.focusObjects) || s.focusObjects < 1 || s.focusObjects > MAX_FOCUS) errs.push(at(`focusObjects muss 1 bis ${MAX_FOCUS} sein (Gesetz der freien Buehne)`));

  if (!Array.isArray(s.assets) || s.assets.length === 0) errs.push(at('assets fehlt: jedes sichtbare Element einer Asset-Klasse zuordnen'));
  else
    s.assets.forEach((a, k) => {
      const ak = `assets[${k}] (${a?.name ?? '?'})`;
      if (!text(a?.name)) errs.push(at(`${ak}: name fehlt`));
      if (!ASSET_CLASSES.includes(a?.class)) return errs.push(at(`${ak}: class muss eine von ${ASSET_CLASSES.join(', ')} sein`));
      if (a.class === 'archiv-werk') {
        if (!FREE_LICENSES.includes(a.license)) errs.push(at(`${ak}: license muss ${FREE_LICENSES.join('/')} sein`));
        if (!text(a.caption)) errs.push(at(`${ak}: caption (Quellenzeile unter dem Rahmen, z. B. "Caspar David Friedrich, ca. 1818") fehlt`));
        if (!text(a.manifestId)) errs.push(at(`${ak}: manifestId (Eintrag in assets-manifest.json) fehlt`));
      }
      if (a.class === 'logo-icon') {
        if (!ICON_SOURCES.includes(a.source)) errs.push(at(`${ak}: source muss ${ICON_SOURCES.join('/')} sein – Logos/Icons nie von Hand zeichnen`));
        if (!text(a.manifestId)) errs.push(at(`${ak}: manifestId fehlt`));
      }
      if (a.class === 'zitat-ui') {
        if (!['zitat', 'ui'].includes(a.kind)) errs.push(at(`${ak}: kind muss zitat oder ui sein`));
        if (a.kind === 'zitat' && !text(a.quoteSource)) errs.push(at(`${ak}: quoteSource (wortwoertliche Quelle mit Seite/Jahr) fehlt`));
        if (a.kind === 'ui' && a.build !== 'dom') errs.push(at(`${ak}: UI immer als scharfe DOM/Vektor-Komponente bauen (build: "dom"), kein Screenshot`));
      }
      if (a.class === '3d-requisite' && !PROP_SOURCES.includes(a.source)) errs.push(at(`${ak}: source muss three-parametric oder cc0-glb sein`));
      if (a.class === 'tapete' && !w) errs.push(at(`${ak}: Tapete angegeben, aber wallpaper fehlt`));
      if (a.class === 'formel-graph' && s.tool !== 'manim-python') errs.push(at(`${ak}: formel-graph nur mit manim-python`));
    });

  // Verbotsliste ueber alle Freitexte der Szene + Emoji-Sperre.
  const prose = JSON.stringify(s);
  for (const [re, msg] of BANNED) if (re.test(prose)) errs.push(at(`Verbot: ${msg} (gefunden: "${prose.match(re)[0]}")`));
  if (EMOJI.test(prose)) errs.push(at('Verbot: keine System-Emojis'));

  if (w !== null && w !== undefined) {
    if (!MOTIFS.includes(w.motif)) errs.push(at(`wallpaper.motif muss einer von ${MOTIFS.join(', ')} sein`));
    if (!MODES.includes(w.mode)) errs.push(at('wallpaper.mode muss these oder kritik sein'));
    if (!COLORS.includes(w.color)) errs.push(at(`wallpaper.color muss einer von ${COLORS.join(', ')} sein`));
    if (!LIGHTS.includes(w.light)) errs.push(at(`wallpaper.light muss einer von ${LIGHTS.join(', ')} sein`));
  }

  if (s.tool.startsWith('remotion') && !/^[A-Z][A-Za-z0-9]+$/.test(s.component ?? '')) errs.push(at('component (Remotion-Komposition) fehlt'));
  if (s.tool === 'hyperframes-gsap' && !existsSync(join(projectDir, s.html ?? '-', 'index.html'))) errs.push(at(`html: ${s.html}/index.html nicht gefunden`));
  if (s.tool === 'manim-python') {
    if (!existsSync(join(projectDir, s.manim?.file ?? '-'))) errs.push(at(`manim.file ${s.manim?.file} nicht gefunden`));
    if (!/^[A-Z][A-Za-z0-9]*$/.test(s.manim?.class ?? '')) errs.push(at('manim.class fehlt'));
    if (!w) errs.push(at('manim-python braucht eine wallpaper (transparentes Overlay)'));
  }
  return errs;
};

/** assets-manifest.json: jedes geladene Bild/Logo mit URL, Lizenz, Urheber/Jahr, Aufloesung und Sichtpruefung. */
const checkManifest = (sb, projectDir) => {
  const needed = sb.scenes.flatMap((s) => (s.assets ?? []).filter((a) => a.manifestId).map((a) => [s.id, a.manifestId]));
  if (needed.length === 0) return [];
  const file = join(projectDir, 'assets-manifest.json');
  if (!existsSync(file)) return ['assets-manifest.json fehlt, obwohl Szenen geladene Assets nutzen'];
  let entries;
  try {
    entries = JSON.parse(readFileSync(file, 'utf8')).assets ?? [];
  } catch (e) {
    return [`assets-manifest.json ungueltig: ${e.message}`];
  }
  const errs = [];
  for (const [sid, id] of needed) {
    const e = entries.find((x) => x.id === id);
    if (!e) {
      errs.push(`Szene ${sid}: Asset ${id} fehlt in assets-manifest.json`);
      continue;
    }
    for (const f of ['url', 'license', 'author', 'year', 'resolution', 'file']) if (!e[f]) errs.push(`Manifest ${id}: ${f} fehlt`);
    if (e.file && !existsSync(join(projectDir, e.file))) errs.push(`Manifest ${id}: Datei ${e.file} fehlt`);
    if (e.visuallyChecked !== true) errs.push(`Manifest ${id}: visuallyChecked muss true sein (Bild vor dem Rendern ansehen)`);
  }
  return errs;
};

/** Szenen-Quelltexte (HyperFrames-HTML, Manim) auf Emojis und verbotene Effekte pruefen. */
const scanSceneFiles = (sb, projectDir) => {
  const errs = [];
  for (const s of sb.scenes) {
    const f = s.tool === 'hyperframes-gsap' ? join(projectDir, s.html ?? '-', 'index.html') : s.tool === 'manim-python' ? join(projectDir, s.manim?.file ?? '-') : null;
    if (!f || !existsSync(f)) continue;
    const src = readFileSync(f, 'utf8');
    if (EMOJI.test(src)) errs.push(`Szene ${s.id}: Emoji im Quelltext`);
    if (/backdrop-filter/i.test(src)) errs.push(`Szene ${s.id}: backdrop-filter (Glas-Panel) im Quelltext`);
    if (/repeat\s*:\s*-1|yoyo\s*:\s*true/.test(src)) errs.push(`Szene ${s.id}: Endlos-/Yoyo-Animation (Idle-Wackeln) im Quelltext`);
    if (s.tool === 'hyperframes-gsap') {
      if (!/href="roles\.css"/.test(src)) errs.push(`Szene ${s.id}: roles.css nicht eingebunden (gemeinsame Schrift-Rollen)`);
      if (/font-family\s*:/i.test(src)) errs.push(`Szene ${s.id}: eigenes font-family im HTML – Schriften nur ueber roles.css (.role-*)`);
    }
  }
  // Remotion-Szenen: Schriften nur ueber shared/typography.tsx.
  for (const s of sb.scenes.filter((x) => x.tool.startsWith('remotion'))) {
    const f = join(projectDir, '..', '..', 'remotion', 'scenes', `${s.component}.tsx`);
    if (!existsSync(f)) {
      errs.push(`Szene ${s.id}: remotion/scenes/${s.component}.tsx nicht gefunden`);
      continue;
    }
    const src = readFileSync(f, 'utf8');
    if (/fontFamily\s*:/.test(src)) errs.push(`Szene ${s.id}: ${s.component}.tsx setzt fontFamily selbst – nur RoleText/roleStyle aus shared/typography`);
    if (EMOJI.test(src)) errs.push(`Szene ${s.id}: Emoji in ${s.component}.tsx`);
    if (/backdropFilter/.test(src)) errs.push(`Szene ${s.id}: backdropFilter (Glas-Panel) in ${s.component}.tsx`);
  }
  return errs;
};

/** Liest und prueft storyboard.json. Wirft mit allen Fehlern auf einmal. */
export const loadStoryboard = (projectDir) => {
  const file = join(projectDir, 'storyboard.json');
  if (!existsSync(file)) throw new Error(`${file} fehlt`);
  let sb;
  try {
    sb = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`storyboard.json ist kein gueltiges JSON: ${e.message}`);
  }
  const errs = [];
  if (!(sb.format in FORMATS)) errs.push('format muss "16x9" oder "9x16" sein');
  if (!Array.isArray(sb.scenes) || sb.scenes.length === 0) errs.push('scenes fehlt oder ist leer');
  else {
    sb.scenes.forEach((s, i) => errs.push(...checkScene(s, i, projectDir)));
    const ids = sb.scenes.map((s) => s.id);
    if (new Set(ids).size !== ids.length) errs.push('Szenen-ids sind nicht eindeutig');
  }
  errs.push(...checkManifest(sb, projectDir));
  errs.push(...scanSceneFiles(sb, projectDir));
  if (errs.length) throw new Error(`storyboard.json ungueltig:\n  - ${errs.join('\n  - ')}`);
  return sb;
};

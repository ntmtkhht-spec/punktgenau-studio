// Szenen-Router: rendert jede Szene mit ihrem Tool und normalisiert sie auf Format, 30 fps, exakte Dauer.
import {execFileSync} from 'node:child_process';
import {cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {FORMATS, FPS} from './storyboard.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const EDITORIAL = join(ROOT, 'editorial');
const MANIM_DIR = join(ROOT, 'manim-scenes');
const MANIM_PY = join(MANIM_DIR, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
// Blender: BLENDER_EXE setzen oder Standard-Installation unter Windows bzw. blender im PATH.
const BLENDER = process.env.BLENDER_EXE ?? (process.platform === 'win32' ? 'C:/Program Files/Blender Foundation/Blender 5.1/blender.exe' : 'blender');
const MIKTEX_BIN = join(homedir(), 'scoop', 'apps', 'miktex', 'current', 'texmfs', 'install', 'miktex', 'bin', 'x64');

const quote = (a) => (/[\s"]/.test(a) ? `"${a.replaceAll('"', '\\"')}"` : a);

/** Fuehrt einen Befehl aus; npx braucht unter Windows eine Shell. Bricht mit klarer Meldung ab. */
const run = (cmd, args, opts = {}) => {
  const shell = cmd === 'npx';
  try {
    execFileSync(shell ? [cmd, ...args.map(quote)].join(' ') : cmd, shell ? [] : args, {stdio: 'inherit', shell, ...opts});
  } catch (e) {
    throw new Error(`${cmd} ${args.slice(0, 3).join(' ')} … fehlgeschlagen (Exit ${e.status ?? '?'})`);
  }
};

const ffmpeg = (args) => run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);

const sceneProps = (sb, scene) => ({format: sb.format, durationSec: scene.durationSec, wallpaper: scene.wallpaper ?? undefined});

const remotion = (kind, comp, out, props, work, extra = []) => {
  const propsFile = join(work, `${comp}-${Date.now()}.props.json`);
  writeFileSync(propsFile, JSON.stringify(props));
  run('npx', ['remotion', kind, 'remotion/index.ts', comp, out, `--props=${propsFile}`, '--gl=angle', '--log=error', ...extra], {cwd: EDITORIAL});
};

const renderWallpaperVideo = (sb, scene, work) => {
  const out = join(work, `${scene.id}-bg.mp4`);
  remotion('render', 'Wallpaper', out, sceneProps(sb, scene), work);
  return out;
};

const renderRemotion = (sb, scene, work, projectDir) => {
  const assetsDir = join(projectDir, 'assets');
  if (existsSync(assetsDir)) {
    const pubAssets = join(EDITORIAL, 'public', 'assets');
    mkdirSync(pubAssets, {recursive: true});
    cpSync(assetsDir, pubAssets, {recursive: true});
  }
  const out = join(work, `${scene.id}-raw.mp4`);
  remotion('render', scene.component, out, sceneProps(sb, scene), work);
  return out;
};

const renderHyperframes = (sb, scene, work, projectDir) => {
  const {width, height} = FORMATS[sb.format];
  const dir = join(work, `hf-${scene.id}`);
  rmSync(dir, {recursive: true, force: true});
  cpSync(join(projectDir, scene.html), dir, {recursive: true});
  const index = join(dir, 'index.html');
  const html = readFileSync(index, 'utf8')
    .replaceAll('__W__', String(width))
    .replaceAll('__H__', String(height))
    .replaceAll('__U__', String(Math.min(width, height) / 100))
    .replaceAll('__DUR__', String(scene.durationSec));
  writeFileSync(index, html);
  // Gemeinsame Schrift-Rollen (Skill editorial-typography) in jede HF-Szene legen.
  cpSync(join(EDITORIAL, 'hyperframes', 'roles.css'), join(dir, 'roles.css'));
  writeFileSync(join(dir, 'hyperframes.json'), JSON.stringify({paths: {assets: 'assets'}}, null, 2));
  if (scene.wallpaper) remotion('still', 'Wallpaper', join(dir, 'bg.png'), sceneProps(sb, scene), work, ['--frame=0']);
  const out = join(work, `${scene.id}-raw.mp4`);
  run('npx', ['hyperframes', 'render', dir, '-o', out, '--quality', 'looks', '--quiet'], {env: {...process.env, HYPERFRAMES_SKIP_SKILLS: '1'}});
  return out;
};

const newestMov = (dir) => {
  const found = [];
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) {
        if (f !== 'partial_movie_files') walk(p);
      } else if (f.endsWith('.mov')) found.push(p);
    }
  };
  walk(dir);
  return found.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
};

const renderManim = (sb, scene, work, projectDir) => {
  if (!existsSync(MANIM_PY)) throw new Error('Manim-Umgebung fehlt: cd manim-scenes && uv venv --python 3.13 .venv && uv pip install --python .venv/Scripts/python.exe "manim>=0.19"');
  const {width, height} = FORMATS[sb.format];
  const media = join(work, `manim-${scene.id}`);
  rmSync(media, {recursive: true, force: true});
  const env = {...process.env, ED_DURATION: String(scene.durationSec), PATH: `${MIKTEX_BIN}${process.platform === 'win32' ? ';' : ':'}${process.env.PATH}`};
  // Manim behaelt sonst 14,2 x 8 Einheiten und verzerrt 9:16. Bildhoehe 8, Breite nach Seitenverhaeltnis.
  mkdirSync(media, {recursive: true});
  const cfg = join(media, 'format.cfg');
  writeFileSync(cfg, `[CLI]\nframe_height = 8\nframe_width = ${((8 * width) / height).toFixed(6)}\n`);
  run(MANIM_PY, ['-m', 'manim', 'render', '--config_file', cfg, '--transparent', '--format=mov', '-r', `${width},${height}`, '--fps', String(FPS), '--media_dir', media, '--disable_caching', join(projectDir, scene.manim.file), scene.manim.class], {env});
  const fg = newestMov(media);
  if (!fg) throw new Error(`Manim hat fuer ${scene.id} keine .mov erzeugt`);
  const bg = renderWallpaperVideo(sb, scene, work);
  const out = join(work, `${scene.id}-raw.mp4`);
  ffmpeg(['-i', bg, '-i', fg, '-filter_complex', '[0:v][1:v]overlay=0:0:shortest=0:eof_action=repeat[v]', '-map', '[v]', '-t', String(scene.durationSec), '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', out]);
  return out;
};

/** Blender-Skript rendert PNG mit Alpha (Konvention: `-- <ausgabe-ordner>`, ED_WIDTH/ED_HEIGHT/ED_DURATION). */
const renderBlender = (sb, scene, work, projectDir) => {
  if (process.platform === 'win32' && !process.env.BLENDER_EXE && !existsSync(BLENDER)) throw new Error(`Blender fehlt: ${BLENDER} (oder BLENDER_EXE setzen)`);
  const {width, height} = FORMATS[sb.format];
  const frames = join(work, `blender-${scene.id}`);
  rmSync(frames, {recursive: true, force: true});
  // ED_PREVIEW=1: Zwischenstand in halber Aufloesung (wird danach auf das Format hochskaliert), Full HD nur fuer den finalen Clip.
  const k = process.env.ED_PREVIEW ? 0.5 : 1;
  const env = {...process.env, ED_WIDTH: String(Math.round(width * k)), ED_HEIGHT: String(Math.round(height * k)), ED_DURATION: String(scene.durationSec)};
  run(BLENDER, ['-b', '-P', join(projectDir, scene.blender.file), '--', frames], {env});
  const bg = renderWallpaperVideo(sb, scene, work);
  const out = join(work, `${scene.id}-raw.mp4`);
  ffmpeg(['-i', bg, '-framerate', String(FPS), '-start_number', '0', '-i', join(frames, 'f%04d.png'), '-filter_complex', `[1:v]scale=${width}:${height}[fg];[0:v][fg]overlay=0:0:shortest=0:eof_action=repeat[v]`, '-map', '[v]', '-t', String(scene.durationSec), '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', out]);
  return out;
};

const RENDERERS = {
  'remotion-three': renderRemotion,
  'remotion-dom': renderRemotion,
  'hyperframes-gsap': renderHyperframes,
  'manim-python': renderManim,
  'blender-python': renderBlender,
};

/** Rendert eine Szene nach clips/<id>.mp4 (Format, 30 fps, exakte Dauer, ohne Ton). */
export const renderScene = (sb, scene, projectDir) => {
  const work = join(projectDir, '.work');
  const clips = join(projectDir, 'clips');
  mkdirSync(work, {recursive: true});
  mkdirSync(clips, {recursive: true});
  console.log(`\n▶ ${scene.id}  [${scene.tool}]  ${scene.archetype}, ${scene.durationSec}s`);
  const raw = RENDERERS[scene.tool](sb, scene, work, projectDir);
  const {width, height} = FORMATS[sb.format];
  const out = join(clips, `${scene.id}.mp4`);
  const d = String(scene.durationSec);
  ffmpeg([
    '-i', raw,
    '-vf', `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},fps=${FPS},tpad=stop_mode=clone:stop_duration=${d},format=yuv420p`,
    '-t', d, '-an', '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', out,
  ]);
  console.log(`  ✓ clips/${scene.id}.mp4`);
  return out;
};

export {ffmpeg};

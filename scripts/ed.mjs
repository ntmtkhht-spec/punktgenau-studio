#!/usr/bin/env node
// Editorial-Werkzeug (Ultralativ-angelehnter Stil, Multi-Tool). Aufruf aus editorial/: npm run ed -- <befehl>
//
//   new <slug> "<Titel>" --format 16x9|9x16   Projekt anlegen (storyboard.json/.md, script.md, hf/, manim/)
//   check <slug>                               storyboard.json streng pruefen
//   scene <slug> <szenen-id>                   eine Szene mit ihrem Tool rendern -> clips/<id>.mp4
//   build <slug>                               alle Szenen rendern, zusammenfuehren, Audit-Kontaktboegen
//   join <slug>                                nur zusammenfuehren + Audit (Clips existieren schon)
//   list                                       Projekte anzeigen
import {existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {assemble, audit, totalDuration} from './ed/assemble.mjs';
import {EDITORIAL, renderScene} from './ed/render.mjs';
import {FORMATS, loadStoryboard} from './ed/storyboard.mjs';

const PROJECTS = join(EDITORIAL, 'projects');
const projectDir = (slug) => join(PROJECTS, slug);

const fail = (msg) => {
  console.error(`Fehler: ${msg}`);
  process.exit(1);
};

const checkSlug = (slug) => {
  if (!/^\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/.test(slug ?? '')) fail('Slug muss so aussehen: 01-ki-kunst');
};

const requireProject = (slug) => {
  checkSlug(slug);
  if (!existsSync(projectDir(slug))) fail(`Projekt ${slug} gibt es nicht. Erst: npm run ed -- new ${slug} "<Titel>" --format 16x9`);
  return loadStoryboard(projectDir(slug));
};

const cmdNew = (slug, title, args) => {
  checkSlug(slug);
  if (!title) fail('Titel fehlt');
  const fi = args.indexOf('--format');
  const format = fi >= 0 ? args[fi + 1] : undefined;
  if (!(format in FORMATS)) fail('Format waehlen: --format 16x9 (Widescreen 1920x1080) oder --format 9x16 (Short 1080x1920)');
  const dir = projectDir(slug);
  if (existsSync(dir)) fail(`${slug} existiert schon`);
  for (const d of ['', 'hf', 'manim', 'audio']) mkdirSync(join(dir, d), {recursive: true});
  writeFileSync(join(dir, 'script.md'), `# ${title}\n\nFormat: ${format}\n\n## Skript\n1. \n\n## Fakten-Check\n- \n\n## Quellen & Lizenzen\n- \n`);
  writeFileSync(join(dir, 'storyboard.md'), `# Storyboard: ${title}\n\nFormat: ${format}. Pro Szene alle Felder aus dem Skill ausfuellen und begruenden.\n`);
  writeFileSync(join(dir, 'storyboard.json'), JSON.stringify({slug, title, format, scenes: []}, null, 2));
  console.log(`Angelegt: editorial/projects/${slug}  (${format})`);
};

const cmdCheck = (slug) => {
  const sb = requireProject(slug);
  console.log(`✓ storyboard.json gueltig: ${sb.scenes.length} Szenen, ${totalDuration(sb.scenes).toFixed(2)} s, ${sb.format}`);
  for (const s of sb.scenes) console.log(`  ${s.id.padEnd(6)} ${s.tool.padEnd(17)} ${s.dimension.padEnd(4)} ${s.archetype}  → ${s.transition.type}`);
};

const cmdScene = (slug, id) => {
  const sb = requireProject(slug);
  const scene = sb.scenes.find((s) => s.id === id);
  if (!scene) fail(`Szene ${id} nicht im Storyboard (${sb.scenes.map((s) => s.id).join(', ')})`);
  renderScene(sb, scene, projectDir(slug));
};

const cmdJoin = (slug) => {
  const sb = requireProject(slug);
  assemble(sb, projectDir(slug));
  audit(sb, projectDir(slug));
};

const cmdBuild = (slug) => {
  const sb = requireProject(slug);
  for (const scene of sb.scenes) renderScene(sb, scene, projectDir(slug));
  assemble(sb, projectDir(slug));
  audit(sb, projectDir(slug));
};

const cmdList = () => {
  if (!existsSync(PROJECTS)) return console.log('Noch keine Projekte.');
  for (const slug of readdirSync(PROJECTS)) {
    const file = join(projectDir(slug), 'storyboard.json');
    if (!existsSync(file)) continue;
    const sb = JSON.parse(readFileSync(file, 'utf8'));
    const done = existsSync(join(projectDir(slug), 'export', `${slug}.mp4`)) ? 'exportiert' : 'offen';
    console.log(`${slug.padEnd(24)} ${sb.format.padEnd(5)} ${String(sb.scenes.length).padStart(2)} Szenen  ${done}  ${sb.title}`);
  }
};

const [cmd, a, b, ...rest] = process.argv.slice(2);
try {
  if (cmd === 'new') cmdNew(a, b, rest);
  else if (cmd === 'check') cmdCheck(a);
  else if (cmd === 'scene') cmdScene(a, b);
  else if (cmd === 'build') cmdBuild(a);
  else if (cmd === 'join') cmdJoin(a);
  else if (cmd === 'list') cmdList();
  else fail('Befehle: new, check, scene, build, join, list');
} catch (e) {
  fail(e.message);
}

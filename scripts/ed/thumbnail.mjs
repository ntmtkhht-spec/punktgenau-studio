// Editorial-Thumbnail (Skill thumbnail-design, Modus B): Plan pruefen, rendern (Remotion-Still oder
// HyperFrames-Einzelbild), danach Feed-Test und Audit aus scripts/thumbnail.mjs.
import {execFileSync} from 'node:child_process';
import {cpSync, existsSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {ASPECTS, auditThumbnail, checkPlan, thumbDir} from '../thumbnail.mjs';
import {EDITORIAL} from './render.mjs';

const sh = (cmd, opts = {}) => execFileSync(cmd, {stdio: 'inherit', shell: true, ...opts});

export const thumbnail = (projectDir) => {
  const {plan, selected} = checkPlan(projectDir, 'editorial');
  const [w, h] = ASPECTS[plan.aspectRatio].full;
  const out = thumbDir(projectDir);
  const full = join(out, 'thumbnail_full.png');
  const format = plan.aspectRatio === '16:9' ? '16x9' : '9x16';

  if (selected.render.tool === 'remotion') {
    const props = join(out, 'props.json');
    writeFileSync(props, JSON.stringify({format, durationSec: 1}));
    sh(`npx remotion still remotion/index.ts ${selected.render.component} "${full}" --props="${props}" --gl=angle --log=error`, {cwd: EDITORIAL});
  } else {
    // HyperFrames: 1-Sekunden-Komposition rendern, letztes Bild ziehen. Gleiche Platzhalter wie die Szenen.
    const src = join(projectDir, selected.render.html);
    const dir = join(out, 'hf');
    rmSync(dir, {recursive: true, force: true});
    cpSync(src, dir, {recursive: true});
    const index = join(dir, 'index.html');
    writeFileSync(index, readFileSync(index, 'utf8').replaceAll('__W__', String(w)).replaceAll('__H__', String(h)).replaceAll('__U__', String(Math.min(w, h) / 100)).replaceAll('__DUR__', '1'));
    cpSync(join(EDITORIAL, 'hyperframes', 'roles.css'), join(dir, 'roles.css'));
    const mp4 = join(out, 'thumb.mp4');
    sh(`npx hyperframes render "${dir}" -o "${mp4}" --quality delivery --quiet`, {env: {...process.env, HYPERFRAMES_SKIP_SKILLS: '1'}});
    sh(`ffmpeg -hide_banner -loglevel error -y -sseof -0.05 -i "${mp4}" -frames:v 1 "${full}"`);
  }
  if (!existsSync(full)) throw new Error('Thumbnail wurde nicht erzeugt');
  console.log(`\nThumbnail-Audit (${selected.id}, ${selected.archetype}):`);
  auditThumbnail(full, plan, selected);
};

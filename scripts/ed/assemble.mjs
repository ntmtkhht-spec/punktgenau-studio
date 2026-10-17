// Zusammenfuehren: Clips + Uebergaenge (ffmpeg xfade) + Stimme/Musik -> export/<slug>.mp4, danach Audit-Kontaktboegen.
import {existsSync, mkdirSync, readdirSync, rmSync} from 'node:fs';
import {join} from 'node:path';
import {ffmpeg} from './render.mjs';
import {FORMATS, FPS, TRANSITIONS} from './storyboard.mjs';

/** Gesamtdauer: Summe der Szenen minus Ueberlappung der Uebergaenge. */
const overlapOf = (s) => (TRANSITIONS[s.transition.type] && s.transition.durationSec > 0 ? s.transition.durationSec : 1 / FPS);

export const totalDuration = (scenes) =>
  scenes.reduce((sum, s, i) => sum + s.durationSec - (i < scenes.length - 1 ? overlapOf(s) : 0), 0);

const videoGraph = (scenes) => {
  const parts = [];
  let prev = '[0:v]';
  let offset = 0;
  scenes.slice(0, -1).forEach((s, i) => {
    const name = TRANSITIONS[s.transition.type];
    const d = overlapOf(s);
    offset += s.durationSec - d;
    const out = `[v${i + 1}]`;
    // Harter Schnitt = xfade ueber genau ein Frame, damit die Kette einheitlich bleibt.
    const xf = `xfade=transition=${name && s.transition.durationSec > 0 ? name : 'fade'}:duration=${d.toFixed(4)}:offset=${offset.toFixed(4)}`;
    parts.push(`${prev}[${i + 1}:v]${xf}${out}`);
    prev = out;
  });
  return {graph: parts.join(';'), last: prev};
};

/** Baut das Gesamtvideo. Stimme/Musik optional aus <projekt>/audio/voice.wav, music.wav. */
export const assemble = (sb, projectDir) => {
  const clips = sb.scenes.map((s) => join(projectDir, 'clips', `${s.id}.mp4`));
  const missing = clips.filter((c) => !existsSync(c));
  if (missing.length) throw new Error(`Clips fehlen (erst rendern): ${missing.join(', ')}`);
  const exportDir = join(projectDir, 'export');
  mkdirSync(exportDir, {recursive: true});
  const out = join(exportDir, `${sb.slug}.mp4`);
  const dur = totalDuration(sb.scenes);

  const inputs = clips.flatMap((c) => ['-i', c]);
  const {graph, last} = sb.scenes.length > 1 ? videoGraph(sb.scenes) : {graph: '[0:v]null[vout]', last: '[vout]'};
  const voice = join(projectDir, 'audio', 'voice.wav');
  const music = join(projectDir, 'audio', 'music.wav');
  const n = clips.length;
  const audioIn = [];
  const audioParts = [];
  if (existsSync(voice)) {
    audioIn.push('-i', voice);
    audioParts.push(`[${n + audioParts.length}:a]volume=1.0[a${audioParts.length}]`);
  }
  if (existsSync(music)) {
    audioIn.push('-i', music);
    audioParts.push(`[${n + audioParts.length}:a]volume=0.18[a${audioParts.length}]`);
  }
  let audioGraph;
  if (audioParts.length === 0) {
    audioIn.push('-f', 'lavfi', '-t', String(dur), '-i', 'anullsrc=r=48000:cl=stereo');
    audioGraph = `[${n}:a]anull[aout]`;
  } else {
    const labels = audioParts.map((_, i) => `[a${i}]`).join('');
    audioGraph = `${audioParts.join(';')};${labels}amix=inputs=${audioParts.length}:normalize=0,apad[aout]`;
  }

  ffmpeg([
    ...inputs, ...audioIn,
    '-filter_complex', `${graph};${audioGraph}`,
    '-map', last, '-map', '[aout]', '-t', dur.toFixed(3),
    '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out,
  ]);
  console.log(`\n✓ export/${sb.slug}.mp4  (${dur.toFixed(2)} s, ${sb.format})`);
  return out;
};

/** Kontaktboegen: alle 0,5 s ein Bild mit Zeitstempel, 16 Bilder pro Bogen. */
export const audit = (sb, projectDir) => {
  const video = join(projectDir, 'export', `${sb.slug}.mp4`);
  if (!existsSync(video)) throw new Error('Kein Export vorhanden. Erst: ed build');
  const dir = join(projectDir, 'audit');
  rmSync(dir, {recursive: true, force: true});
  mkdirSync(dir, {recursive: true});
  const portrait = FORMATS[sb.format].height > FORMATS[sb.format].width;
  const tile = portrait ? '6x2' : '4x4';
  const cell = portrait ? 'scale=320:-2' : 'scale=480:-2';
  const font = process.platform === 'win32' ? 'C\\:/Windows/Fonts/consola.ttf' : '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf';
  ffmpeg([
    '-i', video,
    '-vf', `fps=2,${cell},drawtext=fontfile='${font}':text='%{pts\\:hms}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=4,tile=${tile}:padding=4:color=white`,
    '-q:v', '3', join(dir, 'sheet_%03d.jpg'),
  ]);
  const sheets = readdirSync(dir).filter((f) => f.endsWith('.jpg'));
  console.log(`✓ audit/: ${sheets.length} Kontaktboegen`);
  return sheets.map((f) => join(dir, f));
};

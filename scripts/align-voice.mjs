// Fuehrt Satz-Audios (eine Datei pro Skriptzeile) zusammen und erzeugt Wortzeiten ohne Whisper:
// Satzgrenzen sind exakt (Dateigrenzen), Woerter werden innerhalb eines Satzes nach Laenge
// auf die gesprochenen Abschnitte verteilt (Stille-Erkennung per ffmpeg).
//
// Aufruf:
// node scripts/align-voice.mjs <skript.md> <audio-ordner> <ausgabe-audio> <ausgabe-words.json>
import {execFileSync, spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const [scriptPath, audioDir, outAudio, outWords] = process.argv.slice(2);
const GAP = 0.15; // Pause zwischen zwei Saetzen (Sekunden)

const lines = readFileSync(scriptPath, 'utf8')
  .split(/\r?\n/)
  .map((l) => l.match(/^(\d+)\.\s+(.*\S)\s*$/))
  .filter(Boolean)
  .map((m) => m[2]);

const probeDuration = (file) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());

const silences = (file) => {
  const res = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', 'silencedetect=noise=-40dB:d=0.12', '-f', 'null', '-'], {encoding: 'utf8'});
  const starts = [...res.stderr.matchAll(/silence_start: ([0-9.]+)/g)].map((m) => Number(m[1]));
  const ends = [...res.stderr.matchAll(/silence_end: ([0-9.]+)/g)].map((m) => Number(m[1]));
  return starts.map((s, i) => [s, ends[i] ?? Infinity]);
};

/** Gesprochene Abschnitte [a, b] eines Satzes (Stille herausgeschnitten). */
const speechSegments = (dur, sil) => {
  const segs = [];
  let cursor = 0;
  for (const [s, e] of sil) {
    if (s > cursor + 0.02) segs.push([cursor, Math.min(s, dur)]);
    cursor = Math.max(cursor, e);
  }
  if (cursor < dur - 0.02) segs.push([cursor, dur]);
  return segs;
};

const files = lines.map((_, i) => join(audioDir, `audio${i + 1}.mp3`));
const words = [];
const trims = [];
let offset = 0.1;

lines.forEach((line, li) => {
  const dur = probeDuration(files[li]);
  const segs = speechSegments(dur, silences(files[li]));
  const speechEnd = segs[segs.length - 1][1];
  trims.push({file: files[li], end: speechEnd});

  // Woerter nach Laenge auf die "Sprechzeit-Achse" (ohne Stille) verteilen
  const toks = line.split(/\s+/).filter(Boolean);
  const weight = (t) => 1.2 + t.replace(/[^\p{L}\p{N}]/gu, '').length;
  const total = toks.reduce((a, t) => a + weight(t), 0);
  const speechLen = segs.reduce((a, [x, y]) => a + (y - x), 0);
  const mapBack = (u) => {
    let rest = u;
    for (const [x, y] of segs) {
      if (rest <= y - x) return x + rest;
      rest -= y - x;
    }
    return speechEnd;
  };
  let acc = 0;
  toks.forEach((tok) => {
    const a = (acc / total) * speechLen;
    acc += weight(tok);
    const b = (acc / total) * speechLen;
    words.push({text: tok, start: +(offset + mapBack(a)).toFixed(3), end: +(offset + mapBack(b)).toFixed(3), line: li});
  });
  offset += speechEnd + GAP;
});

// Audio zusammenfuegen: jede Datei auf das Sprachende kuerzen, dazwischen kurze Pause
const inputs = trims.flatMap((t) => ['-i', t.file]);
const parts = trims.map((t, i) => `[${i}:a]atrim=0:${t.end.toFixed(3)},apad=pad_dur=${GAP}[a${i}]`).join(';');
const concat = trims.map((_, i) => `[a${i}]`).join('') + `concat=n=${trims.length}:v=0:a=1,adelay=100:all=1[out]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', `${parts};${concat}`, '-map', '[out]', '-ar', '48000', outAudio]);

writeFileSync(outWords, JSON.stringify(words, null, 1));
console.log(`${lines.length} Saetze, ${words.length} Woerter, Gesamtdauer ${offset.toFixed(2)} s`);

// Wortzeiten aus Whisper + Text aus dem Skript -> words.json fuer die Captions, plus zusammengefuegte Tonspur.
// Angezeigt wird immer der Skript-Text; Whisper liefert nur die Zeiten. Weichen die Wortgrenzen ab
// (z. B. Zahlwoerter), werden die Zeiten ueber die Zeichenposition im Satz uebertragen.
//
// Aufruf: node scripts/align-whisper.mjs <skript.md> <whisper.json> <ausgabe-audio> <ausgabe-words.json>
import {execFileSync, spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';

const [scriptPath, whisperPath, outAudio, outWords] = process.argv.slice(2);
// --full: Aufnahmen nicht kuerzen (eigene Pausen und Tempo der Sprecher bleiben erhalten)
const FULL = process.argv.includes('--full');
const GAP = 0.15; // Pause zwischen zwei Saetzen
const TAIL = 0.12; // Nachlauf nach dem letzten Wort eines Satzes
const LEAD = 0.1; // Stille ganz am Anfang

/** Ende der Sprache laut Pegel: Beginn der Schluss-Stille. Whisper setzt Wortenden oft zu frueh -> abgeschnittene Endungen. */
const audibleEnd = (file, duration) => {
  const res = spawnSync('ffmpeg', ['-hide_banner', '-i', file.replace(/^\/c\//, 'C:/'), '-af', 'silencedetect=noise=-45dB:d=0.1', '-f', 'null', '-'], {encoding: 'utf8'});
  const starts = [...res.stderr.matchAll(/silence_start: ([0-9.]+)/g)].map((m) => Number(m[1]));
  const ends = [...res.stderr.matchAll(/silence_end: ([0-9.]+)/g)].map((m) => Number(m[1]));
  const last = starts.length - 1;
  // nur zaehlen, wenn diese Stille bis zum Dateiende reicht (neuere ffmpeg melden dort trotzdem ein silence_end)
  const trailing = last >= 0 && (ends.length === last || ends[last] >= duration - 0.06);
  return trailing ? starts[last] : duration;
};

const lines = readFileSync(scriptPath, 'utf8')
  .split(/\r?\n/)
  .map((l) => l.match(/^(\d+)\.\s+(.*\S)\s*$/))
  .filter(Boolean)
  .map((m) => m[2]);
const whisper = JSON.parse(readFileSync(whisperPath, 'utf8'));
if (whisper.length !== lines.length) {
  throw new Error(`Skript hat ${lines.length} Saetze, Whisper ${whisper.length} Dateien`);
}

const letters = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

/** Zeitpunkt an relativer Zeichenposition p (0..1) innerhalb der Whisper-Woerter. */
const timeAt = (ww, p) => {
  const lens = ww.map((w) => Math.max(1, letters(w.word).length));
  const total = lens.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let i = 0; i < ww.length; i++) {
    const a = acc / total;
    const b = (acc + lens[i]) / total;
    if (p <= b || i === ww.length - 1) {
      const f = b > a ? Math.min(1, Math.max(0, (p - a) / (b - a))) : 0;
      return ww[i].start + f * (ww[i].end - ww[i].start);
    }
    acc += lens[i];
  }
  return ww[ww.length - 1].end;
};

const words = [];
const trims = [];
let offset = LEAD;
lines.forEach((line, li) => {
  const ww = whisper[li].words;
  const toks = line.split(/\s+/).filter(Boolean);
  const sameCount = ww.length === toks.length;
  const lens = toks.map((t) => Math.max(1, letters(t).length));
  const total = lens.reduce((a, b) => a + b, 0);
  let acc = 0;
  toks.forEach((tok, i) => {
    let start;
    let end;
    if (sameCount) {
      start = ww[i].start;
      end = ww[i].end;
    } else {
      start = timeAt(ww, acc / total);
      end = timeAt(ww, (acc + lens[i]) / total);
    }
    acc += lens[i];
    words.push({text: tok, start: +(offset + start).toFixed(3), end: +(offset + end).toFixed(3), line: li});
  });
  const heard = audibleEnd(whisper[li].file, whisper[li].duration);
  const speechEnd = FULL ? whisper[li].duration : Math.min(whisper[li].duration, Math.max(ww[ww.length - 1].end, heard) + TAIL);
  trims.push({file: whisper[li].file, end: speechEnd});
  offset += speechEnd + GAP;
  console.log(`Satz ${li + 1}: ${sameCount ? 'Woerter 1:1' : `Skript ${toks.length} / Whisper ${ww.length} Woerter -> Zeichen-Abgleich`}`);
});

const inputs = trims.flatMap((t) => ['-i', t.file.replace(/^\/c\//, 'C:/')]);
const parts = trims.map((t, i) => `[${i}:a]atrim=0:${t.end.toFixed(3)},apad=pad_dur=${GAP}[a${i}]`).join(';');
const concat = trims.map((_, i) => `[a${i}]`).join('') + `concat=n=${trims.length}:v=0:a=1,adelay=${LEAD * 1000}:all=1[out]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', `${parts};${concat}`, '-map', '[out]', '-ar', '48000', outAudio]);

writeFileSync(outWords, JSON.stringify(words, null, 1));
// Exaktes Ende der Stimme (ohne Pause nach dem letzten Satz) -> Videolaenge fuer einen sauberen Loop
writeFileSync(outWords.replace(/words\.json$/, 'timing.json'), JSON.stringify({voiceEnd: +(offset - GAP).toFixed(3)}, null, 1));
console.log(`Gesamtdauer ${offset.toFixed(2)} s, ${words.length} Woerter`);

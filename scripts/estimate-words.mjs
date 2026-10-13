// Schaetzt Wortzeiten aus dem Voice-Skript (Markdown, nummerierte Zeilen).
// Wird spaeter durch echte Whisper-Zeiten ersetzt (gleiches Format).
// Aufruf: node scripts/estimate-words.mjs scripts/01-phantomstau.md remotion-shorts/src/phantom/words.json
import {readFileSync, writeFileSync} from 'node:fs';

const [src, out] = process.argv.slice(2);
const lines = readFileSync(src, 'utf8')
  .split(/\r?\n/)
  .map((l) => l.match(/^(\d+)\.\s+(.*\S)\s*$/))
  .filter(Boolean)
  .map((m) => m[2]);

let t = 0.15;
const words = [];
lines.forEach((line, li) => {
  const toks = line.split(/\s+/).filter(Boolean);
  toks.forEach((tok) => {
    const letters = tok.replace(/[^\p{L}\p{N}]/gu, '').length;
    const dur = 0.1 + 0.034 * letters;
    words.push({text: tok, start: +t.toFixed(3), end: +(t + dur).toFixed(3), line: li});
    t += dur + 0.02;
    if (/[.?!:]$/.test(tok)) t += 0.2;
    else if (/,$/.test(tok)) t += 0.07;
  });
  t += 0.12;
});
writeFileSync(out, JSON.stringify(words, null, 1));
console.log(`${lines.length} Zeilen, ${words.length} Woerter, Dauer ca. ${t.toFixed(1)} s`);

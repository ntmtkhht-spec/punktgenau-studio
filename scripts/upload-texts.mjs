// Upload-Hilfen aus den echten Wortzeiten: YouTube-Kapitelmarken und SRT-Untertitel.
// Genutzt von `pg chapters <slug>` und `pg srt <slug>`.
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const STOP = /^##\s+(Fakten-Check|Quellen|Bildplan|Kontinuit|Arbeitsblatt)/i;
const MAX_CUE_CHARS = 42;

/** SRT-Zeitstempel 00:01:02,345 */
export const fmtTime = (s) => {
  const ms = Math.round(s * 1000);
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

const stamp = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`;

/**
 * Kapitel aus "## Kapitel: ..."-Ueberschriften im Skript; Zeitpunkt = Start des ersten Absatzes danach.
 * Schreibt export/kapitel.txt (fuer die Beschreibung) und chapters.json neben words.json.
 */
export const writeChapters = (scriptPath, words, exportDir, chaptersJson) => {
  const lines = readFileSync(scriptPath, 'utf8').split(/\r?\n/);
  const chapters = [];
  let para = 0;
  let pending = null;
  for (const l of lines) {
    if (STOP.test(l)) break;
    const h = l.match(/^##\s+(.*\S)/);
    if (h) pending = h[1].replace(/^Kapitel\s*\d*[:.]?\s*/i, '');
    else if (/^\d+\.\s+\S/.test(l)) {
      if (pending !== null) {
        const w = words.find((x) => x.line === para);
        chapters.push({title: pending, line: para, start: chapters.length === 0 ? 0 : w ? w.start : 0});
        pending = null;
      }
      para++;
    }
  }
  if (chapters.length === 0) throw new Error('Keine Kapitel gefunden (Ueberschriften "## Kapitel: ..." vor den Absaetzen)');
  // YouTube zeigt Kapitel nur bei mindestens 3 Marken, Start 0:00 und je mindestens 10 s.
  const warnings = [];
  if (chapters.length < 3) warnings.push('YouTube braucht mindestens 3 Kapitel.');
  const tooShort = chapters.filter((c, i) => i > 0 && c.start - chapters[i - 1].start < 10).map((c) => c.title);
  if (tooShort.length) warnings.push(`Kapitel kuerzer als 10 s vor: ${tooShort.join(', ')}`);
  const txt = chapters.map((c) => `${stamp(c.start)} ${c.title}`).join('\n');
  mkdirSync(exportDir, {recursive: true});
  writeFileSync(join(exportDir, 'kapitel.txt'), `${txt}\n`);
  writeFileSync(chaptersJson, JSON.stringify(chapters, null, 1));
  return {txt, warnings};
};

/** SRT aus den Wortzeiten: Gruppen bis ca. 42 Zeichen, Umbruch nach Satzzeichen, keine Ueberlappung. */
export const writeSrt = (words, outFile) => {
  const cues = [];
  let cur = [];
  for (const w of words) {
    if (cur.length && [...cur, w].map((x) => x.text).join(' ').length > MAX_CUE_CHARS) {
      cues.push(cur);
      cur = [];
    }
    cur = [...cur, w];
    if (/[.?!:]["“”]?$/.test(w.text)) {
      cues.push(cur);
      cur = [];
    }
  }
  if (cur.length) cues.push(cur);
  const srt = cues
    .map((c, i) => {
      const next = cues[i + 1]?.[0].start ?? Infinity;
      const end = Math.min(c[c.length - 1].end + 0.2, next);
      return `${i + 1}\n${fmtTime(c[0].start)} --> ${fmtTime(end)}\n${c.map((x) => x.text).join(' ')}\n`;
    })
    .join('\n');
  writeFileSync(outFile, srt);
  return cues.length;
};

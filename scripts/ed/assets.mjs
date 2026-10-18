// Asset-Suche: laedt Archivwerke (Wikimedia Commons, Openverse) und Logos (SimpleIcons) und traegt sie ins assets-manifest.json ein – immer mit visuallyChecked: false.
// Freigabe erst nach Sichtpruefung: npm run ed -- approve <slug> <id>
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {extname, join} from 'node:path';

const UA = 'editorial-video-pipeline/1.0 (asset search)';
const SIMPLE_ICONS = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons';
const MAX_WIDTH = 2400;

const getJson = async (url) => {
  const res = await fetch(url, {headers: {'User-Agent': UA}});
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
};

const download = async (url, file) => {
  const res = await fetch(url, {headers: {'User-Agent': UA}});
  if (!res.ok) throw new Error(`Download ${url} -> HTTP ${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
};

const stripHtml = (v) => (v ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/** Commons-Datum -> "1818" oder "ca. 1817" (Wikidata-Reste wie "date QS:P571" entfernen). */
const cleanYear = (v) => {
  const t = stripHtml(v).replace(/date QS:.*$/i, '');
  const y = t.match(/\d{4}/);
  if (!y) return '';
  return /circa|ca\.|um |about/i.test(t) ? `ca. ${y[0]}` : y[0];
};

/** Lizenz nur protokollieren, nicht filtern – die Verantwortung fuer die Nutzung liegt beim Nutzer. */
const licenseLabel = (raw) => stripHtml(raw) || 'unbekannt';

const searchCommons = async (query) => {
  const q = encodeURIComponent(query);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=${MAX_WIDTH}&format=json`;
  const data = await getJson(url);
  return Object.values(data.query?.pages ?? {})
    .sort((a, b) => a.index - b.index)
    .map((p) => {
      const ii = p.imageinfo?.[0];
      const m = ii?.extmetadata ?? {};
      return {
        provider: 'wikimedia',
        title: p.title,
        page: ii?.descriptionurl,
        url: ii?.thumburl ?? ii?.url,
        mime: ii?.mime,
        license: licenseLabel(m.LicenseShortName?.value),
        author: stripHtml(m.Artist?.value),
        year: cleanYear(m.DateTimeOriginal?.value),
        resolution: `${ii?.thumbwidth ?? ii?.width}x${ii?.thumbheight ?? ii?.height}`,
      };
    })
    .filter((c) => /image\/(jpeg|png|webp)/.test(c.mime ?? ''));
};

const searchOpenverse = async (query) => {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=8`;
  const data = await getJson(url);
  return (data.results ?? [])
    .map((r) => ({
      provider: 'openverse',
      title: r.title,
      page: r.foreign_landing_url,
      url: r.url,
      license: licenseLabel([r.license, r.license_version].filter(Boolean).join(' ')),
      author: r.creator ?? '',
      year: '',
      resolution: r.width && r.height ? `${r.width}x${r.height}` : '',
    }))
    .filter((c) => c.url);
};

const fetchSimpleIcon = async (entity) => {
  const slug = entity.toLowerCase().replace(/[^a-z0-9]/g, '');
  return [{provider: 'simpleicons', title: entity, page: `https://simpleicons.org/?q=${slug}`, url: `${SIMPLE_ICONS}/${slug}.svg`, license: 'cc0', author: 'Simple Icons (Marke gehoert dem Inhaber)', year: '', resolution: 'vektor'}];
};

const readManifest = (dir) => {
  const f = join(dir, 'assets-manifest.json');
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {assets: []};
};
const writeManifest = (dir, m) => writeFileSync(join(dir, 'assets-manifest.json'), JSON.stringify(m, null, 2) + '\n');

/** Kandidaten fuer ein Storyboard-Asset suchen (query fuer Archivwerke, entity fuer Logos). */
const candidatesFor = async (a) => {
  if (a.class === 'logo-icon') {
    if (!a.entity) throw new Error(`${a.manifestId}: entity (z. B. "openai") fehlt`);
    return fetchSimpleIcon(a.entity);
  }
  if (!a.query) throw new Error(`${a.manifestId}: query (Suchbegriff, z. B. "Wanderer above the Sea of Fog") fehlt`);
  const commons = await searchCommons(a.query);
  return commons.length ? commons : searchOpenverse(a.query);
};

/**
 * Sucht und laedt alle Assets mit manifestId, die noch keine Datei haben.
 * pick = { [manifestId]: Kandidaten-Index } erlaubt einen anderen Treffer als den ersten.
 */
export const fetchAssets = async (sb, projectDir, pick = {}) => {
  const manifest = readManifest(projectDir);
  const assetsDir = join(projectDir, 'assets');
  mkdirSync(assetsDir, {recursive: true});
  const wanted = sb.scenes.flatMap((s) => (s.assets ?? []).filter((a) => a.manifestId && ['archiv-werk', 'logo-icon'].includes(a.class)));
  for (const a of wanted) {
    const existing = manifest.assets.find((e) => e.id === a.manifestId);
    const forced = pick[a.manifestId] !== undefined;
    if (existing && existsSync(join(projectDir, existing.file)) && !forced) {
      console.log(`= ${a.manifestId}: vorhanden (${existing.visuallyChecked ? 'geprueft' : 'NOCH NICHT angesehen'})`);
      continue;
    }
    const cands = await candidatesFor(a);
    if (!cands.length) {
      console.log(`✗ ${a.manifestId}: kein Treffer fuer "${a.query ?? a.entity}"`);
      continue;
    }
    cands.slice(0, 5).forEach((c, i) => console.log(`   [${i}] ${c.provider}  ${c.license}  ${c.title}  ${c.resolution}`));
    const c = cands[pick[a.manifestId] ?? 0];
    if (!c) throw new Error(`${a.manifestId}: Kandidat ${pick[a.manifestId]} gibt es nicht`);
    const ext = c.provider === 'simpleicons' ? '.svg' : extname(new URL(c.url).pathname).toLowerCase() || '.jpg';
    const file = `assets/${a.manifestId}${ext}`;
    await download(c.url, join(projectDir, file));
    const entry = {
      id: a.manifestId, file, url: c.page ?? c.url, source: c.url, provider: c.provider,
      license: c.license, author: c.author || 'unbekannt', year: c.year || 'unbekannt', resolution: c.resolution,
      visuallyChecked: false,
    };
    manifest.assets = [...manifest.assets.filter((e) => e.id !== a.manifestId), entry];
    console.log(`↓ ${a.manifestId}: ${file}  (${c.license}, ${c.author || 'unbekannt'}) – jetzt ansehen, dann: ed approve ${sb.slug} ${a.manifestId}`);
  }
  writeManifest(projectDir, manifest);
};

/** Sichtpruefung bestaetigen. Nur aufrufen, nachdem das Bild wirklich angesehen wurde. */
export const approveAsset = (projectDir, id) => {
  const manifest = readManifest(projectDir);
  const e = manifest.assets.find((x) => x.id === id);
  if (!e) throw new Error(`${id} nicht im Manifest`);
  if (!existsSync(join(projectDir, e.file))) throw new Error(`${e.file} fehlt`);
  manifest.assets = manifest.assets.map((x) => (x.id === id ? {...x, visuallyChecked: true} : x));
  writeManifest(projectDir, manifest);
  console.log(`✓ ${id} freigegeben`);
};

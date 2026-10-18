// Download and register curated authentic open-source font library for Punktgenau & Editorial Studio.
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const FONTS = [
  // 1. editorial-didone
  {
    family: 'Playfair Display',
    role: 'editorial-didone',
    file: 'PlayfairDisplay[wght].ttf',
    dir: 'ofl/playfairdisplay',
    weight: '400 900',
    style: 'normal',
    variable: true,
    designer: 'Claus Eggers Sørensen',
    license: 'OFL-1.1',
    description: 'Iconic high-contrast Didone serif with transitional ball terminals and sharp serifs. The primary title and thesis typeface of the channel.',
    recommendedFor: ['Kapitel-Titel', 'Thesen-Fragen', 'Philosophische Kernaussagen', 'Figuren-Rollen'],
  },
  {
    family: 'Playfair Display',
    role: 'editorial-didone',
    file: 'PlayfairDisplay-Italic[wght].ttf',
    dir: 'ofl/playfairdisplay',
    weight: '400 900',
    style: 'italic',
    variable: true,
    designer: 'Claus Eggers Sørensen',
    license: 'OFL-1.1',
    description: 'Calligraphic Didone italic for kicker dachzeilen, philosophical emphasis, and elegant thesis sublines.',
    recommendedFor: ['Dachzeilen über Blockschriften', 'Akzentwörter', 'Elegante Thesen-Sublines'],
  },
  {
    family: 'Bodoni Moda',
    role: 'editorial-didone',
    file: 'BodoniModa[opsz,wght].ttf',
    dir: 'ofl/bodonimoda',
    weight: '400 900',
    style: 'normal',
    variable: true,
    designer: 'Owen Earl, Indestructible Type',
    license: 'OFL-1.1',
    description: 'Ultra-refined digital revival of Giambattista Bodoni (Parma, 1798). Extreme thick-to-thin contrast, flat unbracketed serifs.',
    recommendedFor: ['Monumentale Hero-Titel', 'Großformatige Jahreszahlen', 'High-Fashion & Kultur-Essays'],
  },
  {
    family: 'Bodoni Moda',
    role: 'editorial-didone',
    file: 'BodoniModa-Italic[opsz,wght].ttf',
    dir: 'ofl/bodonimoda',
    weight: '400 900',
    style: 'italic',
    variable: true,
    designer: 'Owen Earl, Indestructible Type',
    license: 'OFL-1.1',
    description: 'Dramatic Italian Bodoni cursive with hairline swashes and extreme modulation.',
    recommendedFor: ['Hero-Kursiven', 'Historische Einleitungen'],
  },

  // 2. tall-condensed-serif
  {
    family: 'Instrument Serif',
    role: 'tall-condensed-serif',
    file: 'InstrumentSerif-Regular.ttf',
    dir: 'ofl/instrumentserif',
    weight: '400',
    style: 'normal',
    variable: false,
    designer: 'Rodrigo Fuenzalida, Jordan Runge (Instrument)',
    license: 'OFL-1.1',
    description: 'Ultra-aesthetic, slender transitional display serif with narrow proportions and delicate, razor-sharp terminals. Modern editorial darling.',
    recommendedFor: ['Monumentale Raum-Leitmotive', 'Große Schlagworte mit 3D-Schatten', 'Vertikale Text-Säulen'],
  },
  {
    family: 'Instrument Serif',
    role: 'tall-condensed-serif',
    file: 'InstrumentSerif-Italic.ttf',
    dir: 'ofl/instrumentserif',
    weight: '400',
    style: 'italic',
    variable: false,
    designer: 'Rodrigo Fuenzalida, Jordan Runge (Instrument)',
    license: 'OFL-1.1',
    description: 'Fast, sharp editorial italic with razor-thin hairline strokes and graceful rhythm.',
    recommendedFor: ['Geneigte Raum-Statements (-6°)', 'Dramatische Pointen'],
  },
  {
    family: 'DM Serif Display',
    role: 'tall-condensed-serif',
    file: 'DMSerifDisplay-Regular.ttf',
    dir: 'ofl/dmserifdisplay',
    weight: '400',
    style: 'normal',
    variable: false,
    designer: 'Colophon Foundry',
    license: 'OFL-1.1',
    description: 'High-contrast transitional display serif with robust sculptural brackets and punchy editorial presence.',
    recommendedFor: ['Stempel-Worte (TALENT vs ARBEIT)', 'Große Zahlenkombinationen'],
  },
  {
    family: 'DM Serif Display',
    role: 'tall-condensed-serif',
    file: 'DMSerifDisplay-Italic.ttf',
    dir: 'ofl/dmserifdisplay',
    weight: '400',
    style: 'italic',
    variable: false,
    designer: 'Colophon Foundry',
    license: 'OFL-1.1',
    description: 'Expressive display italic with organic drop terminals.',
    recommendedFor: ['Akzentuierte Schlagworte im Raum'],
  },
  {
    family: 'Cinzel',
    role: 'tall-condensed-serif',
    file: 'Cinzel[wght].ttf',
    dir: 'ofl/cinzel',
    weight: '400 900',
    style: 'normal',
    variable: true,
    designer: 'Natanael Gama',
    license: 'OFL-1.1',
    description: 'Classical Roman inscriptional capitals inspired by 1st-century monumental stone epigraphy.',
    recommendedFor: ['Epochen-Titel', 'Monumentale Römische Kapitelziffern', 'Institutionelle Mahnmale'],
  },

  // 3. heavy-plakat-grotesk
  {
    family: 'Anton',
    role: 'heavy-plakat-grotesk',
    file: 'Anton-Regular.ttf',
    dir: 'ofl/anton',
    weight: '400',
    style: 'normal',
    variable: false,
    designer: 'Vernon Adams',
    license: 'OFL-1.1',
    description: 'Rethought traditional German advertising wood-type display grotesque with immense stroke weight and dense geometry.',
    recommendedFor: ['Hype-Begriffe in Sprechblasen', '3D-Block-Extrusion', 'Laute Slogans'],
  },
  {
    family: 'Bebas Neue',
    role: 'heavy-plakat-grotesk',
    file: 'BebasNeue-Regular.ttf',
    dir: 'ofl/bebasneue',
    weight: '400',
    style: 'normal',
    variable: false,
    designer: 'Ryoichi Tsunekawa (Dharma Type)',
    license: 'OFL-1.1',
    description: 'Tall, condensed all-caps headline sans with clean geometric punch and compact line heights.',
    recommendedFor: ['Kompakte Banner', 'Extrudierte Vertikal-Titel', 'Plakative Vergleiche'],
  },
  {
    family: 'Rubik',
    role: 'heavy-plakat-grotesk',
    file: 'Rubik[wght].ttf',
    dir: 'ofl/rubik',
    weight: '300 900',
    style: 'normal',
    variable: true,
    designer: 'Hubert and Fischer, Meir Sadan, Cyreal',
    license: 'OFL-1.1',
    description: 'Slightly rounded stout sans-serif with massive heavy weights (800-900). Perfect for high-contrast thumbnails.',
    recommendedFor: ['YouTube-Thumbnails (minFontPx >= 110)', 'Kurze, knallige Stopp-Worte'],
  },
  {
    family: 'Rubik',
    role: 'heavy-plakat-grotesk',
    file: 'Rubik-Italic[wght].ttf',
    dir: 'ofl/rubik',
    weight: '300 900',
    style: 'italic',
    variable: true,
    designer: 'Hubert and Fischer, Meir Sadan, Cyreal',
    license: 'OFL-1.1',
    description: 'Dynamic slanted cut of Rubik for punchy thumbnail action titles.',
    recommendedFor: ['Dynamische Thumbnail-Worte'],
  },

  // 4. literary-book-serif
  {
    family: 'Cormorant Garamond',
    role: 'literary-book-serif',
    file: 'CormorantGaramond[wght].ttf',
    dir: 'ofl/cormorantgaramond',
    weight: '300 700',
    style: 'normal',
    variable: true,
    designer: 'Christian Thalmann (Catharsis Fonts)',
    license: 'OFL-1.1',
    description: 'Masterful French Renaissance revival of Claude Garamond (16th c.). Razor-sharp, organic, aristocratic elegance.',
    recommendedFor: ['Wörtliche Buchzitate', 'Quellenangaben unter Bilderrahmen', 'Sprechblasen-Dialoge'],
  },
  {
    family: 'Cormorant Garamond',
    role: 'literary-book-serif',
    file: 'CormorantGaramond-Italic[wght].ttf',
    dir: 'ofl/cormorantgaramond',
    weight: '300 700',
    style: 'italic',
    variable: true,
    designer: 'Christian Thalmann (Catharsis Fonts)',
    license: 'OFL-1.1',
    description: 'Exquisite calligraphic Garamond italic for voiceover-synchronized literary text and paper clippings.',
    recommendedFor: ['Wort-synchrone Zitate auf Tapete', 'Philosophische Reflexionen'],
  },
  {
    family: 'Fraunces',
    role: 'literary-book-serif',
    file: 'Fraunces[SOFT,WONK,opsz,wght].ttf',
    dir: 'ofl/fraunces',
    weight: '100 900',
    style: 'normal',
    variable: true,
    designer: 'Phaedra Charles, Flavia Zimbardi (Undercase Type)',
    license: 'OFL-1.1',
    description: 'Warm, expressive, fleshy Old Style serif inspired by early 20th-century book typography and Windsor/Cooper styles.',
    recommendedFor: ['Kultur-Essays', 'Menschliche, intime Zitate', 'Story-Einstiege'],
  },
  {
    family: 'Fraunces',
    role: 'literary-book-serif',
    file: 'Fraunces-Italic[SOFT,WONK,opsz,wght].ttf',
    dir: 'ofl/fraunces',
    weight: '100 900',
    style: 'italic',
    variable: true,
    designer: 'Phaedra Charles, Flavia Zimbardi (Undercase Type)',
    license: 'OFL-1.1',
    description: 'Playful yet sophisticated literary cursive with tactile bookish character.',
    recommendedFor: ['Gedichte', 'Handschrift-nahe Passagen'],
  },

  // 5. typewriter-archival
  {
    family: 'Special Elite',
    role: 'typewriter-archival',
    file: 'SpecialElite-Regular.ttf',
    dir: 'apache/specialelite',
    weight: '400',
    style: 'normal',
    variable: false,
    designer: 'Astigmatic (Brian J. Bonislawsky)',
    license: 'Apache-2.0',
    description: 'Gritty, authentic vintage mechanical typewriter with ink-bleed and worn hammer key impressions (Remington/Smith Corona).',
    recommendedFor: ['Historische Zitate auf Zeitungsschnipseln', 'Alte Aktenvermerke', 'Redigierte Dokumente'],
  },
  {
    family: 'Courier Prime',
    role: 'typewriter-archival',
    file: 'CourierPrime-Regular.ttf',
    dir: 'ofl/courierprime',
    weight: '400',
    style: 'normal',
    variable: false,
    designer: 'Alan Dague-Greene (Quote-Unquote Apps)',
    license: 'OFL-1.1',
    description: 'The definitive cinema/screenplay monospaced typewriter font. Crisp, perfectly balanced strike.',
    recommendedFor: ['Offizielle Gutachten', 'Manuskripte', 'Gerichtsprotokolle'],
  },
  {
    family: 'Courier Prime',
    role: 'typewriter-archival',
    file: 'CourierPrime-Italic.ttf',
    dir: 'ofl/courierprime',
    weight: '400',
    style: 'italic',
    variable: false,
    designer: 'Alan Dague-Greene (Quote-Unquote Apps)',
    license: 'OFL-1.1',
    description: 'True slanted mechanical typewriter cut for annotated archival records.',
    recommendedFor: ['Handschriftliche Randnotizen auf Akten'],
  },
  {
    family: 'Courier Prime',
    role: 'typewriter-archival',
    file: 'CourierPrime-Bold.ttf',
    dir: 'ofl/courierprime',
    weight: '700',
    style: 'normal',
    variable: false,
    designer: 'Alan Dague-Greene (Quote-Unquote Apps)',
    license: 'OFL-1.1',
    description: 'Heavy ink-carbon copy typewriter stroke for stamped headings.',
    recommendedFor: ['Gestempelte Akten-Kennungen (STRENG GEHEIM)'],
  },

  // 6. retro-crt-terminal
  {
    family: 'VT323',
    role: 'retro-crt-terminal',
    file: 'VT323-Regular.ttf',
    dir: 'ofl/vt323',
    weight: '400',
    style: 'normal',
    variable: false,
    designer: 'Peter Hull',
    license: 'OFL-1.1',
    description: 'Authentic 1982 DEC VT220 / VT320 raster terminal font. True glowing green/amber phosphor pixel matrix.',
    recommendedFor: ['CRT-Monitore', 'Frühe KI (ELIZA 1966, Deep Blue Terminal)', 'ASCII-Banner'],
  },
  {
    family: 'IBM Plex Mono',
    role: 'retro-crt-terminal',
    file: 'IBMPlexMono-Regular.ttf',
    dir: 'ofl/ibmplexmono',
    weight: '400',
    style: 'normal',
    variable: false,
    designer: 'Mike Abbink, Bold Monday (IBM)',
    license: 'OFL-1.1',
    description: 'Engineered corporate monospace font capturing the spirit of IBM mainframes, Selectric typewriters, and technical blueprints.',
    recommendedFor: ['Algorithmen & Quelltext', 'Daten-Diagramme', 'Technische Datenblätter'],
  },
  {
    family: 'IBM Plex Mono',
    role: 'retro-crt-terminal',
    file: 'IBMPlexMono-Bold.ttf',
    dir: 'ofl/ibmplexmono',
    weight: '700',
    style: 'normal',
    variable: false,
    designer: 'Mike Abbink, Bold Monday (IBM)',
    license: 'OFL-1.1',
    description: 'Bold engineered monospace for emphasized code syntax and terminal error messages.',
    recommendedFor: ['Terminal-Fehlercodes', 'Fett gesetzte Parameter'],
  },
  {
    family: 'IBM Plex Mono',
    role: 'retro-crt-terminal',
    file: 'IBMPlexMono-Italic.ttf',
    dir: 'ofl/ibmplexmono',
    weight: '400',
    style: 'italic',
    variable: false,
    designer: 'Mike Abbink, Bold Monday (IBM)',
    license: 'OFL-1.1',
    description: 'Technical monospaced italic for code comments and scientific annotations.',
    recommendedFor: ['Code-Kommentare', 'Variablen in Formeln'],
  },

  // 7. diegetic-ui-sans
  {
    family: 'Inter',
    role: 'diegetic-ui-sans',
    file: 'Inter[opsz,wght].ttf',
    dir: 'ofl/inter',
    weight: '100 900',
    style: 'normal',
    variable: true,
    designer: 'Rasmus Andersson',
    license: 'OFL-1.1',
    description: 'Precision engineered UI sans-serif designed for high legibility on computer screens. ONLY for diegetic apps and software interfaces.',
    recommendedFor: ['Suchfelder & Prompts (ChatGPT, Midjourney)', 'Buttons & Menüs', 'Fiverr/Chat-Bubbles'],
  },
  {
    family: 'Inter',
    role: 'diegetic-ui-sans',
    file: 'Inter-Italic[opsz,wght].ttf',
    dir: 'ofl/inter',
    weight: '100 900',
    style: 'italic',
    variable: true,
    designer: 'Rasmus Andersson',
    license: 'OFL-1.1',
    description: 'Interface italic for placeholder text in prompt inputs.',
    recommendedFor: ['Placeholder-Texte in Prompts', 'UI-Tooltips'],
  },

  // 8. historical-fraktur (Special Archetype for Historical Archive/Decree Citations)
  {
    family: 'UnifrakturMaguntia',
    role: 'historical-fraktur',
    file: 'UnifrakturMaguntia-Book.ttf',
    dir: 'ofl/unifrakturmaguntia',
    weight: '400',
    style: 'normal',
    variable: false,
    designer: 'J. \'Mach\' Wust',
    license: 'OFL-1.1',
    description: 'Historical German Fraktur based on Peter Schöffer\'s Mainz types (15th/16th c.) with ligature support. Perfect for German archival citations, decrees, and old printings.',
    recommendedFor: ['Historische Kaiser-/Reichs-Erlasse', '19. Jh. Gesetzestexte', 'Dramatischer deutscher Epochen-Kontrast'],
  },
];

const TARGET_DIRS = [
  join(process.cwd(), 'editorial', 'remotion', 'shared', 'fonts'),
  join(process.cwd(), 'editorial', 'public', 'fonts'),
  join(process.cwd(), 'remotion-shorts', 'public', 'fonts'),
];

async function main() {
  console.log('--- Starte Download der kuratierten Font-Vorlagen ---');
  for (const dir of TARGET_DIRS) {
    if (!existsSync(dir)) {
      mkdirSync(dir, {recursive: true});
      console.log('Verzeichnis erstellt:', dir);
    }
  }

  // 1. Download font files
  const downloadedFiles = new Set();
  for (const font of FONTS) {
    const encoded = encodeURIComponent(font.file);
    const url = `https://raw.githubusercontent.com/google/fonts/main/${font.dir}/${encoded}`;
    const primaryPath = join(TARGET_DIRS[0], font.file);

    if (!existsSync(primaryPath)) {
      console.log(`Lade ${font.family} (${font.file})...`);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Fehler beim Download von ${url}: ${res.status} ${res.statusText}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      writeFileSync(primaryPath, buffer);
      console.log(`  -> Gespeichert (${buffer.byteLength} Bytes)`);
    } else {
      console.log(`Bereits vorhanden: ${font.file}`);
    }

    // Mirror to other targets
    const data = Buffer.from(await (await import('node:fs/promises')).readFile(primaryPath));
    for (let i = 1; i < TARGET_DIRS.length; i++) {
      const mirrorPath = join(TARGET_DIRS[i], font.file);
      if (!existsSync(mirrorPath)) {
        writeFileSync(mirrorPath, data);
      }
    }
    downloadedFiles.add(font.file);
  }

  // 2. Generate catalog.json
  const catalog = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Punktgenau & Editorial Studio Font Catalog',
    description: 'Permanente Sammlung von kuratierten, ästhetischen Open-Source-Schriften (100% offline-fähig, SIL OFL & Apache 2.0).',
    version: '1.0.0',
    totalFonts: FONTS.length,
    roles: [
      'editorial-didone',
      'tall-condensed-serif',
      'heavy-plakat-grotesk',
      'literary-book-serif',
      'typewriter-archival',
      'retro-crt-terminal',
      'diegetic-ui-sans',
      'historical-fraktur',
    ],
    fonts: FONTS.map((f) => ({
      family: f.family,
      role: f.role,
      file: f.file,
      format: 'truetype',
      weight: f.weight,
      style: f.style,
      variable: f.variable,
      designer: f.designer,
      license: f.license,
      description: f.description,
      recommendedFor: f.recommendedFor,
    })),
  };

  const catalogStr = JSON.stringify(catalog, null, 2);
  for (const dir of TARGET_DIRS) {
    writeFileSync(join(dir, 'catalog.json'), catalogStr, 'utf8');
  }
  console.log('catalog.json in allen Font-Verzeichnissen geschrieben.');

  // 3. Generate fonts.css with @font-face rules
  const cssRules = FONTS.map((f) => {
    return `@font-face {
  font-family: '${f.family}';
  src: url('/fonts/${f.file}') format('truetype');
  font-weight: ${f.weight};
  font-style: ${f.style};
  font-display: swap;
}`;
  }).join('\n\n');

  const cssHeader = `/* Automatisch generierte @font-face Definitionen fuer Editorial Studio & Punktgenau */
/* Alle Schriften liegen lokal in /fonts/ und sind vollstaendig offline verfuegbar. */\n\n`;

  for (const dir of TARGET_DIRS) {
    writeFileSync(join(dir, 'fonts.css'), cssHeader + cssRules + '\n', 'utf8');
  }
  console.log('fonts.css in allen Font-Verzeichnissen geschrieben.');

  // 4. Generate TypeScript module index.ts in shared/fonts
  const tsContent = `// Typed exports fuer das Vorlagen-Font-System
import catalogJson from './catalog.json';

export type FontRole =
  | 'editorial-didone'
  | 'tall-condensed-serif'
  | 'heavy-plakat-grotesk'
  | 'literary-book-serif'
  | 'typewriter-archival'
  | 'retro-crt-terminal'
  | 'diegetic-ui-sans'
  | 'historical-fraktur';

export interface FontEntry {
  family: string;
  role: FontRole;
  file: string;
  format: string;
  weight: string;
  style: string;
  variable: boolean;
  designer: string;
  license: string;
  description: string;
  recommendedFor: string[];
}

export const FONT_CATALOG: FontEntry[] = catalogJson.fonts as FontEntry[];

export const LOCAL_FONT_FAMILIES = {
  playfair: 'Playfair Display',
  bodoni: 'Bodoni Moda',
  instrumentSerif: 'Instrument Serif',
  dmSerif: 'DM Serif Display',
  cinzel: 'Cinzel',
  anton: 'Anton',
  bebas: 'Bebas Neue',
  rubik: 'Rubik',
  cormorant: 'Cormorant Garamond',
  fraunces: 'Fraunces',
  specialElite: 'Special Elite',
  courierPrime: 'Courier Prime',
  vt323: 'VT323',
  ibmPlexMono: 'IBM Plex Mono',
  inter: 'Inter',
  fraktur: 'UnifrakturMaguntia',
} as const;
`;

  writeFileSync(join(TARGET_DIRS[0], 'index.ts'), tsContent, 'utf8');
  console.log('index.ts in editorial/remotion/shared/fonts/ geschrieben.');
  console.log('--- Font-Einbindung erfolgreich abgeschlossen! ---');
}

main().catch((err) => {
  console.error('FEHLER:', err);
  process.exit(1);
});

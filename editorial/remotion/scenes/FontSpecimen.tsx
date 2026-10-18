import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FAMILY} from '../shared/typography';

interface SpecimenItem {
  id: string;
  role: string;
  family: string;
  fontFamily: string;
  weights: string;
  sample: string;
  subSample?: string;
  fontSize: number;
  color?: string;
  badgeBg?: string;
  badgeColor?: string;
  letterSpacing?: string;
  textTransform?: 'uppercase' | 'none';
  italic?: boolean;
}

const SPECIMENS: SpecimenItem[] = [
  // Linke Spalte: Serifen & Display (Klassik, Didone, Monumental)
  {
    id: 'playfair',
    role: '1. EDITORIAL-DIDONE',
    family: 'Playfair Display',
    fontFamily: FAMILY.didone,
    weights: '400, 700, 900 + Italic',
    sample: 'Das Deep-Blue-Paradoxon: Philosophie & Wahrheit',
    subSample: '»Kursive Didone-Dachzeile für elegante Thesen und Kontraste«',
    fontSize: 27,
    color: '#f5efe1',
  },
  {
    id: 'bodoni',
    role: '1. EDITORIAL-DIDONE (HIGH-CONTRAST)',
    family: 'Bodoni Moda',
    fontFamily: FAMILY.bodoni,
    weights: '400, 700, 900 + Italic (opsz)',
    sample: 'MONUMENTALE KULTUR & SCHÖPFERKRAFT',
    subSample: 'Parma 1798: Extrem hoher Strichkontrast & flache Serifen',
    fontSize: 25,
    color: '#f8f4ec',
    textTransform: 'uppercase',
  },
  {
    id: 'instrumentserif',
    role: '2. TALL-CONDENSED-SERIF',
    family: 'Instrument Serif',
    fontFamily: FAMILY.instrumentSerif,
    weights: '400 Regular & Italic',
    sample: 'Mühelose Exzellenz im Raum – Slender Display',
    subSample: 'Fast, sharp editorial rhythm with razor-thin hairline terminals (-6° tilt)',
    fontSize: 32,
    color: '#faebd7',
    italic: true,
  },
  {
    id: 'dmserif',
    role: '2. TALL-CONDENSED-SERIF',
    family: 'DM Serif Display',
    fontFamily: FAMILY.tallSerif,
    weights: '400 Regular & Italic',
    sample: 'TALENT VS. ARBEIT: SKULPTURALER STEMPEL',
    subSample: 'Robuste Klammern und markante Tropfen-Enden für Raum-Leitmotive',
    fontSize: 24,
    color: '#f5efe1',
    textTransform: 'uppercase',
  },
  {
    id: 'cinzel',
    role: '2. TALL-CONDENSED-SERIF (ROMAN)',
    family: 'Cinzel',
    fontFamily: FAMILY.cinzel,
    weights: '400, 700, 900',
    sample: 'IMPERIVM ROMANVM – HISTORIA ET SCIENTIA',
    subSample: 'Antike Monumental-Inschriften des 1. Jahrhunderts in Stein gemeißelt',
    fontSize: 22,
    color: '#eedcba',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  {
    id: 'cormorant',
    role: '4. LITERARY-BOOK-SERIF',
    family: 'Cormorant Garamond',
    fontFamily: FAMILY.book,
    weights: '300, 400, 500, 600, 700 + Italic',
    sample: '»Die Kunst ist eine Vermittlerin des Unaussprechlichen.«',
    subSample: 'Caspar David Friedrich, ca. 1818 – Bildunterschriften & Zitate auf Tapete',
    fontSize: 26,
    color: '#f3ead8',
    italic: true,
  },
  {
    id: 'fraunces',
    role: '4. LITERARY-BOOK-SERIF (WARM)',
    family: 'Fraunces',
    fontFamily: FAMILY.fraunces,
    weights: '100–900 Variable (Soft / Wonk / opsz)',
    sample: 'Warme Gedanken, alte Bücher und persönliche Essays.',
    subSample: 'Inspiriert von Buchdruckern des frühen 20. Jahrhunderts mit organischen Kurven',
    fontSize: 24,
    color: '#f4ece1',
  },
  {
    id: 'fraktur',
    role: '8. HISTORICAL-FRAKTUR',
    family: 'UnifrakturMaguntia',
    fontFamily: FAMILY.fraktur,
    weights: '400 Book (mit Ligaturen)',
    sample: 'Kaiserlicher Erlaß und Historische Chronik',
    subSample: 'Mainzer Buchdruck-Typen nach Peter Schöffer (15./16. Jh.) für historische Akten',
    fontSize: 28,
    color: '#f5ead0',
    letterSpacing: '0.03em',
  },

  // Rechte Spalte: Plakat, Typewriter, Terminal, UI Sans
  {
    id: 'anton',
    role: '3. HEAVY-PLAKAT-GROTESK',
    family: 'Anton',
    fontFamily: FAMILY.plakat,
    weights: '400 Ultra-Heavy Display',
    sample: 'PARADIGMENWECHSEL! 3D-BLOCK-HYPE',
    subSample: 'Traditionelle deutsche Holztyp-Werbeschrift für Sprechblasen & Extrusion',
    fontSize: 26,
    color: '#f8d030',
    textTransform: 'uppercase',
  },
  {
    id: 'bebas',
    role: '3. HEAVY-PLAKAT-GROTESK (CONDENSED)',
    family: 'Bebas Neue',
    fontFamily: FAMILY.bebas,
    weights: '400 All-Caps Headline',
    sample: 'KÜNSTLICHE INTELLIGENZ – DIE GROSSE ENTTÄUSCHUNG',
    subSample: 'Schlanke, hohe Plakat-Versalien für Banner, Titel & laute Vergleiche',
    fontSize: 25,
    color: '#f0f0f0',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  {
    id: 'rubik',
    role: '3. HEAVY-PLAKAT-GROTESK (THUMBNAIL)',
    family: 'Rubik',
    fontFamily: FAMILY.rubik,
    weights: '300–900 Variable (800 Black)',
    sample: 'STOPP! DENKEN ODER RECHNEN? (110 PX+)',
    subSample: 'Maximale Lesbarkeit auf Mobilgeräten für YouTube-Thumbnails & Punchy-Titel',
    fontSize: 22,
    color: '#ff4444',
    letterSpacing: '-0.01em',
    textTransform: 'uppercase',
  },
  {
    id: 'specialelite',
    role: '5. TYPEWRITER-ARCHIVAL (VINTAGE)',
    family: 'Special Elite',
    fontFamily: FAMILY.typewriter,
    weights: '400 Regular (Inked Keys)',
    sample: 'STRENG GEHEIM: Aktennotiz vom 12. Mai 1974',
    subSample: 'Abgenutzte Remington-Typenhebel mit Tintenbluten für alte Zeitungsausschnitte',
    fontSize: 22,
    color: '#e8e2d4',
  },
  {
    id: 'courierprime',
    role: '5. TYPEWRITER-ARCHIVAL (CINEMA)',
    family: 'Courier Prime',
    fontFamily: FAMILY.courierPrime,
    weights: '400 Regular, Italic, 700 Bold',
    sample: 'INT. KASPAROW SUITE - NIGHT: The board is set.',
    subSample: 'Mustergültige Monospace für Drehbücher, Protokolle und Dokumente',
    fontSize: 21,
    color: '#e4dfd5',
  },
  {
    id: 'vt323',
    role: '6. RETRO-CRT-TERMINAL (8-BIT)',
    family: 'VT323',
    fontFamily: FAMILY.vt323,
    weights: '400 Regular (DEC VT220 Matrix)',
    sample: '10 PRINT "ELIZA 1966"; 20 GOTO 10 -- READY.',
    subSample: 'Authentische Phosphor-Pixelmatrix für historische Computerterminals & Hacker-UIs',
    fontSize: 28,
    color: '#70ff70',
    letterSpacing: '0.05em',
  },
  {
    id: 'ibmplexmono',
    role: '6. RETRO-CRT-TERMINAL (ENGINEERED)',
    family: 'IBM Plex Mono',
    fontFamily: FAMILY.terminal,
    weights: '400 Regular, 700 Bold, Italic',
    sample: 'fn evaluate_chess_tree(alpha: f64, depth: u32) -> Move',
    subSample: 'Technische Präzisions-Monospace von IBM für Quelltext, Diagramme & Flussdaten',
    fontSize: 20,
    color: '#b0d8ff',
  },
  {
    id: 'inter',
    role: '7. DIEGETIC-UI-SANS (SYSTEM)',
    family: 'Inter',
    fontFamily: FAMILY.ui,
    weights: '100–900 Variable + Italic',
    sample: 'Prompt: Generate a high-resolution oil painting [Send]',
    subSample: 'NUR für nachgebaute Software-UIs, Suchleisten, Chat-Bubbles & System-Buttons',
    fontSize: 20,
    color: '#ffffff',
  },
];

export const FontSpecimen: React.FC = () => {
  const leftCol = SPECIMENS.slice(0, 8);
  const rightCol = SPECIMENS.slice(8, 16);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0c0f14',
        backgroundImage: 'radial-gradient(ellipse at 50% 15%, rgba(26, 38, 57, 0.6) 0%, rgba(9, 12, 16, 0.95) 100%)',
        color: '#f0ede6',
        padding: '36px 56px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid rgba(220, 200, 160, 0.25)',
          paddingBottom: 14,
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: '0.06em',
              color: '#f6eedb',
              textShadow: '0 2px 10px rgba(0,0,0,0.7)',
            }}
          >
            PUNKTGENAU & EDITORIAL STUDIO – TYPOGRAFIE-BIBLIOTHEK
          </div>
          <div style={{fontSize: 13, color: '#a6adb8', marginTop: 4, letterSpacing: '0.02em'}}>
            16 kuratierte, lizenzfreie Schriftfamilien (SIL Open Font License & Apache 2.0) • 100 % lokal im Repository • Offline-fähig
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <span
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#e5c365',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '4px 10px',
              borderRadius: 4,
              textTransform: 'uppercase',
            }}
          >
            28 Schriftschnitte • Alle 8 Rollen
          </span>
        </div>
      </div>

      {/* 2 Spalten Layout */}
      <div style={{display: 'flex', flex: 1, gap: 40}}>
        {/* Linke Spalte */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          {leftCol.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 6,
                padding: '9px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {/* Badge & Info Header */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#d4af37',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.role}
                </span>
                <span style={{fontSize: 11, color: '#8892a0', fontWeight: 500}}>
                  <strong style={{color: '#ccd4df'}}>{item.family}</strong> ({item.weights})
                </span>
              </div>

              {/* Live Specimen Sample */}
              <div
                style={{
                  fontFamily: item.fontFamily,
                  fontSize: item.fontSize,
                  color: item.color ?? '#f5efe1',
                  letterSpacing: item.letterSpacing ?? 'normal',
                  textTransform: item.textTransform ?? 'none',
                  fontStyle: item.italic ? 'italic' : 'normal',
                  lineHeight: 1.18,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                }}
              >
                {item.sample}
              </div>

              {/* Sub-sample / Charakterbeschreibung */}
              {item.subSample ? (
                <div
                  style={{
                    fontSize: 11,
                    color: '#9aa3b0',
                    marginTop: 3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontStyle: item.italic ? 'italic' : 'normal',
                  }}
                >
                  {item.subSample}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Rechte Spalte */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          {rightCol.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 6,
                padding: '9px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {/* Badge & Info Header */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#d4af37',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.role}
                </span>
                <span style={{fontSize: 11, color: '#8892a0', fontWeight: 500}}>
                  <strong style={{color: '#ccd4df'}}>{item.family}</strong> ({item.weights})
                </span>
              </div>

              {/* Live Specimen Sample */}
              <div
                style={{
                  fontFamily: item.fontFamily,
                  fontSize: item.fontSize,
                  color: item.color ?? '#f5efe1',
                  letterSpacing: item.letterSpacing ?? 'normal',
                  textTransform: item.textTransform ?? 'none',
                  fontStyle: item.italic ? 'italic' : 'normal',
                  lineHeight: 1.18,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                }}
              >
                {item.sample}
              </div>

              {/* Sub-sample / Charakterbeschreibung */}
              {item.subSample ? (
                <div
                  style={{
                    fontSize: 11,
                    color: '#9aa3b0',
                    marginTop: 3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.subSample}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {kf, ramp} from './anim';
import {dist, NEIGHBORS, POINTS, QUERY, vote} from './data';
import {FONT} from './font';
import {BOX_OUTLINE, COLORS, PLOT} from './theme';

const SECTIONS = [
  {from: 0, label: 'k-Nearest Neighbors'},
  {from: 5, label: '1 · Die Idee'},
  {from: 11, label: '2 · Der Abstand'},
  {from: 21, label: '3 · Abstimmen'},
  {from: 33, label: '4 · Das richtige k'},
  {from: 46, label: 'Merksatz'},
];

/** Blendet Kinder zwischen from und to (Sekunden) ein und aus. */
const Window: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const o = kf(frame, [from, from + 0.35, to - 0.3, to], [0, 1, 1, 0]);
  if (o <= 0.001) return null;
  return <div style={{position: 'absolute', inset: 0, opacity: o, transform: `translateY(${(1 - o) * 14}px)`}}>{children}</div>;
};

export const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const idx = SECTIONS.reduce((acc, s, i) => (t >= s.from ? i : acc), 0);
  return (
    <div style={{position: 'absolute', left: 90, top: 100, width: PLOT, fontFamily: FONT, fontWeight: 800, fontSize: 60, color: COLORS.text, letterSpacing: -1}}>
      {SECTIONS[idx].label}
    </div>
  );
};

const card: React.CSSProperties = {
  position: 'absolute',
  left: 90,
  top: 1170,
  width: PLOT,
  height: 270,
  background: COLORS.panel,
  outline: BOX_OUTLINE,
  fontFamily: FONT,
  color: COLORS.text,
};

const Chip: React.FC<{color: string; delay: number}> = ({color, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay * fps, fps, config: {damping: 11, stiffness: 190}});
  return <div style={{width: 64, height: 64, borderRadius: 32, background: color, border: `4px solid ${COLORS.text}`, transform: `scale(${Math.max(0, s)})`}} />;
};

const KStage: React.FC<{k: number; from: number; to: number; chipsFrom: number; verdictFrom: number; caption?: string}> = ({
  k, from, to, chipsFrom, verdictFrom, caption,
}) => {
  const frame = useCurrentFrame();
  const v = vote(POINTS, NEIGHBORS[k]);
  const showChips = k <= 3;
  const verdict = ramp(frame, verdictFrom, verdictFrom + 0.4);
  return (
    <Window from={from} to={to}>
      <div style={{position: 'absolute', left: 50, top: 28, fontSize: 110, fontWeight: 800, color: COLORS.accent, letterSpacing: -3}}>k = {k}</div>
      <div style={{position: 'absolute', left: 480, top: 40, right: 30}}>
        {showChips ? (
          <div style={{display: 'flex', gap: 16, height: 70}}>
            {NEIGHBORS[k].map((i, j) => (
              <Chip key={i} color={POINTS[i].c === 1 ? COLORS.orange : COLORS.blue} delay={chipsFrom + j * 0.3} />
            ))}
          </div>
        ) : (
          <div style={{fontSize: 40, fontWeight: 800, height: 70, opacity: ramp(frame, chipsFrom, chipsFrom + 0.4)}}>
            <span style={{color: COLORS.blue}}>{v.blue} blau</span>
            <span style={{color: COLORS.muted}}> · </span>
            <span style={{color: COLORS.orange}}>{v.orange} orange</span>
          </div>
        )}
        <div style={{fontSize: 52, fontWeight: 800, marginTop: 8, opacity: verdict, transform: `translateX(${(1 - verdict) * 20}px)`}}>
          → <span style={{color: v.winner === 1 ? COLORS.orange : COLORS.blue}}>{v.winner === 1 ? 'orange' : 'blau'}</span>
        </div>
      </div>
      {caption && (
        <div style={{position: 'absolute', left: 50, bottom: 24, fontSize: 30, fontWeight: 500, color: COLORS.muted, opacity: ramp(frame, verdictFrom + 0.5, verdictFrom + 1)}}>
          {caption}
        </div>
      )}
    </Window>
  );
};

const FormulaBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const n1 = POINTS[NEIGHBORS[1][0]];
  const dx = Math.round(Math.abs(n1.x - QUERY.x) / 9);
  const dy = Math.round(Math.abs(n1.y - QUERY.y) / 9);
  const d = Math.round(dist(QUERY, n1) / 9);
  return (
    <>
      <Window from={11.2} to={21.2}>
        <div style={{position: 'absolute', top: 36, left: 0, right: 0, textAlign: 'center', fontSize: 76, fontWeight: 800}}>
          <span style={{color: COLORS.accent}}>d</span> = √(Δx² + Δy²)
        </div>
      </Window>
      <Window from={14.2} to={18}>
        <div style={{position: 'absolute', top: 170, left: 0, right: 0, textAlign: 'center', fontSize: 40, fontWeight: 500, color: COLORS.muted}}>
          {dx}² + {dy}² = {dx * dx + dy * dy} → <span style={{color: COLORS.accent, fontWeight: 800}}>d ≈ {d}</span>
        </div>
      </Window>
      <Window from={18.2} to={21.2}>
        <div style={{position: 'absolute', top: 170, left: 0, right: 0, textAlign: 'center', fontSize: 40, fontWeight: 500, color: COLORS.muted, opacity: ramp(frame, 18.2, 18.8)}}>
          …für <span style={{color: COLORS.text, fontWeight: 800}}>jeden</span> Datenpunkt
        </div>
      </Window>
    </>
  );
};

export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= 46.3 * 30) return null; // Merksatz hat eigene Flaeche
  return (
  <div style={card}>
    {/* Legende */}
    <Window from={1.5} to={5.2}>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, fontSize: 48, fontWeight: 800}}>
        <span><span style={{color: COLORS.blue}}>●</span> Klasse A</span>
        <span><span style={{color: COLORS.orange}}>●</span> Klasse B</span>
      </div>
    </Window>
    <Window from={5.4} to={11.2}>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 800}}>
        Gleich &amp; gleich <span style={{color: COLORS.accent, margin: '0 14px'}}>gesellt sich gern</span>
      </div>
    </Window>
    <FormulaBlock />
    <Window from={21} to={24}>
      <div style={{position: 'absolute', left: 50, top: 28, fontSize: 120, fontWeight: 800, color: COLORS.accent}}>k = ?</div>
      <div style={{position: 'absolute', left: 400, top: 80, fontSize: 40, color: COLORS.muted, fontWeight: 500}}>Anzahl der Nachbarn</div>
    </Window>
    <KStage k={3} from={24} to={35.6} chipsFrom={27} verdictFrom={30} />
    <KStage k={1} from={35.6} to={43} chipsFrom={36.4} verdictFrom={37.2} caption="Zu klein: anfällig für Ausreißer" />
    <KStage k={25} from={43} to={46.3} chipsFrom={43.4} verdictFrom={44.2} caption="Zu groß: die Minderheit verschwindet" />
  </div>
  );
};

const RECAP_ROWS = [
  {n: '1', title: 'Abstand messen', sub: 'd = √(Δx² + Δy²)', at: 46.6},
  {n: '2', title: 'k Nachbarn wählen', sub: 'k = 3, 5, 7 …', at: 47.9},
  {n: '3', title: 'Mehrheit entscheidet', sub: '→ Klasse des Punktes', at: 49.2},
];

export const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bg = ramp(frame, 46.3, 47);
  if (bg <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute', left: 90, top: 230, width: PLOT, height: PLOT, outline: BOX_OUTLINE,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34, padding: '0 60px',
        fontFamily: FONT, color: COLORS.text, background: COLORS.panel, opacity: bg,
      }}
    >
      {RECAP_ROWS.map((r) => {
        const s = spring({frame: frame - r.at * fps, fps, config: {damping: 14, stiffness: 170}});
        return (
          <div key={r.n} style={{display: 'flex', alignItems: 'center', gap: 36, opacity: Math.min(1, s * 1.5), transform: `translateX(${(1 - s) * 80}px)`}}>
            <div style={{width: 110, height: 110, flexShrink: 0, background: COLORS.accent, color: COLORS.bg, fontSize: 64, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{r.n}</div>
            <div>
              <div style={{fontSize: 54, fontWeight: 800, letterSpacing: -1, whiteSpace: 'nowrap'}}>{r.title}</div>
              <div style={{fontSize: 38, fontWeight: 500, color: COLORS.muted}}>{r.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

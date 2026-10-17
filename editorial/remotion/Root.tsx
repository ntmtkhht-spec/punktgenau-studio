import React from 'react';
import {AbsoluteFill, CalculateMetadataFunction, Composition} from 'remotion';
import {FormatKey, FORMATS, FPS} from './shared/format';
import {WallpaperSpec} from './shared/theme';
import {Wallpaper} from './shared/Wallpaper';
import {SCENES} from './scenes/registry';

// Jede Komposition bekommt Format und Dauer als Props von scripts/ed.mjs.
// Dadurch rendert dieselbe Szene in 16:9 oder 9:16, ohne Code-Kopie.
export type SceneProps = {
  format: FormatKey;
  durationSec: number;
  wallpaper?: WallpaperSpec;
};

const DEFAULT_WALLPAPER: WallpaperSpec = {motif: 'damast', mode: 'these', color: 'tiefblau', light: 'vignette'};
const defaults: SceneProps = {format: '16x9', durationSec: 4, wallpaper: DEFAULT_WALLPAPER};

const metadata: CalculateMetadataFunction<SceneProps> = ({props}) => ({
  ...FORMATS[props.format],
  fps: FPS,
  durationInFrames: Math.max(1, Math.round(props.durationSec * FPS)),
});

const WallpaperComp: React.FC<SceneProps> = ({wallpaper}) => <Wallpaper spec={wallpaper ?? DEFAULT_WALLPAPER} />;

const withWallpaper = (Scene: React.FC): React.FC<SceneProps> => {
  const Wrapped: React.FC<SceneProps> = ({wallpaper}) => (
    <AbsoluteFill>
      {wallpaper ? <Wallpaper spec={wallpaper} /> : null}
      <Scene />
    </AbsoluteFill>
  );
  return Wrapped;
};

export const Root: React.FC = () => (
  <>
    <Composition id="Wallpaper" component={WallpaperComp} defaultProps={defaults} calculateMetadata={metadata} {...FORMATS['16x9']} fps={FPS} durationInFrames={120} />
    {Object.entries(SCENES).map(([id, Scene]) => (
      <Composition
        key={id}
        id={id}
        component={withWallpaper(Scene)}
        defaultProps={{...defaults, wallpaper: undefined}}
        calculateMetadata={metadata}
        {...FORMATS['16x9']}
        fps={FPS}
        durationInFrames={120}
      />
    ))}
  </>
);

import React from 'react';
import {Composition} from 'remotion';
import {KnnShort} from './knn/KnnShort';
import {FPS, H, sec, W} from './knn/theme';
import {Phantom} from './phantom/Phantom';
import {TOTAL} from './phantom/timeline';
import {Spiral, SPIRAL_TOTAL} from './spiral/Spiral';
import {ChannelBanner, ProfileLogo, WordmarkWide} from './branding/Brand';
import {zenoSchema} from './zeno/schema';
import {ZenoThumbnail} from './zeno/Thumbnail';
import {Zeno, ZENO_TOTAL} from './zeno/Zeno';
import {sectionClip} from './shared';
import {VIDEOS} from './videos/registry';
import {KugelThumbnailA, KugelThumbnailB, KugelThumbnailC} from './videos/08-kugel-aus-punkt/Thumbnail';
import {ExponentiellThumbnailA, ExponentiellThumbnailB, ExponentiellThumbnailC} from './videos/09-exponentiell-gewinnt/Thumbnail';
import {V10DrehenderKopfThumbnailA, V10DrehenderKopfThumbnailB, V10DrehenderKopfThumbnailC} from './videos/10-drehender-kopf/Thumbnail';

/** Longform: jeder Abschnitt als eigener Clip (einmal erzeugt, damit das Studio nicht neu mountet). */
const SCENE_CLIPS = VIDEOS.filter((v) => !v.scenes).flatMap((v) =>
  (v.sections ?? []).map(([from, to], i) => ({
    id: `${v.id}-Szene${String(i + 1).padStart(2, '0')}`,
    component: sectionClip(v.component, from),
    frames: to - from + 1,
    width: v.width ?? W,
    height: v.height ?? H,
  })),
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="V10DrehenderKopfThumbnailA" component={V10DrehenderKopfThumbnailA} durationInFrames={1} fps={FPS} width={1080} height={1920}/>
    <Composition id="V10DrehenderKopfThumbnailB" component={V10DrehenderKopfThumbnailB} durationInFrames={1} fps={FPS} width={1080} height={1920}/>
    <Composition id="V10DrehenderKopfThumbnailC" component={V10DrehenderKopfThumbnailC} durationInFrames={1} fps={FPS} width={1080} height={1920}/>
    <Composition id="V08KugelThumbnailA" component={KugelThumbnailA} durationInFrames={1} fps={FPS} width={1080} height={1920}/>
    <Composition id="V08KugelThumbnailB" component={KugelThumbnailB} durationInFrames={1} fps={FPS} width={1080} height={1920}/>
    <Composition id="V08KugelThumbnailC" component={KugelThumbnailC} durationInFrames={1} fps={FPS} width={1080} height={1920}/>
    <Composition id="V09ExponentiellThumbnailA" component={ExponentiellThumbnailA} durationInFrames={1} fps={FPS} width={1080} height={1920}/>
    <Composition id="V09ExponentiellThumbnailB" component={ExponentiellThumbnailB} durationInFrames={1} fps={FPS} width={1080} height={1920}/>
    <Composition id="V09ExponentiellThumbnailC" component={ExponentiellThumbnailC} durationInFrames={1} fps={FPS} width={1080} height={1920}/>
    <Composition id="KnnShort" component={KnnShort} durationInFrames={sec(53)} fps={FPS} width={W} height={H} />
    <Composition id="Phantomstau" component={Phantom} durationInFrames={sec(TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ProfilLogo" component={ProfileLogo} durationInFrames={1} fps={FPS} width={800} height={800} />
    <Composition id="Wortmarke" component={WordmarkWide} durationInFrames={1} fps={FPS} width={1600} height={400} />
    <Composition id="ZenonThumbnail" component={ZenoThumbnail} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    <Composition id="KanalBanner" component={ChannelBanner} durationInFrames={1} fps={FPS} width={2560} height={1440} />
    <Composition id="Primzahlspirale" component={Spiral} durationInFrames={sec(SPIRAL_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition
      id="Zenon"
      component={Zeno}
      schema={zenoSchema}
      defaultProps={{
        figurFarbe: '#1f7ae0',
        tuerFarbe: '#d61f69',
        etappenFarbe1: '#1f7ae0',
        etappenFarbe2: '#f97316',
        etappenFarbe3: '#d61f69',
        hookStehenbleibenSek: 2.2,
        tuerTempo: 1.6,
        uebergangSek: 0.6,
        buesteHoeheAnfang: 450,
        buesteHoeheZeile5: 340,
        quadratZoomEnde: 4,
        kameraZoomLauf: 1.4,
        laufzeitSek: 2,
      }}
      durationInFrames={sec(ZENO_TOTAL)}
      fps={FPS}
      width={W}
      height={H}
    />
    {/* Neue Videos aus dem Workflow (npm run pg -- new ...) */}
    {VIDEOS.map((v) => (
      <Composition key={v.id} id={v.id} component={v.component} durationInFrames={sec(v.durationSec)} fps={FPS} width={v.width ?? W} height={v.height ?? H} />
    ))}
    {VIDEOS.map((v) => (v.scenes ? <v.scenes key={`${v.id}-scenes`} /> : null))}
    {SCENE_CLIPS.map((c) => (
      <Composition key={c.id} id={c.id} component={c.component} durationInFrames={c.frames} fps={FPS} width={c.width} height={c.height} />
    ))}
  </>
);

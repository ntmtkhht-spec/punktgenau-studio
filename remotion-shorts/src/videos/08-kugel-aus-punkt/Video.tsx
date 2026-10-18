import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, DotBackground, FONT} from '../../shared';

export const DURATION = 24;
const TAU = Math.PI * 2;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => {const u=clamp(x); return u*u*u*(u*(u*6-15)+10);};
const lerp = (a: number,b: number,t: number) => a+(b-a)*t;
/** Match position, speed AND acceleration at both ends of the braking interval. */
const spin = (t: number, onset: number, turns: number, decay: number, drift: number, brake: number, end: number, period: number) => {
  const u=Math.max(0,t-onset);
  const raw=(v:number)=>TAU*(turns*(1-Math.exp(-decay*v))+drift*v);
  if(t<brake)return raw(u);
  const u0=brake-onset,h=end-brake,s=clamp((t-brake)/h);
  const p0=raw(u0),v0=TAU*(turns*decay*Math.exp(-decay*u0)+drift);
  const a0=-TAU*turns*decay*decay*Math.exp(-decay*u0);
  const target=Math.round((p0+v0*h*.5)/period)*period;
  const d=target-p0,v=v0*h,a=a0*h*h;
  return p0+v*s+.5*a*s*s+(10*d-6*v-1.5*a)*s**3+(-15*d+8*v+1.5*a)*s**4+(6*d-3*v-.5*a)*s**5;
};
const VERTEX = `attribute vec2 vertex; void main(){gl_Position=vec4(vertex,0.,1.);}`;
const FRAGMENT = `
precision highp float;
uniform vec2 resolution;
uniform float mode, angle, exposure, radius, amplitude, centreX, pointShading, motionCue;
const float PI=3.141592653589793;
const vec3 BLUE=vec3(0.1215686,0.4784314,0.8784314);
vec3 lit(vec3 normal) {
  vec3 light=normalize(vec3(-0.48,0.62,0.65));
  float diffuse=max(0.,dot(normal,light));
  float spec=pow(max(0.,dot(normal,normalize(light+vec3(0.,0.,1.)))),30.);
  return BLUE*(0.17+0.86*diffuse)+vec3(0.12,0.16,0.19)*spec;
}
void main(){
  vec2 p=(gl_FragCoord.xy-vec2(centreX,resolution.y-800.))/radius;
  float aa=1.3/radius;
  if(mode<0.5){
    float rr=dot(p,p);
    if(rr>1.+aa) discard;
    float alpha=1.-smoothstep(1.-aa,1.+aa,sqrt(rr));
    vec3 sphereNormal=vec3(p,sqrt(max(0.,1.-rr)));
    float longitude=atan(p.x,max(.0001,sphereNormal.z));
    // Soft meridian streaks reveal speed while the silhouette is still closed.
    float streak=1.+motionCue*cos(32.*longitude-2.*angle);
    vec3 sphereColor=lit(sphereNormal)*streak;
    if(exposure>=PI){gl_FragColor=vec4(sphereColor,alpha);return;}
    // Exact silhouette of the disk's shutter sweep. Average illumination
    // over that same exposure instead of choosing a different frontmost
    // plane on each side of x=0 (which produced a hard central light seam).
    float begin=angle-exposure*.5, end=angle+exposure*.5;
    float width=max(abs(cos(begin)),abs(cos(end)));
    if(ceil(begin/PI)<=floor(end/PI))width=1.;
    width=max(width,.0015);
    vec2 diskPoint=vec2(p.x/width,p.y);
    float edgeAA=aa/max(width,.025);
    float coverage=1.-smoothstep(1.-edgeAA,1.+edgeAA,length(diskPoint));
    if(coverage<.001)discard;
    vec3 illumination=vec3(0.);float weight=0.;
    float trailCoverage=0.,trailWeight=0.;
    for(int j=0;j<72;j++){
      float offset=float(j)/71.-.5;
      float a=angle+exposure*offset;
      float ca=cos(a);
      vec3 n=vec3(sin(a),0.,ca);
      if(ca<0.)n=-n;
      float w=max(abs(ca),.0001);
      illumination+=lit(n)*w;weight+=w;
      float sampleWidth=max(abs(ca),.0015);
      float sampleAA=aa/max(sampleWidth,.025);
      float sampleCoverage=1.-smoothstep(1.-sampleAA,1.+sampleAA,length(vec2(p.x/sampleWidth,p.y)));
      float shutterWeight=exp(-8.*offset*offset);
      trailCoverage+=sampleCoverage*shutterWeight;
      trailWeight+=shutterWeight;
    }
    float envelope=smoothstep(0.05,2.8,exposure);
    // Gentle fill light keeps the disk readable as it turns edge-on,
    // without the dark flashes of a single-sided plane light.
    vec3 diskLight=mix(illumination/max(weight,.0001),lit(vec3(0.,0.,1.)),.22);
    vec3 color=mix(diskLight,sphereColor,envelope);
    float coreWidth=max(abs(cos(angle)),.0015);
    float coreAA=aa/max(coreWidth,.025);
    float core=1.-smoothstep(1.-coreAA,1.+coreAA,length(vec2(p.x/coreWidth,p.y)));
    float blurred=max(core,trailCoverage/max(trailWeight,.0001));
    gl_FragColor=vec4(color,alpha*mix(blurred,coverage,envelope));
  } else if(mode<1.5){
    float rr=length(p);
    if(rr>1.+aa)discard;
    float polar=atan(p.y,p.x);
    float delta=abs(mod(polar-angle+PI*.5,PI)-PI*.5);
    // A narrow, solid line plus a continuously fading exposure trail.
    // The previous union of all positions made opaque rotating pie slices.
    float distance=rr*abs(sin(delta));
    float solid=1.-smoothstep(.0171875-aa,.0171875+aa,distance);
    float sigma=max(exposure*.45,.0001);
    float trail=exp(-2.*sin(delta)*sin(delta)/(sigma*sigma));
    trail=mix(trail,1.,smoothstep(1.5,PI,exposure));
    trail*=smoothstep(.01,.15,exposure);
    float alpha=max(solid,trail)*(1.-smoothstep(1.-aa,1.+aa,rr));
    if(alpha<.001)discard;
    gl_FragColor=vec4(lit(vec3(0.,0.,1.)),alpha);
  } else {
    // Analytic shutter interval of one moving spherical point.
    float lo=sin(angle-exposure*.5), hi=sin(angle+exposure*.5);
    float mn=min(lo,hi), mx=max(lo,hi);
    float begin=angle-exposure*.5, end=angle+exposure*.5;
    if(ceil((begin-PI*.5)/(2.*PI))<=floor((end-PI*.5)/(2.*PI)))mx=1.;
    if(ceil((begin+PI*.5)/(2.*PI))<=floor((end+PI*.5)/(2.*PI)))mn=-1.;
    mn*=amplitude;mx*=amplitude;
    float nearX=clamp(p.x,mn,mx);
    vec2 q=vec2(p.x-nearX,p.y);
    float rr=dot(q,q);
    if(rr>1.+aa)discard;
    float alpha=1.-smoothstep(1.-aa,1.+aa,sqrt(rr));
    vec3 pointColor=lit(vec3(q,sqrt(max(0.,1.-rr))));
    gl_FragColor=vec4(mix(lit(vec3(0.,0.,1.)),pointColor,pointShading),alpha);
  }
}`;
type Renderer = {gl: WebGLRenderingContext; program: WebGLProgram};
const setup = (canvas: HTMLCanvasElement): Renderer => {
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:true,premultipliedAlpha:false});
  if(!gl)throw new Error('WebGL exposure renderer unavailable');
  const shader=(type:number,source:string)=>{
    const s=gl.createShader(type)!;gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)??'Shader error');
    return s;
  };
  const program=gl.createProgram()!;
  gl.attachShader(program,shader(gl.VERTEX_SHADER,VERTEX));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FRAGMENT));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)??'Link error');
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const v=gl.getAttribLocation(program,'vertex');gl.enableVertexAttribArray(v);gl.vertexAttribPointer(v,2,gl.FLOAT,false,0,0);
  gl.viewport(0,0,1080,1920);gl.clearColor(0,0,0,0);
  return {gl,program};
};

// Silent choreography; the user explicitly requested this video without a script.
export const Video: React.FC = () => {
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
  const canvas=useRef<HTMLCanvasElement>(null);const renderer=useRef<Renderer|null>(null);
  useLayoutEffect(()=>{
    if(!canvas.current)return;
    const {gl,program}=renderer.current??(renderer.current=setup(canvas.current));
    let mode=0,angle=0,exposure=TAU,radius=320,amplitude=0,pointShading=1,motionCue=0;
    if(t<6.4){
      const u=Math.max(0,t-1.5);
      // Fast initial sweep remains visible through the soft shutter trails;
      // then it decelerates to the same front-facing circle.
      const turn=clamp(u/4.9);
      angle=8*TAU*(1-(1-turn)**3);
      motionCue=.11*ease((t-.9)/.55)*(1-ease((t-3.15)/.75));
      exposure=TAU*Math.exp(-1.38*u)*(1-ease((t-5.1)/1.0));
      if(t<1.5)exposure=TAU;
    } else if(t<12.4){
      mode=1;
      angle=spin(t,7.8,7,1.45,.4,11.05,12.4,Math.PI);
      exposure=Math.PI*(1-ease((t-7.3)/4.6));
    } else if(t<18.5){
      mode=2;radius=5.5;
      // Keep the entire moving line/point sequence flat. Only the stopped
      // point gains spherical lighting immediately before the camera zoom.
      pointShading=ease((t-17.9)/.5);
      const u=Math.max(0,t-13.3);
      angle=TAU*(9*(1-Math.exp(-1.15*u))+.45*u);
      exposure=TAU*Math.exp(-1.7*u)*(1-ease((t-16.7)/.7));
      amplitude=(320-radius)/radius*(1-ease((t-16.9)/1.0));
    } else {
      // Zoom directly into the same small sphere: no reverse-building montage.
      mode=2;angle=0;exposure=0;amplitude=0;
      const zoom=ease((t-18.8)/3.2);
      radius=Math.exp(lerp(Math.log(5.5),Math.log(320),zoom));
    }
    gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
    gl.uniform2f(gl.getUniformLocation(program,'resolution'),1080,1920);
    for(const [key,value] of Object.entries({mode,angle,exposure,radius,amplitude,pointShading,motionCue,centreX:520}))gl.uniform1f(gl.getUniformLocation(program,key),value);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);gl.finish();
  },[t]);
  const segments: [number,number,string,string][]=[
    [0,3.3,'Das ist eine Kugel.','Oder?'],
    [3.3,6.4,'Es ist ein Kreis.','Er dreht sich seitwärts.'],
    [6.4,9.0,'Das ist ein Kreis.','Oder?'],
    [9.0,12.4,'Es ist eine Linie.','Sie dreht sich im Kreis.'],
    [12.4,15.2,'Das ist eine Linie.','Oder?'],
    [15.2,18.5,'Es ist ein Punkt.','Er bewegt sich hin und her.'],
    [18.5,21.8,'Schau genauer hin.',''],
    [21.8,24,'Das ist eine Kugel.','Oder?'],
  ];
  const [start,end,title,sub]=segments.find(([a,b])=>t>=a&&t<b)??segments[0];
  const opacity=(start===0?1:ease((t-start)/.4))*(end===24?1:1-ease((t-(end-.4))/.4));
  return <AbsoluteFill style={{backgroundColor:COLORS.bg,fontFamily:FONT}}>
    <Audio src={staticFile('08-kugel-aus-punkt/cornfield-chase.wav')}/>
    <DotBackground/>
    <div style={{position:'absolute',top:210,width:'100%',textAlign:'center',fontSize:23,fontWeight:800,letterSpacing:7,color:COLORS.muted}}>PUNKTGENAU</div>
    <canvas ref={canvas} width={1080} height={1920} style={{position:'absolute',inset:0}}/>
    <div style={{position:'absolute',top:302,left:80,right:80,textAlign:'center',opacity,paintOrder:'stroke',WebkitTextStroke:'10px white'}}>
      <div style={{fontSize:70,fontWeight:800,lineHeight:1.15,letterSpacing:-2.8}}>{title}</div>
      <div style={{fontSize:36,fontWeight:500,marginTop:24,color:COLORS.blue}}>{sub}</div>
    </div>
  </AbsoluteFill>;
};

// Shared SH2-style finish for every ХАНИАД three.js page: bloom, then grade + grain in display space.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

export function createLook(renderer,scene,camera,W,H){
  const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
  const bloom=new UnrealBloomPass(new THREE.Vector2(W,H),.35,.6,.92);composer.addPass(bloom);
  composer.addPass(new OutputPass());
  // SH2-style finish: soft PS2 image, muted colour, green-grey lifted blacks, warm highlights, vignette, moving grain.
  const grade=new ShaderPass({uniforms:{tDiffuse:{value:null},time:{value:0},fade:{value:1},texel:{value:new THREE.Vector2(1/W,1/H)}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform sampler2D tDiffuse;uniform float time,fade;uniform vec2 texel;varying vec2 vUv;
  float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
  void main(){
    vec2 d=vUv-.5;float r=dot(d,d);
    vec3 c;c.r=texture2D(tDiffuse,vUv+d*.0035).r;c.g=texture2D(tDiffuse,vUv).g;c.b=texture2D(tDiffuse,vUv-d*.0035).b;
    vec3 soft=(texture2D(tDiffuse,vUv+texel*vec2(1.5,0.)).rgb+texture2D(tDiffuse,vUv-texel*vec2(1.5,0.)).rgb+texture2D(tDiffuse,vUv+texel*vec2(0.,1.5)).rgb+texture2D(tDiffuse,vUv-texel*vec2(0.,1.5)).rgb)*.25;
    c=mix(c,soft,.28);
    float l=dot(c,vec3(.299,.587,.114));
    c=mix(vec3(l),c,.74);
    c=mix(c*vec3(.92,1.0,.98),c*vec3(1.06,.98,.88),smoothstep(.15,.7,l));
    c=c*.94+vec3(.016,.02,.018);
    c=pow(c,vec3(1.06));
    c*=1.-.9*r*r*4.-.35*r;
    float g=h(vUv*vec2(1920.,1080.)+fract(time*7.13)*vec2(311.,173.))-.5;
    c+=g*(.045-.025*l);
    gl_FragColor=vec4(c*fade,1.);
  }`});composer.addPass(grade);
  return {composer,bloom,grade};
}

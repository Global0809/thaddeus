/* Thaddeus emerald halo ring — authored native Hydra meshes and GLSL.
   The compatibility API keeps the approved selector/camera/touch journey intact.
   Materials use analytic studio reflections, not a ray-traced gemstone claim. */
(()=>{
  'use strict';
  const TAU=Math.PI*2,instances=[],sections=new WeakMap(),intros=new WeakMap(),cache=new Map();
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let reduced=preference.matches,registered=false,clock=0,lastFrame=-1,serial=0;
  preference.addEventListener?.('change',e=>{reduced=e.matches;});
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function registerShaders(){
    if(registered)return;
    const vertex=`attribute float aFinish;varying vec3 vNormal;varying vec3 vEye;varying vec3 vLocal;varying vec2 vUv;varying float vFinish;
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vEye=-mv.xyz;vLocal=position;vUv=uv;vFinish=aFinish;gl_Position=projectionMatrix*mv;}`;
    const metal=`uniform float uDarken;uniform float uWhite;varying vec3 vNormal;varying vec3 vEye;varying vec3 vLocal;varying vec2 vUv;varying float vFinish;
      float card(vec3 r,vec3 d,float power){return pow(max(dot(r,normalize(d)),0.),power);}
      void main(){vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;vec3 v=normalize(vEye),r=reflect(-v,n);
      float f=pow(1.-clamp(dot(n,v),0.,1.),4.);
      float key=card(r,vec3(-.65,.72,.8),11.);float soft=card(r,vec3(.55,.1,1.),5.);float edge=card(r,vec3(.3,-.9,.4),28.);
      float narrow=pow(max(0.,1.-abs(r.x*.85+r.y*.2-.27)),34.);
      vec3 gold=vec3(.62,.37,.11),lightGold=vec3(1.,.82,.43),silver=vec3(.68,.77,.78);
      vec3 base=mix(gold,silver,uWhite);vec3 highlight=mix(lightGold,vec3(.9,1.,1.),uWhite);
      float diffuse=max(dot(n,normalize(vec3(-.4,.8,.9))),0.);
      vec3 color=base*(.22+.36*diffuse)+highlight*(key*.92+soft*.50+edge*.85+narrow*.40);
      color+=vec3(.11,.39,.38)*card(r,vec3(-.9,-.1,-.2),3.)*.28;
      color+=highlight*f*.24;gl_FragColor=vec4(color*(1.-uDarken*.9),1.);}`;
    const emerald=`uniform float uDarken;uniform float uTime;varying vec3 vNormal;varying vec3 vEye;varying vec3 vLocal;varying vec2 vUv;varying float vFinish;
      float card(vec3 r,vec3 d,float p){return pow(max(dot(r,normalize(d)),0.),p);}
      void main(){vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;vec3 v=normalize(vEye),r=reflect(-v,n),t=refract(-v,n,.63);
      float fresnel=pow(1.-clamp(dot(n,v),0.,1.),3.);
      vec2 p=vec2(vLocal.x/.28,vLocal.y/.37);float angle=atan(p.y,p.x);
      float cut=sin(angle*7.+floor(length(p)*5.)*1.7+vFinish*5.1+r.x*2.);
      float stepCuts=step(.35,cut)*.32+step(.77,sin(angle*11.-length(p)*15.+r.y*4.))*.24;
      float depth=sin(t.x*17.+t.y*12.+vFinish*11.)*.5+.5;
      vec3 dark=vec3(.003,.052,.029),green=vec3(.016,.34,.17),lit=vec3(.12,.74,.43);
      vec3 col=mix(dark,green,.28+depth*.45+vFinish*.20);col=mix(col,lit,stepCuts*.62);
      float interior=pow(max(0.,sin(p.x*9.+p.y*5.+r.x*2.)*sin(p.y*11.-p.x*7.)),4.);
      col+=vec3(.025,.30,.12)*interior*.65;
      float key=card(r,vec3(-.6,.8,1.),22.),edge=card(r,vec3(.7,-.6,.6),40.);
      col+=vec3(.70,1.,.91)*(key*.75+edge*.9+fresnel*.18);
      col*=.82+vFinish*.40;gl_FragColor=vec4(col*(1.-uDarken*.9),1.);}`;
    const diamond=`uniform float uDarken;varying vec3 vNormal;varying vec3 vEye;varying vec3 vLocal;varying vec2 vUv;varying float vFinish;
      void main(){vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;vec3 v=normalize(vEye),r=reflect(-v,n);float face=abs(dot(n,v));
      float a=pow(max(dot(r,normalize(vec3(-.6,.8,1.))),0.),13.);float b=pow(max(dot(r,normalize(vec3(.8,-.3,.6))),0.),25.);
      float shards=step(.15,sin(vFinish*41.+r.x*7.+r.y*9.));
      vec3 col=mix(vec3(.035,.065,.07),vec3(.62,.77,.79),shards*.78+face*.15);
      col+=vec3(.87,1.,1.)*(a*1.12+b*.8+pow(1.-face,3.)*.24);
      col+=vec3(.07,.11,.12)*sin(vFinish*30.);gl_FragColor=vec4(col*(1.-uDarken*.9),1.);}`;
    const poolVertex=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
    const pool=`uniform float uDarken;varying vec2 vUv;void main(){vec2 p=(vUv-.5)*2.;float a=exp(-dot(p,p)*5.)*.14;gl_FragColor=vec4(vec3(.025,.27,.25),a*(1.-uDarken*.9));}`;
    for(const [name,vs,fs]of [['ThaddeusGold',vertex,metal],['ThaddeusEmerald',vertex,emerald],['ThaddeusDiamond',vertex,diamond],['ThaddeusPool',poolVertex,pool]]){Shaders.parse(vs,name+'.vs');Shaders.parse(fs,name+'.fs');}
    registered=true;
  }
  const data=()=>({p:[],n:[],uv:[],finish:[],i:[]});
  function triangle(d,a,b,c,f=.5){
    const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
    const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n)||1;
    const base=d.p.length/3;for(const [j,p]of [a,b,c].entries()){d.p.push(...p);d.n.push(n[0]/len,n[1]/len,n[2]/len);d.uv.push(j===1?1:0,j===2?1:0);d.finish.push(f);}d.i.push(base,base+1,base+2);
  }
  function quad(d,a,b,c,e,f=.5){triangle(d,a,b,c,f);triangle(d,a,c,e,f);}
  function geometry(d){const g=new Geometry();g.addAttribute('position',new GeometryAttribute(new Float32Array(d.p),3));g.addAttribute('normal',new GeometryAttribute(new Float32Array(d.n),3));g.addAttribute('uv',new GeometryAttribute(new Float32Array(d.uv),2));g.addAttribute('aFinish',new GeometryAttribute(new Float32Array(d.finish),1));g.setIndex(new Uint16Array(d.i));g.keepAlive=true;g.computeBoundingBox();g.computeBoundingSphere();return g;}
  function cached(key,make){if(!cache.has(key))cache.set(key,make());return cache.get(key);}
  function octagon(w,h,clip,z,cx=0,cy=0){return [[-w/2+clip,-h/2,z],[w/2-clip,-h/2,z],[w/2,-h/2+clip,z],[w/2,h/2-clip,z],[w/2-clip,h/2,z],[-w/2+clip,h/2,z],[-w/2,h/2-clip,z],[-w/2,-h/2+clip,z]].map(p=>[p[0]+cx,p[1]+cy,p[2]]);}
  function facetedOctagon(d,cx,cy,z,w,h,depth,seed=0){
    const levels=[octagon(w*.14,h*.14,Math.min(w,h)*.035,z-depth*.85,cx,cy),octagon(w,h,Math.min(w,h)*.15,z-depth*.08,cx,cy),octagon(w,h,Math.min(w,h)*.15,z,cx,cy),octagon(w*.72,h*.77,Math.min(w,h)*.12,z+depth*.29,cx,cy)];
    for(let layer=0;layer<3;layer++)for(let i=0;i<8;i++){const j=(i+1)%8,a=levels[layer],b=levels[layer+1];quad(d,a[i],a[j],b[j],b[i],((i*13+layer*7+seed*3)%29)/29);}
    const top=levels[3],centre=[cx,cy,z+depth*.29];
    for(let i=0;i<8;i++)triangle(d,centre,top[i],top[(i+1)%8],((i*7+seed*11)%19)/19);
  }
  function roundDiamond(d,cx,cy,z,r,seed=0){
    const levels=[{r:.09,z:-.055},{r:1,z:0},{r:.58,z:.027}],count=8;
    const pts=levels.map(l=>Array.from({length:count},(_,i)=>{const a=i/count*TAU+Math.PI/8;return[cx+Math.cos(a)*r*l.r,cy+Math.sin(a)*r*l.r,z+l.z*(r/.043)];}));
    for(let l=0;l<2;l++)for(let i=0;i<count;i++){const j=(i+1)%count;quad(d,pts[l][i],pts[l][j],pts[l+1][j],pts[l+1][i],((i*11+seed*7+l*13)%31)/31);}
    for(let i=0;i<count;i++)triangle(d,[cx,cy,z+.027*(r/.043)],pts[2][i],pts[2][(i+1)%count],((i*17+seed*7)%31)/31);
  }
  function tube(d,path,r,sides=8){
    for(let i=0;i<path.length-1;i++){
      const a=path[i],b=path[i+1],t=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],len=Math.hypot(...t)||1;t[0]/=len;t[1]/=len;t[2]/=len;
      let n=Math.abs(t[1])<.95?[-t[2],0,t[0]]:[0,t[2],-t[1]],nl=Math.hypot(...n)||1;n=n.map(x=>x/nl);const bin=[t[1]*n[2]-t[2]*n[1],t[2]*n[0]-t[0]*n[2],t[0]*n[1]-t[1]*n[0]];
      function point(p,j){const q=j/sides*TAU;return p.map((x,k)=>x+r*(n[k]*Math.cos(q)+bin[k]*Math.sin(q)));}
      for(let j=0;j<sides;j++)quad(d,point(a,j),point(b,j),point(b,j+1),point(a,j+1),.7);
    }
  }
  function sphere(d,c,r,seg=8,rings=5){
    const p=(i,j)=>{const a=i/seg*TAU,b=(j/rings)*Math.PI;return[c[0]+Math.cos(a)*Math.sin(b)*r,c[1]+Math.cos(b)*r,c[2]+Math.sin(a)*Math.sin(b)*r];};
    for(let j=0;j<rings;j++)for(let i=0;i<seg;i++){if(j>0)triangle(d,p(i,j),p(i+1,j),p(i+1,j+1),.9);if(j<rings-1)triangle(d,p(i,j),p(i+1,j+1),p(i,j+1),.9);}
  }
  function assets(mobile){return cached('jewellery:'+mobile,()=>{
    const gold=data(),white=data(),emerald=data(),diamonds=data(),steps=mobile?48:80;
    // The crown and halo are upright, with a complete double shank behind.
    facetedOctagon(emerald,0,0,.22,.52,.70,.22,3);
    for(const y of [-.045,.045]){
      const band=Array.from({length:steps+1},(_,i)=>{const a=i/steps*TAU;return[Math.cos(a)*.455,y,-.21+Math.sin(a)*.455];});tube(gold,band,.033,mobile?8:12);
    }
    // Shoulders meet the crown, and gallery struts hold it above the shank.
    for(const sign of [-1,1]){
      for(const y of [-.07,.07])tube(gold,[[sign*.43,y,-.12],[sign*.37,y,.05],[sign*.29,y,.20]],.032,8);
      tube(gold,[[sign*.24,-.26,.09],[sign*.31,-.12,.11],[sign*.29,.19,.12],[sign*.23,.29,.09]],.018,8);
    }
    const bezel=octagon(.555,.74,.08,.192);bezel.push(bezel[0]);tube(gold,bezel,.018,8);
    const innerHalo=octagon(.64,.84,.10,.16);innerHalo.push(innerHalo[0]);tube(white,innerHalo,.017,8);
    const outerHalo=octagon(.81,1.01,.13,.14);outerHalo.push(outerHalo[0]);tube(gold,outerHalo,.016,8);
    const gallery=octagon(.57,.75,.10,.06);gallery.push(gallery[0]);tube(gold,gallery,.020,8);
    // Round brilliant halo with north/south/east/west baguettes.
    let seed=1;
    for(const x of [-.345,.345])for(const y of [-.32,-.22,-.11,.11,.22,.32]){roundDiamond(diamonds,x,y,.20,.045,seed++);sphere(white,[x-.032,y,.196],.009,6,4);sphere(white,[x+.032,y,.196],.009,6,4);}
    for(const y of [-.445,.445])for(const x of [-.22,-.11,.11,.22]){roundDiamond(diamonds,x,y,.20,.045,seed++);sphere(white,[x,y-.032,.196],.009,6,4);sphere(white,[x,y+.032,.196],.009,6,4);}
    for(const sx of [-1,1])for(const sy of [-1,1]){roundDiamond(diamonds,sx*.297,sy*.394,.20,.046,seed++);tube(gold,[[sx*.217,sy*.30,.11],[sx*.233,sy*.317,.272]],.014,8);sphere(gold,[sx*.233,sy*.317,.272],.020,8,5);}
    facetedOctagon(diamonds,0,.444,.204,.13,.066,.048,34);facetedOctagon(diamonds,0,-.444,.204,.13,.066,.048,35);
    facetedOctagon(diamonds,.344,0,.204,.067,.14,.048,36);facetedOctagon(diamonds,-.344,0,.204,.067,.14,.048,37);
    // Pavé on the visible shoulder surfaces; each stone is a real cut mesh.
    for(const sign of [-1,1])for(let i=0;i<(mobile?5:7);i++){
      const t=i/(mobile?4:6),x=sign*(.29+t*.15),z=.13-t*.17;
      for(const y of [-.042,.042])roundDiamond(diamonds,x,y,z,.023,seed++);
    }
    return {gold:geometry(gold),white:geometry(white),emerald:geometry(emerald),diamonds:geometry(diamonds),triangles:(gold.i.length+white.i.length+emerald.i.length+diamonds.i.length)/3,stoneCount:seed-1+5};
  });}
  function shader(name,u,extra){const s=new Shader(name,Object.assign({},u,extra||{}));s.side=Shader.DOUBLE_SIDE;return s;}
  function poolGeometry(){return cached('pool',()=>geometry({p:[-1.1,-.63,-.9,1.1,-.63,-.9,1.1,-.63,.9,-1.1,-.63,.9],n:[0,1,0,0,1,0,0,1,0,0,1,0],uv:[0,0,1,0,1,1,0,1],finish:[0,0,0,0],i:[0,2,1,0,3,2]}));}
  function createCore(world,kind,label,host){
    registerShaders();const mobile=!!(Global.isMobile||Device.mobile),source=assets(mobile);
    const u={uTime:{value:0},uDarken:{value:0}},group=new Group(),jewel=new Group(),meshes=[];
    group.name='Thaddeus — emerald halo ring';group.isAicanfeelEnergy=true;group.isThaddeusJewellery=true;
    const compositionScale=kind==='selector'?.78:(mobile&&kind==='world'?.80:1);
    const scale=.95*(kind==='film'?1.08:1)*compositionScale;group.scale.set(scale,scale,scale);group.add(jewel);
    for(const [key,name,material,extra]of [['gold','Polished gold double shank, bezel and prongs','ThaddeusGold',{uWhite:{value:0}}],['white','White-metal halo and stone claws','ThaddeusGold',{uWhite:{value:1}}],['emerald','Emerald-cut green centre stone','ThaddeusEmerald',null],['diamonds','Brilliant and baguette halo with pavé shoulders','ThaddeusDiamond',null]]){
      const mesh=new Mesh(source[key],shader(material,u,extra));mesh.name=name;mesh.frustumCulled=false;jewel.add(mesh);meshes.push(mesh);
    }
    const poolShader=shader('ThaddeusPool',u);poolShader.transparent=true;poolShader.depthWrite=false;poolShader.blending=Shader.ADDITIVE_BLENDING;
    const pool=new Mesh(poolGeometry(),poolShader);pool.name='Teal studio floor reflection';pool.frustumCulled=false;group.add(pool);meshes.push(pool);
    group._energyHoverShader=meshes[0].shader;
    const core={id:++serial,group,jewel,meshes,u,world,kind,label,host,mobile,count:0,triangles:source.triangles,stoneCount:source.stoneCount,lastRendered:-1,progress:0};instances.push(core);return core;
  }
  function hideGarments(target){function hide(node){if(node.isAicanfeelEnergy||node.isHitMesh)return;if(node.isMesh||node.isPoints||node.isLine)node.visible=false;for(const child of node.children||[])hide(child);}if(target.isMesh&&target.shader)target.shader.visible=false;for(const child of target.children.slice())hide(child);}
  function worldIndex(section,name){const text=String(section.page?.perma||section.parent?.perma||name),m=text.match(/world[_-]?([123])/i);return m?+m[1]-1:0;}
  function tick(){if(document.hidden)return;const frame=Render.TIME;if(frame!==lastFrame){lastFrame=frame;clock+=Math.min(.05,Math.max(0,Render.DELTA||16.67)/1000);}}
  function update(core,progress=0){if(document.hidden)return;tick();core.lastRendered=Render.TIME;core.progress=clamp(progress,0,1);const t=reduced?0:clock;core.u.uTime.value=t;
    const poses=[[-.16,-.25,.03],[-.27,.42,-.06],[-.12,-.42,.08]],b=poses[core.world];
    core.jewel.rotation.set(b[0]+Math.sin(t*.16)*.022,b[1]+Math.sin(t*.11)*.11,b[2]+Math.sin(t*.09)*.012);
    const compositionY=core.mobile&&core.kind==='world'?-.14:0;
    core.jewel.position.y=compositionY+(reduced?0:Math.sin(t*.24+core.world)*.008);
  }
  function installSection(section,layers,layoutName,index){if(sections.has(section))return sections.get(section).group;const world=worldIndex(section,layoutName),kind=index===2?'film':index===1?'macro':'world',core=createCore(world,kind,layoutName||section.name,section);const candidate=layers.product?.group||layers.product;if(candidate?.add){hideGarments(candidate);candidate.add(core.group);}else{core.group.position.x=.65;(section.layout?.group||section.scene).add(core.group);}section.energyCore=core.group;sections.set(section,core);update(core,0);return core.group;}
  function updateSection(section){const core=sections.get(section);if(core)update(core,section.currentShowPercent2||0);}
  function installIntro(controller,layers,camera){if(intros.has(controller))return;const items=[];for(const [world,name]of ['product2','product1','product3'].entries()){const product=layers[name]?.group||layers[name];if(!product?.add)continue;const core=createCore(world,'selector','intro-'+world,controller);hideGarments(product);product.add(core.group);items.push(core);update(core,0);}intros.set(controller,items);return items.map(c=>c.group);}
  function updateIntro(controller){for(const core of intros.get(controller)||[])update(core,0);}
  function getStats(){const now=typeof Render!=='undefined'?Render.TIME:0;const items=instances.map(c=>({id:c.id,layout:c.label,phase:['The Stone','The Setting','The Presence'][c.world],kind:c.kind,mobile:c.mobile,points:0,meshes:c.meshes.length,triangles:c.triangles,stones:c.stoneCount,visible:!!(!document.hidden&&now-c.lastRendered<250&&(c.kind==='selector'||c.host.visible!==false)&&c.group.determineVisible()),lastRendered:c.lastRendered,progress:Math.round(c.progress*1000)/1000}));return{mode:'native-3d-thaddeus-emerald-ring',instances:items.length,visible:items.filter(i=>i.visible).length,points:0,mobile:instances.some(i=>i.mobile),reducedMotion:reduced,paused:document.hidden,elapsed:clock,motionTime:reduced?0:clock,geometries:cache.size,items};}
  window.AICANFEEL_ENERGY={installSection,updateSection,installIntro,updateIntro,getStats};window.THADDEUS_JEWELLERY=window.AICANFEEL_ENERGY;
})();

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
      float f=pow(1.-clamp(dot(n,v),0.,1.),5.);
      float key=card(r,vec3(-.65,.72,.8),6.);float soft=card(r,vec3(.55,.1,1.),3.);float edge=card(r,vec3(.3,-.9,.4),18.);
      float narrow=pow(max(0.,1.-abs(r.x*.85+r.y*.2-.27)),100.);
      float blackCard=pow(max(0.,1.-abs(r.x*.7-r.y*.32+.20)),24.);
      vec3 gold=vec3(.84,.54,.20),lightGold=vec3(1.,.91,.63),silver=vec3(.74,.81,.84);
      vec3 base=mix(gold,silver,uWhite);vec3 highlight=mix(lightGold,vec3(.93,.98,1.),uWhite);
      float diffuse=max(dot(n,normalize(vec3(-.4,.8,.9))),0.);
      vec3 color=base*(.32+.43*diffuse)*(1.-blackCard*.48)+highlight*(key*1.10+soft*.78+edge*.90+narrow*.95);
      color+=vec3(.08,.30,.29)*card(r,vec3(-.9,-.1,-.2),4.)*.23;
      color+=highlight*f*.24;color=vec3(1.)-exp(-color*1.24);
      gl_FragColor=vec4(color*(1.-uDarken*.9),1.);}`;
    const opticalVertex=`varying vec3 vLocal;varying vec3 vLocalNormal;varying vec3 vLocalEye;varying mat3 vOpticBasis;
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.);mat3 basis=mat3(modelViewMatrix);
      vLocal=position;vLocalNormal=normal;vOpticBasis=basis;
      vLocalEye=vec3(dot(basis[0],-mv.xyz)/dot(basis[0],basis[0]),dot(basis[1],-mv.xyz)/dot(basis[1],basis[1]),dot(basis[2],-mv.xyz)/dot(basis[2],basis[2]));
      gl_Position=projectionMatrix*mv;}`;
    const opticCount=opticCut().planes.length/4;
    function opticalFragment(bounces){return `uniform float uDarken;uniform vec4 uGemPlanes[${opticCount}];varying vec3 vLocal;varying vec3 vLocalNormal;varying vec3 vLocalEye;varying mat3 vOpticBasis;
      float lightCard(vec3 d,vec3 axis,float rough){return pow(max(dot(d,normalize(axis)),0.),rough);}
      vec3 studio(vec3 d){d=normalize(d);
        vec3 light=vec3(.055,.075,.077)+vec3(.12,.16,.15)*smoothstep(-.5,.8,d.y);
        light+=vec3(1.,.96,.86)*lightCard(d,vec3(-.68,.72,.90),18.)*2.4;
        light+=vec3(.85,.98,1.)*lightCard(d,vec3(.66,.15,.93),14.)*1.8;
        light+=vec3(.80,.98,.93)*lightCard(d,vec3(-.60,.23,-.78),7.)*1.8;
        light+=vec3(.93,.97,1.)*lightCard(d,vec3(.50,-.35,-.80),14.)*2.2;
        light+=vec3(.80,.95,1.)*lightCard(d,vec3(.14,.95,-.12),9.)*1.3;
        float lamp=lightCard(d,vec3(-.21,.33,.92),220.);light+=vec3(1.,.98,.86)*lamp*3.;
        float blackGap=lightCard(d,vec3(-.13,-.55,.78),18.);return light*(1.-blackGap*.72);
      }
      float fresnel(float cosine,float ior){float f=(ior-1.)/(ior+1.);f*=f;return f+(1.-f)*pow(1.-clamp(cosine,0.,1.),5.);}
      float exitHit(vec3 origin,vec3 direction,out vec3 normal){float nearest=10000.;normal=vec3(0.,0.,1.);
        for(int i=0;i<${opticCount};i++){vec4 plane=uGemPlanes[i];float denominator=dot(plane.xyz,direction);
          if(denominator>.00001){float hit=(plane.w-dot(plane.xyz,origin))/denominator;if(hit>.000015&&hit<nearest){nearest=hit;normal=plane.xyz;}}}
        return nearest;
      }
      void main(){vec3 N=normalize(vLocalNormal),incident=-normalize(vLocalEye);if(dot(incident,N)>0.)N=-N;
        float ior=1.58,entryF=fresnel(-dot(incident,N),ior);
        vec3 result=studio(vOpticBasis*reflect(incident,N))*entryF;
        vec3 ray=refract(incident,N,1./ior),origin=vLocal+ray*.00010,weight=vec3(1.-entryF);
        // Actual cut-plane intersections, Fresnel exits and total internal reflections.
        // Green absorption depends on the physical distance travelled inside this cut.
        for(int bounce=0;bounce<${bounces};bounce++){
          vec3 hitNormal;float distance=exitHit(origin,ray,hitNormal);if(distance>100.)break;
          weight*=exp(-vec3(7.4,.62,4.25)*distance);vec3 hit=origin+ray*distance;
          vec3 escaped=refract(ray,-hitNormal,ior);float escapedLength=dot(escaped,escaped);
          if(escapedLength>.00001){float f=fresnel(dot(ray,hitNormal),ior);result+=weight*(1.-f)*studio(vOpticBasis*escaped);weight*=f;}
          ray=reflect(ray,hitNormal);origin=hit+ray*.00010;
        }
        // Close a bounded ray path with a soft studio estimate, rather than black.
        result+=weight*studio(vOpticBasis*ray)*vec3(.18,.62,.30)*.40;
        result=vec3(1.)-exp(-result*1.12);gl_FragColor=vec4(result*(1.-uDarken*.9),1.);
      }`;}
    const diamond=`uniform float uDarken;varying vec3 vNormal;varying vec3 vEye;varying vec3 vLocal;varying vec2 vUv;varying float vFinish;
      void main(){vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;vec3 v=normalize(vEye),r=reflect(-v,n);float face=abs(dot(n,v));
      float a=pow(max(dot(r,normalize(vec3(-.6,.8,1.))),0.),18.);float b=pow(max(dot(r,normalize(vec3(.8,-.3,.6))),0.),42.);
      vec3 refraction=refract(-v,n,.418);float shards=step(.20,sin(vFinish*41.+refraction.x*13.+refraction.y*17.));
      float broad=pow(max(dot(r,normalize(vec3(.1,.4,.95))),0.),3.);
      float hot=pow(max(dot(r,normalize(vec3(-.1,.15,.98))),0.),180.);
      vec3 col=mix(vec3(.035,.056,.064),vec3(.72,.83,.87),shards*.65+face*.13);
      col+=vec3(.93,.98,1.)*(a*1.34+b*1.10+broad*.72+pow(1.-face,4.)*.22+hot*2.5);
      float dispersion=pow(max(dot(r,normalize(vec3(-.8,-.1,.7))),0.),82.);
      col+=vec3(.16,.12,.055)*dispersion*.32;col=vec3(1.)-exp(-col*1.25);
      gl_FragColor=vec4(col*(1.-uDarken*.9),1.);}`;
    const dustVertex=`attribute vec4 aSeed;uniform float uTime;uniform float uPointScale;varying float vAlpha;varying float vFire;
      void main(){vec3 p=position;float cycle=uTime*.045+aSeed.x*6.2831853;
      p.x+=sin(cycle+aSeed.z*4.)*.065;p.y+=cos(cycle*.73+aSeed.y*5.)*.045;p.z+=sin(cycle*.57+aSeed.w*5.)*.065;
      vec4 mv=modelViewMatrix*vec4(p,1.);float fire=pow(aSeed.w,32.);
      gl_PointSize=clamp((.62+fire*2.5)*uPointScale*3.1/max(.7,-mv.z),.58,3.8);
      gl_Position=projectionMatrix*mv;float twinkle=.86+.14*sin(cycle*.70+aSeed.y*28.);
      vAlpha=(.018+.12*pow(aSeed.w,7.))*twinkle;vFire=fire;}`;
    const dust=`uniform float uDarken;varying float vAlpha;varying float vFire;
      void main(){vec2 p=gl_PointCoord-.5;float r=dot(p,p)*4.;if(r>1.)discard;float dotGlow=exp(-r*6.);float pin=exp(-r*31.);
      vec3 colour=mix(vec3(.23,.62,.60),vec3(.81,.95,.91),vFire);
      gl_FragColor=vec4(colour*(.74+pin*.24),vAlpha*(dotGlow+pin*.5)*(1.-uDarken*.92));}`;
    const poolVertex=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
    const pool=`uniform float uDarken;varying vec2 vUv;void main(){vec2 p=(vUv-.5)*2.;float a=exp(-dot(p,p)*5.)*.14;gl_FragColor=vec4(vec3(.025,.27,.25),a*(1.-uDarken*.9));}`;
    for(const [name,vs,fs]of [['ThaddeusGold',vertex,metal],['ThaddeusEmerald',opticalVertex,opticalFragment(3)],['ThaddeusEmeraldMobile',opticalVertex,opticalFragment(2)],['ThaddeusDiamond',vertex,diamond],['ThaddeusPool',poolVertex,pool],['ThaddeusDust',dustVertex,dust]]){Shaders.parse(vs,name+'.vs');Shaders.parse(fs,name+'.fs');}
    registered=true;
  }
  const data=()=>({p:[],n:[],uv:[],finish:[],i:[]});
  function vertex(d,p,n,u=0,v=0,f=.5){const id=d.p.length/3;d.p.push(...p);d.n.push(...n);d.uv.push(u,v);d.finish.push(f);return id;}
  function triangle(d,a,b,c,f=.5){
    const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
    const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n)||1;
    const base=d.p.length/3;for(const [j,p]of [a,b,c].entries()){d.p.push(...p);d.n.push(n[0]/len,n[1]/len,n[2]/len);d.uv.push(j===1?1:0,j===2?1:0);d.finish.push(f);}d.i.push(base,base+1,base+2);
  }
  function quad(d,a,b,c,e,f=.5){triangle(d,a,b,c,f);triangle(d,a,c,e,f);}
  function geometry(d){const g=new Geometry();g.addAttribute('position',new GeometryAttribute(new Float32Array(d.p),3));g.addAttribute('normal',new GeometryAttribute(new Float32Array(d.n),3));g.addAttribute('uv',new GeometryAttribute(new Float32Array(d.uv),2));g.addAttribute('aFinish',new GeometryAttribute(new Float32Array(d.finish),1));g.setIndex(new Uint16Array(d.i));g.keepAlive=true;g.computeBoundingBox();g.computeBoundingSphere();return g;}
  function cached(key,make){if(!cache.has(key))cache.set(key,make());return cache.get(key);}
  function octagon(w,h,clip,z,cx=0,cy=0){return [[-w/2+clip,-h/2,z],[w/2-clip,-h/2,z],[w/2,-h/2+clip,z],[w/2,h/2-clip,z],[w/2-clip,h/2,z],[-w/2+clip,h/2,z],[-w/2,h/2-clip,z],[-w/2,-h/2+clip,z]].map(p=>[p[0]+cx,p[1]+cy,p[2]]);}
  function opticCut(){return cached('emerald-optic-cut',()=>{
    const vertices=[...octagon(.52,.70,.078,.22),...octagon(.52,.70,.078,.2046),...octagon(.52*.66,.70*.73,.52*.66*.15,.2838)];
    const signed=(v,p)=>Math.sign(v)*Math.pow(Math.abs(v),p);
    // Staggered, convex pavilion rows are the actual radiant facets. Their
    // triangular faces break up the broad eight-sided roof reflections.
    for(let i=0;i<16;i++){const a=(i+.25)/16*TAU;vertices.push([signed(Math.cos(a),.60)*.26*.72,signed(Math.sin(a),.60)*.35*.72,.115+(i%2?.004:-.004)]);}
    for(let i=0;i<8;i++){const a=(i+.5)/8*TAU;vertices.push([signed(Math.cos(a),.55)*.26*.30,signed(Math.sin(a),.55)*.35*.30,.047+(i%2?.002:-.002)]);}
    vertices.push([.009,-.012,.026]);
    const dot=(a,b)=>a.reduce((sum,x,k)=>sum+x*b[k],0),sub=(a,b)=>a.map((x,k)=>x-b[k]),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const first=0,second=4;let third=-1,fourth=-1,max=-1;
    const axis=sub(vertices[second],vertices[first]);
    for(let i=0;i<vertices.length;i++){const d=Math.hypot(...cross(axis,sub(vertices[i],vertices[first])));if(d>max){max=d;third=i;}}
    const normal=cross(sub(vertices[second],vertices[first]),sub(vertices[third],vertices[first]));max=-1;
    for(let i=0;i<vertices.length;i++){const d=Math.abs(dot(normal,sub(vertices[i],vertices[first])));if(d>max){max=d;fourth=i;}}
    const initial=[first,second,third,fourth],inside=[0,1,2].map(k=>initial.reduce((sum,i)=>sum+vertices[i][k],0)/4);
    function face(a,b,c){let n=cross(sub(vertices[b],vertices[a]),sub(vertices[c],vertices[a])),length=Math.hypot(...n);if(length<1e-10)return null;n=n.map(x=>x/length);let d=dot(n,vertices[a]);if(dot(n,inside)>d){[b,c]=[c,b];n=n.map(x=>-x);d=-d;}return{a,b,c,n,d};}
    let faces=[[first,second,third],[first,fourth,second],[second,fourth,third],[third,fourth,first]].map(v=>face(...v));
    for(let point=0;point<vertices.length;point++){
      if(initial.includes(point))continue;
      const visible=faces.filter(f=>dot(f.n,vertices[point])-f.d>.0000001);if(!visible.length)continue;
      const edges=new Map();for(const f of visible)for(const [a,b]of [[f.a,f.b],[f.b,f.c],[f.c,f.a]]){const key=Math.min(a,b)+':'+Math.max(a,b);if(edges.has(key))edges.delete(key);else edges.set(key,[a,b]);}
      const removed=new Set(visible);faces=faces.filter(f=>!removed.has(f));for(const [a,b]of edges.values()){const next=face(a,b,point);if(next)faces.push(next);}
    }
    const planes=[],seen=new Set();for(const f of faces){const key=[...f.n,f.d].map(x=>x.toFixed(6)).join(':');if(seen.has(key))continue;seen.add(key);planes.push(...f.n,f.d);}
    return {planes:new Float32Array(planes),vertices,faces};
  });}
  function facetedOctagon(d,cx,cy,z,w,h,depth,seed=0){
    const centreStone=seed===3;
    if(centreStone){const cut=opticCut();for(const [i,f]of cut.faces.entries())triangle(d,cut.vertices[f.a],cut.vertices[f.b],cut.vertices[f.c],(i%19)/19);return;}
    const tiers=centreStone?[[.18,.18,-.86],[.48,.50,-.59],[.75,.77,-.32],[1,1,-.07],[1,1,0],[.92,.94,.10],[.79,.84,.21],[.66,.73,.29]]:[[.14,.14,-.85],[1,1,-.08],[1,1,0],[.72,.77,.29]];
    const levels=tiers.map(([sw,sh,dz])=>octagon(w*sw,h*sh,Math.min(w*sw,h*sh)*.15,z+depth*dz,cx,cy));
    for(let layer=0;layer<levels.length-1;layer++)for(let i=0;i<8;i++){const j=(i+1)%8,a=levels[layer],b=levels[layer+1];quad(d,a[i],a[j],b[j],b[i],((i*13+layer*7+seed*3)%29)/29);}
    const top=levels[levels.length-1],centre=[cx,cy,z+depth*.29];
    for(let i=0;i<8;i++)triangle(d,centre,top[i],top[(i+1)%8],centreStone?.58:((i*7+seed*11)%19)/19);
  }
  function roundDiamond(d,cx,cy,z,r,seed=0){
    const levels=[{r:.05,z:-.054},{r:.68,z:-.022},{r:1,z:0},{r:.81,z:.014},{r:.51,z:.027}],count=16;
    const pts=levels.map((l,k)=>Array.from({length:count},(_,i)=>{const a=i/count*TAU+Math.PI/16+(k===3&&i%2?Math.PI/32:0);return[cx+Math.cos(a)*r*l.r,cy+Math.sin(a)*r*l.r,z+l.z*(r/.043)];}));
    for(let l=0;l<levels.length-1;l++)for(let i=0;i<count;i++){const j=(i+1)%count;quad(d,pts[l][i],pts[l][j],pts[l+1][j],pts[l+1][i],((i*11+seed*7+l*13)%31)/31);}
    for(let i=0;i<count;i++)triangle(d,[cx,cy,z+.027*(r/.043)],pts[4][i],pts[4][(i+1)%count],((i*13+seed*7)%31)/31);
  }
  function tube(d,path,r,sides=8){
    // Indexed sweep with smooth analytic normals. Parallel transport prevents
    // the per-segment lighting seams that made the former gold look faceted.
    const closed=Math.hypot(...path[0].map((x,k)=>x-path[path.length-1][k]))<1e-6;
    const base=d.p.length/3,unit=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
    let previousNormal=null;
    for(let i=0;i<path.length;i++){
      const before=path[i===0?(closed?path.length-2:0):i-1],after=path[i===path.length-1?(closed?1:i):i+1];
      const tangent=unit(after.map((x,k)=>x-before[k]));
      let normal;
      if(previousNormal){const dot=previousNormal.reduce((v,x,k)=>v+x*tangent[k],0);normal=unit(previousNormal.map((x,k)=>x-tangent[k]*dot));}
      else normal=unit(Math.abs(tangent[1])<.95?[-tangent[2],0,tangent[0]]:[0,tangent[2],-tangent[1]]);
      previousNormal=normal;
      const bin=[tangent[1]*normal[2]-tangent[2]*normal[1],tangent[2]*normal[0]-tangent[0]*normal[2],tangent[0]*normal[1]-tangent[1]*normal[0]];
      for(let j=0;j<=sides;j++){
        const q=j/sides*TAU,n=normal.map((x,k)=>x*Math.cos(q)+bin[k]*Math.sin(q));
        vertex(d,path[i].map((x,k)=>x+r*n[k]),n,i/(path.length-1),j/sides,.7);
      }
    }
    for(let i=0;i<path.length-1;i++)for(let j=0;j<sides;j++){const a=base+i*(sides+1)+j,b=a+sides+1,c=b+1,e=a+1;d.i.push(a,e,c,a,c,b);}
  }
  function sphere(d,c,r,seg=8,rings=5){
    const base=d.p.length/3;
    for(let j=0;j<=rings;j++)for(let i=0;i<=seg;i++){const a=i/seg*TAU,b=j/rings*Math.PI,n=[Math.cos(a)*Math.sin(b),Math.cos(b),Math.sin(a)*Math.sin(b)];vertex(d,c.map((x,k)=>x+n[k]*r),n,i/seg,j/rings,.9);}
    for(let j=0;j<rings;j++)for(let i=0;i<seg;i++){const a=base+j*(seg+1)+i,b=a+1,c=b+seg+1,e=a+seg+1;if(j>0)d.i.push(a,b,c);if(j<rings-1)d.i.push(a,c,e);}
  }
  function roundedFrame(w,h,clip,z){
    const raw=octagon(w,h,clip,z),out=[];
    for(let i=0;i<raw.length;i++){
      const prev=raw[(i+raw.length-1)%raw.length],corner=raw[i],next=raw[(i+1)%raw.length];
      const a=corner.map((x,k)=>x+(prev[k]-x)*.12),b=corner.map((x,k)=>x+(next[k]-x)*.12);
      for(let j=0;j<=4;j++){const t=j/4;out.push(a.map((x,k)=>(1-t)*(1-t)*x+2*(1-t)*t*corner[k]+t*t*b[k]));}
    }
    out.push(out[0]);return out;
  }
  function assets(mobile){return cached('jewellery:'+mobile,()=>{
    const gold=data(),white=data(),emerald=data(),diamonds=data(),steps=mobile?64:96;
    // The crown and halo are upright, with a complete double shank behind.
    facetedOctagon(emerald,0,0,.22,.52,.70,.22,3);
    for(const y of [-.045,.045]){
      const band=Array.from({length:steps+1},(_,i)=>{const a=i/steps*TAU;return[Math.cos(a)*.455,y,-.21+Math.sin(a)*.455];});tube(gold,band,.033,mobile?10:16);
    }
    // Shoulders meet the crown, and gallery struts hold it above the shank.
    for(const sign of [-1,1]){
      for(const y of [-.07,.07])tube(gold,[[sign*.43,y,-.12],[sign*.405,y,-.04],[sign*.37,y,.05],[sign*.33,y,.13],[sign*.29,y,.20]],.030,12);
      tube(gold,[[sign*.24,-.26,.09],[sign*.28,-.20,.10],[sign*.31,-.12,.11],[sign*.30,.07,.12],[sign*.29,.19,.12],[sign*.23,.29,.09]],.016,10);
    }
    tube(gold,roundedFrame(.555,.74,.08,.192),.012,mobile?10:14);
    tube(white,roundedFrame(.64,.84,.10,.16),.011,10);
    tube(gold,roundedFrame(.81,1.01,.13,.14),.009,10);
    tube(gold,roundedFrame(.57,.75,.10,.06),.016,10);
    // Round brilliant halo with north/south/east/west baguettes.
    let seed=1;
    for(const x of [-.345,.345])for(const y of [-.32,-.22,-.11,.11,.22,.32]){roundDiamond(diamonds,x,y,.20,.045,seed++);sphere(white,[x-.032,y,.196],.009,6,4);sphere(white,[x+.032,y,.196],.009,6,4);}
    for(const y of [-.445,.445])for(const x of [-.22,-.11,.11,.22]){roundDiamond(diamonds,x,y,.20,.045,seed++);sphere(white,[x,y-.032,.196],.009,6,4);sphere(white,[x,y+.032,.196],.009,6,4);}
    for(const sx of [-1,1])for(const sy of [-1,1]){
      roundDiamond(diamonds,sx*.297,sy*.394,.20,.042,seed++);
      roundDiamond(diamonds,sx*.320,sy*.446,.19,.024,seed++);
      roundDiamond(diamonds,sx*.365,sy*.393,.19,.024,seed++);
      tube(gold,[[sx*.217,sy*.30,.11],[sx*.226,sy*.311,.20],[sx*.233,sy*.317,.272]],.012,12);sphere(gold,[sx*.233,sy*.317,.272],.017,12,8);
    }
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
  function dustGeometry(count){return cached('diamond-dust:'+count,()=>{
    const positions=[],seeds=[];let randomState=624081;
    const random=()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;};
    for(let i=0;i<count;i++){
      const angle=random()*TAU,radius=.72+Math.pow(random(),.64)*1.75;
      const x=Math.cos(angle)*radius,y=Math.sin(angle)*radius*.72,z=-1.75+random()*2.75;
      positions.push(x,y,z);seeds.push(random(),random(),random(),random());
    }
    const g=new Geometry();g.addAttribute('position',new GeometryAttribute(new Float32Array(positions),3));g.addAttribute('aSeed',new GeometryAttribute(new Float32Array(seeds),4));g.keepAlive=true;g.computeBoundingBox();g.computeBoundingSphere();return g;
  });}
  function poolGeometry(){return cached('pool',()=>geometry({p:[-1.1,-.63,-.9,1.1,-.63,-.9,1.1,-.63,.9,-1.1,-.63,.9],n:[0,1,0,0,1,0,0,1,0,0,1,0],uv:[0,0,1,0,1,1,0,1],finish:[0,0,0,0],i:[0,2,1,0,3,2]}));}
  function createCore(world,kind,label,host){
    registerShaders();const mobile=!!(Global.isMobile||Device.mobile),source=assets(mobile);
    const count=mobile?1200:2400;
    const u={uTime:{value:0},uDarken:{value:0},uPointScale:{value:Math.max(.70,Stage.height/900)}},group=new Group(),jewel=new Group(),meshes=[];
    group.name='Thaddeus — emerald halo ring';group.isAicanfeelEnergy=true;group.isThaddeusJewellery=true;
    const compositionScale=kind==='selector'?.78:(mobile&&kind==='world'?.80:1);
    const scale=.95*(kind==='film'?1.08:1)*compositionScale;group.scale.set(scale,scale,scale);group.add(jewel);
    for(const [key,name,material,extra]of [['gold','Polished gold double shank, bezel and prongs','ThaddeusGold',{uWhite:{value:0}}],['white','White-metal halo and stone claws','ThaddeusGold',{uWhite:{value:1}}],['emerald','Emerald-cut green centre stone',mobile?'ThaddeusEmeraldMobile':'ThaddeusEmerald',{uGemPlanes:{value:opticCut().planes,type:'v4v'}}],['diamonds','Brilliant and baguette halo with pavé shoulders','ThaddeusDiamond',null]]){
      const mesh=new Mesh(source[key],shader(material,u,extra));mesh.name=name;mesh.frustumCulled=false;jewel.add(mesh);meshes.push(mesh);
    }
    const poolShader=shader('ThaddeusPool',u);poolShader.transparent=true;poolShader.depthWrite=false;poolShader.blending=Shader.ADDITIVE_BLENDING;
    const pool=new Mesh(poolGeometry(),poolShader);pool.name='Teal studio floor reflection';pool.frustumCulled=false;group.add(pool);meshes.push(pool);
    const dustShader=shader('ThaddeusDust',u);dustShader.transparent=true;dustShader.depthWrite=false;dustShader.blending=Shader.ADDITIVE_BLENDING;
    const dust=new Points(dustGeometry(count),dustShader);dust.name='Batched three-dimensional diamond dust';dust.frustumCulled=false;group.add(dust);
    group._energyHoverShader=meshes[0].shader;
    const core={id:++serial,group,jewel,meshes,dust,u,world,kind,label,host,mobile,count,triangles:source.triangles+2,stoneCount:source.stoneCount,lastRendered:-1,progress:0};instances.push(core);return core;
  }
  function hideGarments(target){function hide(node){if(node.isAicanfeelEnergy||node.isHitMesh)return;if(node.isMesh||node.isPoints||node.isLine)node.visible=false;for(const child of node.children||[])hide(child);}if(target.isMesh&&target.shader)target.shader.visible=false;for(const child of target.children.slice())hide(child);}
  function worldIndex(section,name){const text=String(section.page?.perma||section.parent?.perma||name),m=text.match(/world[_-]?([123])/i);return m?+m[1]-1:0;}
  function tick(){if(document.hidden)return;const frame=Render.TIME;if(frame!==lastFrame){lastFrame=frame;clock+=Math.min(.05,Math.max(0,Render.DELTA||16.67)/1000);}}
  function update(core,progress=0){if(document.hidden)return;tick();core.lastRendered=Render.TIME;core.progress=clamp(progress,0,1);const t=reduced?0:clock;core.u.uTime.value=t;core.u.uPointScale.value=Math.max(.70,Stage.height/900);
    const poses=[[-.16,-.25,.03],[-.27,.42,-.06],[-.12,-.42,.08]],b=poses[core.world];
    core.jewel.rotation.set(b[0]+Math.sin(t*.16)*.022,b[1]+Math.sin(t*.11)*.11,b[2]+Math.sin(t*.09)*.012);
    const compositionY=core.mobile&&core.kind==='world'?-.14:0;
    core.jewel.position.y=compositionY+(reduced?0:Math.sin(t*.24+core.world)*.008);
  }
  function installSection(section,layers,layoutName,index){if(sections.has(section))return sections.get(section).group;const world=worldIndex(section,layoutName),kind=index===2?'film':index===1?'macro':'world',core=createCore(world,kind,layoutName||section.name,section);const candidate=layers.product?.group||layers.product;if(candidate?.add){hideGarments(candidate);candidate.add(core.group);}else{core.group.position.x=.65;(section.layout?.group||section.scene).add(core.group);}section.energyCore=core.group;sections.set(section,core);update(core,0);return core.group;}
  function updateSection(section){const core=sections.get(section);if(core)update(core,section.currentShowPercent2||0);}
  function installIntro(controller,layers,camera){if(intros.has(controller))return;const items=[];for(const [world,name]of ['product2','product1','product3'].entries()){const product=layers[name]?.group||layers[name];if(!product?.add)continue;const core=createCore(world,'selector','intro-'+world,controller);hideGarments(product);product.add(core.group);items.push(core);update(core,0);}intros.set(controller,items);return items.map(c=>c.group);}
  function updateIntro(controller){for(const core of intros.get(controller)||[])update(core,0);}
  function getStats(){const now=typeof Render!=='undefined'?Render.TIME:0;const items=instances.map(c=>({id:c.id,layout:c.label,phase:['The Stone','The Setting','The Presence'][c.world],kind:c.kind,mobile:c.mobile,points:c.count,pointDraws:1,meshes:c.meshes.length,draws:c.meshes.length+1,triangles:c.triangles,stones:c.stoneCount,opticalBounces:c.mobile?2:3,visible:!!(!document.hidden&&now-c.lastRendered<250&&(c.kind==='selector'||c.host.visible!==false)&&c.group.determineVisible()),lastRendered:c.lastRendered,progress:Math.round(c.progress*1000)/1000}));const visible=items.filter(i=>i.visible);const geometries=Array.from(cache.keys()).reduce((n,key)=>n+(key.startsWith('jewellery:')?4:key==='pool'||key.startsWith('diamond-dust:')?1:0),0);return{mode:'native-3d-thaddeus-emerald-ring',instances:items.length,visible:visible.length,points:items.reduce((n,i)=>n+i.points,0),visiblePoints:visible.reduce((n,i)=>n+i.points,0),visibleDraws:visible.reduce((n,i)=>n+i.draws,0),mobile:instances.some(i=>i.mobile),reducedMotion:reduced,paused:document.hidden,elapsed:clock,motionTime:reduced?0:clock,geometries,opticalPlanes:opticCut().planes.length/4,items};}
  window.AICANFEEL_ENERGY={installSection,updateSection,installIntro,updateIntro,getStats};window.THADDEUS_JEWELLERY=window.AICANFEEL_ENERGY;
})();

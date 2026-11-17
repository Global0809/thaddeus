/* Thaddeus emerald halo ring — authored native Hydra meshes and GLSL.
   The compatibility API keeps the approved selector/camera/touch journey intact.
   The emerald uses bounded native cut-plane optical tracing; metal and halo
   use analytic jewellery-studio reflections within the same Hydra renderer. */
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
      float rectangularCard(vec3 d,vec3 axis,float width,float height){axis=normalize(axis);vec3 right=normalize(cross(vec3(0.,1.,0.),axis)),up=cross(axis,right);float forward=max(.0001,dot(d,axis));vec2 p=abs(vec2(dot(d,right),dot(d,up))/forward);return (1.-smoothstep(width-.018,width,p.x))*(1.-smoothstep(height-.018,height,p.y))*step(.05,dot(d,axis));}
      vec3 studio(vec3 d){d=normalize(d);
        // A real jewellery tent has broad fill in every exit direction. The
        // narrow cards supply facet accents; they are not the only illumination.
        vec3 light=vec3(.27,.38,.32)+vec3(.13,.18,.145)*smoothstep(-.5,.8,d.y);
        light+=vec3(1.,.96,.86)*rectangularCard(d,vec3(-.68,.72,.90),.16,.50)*1.35;
        light+=vec3(.85,.98,1.)*rectangularCard(d,vec3(.66,.15,.93),.12,.42)*1.25;
        light+=vec3(.80,.98,.93)*rectangularCard(d,vec3(-.60,.23,-.78),.30,.40)*1.65;
        light+=vec3(.93,.97,1.)*rectangularCard(d,vec3(.50,-.35,-.80),.19,.28)*1.55;
        light+=vec3(.80,.95,1.)*lightCard(d,vec3(.14,.95,-.12),18.)*.75;
        float lamp=lightCard(d,vec3(-.21,.33,.92),220.);light+=vec3(1.,.98,.86)*lamp*3.;
        float blackGap=lightCard(d,vec3(-.13,-.55,.78),18.);return light*(1.-blackGap*.45);
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
          weight*=exp(-vec3(7.5,.78,3.8)*distance);vec3 hit=origin+ray*distance;
          vec3 escaped=refract(ray,-hitNormal,ior);float escapedLength=dot(escaped,escaped);
          if(escapedLength>.00001){float f=fresnel(dot(ray,hitNormal),ior);result+=weight*(1.-f)*studio(vOpticBasis*escaped);weight*=f;}
          ray=reflect(ray,hitNormal);origin=hit+ray*.00010;
        }
        // Close a bounded ray path with a soft studio estimate, rather than black.
        result+=weight*studio(vOpticBasis*ray)*vec3(.18,.62,.30)*.40;
        result=vec3(1.)-exp(-result*1.12);gl_FragColor=vec4(result*(1.-uDarken*.9),1.);
      }`;}
    const diamondVertex=`attribute vec4 aCrystal;attribute vec4 aCrystalQ;varying vec3 vLocal;varying vec3 vLocalNormal;varying vec3 vLocalEye;varying mat3 vOpticBasis;varying float vRoundCut;
      vec3 turn(vec3 v,vec4 q){return v+2.*cross(q.xyz,cross(q.xyz,v)+q.w*v);}
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.);mat3 basis=mat3(modelViewMatrix);vec4 q=aCrystalQ;vec4 invQ=vec4(-q.xyz,q.w);float size=aCrystal.w>0.?aCrystal.w:1.;
      vec3 eye=vec3(dot(basis[0],-mv.xyz)/dot(basis[0],basis[0]),dot(basis[1],-mv.xyz)/dot(basis[1],basis[1]),dot(basis[2],-mv.xyz)/dot(basis[2],basis[2]));
      vRoundCut=step(.00001,aCrystal.w);vLocal=turn((position-aCrystal.xyz)/size,invQ);vLocalNormal=turn(normal,invQ);vLocalEye=turn(eye,invQ);
      vOpticBasis=basis*mat3(turn(vec3(1.,0.,0.),q),turn(vec3(0.,1.,0.),q),turn(vec3(0.,0.,1.),q));gl_Position=projectionMatrix*mv;}`;
    const diamondPlaneCount=diamondCutPlanes().length/4;
    const diamond=`uniform float uDarken;uniform float uTime;uniform vec4 uDiamondPlanes[${diamondPlaneCount}];varying vec3 vLocal;varying vec3 vLocalNormal;varying vec3 vLocalEye;varying mat3 vOpticBasis;varying float vRoundCut;
      float card(vec3 r,vec3 a,float p){return pow(max(dot(normalize(r),normalize(a)),0.),p);}
      vec3 studio(vec3 d){d=normalize(d);vec3 light=vec3(.60,.70,.75)+vec3(.16,.19,.20)*smoothstep(-.6,.8,d.y);
        light+=vec3(.29,.33,.35)*card(d,vec3(.10,.25,1.),2.);
        light+=vec3(.94,.98,1.)*card(d,vec3(-.7,.7,.8),16.)*2.1;
        light+=vec3(.90,.96,1.)*card(d,vec3(.8,.15,.8),10.)*1.8;
        light+=vec3(.93,.97,1.)*card(d,vec3(-.5,-.2,-.8),11.)*1.9;
        light+=vec3(.95,.94,.87)*card(d,vec3(.25,.8,-.6),15.)*1.4;
        vec3 pinAxis=normalize(vec3(-.24+sin(uTime*.11)*.15,.31+cos(uTime*.09)*.10,.94));
        light+=vec3(1.,.98,.93)*card(d,pinAxis,380.)*3.4;
        float blackCard=card(d,vec3(.1,-.55,.8),13.);return light*(1.-blackCard*.46);}
      float fresnel(float cosine){float f=.172;return f+(1.-f)*pow(1.-clamp(cosine,0.,1.),5.);}
      float nextHit(vec3 origin,vec3 direction,out vec3 normal){float nearest=10000.;normal=vec3(0.,0.,1.);
        for(int i=0;i<${diamondPlaneCount};i++){vec4 plane=uDiamondPlanes[i];float denominator=dot(plane.xyz,direction);if(denominator>.00001){float t=(plane.w-dot(plane.xyz,origin))/denominator;if(t>.0001&&t<nearest){nearest=t;normal=plane.xyz;}}}return nearest;}
      void main(){vec3 N=normalize(vLocalNormal),incident=-normalize(vLocalEye);if(dot(incident,N)>0.)N=-N;
        vec3 surface=studio(vOpticBasis*reflect(incident,N));float entry=fresnel(-dot(incident,N));vec3 result=surface*entry;
        if(vRoundCut>.5){vec3 ray=refract(incident,N,1./2.417),origin=vLocal+ray*.0005,weight=vec3(1.-entry);
          for(int bounce=0;bounce<2;bounce++){vec3 hitNormal;float travel=nextHit(origin,ray,hitNormal);if(travel>100.)break;vec3 hit=origin+ray*travel;vec3 escaped=refract(ray,-hitNormal,2.417);
            if(dot(escaped,escaped)>.00001){float f=fresnel(dot(ray,hitNormal));result+=weight*(1.-f)*studio(vOpticBasis*escaped);weight*=f;}
            ray=reflect(ray,hitNormal);origin=hit+ray*.0005;
          }
          result+=weight*studio(vOpticBasis*ray)*.72;
        }else{vec3 refracted=refract(incident,N,1./2.417);result+=studio(vOpticBasis*refracted)*.66;}
        result+=vec3(.93,.98,1.)*pow(1.-clamp(-dot(incident,N),0.,1.),4.)*.065;
        result=vec3(1.)-exp(-result*1.27);gl_FragColor=vec4(result*(1.-uDarken*.9),1.);
      }`;
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
    for(const [name,vs,fs]of [['ThaddeusGold',vertex,metal],['ThaddeusEmerald',opticalVertex,opticalFragment(6)],['ThaddeusEmeraldMobile',opticalVertex,opticalFragment(4)],['ThaddeusDiamond',diamondVertex,diamond],['ThaddeusPool',poolVertex,pool],['ThaddeusDust',dustVertex,dust]]){Shaders.parse(vs,name+'.vs');Shaders.parse(fs,name+'.fs');}
    registered=true;
  }
  const data=()=>({p:[],n:[],uv:[],finish:[],i:[],crystal:[],crystalQ:[]});
  function vertex(d,p,n,u=0,v=0,f=.5){const id=d.p.length/3;d.p.push(...p);d.n.push(...n);d.uv.push(u,v);d.finish.push(f);if(d.isCrystals){d.crystal.push(...(d.activeCrystal||[0,0,0,-1]));d.crystalQ.push(...(d.activeQ||[0,0,0,1]));}return id;}
  function triangle(d,a,b,c,f=.5){
    const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
    const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n)||1;
    const base=d.p.length/3;for(const [j,p]of [a,b,c].entries())vertex(d,p,[n[0]/len,n[1]/len,n[2]/len],j===1?1:0,j===2?1:0,f);d.i.push(base,base+1,base+2);
  }
  function quad(d,a,b,c,e,f=.5){triangle(d,a,b,c,f);triangle(d,a,c,e,f);}
  function geometry(d){const g=new Geometry();g.addAttribute('position',new GeometryAttribute(new Float32Array(d.p),3));g.addAttribute('normal',new GeometryAttribute(new Float32Array(d.n),3));g.addAttribute('uv',new GeometryAttribute(new Float32Array(d.uv),2));g.addAttribute('aFinish',new GeometryAttribute(new Float32Array(d.finish),1));if(d.isCrystals){g.addAttribute('aCrystal',new GeometryAttribute(new Float32Array(d.crystal),4));g.addAttribute('aCrystalQ',new GeometryAttribute(new Float32Array(d.crystalQ),4));}g.setIndex(new Uint16Array(d.i));g.keepAlive=true;g.computeBoundingBox();g.computeBoundingSphere();return g;}
  function cached(key,make){if(!cache.has(key))cache.set(key,make());return cache.get(key);}
  function octagon(w,h,clip,z,cx=0,cy=0){return [[-w/2+clip,-h/2,z],[w/2-clip,-h/2,z],[w/2,-h/2+clip,z],[w/2,h/2-clip,z],[w/2-clip,h/2,z],[-w/2+clip,h/2,z],[-w/2,h/2-clip,z],[-w/2,-h/2+clip,z]].map(p=>[p[0]+cx,p[1]+cy,p[2]]);}
  function diamondCutPlanes(){return cached('diamond-optic-cut',()=>{
    const count=16,rows=[[.05,-.036/.043],[1,0],[.51,.018/.043]],points=rows.map(([r,z])=>Array.from({length:count},(_,i)=>{const a=i/count*TAU+Math.PI/16;return[Math.cos(a)*r,Math.sin(a)*r,z];})),out=[];
    const dot=(a,b)=>a.reduce((sum,x,k)=>sum+x*b[k],0);
    function plane(a,b,c){const u=b.map((x,k)=>x-a[k]),v=c.map((x,k)=>x-a[k]);let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const len=Math.hypot(...n);n=n.map(x=>x/len);let d=dot(n,a);if(dot(n,[0,0,-.1])>d){n=n.map(x=>-x);d=-d;}out.push(...n,d);}
    for(let layer=0;layer<2;layer++)for(let i=0;i<count;i++)plane(points[layer][i],points[layer][(i+1)%count],points[layer+1][(i+1)%count]);
    plane(points[0][0],points[0][5],points[0][10]);plane(points[2][0],points[2][5],points[2][10]);return new Float32Array(out);
  });}
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
  function roundDiamond(d,cx,cy,z,r,seed=0,normal=[0,0,1]){
    const start=d.p.length/3,w=Math.sqrt(Math.max(.000001,(1+normal[2])*.5)),q=[-normal[1]/(2*w),normal[0]/(2*w),0,w];
    d.activeCrystal=[cx,cy,z,r];d.activeQ=q;
    const levels=[{r:.05,z:-.036},{r:.63,z:-.014},{r:1,z:0},{r:.809444444,z:.007},{r:.51,z:.018}],count=16;
    const pts=levels.map(l=>Array.from({length:count},(_,i)=>{const a=i/count*TAU+Math.PI/16;return[cx+Math.cos(a)*r*l.r,cy+Math.sin(a)*r*l.r,z+l.z*(r/.043)];}));
    for(let l=0;l<levels.length-1;l++)for(let i=0;i<count;i++){const j=(i+1)%count;quad(d,pts[l][i],pts[l][j],pts[l+1][j],pts[l+1][i],((i*11+seed*7+l*13)%31)/31);}
    for(let i=0;i<count;i++)triangle(d,[cx,cy,z+.018*(r/.043)],pts[4][i],pts[4][(i+1)%count],((i*13+seed*7)%31)/31);
    if(Math.abs(normal[0])+Math.abs(normal[1])>.000001){
      const turn=v=>{const uv=[q[1]*v[2]-q[2]*v[1],q[2]*v[0]-q[0]*v[2],q[0]*v[1]-q[1]*v[0]],uuv=[q[1]*uv[2]-q[2]*uv[1],q[2]*uv[0]-q[0]*uv[2],q[0]*uv[1]-q[1]*uv[0]];return v.map((x,k)=>x+2*(q[3]*uv[k]+uuv[k]));};
      for(let i=start;i<d.p.length/3;i++){const p=turn([d.p[i*3]-cx,d.p[i*3+1]-cy,d.p[i*3+2]-z]),n=turn(d.n.slice(i*3,i*3+3));d.p[i*3]=p[0]+cx;d.p[i*3+1]=p[1]+cy;d.p[i*3+2]=p[2]+z;d.n.splice(i*3,3,...n);}
    }
    d.activeCrystal=d.activeQ=null;
  }
  function tube(d,path,r,sides=8,verticalRatio=1){
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
        const q=j/sides*TAU,n=normal.map((x,k)=>x*Math.cos(q)+bin[k]*Math.sin(q)),scaledNormal=unit([n[0],n[1]/verticalRatio,n[2]]);
        vertex(d,path[i].map((x,k)=>x+r*n[k]*(k===1?verticalRatio:1)),scaledNormal,i/(path.length-1),j/sides,.7);
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
    diamonds.isCrystals=true;
    // The crown and halo are upright, with a complete double shank behind.
    facetedOctagon(emerald,0,0,.22,.52,.70,.22,3);
    // A rounded broad band joins at the back, then forks into two shoulders.
    const band=Array.from({length:steps+1},(_,i)=>{const a=i/steps*TAU;return[Math.cos(a)*.415,0,-.17+Math.sin(a)*.415];});tube(gold,band,.024,mobile?14:20,2.5);
    // Shoulders meet the crown, and gallery struts hold it above the shank.
    for(const sign of [-1,1]){
      for(const y of [-.045,.045])tube(gold,[[sign*.39,y,-.028],[sign*.37,y,.03],[sign*.34,y,.10],[sign*.31,y,.16],[sign*.285,y,.205]],.019,12);
      tube(gold,[[sign*.24,-.26,.09],[sign*.28,-.20,.10],[sign*.31,-.12,.11],[sign*.30,.07,.12],[sign*.29,.19,.12],[sign*.23,.29,.09]],.016,10);
    }
    tube(gold,roundedFrame(.555,.74,.08,.192),.008,mobile?10:14);
    tube(white,roundedFrame(.64,.84,.10,.16),.007,10);
    tube(gold,roundedFrame(.81,1.01,.13,.14),.0055,10);
    tube(gold,roundedFrame(.57,.75,.10,.06),.012,10);
    // Round brilliant halo with north/south/east/west baguettes.
    let seed=1;
    function haloStone(x,y,z,r){roundDiamond(diamonds,x,y,z,r,seed++);const seat=Array.from({length:13},(_,i)=>{const a=i/12*TAU;return[x+Math.cos(a)*r*.78,y+Math.sin(a)*r*.78,z-.012];});tube(white,seat,.0035,6);sphere(white,[x-r*.71,y,z-.002],.006,6,4);sphere(white,[x+r*.71,y,z-.002],.006,6,4);}
    for(const x of [-.345,.345])for(const y of [-.32,-.22,-.11,.11,.22,.32])haloStone(x,y,.20,.041);
    for(const y of [-.445,.445])for(const x of [-.22,-.11,.11,.22])haloStone(x,y,.20,.041);
    for(const sx of [-1,1])for(const sy of [-1,1]){
      haloStone(sx*.297,sy*.394,.20,.039);
      haloStone(sx*.320,sy*.446,.19,.022);
      haloStone(sx*.365,sy*.393,.19,.022);
      tube(gold,[[sx*.217,sy*.30,.11],[sx*.226,sy*.311,.20],[sx*.233,sy*.317,.272]],.009,12);sphere(gold,[sx*.233,sy*.317,.272],.012,12,8);
    }
    facetedOctagon(diamonds,0,.444,.204,.13,.066,.048,34);facetedOctagon(diamonds,0,-.444,.204,.13,.066,.048,35);
    facetedOctagon(diamonds,.344,0,.204,.067,.14,.048,36);facetedOctagon(diamonds,-.344,0,.204,.067,.14,.048,37);
    // Pavé on the visible shoulder surfaces; each stone is a real cut mesh.
    for(const sign of [-1,1])for(let i=0;i<(mobile?9:12);i++){
      const a=(22+i/(mobile?8:11)*26)/180*Math.PI,n=[sign*Math.cos(a),0,Math.sin(a)];
      const x=n[0]*.442,z=-.17+n[2]*.442;
      for(const y of [-.030,.030]){
        roundDiamond(diamonds,x,y,z,.0175,seed++,n);
        sphere(gold,[x+n[0]*.0015,y-.015,z+n[2]*.0015],.0045,6,4);
        sphere(gold,[x+n[0]*.0015,y+.015,z+n[2]*.0015],.0045,6,4);
      }
    }
    return {gold:geometry(gold),white:geometry(white),emerald:geometry(emerald),diamonds:geometry(diamonds),triangles:(gold.i.length+white.i.length+emerald.i.length+diamonds.i.length)/3,emeraldTriangles:emerald.i.length/3,stoneCount:seed-1+5};
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
    const variant=world===0?'free-emerald':world===1?'setting-profile':'full-ring';
    group.name='Thaddeus — '+variant;group.isAicanfeelEnergy=true;group.isThaddeusJewellery=true;
    const compositionScale=kind==='selector'?(mobile?.70:.78):(mobile&&kind==='world'?.80:1);
    const scale=.95*(kind==='film'?1.08:1)*compositionScale;group.scale.set(scale,scale,scale);group.add(jewel);
    for(const [key,name,material,extra]of [['gold','Polished gold split-shoulder band, bezel and prongs','ThaddeusGold',{uWhite:{value:0}}],['white','White-metal halo and stone claws','ThaddeusGold',{uWhite:{value:1}}],['emerald','Emerald-cut green centre stone',mobile?'ThaddeusEmeraldMobile':'ThaddeusEmerald',{uGemPlanes:{value:opticCut().planes,type:'v4v'}}],['diamonds','Brilliant and baguette halo with pavé shoulders','ThaddeusDiamond',{uDiamondPlanes:{value:diamondCutPlanes(),type:'v4v'}}]]){
      const mesh=new Mesh(source[key],shader(material,u,extra));mesh.name=name;mesh.frustumCulled=false;jewel.add(mesh);meshes.push(mesh);
      if(variant==='free-emerald'&&key!=='emerald')mesh.visible=false;
    }
    if(variant==='free-emerald')jewel.scale.set(1.38,1.38,1.38);
    const poolShader=shader('ThaddeusPool',u);poolShader.transparent=true;poolShader.depthWrite=false;poolShader.blending=Shader.ADDITIVE_BLENDING;
    const pool=new Mesh(poolGeometry(),poolShader);pool.name='Teal studio floor reflection';pool.frustumCulled=false;group.add(pool);meshes.push(pool);
    const dustShader=shader('ThaddeusDust',u);dustShader.transparent=true;dustShader.depthWrite=false;dustShader.blending=Shader.ADDITIVE_BLENDING;
    const dust=new Points(dustGeometry(count),dustShader);dust.name='Batched three-dimensional diamond dust';dust.frustumCulled=false;group.add(dust);
    group._energyHoverShader=meshes[0].shader;
    const core={id:++serial,group,jewel,meshes,dust,u,world,kind,label,host,mobile,count,variant,triangles:(variant==='free-emerald'?source.emeraldTriangles:source.triangles)+2,stoneCount:variant==='free-emerald'?1:source.stoneCount,lastRendered:-1,progress:0};instances.push(core);return core;
  }
  function hideGarments(target){function hide(node){if(node.isAicanfeelEnergy||node.isHitMesh)return;if(node.isMesh||node.isPoints||node.isLine)node.visible=false;for(const child of node.children||[])hide(child);}if(target.isMesh&&target.shader)target.shader.visible=false;for(const child of target.children.slice())hide(child);}
  function worldIndex(section,name){const text=String(section.page?.perma||section.parent?.perma||name),m=text.match(/world[_-]?([123])/i);return m?+m[1]-1:0;}
  function tick(){if(document.hidden)return;const frame=Render.TIME;if(frame!==lastFrame){lastFrame=frame;clock+=Math.min(.05,Math.max(0,Render.DELTA||16.67)/1000);}}
  function update(core,progress=0){if(document.hidden)return;tick();core.lastRendered=Render.TIME;core.progress=clamp(progress,0,1);const t=reduced?0:clock;core.u.uTime.value=t;core.u.uPointScale.value=Math.max(.70,Stage.height/900);
    const poses=core.kind==='selector'?[[.20,.48,-.22],core.mobile?[.40,.65,-.16]:[.57,.91,-.16],[-.23,-.43,-.25]]:[[.12,.35,.10],[.57,.91,-.20],[-.16,-.48,-.32]];
    const b=poses[core.world].slice();
    if(core.kind==='macro'){
      if(core.world===0){b[0]=.12-core.progress*.22;b[1]=.25+core.progress*.35;b[2]=.15;}
      else if(core.world===1){b[0]=.66-core.progress*.36;b[1]=1.08-core.progress*.35;}
      else{b[0]=-.15+core.progress*.40;b[1]=-.48+core.progress*.24;}
    }
    core.jewel.rotation.set(b[0]+Math.sin(t*.16)*.018,b[1]+Math.sin(t*.11)*.055,b[2]+Math.sin(t*.09)*.009);
    const compositionY=core.mobile&&core.kind==='world'?-.14:0;
    core.jewel.position.y=compositionY+(reduced?0:Math.sin(t*.24+core.world)*.008);
    core.jewel.position.z=core.variant==='free-emerald'?-.22:0;
    core.jewel.position.x=core.variant==='setting-profile'?.14:0;
  }
  function installSection(section,layers,layoutName,index){if(sections.has(section))return sections.get(section).group;const world=worldIndex(section,layoutName),kind=index===2?'film':index===1?'macro':'world',core=createCore(world,kind,layoutName||section.name,section);const candidate=layers.product?.group||layers.product;if(candidate?.add){hideGarments(candidate);candidate.add(core.group);}else{core.group.position.x=.65;(section.layout?.group||section.scene).add(core.group);}section.energyCore=core.group;sections.set(section,core);update(core,0);return core.group;}
  function updateSection(section){const core=sections.get(section);if(core)update(core,section.currentShowPercent2||0);}
  function installIntro(controller,layers,camera){if(intros.has(controller))return;const items=[];for(const [world,name]of ['product2','product1','product3'].entries()){const product=layers[name]?.group||layers[name];if(!product?.add)continue;const core=createCore(world,'selector','intro-'+world,controller);hideGarments(product);product.add(core.group);items.push(core);update(core,0);}intros.set(controller,items);return items.map(c=>c.group);}
  function updateIntro(controller){for(const core of intros.get(controller)||[])update(core,0);}
  function getStats(){const now=typeof Render!=='undefined'?Render.TIME:0;const items=instances.map(c=>{const meshes=c.meshes.filter(m=>m.visible!==false).length;return{id:c.id,layout:c.label,phase:['The Stone','The Setting','The Presence'][c.world],variant:c.variant,kind:c.kind,mobile:c.mobile,points:c.count,pointDraws:1,meshes,draws:meshes+1,triangles:c.triangles,stones:c.stoneCount,opticalBounces:c.mobile?4:6,diamondOpticalBounces:2,visible:!!(!document.hidden&&now-c.lastRendered<250&&(c.kind==='selector'||c.host.visible!==false)&&c.group.determineVisible()),lastRendered:c.lastRendered,progress:Math.round(c.progress*1000)/1000}});const visible=items.filter(i=>i.visible);const geometries=Array.from(cache.keys()).reduce((n,key)=>n+(key.startsWith('jewellery:')?4:key==='pool'||key.startsWith('diamond-dust:')?1:0),0);return{mode:'native-3d-thaddeus-emerald-ring',instances:items.length,visible:visible.length,points:items.reduce((n,i)=>n+i.points,0),visiblePoints:visible.reduce((n,i)=>n+i.points,0),visibleDraws:visible.reduce((n,i)=>n+i.draws,0),mobile:instances.some(i=>i.mobile),reducedMotion:reduced,paused:document.hidden,elapsed:clock,motionTime:reduced?0:clock,geometries,opticalPlanes:opticCut().planes.length/4,diamondOpticalPlanes:diamondCutPlanes().length/4,items};}
  window.AICANFEEL_ENERGY={installSection,updateSection,installIntro,updateIntro,getStats};window.THADDEUS_JEWELLERY=window.AICANFEEL_ENERGY;
})();

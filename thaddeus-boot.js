/* Load the authored renderer only when the browser can supply a WebGL context. */
(()=>{
  'use strict';
  const state=window.THADDEUS_RENDER_STATUS={supported:false,loading:false,stage:'checking'};
  function recovery(message){state.loading=false;state.stage='fallback';window.THADDEUS_APP?.showRecovery(message)}
  function canRender(){
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
    try{const gl=canvas.getContext('webgl2',{alpha:true,failIfMajorPerformanceCaveat:false})||canvas.getContext('webgl',{alpha:true,failIfMajorPerformanceCaveat:false})||canvas.getContext('experimental-webgl');if(!gl)return false;gl.getExtension('WEBGL_lose_context')?.loseContext();return true}catch{return false}finally{canvas.width=canvas.height=0}
  }
  document.addEventListener('webglcontextlost',event=>{event.preventDefault();state.stage='lost';state.loading=false;window.THADDEUS_APP?.showRecovery('The 3D connection was interrupted. Your ring and campaign remain available below.',true)},true);
  state.supported=canRender();
  if(!state.supported){recovery('This browser cannot display the 3D view. Explore the ring and campaign below.');return}
  state.loading=true;state.stage='loading';
  function script(path){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=new URL(path,document.baseURI).href;el.onload=resolve;el.onerror=()=>reject(new Error('Could not load '+path));document.head.append(el)})}
  (async()=>{try{for(const path of ['energy-core.js?v=2026111702','assets/js/app.js?v=2026111702','immersive-native-support.js?v=2026111702'])await script(path);state.stage='starting'}catch{recovery('The 3D view could not load. You can still discover the ring and campaign.')}})();
})();

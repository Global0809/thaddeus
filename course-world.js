/* AICANFEEL course bridge. Legacy renderer behavior is untouched unless the
   page sets window.AICANFEEL_COURSE before loading the authored runtime. */
(()=>{
  if(!window.AICANFEEL_COURSE)return;
  const worldIds=['world1','world2','world3'];
  const routes=['black-tracksuit','bomber','white-tracksuit'];
  const locked=new WeakSet();
  let controller,ui,interactive=false,paused=false,requestedProgress=0,currentProgress=0;
  let queued=Promise.resolve(),readyResolved=false,failed=false,raf=0;
  let resolveReady,rejectReady;
  const ready=new Promise((resolve,reject)=>{resolveReady=resolve;rejectReady=reject;});
  ready.catch(()=>{});
  const emit=(name,detail)=>dispatchEvent(new CustomEvent(name,{detail}));
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function waitFor(fn,timeout=45000){const start=performance.now();while(performance.now()-start<timeout){const value=fn();if(value)return value;await sleep(100);}throw Error('The 3D stage did not become ready.');}
  function lockInvisible(node){
    if(!node||typeof node!=='object'||locked.has(node))return;
    locked.add(node);const descriptor=Object.getOwnPropertyDescriptor(node,'visible');
    if(!descriptor||descriptor.configurable)Object.defineProperty(node,'visible',{configurable:true,enumerable:true,get:()=>false,set:()=>{}});
    if(node.children)for(const child of node.children)lockInvisible(child);
  }
  async function hideAuthoredUI(){
    for(const world of worldIds){
      const groups=ui.GLUI[world];
      for(const key of ['uiGroup','uiInnerGroup','uiFXGroup','fixedUIGroup','fixedFXGroup','fixedInnerGroup'])if(groups?.[key]?.group)lockInvisible(groups[key].group);
      for(const scene of controller.pages[world].scenes){
        const layers=await scene.layout.getAllLayers();
        for(const [name,layer]of Object.entries(layers))if(/text|ticker|video_ui/i.test(name)){
          for(const node of [layer.group,layer.mesh,layer.text?.group,layer.text?.mesh,layer.text?.anchor,layer.text?.text?.mesh])lockInvisible(node);
        }
      }
    }
    InstructionsUI.instance().toggleView(false);
  }
  function applyInteraction(){
    if(!controller)return;
    Global.COURSE_INTERACT=interactive;
    if(!interactive)Global.COURSE_POINTER_IN_STAGE=false;
    controller.preventDragging=!interactive;
    controller.overlayOpen=interactive?false:'course-content';
    document.documentElement.classList.toggle('course-stage-interactive',interactive);
    for(const world of worldIds)controller.pages[world].interactionActive=interactive&&controller.currentPage===world;
    ui.enableMobile(interactive);
    if(!interactive)document.body.style.cursor='';
  }
  function getState(){return{ready:readyResolved,error:failed,currentWorld:controller?worldIds.indexOf(controller.currentPage):-1,progress:currentProgress,interactive,paused,sound:!!(window.AudioController&&AudioController.instance().soundState)};}
  function setProgress(value){requestedProgress=Math.max(0,Math.min(1,Number(value)||0));return requestedProgress;}
  function drive(){
    raf=requestAnimationFrame(drive);
    if(paused||document.hidden||interactive||!controller||controller.changingWorlds||controller.stripesTransition||controller.isLocked)return;
    const page=controller.pages[controller.currentPage];if(!page||!worldIds.includes(controller.currentPage))return;
    currentProgress+=(requestedProgress-currentProgress)*.065;
    if(Math.abs(currentProgress-requestedProgress)<.0003)currentProgress=requestedProgress;
    // Stay within intro/product closeups. Film and its source CTA never enter
    // the course background; course films have their own native video controls.
    const max=Global.isMobile?5.6:7.6;
    const position=Stage.height*max*currentProgress;
    page.stopAnimation();page.forceScroll(position);ui.scroll=position;ui.additionalScroll=0;
  }
  async function transition(index){
    await ready;index=Math.max(0,Math.min(2,Math.round(Number(index)||0)));
    const world=worldIds[index];
    if(controller.currentPage===world){applyInteraction();return getState();}
    await waitFor(()=>!controller.isLocked&&!controller.changingWorlds&&!controller.stripesTransition,15000);
    const previous=controller.pages[controller.currentPage];previous?.stopAnimation?.();previous?.forceScroll?.(0);
    controller.pages[world].stopAnimation();controller.pages[world].forceScroll(0);ui.scroll=0;ui.additionalScroll=0;
    currentProgress=0;
    try{
      // The source transition compositor is allowed to run without an overlay;
      // course input guards still prevent DOM gestures from entering the stage.
      controller.overlayOpen=false;controller.preventDragging=true;
      controller.navigate({perma:routes[index]+'/1',triggerUpdateRoute:true});
      await waitFor(()=>controller.currentPage===world&&!controller.isLocked&&!controller.changingWorlds&&!controller.stripesTransition,15000);
    }finally{applyInteraction();}
    emit('aicanfeel-world-change',getState());return getState();
  }
  function switchWorld(index){const next=queued.then(()=>transition(index));queued=next.catch(error=>{emit('aicanfeel-world-error',{message:error.message});});return next;}
  async function toggleSound(){
    await ready;const audio=AudioController.instance();
    if(!audio.enabled)await audio.handleClick();else audio.toggleSound(audio.isMuted);
    emit('aicanfeel-world-sound',{enabled:!!audio.soundState});return!!audio.soundState;
  }
  function setInteractive(enabled){interactive=!!enabled;applyInteraction();emit('aicanfeel-world-interaction',{interactive});return interactive;}
  // Keep Hydra's shared DOM/timer loop alive for the course's fixed controls.
  // Pausing that global loop prevents navigation repainting after a scroll.
  // The renderer gate below stops 3D draw calls while the course is reading.
  function pause(){paused=true;}
  function resume(){paused=false;if(window.Render)Render.resume();}
  window.AICANFEEL_WORLD={ready,switchWorld,setProgress,setInteractive,toggleSound,getState,pause,resume};
  const style=document.createElement('style');style.dataset.courseBridge='true';style.textContent=`
    #Stage .PageUIDom,#Stage .MobileMenu,#Stage .InstructionsUI,#Stage .Instructions,#Stage .RotateScreenView,#Stage .ShareOverlay,#Stage .PrizeOverlay,#Stage .Tooltip,#Stage .CookiesBar,#Stage .GLSEO,#Stage .highlight{display:none!important}
    #Stage .PageUIController{opacity:0!important;pointer-events:none!important}
    html.course-stage-interactive #Stage,html.course-stage-interactive #Stage .PageUIController{pointer-events:auto!important}
  `;document.head.append(style);
  document.addEventListener('visibilitychange',()=>{if(window.Render)(document.hidden?Render.pause:Render.resume)();});
  (async()=>{
    try{
      controller=await waitFor(()=>{
        // Calling a Hydra singleton factory before Container initializes World
        // creates it permanently against an undefined stage. Only query the
        // factory after the native controller has completed its own boot.
        if(!window.Global?.COURSE_RENDER_READY||!window.World?.SCENE||!World.RENDERER||!window.GLUI?.Stage||!document.querySelector('#Stage .PageUIController'))return null;
        if(!window.ExperienceController||!window.PageUIController)return null;
        const c=ExperienceController.instance();
        return c.pages?.world1?.scenes?.length===3&&!c.isLocked?c:null;
      });
      ui=PageUIController.instance();Global.COURSE_MODE=true;Global.COURSE_INTERACT=false;
      const render=World.RENDERER.render;
      World.RENDERER.render=function(...args){if(paused||document.hidden)return;return render.apply(this,args);};
      await hideAuthoredUI();applyInteraction();readyResolved=true;resolveReady(getState());raf=requestAnimationFrame(drive);emit('aicanfeel-world-ready',getState());
    }catch(error){failed=true;rejectReady(error);emit('aicanfeel-world-error',{message:error.message});}
  })();
})();

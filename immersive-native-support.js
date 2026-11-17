/* Local AICANFEEL integration; the authored renderer owns animation and touch input. */
(()=>{
  const status=document.getElementById('boot-status');
  let frames=0;
  const ready=setInterval(()=>{
    if(window.Global?.IMMERSIVE_COURSE_RENDER_READY){
      if(++frames>4){status?.classList.add('ready');setTimeout(()=>status?.remove(),500);clearInterval(ready)}
    }
  },200);
  setTimeout(()=>{clearInterval(ready);if(!document.querySelector('canvas')){status.classList.remove('ready');status.innerHTML='<strong>THADDEUS</strong><span>Your browser could not start the 3D experience.</span><button onclick="location.reload()">Try again</button><button data-ic-enquire>Discover the ring</button><button data-gallery>View the campaign</button>';document.body.append(status)}},25000);
  // Never contact legacy advertising or campaign endpoints.
  window.gtag=()=>{};window.fbq=()=>{};
  const setup=setInterval(()=>{
    if(!window.Hydra||!window.Render||!window.Config)return;
    Config.CONTEST=false;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)Render.capFPS=30;
    clearInterval(setup);
  },100);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      try{window.ShareOverlay?.instance()?.animateOut?.()}catch{}
      try{window.MobileMenu?.instance()?.animateOut?.()}catch{}
    }
  });
  document.addEventListener('visibilitychange',()=>{
    if(!window.Render)return;
    document.hidden?Render.pause():Render.resume();
  });
  let controlAttempts=0;
  const controls=setInterval(()=>{
    if(++controlAttempts>150){clearInterval(controls);return;}
    const burger=document.querySelector('.burger');
    if(!burger)return;
    burger.setAttribute('role','button');burger.setAttribute('aria-label','Open menu');burger.setAttribute('aria-expanded','false');burger.tabIndex=0;
    const activate=el=>{el.querySelector('.hit')?.click()};
    burger.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(burger)}});
    const menu=document.querySelector('.MobileMenu');
    const syncMenu=()=>{let open=window.ExperienceController?.instance()?.overlayOpen==='mobile-menu';burger.setAttribute('aria-label',open?'Close menu':'Open menu');burger.setAttribute('aria-expanded',String(open));if(menu)menu.inert=!open};
    burger.addEventListener('click',()=>setTimeout(syncMenu,350));
    if(menu){new MutationObserver(syncMenu).observe(menu,{attributes:true,attributeFilter:['style']});syncMenu()}
    document.querySelectorAll('.MobileMenu .home,.MobileMenu .world1,.MobileMenu .world2,.MobileMenu .world3').forEach(el=>{
      el.setAttribute('role','link');el.setAttribute('aria-label',el.textContent.trim());el.tabIndex=0;
      el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();activate(el)}});
    });
    const sound=document.querySelector('.MobileMenu .soundBtn');
    if(sound){
      sound.setAttribute('role','button');sound.tabIndex=0;
      const syncSound=()=>{const muted=window.AudioController?.instance()?.isMuted;sound.setAttribute('aria-label',muted?'Enable sound':'Mute sound');sound.setAttribute('aria-pressed',String(!muted))};
      sound.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(sound)}});
      sound.addEventListener('click',()=>setTimeout(syncSound,50));syncSound();
    }
    clearInterval(controls);
  },200);
  // The source chooses separate scene layouts at startup; preserve the route
  // when a desktop window crosses that layout boundary.
  const nativeMobile=/Mobi|Android|iPhone|iPad|Tablet/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const startedNarrow=innerWidth<700;let resizeTimer;
  if(!nativeMobile)addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if((innerWidth<700)!==startedNarrow)location.reload()},500)});
})();

(()=>{
  'use strict';
  const dialog=document.getElementById('course-dialog'),content=window.AICANFEEL_COURSE_CONTENT;
  const phases=['Create','Direct','Sell'],descriptions=['Ideas, form and materials','Camera, timing and finish','Portfolio, pitch and delivery'],routes=['black-tracksuit','bomber','white-tracksuit'];
  let controller,ui,ready=false,opening=false,previousFocus,previousOverlay=false,toastTimer;
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const attribution={};for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid']){const value=new URLSearchParams(location.search).get(key);if(value)attribution[key]=value;}
  window.AICANFEEL_PREVIEW_EVENTS=[];
  function track(event,detail={}){const record={event,course:content.id,...detail,attribution};window.AICANFEEL_PREVIEW_EVENTS.push(record);dispatchEvent(new CustomEvent('aicanfeel-course-event',{detail:record}));}
  function toast(text){const el=document.getElementById('ic-toast');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2300);}
  // This listener is installed before Hydra. Native course panels keep ordinary
  // touch/keyboard behavior without sending their gestures into the 3D camera.
  for(const type of ['touchstart','touchmove','touchend','pointerdown','pointermove','pointerup','mousedown','mousemove','mouseup','wheel','keydown','keyup']){
    window.addEventListener(type,event=>{
      // The native GLSEO handler already activates Enter. Suppress the browser's
      // second activation, which would otherwise hit the newly focused close button.
      if(type==='keydown'&&event.key==='Enter'&&event.target?.closest?.('#GLSEO a')){event.preventDefault();event.stopImmediatePropagation();event.target.closest('#GLSEO a').click();return;}
      if(dialog.open||event.target?.closest?.('.ic-ui')){
        if(type==='pointerdown'&&dialog.open&&event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom){event.preventDefault();closeCourse();}}
        if(type==='keydown'&&event.key==='Escape'&&dialog.open){event.preventDefault();closeCourse();}
        event.stopImmediatePropagation();
      }
    },{capture:true,passive:false});
  }
  document.getElementById('ic-outline').innerHTML=content.phases.map((phase,index)=>'<details class="ic-topic" '+(index===0?'open':'')+'><summary>'+escape(phase.title)+'</summary><p>'+escape(phase.description)+'</p><ul>'+phase.topics.map(topic=>'<li>'+escape(topic.title)+'</li>').join('')+'</ul></details>').join('');
  document.getElementById('ic-faqs').innerHTML=content.faqs.map(faq=>'<details><summary>'+escape(faq.question)+'</summary><p>'+escape(faq.answer)+'</p></details>').join('');
  async function openCourse(detail={}){
    if(dialog.open||opening)return;opening=true;previousFocus=document.activeElement;
    if(ready){
      const wasMenu=controller.overlayOpen==='mobile-menu';
      if(wasMenu){MobileMenu.instance().animateOut();await new Promise(resolve=>{const waitClosed=()=>controller.overlayOpen!=='mobile-menu'?resolve():setTimeout(waitClosed,40);waitClosed();});}
      previousOverlay=wasMenu?false:controller.overlayOpen||false;controller.overlayOpen='course-details';controller.preventDragging=true;
      for(const page of Object.values(controller.pages))if(page)page.interactionActive=false;
      ui.enableMobile(false);
    }
    document.documentElement.classList.add('ic-open');document.body.classList.add('ic-open');dialog.showModal();opening=false;track('course_enquiry_open',detail);
  }
  function closeCourse(){if(!dialog.open)return;dialog.close();}
  dialog.addEventListener('close',()=>{
    document.documentElement.classList.remove('ic-open');document.body.classList.remove('ic-open');
    if(ready){controller.overlayOpen=previousOverlay;controller.preventDragging=false;const page=controller.pages[controller.currentPage];if(page)page.interactionActive=true;ui.enableMobile(true);}
    if(previousFocus?.getClientRects?.().length)previousFocus.focus?.({preventScroll:true});else if(ready)ui.focus();track('course_enquiry_close');
  });
  // Backdrop dismissal happens on pointerdown above. A 3D button opens on
  // pointerup, so its following click must not dismiss the new dialog.
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-ic-enquire]');if(button){openCourse({placement:'course-hud'});return;}
    if(event.target.closest('[data-ic-close]')){closeCourse();return;}
    const chapter=event.target.closest('[data-ic-world]');if(chapter){if(!ready||controller.isLocked||controller.changingWorlds||controller.stripesTransition){toast('The scene is preparing.');return;}const index=+chapter.dataset.icWorld;controller.navigate({perma:routes[index]+'/1',triggerUpdateRoute:true});track('course_chapter',{phase:phases[index]});}
  });
  addEventListener('aicanfeel-course-enquire',event=>openCourse(event.detail));
  document.getElementById('ic-enquiry-link').addEventListener('click',()=>track('instagram_enquiry_click'));
  document.getElementById('ic-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('Hi AICANFEEL, I would like details about The Claude Motion System.');toast('Course enquiry copied.');track('enquiry_message_copy');}catch{toast('Send “COURSE” to @aicanfeel.');}});
  function sync(){
    if(!ready){
      if(!window.Global?.IMMERSIVE_COURSE_RENDER_READY)return;
      controller=ExperienceController.instance();ui=PageUIController.instance();ready=true;document.body.classList.add('ic-native-ready');track('immersive_course_ready');
    }
    const page=controller.currentPage,index=Math.max(0,['world1','world2','world3'].indexOf(page));
    document.body.dataset.icPage=page;document.body.classList.toggle('ic-light',page==='world3');
    const nativeHUD=document.querySelector('.PageUIDom');const visible=nativeHUD&&+getComputedStyle(nativeHUD).opacity>.45;
    document.body.classList.toggle('ic-ready',!!visible);document.body.classList.toggle('ic-other-overlay',!!controller.overlayOpen&&controller.overlayOpen!=='course-details');
    document.getElementById('ic-phase-name').textContent=phases[index];document.getElementById('ic-phase-description').textContent=descriptions[index];
    const active=controller.pages[page],section=active?.currentSection;
    document.body.classList.toggle('ic-film',section===2&&page!=='stripes');
    document.querySelectorAll('[data-ic-world]').forEach(button=>{button.disabled=controller.isLocked||controller.changingWorlds||controller.stripesTransition;});
  }
  setInterval(sync,160);
  window.AICANFEEL_IMMERSIVE={openCourse,closeCourse,getState:()=>({ready,page:controller?.currentPage,section:controller?.pages[controller.currentPage]?.currentSection,scroll:controller?.pages[controller.currentPage]?.scroll,dialog:dialog.open,url:location.href})};
  track('immersive_course_view');
})();

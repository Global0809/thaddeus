(()=>{
  'use strict';
  const content=window.AICANFEEL_COURSE_CONTENT,world=window.AICANFEEL_WORLD;
  if(!content)return;
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const scroller=$('#course-scroll'),header=$('.site-header'),videoModal=$('#video-modal'),enrollModal=$('#enroll-modal'),video=$('#demo-video');
  const escaped=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon=name=>'<img class="icon" src="/aicanfeel-interactive-worlds/course/icons/'+name+'.svg" alt="">';
  let selectedPhase=0,selectedStudy=0,currentSection=null,sceneSwitching=false,sceneReady=false,stageFailed=false,exploring=false,lastFocus=null,toastTimer,scrollFrame=0;
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches,mobileStage=matchMedia('(max-width:900px)');
  // An adapter-ready event stream; no marketing pixel is installed in preview.
  const attribution={};for(const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid']){const v=new URLSearchParams(location.search).get(k);if(v)attribution[k]=v;}
  window.AICANFEEL_PREVIEW_EVENTS=[];
  function track(event,detail={}){const item={event,course:content.id,...detail,attribution};window.AICANFEEL_PREVIEW_EVENTS.push(item);dispatchEvent(new CustomEvent('aicanfeel-course-event',{detail:item}));}
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2500);}
  async function copy(text){try{await navigator.clipboard.writeText(text);toast('Copied. Make it your own.');return true;}catch{toast('Select and copy the text from the brief.');return false;}}
  function closeMenu(){header.classList.remove('menu-open');$('#menu-toggle').setAttribute('aria-expanded','false');$('#menu-toggle').setAttribute('aria-label','Open navigation');}
  $('#menu-toggle').addEventListener('click',()=>{const open=header.classList.toggle('menu-open');$('#menu-toggle').setAttribute('aria-expanded',String(open));$('#menu-toggle').setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(!target)return;e.preventDefault();closeMenu();target.scrollIntoView({behavior:reduceMotion?'instant':'smooth',block:'start'});try{history.replaceState(null,'',location.pathname+location.search+a.getAttribute('href'));}catch{}track('section_navigation',{target:target.id});}));
  function renderStudy(index){
    selectedStudy=index;const demo=content.demos[index],labels=['Form &amp; light','Texture &amp; rhythm','Perspective'];
    $('#film-grid').innerHTML='<button class="film-featured" data-play="'+index+'" aria-label="Play '+escaped(demo.title)+'"><img src="/aicanfeel-interactive-worlds/course/media/demo-'+(index+1)+'.webp" alt="'+escaped(demo.title)+'" loading="lazy"><span class="film-play">'+icon('play')+'Watch study</span></button>';
    $('#study-tabs').innerHTML=content.demos.map((d,i)=>'<button class="study-tab" role="tab" aria-label="View '+escaped(d.title)+'" id="study-tab-'+i+'" aria-controls="film-grid" aria-selected="'+(i===index)+'" tabindex="'+(i===index?0:-1)+'" data-study="'+i+'"><span>'+escaped(content.phases[i].title)+'</span>'+labels[i]+'</button>').join('');
    $('#film-grid').setAttribute('role','tabpanel');$('#film-grid').setAttribute('aria-labelledby','study-tab-'+index);
  }
  renderStudy(0);
  $('#study-tabs').addEventListener('click',e=>{const tab=e.target.closest('[data-study]');if(tab){renderStudy(+tab.dataset.study);$('#study-tab-'+tab.dataset.study).focus({preventScroll:true});track('study_select',{study:content.demos[+tab.dataset.study].id});}});
  $('#study-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?2:(selectedStudy+(e.key==='ArrowRight'?1:2))%3;renderStudy(next);$('[data-study="'+next+'"]').focus();});
  function renderPhase(index){
    selectedPhase=index;const phase=content.phases[index];
    $('#phase-tabs').innerHTML=content.phases.map((p,i)=>'<button class="phase-tab" role="tab" id="phase-tab-'+i+'" aria-controls="topic-panel" aria-selected="'+(i===index)+'" tabindex="'+(i===index?0:-1)+'" data-phase="'+i+'"><strong>'+escaped(p.title)+'</strong><span class="phase-dot"></span></button>').join('');
    $('#topic-panel').setAttribute('aria-labelledby','phase-tab-'+index);
    $('#topic-panel').innerHTML='<p>'+escaped(phase.description)+'</p>'+phase.topics.map((topic,i)=>'<details class="topic" '+(i===0?'open':'')+'><summary>'+escaped(topic.title)+'</summary><p>'+escaped(topic.description)+'</p><p class="outcome">'+escaped(topic.outcome)+'</p></details>').join('');
  }
  renderPhase(0);
  $('#phase-tabs').addEventListener('click',e=>{const tab=e.target.closest('[data-phase]');if(tab){renderPhase(+tab.dataset.phase);$('#phase-tab-'+tab.dataset.phase).focus({preventScroll:true});track('curriculum_phase',{phase:content.phases[+tab.dataset.phase].id});}});
  $('#phase-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?2:(selectedPhase+(e.key==='ArrowRight'?1:2))%3;renderPhase(next);$('#phase-tab-'+next).focus();});
  $('#faq-list').innerHTML=content.faqs.map(f=>'<details><summary>'+escaped(f.question)+'</summary><p>'+escaped(f.answer)+'</p></details>').join('');
  const brief=content.projectBriefs[0].prompt;
  const processCopy=[
    'CREATIVE BRIEF\n\nSubject: one fictional product.\nDirection: quiet, tactile, cinematic.\nMaterial: something you can almost feel.\nLight: one deliberate highlight.\nCamera: reveal, hold, then resolve.\n\nBuild the scene in layers.\nReview each decision before the next.',
    'CAMERA DIRECTION\n\n01  Establish the object and its space.\n02  Move close enough to reveal material.\n03  Let one detail hold the frame.\n04  Return to a clean final composition.\n\nExplore the camera in the 3D viewer.\nA move should reveal, not distract.',
    'THE FINISH\n\nDoes the silhouette read?\nDoes the material react to the light?\nDoes each movement have a purpose?\nIs the ending clean enough to hold?\n\nThen test the frame, aspect ratio,\nplayback and final delivery.'
  ];
  $('#process-output').textContent=processCopy[0];
  $$('.process-tabs button').forEach(button=>button.addEventListener('click',()=>{$$('.process-tabs button').forEach(b=>b.setAttribute('aria-selected',String(b===button)));const index=+button.dataset.process;$('#process-output').textContent=processCopy[index];track('process_tab',{step:index});}));
  $('.process-tabs').addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();const tabs=$$('.process-tabs button'),index=tabs.indexOf(document.activeElement),next=(index+(e.key==='ArrowRight'?1:2))%3;tabs[next].click();tabs[next].focus();});
  $('#copy-brief').addEventListener('click',()=>{copy(brief);track('practice_brief_copy');});
  $('#copy-message').addEventListener('click',()=>{copy('Hi AICANFEEL, I’d like details about The Claude Motion System.');track('enquiry_message_copy');});
  let scrubTimer;
  $('#scene-scrub').addEventListener('input',e=>{if(!exploring||sceneSwitching)return;clearTimeout(scrubTimer);world.setInteractive(false);setProgress(+e.target.value/100);scrubTimer=setTimeout(()=>{if(exploring)world.setInteractive(true);},1200);});
  function setProgress(value){$('#scrub-value').textContent=String(Math.round(value*100)).padStart(2,'0')+' / 100';world?.setProgress(value);}
  const sections=$$('main>section[data-mode]');
  function syncStagePlayback(){
    if(!sceneReady||sceneSwitching)return;
    const hero=$('#top').getBoundingClientRect(),inHero=hero.bottom>header.offsetHeight&&hero.top<innerHeight;
    const shouldPause=videoModal.open||enrollModal.open||(!exploring&&(reduceMotion||mobileStage.matches||!inHero));
    if(world.getState().paused!==shouldPause)(shouldPause?world.pause:world.resume)();
  }
  function updateScroll(){
    scrollFrame=0;if(exploring)return;
    const line=innerHeight*.46;let active=sections[sections.length-1];
    for(const section of sections){const r=section.getBoundingClientRect();if(r.bottom>line){active=section;break;}}
    currentSection=active;document.body.dataset.mode=active.dataset.mode;
    $('#sticky-offer').classList.toggle('visible',$('.hero-actions [data-enroll]').getBoundingClientRect().bottom<header.offsetHeight);
    syncStagePlayback();
  }
  scroller.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});addEventListener('resize',updateScroll);
  let pauseTimer;
  function pauseStage(){clearTimeout(pauseTimer);if(!sceneReady)return;const attempt=()=>{if(!videoModal.open&&!enrollModal.open)return;let busy=false;try{const c=ExperienceController.instance();busy=c.isLocked||c.changingWorlds||c.stripesTransition;}catch{}if(busy){pauseTimer=setTimeout(attempt,150);return;}world?.pause();};attempt();}
  function resumeStage(){clearTimeout(pauseTimer);syncStagePlayback();}
  function showDialog(dialog){closeMenu();lastFocus=document.activeElement;world?.setInteractive(false);dialog.showModal();pauseStage();}
  function closeDialog(dialog){dialog.close();resumeStage();lastFocus?.focus?.();}
  document.addEventListener('click',e=>{
    const enroll=e.target.closest('[data-enroll]');if(enroll){track('course_enquiry_open',{placement:enroll.closest('section')?.id||'navigation'});showDialog(enrollModal);return;}
    const play=e.target.closest('[data-play]');if(play){const demo=content.demos[+play.dataset.play];video.src=demo.videoSrc+'?v=course3';video.poster='/aicanfeel-interactive-worlds/course/media/demo-'+(+play.dataset.play+1)+'.webp';$('#video-title').textContent=demo.title;$('#video-disclosure').textContent=demo.disclosure;showDialog(videoModal);video.play().catch(()=>{});track('demo_play',{demo:demo.id});return;}
    const close=e.target.closest('[data-close]');if(close)closeDialog(close.closest('dialog'));
    if(e.target.closest('[data-explore]'))enterExplore();
  });
  for(const dialog of [videoModal,enrollModal]){
    dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))closeDialog(dialog);});
    dialog.addEventListener('close',()=>{if(dialog===videoModal){video.pause();video.removeAttribute('src');video.load();}resumeStage();});
    dialog.addEventListener('cancel',()=>{resumeStage();});
  }
  $('#dm-link').addEventListener('click',()=>track('instagram_enquiry_click'));
  let soundBusy=false;
  async function toggleSound(){if(soundBusy)return;soundBusy=true;try{if(!sceneReady){toast('The 3D scene is still loading.');return;}const enabled=await world.toggleSound();$('#sound-toggle').innerHTML=(enabled?'Sound on':'Sound off')+icon(enabled?'speaker-high':'speaker-slash');$('#sound-toggle').setAttribute('aria-pressed',String(enabled));$('#viewer-sound').innerHTML=icon(enabled?'speaker-high':'speaker-slash');$('#viewer-sound').setAttribute('aria-label',enabled?'Mute sound':'Enable sound');$('#viewer-sound').setAttribute('aria-pressed',String(enabled));track('sound_toggle',{enabled});}catch{toast('Sound is unavailable in this browser.');}finally{soundBusy=false;}}
  $('#sound-toggle').addEventListener('click',toggleSound);$('#viewer-sound').addEventListener('click',toggleSound);
  async function enterExplore(){
    if(stageFailed){$('.film-featured').click();return;}
    if(!sceneReady){toast('The live scene is loading. The course stays ready to explore.');return;}
    exploring=true;lastFocus=document.activeElement;closeMenu();world.resume();document.documentElement.classList.add('world-ready');document.body.classList.add('exploring');scroller.inert=true;header.inert=true;$('#viewer-controls').setAttribute('aria-hidden','false');world.setInteractive(true);$('#exit-scene').focus();track('scene_explore_open');
  }
  function exitExplore(){
    if(!exploring)return;clearTimeout(scrubTimer);exploring=false;if(!sceneSwitching)world?.setInteractive(false);document.body.classList.remove('exploring');scroller.inert=false;header.inert=false;$('#viewer-controls').setAttribute('aria-hidden','true');lastFocus?.focus?.({preventScroll:true});
    if(reduceMotion)document.documentElement.classList.remove('world-ready');
    updateScroll();track('scene_explore_close');
  }
  $('#exit-scene').addEventListener('click',exitExplore);
  $$('[data-viewer-scene]').forEach(button=>button.addEventListener('click',async()=>{
    if(sceneSwitching)return;sceneSwitching=true;const index=+button.dataset.viewerScene;clearTimeout(scrubTimer);setProgress(0);world.resume();
    $$('[data-viewer-scene]').forEach(b=>{b.disabled=true;b.classList.toggle('active',b===button);});$('#scene-scrub').disabled=true;
    try{await world.switchWorld(index);}catch{toast('This scene could not be opened.');}
    finally{sceneSwitching=false;world.setInteractive(exploring);$$('[data-viewer-scene]').forEach(b=>b.disabled=false);$('#scene-scrub').disabled=false;syncStagePlayback();}
  }));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();exitExplore();}});
  addEventListener('aicanfeel-world-change',e=>{$$('[data-viewer-scene]').forEach(b=>b.classList.toggle('active',+b.dataset.viewerScene===e.detail.currentWorld));});
  world?.ready.then(async()=>{await world.switchWorld(0);sceneReady=true;world.setProgress(.02);if(!reduceMotion)document.documentElement.classList.add('world-ready');$('#world-status').textContent='Live 3D study';updateScroll();track('interactive_stage_ready');}).catch(()=>{stageFailed=true;world?.pause();$('#world-status').textContent='Preview study';track('interactive_stage_fallback');});
  document.body.dataset.mode='hero';updateScroll();track('course_preview_view');
  if(location.hash){const target=$(location.hash);if(target)setTimeout(()=>target.scrollIntoView({behavior:'instant'}),50);}
})();

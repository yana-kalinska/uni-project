const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const menus = {
  taste: [['Argentine Angus sirloin', 'Selected Angus beef, finished on the grill.', 'FIRE · PRIME CUT'], ['French rack of lamb', 'Lamb served with a delicate vegetable accompaniment.', 'CHARACTER · BALANCE'], ['Slow-cooked beef cheeks', 'Aged wine and creamy potato parmentier.', 'TIME · DEPTH']],
  wine: [['Salmon', 'Agave, dill and lemon, with potato mille-feuille and Mahón cream.', 'CITRUS · SEA'], ['Cod, two ways', 'Trinxat, Iberian ham, figs and almonds.', 'MEDITERRANEAN ROOTS'], ['Tuna tataki', 'Sesame, Japanese vinaigrette, snow peas and pak choi.', 'FRESH · PRECISE']],
  sweet: [['Honey & mató', 'Catalan fresh cheese, thyme, lemon and truffle honey.', 'CATALAN MEMORY'], ['Cheesecake cannoli', 'A delicate cheesecake filling with red berries.', 'CREAMY · BRIGHT'], ['Chocolates', 'Chocolate explored through contrasting textures.', 'A RICH FINALE']]
};
const menuPhotos = {taste:['arcano-steak.jpg', 'Arcano’s plated sirloin'], wine:['arcano-detail.jpg','The dining room at Arcano'], sweet:['arcano-room.jpg','The intimate dining room at Arcano']};
function renderMenu(key) {
  const panel = document.querySelector('#menu-panel');
  const [image, alt] = menuPhotos[key]; const photo = document.querySelector('#menu-photo'); photo.src = `assets/${image}`; photo.alt = alt;
  panel.replaceChildren(...menus[key].map(([title, copy, note]) => {
    const row = document.createElement('article'); row.className = 'menu-row';
    const h = document.createElement('h3'); h.textContent = title;
    const p = document.createElement('p'); p.textContent = copy;
    const s = document.createElement('span'); s.textContent = note;
    row.append(h,p,s); return row;
  }));
  if (window.gsap && !reducedMotion) gsap.fromTo(panel.children, {opacity:0,y:14}, {opacity:1,y:0,duration:.5,stagger:.08});
}
renderMenu('taste');
const moods = {
  intimate: ['Beneath the arches.', 'Original stone, warm light, and a passage into another Barcelona.', 'STONE · LIGHT · HISTORY', '#7c2941'],
  gather: ['A room for conversation.', 'Intimate tables, textured walls, and time to settle into the evening.', 'CLOSER · WARMER · TOGETHER', '#bd824a'],
  late: ['Let the night surprise you.', 'Deeper shadows. A richer red. Just one more moment at the table.', 'DEEP RED · AFTER HOURS', '#8c446d']
};
document.querySelectorAll('[role=tablist]').forEach(list => {
  const tabs = [...list.querySelectorAll('[role=tab]')];
  function activate(tab) {
    tabs.forEach(t => {t.setAttribute('aria-selected', String(t === tab)); t.tabIndex = t === tab ? 0 : -1;});
    const panel = document.getElementById(tab.getAttribute('aria-controls')); panel.setAttribute('aria-labelledby',tab.id);
    if(tab.dataset.menu) renderMenu(tab.dataset.menu);
    if(tab.dataset.mood) {
      const [title, copy, label, color] = moods[tab.dataset.mood];
      document.querySelector('#mood-title').textContent = title;
      document.querySelector('#mood-copy').textContent = copy;
      document.querySelector('#mood-label').textContent = label;
      document.documentElement.style.setProperty('--mood',color);
      window.dispatchEvent(new CustomEvent('arcano-mood',{detail:color}));
      const photos = {intimate:['arcano-interior.jpg','Arcano’s original arches and dining tables'],gather:['arcano-room.jpg','Arcano’s intimate stone dining room'],late:['arcano-detail.jpg','Warm lighting beneath Arcano’s stone arches']};
      const photo = document.querySelector('#space-photo'); if(window.gsap && !reducedMotion) gsap.fromTo(photo,{opacity:.3,scale:1.08},{opacity:1,scale:1,duration:.8,ease:'power2.out'}); photo.src = `assets/${photos[tab.dataset.mood][0]}`; photo.alt = photos[tab.dataset.mood][1];
    }
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if(e.key === 'ArrowRight') next = (index+1)%tabs.length;
      if(e.key === 'ArrowLeft') next = (index+tabs.length-1)%tabs.length;
      if(e.key === 'Home') next = 0;
      if(e.key === 'End') next = tabs.length-1;
      if(next !== undefined) {e.preventDefault(); tabs[next].focus(); activate(tabs[next]);}
    });
  });
});
const booking = document.querySelector('#booking');
let bookingTrigger;
const date = document.querySelector('#booking-date');
const today = new Date();
date.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
document.querySelectorAll('[data-reserve]').forEach(button => button.addEventListener('click', () => {
  closeNavigation(); bookingTrigger = button; document.querySelector('#booking-status').textContent = ''; booking.showModal();
}));
document.querySelector('.close-dialog').addEventListener('click', () => booking.close());
booking.addEventListener('click', e => {if(e.target === booking) {const r = booking.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) booking.close();}});
booking.addEventListener('close', () => bookingTrigger?.focus());
document.querySelector('#booking-form').addEventListener('submit',e => {
  e.preventDefault();
  const formatted = new Date(`${date.value}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  const status = document.querySelector('#booking-status');
  status.textContent = `Your preference: ${document.querySelector('#booking-guests').value}, ${formatted} at ${document.querySelector('#booking-time').value}. Confirm availability with Arcano. `;
  const link = document.createElement('a'); link.href = 'https://www.arcanobarcelona.com/en/reservas'; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'Open official reservations'; link.className = 'booking-link'; status.append(link);
});

const toggle = document.querySelector('#nav-toggle');
const overlay = document.querySelector('#nav-overlay');
function closeNavigation(){
  if(!overlay) return;
  overlay.hidden = true;
  toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Open navigation');
  document.body.classList.remove('nav-open');
  document.querySelector('main').inert = false; document.querySelector('footer').inert = false;
}
toggle.addEventListener('click',()=>{
  if(!overlay.hidden){closeNavigation();return;}
  overlay.hidden=false; toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Close navigation');
  document.body.classList.add('nav-open');document.querySelector('main').inert=true;document.querySelector('footer').inert=true;
  if(window.gsap&&!reducedMotion)gsap.fromTo(overlay.querySelectorAll('nav a'),{y:30,opacity:0},{y:0,opacity:1,duration:.5,stagger:.06});
  overlay.querySelector('a').focus();
});
overlay.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNavigation));
document.addEventListener('keydown',e=>{
  if(overlay.hidden) return;
  if(e.key==='Escape'){closeNavigation();toggle.focus();}
  if(e.key==='Tab'){
    const focusables=[...document.querySelectorAll('.site-header a,.site-header button,#nav-overlay a')];
    const first=focusables[0],last=focusables.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
if(window.gsap && window.ScrollTrigger && !reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-title',{opacity:0,duration:1.5,ease:'power3.out'});
  gsap.from('.hero-intro,.hero-meta',{y:25,opacity:0,duration:1,delay:.3,stagger:.1});
  gsap.from('.floating-photo',{scale:.8,opacity:0,duration:1.3,delay:.3,stagger:.15,ease:'power3.out'});
  gsap.to('.architecture',{y:-150,rotation:-22,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.to('.plate',{y:100,rotation:26,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.to('.hero-title',{y:100,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.from('.manifesto h2',{scale:.86,opacity:.3,scrollTrigger:{trigger:'.manifesto',start:'top 85%',end:'center center',scrub:1}});
  gsap.to('.theatre-word',{xPercent:10,ease:'none',scrollTrigger:{trigger:'.space-theatre',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.from('.space-photo-wrap',{rotation:3,scale:.85,scrollTrigger:{trigger:'.space-theatre',start:'top 85%',end:'center center',scrub:1}});
  gsap.from('.visit-title h2',{x:-55,opacity:.4,scrollTrigger:{trigger:'.visit',start:'top 85%',end:'center center',scrub:1}});
  gsap.to('.food-interlude>img',{scale:1.15,ease:'none',scrollTrigger:{trigger:'.food-interlude',start:'top bottom',end:'bottom top',scrub:1}});
}

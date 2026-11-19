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
  intimate: ['For just the two of you.', 'Low light, a shared bottle, and nowhere else you need to be.', 'SOFT LIGHT · SLOW EVENINGS', '#7c2941'],
  gather: ['Good company changes everything.', 'A long conversation, plates to share, and space for another story.', 'WARM LIGHT · SHARED MOMENTS', '#bd824a'],
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
      const photos = {intimate:['arcano-room.jpg','Arcano’s intimate stone dining room'],gather:['arcano-interior.jpg','Arcano’s original arches and dining tables'],late:['arcano-detail.jpg','Warm lighting beneath Arcano’s stone arches']};
      const photo = document.querySelector('#space-photo'); photo.src = `assets/${photos[tab.dataset.mood][0]}`; photo.alt = photos[tab.dataset.mood][1];
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
  bookingTrigger = button; document.querySelector('#booking-status').textContent = ''; booking.showModal();
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
if(window.gsap && window.ScrollTrigger && !reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-copy > *',{y:35,opacity:0,duration:1.2,stagger:.14,ease:'power3.out'});
  gsap.utils.toArray('.reveal').forEach(el => gsap.from(el,{y:40,opacity:0,duration:1,scrollTrigger:{trigger:el,start:'top 92%'},ease:'power2.out'}));
  gsap.to('.image-arch img',{scale:1.1,ease:'none',scrollTrigger:{trigger:'.image-arch',start:'top bottom',end:'bottom top',scrub:1}});
}

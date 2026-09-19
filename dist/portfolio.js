// Image gallery — buttons, keyboard and pointer swipes.
const deck = document.querySelector('.photo-deck');
const photos = [...deck.querySelectorAll('.deck-slide')];
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  photos.forEach((photo, i) => { photo.classList.toggle('active', i === photoIndex); photo.setAttribute('aria-hidden', String(i !== photoIndex)); });
  document.querySelector('#photo-count').textContent = `${String(photoIndex + 1).padStart(2, '0')} / 03`;
}
deck.querySelector('[aria-label="Previous photo"]').addEventListener('click', () => showPhoto(photoIndex - 1));
deck.querySelector('[aria-label="Next photo"]').addEventListener('click', () => showPhoto(photoIndex + 1));
deck.addEventListener('keydown', e => { if (['ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault(); showPhoto(photoIndex + (e.key === 'ArrowRight' ? 1 : -1)); } });
let swipeX = null;
deck.addEventListener('pointerdown', e => { if (!e.target.closest('button')) { swipeX = e.clientX; deck.setPointerCapture(e.pointerId); } });
deck.addEventListener('pointerup', e => { if (swipeX !== null && Math.abs(e.clientX - swipeX) > 45) showPhoto(photoIndex + (e.clientX < swipeX ? 1 : -1)); swipeX = null; });
deck.addEventListener('pointercancel', () => { swipeX = null; });
deck.querySelectorAll('img').forEach(img => img.draggable = false);
showPhoto(0);

// Project filtering and horizontal shelf.
const shelf = document.querySelector('.project-shelf');
const tiles = [...shelf.querySelectorAll('.project-tile')];
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  tiles.forEach(tile => tile.hidden = button.dataset.filter !== 'All' && tile.dataset.category !== button.dataset.filter);
  const count = tiles.filter(tile => !tile.hidden).length;
  document.querySelector('#project-count').textContent = `${count} project${count !== 1 ? 's' : ''}`;
  shelf.scrollTo({left:0,behavior:'instant'});
}));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelector('[aria-label="Scroll projects left"]').addEventListener('click',()=>shelf.scrollBy({left:-shelf.clientWidth*.85,behavior:reducedMotion?'instant':'smooth'}));
document.querySelector('[aria-label="Scroll projects right"]').addEventListener('click',()=>shelf.scrollBy({left:shelf.clientWidth*.85,behavior:reducedMotion?'instant':'smooth'}));

// Project details use static local data, with no fabricated live project links.
const dialog = document.querySelector('#project-dialog');
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let projectData;
let dialogTrigger;
const researchGrid=document.querySelector('.research-grid');
researchGrid.insertAdjacentHTML('beforeend',`
  <article><button data-project="gnn-aco-routing"><img src="assets/gnn-aco-route-optimization.png" alt="Route-optimization visualization showing depot-to-customer paths" loading="lazy" decoding="async"><small>Research project</small><h3>GNN–ACO Hybrid for Multi-Depot Vehicle Route Optimization</h3><p>Combining graph learning and swarm intelligence for complex route planning.</p></button></article>
  <article><button data-project="disease-risk-prediction"><img src="assets/medical-disease-risk-prediction.png" alt="Medical disease-risk prediction dashboard showing diabetes and heart-disease insights" loading="lazy" decoding="async"><small>Machine learning project</small><h3>Medical Disease Risk Prediction</h3><p>Exploring predictive models for diabetes and heart-disease risk.</p></button></article>
`);
const researchHeading=document.querySelector('.p-research .p-heading');
researchHeading.innerHTML=`<div class="research-heading-copy"><h2>Case Studies<br><em>&amp; Publications.</em></h2><p>Five explorations across speech AI, connected mobility, mathematical modelling, optimization and healthcare intelligence.</p></div><aside><strong>05</strong><span>Selected works</span><small>Open any card for the full story</small></aside>`;
researchGrid.querySelectorAll('.author').forEach(author=>author.remove());
researchGrid.querySelectorAll('button').forEach(button=>button.insertAdjacentHTML('beforeend','<span class="research-cta">Explore case study <b>↗</b></span>'));
async function openProject(button) {
  dialogTrigger = button;
  try {
    projectData ||= await fetch('project-data.json').then(r => { if (!r.ok) throw new Error('Project data unavailable'); return r.json(); });
    const p = projectData.find(p=>p.id===button.dataset.project);
    if (!p) return;
    const story=(Array.isArray(p.story)&&p.story.length?p.story:[p.detail]).map(paragraph=>`<p>${escapeHTML(paragraph)}</p>`).join('');
    const supporting=p.supportImage?`<figure class="dialog-support"><img src="assets/${escapeHTML(p.supportImage)}" alt="${escapeHTML(p.supportAlt)}"><figcaption>${escapeHTML(p.supportCredit)} · <a href="${escapeHTML(p.supportSource)}" target="_blank" rel="noreferrer">View source ↗</a></figcaption></figure>`:'';
    document.querySelector('#dialog-content').innerHTML = `<header class="dialog-hero"><img class="dialog-image" src="assets/${escapeHTML(p.image)}" alt="${escapeHTML(p.note)}"><div><small>${escapeHTML(p.label)}</small><h2 id="dialog-title">${escapeHTML(p.name)}</h2></div></header><div class="dialog-body"><p class="dialog-summary">${escapeHTML(p.summary)}</p><div class="dialog-story">${story}</div>${supporting}<div class="dialog-footer"><div class="p-tags">${p.tools.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div><a class="small-pill" href="mailto:Bhumikapoor2005@gmail.com?subject=${encodeURIComponent('Tell me more about '+p.name)}">Ask about this work ↗</a></div></div>`;
  } catch {
    document.querySelector('#dialog-content').innerHTML = '<div class="dialog-body"><h2 id="dialog-title">Project details unavailable</h2><p>Please try again or email Bhumi for more information.</p><a href="mailto:Bhumikapoor2005@gmail.com">Email Bhumi ↗</a></div>';
  }
  dialog.showModal(); document.body.style.overflow='hidden';
}
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>openProject(button)));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';dialogTrigger?.focus({preventScroll:true});});

// Draggable photo board; arrow keys offer the same interaction without a pointer.
const board = document.querySelector('.memory-board');
let topPhoto = 5;
const memories = [...board.querySelectorAll('.memory')];
memories.forEach(photo=>{
  let position={x:0,y:0},start=null;
  function move(x,y){
    position.x=Math.max(-photo.offsetLeft+8,Math.min(board.clientWidth-photo.offsetLeft-photo.offsetWidth-8,x));
    position.y=Math.max(-photo.offsetTop+35,Math.min(board.clientHeight-photo.offsetTop-photo.offsetHeight-38,y));
    photo.style.setProperty('--x',position.x+'px');photo.style.setProperty('--y',position.y+'px');
  }
  photo.resetPosition=()=>{position={x:0,y:0};photo.style.removeProperty('--x');photo.style.removeProperty('--y');photo.style.zIndex='';};
  photo.addEventListener('pointerdown',e=>{if(e.button!==0)return;start={x:e.clientX,y:e.clientY,ox:position.x,oy:position.y};photo.style.zIndex=++topPhoto;photo.setPointerCapture(e.pointerId);});
  photo.addEventListener('pointermove',e=>{if(start)move(start.ox+e.clientX-start.x,start.oy+e.clientY-start.y);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>photo.addEventListener(type,()=>start=null));
  photo.addEventListener('keydown',e=>{const delta={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[e.key];if(delta){e.preventDefault();photo.style.zIndex=++topPhoto;move(position.x+delta[0],position.y+delta[1]);}});
  photo.querySelector('img').draggable=false;
});
document.querySelector('#reset-memories').addEventListener('click',()=>memories.forEach(photo=>photo.resetPosition()));
window.addEventListener('resize',()=>memories.forEach(photo=>photo.resetPosition()));

document.querySelector('#contact-form').addEventListener('submit',e=>{
  e.preventDefault();
  const sendButton=e.currentTarget.querySelector('.send-button');
  sendButton.classList.remove('is-sending');
  void sendButton.offsetWidth;
  sendButton.classList.add('is-sending');
  const values=new FormData(e.currentTarget);
  const subject=`Portfolio inquiry — ${values.get('name')}`;
  const body=`Hi Bhumi,\n\n${values.get('message')}\n\n${values.get('name')}\n${values.get('email')}`;
  window.location.href=`mailto:Bhumikapoor2005@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector('#form-status').textContent='Your message is ready in your email app. Review it and press Send there. If no app opened, use the email link beside this form.';
});
const contactFrames=[...document.querySelectorAll('.contact-visual img')];
if(contactFrames.length>1&&!reducedMotion){
  let activeFrame=0;
  window.setInterval(()=>{
    contactFrames[activeFrame].classList.remove('is-active');
    contactFrames[activeFrame].setAttribute('aria-hidden','true');
    activeFrame=(activeFrame+1)%contactFrames.length;
    contactFrames[activeFrame].classList.add('is-active');
    contactFrames[activeFrame].removeAttribute('aria-hidden');
  },2000);
}
document.querySelector('#year').textContent=new Date().getFullYear();
if(!reducedMotion && 'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll('.p-heading,.cert-card,.research-grid article,.awards-grid article').forEach(el=>{el.classList.add('motion-enter');observer.observe(el);});
}
const skillIconSources={
  matplotlib:'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg',
  microsoftexcel:'https://img.icons8.com/color/48/microsoft-excel-2019--v1.png',
  powerbi:'https://img.icons8.com/color/48/power-bi.png',
  tableau:'https://img.icons8.com/color/48/tableau-software.png'
};
document.querySelectorAll('.skill-icon').forEach(icon=>{
  const match=Object.keys(skillIconSources).find(slug=>icon.src.includes(`/${slug}/`));
  if(match) icon.src=skillIconSources[match];
});
const skillsHeadline=document.querySelector('#about>h2');
const skillsHeadlines=['I turn data into<br>real world impact','My tech stack.<br>My skills.'];
if(skillsHeadline&&!reducedMotion){
  let headlineIndex=0;
  skillsHeadline.classList.add('skills-headline');
  window.setInterval(()=>{
    skillsHeadline.classList.add('is-changing');
    window.setTimeout(()=>{
      headlineIndex=(headlineIndex+1)%skillsHeadlines.length;
      skillsHeadline.innerHTML=skillsHeadlines[headlineIndex];
      skillsHeadline.classList.remove('is-changing');
    },260);
  },2000);
}

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
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) window.setInterval(() => showPhoto(photoIndex + 1), 2000);

// Add the owner-supplied Ingen Labs internship to the experience timeline.
const experienceTable = document.querySelector('.experience-table');
const samsungExperience = [...experienceTable.querySelectorAll('.experience-row')].find(row => row.querySelector('strong')?.textContent.trim() === 'Samsung R&D Institute, Bangalore');
if (samsungExperience) samsungExperience.insertAdjacentHTML('afterend', `<details class="experience-row"><summary><strong>Ingen Labs</strong><span>Business Analyst &amp; Marketing Intern</span><time>Jul 2025 — Dec 2025</time><b>＋</b></summary><div class="experience-detail"><p>Supported business analysis and marketing initiatives at Ingen Labs, translating audience and project needs into clear research, outreach and communication plans throughout a six-month internship.</p><small>Business analysis · Marketing · Research · Communication</small></div></details>`);

// Project filtering and horizontal shelf.
const projectCards = [
  { category: 'Startups', project: 'virtual-labs', image: 'virtual-simulation-labs.png', alt: 'Virtual simulation lab setup showing a water-testing apparatus and connected sensor tubes', title: 'Virtual Simulation Labs', description: 'An Ingen Labs concept developed in collaboration with Prabhmannat Singh, founder of V-Labs Software. The work explored how scientific and sensor-style data can become interactive lab simulations, pairing simulation modelling with clear learner-facing workflows for more visual, approachable experimentation.', skills: 'Data analysis · Simulation modelling · Data visualisation · Product research' },
  { category: 'Startups', project: 'drivesense', image: 'drivesense-iit-delhi.jpeg', alt: 'DriveSense team at the Indian Institute of Technology Delhi', title: 'DriveSense', description: 'A mobility startup initiative shaped through a multidisciplinary team and IIT Delhi’s startup ecosystem. DriveSense received first place at TECH FUTURE 4.0 and a ₹6.5 lakh grant, combining problem framing, mobility research and venture planning to move the idea from competition concept toward an incubated startup.', skills: 'Mobility research · Problem framing · Venture strategy · Product development' },
  { category: 'Startups', image: 'ingen-workspace.png', alt: 'Ingen Workspace staffing software homepage for recruiters', title: 'Ingen Workspace', description: 'A proof-first staffing software product developed alongside Prabhmannat Singh and Adhiraj Dogra, founder of Ingen Workspace. The work explored how candidate evidence, recruiting workflows and hiring decisions can be made more legible through practical product thinking and data-informed experiences.', skills: 'Statistical analysis · Data analysis · Recruiting metrics · Data visualisation · Product research', url: 'https://ingenworkspace.com/' },
  { category: 'Startups', image: 'webstell-studio.png', alt: 'Webstell Studio website work showcase', title: 'Webstell Studio', description: 'A digital studio where I contribute as a core team member and Business & Marketing Lead. I help connect client discovery, market research and brand positioning with clear project scopes—shaping websites and digital experiences that answer real business needs.', skills: 'Business analysis · Market research · Go-to-market strategy · Client discovery · Brand positioning', url: 'https://webstell-studio.com/', linkLabel: 'Visit Webstell Studio' },
  { category: 'AI / ML', project: 'speech', image: 'spoken-language-identification.png', alt: 'Recognition certificate presented for spoken language identification work', role: 'AI Research Intern & Team Lead', title: 'Spoken Language Identification', description: 'At Samsung R&D Institute, Bangalore, I contributed to three Samsung PRISM worklets spanning Hindi, Urdu and Punjabi. My role covered speech-data preparation, experiment coordination and evaluation work focused on making language identification more dependable across varied listening conditions.', skills: 'NLP · Speech-data preparation · Feature analysis · Model evaluation' },
  { category: 'AI / ML', project: 'disease-risk-prediction', image: 'medical-risk-software.png', alt: 'Medical risk software dashboard with cardiovascular timeline and health data', role: 'Machine-learning research contributor', title: 'Medical Disease Risk Prediction', description: 'Worked on a health-data modelling study for diabetes and heart-disease risk indicators. The project involved preparing structured inputs, exploring predictive approaches, interpreting evaluation metrics and shaping a responsible dashboard view that supports review rather than diagnosis.', skills: 'Data preprocessing · Feature engineering · Predictive modelling · Evaluation metrics · Data visualisation' },
  { category: 'AI / ML', image: 'ai-copilot.png', alt: 'AI Copilot workflow interface for creating automated steps', title: 'Insight Copilot', description: 'A concept for an AI assistant that turns scattered feedback into searchable themes, priority signals and concise next steps. It is designed around human review—helping teams identify patterns without treating automation as a replacement for judgement.', skills: 'Text analysis · Prompt design · Insight synthesis · Human-in-the-loop UX' },
  { category: 'Products', image: 'student-opportunity-hub.png', alt: 'Student Opportunity Hub dashboard showing a timetable, assignments, grades and quick notes', title: 'Student Opportunity Hub', description: 'A product concept that brings campus events, opportunities, clubs and resources into one personalised starting point. The experience is structured to help students discover what matters, save it for later and move from interest to participation with less friction.', skills: 'Product strategy · User journeys · Information architecture · Interaction design' },
  { category: 'Products', image: 'client-delivery-portal.png', alt: 'Client Delivery Portal dashboard with client metrics, project data and an AI assistant', title: 'Client Delivery Portal', description: 'A client-facing product concept for turning a project brief into a transparent delivery journey. It brings goals, milestones, feedback and approvals into one shared workspace so every stakeholder can see what is happening and what needs attention next.', skills: 'Service design · Workflow mapping · Stakeholder UX · Product requirements' },
  { category: 'Research', project: 'tele', image: 'tele-automobile-system.jpg', alt: 'Connected vehicle communication illustration', title: 'Tele-Automobile System', description: 'Award-winning research exploring a real-time Tele-Automobile System using wireless sensor networks and MATLAB. It examines how connected systems and simulation can answer practical engineering questions.' },
  { category: 'Research', project: 'epi', image: 'epidemiology-modelling.png', alt: 'Mathematical modelling in epidemiology', title: 'Mathematical Modelling in Epidemiology', description: 'A research exploration using mathematical models to study how systems change over time. It connects analytical reasoning with a human-centred view of public-health questions.' },
  { category: 'Research', project: 'gnn-aco-routing', image: 'gnn-aco-route-optimization.png', alt: 'Route optimisation visualization', title: 'GNN–ACO Route Optimisation', description: 'A research project combining graph learning and ant-colony optimisation for complex multi-depot routing. The work explores more adaptive approaches to planning and operational decision-making.' },
  { category: 'Automation', project: 'automation', image: 'operations-automation.png', alt: 'Operations automation interface showing compliance records, key dates and connected workflow cards', title: 'Operations Automation Studio', description: 'A practical automation initiative for mapping repetitive business work and turning it into connected, dependable flows. The interface brings compliance activity, key dates, records and validation steps into one operational view so teams can move from scattered follow-ups to visible progress.', skills: 'Process mapping · Automation design · Requirements analysis · Workflow optimisation' },
  { category: 'Automation', image: 'workflow-automation.png', title: 'Workflow Autopilot', description: 'A workflow-builder concept for connecting prompts, tools, app requests and structured outputs in one visual sequence. The canvas makes branching logic easier to inspect, test and improve while giving teams a clearer path from an idea to a repeatable automation.', skills: 'Systems thinking · Workflow design · API orchestration · Operational analytics' },
  { category: 'Data', image: 'project-insights-dashboard.png', alt: 'Project Insights Dashboard interface showing productivity, project progress, task status and calendar data', title: 'Project Insights Dashboard', description: 'A data-product dashboard concept that translates everyday project activity into a clear operational picture. It brings productivity trends, delivery progress, task status and calendar context together so teams can spot priorities, track momentum and make informed decisions at a glance.', skills: 'Dashboard design · KPI visualisation · Data storytelling · Information hierarchy' },
  { category: 'Data', image: 'patient-intelligence.png', alt: 'Patient Intelligence healthcare dashboard with live heart rhythm, movement, stress and recovery insights', title: 'Patient Intelligence', description: 'A healthcare data dashboard concept that brings live heart-rhythm signals, movement, stress, recovery and sleep indicators into one clinical view. The experience is designed to make personal health patterns easier to interpret while keeping priority states and next actions clearly visible.', skills: 'Health-data visualisation · Clinical dashboard UX · Time-series insights · Information hierarchy' },
  { category: 'Full-stack', image: 'campus-sync.png', alt: 'Campus Sync mobile interface mockup showing event discovery and calendar views', title: 'Campus Sync', description: 'A mobile-first campus-events concept that brings discovery, personalised feeds, reminders and calendar planning into one student-friendly experience. The interface explores clear event details and responsive scheduling flows for clubs, workshops and campus communities.', skills: 'Mobile UX · Event discovery · Calendar flows · Information architecture' },
  { category: 'Full-stack', image: 'team-workspace.png', alt: 'Team Workspace project-management dashboard with task columns, team members and collaboration controls', title: 'Team Workspace', description: 'A full-stack collaboration workspace concept that brings projects, tasks and decisions into one shared view. The dashboard combines clear ownership, scheduling, discussion threads and progress signals so teams can move from planning to delivery with less friction.', skills: 'Dashboard UX · Task management · Collaboration flows · Workflow architecture' }
];
const projectCard = card => `<article class="project-tile" data-category="${card.category}">${card.project ? `<button data-project="${card.project}">` : '<div class="project-tile-content">'}${card.image ? `<img src="assets/${card.image}" alt="${card.alt}" loading="lazy" decoding="async">` : `<div class="project-placeholder" aria-hidden="true">${card.placeholder.replace('\n', '<br>')}</div>`}<h3>${card.title}</h3>${card.role ? `<p class="project-role"><strong>Role:</strong> ${card.role}</p>` : ''}<p>${card.description}</p>${card.skills ? `<p class="project-skills"><strong>Focus areas:</strong> ${card.skills}</p>` : ''}${card.url ? `<a class="project-site" href="${card.url}" target="_blank" rel="noreferrer">${card.linkLabel || 'Visit website'} ↗</a>` : ''}${card.project ? '</button>' : '</div>'}</article>`;
document.querySelector('#all-projects').innerHTML = `<div class="catalog-heading"><div><h2>My projects<span>.</span></h2></div><div class="shelf-controls"><button aria-label="Scroll projects left"><span>←</span></button><button aria-label="Scroll projects right"><span>→</span></button></div></div><div class="project-filters" role="group" aria-label="Filter projects"><button data-filter="All" aria-pressed="true">All</button><button data-filter="Data" aria-pressed="false">Data</button><button data-filter="Full-stack" aria-pressed="false">Full-stack</button><button data-filter="Startups" aria-pressed="false">Startups</button><button data-filter="AI / ML" aria-pressed="false">AI / ML</button><button data-filter="Products" aria-pressed="false">Products</button><button data-filter="Research" aria-pressed="false">Research</button><button data-filter="Automation" aria-pressed="false">Automation</button></div><div class="project-shelf" tabindex="0" aria-label="Project cards">${projectCards.map(projectCard).join('')}</div><p class="shelf-hint">Swipe through the cards—or use the arrows—to explore the work.</p>`;
const shelf = document.querySelector('.project-shelf');
const tiles = [...shelf.querySelectorAll('.project-tile')];
let shelfDrag = null;
let suppressShelfClick = false;
const endShelfDrag = event => {
  if (!shelfDrag || event.pointerId !== shelfDrag.pointerId) return;
  const didDrag = shelfDrag.didDrag;
  shelfDrag = null;
  shelf.classList.remove('is-dragging');
  if (shelf.hasPointerCapture(event.pointerId)) shelf.releasePointerCapture(event.pointerId);
  if (didDrag) {
    suppressShelfClick = true;
    window.setTimeout(() => { suppressShelfClick = false; }, 0);
  }
};
shelf.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  pauseShelfMarquee();
  shelfDrag = { pointerId: event.pointerId, startX: event.clientX, startLeft: shelf.scrollLeft, didDrag: false };
  shelf.setPointerCapture(event.pointerId);
});
shelf.addEventListener('pointermove', event => {
  if (!shelfDrag || event.pointerId !== shelfDrag.pointerId) return;
  const distance = event.clientX - shelfDrag.startX;
  if (Math.abs(distance) > 5) {
    shelfDrag.didDrag = true;
    shelf.classList.add('is-dragging');
    shelf.scrollLeft = shelfDrag.startLeft - distance;
  }
});
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => shelf.addEventListener(type, endShelfDrag));
shelf.addEventListener('click', event => {
  if (!suppressShelfClick) return;
  event.preventDefault();
  event.stopPropagation();
}, true);
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  tiles.forEach(tile => tile.hidden = button.dataset.filter !== 'All' && tile.dataset.category !== button.dataset.filter);
  shelf.scrollTo({left:0,behavior:'instant'});
  resumeShelfMarquee();
}));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let shelfMarqueeDirection = 1;
let shelfMarqueePaused = reducedMotion;
let shelfMarqueeResumeTimer;
let shelfMarqueeLastFrame;
const pauseShelfMarquee = () => {
  shelfMarqueePaused = true;
  window.clearTimeout(shelfMarqueeResumeTimer);
};
const resumeShelfMarquee = () => {
  if (reducedMotion) return;
  window.clearTimeout(shelfMarqueeResumeTimer);
  shelfMarqueeResumeTimer = window.setTimeout(() => {
    shelfMarqueePaused = false;
    shelfMarqueeLastFrame = undefined;
  }, 1600);
};
const moveShelfMarquee = time => {
  if (!shelfMarqueePaused) {
    if (shelfMarqueeLastFrame !== undefined) {
      const maxScroll = shelf.scrollWidth - shelf.clientWidth;
      if (maxScroll > 0) {
        const step = Math.min((time - shelfMarqueeLastFrame) * 0.018, 1.2);
        const next = shelf.scrollLeft + step * shelfMarqueeDirection;
        if (next >= maxScroll || next <= 0) shelfMarqueeDirection *= -1;
        shelf.scrollLeft = Math.max(0, Math.min(maxScroll, next));
      }
    }
    shelfMarqueeLastFrame = time;
  }
  window.requestAnimationFrame(moveShelfMarquee);
};
if (!reducedMotion) {
  window.requestAnimationFrame(moveShelfMarquee);
  shelf.addEventListener('pointerup', resumeShelfMarquee);
  shelf.addEventListener('pointercancel', resumeShelfMarquee);
  shelf.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') pauseShelfMarquee(); });
  shelf.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') resumeShelfMarquee(); });
  shelf.addEventListener('focusin', pauseShelfMarquee);
  shelf.addEventListener('focusout', resumeShelfMarquee);
}
const projectTitle = document.querySelector('#all-projects .catalog-heading h2');
if (projectTitle && !reducedMotion) {
  const projectTitlePhrases = ['My projects', 'Selected work'];
  let projectTitleIndex = 0;
  let projectTitleLength = projectTitlePhrases[0].length;
  let deletingProjectTitle = false;
  const renderProjectTitle = () => {
    const phrase = projectTitlePhrases[projectTitleIndex];
    projectTitle.innerHTML = `${phrase.slice(0, projectTitleLength)}<span>.</span><b class="type-cursor" aria-hidden="true">|</b>`;
  };
  const typeProjectTitle = () => {
    const phrase = projectTitlePhrases[projectTitleIndex];
    renderProjectTitle();
    if (!deletingProjectTitle && projectTitleLength === phrase.length) {
      deletingProjectTitle = true;
      window.setTimeout(typeProjectTitle, 1500);
      return;
    }
    if (deletingProjectTitle && projectTitleLength === 0) {
      deletingProjectTitle = false;
      projectTitleIndex = (projectTitleIndex + 1) % projectTitlePhrases.length;
    } else projectTitleLength += deletingProjectTitle ? -1 : 1;
    window.setTimeout(typeProjectTitle, deletingProjectTitle ? 42 : 76);
  };
  window.setTimeout(typeProjectTitle, 1500);
}
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

// Refresh the achievements message and let it arrive as a short, deliberate typed line.
const achievementsHeading = document.querySelector('#achievements .p-heading > div');
if (achievementsHeading) achievementsHeading.innerHTML = '<h2>Achievements.<br><em>Awards.</em></h2><p class="achievement-intro">A few milestones that reflect curiosity, consistency, and the courage to keep building what matters.</p>';
const achievementIntro = document.querySelector('.achievement-intro');
if (achievementIntro && !reducedMotion) {
  const achievementMessage = achievementIntro.textContent.trim();
  let achievementCharacter = 0;
  achievementIntro.textContent = '';
  achievementIntro.setAttribute('aria-label', achievementMessage);
  const typeAchievementIntro = () => {
    achievementIntro.textContent = achievementMessage.slice(0, achievementCharacter);
    if (achievementCharacter < achievementMessage.length) {
      achievementCharacter += 1;
      window.setTimeout(typeAchievementIntro, 24);
      return;
    }
    achievementIntro.insertAdjacentHTML('beforeend', '<span class="type-cursor" aria-hidden="true">|</span>');
  };
  if ('IntersectionObserver' in window) {
    const achievementObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      achievementObserver.unobserve(entry.target);
      typeAchievementIntro();
    }), { threshold: 0.45 });
    achievementObserver.observe(achievementIntro);
  } else typeAchievementIntro();
}

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
      skillsHeadline.classList.remove('is-revealing');
      void skillsHeadline.offsetWidth;
      skillsHeadline.classList.add('is-revealing');
      window.setTimeout(()=>skillsHeadline.classList.remove('is-revealing'),720);
    },260);
  },2000);
}

// Comet card: pointer-responsive depth, rotating owner-supplied photos and accessible metrics.
const cometCard=document.querySelector('.comet-card');
const cometCardInner=cometCard?.querySelector('.comet-card-inner');
if(cometCard&&cometCardInner&&!reducedMotion){
  cometCard.addEventListener('pointermove',event=>{
    const bounds=cometCard.getBoundingClientRect();
    const x=(event.clientX-bounds.left)/bounds.width-.5;
    const y=(event.clientY-bounds.top)/bounds.height-.5;
    cometCardInner.style.setProperty('--rx',`${-y*17.5}deg`);
    cometCardInner.style.setProperty('--ry',`${x*17.5}deg`);
    cometCardInner.style.setProperty('--tx',`${x*20}px`);
    cometCardInner.style.setProperty('--ty',`${-y*20}px`);
    cometCardInner.style.setProperty('--gx',`${(x+.5)*100}%`);
    cometCardInner.style.setProperty('--gy',`${(y+.5)*100}%`);
  });
  cometCard.addEventListener('pointerleave',()=>{
    ['--rx','--ry','--tx','--ty','--gx','--gy'].forEach(property=>cometCardInner.style.removeProperty(property));
  });
}
const storyFrames=[...document.querySelectorAll('.story-photo-stack img')];
if(storyFrames.length){
  let storyFrame=0;
  storyFrames.forEach((frame,index)=>frame.setAttribute('aria-hidden',String(index!==0)));
  if(!reducedMotion) window.setInterval(()=>{
    storyFrames[storyFrame].classList.remove('is-active');
    storyFrames[storyFrame].setAttribute('aria-hidden','true');
    storyFrame=(storyFrame+1)%storyFrames.length;
    storyFrames[storyFrame].classList.add('is-active');
    storyFrames[storyFrame].setAttribute('aria-hidden','false');
    document.querySelector('#story-photo-count').textContent=`${String(storyFrame+1).padStart(2,'0')} / ${String(storyFrames.length).padStart(2,'0')}`;
  },2000);
}
const counters=[...document.querySelectorAll('[data-count]')];
const setCounterValue=(counter,value)=>{
  const decimals=Number(counter.dataset.decimals||0);
  counter.textContent=`${value.toFixed(decimals)}${counter.dataset.suffix||''}`;
};
const animateCounter=counter=>{
  const target=Number(counter.dataset.count);
  if(reducedMotion){setCounterValue(counter,target);return;}
  const started=performance.now();
  const tick=now=>{
    const progress=Math.min((now-started)/1400,1);
    const eased=1-Math.pow(1-progress,3);
    setCounterValue(counter,target*eased);
    if(progress<1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if('IntersectionObserver' in window){
  const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){animateCounter(entry.target);counterObserver.unobserve(entry.target);}
  }),{threshold:.6});
  counters.forEach(counter=>counterObserver.observe(counter));
}else counters.forEach(animateCounter);

const storyHeadline=document.querySelector('#my-story .story-headline');
const storyHeadlines=['About <span>Us.</span>','I connect people,<br><span>data & ideas.</span>'];
if(storyHeadline&&!reducedMotion){
  let storyHeadlineIndex=0;
  window.setInterval(()=>{
    storyHeadline.classList.add('is-changing');
    window.setTimeout(()=>{
      storyHeadlineIndex=(storyHeadlineIndex+1)%storyHeadlines.length;
      storyHeadline.innerHTML=storyHeadlines[storyHeadlineIndex];
      storyHeadline.classList.remove('is-changing');
      storyHeadline.classList.remove('is-revealing');
      void storyHeadline.offsetWidth;
      storyHeadline.classList.add('is-revealing');
      window.setTimeout(()=>storyHeadline.classList.remove('is-revealing'),560);
    },200);
  },1500);
}

const storyPlaces=[...document.querySelectorAll('.story-place')];
const locationTooltip=document.querySelector('.story-location-tooltip');
if(storyPlaces.length&&locationTooltip){
  const tooltipImage=locationTooltip.querySelector('img');
  const tooltipLabel=locationTooltip.querySelector('span');
  const positionTooltip=(x,y)=>{
    const gap=18;
    const left=Math.max(12,Math.min(x+gap,window.innerWidth-locationTooltip.offsetWidth-12));
    const top=Math.max(12,Math.min(y+gap,window.innerHeight-locationTooltip.offsetHeight-12));
    locationTooltip.style.left=`${left}px`;
    locationTooltip.style.top=`${top}px`;
  };
  const showTooltip=(place,x,y)=>{
    tooltipImage.src=place.dataset.image;
    tooltipLabel.textContent=place.dataset.place;
    locationTooltip.classList.add('is-visible');
    locationTooltip.setAttribute('aria-hidden','false');
    positionTooltip(x,y);
  };
  const hideTooltip=()=>{
    locationTooltip.classList.remove('is-visible');
    locationTooltip.setAttribute('aria-hidden','true');
  };
  storyPlaces.forEach(place=>{
    place.addEventListener('pointerenter',event=>showTooltip(place,event.clientX,event.clientY));
    place.addEventListener('pointermove',event=>positionTooltip(event.clientX,event.clientY));
    place.addEventListener('pointerleave',hideTooltip);
    place.addEventListener('focus',()=>{
      const rect=place.getBoundingClientRect();
      showTooltip(place,rect.left+rect.width/2,rect.bottom);
    });
    place.addEventListener('blur',hideTooltip);
  });
}

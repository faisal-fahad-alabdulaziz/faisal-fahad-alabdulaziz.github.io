'use strict';
const data=JSON.parse(document.querySelector('#site-data').textContent);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dialogs=document.querySelectorAll('dialog');
let lastFocus=null;
function openDialog(dialog){lastFocus=document.activeElement;dialog.showModal();document.body.style.overflow='hidden';}
dialogs.forEach(d=>{d.querySelector('[data-close]').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const b=d.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)d.close();}});d.addEventListener('close',()=>{document.body.style.overflow='';lastFocus?.focus();});});
const projectDialog=document.querySelector('#project-dialog');
const escapeHTML=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.project),p=data.projects[i];const demo=document.querySelector(`.project-card[data-project="${i}"] .demo-screen`).outerHTML;document.querySelector('#project-content').innerHTML=`<span class="tag">${escapeHTML(p[1])}</span><h2>${escapeHTML(p[0])}</h2><p>${escapeHTML(p[2])}</p>${demo}<p class="dialog-note">${escapeHTML(data.illustration)}</p>`+[[data.problem,p[3]],[data.action,p[4]],[data.result,p[5]]].map(([t,v])=>`<section class="dialog-section"><h3>${escapeHTML(t)}</h3><p>${escapeHTML(v)}</p></section>`).join('')+`<p class="dialog-note">${escapeHTML(data.pnote)}</p>`;openDialog(projectDialog);}));
const hero=document.querySelector('.hero-art');
if(hero&&!reduced){hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--ry',`${(e.clientX-r.left-r.width/2)/40}deg`);hero.style.setProperty('--rx',`${-(e.clientY-r.top-r.height/2)/40}deg`);});hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--ry','0deg');hero.style.setProperty('--rx','0deg');});}
if(!reduced&&'IntersectionObserver'in window){const o=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('reveal');o.unobserve(e.target);}},{threshold:.1});document.querySelectorAll('.project-card,.capability,.experience,.info-box').forEach(e=>o.observe(e));}
const messages=data.lang==='ar'?['أهلًا، أنا فيصل. استكشف أعمالي ومسيرتي.','أبدأ بفهم المشكلة وتحليل التفاصيل.','أحوّل الفكرة إلى خطوات وحلول عملية.']:['Hi, I’m Faisal. Explore my work and journey.','I start by understanding the problem and its details.','I turn ideas into practical steps and solutions.'];
document.querySelectorAll('[data-state]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#character-message').textContent=messages[Number(b.dataset.state)];document.querySelectorAll('[data-state]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
document.querySelector('[data-print]')?.addEventListener('click',()=>window.print());
const shareDialog=document.querySelector('#share-dialog');
const base=new URL('./',location.href);
const portfolioURL=new URL(`${data.lang}.html`,base).href;
const host=location.hostname;
const isPublished=location.protocol==='https:'&&!/(localhost|127\.0\.0\.1|\.local$|preview|chatgpt-team\.site$)/i.test(host);
let qrImageURL=null;
document.querySelectorAll('[data-share]').forEach(b=>b.addEventListener('click',()=>{const status=document.querySelector('#share-status'),input=document.querySelector('#share-url'),qrbox=document.querySelector('#qr-container');input.value=isPublished?portfolioURL:'';input.hidden=!isPublished;status.textContent=isPublished?'':data.unpublished;document.querySelector('#copy-link').disabled=!isPublished;document.querySelector('#download-qr').disabled=!isPublished;document.querySelector('#native-share').hidden=!isPublished||!navigator.share;qrbox.replaceChildren();if(isPublished){const qr=qrcode(0,'M');qr.addData(portfolioURL);qr.make();qrImageURL=qr.createDataURL(8,32);const img=new Image();img.src=qrImageURL;img.alt=data.lang==='ar'?'رمز يفتح ملف أعمال فيصل':'QR code for Faisal’s portfolio';qrbox.append(img);}openDialog(shareDialog);}));
document.querySelector('#copy-link').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(portfolioURL);document.querySelector('#share-status').textContent=data.copied;}catch{const input=document.querySelector('#share-url');input.focus();input.select();document.querySelector('#share-status').textContent=data.copyfail;}});
document.querySelector('#native-share').addEventListener('click',async()=>{try{await navigator.share({title:'Faisal Alabdulaziz',url:portfolioURL});}catch(e){if(e.name!=='AbortError')document.querySelector('#share-status').textContent=data.copyfail;}});

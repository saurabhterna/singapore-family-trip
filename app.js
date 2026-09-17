'use strict';
// Only restricted Google Drive links belong here. Never add ticket bytes,
// passport/visa numbers, booking codes, contact details or local file paths.
// Verify Drive's General access is Restricted before adding any URL.
const documents = [
  { title:'Flight tickets', note:'Outbound and return tickets for all travellers.', url:null },
  { title:'Singapore e-visas', note:'E-visas will stay in restricted Google Drive storage, not on this website.', url:null },
  { title:'Attraction tickets', note:'Zoo, Bird Paradise and other booked activities. Keep QR codes private.', url:null },
  { title:'SG Arrival Cards', note:'Acknowledgements for all three travellers. These are not visas.', url:null },
  { title:'Hotel confirmation', note:'Your accommodation booking and any updated confirmation.', url:null },
  { title:'Travel insurance', note:'Policy and emergency assistance details, available only to authorised viewers.', url:null }
];
function isDriveUrl(value) {
  try { const u=new URL(value);return u.protocol==='https:'&&u.hostname==='drive.google.com'&&!u.username&&!u.password; } catch { return false; }
}
const grid=document.querySelector('#doc-grid');
for(const doc of documents){
  const card=document.createElement('article');card.className='doc';
  const icon=document.createElement('span');icon.className='file-icon';icon.textContent='↳ PRIVATE DOCUMENT';
  const title=document.createElement('h3');title.textContent=doc.title;
  const note=document.createElement('p');note.textContent=doc.note;
  card.append(icon,title,note);
  if(doc.url&&isDriveUrl(doc.url)){
    const actions=document.createElement('div');actions.className='doc-actions';
    const view=document.createElement('a');view.href=doc.url;view.textContent='Open in Google Drive ↗';view.target='_blank';view.rel='noopener noreferrer';
    actions.append(view);card.append(actions);
  }else{const pending=document.createElement('span');pending.className='pending';pending.textContent='Restricted Drive link not connected yet';card.append(pending);}
  grid.append(card);
}
if(documents.every(d=>d.url&&isDriveUrl(d.url)))document.querySelector('#doc-status').textContent='FILES IN RESTRICTED DRIVE';
document.querySelectorAll('[data-check]').forEach(input=>{try{input.checked=localStorage.getItem('sg-trip-'+input.dataset.check)==='yes';}catch{}input.addEventListener('change',()=>{try{localStorage.setItem('sg-trip-'+input.dataset.check,input.checked?'yes':'no');}catch{}});});
document.querySelectorAll('[data-future]').forEach(button=>button.addEventListener('click',()=>{const notice=document.querySelector('#notice');notice.hidden=false;notice.textContent=button.dataset.future+' will be added after we plan it together. Days 0 and 1 are ready.';}));
document.querySelectorAll('[data-map-to], [data-map-place]').forEach(link=>{
  const p=new URLSearchParams({api:'1'});
  if(link.dataset.mapPlace){p.set('query',link.dataset.mapPlace);link.href='https://www.google.com/maps/search/?'+p;}
  else{p.set('origin',link.dataset.mapFrom);p.set('destination',link.dataset.mapTo);p.set('travelmode',link.dataset.mapMode||'walking');if(link.dataset.mapVia)p.set('waypoints',link.dataset.mapVia);link.href='https://www.google.com/maps/dir/?'+p;}
  link.target='_blank';link.rel='noopener noreferrer';
});
function showDay(id){
  if(!['day0','day1'].includes(id))return;
  document.querySelectorAll('.day-content').forEach(el=>{el.hidden=el.id!==id;});
  document.querySelectorAll('[data-day]').forEach(el=>{const active=el.dataset.day===id;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  document.querySelector('#notice').hidden=true;
}
document.querySelectorAll('[data-day]').forEach(link=>link.addEventListener('click',()=>showDay(link.dataset.day)));
window.addEventListener('hashchange',()=>showDay(location.hash.slice(1)));
showDay(location.hash==='#day0'?'day0':'day1');
document.querySelector('#print').addEventListener('click',()=>window.print());

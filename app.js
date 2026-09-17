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
document.querySelectorAll('[data-map-to], [data-map-place]').forEach(link=>{
  const p=new URLSearchParams({api:'1'});
  if(link.dataset.mapPlace){p.set('query',link.dataset.mapPlace);link.href='https://www.google.com/maps/search/?'+p;}
  else{p.set('origin',link.dataset.mapFrom);p.set('destination',link.dataset.mapTo);p.set('travelmode',link.dataset.mapMode||'walking');if(link.dataset.mapVia)p.set('waypoints',link.dataset.mapVia);link.href='https://www.google.com/maps/dir/?'+p;}
  link.target='_blank';link.rel='noopener noreferrer';
});
// Reuse each detailed itinerary's links in its all-maps directory.
['day2','day3','day4','day5','day6'].forEach(day=>{
  document.querySelectorAll('#'+day+' [data-map-to], #'+day+' [data-map-place]').forEach((link,index)=>{
    const copy=link.cloneNode(true);copy.className='';
    copy.textContent=String(index+1).padStart(2,'0')+' · '+link.textContent;
    document.querySelector('#'+day+'-map-directory').append(copy);
  });
});
// Keep the map directory in sync with the selected evening, reusing verified links.
const originalMaps=document.querySelector('#day1-maps .map-directory');
originalMaps.id='maps-merlion';
const alternativeMaps=document.createElement('div');
alternativeMaps.id='maps-playground';alternativeMaps.className='map-directory';alternativeMaps.hidden=true;
const alternativeLinks=[...Array.from(originalMaps.children).slice(0,3),...document.querySelectorAll('#route-playground [data-map-to], #route-playground [data-map-place]')];
alternativeLinks.forEach((link,index)=>{
  const copy=link.cloneNode(true);copy.className='';
  copy.textContent=String(index+1).padStart(2,'0')+' · '+link.textContent.replace(/^\d+ · /,'');
  alternativeMaps.append(copy);
});
originalMaps.after(alternativeMaps);
const mapRouteLabel=document.createElement('p');mapRouteLabel.className='small-note';mapRouteLabel.id='map-route-label';
originalMaps.before(mapRouteLabel);
function showEvening(route){
  if(!['merlion','playground'].includes(route))return;
  document.querySelectorAll('[data-evening]').forEach(button=>{
    const selected=button.dataset.evening===route;
    button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;
    document.querySelector('#route-'+button.dataset.evening).hidden=!selected;
    document.querySelector('#maps-'+button.dataset.evening).hidden=!selected;
  });
  mapRouteLabel.textContent='Showing airport, hotel and '+(route==='playground'?'Playground first':'Merlion first')+' route links.';
}
function showDay(id){
  if(!['day0','day1','day2','day3','day4','day5','day6'].includes(id))return;
  document.querySelectorAll('.day-content').forEach(el=>{el.hidden=el.id!==id;});
  document.querySelectorAll('[data-day]').forEach(el=>{const active=el.dataset.day===id;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  document.querySelector('#notice').hidden=true;
}
document.querySelectorAll('[data-day]').forEach(link=>link.addEventListener('click',()=>showDay(link.dataset.day)));
function followHash(){
  const id=location.hash.slice(1);
  if(id==='day1-playground'||id==='day1-merlion'){
    showDay('day1');showEvening(id.slice(5));
    document.querySelector('#evening-plan').scrollIntoView({block:'start'});
  }else if(id==='easy-evening'){
    showDay('day1');showEvening('merlion');document.querySelector('#easy-evening').scrollIntoView({block:'start'});
  }else{
    const target=document.getElementById(id);
    const day=target?.closest('.day-content');
    if(day){showDay(day.id);if(target!==day)target.scrollIntoView({block:'start'});}else showDay(id);
  }
}
const eveningTabs=Array.from(document.querySelectorAll('[data-evening]'));
eveningTabs.forEach((button,index)=>{
  button.addEventListener('click',()=>{
    showEvening(button.dataset.evening);location.hash='day1-'+button.dataset.evening;
  });
  button.addEventListener('keydown',event=>{
    let next;
    if(event.key==='ArrowRight')next=(index+1)%eveningTabs.length;
    else if(event.key==='ArrowLeft')next=(index+eveningTabs.length-1)%eveningTabs.length;
    else if(event.key==='Home')next=0;else if(event.key==='End')next=eveningTabs.length-1;else return;
    event.preventDefault();eveningTabs[next].focus();eveningTabs[next].click();
  });
});
window.addEventListener('hashchange',followHash);
showEvening('merlion');showDay(location.hash==='#day0'?'day0':'day1');followHash();
document.querySelector('#print').addEventListener('click',()=>window.print());

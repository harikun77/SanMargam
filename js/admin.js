
let model=null;
const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
async function fetchModel(){ const r=await fetch('content.json',{cache:'no-store'}); if(!r.ok) throw new Error('content.json missing'); return await r.json(); }
function setByPath(obj,path,val){ const parts=path.split('.'); let ref=obj; for(let i=0;i<parts.length-1;i++){ if(!(parts[i] in ref)) ref[parts[i]]={}; ref=ref[parts[i]]; } ref[parts[parts.length-1]]=val; }
function getByPath(obj,path){ return path.split('.').reduce((o,k)=>o?o[k]:undefined,obj); }
function input(id,label,val='',type='text'){ return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${type}" value="${val?String(val).replace(/"/g,'&quot;'):''}"></div>`; }
function area(id,label,val=''){ return `<div class="field"><label for="${id}">${label}</label><textarea id="${id}">${val?String(val).replace(/</g,'&lt;'):''}</textarea></div>`; }
function blockList(id,label,arr=[]){ return `<div class="field repeaters" data-id="${id}"><label>${label}</label><div class="items">${arr.map(x=>`<div class="item"><input value="${String(x).replace(/"/g,'&quot;')}"/><div class="row"><button class="btn-outline remove">Remove</button></div></div>`).join('')}</div><div class="row"><button class="btn-outline add">Add</button></div></div>`; }
function kv(id,label,rows=[]){ return `<div class="field repeaters" data-id="${id}"><label>${label}</label><div class="items">${rows.map(x=>`<div class="item row"><input placeholder="Label" value="${String(x.label||'').replace(/"/g,'&quot;')}"/><input placeholder="Value" value="${String(x.value||'').replace(/"/g,'&quot;')}"/><button class="btn-outline remove">Remove</button></div>`).join('')}</div><div class="row"><button class="btn-outline add">Add</button></div></div>`; }
function dancersBlock(listData=[]){ return `<div class="field repeaters" data-id="dancers"><label>Dancers</label><div class="items">${listData.map(d=>`<div class="item"><div class="row"><input placeholder="Name" value="${String(d.name||'').replace(/"/g,'&quot;')}"/><input placeholder="Photo path" value="${String(d.photo||'').replace(/"/g,'&quot;')}"/></div><div class="field"><label>Short Bio</label><textarea>${String(d.bioShort||'').replace(/</g,'&lt;')}</textarea></div><div class="row"><button class="btn-outline remove">Remove</button></div></div>`).join('')}</div><div class="row"><button class="btn-outline add">Add Dancer</button></div></div>`; }

function renderSection(hash){
  const el=$('#editor'); const s=model.site, h=model.home, u=model.uskids4water;
  if(hash==='#site'){
    el.innerHTML=`
      <h2>Site</h2>
      ${input('site.title','Browser Tab Title', s.title||'')}
      ${input('site.brand','Brand/Wordmark', s.brand||'')}
      <div class="row">${input('site.rsvpUrl','RSVP URL', s.rsvpUrl||'','url')}${input('site.donateUrl','Donate URL', s.donateUrl||'','url')}</div>
      ${input('site.donateQR','Donate QR Image Path', s.donateQR||'')}
      <div class="row">${input('site.venue','Venue', s.venue||'')}${input('site.address','Address', s.address||'')}</div>
      <div class="row">${input('site.date','Date', s.date||'')}${input('site.time','Time', s.time||'')}</div>
      ${input('site.directionsUrl','Directions URL', s.directionsUrl||'','url')}
      <div class="row">${input('site.logos.uskids','USKids4Water Logo Path', s.logos?.uskids||'')}${input('site.logos.sanmargam','Sanmargam Logo Path', s.logos?.sanmargam||'')}</div>`;
  }
  if(hash==='#home'){
    el.innerHTML=`
      <h2>Home</h2>
      ${input('home.hero.title','Hero Title', h.hero?.title||'')}
      ${area('home.hero.subtitle','Hero Subtitle', h.hero?.subtitle||'')}
      ${input('home.hero.background','Hero Background Path', h.hero?.background||'')}
      ${area('home.about','About (paragraph)', h.about||'')}
      ${input('home.goal','Fundraising Goal', h.goal||'')}
      ${blockList('fundsHelp','How funds help', h.fundsHelp||[])}
      ${blockList('posters','Posters (image paths)', h.posters||[])}
      ${kv('stats','Impact Stats', h.stats||[])}
      ${input('home.dancersTrioImage','Dancers Trio Image Path', h.dancersTrioImage||'')}
      ${input('home.dancersTrioCaption','Dancers Trio Caption', h.dancersTrioCaption||'')}`;
  }
  if(hash==='#uskids4water'){
    el.innerHTML=`
      <h2>USKids4Water</h2>
      ${area('uskids4water.mission','Mission', u.mission||'')}
      ${kv('uskids-stats','Stats', u.stats||[])}
      ${area('uskids4water.pillars.education','Education Pillar', u.pillars?.education||'')}
      ${area('uskids4water.pillars.environment','Environment Pillar', u.pillars?.environment||'')}
      ${area('uskids4water.pillars.health','Health Pillar', u.pillars?.health||'')}
      ${input('uskids4water.summitImage','Summit Image Path', u.summitImage||'')}
      ${input('uskids4water.ein','EIN', u.ein||'')}`;
  }
  if(hash==='#program'){
    el.innerHTML=`<h2>Program</h2>${area('program.message','Program Message', model.program?.message||'')}${input('site.date','Event Date', model.site?.date||'')}${input('site.time','Event Time', model.site?.time||'')}`;
  }
  if(hash==='#dancers'){
    el.innerHTML=`<h2>Dancers</h2>${dancersBlock(model.dancers||[])}`;
  }

  // Activate nav
  $$('.list-nav a').forEach(a=>a.classList.toggle('active', a.getAttribute('href')===hash));

  // Input binding
  el.addEventListener('input', e=>{ const id=e.target.id; if(!id) return; setByPath(model,id,e.target.value); $('#status').textContent='Edited (not saved)'; });
  // Repeaters
  el.addEventListener('click', e=>{
    if(e.target.classList.contains('add')){
      const f=e.target.closest('.repeaters'); const id=f.dataset.id;
      const items = id==='fundsHelp' || id==='posters' ? (getByPath(model,id)||[]) : (id==='stats'||id==='uskids-stats'? (getByPath(model,id)||[]) : []);
      if(id==='fundsHelp' || id==='posters'){ items.push(''); setByPath(model,id,items); }
      if(id==='stats' || id==='uskids-stats'){ items.push({label:'',value:''}); setByPath(model,id,items); }
      renderSection(hash);
    }
    if(e.target.classList.contains('remove')){
      const row=e.target.closest('.item'); const f=e.target.closest('.repeaters'); const id=f.dataset.id; row.remove();
      if(id==='fundsHelp' || id==='posters'){ const items=[...f.querySelectorAll('.item input')].map(i=>i.value); setByPath(model,id,items); }
      if(id==='stats' || id==='uskids-stats'){ const rows=[...f.querySelectorAll('.item')].map(r=>{const [l,v]=r.querySelectorAll('input'); return {label:l.value, value:v.value};}); setByPath(model,id,rows); }
    }
  });
}

function validateModel(){ const req=['site.title','site.rsvpUrl','site.donateUrl','site.venue','site.address','site.date','site.time','home.hero.title','home.hero.background']; const missing=req.filter(k=>!k.split('.').reduce((o,c)=>o?o[c]:undefined,model)); return missing; }

async function init(){
  model = await fetchModel(); renderSection('#site');
  $$('.list-nav a').forEach(a=> a.addEventListener('click', e=>{ e.preventDefault(); renderSection(a.getAttribute('href')); }));
  $('#reset-btn').addEventListener('click', async ()=>{ if(!confirm('Reload from site? Unsaved changes will be lost.')) return; model=await fetchModel(); renderSection('#site'); $('#status').textContent='Reloaded'; });
  $('#load-btn').addEventListener('click', ()=> $('#file-input').click());
  $('#file-input').addEventListener('change', async e=>{ const f=e.target.files[0]; if(!f) return; const txt=await f.text(); try{ model=JSON.parse(txt); renderSection('#site'); $('#status').textContent='Loaded from file'; }catch(err){ alert('Invalid JSON'); } });
  function download(){ const blob=new Blob([JSON.stringify(model,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='content.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); $('#status').textContent='Downloaded content.json'; }
  $('#download-btn').addEventListener('click', e=>{ e.preventDefault(); download(); });
  $('#download-btn-bottom').addEventListener('click', download);
  $('#validate-btn').addEventListener('click', ()=>{ const m=validateModel(); $('#status').textContent = m.length ? ('Missing: '+m.join(', ')) : 'Looks good ✓'; });
}
init();

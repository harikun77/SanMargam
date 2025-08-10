
// Admin editor logic (vanilla JS)
let model = null;

// Simple helpers
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

async function fetchModel() {
  const res = await fetch('content.json', {cache: 'no-store'});
  if(!res.ok) throw new Error('Failed to fetch content.json');
  return await res.json();
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

function inputField(id, label, value='', type='text', placeholder='') {
  return `
  <div class="field">
    <label for="${id}">${label}</label>
    <input type="${type}" id="${id}" value="${value !== undefined ? String(value).replace(/"/g,'&quot;') : ''}" placeholder="${placeholder.replace(/"/g,'&quot;')}"/>
  </div>`;
}

function textArea(id, label, value='') {
  return `
  <div class="field">
    <label for="${id}">${label}</label>
    <textarea id="${id}">${value !== undefined ? String(value).replace(/</g,'&lt;') : ''}</textarea>
  </div>`;
}

function listEditor(id, label, items=[]) {
  return `
  <div class="field repeaters" data-id="${id}">
    <label>${label}</label>
    <div class="items">
      ${items.map((it,i)=>`
        <div class="item row">
          <input type="text" value="${String(it).replace(/"/g,'&quot;')}" />
          <button class="btn-outline danger remove">Remove</button>
        </div>`).join('')}
    </div>
    <div class="row">
      <button class="btn-outline add">Add</button>
    </div>
  </div>`;
}

function kvEditor(id, label, items=[]) {
  return `
  <div class="field repeaters" data-id="${id}">
    <label>${label}</label>
    <div class="items">
      ${items.map((it,i)=>`
        <div class="item row">
          <input type="text" placeholder="Label" value="${String(it.label||'').replace(/"/g,'&quot;')}" />
          <input type="text" placeholder="Value" value="${String(it.value||'').replace(/"/g,'&quot;')}" />
          <button class="btn-outline danger remove">Remove</button>
        </div>`).join('')}
    </div>
    <div class="row">
      <button class="btn-outline add">Add</button>
    </div>
  </div>`;
}

function dancerEditor(dancers=[]) {
  return `
  <div class="field repeaters" data-id="dancers">
    <label>Dancers</label>
    <div class="items">
      ${dancers.map(d=>`
        <div class="item">
          <div class="row">
            <input type="text" placeholder="Name" value="${String(d.name||'').replace(/"/g,'&quot;')}"/>
            <input type="text" placeholder="Photo path" value="${String(d.photo||'').replace(/"/g,'&quot;')}"/>
          </div>
          <div class="field">
            <label>Short Bio</label>
            <textarea>${String(d.bioShort||'').replace(/</g,'&lt;')}</textarea>
          </div>
          <div class="row">
            <button class="btn-outline danger remove">Remove</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="row">
      <button class="btn-outline add">Add Dancer</button>
    </div>
  </div>`;
}

function bindRepeaters(root, getter, setter) {
  root.addEventListener('click', (e)=>{
    if(e.target.classList.contains('add')){
      const field = e.target.closest('.repeaters');
      const id = field.dataset.id;
      const items = getter(id);
      const itemsDiv = field.querySelector('.items');
      if(id === 'dancers'){
        items.push({name:'', photo:'', bioShort:''});
        itemsDiv.insertAdjacentHTML('beforeend', `
          <div class="item">
            <div class="row">
              <input type="text" placeholder="Name"/>
              <input type="text" placeholder="Photo path"/>
            </div>
            <div class="field">
              <label>Short Bio</label>
              <textarea></textarea>
            </div>
            <div class="row"><button class="btn-outline danger remove">Remove</button></div>
          </div>`);
      } else if (id === 'fundsHelp' || id === 'posters') {
        items.push('');
        itemsDiv.insertAdjacentHTML('beforeend', `
          <div class="item row">
            <input type="text" />
            <button class="btn-outline danger remove">Remove</button>
          </div>`);
      } else if (id === 'stats' || id === 'uskids-stats') {
        items.push({label:'', value:''});
        itemsDiv.insertAdjacentHTML('beforeend', `
          <div class="item row">
            <input type="text" placeholder="Label"/>
            <input type="text" placeholder="Value"/>
            <button class="btn-outline danger remove">Remove</button>
          </div>`);
      }
      setter(id, items);
    }
    if(e.target.classList.contains('remove')){
      e.preventDefault();
      const item = e.target.closest('.item');
      const field = e.target.closest('.repeaters');
      const id = field.dataset.id;
      item.remove();
      // recompute items from DOM
      if(id === 'dancers'){
        const items = [...field.querySelectorAll('.item')].map(div=>{
          const [name, photo] = div.querySelectorAll('input');
          const bio = div.querySelector('textarea');
          return {name:name.value, photo:photo.value, bioShort:bio.value};
        });
        setter(id, items);
      } else if (id === 'fundsHelp' || id === 'posters') {
        const items = [...field.querySelectorAll('input')].map(inp=>inp.value);
        setter(id, items);
      } else if (id === 'stats' || id === 'uskids-stats') {
        const rows = [...field.querySelectorAll('.item')].map(r=>{
          const [label, value] = r.querySelectorAll('input');
          return {label:label.value, value:value.value};
        });
        if (id === 'stats') setter(id, rows);
        else setter('uskids-stats', rows);
      }
    }
  });

  root.addEventListener('input', (e)=>{
    const field = e.target.closest('.repeaters');
    if(!field) return;
    const id = field.dataset.id;
    if(id === 'dancers'){
      const items = [...field.querySelectorAll('.item')].map(div=>{
        const [name, photo] = div.querySelectorAll('input');
        const bio = div.querySelector('textarea');
        return {name:name.value, photo:photo.value, bioShort:bio.value};
      });
      setter(id, items);
    } else if (id === 'fundsHelp' || id === 'posters') {
      const items = [...field.querySelectorAll('input')].map(inp=>inp.value);
      setter(id, items);
    } else if (id === 'stats' || id === 'uskids-stats') {
      const rows = [...field.querySelectorAll('.item')].map(r=>{
        const [label, value] = r.querySelectorAll('input');
        return {label:label.value, value:value.value};
      });
      if (id === 'stats') setter(id, rows);
      else setter('uskids-stats', rows);
    }
  });
}

function renderSection(hash){
  const el = document.getElementById('editor');
  const s = model.site, h = model.home, u = model.uskids4water;
  if(hash === '#site'){
    el.innerHTML = `
      <h2>Site</h2>
      <div class="row">
        ${inputField('site.brand','Brand Name', s.brand)}
        ${inputField('site.date','Event Date', model.site.date)}
        ${inputField('site.time','Event Time', model.site.time)}
      </div>
      <div class="row">
        ${inputField('site.venue','Venue', s.venue)}
        ${inputField('site.address','Address', s.address)}
      </div>
      <div class="row">
        ${inputField('site.rsvpUrl','RSVP URL', s.rsvpUrl, 'url')}
        ${inputField('site.directionsUrl','Directions URL', s.directionsUrl, 'url')}
      </div>
      <div class="row">
        ${inputField('site.donateUrl','Donate URL', s.donateUrl, 'url')}
      </div>
      <div class="row">
        ${inputField('site.logos.uskids','USKids4Water Logo Path', s.logos.uskids)}
        ${inputField('site.logos.sanmargam','Sanmargam Logo Path', s.logos.sanmargam)}
      </div>
      <p class="smallhint">Logos should be committed to <code>assets/</code> and paths updated here.</p>
    `;
  }
  if(hash === '#home'){
    el.innerHTML = `
      <h2>Home</h2>
      ${inputField('home.hero.title','Hero Title', h.hero.title)}
      ${textArea('home.hero.subtitle','Hero Subtitle', h.hero.subtitle)}
      ${inputField('home.hero.background','Hero Background Image', h.hero.background)}
      ${textArea('home.about','About (paragraph)', h.about)}
      ${inputField('home.goal','Fundraising Goal', h.goal)}
      ${listEditor('fundsHelp','How funds help', h.fundsHelp)}
      ${listEditor('posters','Posters (2 image paths)', h.posters)}
      ${kvEditor('stats','Impact Stats', h.stats)}
    `;
    bindRepeaters(el, (id)=>{
      if(id==='fundsHelp') return model.home.fundsHelp;
      if(id==='posters') return model.home.posters;
      if(id==='stats') return model.home.stats;
      return [];
    }, (id, items)=>{
      if(id==='fundsHelp') model.home.fundsHelp = items;
      if(id==='posters') model.home.posters = items;
      if(id==='stats') model.home.stats = items;
    });
  }
  if(hash === '#uskids4water'){
    el.innerHTML = `
      <h2>USKids4Water</h2>
      ${textArea('uskids4water.mission','Mission', u.mission)}
      ${kvEditor('uskids-stats','Stats', u.stats)}
      <div class="row">
        ${textArea('uskids4water.pillars.education','Education Pillar', u.pillars.education)}
        ${textArea('uskids4water.pillars.environment','Environment Pillar', u.pillars.environment)}
        ${textArea('uskids4water.pillars.health','Health Pillar', u.pillars.health)}
      </div>
      ${inputField('uskids4water.summitImage','Summit Image Path', u.summitImage)}
      ${inputField('uskids4water.ein','EIN', u.ein)}
    `;
    bindRepeaters(el, (id)=>{
      if(id==='uskids-stats') return model.uskids4water.stats;
      return [];
    }, (id, items)=>{
      if(id==='uskids-stats') model.uskids4water.stats = items;
    });
  }
  if(hash === '#program'){
    el.innerHTML = `
      <h2>Program</h2>
      ${textArea('program.message','Program Message', model.program.message)}
      <div class="row">
        ${inputField('site.date','Event Date', model.site.date)}
        ${inputField('site.time','Event Time', model.site.time)}
      </div>
    `;
  }
  if(hash === '#dancers'){
    el.innerHTML = `
      <h2>Dancers</h2>
      ${dancerEditor(model.dancers)}
    `;
    bindRepeaters(el, (id)=> model.dancers, (id, items)=> model.dancers = items);
  }

  // Activate nav link
  $$('.list-nav a').forEach(a=>a.classList.toggle('active', a.getAttribute('href')===hash));
}

function setByPath(obj, path, value){
  const parts = path.split('.');
  let ref = obj;
  for(let i=0;i<parts.length-1;i++){
    if(!(parts[i] in ref)) ref[parts[i]] = {};
    ref = ref[parts[i]];
  }
  ref[parts[parts.length-1]] = value;
}

function bindInputs(){
  $('#editor').addEventListener('input', (e)=>{
    const id = e.target.id;
    if(!id) return;
    const val = e.target.value;
    setByPath(model, id, val);
    $('#status').textContent = 'Edited (not saved)';
  });
}

function validateModel(){
  const required = [
    'site.brand','site.rsvpUrl','site.donateUrl','site.venue','site.address','site.date','site.time',
    'home.hero.title','home.hero.background','uskids4water.ein'
  ];
  const missing = [];
  function getByPath(obj, path){
    return path.split('.').reduce((o,k)=> (o? o[k]: undefined), obj);
  }
  for(const p of required){
    if(!getByPath(model,p)) missing.push(p);
  }
  return missing;
}

async function init(){
  model = await fetchModel();
  renderSection('#site');
  bindInputs();

  // Nav
  $$('.list-nav a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      renderSection(a.getAttribute('href'));
    });
  });

  // Reset
  $('#reset-btn').addEventListener('click', async ()=>{
    if(!confirm('Reload content.json from the site? Unsaved changes will be lost.')) return;
    model = await fetchModel();
    renderSection('#site');
    $('#status').textContent = 'Reloaded';
  });

  // Load from file
  $('#load-btn').addEventListener('click', ()=> $('#file-input').click());
  $('#file-input').addEventListener('change', async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const txt = await f.text();
    try{
      model = JSON.parse(txt);
      renderSection('#site');
      $('#status').textContent = 'Loaded from file';
    }catch(err){
      alert('Invalid JSON file.');
    }
  });

  // Download
  function doDownload(){
    const missing = validateModel();
    if(missing.length){
      if(!confirm('Some recommended fields are empty:\\n' + missing.join('\\n') + '\\nContinue download?')) return;
    }
    downloadJson('content.json', model);
    $('#status').textContent = 'Downloaded content.json';
  }
  $('#download-btn').addEventListener('click', (e)=>{ e.preventDefault(); doDownload(); });
  $('#download-btn-bottom').addEventListener('click', doDownload);
  $('#validate-btn').addEventListener('click', ()=>{
    const missing = validateModel();
    $('#status').textContent = missing.length ? ('Missing: ' + missing.join(', ')) : 'Looks good ✓';
  });
}

init();

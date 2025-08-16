
async function loadContent(){
  // local preview override
  let data = null;
  try{ const override = localStorage.getItem('contentOverride'); if(override) data = JSON.parse(override);}catch(e){}
  if(!data){ 
    console.log('Fetching content.json...'); // Debug log
    const res = await fetch('content.json?ts=' + Date.now(), {cache:'no-store'}); 
    data = await res.json(); 
    console.log('Content loaded:', data); // Debug log
  }
  if(data?.site?.title) document.title = data.site.title;

  const uskidsLogo = document.getElementById('logo-uskids');
  const sanmargamLogo = document.getElementById('logo-sanmargam');
  const brandName = document.getElementById('brand-name');
  const rsvpLink = document.getElementById('rsvp-link');
  const donateLink = document.getElementById('donate-link');
  const donateFooter = document.getElementById('donate-link-footer');
  if(uskidsLogo) uskidsLogo.src = data.site.logos.uskids;
  if(sanmargamLogo) sanmargamLogo.src = data.site.logos.sanmargam;
  if(brandName) brandName.textContent = data.site.brand;
  if(rsvpLink) rsvpLink.href = data.site.rsvpUrl;
  if(donateLink) donateLink.href = data.site.donateUrl;
  if(donateFooter) donateFooter.href = data.site.donateUrl;

  const page = document.documentElement.getAttribute('data-page');
  if(page==='home'){
    // Debug: Show loaded goal amount
    console.log('Home page - Goal amount:', data.home.goal);
    console.log('Home page - Dancers caption:', data.home.dancersTrioCaption);
    
    document.getElementById('home-title').textContent = data.home.hero.title;
    document.getElementById('home-subtitle').textContent = data.home.hero.subtitle;
    document.getElementById('home-date').textContent = `Date: ${data.site.date}`;
    document.getElementById('home-time').textContent = `Time: ${data.site.time}`;
    document.getElementById('home-venue').textContent = `Venue: ${data.site.venue}`;
    const rsvpHero = document.getElementById('rsvp-link-hero');
    const donateHero = document.getElementById('donate-link-hero');
    const directions = document.getElementById('directions-link');
    if(rsvpHero) rsvpHero.href = data.site.rsvpUrl;
    if(donateHero) donateHero.href = data.site.donateUrl;
    if(directions) directions.href = data.site.directionsUrl;

    document.getElementById('home-about').textContent = data.home.about;
    document.getElementById('home-goal').textContent = data.home.goal;

    const ul = document.getElementById('funds-list'); ul.innerHTML='';
    (data.home.fundsHelp||[]).forEach(t=>{ const li=document.createElement('li'); li.textContent=t; ul.appendChild(li); });

    document.getElementById('home-venue-side').textContent = data.site.venue;
    document.getElementById('home-address').textContent = data.site.address;
    document.getElementById('home-date-side').textContent = data.site.date;
    document.getElementById('home-time-side').textContent = data.site.time;
    const rsvpSide = document.getElementById('rsvp-link-side');
    if (rsvpSide){ rsvpSide.href = data.site.rsvpUrl; rsvpSide.textContent = new URL(data.site.rsvpUrl).hostname; }

    const p1 = document.getElementById('poster-1'); if(p1) p1.src = (data.home.posters||[])[0] || '';
    const p2 = document.getElementById('poster-2'); if(p2) p2.src = (data.home.posters||[])[1] || '';

    const trio = document.getElementById('dancers-trio');
    const trioCap = document.getElementById('dancers-trio-caption');
    console.log('Dancers trio element:', trio);
    console.log('Dancers trio image path:', data.home.dancersTrioImage);
    if(trio) {
      trio.src = data.home.dancersTrioImage;
      console.log('Set dancers trio src to:', data.home.dancersTrioImage);
    }
    if(trioCap) trioCap.textContent = data.home.dancersTrioCaption;

    const statsDiv = document.getElementById('home-stats');
    if (statsDiv){ 
      statsDiv.innerHTML='';
      (data.home.stats||[]).forEach(s=>{
        const card=document.createElement('div'); card.className='stat';
        const span=document.createElement('span'); span.textContent=s.label;
        const strong=document.createElement('strong'); strong.textContent=s.value;
        card.append(span,strong); statsDiv.appendChild(card);
      });
    }
  }

  if(page==='uskids'){
    const ua = document.getElementById('logo-uskids-about');
    const sa = document.getElementById('logo-sanmargam-about');
    if(ua) ua.src = data.site.logos.uskids;
    if(sa) sa.src = data.site.logos.sanmargam;
    document.getElementById('uskids-mission').textContent = data.uskids4water.mission;
    const stats=document.getElementById('uskids-stats');
    if(stats){
      stats.innerHTML='';
      (data.uskids4water.stats||[]).forEach(s=>{
        const card=document.createElement('div'); card.className='stat';
        const span=document.createElement('span'); span.textContent=s.label;
        const strong=document.createElement('strong'); strong.textContent=s.value;
        card.append(span,strong); stats.appendChild(card);
      });
    }
    document.getElementById('pillar-edu').textContent = data.uskids4water.pillars.education;
    document.getElementById('pillar-env').textContent = data.uskids4water.pillars.environment;
    document.getElementById('pillar-health').textContent = data.uskids4water.pillars.health;
    document.getElementById('summit-photo').src = data.uskids4water.summitImage;
    document.getElementById('ein').textContent = data.uskids4water.ein;
    const aboutBtn = document.getElementById('donate-link-about');
    const learnBtn = document.getElementById('donate-link-learn');
    const donateBtn = document.getElementById('donate-link-donate');
    if(aboutBtn) aboutBtn.href = data.uskids4water.websiteUrl;
    if(learnBtn) learnBtn.href = data.uskids4water.websiteUrl;
    if(donateBtn) donateBtn.href = data.uskids4water.websiteUrl;
  }

  if(page==='program'){
    document.getElementById('program-message').textContent = data.program.message;
    document.getElementById('program-date').textContent = data.site.date;
    document.getElementById('program-time').textContent = data.site.time;
  }

  if(page==='dancers'){
    const grid=document.getElementById('dancers-grid');
    if(grid){ 
      grid.innerHTML='';
      (data.dancers||[]).forEach(d=>{
        const article=document.createElement('article'); article.className='card profile';
        article.innerHTML = `<img src="${d.photo}" alt="${d.name} headshot"/><div><h3>${d.name}</h3><p class="muted small">${d.bioShort}</p></div>`;
        grid.appendChild(article);
      });
    }
  }

  wireQrModal(data);
}

function wireQrModal(data){
  const modal = document.getElementById('qr-modal'); if(!modal) return;
  const img = document.getElementById('qr-image');
  const openLink = document.getElementById('qr-open-link');
  const closeBtn = modal.querySelector('.qr-close');
  const overlay = modal.querySelector('.qr-overlay');
  const btns = [document.getElementById('donate-qr-btn'), document.getElementById('donate-qr-btn-hero')].filter(Boolean);

  function open(){
    if(img && data?.site?.donateQR) img.src = data.site.donateQR;
    if(openLink && data?.site?.donateUrl) openLink.href = data.site.donateUrl;
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
  }
  function close(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
  btns.forEach(b=>b && b.addEventListener('click', open));
  closeBtn && closeBtn.addEventListener('click', close);
  overlay && overlay.addEventListener('click', close);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const toggle=document.querySelector('.menu-toggle'); const menu=document.querySelector('.menu');
  if(toggle && menu){ toggle.addEventListener('click', ()=>{ const open=menu.classList.toggle('open'); toggle.setAttribute('aria-expanded', open?'true':'false');}); }
  loadContent();
});

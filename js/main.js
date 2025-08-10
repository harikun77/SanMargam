
async function loadContent() {
  try {
    const res = await fetch('content.json', {cache: 'no-store'});
    const data = await res.json();

    // Navbar & footer shared
    const uskidsLogo = document.getElementById('logo-uskids');
    const sanmargamLogo = document.getElementById('logo-sanmargam');
    const brandName = document.getElementById('brand-name');
    const rsvpLink = document.getElementById('rsvp-link');
    const donateLink = document.getElementById('donate-link');
    const donateFooter = document.getElementById('donate-link-footer');

    if (uskidsLogo) uskidsLogo.src = data.site.logos.uskids;
    if (sanmargamLogo) sanmargamLogo.src = data.site.logos.sanmargam;
    if (brandName) brandName.textContent = data.site.brand;
    if (rsvpLink) { rsvpLink.href = data.site.rsvpUrl; }
    if (donateLink) { donateLink.href = data.site.donateUrl; }
    if (donateFooter) { donateFooter.href = data.site.donateUrl; }

    const page = document.documentElement.getAttribute('data-page');

    if (page === 'home') {
      document.querySelector('.hero').style.backgroundImage = `url('${data.home.hero.background}')`;
      document.getElementById('home-title').textContent = data.home.hero.title;
      document.getElementById('home-subtitle').textContent = data.home.hero.subtitle;
      document.getElementById('home-date').textContent = `Date: ${data.site.date}`;
      document.getElementById('home-time').textContent = `Time: ${data.site.time}`;
      document.getElementById('home-venue').textContent = `Venue: ${data.site.venue}`;

      const rsvpHero = document.getElementById('rsvp-link-hero');
      const donateHero = document.getElementById('donate-link-hero');
      const directions = document.getElementById('directions-link');
      if (rsvpHero) rsvpHero.href = data.site.rsvpUrl;
      if (donateHero) donateHero.href = data.site.donateUrl;
      if (directions) directions.href = data.site.directionsUrl;

      document.getElementById('home-about').textContent = data.home.about;
      document.getElementById('home-goal').textContent = data.home.goal;

      const ul = document.getElementById('funds-list');
      data.home.fundsHelp.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });

      document.getElementById('home-venue-side').textContent = data.site.venue;
      document.getElementById('home-address').textContent = data.site.address;
      document.getElementById('home-date-side').textContent = data.site.date;
      document.getElementById('home-time-side').textContent = data.site.time;
      const rsvpSide = document.getElementById('rsvp-link-side');
      rsvpSide.href = data.site.rsvpUrl;
      rsvpSide.textContent = new URL(data.site.rsvpUrl).hostname;

      document.getElementById('poster-1').src = data.home.posters[0];
      document.getElementById('poster-2').src = data.home.posters[1];

      const statsDiv = document.getElementById('home-stats');
      data.home.stats.forEach(s => {
        const card = document.createElement('div'); card.className = 'stat';
        const span = document.createElement('span'); span.textContent = s.label;
        const strong = document.createElement('strong'); strong.textContent = s.value;
        card.appendChild(span); card.appendChild(strong);
        statsDiv.appendChild(card);
      });
    }

    if (page === 'uskids') {
      const uskidsAbout = document.getElementById('logo-uskids-about');
      const sanmargamAbout = document.getElementById('logo-sanmargam-about');
      if (uskidsAbout) uskidsAbout.src = data.site.logos.uskids;
      if (sanmargamAbout) sanmargamAbout.src = data.site.logos.sanmargam;

      document.getElementById('uskids-mission').textContent = data.uskids4water.mission;

      const stats = document.getElementById('uskids-stats');
      data.uskids4water.stats.forEach(s => {
        const card = document.createElement('div'); card.className = 'stat';
        const span = document.createElement('span'); span.textContent = s.label;
        const strong = document.createElement('strong'); strong.textContent = s.value;
        card.appendChild(span); card.appendChild(strong);
        stats.appendChild(card);
      });

      document.getElementById('pillar-edu').textContent = data.uskids4water.pillars.education;
      document.getElementById('pillar-env').textContent = data.uskids4water.pillars.environment;
      document.getElementById('pillar-health').textContent = data.uskids4water.pillars.health;

      document.getElementById('summit-photo').src = data.uskids4water.summitImage;
      document.getElementById('ein').textContent = data.uskids4water.ein;

      const aboutBtn = document.getElementById('donate-link-about');
      const learnBtn = document.getElementById('donate-link-learn');
      const donateBtn = document.getElementById('donate-link-donate');
      if (aboutBtn) aboutBtn.href = data.site.donateUrl;
      if (learnBtn) learnBtn.href = data.site.donateUrl;
      if (donateBtn) donateBtn.href = data.site.donateUrl;
    }

    if (page === 'program') {
      document.getElementById('program-message').textContent = data.program.message;
      document.getElementById('program-date').textContent = data.site.date;
      document.getElementById('program-time').textContent = data.site.time;
    }

    if (page === 'dancers') {
      const grid = document.getElementById('dancers-grid');
      data.dancers.forEach(d => {
        const article = document.createElement('article');
        article.className = 'card profile';
        article.innerHTML = `
          <img src="${d.photo}" alt="${d.name} headshot"/>
          <div>
            <h3>${d.name}</h3>
            <p class="muted small">${d.bioShort}</p>
          </div>`;
        grid.appendChild(article);
      });
    }

    // Top-level links on all pages (RSVP/Donate)
    const rsvpHero = document.getElementById('rsvp-link-hero');
    const donateHero = document.getElementById('donate-link-hero');
    if (rsvpHero) rsvpHero.href = data.site.rsvpUrl;
    if (donateHero) donateHero.href = data.site.donateUrl;

  } catch (e) {
    console.error('Failed to load content.json', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  loadContent();
});

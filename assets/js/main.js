document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.getElementById('navToggle');
const navEl = document.getElementById('siteNav');
if (toggle && navEl) {
  toggle.addEventListener('click', function () {
    const open = navEl.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

document.querySelectorAll('.site-nav a[data-page]').forEach(function (a) {
  const file = a.getAttribute('href');
  const path = window.location.pathname;
  if (path.endsWith(file) || (file === 'index.html' && (path === '/' || path.endsWith('/pack-269/') || path.endsWith('/')))) {
    a.classList.add('active');
  }
});

function errorRow(colspan, msg) {
  return '<tr><td colspan="' + colspan + '">' + msg + '</td></tr>';
}

const densGrid = document.getElementById('densGrid');
if (densGrid) {
  Pack269Data.get('dens').then(function (data) {
    if (!data) { densGrid.innerHTML = '<p>Unable to load den list right now.</p>'; return; }
    densGrid.innerHTML = data.map(function (d) {
      return '<div class="card"><h3>' + d.name + '</h3><p>' + d.grade + '</p></div>';
    }).join('');
  });
}

const newsPreview = document.getElementById('newsPreview');
if (newsPreview) {
  Pack269Data.get('news').then(function (data) {
    if (!data) { newsPreview.innerHTML = '<p>Unable to load news right now.</p>'; return; }
    newsPreview.innerHTML = data.slice(0, 2).map(function (n) {
      return '<article class="news-item"><h3>' + n.title + '</h3><p>' + n.summary + '</p></article>';
    }).join('');
  });
}

const newsList = document.getElementById('newsList');
if (newsList) {
  Pack269Data.get('news').then(function (data) {
    if (!data) { newsList.innerHTML = '<p>Unable to load news right now.</p>'; return; }
    newsList.innerHTML = data.map(function (n) {
      return '<article class="news-post"><h2>' + n.title + '</h2><p class="note">' + n.date + ' &middot; ' + n.category + '</p><p>' + n.summary + '</p></article>';
    }).join('');
  });
}

const activitiesTable = document.querySelector('#activitiesTable tbody');
if (activitiesTable) {
  Pack269Data.get('activities').then(function (data) {
    if (!data) { activitiesTable.innerHTML = errorRow(2, 'Unable to load activities right now.'); return; }
    activitiesTable.innerHTML = data.map(function (a) {
      return '<tr><td>' + a.activity + '</td><td>' + a.schedule + '</td></tr>';
    }).join('');
  });
}

const eventsTable = document.querySelector('#eventsTable tbody');
if (eventsTable) {
  Pack269Data.get('events').then(function (data) {
    if (!data) { eventsTable.innerHTML = errorRow(4, 'Unable to load events right now. Please check back later or contact pack269info@gmail.com.'); return; }
    eventsTable.innerHTML = data.map(function (ev) {
      const link = ev.info ? '<a href="' + ev.info + '" target="_blank" rel="noopener">Details</a>' : '&ndash;';
      return '<tr><td>' + ev.date + '</td><td>' + ev.event + '</td><td>' + ev.location + '</td><td>' + link + '</td></tr>';
    }).join('');
  });
}

const faqAccordion = document.getElementById('faqAccordion');
if (faqAccordion) {
  Pack269Data.get('faq').then(function (data) {
    if (!data) { faqAccordion.innerHTML = '<p>Unable to load FAQ right now.</p>'; return; }
    faqAccordion.innerHTML = data.map(function (item) {
      return '<details><summary>' + item.q + '</summary><p>' + item.a + '</p></details>';
    }).join('');
  });
}

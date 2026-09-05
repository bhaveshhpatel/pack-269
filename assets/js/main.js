document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.getElementById('navToggle');
const navEl = document.getElementById('mobileMenu');
if (toggle && navEl) {
  toggle.addEventListener('click', function () {
    const open = navEl.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

document.querySelectorAll('.site-nav a[data-page], .mobile-menu a[data-page]').forEach(function (a) {
  const file = a.getAttribute('href');
  const path = window.location.pathname;
  if (path.endsWith(file) || (file === 'index.html' && (path === '/' || path.endsWith('/pack-269/') || path.endsWith('/')))) {
    a.classList.add('active');
  }
});

function errorRow(colspan, msg) {
  return '<tr><td colspan="' + colspan + '">' + msg + '</td></tr>';
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* ---- Homepage: hero / glance / why / cta copy from site.json ---- */
const heroTitle = document.getElementById('heroTitle');
if (heroTitle) {
  Pack269Data.get('site').then(function (site) {
    if (!site) return;
    if (site.hero) {
      document.getElementById('heroTitle').textContent = site.hero.title;
      document.getElementById('heroSubtitle').textContent = site.hero.subtitle;
      const p = document.getElementById('heroPrimaryBtn');
      const s = document.getElementById('heroSecondaryBtn');
      if (p) { p.textContent = site.hero.primaryButtonText; p.href = site.hero.primaryButtonLink; }
      if (s) { s.textContent = site.hero.secondaryButtonText; s.href = site.hero.secondaryButtonLink; }
    }
    if (site.glance) {
      document.getElementById('glanceTitle').textContent = site.glance.title;
      document.getElementById('glanceBlurb').textContent = site.glance.blurb;
      const btn = document.getElementById('glanceOverviewBtn');
      if (btn) {
        btn.textContent = site.glance.overviewButtonText;
        btn.href = site.glance.overviewUrl || site.glance.overviewButtonLink;
      }
    }
    if (site.why) {
      document.getElementById('whyIntro').textContent = site.why.intro;
      document.getElementById('whyBullets').innerHTML = (site.why.bullets || []).map(function (b) {
        return '<li>' + esc(b) + '</li>';
      }).join('');
      const link = document.getElementById('whyLink');
      if (link) { link.textContent = site.why.linkText + ' \u2192'; link.href = site.why.linkHref; }
    }
    if (site.cta) {
      document.getElementById('ctaTitle').textContent = site.cta.title;
      document.getElementById('ctaText').textContent = site.cta.text;
      const btn = document.getElementById('ctaBtn');
      if (btn) { btn.textContent = site.cta.buttonText; btn.href = site.cta.buttonLink; }
    }
  });
}

/* ---- Coming Up: pack-hosted events, falls back to yearly activities ---- */
const comingUpGrid = document.getElementById('comingUpGrid');
if (comingUpGrid) {
  Pack269Data.get('pack-events').then(function (packEvents) {
    if (packEvents && packEvents.length) {
      comingUpGrid.innerHTML = packEvents.map(function (ev) {
        const link = ev.detailsUrl ? '<a class="link-more" href="' + esc(ev.detailsUrl) + '">Details</a>' : '';
        return '<div class="coming-up-card">' +
          '<p class="coming-up-date">' + esc(ev.dateLabel || ev.date) + '</p>' +
          '<h3>' + (ev.emoji ? esc(ev.emoji) + ' ' : '') + esc(ev.title) + '</h3>' +
          (ev.location ? '<p>' + esc(ev.location) + '</p>' : '') +
          (ev.time ? '<p>' + esc(ev.time) + '</p>' : '') +
          link + '</div>';
      }).join('');
      return;
    }
    Pack269Data.get('activities').then(function (data) {
      if (!data) { comingUpGrid.innerHTML = '<p>Unable to load activities right now.</p>'; return; }
      comingUpGrid.innerHTML = data.slice(0, 4).map(function (a) {
        return '<div class="coming-up-card"><p class="coming-up-date">' + esc(a.schedule) + '</p><h3>' + esc(a.activity) + '</h3></div>';
      }).join('');
    });
  });
}

/* ---- What We Do: activity category cards ---- */
const categoryGrid = document.getElementById('categoryGrid');
if (categoryGrid) {
  Pack269Data.get('activity-categories').then(function (data) {
    if (!data) { categoryGrid.innerHTML = '<p>Unable to load right now.</p>'; return; }
    categoryGrid.innerHTML = data.map(function (c) {
      return '<div class="category-card"><div class="category-icon">' + esc(c.icon) + '</div><h3>' + esc(c.title) + '</h3><p>' + esc(c.description) + '</p></div>';
    }).join('');
  });
}

/* ---- Meet the Leaders: pack leaders + a standing volunteer-recruitment card ---- */
const leadersGrid = document.getElementById('leadersGrid');
if (leadersGrid) {
  Pack269Data.get('leaders').then(function (data) {
    const leaders = data || [];
    const cards = leaders.map(function (l) {
      const initials = (l.name || '?').split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
      return '<div class="leader-card"><div class="leader-avatar">' + esc(initials) + '</div><h3>' + esc(l.name) + '</h3><p>' + esc(l.role) + '</p></div>';
    });
    cards.push('<div class="leader-card leader-card-open"><div class="leader-avatar">?</div><h3>You?</h3><p>We always welcome new leaders and helpers.</p></div>');
    leadersGrid.innerHTML = cards.join('');
  });
}

/* ---- Find Your Den ---- */
const denFinderGrid = document.getElementById('denFinderGrid');
if (denFinderGrid) {
  Pack269Data.get('dens').then(function (data) {
    if (!data) { denFinderGrid.innerHTML = '<p>Unable to load den list right now.</p>'; return; }
    denFinderGrid.innerHTML = data.map(function (d) {
      return '<div class="den-card"><h3>' + esc(d.name.replace(' Den', '')) + '</h3><p>' + esc(d.grade) + '</p><p class="den-meeting-day">' + esc(d.meetingDay || '') + '</p></div>';
    }).join('');
  });
}

/* ---- Families Love It: only shown once testimonials exist ---- */
const testimonialsSection = document.getElementById('testimonials-section');
if (testimonialsSection) {
  Pack269Data.get('testimonials').then(function (data) {
    if (!data || !data.length) return;
    testimonialsSection.style.display = '';
    document.getElementById('testimonialsGrid').innerHTML = data.map(function (t) {
      return '<blockquote class="testimonial-card"><p>&ldquo;' + esc(t.quote) + '&rdquo;</p><cite>&mdash; ' + esc(t.author) + '</cite></blockquote>';
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

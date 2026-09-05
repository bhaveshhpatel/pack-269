(function () {
  const OWNER = 'bhaveshhpatel';
  const REPO = 'pack-269';
  const BRANCH = 'main';
  const API = 'https://api.github.com';
  const TOKEN_KEY = 'pack269_admin_token';

  // ---- Schema: describes how to render/edit each data file ----
  const FILES = {
    'site': {
      label: 'Homepage Copy (hero, at-a-glance, why-scouting, CTA)',
      kind: 'object',
      groups: [
        { key: 'hero', title: 'Hero Section', fields: [
          { key: 'title', label: 'Title' },
          { key: 'subtitle', label: 'Subtitle' },
          { key: 'primaryButtonText', label: 'Primary button text' },
          { key: 'primaryButtonLink', label: 'Primary button link' },
          { key: 'secondaryButtonText', label: 'Secondary button text' },
          { key: 'secondaryButtonLink', label: 'Secondary button link' }
        ]},
        { key: 'glance', title: 'At a Glance Section', fields: [
          { key: 'title', label: 'Title' },
          { key: 'blurb', label: 'Blurb', multiline: true },
          { key: 'overviewUrl', label: 'Overview PDF URL (optional)' },
          { key: 'overviewButtonText', label: 'Button text' },
          { key: 'overviewButtonLink', label: 'Button link (used if no PDF URL)' }
        ]},
        { key: 'why', title: 'Why Cub Scouting Section', fields: [
          { key: 'intro', label: 'Intro paragraph', multiline: true },
          { key: 'bullets', label: 'Bullet points (one per line)', list: true },
          { key: 'linkText', label: 'Link text' },
          { key: 'linkHref', label: 'Link URL' }
        ]},
        { key: 'cta', title: 'Closing CTA Section', fields: [
          { key: 'title', label: 'Title' },
          { key: 'text', label: 'Text', multiline: true },
          { key: 'buttonText', label: 'Button text' },
          { key: 'buttonLink', label: 'Button link' }
        ]}
      ]
    },
    'dens': {
      label: 'Dens (Find Your Den)',
      kind: 'array',
      itemLabel: function (item) { return item.name || 'New Den'; },
      fields: [
        { key: 'name', label: 'Den name' },
        { key: 'grade', label: 'Grade' },
        { key: 'meetingDay', label: 'Meeting day' }
      ],
      blank: { name: '', grade: '', meetingDay: 'Wednesdays' }
    },
    'activity-categories': {
      label: 'What We Do (category cards)',
      kind: 'array',
      itemLabel: function (item) { return item.title || 'New Category'; },
      fields: [
        { key: 'icon', label: 'Icon (emoji)' },
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description', multiline: true }
      ],
      blank: { icon: '\u2b50', title: '', description: '' }
    },
    'pack-events': {
      label: 'Coming Up (homepage upcoming events)',
      kind: 'array',
      itemLabel: function (item) { return item.title || 'New Event'; },
      fields: [
        { key: 'dateLabel', label: 'Date label (e.g. "Wed \u2022 Sep 10")' },
        { key: 'date', label: 'ISO date (e.g. 2026-09-10)' },
        { key: 'emoji', label: 'Emoji (optional)' },
        { key: 'title', label: 'Event title' },
        { key: 'location', label: 'Location' },
        { key: 'time', label: 'Time' },
        { key: 'detailsUrl', label: 'Details URL (optional)' }
      ],
      blank: { dateLabel: '', date: '', emoji: '', title: '', location: '', time: '', detailsUrl: '' },
      note: 'Leave this list empty and the homepage will automatically show a preview of the Yearly Activities table instead.'
    },
    'activities': {
      label: 'Yearly Activities (About page table)',
      kind: 'array',
      itemLabel: function (item) { return item.activity || 'New Activity'; },
      fields: [
        { key: 'activity', label: 'Activity' },
        { key: 'schedule', label: 'Expected schedule' }
      ],
      blank: { activity: '', schedule: '' }
    },
    'events': {
      label: 'District & Council Events (Events page table)',
      kind: 'array',
      itemLabel: function (item) { return item.event ? item.event.slice(0, 40) : 'New Event'; },
      fields: [
        { key: 'date', label: 'Date & time' },
        { key: 'event', label: 'Event description', multiline: true },
        { key: 'location', label: 'Location' },
        { key: 'info', label: 'Info URL (optional)' }
      ],
      blank: { date: '', event: '', location: '', info: '' }
    },
    'leaders': {
      label: 'Pack Leaders',
      kind: 'array',
      itemLabel: function (item) { return item.name || 'New Leader'; },
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' }
      ],
      blank: { name: '', role: '' }
    },
    'testimonials': {
      label: 'Family Testimonials',
      kind: 'array',
      itemLabel: function (item) { return item.author || 'New Testimonial'; },
      fields: [
        { key: 'quote', label: 'Quote', multiline: true },
        { key: 'author', label: 'Attribution (e.g. "Parent, J.D.")' }
      ],
      blank: { quote: '', author: '' },
      note: 'This section is hidden on the homepage until at least one testimonial is added.'
    },
    'faq': {
      label: 'FAQ',
      kind: 'array',
      itemLabel: function (item) { return item.q || 'New Question'; },
      fields: [
        { key: 'q', label: 'Question' },
        { key: 'a', label: 'Answer', multiline: true }
      ],
      blank: { q: '', a: '' }
    },
    'news': {
      label: 'Pack News',
      kind: 'array',
      itemLabel: function (item) { return item.title || 'New Post'; },
      fields: [
        { key: 'id', label: 'ID (unique slug)' },
        { key: 'title', label: 'Title' },
        { key: 'date', label: 'Date (YYYY-MM-DD)' },
        { key: 'category', label: 'Category' },
        { key: 'summary', label: 'Summary', multiline: true }
      ],
      blank: { id: '', title: '', date: '', category: 'Pack', summary: '' }
    }
  };

  // ---- Base64 helpers (UTF-8 safe) ----
  function b64Encode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (m, p1) {
      return String.fromCharCode('0x' + p1);
    }));
  }
  function b64Decode(str) {
    return decodeURIComponent(atob(str.replace(/\n/g, '')).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  function getToken() { return sessionStorage.getItem(TOKEN_KEY) || ''; }
  function setToken(t) { sessionStorage.setItem(TOKEN_KEY, t); }
  function clearToken() { sessionStorage.removeItem(TOKEN_KEY); }

  function apiHeaders() {
    return {
      'Authorization': 'Bearer ' + getToken(),
      'Accept': 'application/vnd.github+json'
    };
  }

  function showStatus(el, msg, type) {
    el.textContent = msg;
    el.className = 'admin-status show ' + type;
  }

  async function verifyToken() {
    const res = await fetch(API + '/repos/' + OWNER + '/' + REPO, { headers: apiHeaders() });
    if (!res.ok) throw new Error('Token could not access ' + OWNER + '/' + REPO + ' (HTTP ' + res.status + ')');
    const data = await res.json();
    if (!data.permissions || !data.permissions.push) {
      throw new Error('This token does not have write access to the repository.');
    }
    return data;
  }

  async function loadFile(fileKey) {
    const path = 'assets/data/' + fileKey + '.json';
    const res = await fetch(API + '/repos/' + OWNER + '/' + REPO + '/contents/' + path + '?ref=' + BRANCH, { headers: apiHeaders() });
    if (!res.ok) throw new Error('Could not load ' + path + ' (HTTP ' + res.status + ')');
    const data = await res.json();
    const content = JSON.parse(b64Decode(data.content) || 'null');
    return { content: content, sha: data.sha, path: path };
  }

  async function saveFile(fileKey, sha, newContent) {
    const path = 'assets/data/' + fileKey + '.json';
    const body = {
      message: 'Admin update: ' + fileKey + '.json',
      content: b64Encode(JSON.stringify(newContent, null, 2) + '\n'),
      sha: sha,
      branch: BRANCH
    };
    const res = await fetch(API + '/repos/' + OWNER + '/' + REPO + '/contents/' + path, {
      method: 'PUT',
      headers: Object.assign({ 'Content-Type': 'application/json' }, apiHeaders()),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(function () { return {}; });
      throw new Error(err.message || ('Save failed (HTTP ' + res.status + ')'));
    }
    return res.json();
  }

  // ---- Rendering ----
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }

  function fieldInput(field, value) {
    const input = el(field.multiline ? 'textarea' : 'input', {
      class: field.multiline ? 'admin-textarea' : 'admin-input',
      'data-field': field.key
    });
    if (!field.multiline) input.type = 'text';
    if (field.list) {
      input.value = Array.isArray(value) ? value.join('\n') : '';
      input.classList.add('admin-textarea');
      input.rows = 4;
    } else {
      input.value = value == null ? '' : value;
    }
    return input;
  }

  function renderArrayEditor(container, schema, items) {
    container.innerHTML = '';
    if (schema.note) container.appendChild(el('p', { class: 'admin-note', text: schema.note }));
    const list = el('div', { id: 'admin-item-list' });
    items.forEach(function (item, idx) {
      list.appendChild(renderArrayItem(schema, item, idx));
    });
    container.appendChild(list);
    const addBtn = el('button', { type: 'button', class: 'admin-btn admin-btn-ghost', text: '+ Add New Item' });
    addBtn.addEventListener('click', function () {
      const idx = list.children.length;
      const blank = JSON.parse(JSON.stringify(schema.blank || {}));
      list.appendChild(renderArrayItem(schema, blank, idx));
    });
    container.appendChild(addBtn);
  }

  function renderArrayItem(schema, item, idx) {
    const card = el('div', { class: 'admin-item-card', 'data-idx': idx });
    const head = el('div', { class: 'admin-item-head' });
    head.appendChild(el('span', { text: schema.itemLabel ? schema.itemLabel(item) : ('Item ' + (idx + 1)) }));
    const removeBtn = el('button', { type: 'button', class: 'admin-btn admin-btn-danger', text: 'Remove' });
    removeBtn.addEventListener('click', function () { card.remove(); });
    head.appendChild(removeBtn);
    card.appendChild(head);
    schema.fields.forEach(function (field) {
      const row = el('div', { class: 'admin-row' });
      row.appendChild(el('label', { text: field.label }));
      row.appendChild(fieldInput(field, item[field.key]));
      card.appendChild(row);
    });
    return card;
  }

  function collectArrayEditor(container, schema) {
    const cards = container.querySelectorAll('.admin-item-card');
    const items = [];
    cards.forEach(function (card) {
      const obj = {};
      schema.fields.forEach(function (field) {
        const input = card.querySelector('[data-field="' + field.key + '"]');
        obj[field.key] = input ? input.value : '';
      });
      items.push(obj);
    });
    return items;
  }

  function renderObjectEditor(container, schema, data) {
    container.innerHTML = '';
    schema.groups.forEach(function (group) {
      const gEl = el('div', { class: 'admin-field-group', 'data-group': group.key });
      gEl.appendChild(el('h3', { text: group.title }));
      const groupData = (data && data[group.key]) || {};
      group.fields.forEach(function (field) {
        const row = el('div', { class: 'admin-row' });
        row.appendChild(el('label', { text: field.label }));
        row.appendChild(fieldInput(field, groupData[field.key]));
        gEl.appendChild(row);
      });
      container.appendChild(gEl);
    });
  }

  function collectObjectEditor(container, schema) {
    const result = {};
    schema.groups.forEach(function (group) {
      const gEl = container.querySelector('[data-group="' + group.key + '"]');
      const obj = {};
      group.fields.forEach(function (field) {
        const input = gEl.querySelector('[data-field="' + field.key + '"]');
        if (field.list) {
          obj[field.key] = input.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
        } else {
          obj[field.key] = input.value;
        }
      });
      result[group.key] = obj;
    });
    return result;
  }

  // ---- Wire up page ----
  document.addEventListener('DOMContentLoaded', function () {
    const tokenInput = document.getElementById('adminToken');
    const connectBtn = document.getElementById('connectBtn');
    const forgetBtn = document.getElementById('forgetTokenBtn');
    const authStatus = document.getElementById('authStatus');
    const editorSection = document.getElementById('editorSection');
    const fileSelect = document.getElementById('fileSelect');
    const loadBtn = document.getElementById('loadBtn');
    const saveBtn = document.getElementById('saveBtn');
    const editorContainer = document.getElementById('editorContainer');
    const editorStatus = document.getElementById('editorStatus');
    const editorTitle = document.getElementById('editorTitle');

    Object.keys(FILES).forEach(function (key) {
      const opt = el('option', { value: key, text: FILES[key].label });
      fileSelect.appendChild(opt);
    });

    let currentSha = null;
    let currentSchema = null;
    let currentKey = null;

    if (getToken()) {
      tokenInput.value = getToken();
      authStatus.textContent = 'Using saved token for this browser tab.';
      authStatus.className = 'admin-status show info';
      editorSection.style.display = '';
    }

    connectBtn.addEventListener('click', async function () {
      const t = tokenInput.value.trim();
      if (!t) { showStatus(authStatus, 'Enter a personal access token first.', 'err'); return; }
      setToken(t);
      showStatus(authStatus, 'Checking access\u2026', 'info');
      try {
        await verifyToken();
        showStatus(authStatus, 'Connected \u2014 you have write access to ' + OWNER + '/' + REPO + '.', 'ok');
        editorSection.style.display = '';
      } catch (e) {
        clearToken();
        showStatus(authStatus, e.message, 'err');
        editorSection.style.display = 'none';
      }
    });

    forgetBtn.addEventListener('click', function () {
      clearToken();
      tokenInput.value = '';
      showStatus(authStatus, 'Token forgotten for this tab.', 'info');
      editorSection.style.display = 'none';
    });

    loadBtn.addEventListener('click', async function () {
      const key = fileSelect.value;
      if (!key) return;
      showStatus(editorStatus, 'Loading\u2026', 'info');
      try {
        const { content, sha } = await loadFile(key);
        currentSha = sha;
        currentSchema = FILES[key];
        currentKey = key;
        editorTitle.textContent = FILES[key].label;
        if (FILES[key].kind === 'array') {
          renderArrayEditor(editorContainer, FILES[key], content || []);
        } else {
          renderObjectEditor(editorContainer, FILES[key], content || {});
        }
        saveBtn.style.display = '';
        showStatus(editorStatus, 'Loaded. Make your changes, then click Save.', 'ok');
      } catch (e) {
        showStatus(editorStatus, e.message, 'err');
      }
    });

    saveBtn.addEventListener('click', async function () {
      if (!currentKey) return;
      showStatus(editorStatus, 'Saving\u2026', 'info');
      try {
        let newContent;
        if (currentSchema.kind === 'array') {
          newContent = collectArrayEditor(editorContainer, currentSchema);
        } else {
          newContent = collectObjectEditor(editorContainer, currentSchema);
        }
        const result = await saveFile(currentKey, currentSha, newContent);
        currentSha = result.content.sha;
        showStatus(editorStatus, 'Saved to main. The live site will update on next page load.', 'ok');
      } catch (e) {
        showStatus(editorStatus, e.message, 'err');
      }
    });
  });
})();

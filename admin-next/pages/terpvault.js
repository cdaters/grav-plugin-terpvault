const TAG = window.__GRAV_PAGE_TAG || 'terpvault-page';

class TerpVaultPage extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.state = {
      games: [],
      formats: {},
      status: null,
      source: 'loading',
      activeTab: localStorage.getItem('terpvault.admin.tab') || 'library'
    };
    this._renderSkeleton();
    this._load();
  }

  async _load() {
    const embedded = this._embeddedData();
    if (embedded) {
      this._applyData(embedded, 'embedded Admin2 page data');
      return;
    }

    try {
      const manifestUrl = this._manifestUrl();
      const response = await fetch(manifestUrl, { headers: { Accept: 'application/json' } });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || response.statusText || `HTTP ${response.status}`);
      }
      this._applyData(data, 'public read-only manifest');
    } catch (error) {
      this.state.source = 'unavailable';
      this._renderUnavailable(error);
    }
  }

  _embeddedData() {
    const candidates = [
      window.__TERPVAULT_ADMIN_DATA,
      window.__GRAV_PAGE_DATA?.terpvault,
      window.__GRAV_PAGE_DATA?.data?.terpvault,
      window.__GRAV_PAGE_DATA?.data,
      window.__GRAV_PAGE?.data?.terpvault,
      window.__GRAV_PAGE?.definition?.data,
      window.__GRAV_ADMIN_PAGE?.data?.terpvault,
      window.__GRAV_ADMIN_PAGE?.definition?.data
    ];

    for (const candidate of candidates) {
      if (candidate && (Array.isArray(candidate.games) || candidate.manifest_url || candidate.formats)) {
        return candidate;
      }
    }

    const attr = this.getAttribute('data-terpvault') || this.dataset.terpvault;
    if (attr) {
      try {
        const parsed = JSON.parse(attr);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch (e) {}
    }

    return null;
  }

  _manifestUrl() {
    const route = this._embeddedData()?.manifest_url || `${this._siteBase()}${this._publicRoute()}/_manifest`;
    return route.replace(/([^:]\/)\/+/g, '$1');
  }

  _publicRoute() {
    const route = this._embeddedData()?.route || '/if';
    return `/${String(route).trim().replace(/^\/+|\/+$/g, '')}`;
  }

  _siteBase() {
    const globals = [
      window.__GRAV_BASE_URL,
      window.__GRAV_BASE_URL_RELATIVE,
      window.GravAdmin?.config?.base_url_relative,
      window.GravAdmin?.config?.base_url
    ].filter(Boolean);

    if (globals.length) {
      return `/${String(globals[0]).trim().replace(/^\/+|\/+$/g, '')}`.replace(/^\/$/, '');
    }

    const path = window.location.pathname || '';
    const adminIndex = path.indexOf('/admin');
    return adminIndex > 0 ? path.slice(0, adminIndex) : '';
  }

  _applyData(data, source) {
    this.state.games = Array.isArray(data.games) ? data.games : [];
    this.state.formats = data.formats || this._fallbackFormats();
    this.state.status = data;
    this.state.source = source;
    this._renderLibrary();
    this._renderFormats();
    this._renderSettings();
  }

  _renderSkeleton() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; min-height:auto; font-family: inherit; color: inherit; }
        * { box-sizing: border-box; }
        .tv-admin { padding: 1rem; color: inherit; }
        .hero { border: 1px solid rgba(127,127,127,.28); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1rem; background: rgba(127,127,127,.055); }
        h1 { margin: 0 0 .25rem; font-size: 1.55rem; letter-spacing: 0; }
        h2 { margin: 0 0 .65rem; font-size: 1.05rem; letter-spacing: 0; }
        h3 { margin: 0 0 .35rem; font-size: .95rem; letter-spacing: 0; }
        p { margin: .35rem 0; line-height: 1.45; }
        .meta { opacity:.74; font-size:.875rem; }
        .tabs { display:flex; flex-wrap:wrap; gap:.5rem; margin:0 0 1rem; }
        .tab { border:1px solid rgba(127,127,127,.28); border-radius:999px; background:rgba(127,127,127,.08); color:inherit; padding:.45rem .8rem; cursor:pointer; }
        .tab[aria-selected="true"] { background:rgba(93,164,255,.16); border-color:rgba(93,164,255,.72); }
        .panel { display:none; }
        .panel.active { display:block; }
        .empty,.error,.box { border:1px solid rgba(127,127,127,.28); border-radius:12px; padding:1rem; background:rgba(127,127,127,.045); }
        .error { border-color: rgba(255,95,95,.65); }
        .notice { border-style: dashed; margin-bottom: .8rem; }
        .game { border:1px solid rgba(127,127,127,.28); border-radius:12px; margin:0 0 .8rem; background:rgba(127,127,127,.035); overflow:hidden; }
        .game summary { cursor:pointer; display:grid; grid-template-columns: 72px minmax(0,1fr) auto; gap:.85rem; align-items:center; padding:.75rem; }
        .cover { width:72px; aspect-ratio:16/9; border-radius:8px; object-fit:cover; background:rgba(127,127,127,.15); border:1px solid rgba(127,127,127,.28); }
        .title { font-weight:700; font-size:1rem; margin-bottom:.15rem; }
        .tagline { opacity:.78; font-size:.9rem; overflow-wrap:anywhere; }
        .badges { display:flex; align-items:center; justify-content:flex-end; flex-wrap:wrap; gap:.35rem; }
        .badge { display:inline-flex; align-items:center; border:1px solid rgba(127,127,127,.35); border-radius:999px; padding:.12rem .5rem; font-size:.75rem; white-space:nowrap; }
        .badge.warn { border-color: rgba(255,188,87,.65); background: rgba(255,188,87,.12); }
        .badge.error { border-color: rgba(255,95,95,.75); background: rgba(255,95,95,.13); }
        .badge.ok { border-color: rgba(79,190,124,.58); background: rgba(79,190,124,.10); }
        .body { border-top:1px solid rgba(127,127,127,.18); padding:.85rem; display:grid; grid-template-columns: minmax(0, 1.45fr) minmax(260px, .9fr); gap:1rem; }
        dl { display:grid; grid-template-columns: 125px minmax(0,1fr); gap:.4rem .75rem; margin:0; }
        dt { opacity:.68; }
        dd { margin:0; overflow-wrap:anywhere; }
        .actions { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; margin-top:.8rem; }
        a.button { display:inline-flex; border:1px solid rgba(127,127,127,.35); border-radius:999px; padding:.4rem .7rem; color:inherit; text-decoration:none; background:rgba(127,127,127,.08); }
        .warnings { display:grid; gap:.4rem; margin-top:.85rem; }
        .warning { border:1px solid rgba(127,127,127,.22); border-radius:10px; padding:.45rem .55rem; background:rgba(127,127,127,.04); }
        .warning.error { border-color: rgba(255,95,95,.7); }
        .warning strong { display:block; font-size:.86rem; }
        .side { display:grid; gap:.8rem; align-content:start; }
        .provenance { display:grid; gap:.5rem; }
        .provenance-item { border:1px solid rgba(127,127,127,.2); border-radius:10px; padding:.55rem; }
        .provenance-item span { display:block; opacity:.68; font-size:.75rem; text-transform:uppercase; }
        .provenance-item a { color:inherit; overflow-wrap:anywhere; }
        code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:.9em; }
        .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:.8rem; }
        @media (max-width: 820px) {
          .game summary { grid-template-columns: 56px 1fr; }
          .cover { width:56px; }
          .badges { grid-column: 1 / -1; justify-content:flex-start; }
          .body { grid-template-columns: 1fr; }
          dl { grid-template-columns: 1fr; }
        }
      </style>
      <div class="tv-admin">
        <section class="hero">
          <h1>TerpVault Library Manager</h1>
          <p>Read-only package inventory for installed TerpVault interactive-fiction packages.</p>
          <p class="meta">v0.2.0 is opt-in and read-only. Editing, upload, delete, import, and export workflows are planned but not available yet.</p>
        </section>
        <nav class="tabs" aria-label="TerpVault sections">
          ${this._tabButton('library', 'Library')}
          ${this._tabButton('formats', 'Formats')}
          ${this._tabButton('settings', 'Settings')}
        </nav>
        <section id="library" class="panel ${this.state.activeTab === 'library' ? 'active' : ''}"><div class="empty">Loading game packages...</div></section>
        <section id="formats" class="panel ${this.state.activeTab === 'formats' ? 'active' : ''}"><div class="empty">Loading format support...</div></section>
        <section id="settings" class="panel ${this.state.activeTab === 'settings' ? 'active' : ''}"><div class="empty">Loading settings...</div></section>
      </div>
    `;

    this.shadowRoot.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => this._setTab(btn.dataset.tab));
    });
  }

  _tabButton(tab, label) {
    const selected = this.state.activeTab === tab ? 'true' : 'false';
    return `<button type="button" class="tab" data-tab="${tab}" aria-selected="${selected}">${label}</button>`;
  }

  _setTab(tab) {
    this.state.activeTab = tab;
    localStorage.setItem('terpvault.admin.tab', tab);
    this.shadowRoot.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === tab ? 'true' : 'false'));
    this.shadowRoot.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === tab));
  }

  _renderUnavailable(error) {
    const html = `
      <div class="error">
        <h2>Package data unavailable</h2>
        <p>${this._esc(error?.message || 'The read-only package manifest could not be loaded.')}</p>
        <p class="meta">No Admin2 API endpoint is registered in v0.2.0. The page uses embedded read-only data when Admin2 exposes it, otherwise it falls back to the public TerpVault manifest route.</p>
      </div>
    `;
    ['library', 'formats', 'settings'].forEach(id => {
      this.shadowRoot.getElementById(id).innerHTML = html;
    });
  }

  _renderLibrary() {
    const root = this.shadowRoot.getElementById('library');
    const games = this.state.games;
    if (!games.length) {
      root.innerHTML = `
        <div class="empty">
          <h2>No game packages found</h2>
          <p>Create folders under <code>user/data/terpvault/games</code>, each with a <code>game.yaml</code>.</p>
          <p class="meta">This page is read-only. Package creation and import are future Admin2 work.</p>
        </div>
      `;
      return;
    }

    const errors = games.reduce((sum, game) => sum + Number(game.error_count || 0), 0);
    const warnings = games.reduce((sum, game) => sum + Number(game.warning_count || 0), 0);
    root.innerHTML = `
      <div class="box notice">
        <strong>${games.length} package${games.length === 1 ? '' : 's'} found</strong>
        <p class="meta">Read-only source: ${this._esc(this.state.source)}. Editing, upload, delete, import, and export are intentionally unavailable in v0.2.0.</p>
        <div class="badges" style="justify-content:flex-start;margin-top:.5rem;">
          <span class="badge ${errors ? 'error' : 'ok'}">${errors} error${errors === 1 ? '' : 's'}</span>
          <span class="badge ${warnings ? 'warn' : 'ok'}">${warnings} warning${warnings === 1 ? '' : 's'}</span>
        </div>
      </div>
      ${games.map(game => this._gameRow(game)).join('')}
    `;
  }

  _gameRow(game) {
    const urls = game.urls || {};
    const slug = game.slug || '';
    const open = localStorage.getItem(`terpvault.admin.open.${slug}`) === '1' ? 'open' : '';
    queueMicrotask(() => {
      const escapedSlug = window.CSS?.escape ? CSS.escape(slug) : slug.replace(/"/g, '\\"');
      const row = this.shadowRoot.querySelector(`details[data-slug="${escapedSlug}"]`);
      if (row) {
        row.addEventListener('toggle', () => localStorage.setItem(`terpvault.admin.open.${slug}`, row.open ? '1' : '0'), { once: false });
      }
    });

    const storyBadge = game.has_story_file ? '<span class="badge ok">story found</span>' : '<span class="badge error">missing story</span>';
    const warningCount = Number(game.warning_count || 0);
    const errorCount = Number(game.error_count || 0);
    const cover = urls.small_cover || urls.thumbnail || urls.cover || '';

    return `
      <details class="game" data-slug="${this._esc(slug)}" ${open}>
        <summary>
          ${cover ? `<img class="cover" src="${this._esc(cover)}" alt="">` : '<div class="cover"></div>'}
          <div>
            <div class="title">${this._esc(game.title || slug)}</div>
            <div class="tagline">${this._esc(game.tagline || game.author || '')}</div>
          </div>
          <div class="badges">
            <span class="badge">${this._esc(game.format_label || game.format || 'Unknown')}</span>
            <span class="badge">${this._esc(game.status || 'draft')}</span>
            ${storyBadge}
            ${errorCount ? `<span class="badge error">${errorCount} error${errorCount === 1 ? '' : 's'}</span>` : ''}
            ${warningCount ? `<span class="badge warn">${warningCount} warning${warningCount === 1 ? '' : 's'}</span>` : '<span class="badge ok">no warnings</span>'}
          </div>
        </summary>
        <div class="body">
          <div>
            ${this._metadata(game)}
            <div class="actions">
              ${urls.detail ? `<a class="button" href="${this._esc(urls.detail)}" target="_blank" rel="noopener">Public Detail</a>` : ''}
              ${urls.play ? `<a class="button" href="${this._esc(urls.play)}" target="_blank" rel="noopener">Public Play</a>` : ''}
              ${urls.story ? `<a class="button" href="${this._esc(urls.story)}" target="_blank" rel="noopener">Story File</a>` : ''}
            </div>
            ${this._warnings(game)}
          </div>
          <div class="side">
            ${this._summary(game)}
            ${this._provenance(game)}
          </div>
        </div>
      </details>
    `;
  }

  _metadata(game) {
    const license = game.release?.license || game.license || {};
    const source = game.release?.source || game.source || {};
    return `
      <dl>
        <dt>Slug</dt><dd><code>${this._esc(game.slug || '')}</code></dd>
        <dt>Story file</dt><dd><code>${this._esc(game.story_file || '')}</code></dd>
        <dt>Author</dt><dd>${this._esc(game.author || '')}</dd>
        <dt>Year</dt><dd>${this._esc(game.year || '')}</dd>
        <dt>IFIDs</dt><dd>${this._esc((game.ifids || []).join(', ') || 'Not recorded')}</dd>
        <dt>Source</dt><dd>${source.url ? `<a href="${this._esc(source.url)}" target="_blank" rel="noopener">${this._esc(source.url)}</a>` : this._esc(source.notes || 'Not recorded')}</dd>
        <dt>License</dt><dd>${license.url ? `<a href="${this._esc(license.url)}" target="_blank" rel="noopener">${this._esc(license.name || license.url)}</a>` : this._esc(license.name || license.notes || 'Not recorded')}</dd>
      </dl>
    `;
  }

  _summary(game) {
    const description = String(game.description || '').replace(/\s+/g, ' ').trim();
    if (!description) {
      return '<div class="box"><h3>Summary</h3><p class="meta">No description recorded.</p></div>';
    }

    return `<div class="box"><h3>Summary</h3><p class="meta">${this._esc(description.slice(0, 420))}${description.length > 420 ? '...' : ''}</p></div>`;
  }

  _provenance(game) {
    const rows = game.provenance_rows || this._fallbackProvenanceRows(game);
    if (!rows.length) {
      return '<div class="box"><h3>Catalog & Provenance</h3><p class="meta">No catalog or provenance rows recorded.</p></div>';
    }

    return `
      <div class="box">
        <h3>Catalog & Provenance</h3>
        <div class="provenance">
          ${rows.map(row => this._provenanceRow(row)).join('')}
        </div>
      </div>
    `;
  }

  _provenanceRow(row) {
    const label = row.label || row.key || 'Reference';
    const text = row.text || row.value || row.url || (Array.isArray(row.values) ? row.values.join(', ') : '');
    const body = row.url
      ? `<a href="${this._esc(row.url)}" target="_blank" rel="noopener">${this._esc(text)}</a>`
      : `<div>${this._esc(text)}</div>`;
    return `
      <div class="provenance-item">
        <span>${this._esc(label)}</span>
        ${body}
        ${row.note ? `<p class="meta">${this._esc(row.note)}</p>` : ''}
      </div>
    `;
  }

  _fallbackProvenanceRows(game) {
    const rows = [];
    const links = game.catalog_links || [];
    links.forEach(link => rows.push({ label: link.label, url: link.url, text: link.value || link.url }));

    const license = game.release?.license || game.license || {};
    if (license.name || license.notes) {
      rows.push({ label: 'License', url: license.url || '', text: license.name || 'License notes', note: license.notes || '' });
    }

    return rows;
  }

  _warnings(game) {
    const warnings = game.advisory_warnings || game.warnings || [];
    if (!warnings.length) {
      return '<div class="warnings"><div class="warning"><strong>No validation warnings</strong><span class="meta">Package metadata looks complete for the current checks.</span></div></div>';
    }

    return `
      <div class="warnings">
        ${warnings.map(warning => `
          <div class="warning ${this._esc(warning.severity || '')}">
            <strong>${this._esc(warning.label || warning.code || 'Warning')}</strong>
            <span class="meta">${this._esc(warning.message || '')}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  _renderFormats() {
    const root = this.shadowRoot.getElementById('formats');
    const formats = this.state.formats || this._fallbackFormats();
    root.innerHTML = `
      <div class="grid">
        ${Object.entries(formats).map(([key, item]) => `
          <div class="box">
            <h2>${this._esc(item.label || key)}</h2>
            <p class="meta"><code>${this._esc((item.extensions || []).join(', '))}</code></p>
          </div>
        `).join('')}
      </div>
      <div class="box" style="margin-top:.8rem;">
        <strong>Read-only in v0.2.0</strong>
        <p class="meta">Format support is inferred from package metadata and story-file extensions. Upload and conversion workflows are future work.</p>
      </div>
    `;
  }

  _renderSettings() {
    const root = this.shadowRoot.getElementById('settings');
    const data = this.state.status || {};
    const storage = data.storage || {};
    const config = data.config || {};
    root.innerHTML = `
      <div class="box">
        <h2>Runtime Settings</h2>
        <dl>
          <dt>Mode</dt><dd>Read-only</dd>
          <dt>Route</dt><dd><code>${this._esc(data.route || this._publicRoute())}</code></dd>
          <dt>Manifest</dt><dd><code>${this._esc(data.manifest_url || this._manifestUrl())}</code></dd>
          <dt>Storage</dt><dd><code>${this._esc(storage.games_path || 'user://data/terpvault/games')}</code></dd>
          <dt>Resolved path</dt><dd><code>${this._esc(storage.resolved_path || 'Available only when embedded Admin2 data is exposed')}</code></dd>
          <dt>Player</dt><dd><code>${this._esc(config.player_engine || 'parchment')}</code></dd>
          <dt>Show unpublished</dt><dd>${config.show_unpublished ? 'Yes' : 'No'}</dd>
        </dl>
        <p class="meta">General plugin settings still live in Plugins -> TerpVault. Admin2 editing, imports, exports, uploads, and deletes are planned for later versions.</p>
      </div>
    `;
  }

  _fallbackFormats() {
    return {
      zcode: { label: 'Z-code', extensions: ['z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'zblorb'] },
      glulx: { label: 'Glulx', extensions: ['ulx', 'gblorb', 'glb', 'blorb'] },
      hugo: { label: 'Hugo', extensions: ['hex'] },
      tads: { label: 'TADS 2 / TADS 3', extensions: ['gam', 't3'] },
      adrift: { label: 'ADRIFT 4', extensions: ['taf'] }
    };
  }

  _esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[s]));
  }
}

customElements.define(TAG, TerpVaultPage);

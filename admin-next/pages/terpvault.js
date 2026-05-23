const TAG = window.__GRAV_PAGE_TAG || 'terpvault-page';

class TerpVaultPage extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.state = {
      games: [],
      formats: {},
      status: null,
      source: 'loading',
      activeTab: localStorage.getItem('terpvault.admin.tab') || 'library',
      editingSlug: null,
      create: {
        open: false,
        saving: false,
        error: '',
        success: ''
      },
      importInspect: {
        open: false,
        saving: false,
        committing: false,
        error: '',
        success: '',
        report: null,
        file: null,
        finalSlug: ''
      },
      export: {
        slug: '',
        saving: false,
        error: '',
        success: ''
      },
      editor: {
        slug: null,
        loading: false,
        saving: false,
        error: '',
        success: '',
        values: null,
        readOnly: null,
        activeHelper: 'how-to-play',
        helper: {
          type: 'how-to-play',
          loading: false,
          saving: false,
          error: '',
          success: '',
          label: '',
          path: '',
          exists: false,
          content: ''
        },
        media: {
          loading: false,
          saving: '',
          error: '',
          success: '',
          resources: null
        },
        story: {
          loading: false,
          saving: false,
          error: '',
          success: '',
          story_file: '',
          exists: false,
          extension: '',
          size: 0
        }
      }
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
        .button { display:inline-flex; align-items:center; justify-content:center; border:1px solid rgba(127,127,127,.35); border-radius:999px; padding:.4rem .7rem; color:inherit; text-decoration:none; background:rgba(127,127,127,.08); font:inherit; line-height:1.2; cursor:pointer; }
        .button.primary { border-color:rgba(93,164,255,.72); background:rgba(93,164,255,.18); }
        .button:disabled { opacity:.58; cursor:not-allowed; }
        .warnings { display:grid; gap:.4rem; margin-top:.85rem; }
        .warning { border:1px solid rgba(127,127,127,.22); border-radius:10px; padding:.45rem .55rem; background:rgba(127,127,127,.04); }
        .warning.error { border-color: rgba(255,95,95,.7); }
        .warning strong { display:block; font-size:.86rem; }
        .side { display:grid; gap:.8rem; align-content:start; }
        .provenance { display:grid; gap:.5rem; }
        .provenance-item { border:1px solid rgba(127,127,127,.2); border-radius:10px; padding:.55rem; }
        .provenance-item span { display:block; opacity:.68; font-size:.75rem; text-transform:uppercase; }
        .provenance-item a { color:inherit; overflow-wrap:anywhere; }
        .editor { border-top:1px solid rgba(127,127,127,.18); padding:1rem; background:rgba(127,127,127,.035); }
        .editor-head { display:flex; gap:.75rem; align-items:flex-start; justify-content:space-between; margin-bottom:.8rem; }
        .editor-head h3 { margin:0 0 .15rem; }
        .editor form { display:grid; gap:1rem; }
        .fieldsets { display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem; }
        fieldset { border:1px solid rgba(127,127,127,.24); border-radius:12px; padding:.8rem; margin:0; min-width:0; }
        legend { padding:0 .25rem; font-weight:700; }
        .field { display:grid; gap:.25rem; margin:.55rem 0; }
        .field label, .checkbox label { font-weight:600; font-size:.84rem; }
        input, textarea, select { width:100%; border:1px solid rgba(127,127,127,.35); border-radius:8px; padding:.48rem .55rem; background:rgba(127,127,127,.055); color:inherit; font:inherit; }
        select option, select optgroup { background:var(--tv-admin-select-bg, Canvas); color:var(--tv-admin-select-color, CanvasText); }
        :host-context(.dark) select option,
        :host-context(.dark) select optgroup,
        :host-context(.dark-mode) select option,
        :host-context(.dark-mode) select optgroup,
        :host-context([data-theme="dark"]) select option,
        :host-context([data-theme="dark"]) select optgroup,
        :host-context([data-bs-theme="dark"]) select option,
        :host-context([data-bs-theme="dark"]) select optgroup {
          --tv-admin-select-bg: var(--grav-bg, var(--admin-bg, #1f242c));
          --tv-admin-select-color: var(--grav-text, var(--admin-text, #f4f6f8));
        }
        textarea { min-height:6rem; resize:vertical; }
        textarea.short { min-height:4.2rem; }
        textarea.markdown { min-height:18rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:.92rem; line-height:1.45; }
        .checkbox { display:flex; gap:.5rem; align-items:center; margin:.7rem 0 .25rem; }
        .checkbox input { width:auto; }
        .readonly { display:grid; gap:.35rem; margin-top:.35rem; }
        .readonly div { display:grid; grid-template-columns:120px minmax(0,1fr); gap:.45rem; font-size:.86rem; }
        .readonly span:first-child { opacity:.68; }
        .message { border:1px solid rgba(127,127,127,.28); border-radius:10px; padding:.55rem .65rem; margin:.45rem 0; }
        .message.error { border-color:rgba(255,95,95,.7); background:rgba(255,95,95,.1); }
        .message.success { border-color:rgba(79,190,124,.58); background:rgba(79,190,124,.1); }
        .form-actions { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; justify-content:flex-end; }
        .helper-docs { border-top:1px solid rgba(127,127,127,.18); margin-top:1rem; padding-top:1rem; }
        .helper-tabs { display:flex; flex-wrap:wrap; gap:.45rem; margin:.7rem 0; }
        .helper-tabs .button[aria-selected="true"] { border-color:rgba(93,164,255,.72); background:rgba(93,164,255,.18); }
        .story-manager { border-top:1px solid rgba(127,127,127,.18); margin-top:1rem; padding-top:1rem; }
        .create-panel { border:1px solid rgba(93,164,255,.35); border-radius:12px; padding:1rem; margin:0 0 .85rem; background:rgba(93,164,255,.055); }
        .create-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:.75rem; }
        .media-manager { border-top:1px solid rgba(127,127,127,.18); margin-top:1rem; padding-top:1rem; }
        .media-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:.75rem; margin:.75rem 0; }
        .media-card { border:1px solid rgba(127,127,127,.24); border-radius:12px; padding:.65rem; background:rgba(127,127,127,.035); }
        .media-card img { display:block; width:100%; aspect-ratio:16/10; object-fit:cover; border-radius:8px; border:1px solid rgba(127,127,127,.22); background:rgba(127,127,127,.12); margin-bottom:.45rem; }
        .media-card .placeholder { display:grid; place-items:center; width:100%; aspect-ratio:16/10; border-radius:8px; border:1px dashed rgba(127,127,127,.34); background:rgba(127,127,127,.06); margin-bottom:.45rem; }
        .media-uploads { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:.75rem; }
        .screenshot-list { display:grid; gap:.55rem; margin:.75rem 0; }
        .screenshot-row { border:1px solid rgba(127,127,127,.24); border-radius:10px; padding:.6rem; display:grid; grid-template-columns:96px minmax(0,1fr); gap:.65rem; align-items:start; background:rgba(127,127,127,.03); }
        .screenshot-row img { width:96px; aspect-ratio:16/10; object-fit:cover; border-radius:8px; border:1px solid rgba(127,127,127,.22); background:rgba(127,127,127,.12); }
        .screenshot-actions { display:flex; flex-wrap:wrap; gap:.4rem; margin-top:.45rem; }
        code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:.9em; }
        .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:.8rem; }
        @media (max-width: 820px) {
          .game summary { grid-template-columns: 56px 1fr; }
          .cover { width:56px; }
          .badges { grid-column: 1 / -1; justify-content:flex-start; }
          .body { grid-template-columns: 1fr; }
          dl { grid-template-columns: 1fr; }
          .editor-head { display:block; }
          .readonly div { grid-template-columns:1fr; }
          .screenshot-row { grid-template-columns:1fr; }
          .screenshot-row img { width:100%; }
        }
      </style>
      <div class="tv-admin">
        <section class="hero">
          <h1>TerpVault Library Manager</h1>
          <p>Package inventory, package creation, metadata editing, helper Markdown editing, media management, screenshot ordering, and story-file replacement for installed TerpVault interactive-fiction packages.</p>
          <p class="meta">v0.3.0 is opt-in. Package export, import inspection, and draft-only import install are available. Package delete, overwrite, arbitrary file browsing, player settings editing, and <code>metadata.iFiction.xml</code> editing are not available.</p>
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
        <p class="meta">The page uses embedded Admin2 data when available, otherwise it falls back to the public TerpVault manifest route. Editing and package creation require the opt-in Admin2 API routes.</p>
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
          <div class="actions">
            <button class="button primary" type="button" data-action="create-package">Create Package</button>
            <button class="button" type="button" data-action="inspect-import">Inspect Import</button>
          </div>
        </div>
        ${this.state.create.open ? this._createPackagePanel() : ''}
        ${this.state.importInspect.open ? this._importInspectPanel() : ''}
      `;
      this._bindLibraryActions();
      return;
    }

    const errors = games.reduce((sum, game) => sum + Number(game.error_count || 0), 0);
    const warnings = games.reduce((sum, game) => sum + Number(game.warning_count || 0), 0);
    root.innerHTML = `
      <div class="box notice">
        <div class="editor-head">
          <div>
            <strong>${games.length} package${games.length === 1 ? '' : 's'} found</strong>
            <p class="meta">Source: ${this._esc(this.state.source)}. Package creation, editing, export, import inspection, and draft-only import install use the Admin2 API when available. Delete and overwrite are intentionally unavailable.</p>
          </div>
          <div class="actions" style="margin-top:0;">
            <button class="button" type="button" data-action="inspect-import">${this.state.importInspect.open ? 'Inspecting Import' : 'Inspect Import'}</button>
            <button class="button primary" type="button" data-action="create-package">${this.state.create.open ? 'Creating Package' : 'Create Package'}</button>
          </div>
        </div>
        <div class="badges" style="justify-content:flex-start;margin-top:.5rem;">
          <span class="badge ${errors ? 'error' : 'ok'}">${errors} error${errors === 1 ? '' : 's'}</span>
          <span class="badge ${warnings ? 'warn' : 'ok'}">${warnings} warning${warnings === 1 ? '' : 's'}</span>
        </div>
      </div>
      ${this.state.create.open ? this._createPackagePanel() : ''}
      ${this.state.importInspect.open ? this._importInspectPanel() : ''}
      ${games.map(game => this._gameRow(game)).join('')}
    `;
    this._bindLibraryActions();
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
              <button class="button primary" type="button" data-action="edit" data-slug="${this._esc(slug)}">${this.state.editingSlug === slug ? 'Edit Open' : 'Edit Metadata'}</button>
              ${urls.detail ? `<a class="button" href="${this._esc(urls.detail)}" target="_blank" rel="noopener">Public Detail</a>` : ''}
              ${urls.play ? `<a class="button" href="${this._esc(urls.play)}" target="_blank" rel="noopener">Public Play</a>` : ''}
              ${urls.story ? `<a class="button" href="${this._esc(urls.story)}" target="_blank" rel="noopener">Story File</a>` : ''}
              <button class="button" type="button" data-action="export" data-slug="${this._esc(slug)}" ${this.state.export.saving && this.state.export.slug === slug ? 'disabled' : ''}>${this.state.export.saving && this.state.export.slug === slug ? 'Exporting...' : 'Export'}</button>
            </div>
            ${this._exportMessage(slug)}
            ${this._warnings(game)}
          </div>
          <div class="side">
            ${this._summary(game)}
            ${this._provenance(game)}
          </div>
        </div>
        ${this.state.editingSlug === slug ? this._editorPanel(game) : ''}
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
    const description = this._plainTextPreview(game.description || '');
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

  _createPackagePanel() {
    const state = this.state.create || {};
    return `
      <section class="create-panel">
        <div class="editor-head">
          <div>
            <h2>Create Package</h2>
            <p class="meta">Creates a new package folder, starter <code>game.yaml</code>, initial story file, and starter helper Markdown files. Cover art and screenshots can be added after creation.</p>
          </div>
          <button class="button" type="button" data-action="cancel-create">Close</button>
        </div>
        ${state.error ? `<div class="message error">${this._esc(state.error)}</div>` : ''}
        ${state.success ? `<div class="message success">${this._esc(state.success)}</div>` : ''}
        <form data-create-package>
          <div class="create-grid">
            ${this._createInput('Slug', 'slug', true)}
            ${this._createInput('Title', 'title', true)}
            ${this._createInput('Author', 'author')}
            ${this._createInput('Headline', 'headline')}
            ${this._createInput('First published', 'first_published')}
            ${this._createInput('Genre', 'genre')}
            ${this._createInput('Language', 'language', false, 'en')}
            ${this._createSelect('Format', 'format', [['', 'Infer later'], ['zcode', 'Z-code'], ['glulx', 'Glulx'], ['tads3', 'TADS 3'], ['tads2', 'TADS 2']])}
            ${this._createSelect('Status', 'status', [['draft', 'Draft'], ['published', 'Published']])}
            ${this._createInput('Tags', 'tags')}
            ${this._createInput('License name', 'license_name')}
            ${this._createInput('License URL', 'license_url')}
            ${this._createInput('Source URL', 'source_url')}
          </div>
          ${this._createTextarea('Description', 'description')}
          ${this._createTextarea('License notes', 'license_notes', 'short')}
          ${this._createTextarea('Source notes', 'source_notes', 'short')}
          <div class="field">
            <label>Initial story file</label>
            <input type="file" name="file" accept=".z3,.z4,.z5,.z6,.z7,.z8,.zblorb,.zlb,.ulx,.gblorb,.glb,.t3" required ${state.saving ? 'disabled' : ''}>
            <span class="meta">Allowed: z3, z4, z5, z6, z7, z8, zblorb, zlb, ulx, gblorb, glb, t3.</span>
          </div>
          <div class="form-actions">
            <button class="button" type="button" data-action="cancel-create">Cancel</button>
            <button class="button primary" type="submit" ${state.saving ? 'disabled' : ''}>${state.saving ? 'Creating...' : 'Create Package'}</button>
          </div>
        </form>
      </section>
    `;
  }

  _createInput(label, name, required = false, value = '') {
    return `<div class="field"><label>${this._esc(label)}</label><input type="text" name="${this._esc(name)}" value="${this._esc(value)}" ${required ? 'required' : ''}></div>`;
  }

  _createTextarea(label, name, className = '') {
    return `<div class="field"><label>${this._esc(label)}</label><textarea class="${this._esc(className)}" name="${this._esc(name)}"></textarea></div>`;
  }

  _createSelect(label, name, options) {
    return `
      <div class="field">
        <label>${this._esc(label)}</label>
        <select name="${this._esc(name)}">
          ${options.map(([value, text]) => `<option value="${this._esc(value)}">${this._esc(text)}</option>`).join('')}
        </select>
      </div>
    `;
  }

  _importInspectPanel() {
    const state = this.state.importInspect || {};
    return `
      <section class="create-panel">
        <div class="editor-head">
          <div>
            <h2>Inspect Import</h2>
            <p class="meta">Inspect a <code>.terpvault.zip</code> package before installing it. Commit always installs as draft, rejects collisions, and never overwrites existing packages.</p>
          </div>
          <button class="button" type="button" data-action="cancel-import-inspect">Close</button>
        </div>
        ${state.error ? `<div class="message error">${this._esc(state.error)}</div>` : ''}
        ${state.success ? `<div class="message success">${this._esc(state.success)}</div>` : ''}
        <form data-import-inspect>
          <div class="field">
            <label>TerpVault package zip</label>
            <input type="file" accept=".zip,.terpvault.zip,application/zip" ${state.saving ? 'disabled' : ''}>
            <span class="meta">Inspection runs first. Commit revalidates the same uploaded zip server-side before installing.</span>
          </div>
          <div class="form-actions">
            <button class="button" type="button" data-action="cancel-import-inspect">Cancel</button>
            <button class="button primary" type="submit" ${state.saving ? 'disabled' : ''}>${state.saving ? 'Inspecting...' : 'Inspect Package'}</button>
          </div>
        </form>
        ${state.report ? this._importReport(state.report) : ''}
        ${state.report && state.report.ok ? this._importCommitPanel(state) : ''}
      </section>
    `;
  }

  _importReport(report) {
    const fatal = Array.isArray(report.fatal_errors) ? report.fatal_errors : [];
    const warnings = Array.isArray(report.warnings) ? report.warnings : [];
    const ignored = Array.isArray(report.ignored_files) ? report.ignored_files : [];
    const included = Array.isArray(report.included_files) ? report.included_files : [];
    return `
      <div class="box" style="margin-top:.85rem;">
        <h3>Inspection Report</h3>
        <div class="badges" style="justify-content:flex-start;margin:.45rem 0;">
          <span class="badge ${report.ok ? 'ok' : 'error'}">${report.ok ? 'ok' : 'blocked'}</span>
          <span class="badge ${report.has_collision ? 'warn' : 'ok'}">${report.has_collision ? 'slug collision' : 'no collision'}</span>
          <span class="badge ${report.has_ifiction ? 'ok' : 'warn'}">${report.has_ifiction ? 'iFiction found' : 'no iFiction XML'}</span>
        </div>
        <dl>
          <dt>Candidate slug</dt><dd><code>${this._esc(report.candidate_slug || '')}</code></dd>
          <dt>YAML slug</dt><dd><code>${this._esc(report.yaml_slug || 'Not recorded')}</code></dd>
          <dt>Top folder</dt><dd><code>${this._esc(report.top_folder || '')}</code></dd>
          <dt>Title</dt><dd>${this._esc(report.title || 'Not recorded')}</dd>
          <dt>Author</dt><dd>${this._esc(report.author || 'Not recorded')}</dd>
          <dt>Story file</dt><dd><code>${this._esc(report.story_file || '')}</code></dd>
          <dt>Story extension</dt><dd><code>${this._esc(report.story_extension || '')}</code></dd>
          <dt>Destination</dt><dd>${report.destination_exists ? 'Package folder already exists.' : 'No existing package folder detected.'}</dd>
        </dl>
        <p class="meta">Inspection does not create package files. Commit revalidates and installs as draft only.</p>
        ${this._reportList('Fatal errors', fatal, 'error')}
        ${this._reportList('Warnings', warnings, 'warn')}
        ${this._reportList('Ignored cruft', ignored)}
        ${this._reportList('Included files', included)}
      </div>
    `;
  }

  _importCommitPanel(state) {
    const report = state.report || {};
    const collision = Boolean(report.has_collision || report.destination_exists);
    return `
      <form data-import-commit style="margin-top:.85rem;">
        <div class="message ${collision ? 'error' : ''}">
          Imported packages are always installed as <strong>draft</strong>. Existing package folders are never overwritten.
        </div>
        <div class="field">
          <label>Final import slug</label>
          <input type="text" name="slug" value="${this._esc(state.finalSlug || report.candidate_slug || '')}" required ${state.committing ? 'disabled' : ''}>
          <span class="meta">${collision ? 'The inspected slug already exists. Choose a different slug before committing.' : 'The installed package folder and game.yaml slug/id will use this value.'}</span>
        </div>
        <div class="form-actions">
          <button class="button primary" type="submit" ${state.committing || !state.file ? 'disabled' : ''}>${state.committing ? 'Importing...' : 'Commit Import as Draft'}</button>
        </div>
      </form>
    `;
  }

  _reportList(label, items, tone = '') {
    if (!items.length) {
      return `<div class="warnings"><div class="warning ${this._esc(tone)}"><strong>${this._esc(label)}</strong><span class="meta">None.</span></div></div>`;
    }

    return `
      <div class="warnings">
        <div class="warning ${this._esc(tone)}">
          <strong>${this._esc(label)}</strong>
          <ul>
            ${items.slice(0, 40).map(item => `<li><code>${this._esc(item)}</code></li>`).join('')}
            ${items.length > 40 ? `<li class="meta">${items.length - 40} more not shown.</li>` : ''}
          </ul>
        </div>
      </div>
    `;
  }

  _bindLibraryActions() {
    const root = this.shadowRoot.getElementById('library');
    if (!root) {
      return;
    }

    root.querySelectorAll('[data-action="edit"]').forEach(button => {
      button.addEventListener('click', () => this._openEditor(button.dataset.slug || ''));
    });

    root.querySelectorAll('[data-action="cancel-edit"]').forEach(button => {
      button.addEventListener('click', () => this._closeEditor());
    });

    root.querySelectorAll('[data-action="create-package"]').forEach(button => {
      button.addEventListener('click', () => this._openCreatePackage());
    });

    root.querySelectorAll('[data-action="export"]').forEach(button => {
      button.addEventListener('click', () => this._exportPackage(button.dataset.slug || ''));
    });

    root.querySelectorAll('[data-action="inspect-import"]').forEach(button => {
      button.addEventListener('click', () => this._openImportInspect());
    });

    root.querySelectorAll('[data-action="cancel-import-inspect"]').forEach(button => {
      button.addEventListener('click', () => this._closeImportInspect());
    });

    root.querySelectorAll('[data-action="cancel-create"]').forEach(button => {
      button.addEventListener('click', () => this._closeCreatePackage());
    });

    root.querySelectorAll('form[data-import-inspect]').forEach(form => {
      form.addEventListener('submit', event => this._inspectImport(event));
    });

    root.querySelectorAll('form[data-import-commit]').forEach(form => {
      form.addEventListener('submit', event => this._commitImport(event));
    });

    root.querySelectorAll('form[data-create-package]').forEach(form => {
      form.addEventListener('submit', event => this._createPackage(event));
    });

    root.querySelectorAll('[data-action="helper-doc"]').forEach(button => {
      button.addEventListener('click', () => this._loadHelperDoc(button.dataset.slug || '', button.dataset.type || ''));
    });

    root.querySelectorAll('form[data-editor-slug]').forEach(form => {
      form.addEventListener('submit', event => this._saveEditor(event));
    });

    root.querySelectorAll('form[data-helper-slug]').forEach(form => {
      form.addEventListener('submit', event => this._saveHelperDoc(event));
    });

    root.querySelectorAll('form[data-media-slug]').forEach(form => {
      form.addEventListener('submit', event => this._uploadMedia(event));
    });

    root.querySelectorAll('form[data-story-slug]').forEach(form => {
      form.addEventListener('submit', event => this._uploadStory(event));
    });

    root.querySelectorAll('[data-action="screenshot-remove"]').forEach(button => {
      button.addEventListener('click', () => this._removeScreenshot(button.dataset.slug || '', Number(button.dataset.index || -1)));
    });

    root.querySelectorAll('[data-action="screenshot-move"]').forEach(button => {
      button.addEventListener('click', () => this._moveScreenshot(button.dataset.slug || '', Number(button.dataset.index || -1), Number(button.dataset.direction || 0)));
    });
  }

  _openCreatePackage() {
    this.state.create = { open: true, saving: false, error: '', success: '' };
    this._renderLibrary();
  }

  _closeCreatePackage() {
    this.state.create = { open: false, saving: false, error: '', success: '' };
    this._renderLibrary();
  }

  _openImportInspect() {
    this.state.importInspect = { open: true, saving: false, committing: false, error: '', success: '', report: null, file: null, finalSlug: '' };
    this._renderLibrary();
  }

  _closeImportInspect() {
    this.state.importInspect = { open: false, saving: false, committing: false, error: '', success: '', report: null, file: null, finalSlug: '' };
    this._renderLibrary();
  }

  async _inspectImport(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.querySelector('input[type="file"]');
    const file = input?.files?.[0];
    if (!file) {
      this.state.importInspect = { open: true, saving: false, committing: false, error: 'Choose a .terpvault.zip package before inspecting.', success: '', report: null, file: null, finalSlug: '' };
      this._renderLibrary();
      return;
    }

    const data = new FormData();
    data.append('file', file);
    this.state.importInspect = { open: true, saving: true, committing: false, error: '', success: '', report: null, file, finalSlug: '' };
    this._renderLibrary();

    try {
      const report = await this._requestJson(this._importInspectApiUrl(), {
        method: 'POST',
        body: data
      });
      this.state.importInspect = { open: true, saving: false, committing: false, error: '', success: '', report, file, finalSlug: report.candidate_slug || '' };
    } catch (error) {
      this.state.importInspect = { open: true, saving: false, committing: false, error: error.message || String(error), success: '', report: null, file, finalSlug: '' };
    }

    this._renderLibrary();
  }

  async _commitImport(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = this.state.importInspect.file;
    const slug = String(new FormData(form).get('slug') || '').trim();
    if (!file) {
      this.state.importInspect = {
        ...this.state.importInspect,
        committing: false,
        error: 'Inspect a .terpvault.zip package before committing import.',
        success: ''
      };
      this._renderLibrary();
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('slug', slug);
    this.state.importInspect = {
      ...this.state.importInspect,
      committing: true,
      error: '',
      success: '',
      finalSlug: slug
    };
    this._renderLibrary();

    try {
      const result = await this._requestJson(this._importCommitApiUrl(), {
        method: 'POST',
        body: data
      });

      if (result.ok === false) {
        this.state.importInspect = {
          ...this.state.importInspect,
          committing: false,
          error: 'Import validation failed during commit.',
          report: result.report || this.state.importInspect.report
        };
        this._renderLibrary();
        return;
      }

      const importedSlug = result.slug || slug;
      await this._reloadManifest();
      if (importedSlug) {
        localStorage.setItem(`terpvault.admin.open.${importedSlug}`, '1');
        this.state.editingSlug = importedSlug;
        const game = this._findGame(importedSlug) || {};
        this.state.editor = {
          ...this.state.editor,
          slug: importedSlug,
          loading: false,
          saving: false,
          error: '',
          success: 'Package imported as draft. Review metadata, helper docs, media, and story file before publishing.',
          values: this._editableFromGame(game),
          readOnly: this._readOnlyFromGame(game),
          activeHelper: 'how-to-play',
          helper: this._emptyHelperState('how-to-play'),
          media: this._mediaFromGame(game),
          story: this._storyFromGame(game)
        };
      }
      this.state.importInspect = {
        open: true,
        saving: false,
        committing: false,
        error: '',
        success: `Imported ${importedSlug} as a draft package.`,
        report: result.report || this.state.importInspect.report,
        file: null,
        finalSlug: importedSlug
      };
    } catch (error) {
      this.state.importInspect = {
        ...this.state.importInspect,
        committing: false,
        error: error.message || String(error),
        success: ''
      };
    }

    this._renderLibrary();
  }

  async _createPackage(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    this.state.create = { open: true, saving: true, error: '', success: '' };
    this._renderLibrary();

    try {
      const result = await this._requestJson(this._packagesApiUrl(), {
        method: 'POST',
        body: data
      });
      const slug = result.slug || data.get('slug');
      this.state.create = { open: false, saving: false, error: '', success: '' };
      await this._reloadManifest();
      if (slug) {
        localStorage.setItem(`terpvault.admin.open.${slug}`, '1');
        this.state.editingSlug = slug;
        this.state.editor = {
          ...this.state.editor,
          slug,
          loading: false,
          saving: false,
          error: '',
          success: 'Package created. Continue editing metadata, helper docs, media, or story file below.',
          values: this._editableFromGame(this._findGame(slug) || {}),
          readOnly: this._readOnlyFromGame(this._findGame(slug) || {}),
          activeHelper: 'how-to-play',
          helper: this._emptyHelperState('how-to-play'),
          media: this._mediaFromGame(this._findGame(slug) || {}),
          story: this._storyFromGame(this._findGame(slug) || {})
        };
        await this._loadHelperDoc(slug, 'how-to-play', false);
        await this._loadStory(slug, false);
        await this._loadMedia(slug, false);
      }
    } catch (error) {
      this.state.create = {
        open: true,
        saving: false,
        error: error.message || String(error),
        success: ''
      };
    }

    this._renderLibrary();
  }

  async _openEditor(slug) {
    if (!slug) {
      return;
    }

    const game = this._findGame(slug);
    this.state.editingSlug = slug;
    this.state.editor = {
      slug,
      loading: true,
      saving: false,
      error: '',
      success: '',
      values: this._editableFromGame(game || {}),
      readOnly: this._readOnlyFromGame(game || {}),
      activeHelper: 'how-to-play',
      helper: this._emptyHelperState('how-to-play'),
      media: this._mediaFromGame(game || {}),
      story: this._storyFromGame(game || {})
    };
    localStorage.setItem(`terpvault.admin.open.${slug}`, '1');
    this._renderLibrary();

    try {
      const data = await this._requestJson(this._metadataApiUrl(slug), { method: 'GET' });
      this.state.editor = {
        ...this.state.editor,
        loading: false,
        values: this._editableFromApi(data, game || {}),
        readOnly: this._readOnlyFromApi(data, game || {})
      };
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        loading: false,
        error: `Metadata API unavailable: ${error.message || error}`
      };
    }

    await this._loadHelperDoc(slug, this.state.editor.activeHelper, false);
    await this._loadStory(slug, false);
    await this._loadMedia(slug, false);
    this._renderLibrary();
  }

  _closeEditor() {
    this.state.editingSlug = null;
    this.state.editor = {
      slug: null,
      loading: false,
      saving: false,
      error: '',
      success: '',
      values: null,
      readOnly: null,
      activeHelper: 'how-to-play',
      helper: this._emptyHelperState('how-to-play'),
      media: this._emptyMediaState(),
      story: this._emptyStoryState()
    };
    this._renderLibrary();
  }

  async _saveEditor(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const slug = form.dataset.editorSlug || this.state.editingSlug;
    const metadata = this._collectEditorValues(form);

    this.state.editor = {
      ...this.state.editor,
      slug,
      saving: true,
      error: '',
      success: '',
      values: metadata
    };
    this._renderLibrary();

    try {
      const data = await this._requestJson(this._metadataApiUrl(slug), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata })
      });
      this.state.editor = {
        ...this.state.editor,
        saving: false,
        success: 'Metadata saved. A package-local backup was created before writing.',
        values: this._editableFromApi(data, this._findGame(slug) || {}),
        readOnly: this._readOnlyFromApi(data, this._findGame(slug) || {})
      };
      await this._reloadManifest();
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        saving: false,
        error: error.message || String(error),
        values: metadata
      };
    }

    this._renderLibrary();
  }

  async _reloadManifest() {
    try {
      const data = await this._requestJson(this._manifestUrl(), { method: 'GET' });
      this.state.games = Array.isArray(data.games) ? data.games : [];
      this.state.formats = data.formats || this._fallbackFormats();
      this.state.status = data;
      this.state.source = 'public read-only manifest';
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        error: this.state.editor.error || `Saved, but the package manifest could not be refreshed: ${error.message || error}`
      };
    }
  }

  async _loadHelperDoc(slug, type, render = true) {
    if (!slug || !this._helperTypes().includes(type)) {
      return;
    }

    const current = this.state.editor.helper || this._emptyHelperState(type);
    this.state.editor = {
      ...this.state.editor,
      activeHelper: type,
      helper: {
        ...this._emptyHelperState(type),
        content: current.type === type ? current.content || '' : '',
        loading: true
      }
    };

    if (render) {
      this._renderLibrary();
    }

    try {
      const data = await this._requestJson(this._markdownApiUrl(slug, type), { method: 'GET' });
      this.state.editor = {
        ...this.state.editor,
        activeHelper: type,
        helper: this._helperFromApi(data, type)
      };
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        activeHelper: type,
        helper: {
          ...this.state.editor.helper,
          loading: false,
          saving: false,
          error: `Helper Markdown API unavailable: ${error.message || error}`
        }
      };
    }

    if (render) {
      this._renderLibrary();
    }
  }

  async _saveHelperDoc(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const slug = form.dataset.helperSlug || this.state.editingSlug;
    const type = form.dataset.helperType || this.state.editor.activeHelper || 'how-to-play';
    const content = form.querySelector('[data-helper-content]')?.value || '';

    this.state.editor = {
      ...this.state.editor,
      activeHelper: type,
      helper: {
        ...(this.state.editor.helper || this._emptyHelperState(type)),
        type,
        saving: true,
        error: '',
        success: '',
        content
      }
    };
    this._renderLibrary();

    try {
      const data = await this._requestJson(this._markdownApiUrl(slug, type), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const helper = this._helperFromApi(data, type);
      this.state.editor = {
        ...this.state.editor,
        activeHelper: type,
        helper: {
          ...helper,
          success: 'Helper Markdown saved. A package-local backup was created when an existing file was replaced.'
        }
      };
      await this._reloadManifest();
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        activeHelper: type,
        helper: {
          ...(this.state.editor.helper || this._emptyHelperState(type)),
          type,
          saving: false,
          error: error.message || String(error),
          content
        }
      };
    }

    this._renderLibrary();
  }

  async _loadStory(slug, render = true) {
    if (!slug) {
      return;
    }

    this.state.editor = {
      ...this.state.editor,
      story: {
        ...(this.state.editor.story || this._emptyStoryState()),
        loading: true,
        error: '',
        success: ''
      }
    };

    if (render) {
      this._renderLibrary();
    }

    try {
      const data = await this._requestJson(this._storyApiUrl(slug), { method: 'GET' });
      this.state.editor = {
        ...this.state.editor,
        story: this._storyFromApi(data, this._findGame(slug) || {})
      };
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        story: {
          ...(this.state.editor.story || this._emptyStoryState()),
          loading: false,
          error: `Story API unavailable: ${error.message || error}`
        }
      };
    }

    if (render) {
      this._renderLibrary();
    }
  }

  async _uploadStory(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const slug = form.dataset.storySlug || this.state.editingSlug;
    const input = form.querySelector('input[type="file"]');
    const file = input?.files?.[0];
    if (!file) {
      this.state.editor = {
        ...this.state.editor,
        story: {
          ...(this.state.editor.story || this._emptyStoryState()),
          error: 'Choose a story file before uploading.',
          success: ''
        }
      };
      this._renderLibrary();
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.state.editor = {
      ...this.state.editor,
      story: {
        ...(this.state.editor.story || this._emptyStoryState()),
        saving: true,
        error: '',
        success: ''
      }
    };
    this._renderLibrary();

    try {
      const data = await this._requestJson(this._storyApiUrl(slug), {
        method: 'POST',
        body: formData
      });
      this.state.editor = {
        ...this.state.editor,
        story: {
          ...this._storyFromApi(data, this._findGame(slug) || {}),
          success: 'Story file uploaded and game.yaml updated. Existing story file data was backed up when present.'
        }
      };
      await this._reloadManifest();
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        story: {
          ...(this.state.editor.story || this._emptyStoryState()),
          saving: false,
          error: error.message || String(error)
        }
      };
    }

    this._renderLibrary();
  }

  async _loadMedia(slug, render = true) {
    if (!slug) {
      return;
    }

    this.state.editor = {
      ...this.state.editor,
      media: {
        ...(this.state.editor.media || this._emptyMediaState()),
        loading: true,
        error: '',
        success: ''
      }
    };

    if (render) {
      this._renderLibrary();
    }

    try {
      const data = await this._requestJson(this._mediaApiUrl(slug), { method: 'GET' });
      this.state.editor = {
        ...this.state.editor,
        media: this._mediaFromApi(data, this._findGame(slug) || {})
      };
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        media: {
          ...(this.state.editor.media || this._emptyMediaState()),
          loading: false,
          error: `Media API unavailable: ${error.message || error}`
        }
      };
    }

    if (render) {
      this._renderLibrary();
    }
  }

  async _uploadMedia(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const slug = form.dataset.mediaSlug || this.state.editingSlug;
    const type = form.dataset.mediaType || '';
    const replacePath = form.dataset.replacePath || '';
    const replaceIndex = form.dataset.replaceIndex || '';
    const savingKey = replaceIndex !== '' ? `screenshot-${replaceIndex}` : type;
    const input = form.querySelector('input[type="file"]');
    const file = input?.files?.[0];
    if (!file) {
      this.state.editor = {
        ...this.state.editor,
        media: {
          ...(this.state.editor.media || this._emptyMediaState()),
          error: 'Choose an image file before uploading.',
          success: ''
        }
      };
      this._renderLibrary();
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (replacePath) {
      formData.append('replace_path', replacePath);
    }
    if (replaceIndex !== '') {
      formData.append('replace_index', replaceIndex);
    }

    this.state.editor = {
      ...this.state.editor,
      media: {
        ...(this.state.editor.media || this._emptyMediaState()),
        saving: savingKey,
        error: '',
        success: ''
      }
    };
    this._renderLibrary();

    try {
      const data = await this._requestJson(this._mediaUploadApiUrl(slug, type), {
        method: 'POST',
        body: formData
      });
      const media = this._mediaFromApi(data, this._findGame(slug) || {});
      this.state.editor = {
        ...this.state.editor,
        media: {
          ...media,
          success: 'Media uploaded and package metadata updated.'
        }
      };
      await this._reloadManifest();
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        media: {
          ...(this.state.editor.media || this._emptyMediaState()),
          saving: '',
          error: error.message || String(error)
        }
      };
    }

    this._renderLibrary();
  }

  async _removeScreenshot(slug, index) {
    const screenshots = this._currentScreenshotPaths();
    if (!slug || index < 0 || index >= screenshots.length) {
      return;
    }

    screenshots.splice(index, 1);
    await this._saveScreenshotList(slug, screenshots, 'Screenshot removed from package metadata. The image file was not deleted.');
  }

  async _moveScreenshot(slug, index, direction) {
    const screenshots = this._currentScreenshotPaths();
    const target = index + direction;
    if (!slug || index < 0 || target < 0 || index >= screenshots.length || target >= screenshots.length) {
      return;
    }

    const [item] = screenshots.splice(index, 1);
    screenshots.splice(target, 0, item);
    await this._saveScreenshotList(slug, screenshots, 'Screenshot order updated.');
  }

  async _saveScreenshotList(slug, screenshots, success) {
    this.state.editor = {
      ...this.state.editor,
      media: {
        ...(this.state.editor.media || this._emptyMediaState()),
        saving: 'screenshots',
        error: '',
        success: ''
      }
    };
    this._renderLibrary();

    try {
      const data = await this._requestJson(this._screenshotsApiUrl(slug), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screenshots })
      });
      const media = this._mediaFromApi(data, this._findGame(slug) || {});
      this.state.editor = {
        ...this.state.editor,
        media: {
          ...media,
          success
        }
      };
      await this._reloadManifest();
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        media: {
          ...(this.state.editor.media || this._emptyMediaState()),
          saving: '',
          error: error.message || String(error)
        }
      };
    }

    this._renderLibrary();
  }

  async _exportPackage(slug) {
    if (!slug) {
      return;
    }

    this.state.export = { slug, saving: true, error: '', success: '' };
    this._renderLibrary();

    try {
      const response = await fetch(this._exportApiUrl(slug), {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/zip',
          ...this._apiAuthHeaders()
        }
      });

      if (!response.ok) {
        const text = await response.text();
        const payload = this._unwrapApiResponse(this._parseJson(text));
        throw new Error(payload.message || payload.error || text || `HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const filename = this._downloadFilename(response.headers.get('Content-Disposition'), `${slug}.terpvault.zip`);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      this.state.export = { slug, saving: false, error: '', success: `Exported ${filename}.` };
    } catch (error) {
      this.state.export = { slug, saving: false, error: error.message || String(error), success: '' };
    }

    this._renderLibrary();
  }

  _exportMessage(slug) {
    const state = this.state.export || {};
    if (state.slug !== slug) {
      return '';
    }

    if (state.error) {
      return `<div class="message error">${this._esc(state.error)}</div>`;
    }

    if (state.success) {
      return `<div class="message success">${this._esc(state.success)}</div>`;
    }

    return '';
  }

  _editorPanel(game) {
    const editor = this.state.editor || {};
    const values = editor.values || this._editableFromGame(game);
    const readOnly = editor.readOnly || this._readOnlyFromGame(game);
    const slug = editor.slug || game.slug || '';

    return `
      <div class="editor">
        <div class="editor-head">
          <div>
            <h3>Edit Metadata</h3>
            <p class="meta">Only whitelisted <code>game.yaml</code> metadata fields and package-local helper Markdown files are writable. Story files, assets, package folder, and player settings are display-only.</p>
          </div>
          <button class="button" type="button" data-action="cancel-edit">Close</button>
        </div>
        ${editor.loading ? '<div class="message">Loading editable metadata from the Admin2 API...</div>' : ''}
        ${editor.error ? `<div class="message error">${this._esc(editor.error)}</div>` : ''}
        ${editor.success ? `<div class="message success">${this._esc(editor.success)}</div>` : ''}
        <form data-editor-slug="${this._esc(slug)}">
          <div class="fieldsets">
            <fieldset>
              <legend>Bibliographic</legend>
              ${this._input('Title', 'bibliographic.title', values)}
              ${this._input('Author', 'bibliographic.author', values)}
              ${this._input('Headline', 'bibliographic.headline', values)}
              ${this._input('First published', 'bibliographic.first_published', values)}
              ${this._input('Genre', 'bibliographic.genre', values)}
              ${this._input('Language', 'bibliographic.language', values)}
              ${this._textarea('Description', 'bibliographic.description', values)}
            </fieldset>
            <fieldset>
              <legend>Identification</legend>
              ${this._select('Format', 'identification.format', values, [
                ['', 'Unspecified'],
                ['zcode', 'Z-code'],
                ['glulx', 'Glulx'],
                ['tads2', 'TADS 2'],
                ['tads3', 'TADS 3'],
                ['hugo', 'Hugo'],
                ['adrift', 'ADRIFT']
              ])}
              ${this._textarea('IFIDs', 'identification.ifids', values, 'short', 'One IFID per line, or comma-separated.')}
            </fieldset>
            <fieldset>
              <legend>Catalog</legend>
              ${this._input('IFDB TUID', 'catalog.ifdb.tuid', values)}
              ${this._input('IFDB URL', 'catalog.ifdb.url', values)}
              ${this._input('IFWiki URL', 'catalog.ifwiki.url', values)}
              ${this._input('IF Archive path', 'catalog.ifarchive.path', values)}
              ${this._input('IF Archive URL', 'catalog.ifarchive.url', values)}
            </fieldset>
            <fieldset>
              <legend>Release & Provenance</legend>
              ${this._input('License name', 'release.license.name', values)}
              ${this._input('License URL', 'release.license.url', values)}
              ${this._textarea('License notes', 'release.license.notes', values, 'short')}
              ${this._input('Source URL', 'release.source.url', values)}
              ${this._input('Source retrieved', 'release.source.retrieved', values)}
              ${this._textarea('Source notes', 'release.source.notes', values, 'short')}
            </fieldset>
            <fieldset>
              <legend>TerpVault</legend>
              ${this._select('Status', 'terpvault.status', values, [['draft', 'Draft'], ['published', 'Published']])}
              <div class="checkbox">
                <input id="tv-featured-${this._esc(slug)}" type="checkbox" name="terpvault.featured" ${this._get(values, 'terpvault.featured') ? 'checked' : ''}>
                <label for="tv-featured-${this._esc(slug)}">Featured</label>
              </div>
              ${this._textarea('Tags', 'terpvault.tags', values, 'short', 'One tag per line, or comma-separated.')}
            </fieldset>
            <fieldset>
              <legend>Read-only package files</legend>
              ${this._readOnlyList(readOnly)}
            </fieldset>
          </div>
          <div class="form-actions">
            <button class="button" type="button" data-action="cancel-edit">Cancel</button>
            <button class="button primary" type="submit" ${editor.loading || editor.saving ? 'disabled' : ''}>${editor.saving ? 'Saving...' : 'Save Metadata'}</button>
          </div>
        </form>
        ${this._storyPanel(game, slug)}
        ${this._mediaPanel(game, slug)}
        ${this._helperDocsPanel(slug)}
      </div>
    `;
  }

  _storyPanel(game, slug) {
    const story = this.state.editor.story || this._storyFromGame(game);
    const size = story.size ? this._formatBytes(story.size) : 'Unknown';
    return `
      <section class="story-manager">
        <h3>Story File</h3>
        <p class="meta">Replacing the story file may affect playability. The existing registered story file will be backed up when present.</p>
        ${story.loading ? '<div class="message">Loading story file info...</div>' : ''}
        ${story.error ? `<div class="message error">${this._esc(story.error)}</div>` : ''}
        ${story.success ? `<div class="message success">${this._esc(story.success)}</div>` : ''}
        <dl>
          <dt>Path</dt><dd><code>${this._esc(story.story_file || 'Not recorded')}</code></dd>
          <dt>Exists</dt><dd>${story.exists ? 'Yes' : 'No'}</dd>
          <dt>Extension</dt><dd><code>${this._esc(story.extension || 'Unknown')}</code></dd>
          <dt>Size</dt><dd>${this._esc(size)}</dd>
        </dl>
        <form data-story-slug="${this._esc(slug)}">
          <div class="field">
            <label>Replace Story File</label>
            <input type="file" accept=".z3,.z4,.z5,.z6,.z7,.z8,.zblorb,.zlb,.ulx,.gblorb,.glb,.t3" ${story.loading || story.saving ? 'disabled' : ''}>
            <span class="meta">Allowed: z3, z4, z5, z6, z7, z8, zblorb, zlb, ulx, gblorb, glb, t3. Archives, scripts, HTML, SVG, and arbitrary files are not accepted.</span>
          </div>
          <div class="form-actions">
            <button class="button primary" type="submit" ${story.loading || story.saving ? 'disabled' : ''}>${story.saving ? 'Uploading...' : 'Upload Story File'}</button>
          </div>
        </form>
      </section>
    `;
  }

  _mediaPanel(game, slug) {
    const media = this.state.editor.media || this._mediaFromGame(game);
    const urls = game.urls || {};
    const screenshots = Array.isArray(urls.screenshots) ? urls.screenshots : (Array.isArray(game.screenshots) ? game.screenshots : []);

    return `
      <section class="media-manager">
        <h3>Media</h3>
        <p class="meta">Media Manager Lite accepts package-local jpg, png, and webp images only. Story files, imports, deletes, and arbitrary file management are not available here.</p>
        ${media.loading ? '<div class="message">Loading media inventory...</div>' : ''}
        ${media.error ? `<div class="message error">${this._esc(media.error)}</div>` : ''}
        ${media.success ? `<div class="message success">${this._esc(media.success)}</div>` : ''}
        <div class="media-grid">
          ${this._mediaCard('Cover', urls.cover, media.resources?.cover || '')}
          ${this._mediaCard('Small Cover', urls.small_cover || urls.thumbnail, media.resources?.small_cover || '')}
        </div>
        <div class="screenshot-list">
          <strong>Screenshots</strong>
          <p class="meta">Remove only updates <code>resources.screenshots</code>; it does not delete the underlying image file.</p>
          ${screenshots.length ? screenshots.map((url, index) => this._screenshotRow(slug, url, media.resources?.screenshots?.[index] || '', index, screenshots.length, media.saving === 'screenshots' || media.saving === `screenshot-${index}`)).join('') : '<p class="meta">No screenshots recorded.</p>'}
        </div>
        <div class="media-uploads">
          ${this._mediaUploadForm(slug, 'cover', 'Replace cover', media.saving === 'cover')}
          ${this._mediaUploadForm(slug, 'small-cover', 'Replace small cover', media.saving === 'small-cover')}
          ${this._mediaUploadForm(slug, 'screenshot', 'Add screenshot', media.saving === 'screenshot')}
        </div>
      </section>
    `;
  }

  _screenshotRow(slug, url, path, index, count, saving) {
    return `
      <div class="screenshot-row">
        ${url ? `<img src="${this._esc(url)}" alt="">` : '<div class="placeholder"><span class="meta">No image</span></div>'}
        <div>
          <strong>Screenshot ${index + 1}</strong>
          <p class="meta">${path ? `<code>${this._esc(path)}</code>` : 'Path not recorded'}</p>
          <div class="screenshot-actions">
            <button class="button" type="button" data-action="screenshot-move" data-slug="${this._esc(slug)}" data-index="${index}" data-direction="-1" ${index === 0 || saving ? 'disabled' : ''}>Move up</button>
            <button class="button" type="button" data-action="screenshot-move" data-slug="${this._esc(slug)}" data-index="${index}" data-direction="1" ${index >= count - 1 || saving ? 'disabled' : ''}>Move down</button>
            <button class="button" type="button" data-action="screenshot-remove" data-slug="${this._esc(slug)}" data-index="${index}" ${saving ? 'disabled' : ''}>Remove from package</button>
          </div>
          ${path ? this._mediaUploadForm(slug, 'screenshot', 'Replace this screenshot', saving, path, index) : ''}
        </div>
      </div>
    `;
  }

  _mediaCard(label, url, path) {
    return `
      <div class="media-card">
        ${url ? `<img src="${this._esc(url)}" alt="">` : '<div class="placeholder"><span class="meta">No image</span></div>'}
        <strong>${this._esc(label)}</strong>
        <p class="meta">${path ? `<code>${this._esc(path)}</code>` : 'Not recorded'}</p>
      </div>
    `;
  }

  _mediaUploadForm(slug, type, label, saving, replacePath = '', replaceIndex = '') {
    return `
      <form data-media-slug="${this._esc(slug)}" data-media-type="${this._esc(type)}" ${replacePath ? `data-replace-path="${this._esc(replacePath)}"` : ''} ${replaceIndex !== '' ? `data-replace-index="${this._esc(replaceIndex)}"` : ''}>
        <div class="field">
          <label>${this._esc(label)}</label>
          <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" ${saving ? 'disabled' : ''}>
        </div>
        <div class="form-actions">
          <button class="button primary" type="submit" ${saving ? 'disabled' : ''}>${saving ? 'Uploading...' : 'Upload'}</button>
        </div>
      </form>
    `;
  }

  _helperDocsPanel(slug) {
    const editor = this.state.editor || {};
    const helper = editor.helper || this._emptyHelperState(editor.activeHelper || 'how-to-play');
    const active = editor.activeHelper || helper.type || 'how-to-play';
    const labels = {
      'how-to-play': 'How to Play',
      hints: 'Hints',
      walkthrough: 'Walkthrough'
    };

    return `
      <section class="helper-docs">
        <h3>Helper Docs</h3>
        <p class="meta">Plain Markdown editor for package-local curator/helper content. This does not edit story files, artwork, iFiction XML, or player config.</p>
        <div class="helper-tabs" role="tablist" aria-label="Helper Markdown files">
          ${Object.entries(labels).map(([type, label]) => `
            <button class="button" type="button" role="tab" aria-selected="${active === type ? 'true' : 'false'}" data-action="helper-doc" data-slug="${this._esc(slug)}" data-type="${this._esc(type)}">${this._esc(label)}</button>
          `).join('')}
        </div>
        ${helper.loading ? '<div class="message">Loading helper Markdown...</div>' : ''}
        ${helper.error ? `<div class="message error">${this._esc(helper.error)}</div>` : ''}
        ${helper.success ? `<div class="message success">${this._esc(helper.success)}</div>` : ''}
        <form data-helper-slug="${this._esc(slug)}" data-helper-type="${this._esc(active)}">
          <div class="field">
            <label>${this._esc(helper.label || labels[active] || 'Helper Markdown')}</label>
            <textarea class="markdown" data-helper-content ${helper.loading || helper.saving ? 'disabled' : ''}>${this._esc(helper.content || '')}</textarea>
            <span class="meta">
              ${helper.path ? `<code>${this._esc(helper.path)}</code>` : 'Path is resolved from the package resource field or the default helper filename.'}
              ${helper.exists ? '' : ' This helper file does not exist yet; saving will create the default package-local Markdown file.'}
            </span>
          </div>
          <div class="form-actions">
            <button class="button primary" type="submit" ${helper.loading || helper.saving ? 'disabled' : ''}>${helper.saving ? 'Saving...' : 'Save Helper Markdown'}</button>
          </div>
        </form>
      </section>
    `;
  }

  _input(label, path, values) {
    return `
      <div class="field">
        <label>${this._esc(label)}</label>
        <input type="text" name="${this._esc(path)}" value="${this._esc(this._get(values, path) || '')}">
      </div>
    `;
  }

  _textarea(label, path, values, className = '', help = '') {
    const value = this._asText(this._get(values, path));
    return `
      <div class="field">
        <label>${this._esc(label)}</label>
        <textarea class="${this._esc(className)}" name="${this._esc(path)}">${this._esc(value)}</textarea>
        ${help ? `<span class="meta">${this._esc(help)}</span>` : ''}
      </div>
    `;
  }

  _select(label, path, values, options) {
    const value = String(this._get(values, path) || '');
    return `
      <div class="field">
        <label>${this._esc(label)}</label>
        <select name="${this._esc(path)}">
          ${options.map(([optionValue, optionLabel]) => `<option value="${this._esc(optionValue)}" ${value === optionValue ? 'selected' : ''}>${this._esc(optionLabel)}</option>`).join('')}
        </select>
      </div>
    `;
  }

  _readOnlyList(readOnly) {
    const rows = [
      ['Slug', readOnly.slug],
      ['Story file', readOnly.story_file],
      ['Cover', readOnly.cover],
      ['Small cover', readOnly.small_cover],
      ['Screenshots', this._asText(readOnly.screenshots)],
      ['How-to-play', readOnly.how_to_play],
      ['Hints', readOnly.hints],
      ['Walkthrough', readOnly.walkthrough],
      ['Player', readOnly.player]
    ].filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '');

    if (!rows.length) {
      return '<p class="meta">No read-only package file paths were exposed by the manifest.</p>';
    }

    return `<div class="readonly">${rows.map(([label, value]) => `<div><span>${this._esc(label)}</span><code>${this._esc(value)}</code></div>`).join('')}</div>`;
  }

  _collectEditorValues(form) {
    const metadata = {};
    new FormData(form).forEach((value, path) => {
      this._set(metadata, path, String(value));
    });

    this._set(metadata, 'terpvault.featured', form.querySelector('[name="terpvault.featured"]')?.checked || false);
    return metadata;
  }

  _editableFromApi(data, fallbackGame) {
    const payload = this._unwrapApiResponse(data);
    const editable = payload.editable || {};
    if (Object.keys(editable).length) {
      return editable;
    }

    return this._editableFromGame(fallbackGame);
  }

  _editableFromGame(game = {}) {
    const license = game.release?.license || game.license || {};
    const source = game.release?.source || game.source || {};
    return {
      bibliographic: {
        title: game.bibliographic?.title || game.title || '',
        author: game.bibliographic?.author || game.author || '',
        headline: game.bibliographic?.headline || game.tagline || '',
        first_published: game.bibliographic?.first_published || game.year || '',
        genre: game.bibliographic?.genre || game.genre || '',
        language: game.bibliographic?.language || game.language || '',
        description: game.bibliographic?.description || game.description || ''
      },
      identification: {
        format: game.identification?.format || game.format || '',
        ifids: game.identification?.ifids || game.ifids || []
      },
      catalog: {
        ifdb: {
          tuid: game.catalog?.ifdb?.tuid || '',
          url: game.catalog?.ifdb?.url || ''
        },
        ifwiki: {
          url: game.catalog?.ifwiki?.url || ''
        },
        ifarchive: {
          path: game.catalog?.ifarchive?.path || '',
          url: game.catalog?.ifarchive?.url || ''
        }
      },
      release: {
        license: {
          name: license.name || '',
          url: license.url || '',
          notes: license.notes || ''
        },
        source: {
          url: source.url || '',
          retrieved: source.retrieved || '',
          notes: source.notes || ''
        }
      },
      terpvault: {
        status: game.terpvault?.status || game.status || 'draft',
        featured: Boolean(game.terpvault?.featured || game.featured),
        tags: game.terpvault?.tags || game.tags || []
      }
    };
  }

  _readOnlyFromApi(data, fallbackGame) {
    const payload = this._unwrapApiResponse(data);
    const metadata = payload.metadata || {};
    const resources = metadata.resources || {};
    return {
      ...this._readOnlyFromGame(fallbackGame),
      slug: payload.slug || fallbackGame.slug || '',
      story_file: resources.story_file || fallbackGame.story_file || '',
      cover: resources.cover || fallbackGame.cover || '',
      small_cover: resources.small_cover || fallbackGame.small_cover || '',
      screenshots: resources.screenshots || fallbackGame.screenshots || [],
      how_to_play: resources.how_to_play || fallbackGame.how_to_play || '',
      hints: resources.hints || fallbackGame.hints || '',
      walkthrough: resources.walkthrough || fallbackGame.walkthrough || '',
      player: metadata.player?.engine || fallbackGame.player_engine || fallbackGame.player || ''
    };
  }

  _readOnlyFromGame(game = {}) {
    return {
      slug: game.slug || '',
      story_file: game.story_file || game.resources?.story_file || '',
      cover: game.cover || game.resources?.cover || '',
      small_cover: game.small_cover || game.resources?.small_cover || '',
      screenshots: game.screenshots || game.resources?.screenshots || [],
      how_to_play: game.how_to_play || game.resources?.how_to_play || '',
      hints: game.hints || game.resources?.hints || '',
      walkthrough: game.walkthrough || game.resources?.walkthrough || '',
      player: game.player_engine || game.player?.engine || ''
    };
  }

  _metadataApiUrl(slug) {
    return `${this._apiBase()}/terpvault/packages/${encodeURIComponent(slug)}/metadata`;
  }

  _packagesApiUrl() {
    return `${this._apiBase()}/terpvault/packages`;
  }

  _exportApiUrl(slug) {
    return `${this._apiBase()}/terpvault/packages/${encodeURIComponent(slug)}/export`;
  }

  _importInspectApiUrl() {
    return `${this._apiBase()}/terpvault/packages/import/inspect`;
  }

  _importCommitApiUrl() {
    return `${this._apiBase()}/terpvault/packages/import`;
  }

  _markdownApiUrl(slug, type) {
    return `${this._apiBase()}/terpvault/packages/${encodeURIComponent(slug)}/markdown/${encodeURIComponent(type)}`;
  }

  _mediaApiUrl(slug) {
    return `${this._apiBase()}/terpvault/packages/${encodeURIComponent(slug)}/media`;
  }

  _storyApiUrl(slug) {
    return `${this._apiBase()}/terpvault/packages/${encodeURIComponent(slug)}/story`;
  }

  _mediaUploadApiUrl(slug, type) {
    return `${this._apiBase()}/terpvault/packages/${encodeURIComponent(slug)}/media/${encodeURIComponent(type)}`;
  }

  _screenshotsApiUrl(slug) {
    return `${this._apiBase()}/terpvault/packages/${encodeURIComponent(slug)}/media/screenshots`;
  }

  _apiBase() {
    const explicit = [
      window.__TERPVAULT_API_BASE,
      window.__GRAV_API_BASE,
      window.__GRAV_API_URL,
      window.GravAdmin?.config?.api_url,
      window.GravAdmin?.config?.api_base
    ].find(Boolean);
    const versionPrefix = [
      window.__GRAV_API_VERSION_PREFIX,
      window.GravAdmin?.config?.api_version_prefix,
      window.GravAdmin?.config?.api?.version_prefix
    ].find(Boolean);

    if (explicit) {
      const base = this._withApiVersion(String(explicit).replace(/\/+$/g, ''), versionPrefix);
      if (/^https?:\/\//i.test(base)) {
        return base;
      }
      return `${this._siteBase()}/${base.replace(/^\/+|\/+$/g, '')}`.replace(/([^:]\/)\/+/g, '$1').replace(/\/+$/g, '');
    }

    const prefix = [
      window.__GRAV_API_PREFIX,
      window.GravAdmin?.config?.api_prefix,
      window.GravAdmin?.config?.api?.prefix
    ].find(Boolean) || '/api/v1';
    const normalizedPrefix = this._withApiVersion(String(prefix), versionPrefix);

    if (/^https?:\/\//i.test(normalizedPrefix)) {
      return normalizedPrefix.replace(/\/+$/g, '');
    }

    return `${this._siteBase()}/${normalizedPrefix.replace(/^\/+|\/+$/g, '')}`.replace(/([^:]\/)\/+/g, '$1').replace(/\/+$/g, '');
  }

  _withApiVersion(base, versionPrefix) {
    if (!versionPrefix) {
      return base;
    }

    const version = String(versionPrefix).replace(/^\/+|\/+$/g, '');
    if (!version || new RegExp(`/${version}$`).test(base)) {
      return base;
    }

    return `${base.replace(/\/+$/g, '')}/${version}`;
  }

  async _requestJson(url, options = {}) {
    const headers = {
      Accept: 'application/json',
      ...this._apiAuthHeaders(),
      ...(options.headers || {})
    };

    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers
    });
    const text = await response.text();
    const json = text ? this._parseJson(text) : {};
    if (!response.ok) {
      const payload = this._unwrapApiResponse(json);
      throw new Error(payload.message || payload.error || text || `HTTP ${response.status}`);
    }

    return this._unwrapApiResponse(json);
  }

  _apiAuthHeaders() {
    const headers = {};
    const token = window.__GRAV_API_TOKEN || window.GravAdmin?.config?.api_token || window.GravAdmin?.config?.token;
    if (token) {
      headers['X-API-Token'] = token;
    }

    try {
      const stored = JSON.parse(localStorage.getItem('grav_admin_auth') || '{}');
      if (stored?.access_token && !headers['X-API-Token']) {
        headers['X-API-Token'] = stored.access_token;
      }
      if (stored?.environment) {
        headers['X-Grav-Environment'] = stored.environment;
      }
    } catch (e) {}

    return headers;
  }

  _unwrapApiResponse(data) {
    if (data && typeof data === 'object' && data.data && typeof data.data === 'object') {
      return data.data;
    }

    return data || {};
  }

  _parseJson(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return { message: text };
    }
  }

  _downloadFilename(disposition, fallback) {
    const value = disposition || '';
    const utf8 = value.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8) {
      try {
        return decodeURIComponent(utf8[1].replace(/"/g, ''));
      } catch (e) {}
    }

    const plain = value.match(/filename="?([^";]+)"?/i);
    if (plain) {
      return plain[1];
    }

    return fallback;
  }

  _findGame(slug) {
    return (this.state.games || []).find(game => game.slug === slug);
  }

  _helperTypes() {
    return ['how-to-play', 'hints', 'walkthrough'];
  }

  _emptyHelperState(type) {
    const labels = {
      'how-to-play': 'How to Play',
      hints: 'Hints',
      walkthrough: 'Walkthrough'
    };

    return {
      type,
      loading: false,
      saving: false,
      error: '',
      success: '',
      label: labels[type] || 'Helper Markdown',
      path: '',
      exists: false,
      content: ''
    };
  }

  _helperFromApi(data, fallbackType) {
    const payload = this._unwrapApiResponse(data);
    const type = payload.type || fallbackType;
    return {
      ...this._emptyHelperState(type),
      type,
      label: payload.label || this._emptyHelperState(type).label,
      path: payload.relative_path || payload.path || '',
      exists: Boolean(payload.exists),
      content: payload.content || ''
    };
  }

  _emptyMediaState() {
    return {
      loading: false,
      saving: '',
      error: '',
      success: '',
      resources: {
        cover: '',
        small_cover: '',
        screenshots: []
      }
    };
  }

  _emptyStoryState() {
    return {
      loading: false,
      saving: false,
      error: '',
      success: '',
      story_file: '',
      exists: false,
      extension: '',
      size: 0
    };
  }

  _storyFromApi(data, fallbackGame) {
    const payload = this._unwrapApiResponse(data);
    return {
      ...this._emptyStoryState(),
      story_file: payload.story_file || payload.relative_path || fallbackGame.story_file || '',
      exists: Boolean(payload.exists),
      extension: payload.extension || (fallbackGame.story_file ? String(fallbackGame.story_file).split('.').pop() : ''),
      size: Number(payload.size || 0)
    };
  }

  _storyFromGame(game = {}) {
    const storyFile = game.story_file || game.resources?.story_file || '';
    return {
      ...this._emptyStoryState(),
      story_file: storyFile,
      exists: Boolean(game.has_story_file),
      extension: storyFile ? String(storyFile).split('.').pop() : '',
      size: 0
    };
  }

  _mediaFromApi(data, fallbackGame) {
    const payload = this._unwrapApiResponse(data);
    const resources = payload.resources || {};
    return {
      ...this._emptyMediaState(),
      resources: {
        cover: resources.cover || fallbackGame.resources?.cover || fallbackGame.cover || '',
        small_cover: resources.small_cover || fallbackGame.resources?.small_cover || fallbackGame.small_cover || '',
        screenshots: Array.isArray(resources.screenshots) ? resources.screenshots : (fallbackGame.resources?.screenshots || [])
      }
    };
  }

  _mediaFromGame(game = {}) {
    return {
      ...this._emptyMediaState(),
      resources: {
        cover: game.resources?.cover || game.cover || '',
        small_cover: game.resources?.small_cover || game.small_cover || '',
        screenshots: Array.isArray(game.resources?.screenshots) ? game.resources.screenshots : []
      }
    };
  }

  _currentScreenshotPaths() {
    const screenshots = this.state.editor?.media?.resources?.screenshots || [];
    return Array.isArray(screenshots) ? screenshots.slice() : [];
  }

  _get(object, path) {
    return String(path).split('.').reduce((value, key) => (value && value[key] !== undefined ? value[key] : ''), object || {});
  }

  _set(object, path, value) {
    const keys = String(path).split('.');
    let target = object;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        target[key] = value;
        return;
      }
      target[key] = target[key] && typeof target[key] === 'object' ? target[key] : {};
      target = target[key];
    });
  }

  _asText(value) {
    if (Array.isArray(value)) {
      return value.join('\n');
    }

    return value == null ? '' : String(value);
  }

  _formatBytes(value) {
    const bytes = Number(value || 0);
    if (!bytes) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit++;
    }

    return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
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
        <strong>Format support is read-only</strong>
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
        <p class="meta">General plugin settings still live in Plugins -> TerpVault. Delete, import, export, arbitrary file browsing, player settings editing, and metadata.iFiction.xml editing remain planned for later versions.</p>
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

  _plainTextPreview(value) {
    return String(value || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^>\s?/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  _esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[s]));
  }
}

customElements.define(TAG, TerpVaultPage);

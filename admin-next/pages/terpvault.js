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
        selectedMediaType: 'cover',
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
        feelies: {
          loading: false,
          saving: '',
          error: '',
          success: '',
          items: []
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
        },
        ifiction: {
          loading: false,
          applying: false,
          error: '',
          success: '',
          report: null
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
    this._renderVersionBadge();
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
        .hero-head { display:flex; align-items:center; justify-content:space-between; gap:.75rem; flex-wrap:wrap; margin-bottom:.25rem; }
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
        .version-badge { opacity:.72; font-size:.75rem; font-weight:600; }
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
        .help { opacity:.72; font-size:.875rem; font-style:italic; line-height:1.45; }
        .section-help { margin:.2rem 0 .65rem; }
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
        .ifiction-fields { display:grid; gap:.65rem; margin:.7rem 0; }
        .ifiction-field { display:grid; grid-template-columns:2rem minmax(0,1fr); gap:.65rem; align-items:start; border:1px solid rgba(127,127,127,.24); border-radius:10px; padding:.7rem; background:rgba(127,127,127,.035); }
        .ifiction-field.overwrite { border-color:rgba(255,188,87,.65); background:rgba(255,188,87,.08); }
        .ifiction-field.same { opacity:.78; }
        .ifiction-field input { width:auto; margin:.18rem 0 0; }
        .ifiction-field-main { display:grid; gap:.55rem; min-width:0; }
        .ifiction-field-head { display:flex; flex-wrap:wrap; gap:.45rem; align-items:center; justify-content:space-between; }
        .ifiction-field-label { font-weight:700; min-width:12rem; overflow-wrap:anywhere; }
        .ifiction-field-values { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:.6rem; }
        .ifiction-value { display:grid; gap:.25rem; min-width:0; }
        .ifiction-value span { opacity:.68; font-size:.75rem; text-transform:uppercase; }
        .ifiction-value code { display:block; min-height:2.35rem; max-height:14rem; overflow:auto; white-space:pre-wrap; overflow-wrap:anywhere; border:1px solid rgba(127,127,127,.2); border-radius:8px; padding:.45rem .5rem; background:rgba(127,127,127,.055); line-height:1.42; }
        .ifiction-badge { display:inline-flex; align-items:center; border:1px solid rgba(127,127,127,.35); border-radius:999px; padding:.12rem .5rem; font-size:.75rem; white-space:nowrap; }
        .ifiction-badge.same { border-color:rgba(127,127,127,.32); background:rgba(127,127,127,.07); }
        .ifiction-badge.empty { border-color:rgba(79,190,124,.58); background:rgba(79,190,124,.1); }
        .ifiction-badge.overwrite { border-color:rgba(255,188,87,.65); background:rgba(255,188,87,.13); }
        .ifiction-badge.changed { border-color:rgba(93,164,255,.6); background:rgba(93,164,255,.11); }
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
        .media-card { display:block; width:100%; border:1px solid rgba(127,127,127,.24); border-radius:12px; padding:.65rem; background:rgba(127,127,127,.035); color:inherit; font:inherit; text-align:left; cursor:pointer; }
        .media-card:hover, .media-card:focus { border-color:rgba(93,164,255,.72); outline:none; }
        .media-card[aria-selected="true"] { border-color:rgba(93,164,255,.72); background:rgba(93,164,255,.08); }
        .media-card img { display:block; width:100%; aspect-ratio:16/10; object-fit:cover; border-radius:8px; border:1px solid rgba(127,127,127,.22); background:rgba(127,127,127,.12); margin-bottom:.45rem; }
        .media-card .placeholder { display:grid; place-items:center; width:100%; aspect-ratio:16/10; border-radius:8px; border:1px dashed rgba(127,127,127,.34); background:rgba(127,127,127,.06); margin-bottom:.45rem; }
        .media-focus { border:1px solid rgba(127,127,127,.24); border-radius:12px; padding:.8rem; margin:.75rem 0; background:rgba(127,127,127,.035); display:grid; grid-template-columns:minmax(180px, 280px) minmax(0,1fr); gap:.8rem; align-items:start; }
        .media-focus img, .media-focus .placeholder { width:100%; aspect-ratio:16/10; border-radius:8px; border:1px solid rgba(127,127,127,.22); background:rgba(127,127,127,.12); object-fit:cover; }
        .media-focus .placeholder { display:grid; place-items:center; border-style:dashed; }
        .media-uploads { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:.75rem; }
        .screenshot-list { display:grid; gap:.55rem; margin:.75rem 0; }
        .screenshot-row { border:1px solid rgba(127,127,127,.24); border-radius:10px; padding:.6rem; display:grid; grid-template-columns:96px minmax(0,1fr); gap:.65rem; align-items:start; background:rgba(127,127,127,.03); }
        .screenshot-row img { width:96px; aspect-ratio:16/10; object-fit:cover; border-radius:8px; border:1px solid rgba(127,127,127,.22); background:rgba(127,127,127,.12); }
        .screenshot-actions { display:flex; flex-wrap:wrap; gap:.4rem; margin-top:.45rem; }
        .feelies-manager { border-top:1px solid rgba(127,127,127,.18); margin-top:1rem; padding-top:1rem; }
        .feelie-list { display:grid; gap:.65rem; margin:.75rem 0; }
        .feelie-row { border:1px solid rgba(127,127,127,.24); border-radius:10px; padding:.7rem; background:rgba(127,127,127,.03); display:grid; gap:.6rem; }
        .feelie-row.invalid { border-color:rgba(255,95,95,.7); background:rgba(255,95,95,.08); }
        .feelie-grid { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:.55rem; }
        .feelie-grid .wide { grid-column:1 / -1; }
        .feelie-actions { display:flex; flex-wrap:wrap; gap:.4rem; align-items:center; justify-content:space-between; }
        .feelie-actions .left, .feelie-actions .right { display:flex; flex-wrap:wrap; gap:.4rem; align-items:center; }
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
          .ifiction-field { grid-template-columns:1.6rem minmax(0,1fr); }
          .ifiction-field-head { display:grid; justify-content:start; }
          .ifiction-field-label { min-width:0; }
          .ifiction-field-values { grid-template-columns:1fr; }
          .media-focus { grid-template-columns:1fr; }
          .screenshot-row { grid-template-columns:1fr; }
          .screenshot-row img { width:100%; }
          .feelie-grid { grid-template-columns:1fr; }
          .feelie-grid .wide { grid-column:auto; }
        }
      </style>
      <div class="tv-admin">
        <section class="hero">
          <div class="hero-head">
            <h1>TerpVault Library Manager</h1>
            <span class="badge version-badge" data-terpvault-version></span>
          </div>
          <p>Package inventory, package creation, metadata editing, helper Markdown editing, media management, screenshot ordering, and story-file replacement for installed TerpVault interactive-fiction packages.</p>
          <p class="meta">Admin2 is opt-in. Package export, import inspection, draft-only import install, local iFiction preview, and selected-field iFiction apply are available. Package delete, overwrite, arbitrary file browsing, player settings editing, and remote catalog lookup are not available.</p>
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
    this._renderVersionBadge();
  }

  _version() {
    return this.state.status?.version || this._embeddedData()?.version || '';
  }

  _renderVersionBadge() {
    const badge = this.shadowRoot.querySelector('[data-terpvault-version]');
    if (!badge) return;
    const version = this._version();
    badge.textContent = version ? `TerpVault v${version}` : 'TerpVault';
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
            <p class="meta">Source: ${this._esc(this.state.source)}. Status and validation notes flag playability problems and metadata gaps before publication. Package creation, editing, export, import inspection, and draft-only import install use the Admin2 API when available. Delete and overwrite are intentionally unavailable.</p>
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
            ${this._createSelect('Format', 'format', [['', 'Infer later'], ['zcode', 'Z-code'], ['glulx', 'Glulx'], ['tads3', 'TADS 3'], ['tads2', 'TADS 2'], ['adrift', 'ADRIFT']])}
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
            <input type="file" name="file" accept=".z3,.z4,.z5,.z6,.z7,.z8,.zblorb,.zlb,.ulx,.gblorb,.glb,.gam,.t3,.taf" required ${state.saving ? 'disabled' : ''}>
            <span class="meta">Allowed: z3, z4, z5, z6, z7, z8, zblorb, zlb, ulx, gblorb, glb, gam, t3, taf.</span>
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
    const committedSlug = report.committed_slug || '';
    const collisionLabel = committedSlug
      ? `installed as ${committedSlug}`
      : (report.has_collision ? 'slug collision' : 'no collision');
    const collisionTone = committedSlug || !report.has_collision ? 'ok' : 'warn';
    return `
      <div class="box" style="margin-top:.85rem;">
        <h3>Inspection Report</h3>
        <div class="badges" style="justify-content:flex-start;margin:.45rem 0;">
          <span class="badge ${report.ok ? 'ok' : 'error'}">${report.ok ? 'ok' : 'blocked'}</span>
          <span class="badge ${collisionTone}">${this._esc(collisionLabel)}</span>
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
          ${committedSlug ? `<dt>Installed slug</dt><dd><code>${this._esc(committedSlug)}</code></dd>` : ''}
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

  _committedImportReport(report, slug) {
    if (!report || typeof report !== 'object') {
      return report;
    }

    const updated = {
      ...report,
      committed_slug: slug || report.committed_slug || '',
      has_collision: false,
      destination_exists: false
    };
    const warnings = Array.isArray(report.warnings) ? report.warnings.slice() : [];
    if (report.has_collision || report.destination_exists) {
      warnings.push(`Final import slug ${slug} was accepted; the original source slug collision did not overwrite an existing package.`);
    }
    updated.warnings = Array.from(new Set(warnings));

    return updated;
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

    root.querySelectorAll('[data-action="preview-ifiction"]').forEach(button => {
      button.addEventListener('click', () => this._previewIFiction(button.dataset.slug || ''));
    });

    root.querySelectorAll('form[data-ifiction-apply-slug]').forEach(form => {
      form.addEventListener('submit', event => this._applyIFiction(event));
    });

    root.querySelectorAll('[data-action="media-select"]').forEach(button => {
      button.addEventListener('click', () => this._selectMediaType(button.dataset.type || 'cover'));
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

    root.querySelectorAll('form[data-feelies-slug]').forEach(form => {
      form.addEventListener('submit', event => this._saveFeelies(event));
    });

    root.querySelectorAll('form[data-feelie-upload-slug]').forEach(form => {
      form.addEventListener('submit', event => this._uploadFeelie(event));
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

    root.querySelectorAll('[data-action="feelie-add"]').forEach(button => {
      button.addEventListener('click', () => this._addFeelie());
    });

    root.querySelectorAll('[data-action="feelie-remove"]').forEach(button => {
      button.addEventListener('click', () => this._removeFeelie(Number(button.dataset.index || -1)));
    });

    root.querySelectorAll('[data-action="feelie-move"]').forEach(button => {
      button.addEventListener('click', () => this._moveFeelie(Number(button.dataset.index || -1), Number(button.dataset.direction || 0)));
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
          success: 'Package imported as draft and not featured. Review metadata, helper docs, media, story file, license/provenance, and publish only when ready.',
          values: this._editableFromGame(game),
          readOnly: this._readOnlyFromGame(game),
          activeHelper: 'how-to-play',
          selectedMediaType: 'cover',
          helper: this._emptyHelperState('how-to-play'),
          media: this._mediaFromGame(game),
          feelies: this._feeliesFromGame(game),
          story: this._storyFromGame(game),
          ifiction: this._emptyIFictionState()
        };
      }
      this.state.importInspect = {
        open: true,
        saving: false,
        committing: false,
        error: '',
        success: `Imported ${importedSlug} as a draft package. Review metadata, helper docs, media, story file, license/provenance, and publish only when ready.`,
        report: this._committedImportReport(result.report || this.state.importInspect.report, importedSlug),
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
          selectedMediaType: 'cover',
          helper: this._emptyHelperState('how-to-play'),
          media: this._mediaFromGame(this._findGame(slug) || {}),
          feelies: this._feeliesFromGame(this._findGame(slug) || {}),
          story: this._storyFromGame(this._findGame(slug) || {}),
          ifiction: this._emptyIFictionState()
        };
        await this._loadHelperDoc(slug, 'how-to-play', false);
        await this._loadStory(slug, false);
        await this._loadMedia(slug, false);
        await this._loadFeelies(slug, false);
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
      selectedMediaType: 'cover',
      helper: this._emptyHelperState('how-to-play'),
      media: this._mediaFromGame(game || {}),
      feelies: this._feeliesFromGame(game || {}),
      story: this._storyFromGame(game || {}),
      ifiction: this._emptyIFictionState()
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
    await this._loadFeelies(slug, false);
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
      selectedMediaType: 'cover',
      helper: this._emptyHelperState('how-to-play'),
      media: this._emptyMediaState(),
      feelies: this._emptyFeeliesState(),
      story: this._emptyStoryState(),
      ifiction: this._emptyIFictionState()
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

  async _previewIFiction(slug) {
    if (!slug) {
      return;
    }

    this.state.editor = {
      ...this.state.editor,
      ifiction: {
        loading: true,
        applying: false,
        error: '',
        success: '',
        report: null
      }
    };
    this._renderLibrary();

    try {
      const data = await this._requestJson(this._ifictionPreviewApiUrl(slug), { method: 'GET' });
      this.state.editor = {
        ...this.state.editor,
        ifiction: {
          loading: false,
          applying: false,
          error: '',
          success: '',
          report: this._unwrapApiResponse(data)
        }
      };
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        ifiction: {
          loading: false,
          applying: false,
          error: error.message || String(error),
          success: '',
          report: null
        }
      };
    }

    this._renderLibrary();
  }

  async _applyIFiction(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const slug = form.dataset.ifictionApplySlug || this.state.editingSlug;
    const fields = Array.from(form.querySelectorAll('input[name="ifiction_fields"]:checked')).map(input => input.value);
    if (!slug) {
      return;
    }

    this.state.editor = {
      ...this.state.editor,
      ifiction: {
        ...(this.state.editor.ifiction || this._emptyIFictionState()),
        applying: true,
        error: '',
        success: ''
      }
    };
    this._renderLibrary();

    try {
      const data = await this._requestJson(this._ifictionPreviewApiUrl(slug), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      });
      const report = this._unwrapApiResponse(data);
      const applyErrors = Array.isArray(report?.errors) ? report.errors.filter(Boolean).map(error => String(error)) : [];
      const applySuccess = report?.applied === true;
      const applyMessage = applySuccess
        ? 'Selected iFiction fields were applied to game.yaml. A package-local backup was created before writing.'
        : (!fields.length ? 'No iFiction fields were selected. game.yaml was not changed.' : '');
      await this._reloadManifest();
      const metadata = await this._requestJson(this._metadataApiUrl(slug), { method: 'GET' });
      this.state.editor = {
        ...this.state.editor,
        loading: false,
        saving: false,
        values: this._editableFromApi(metadata, this._findGame(slug) || {}),
        readOnly: this._readOnlyFromApi(metadata, this._findGame(slug) || {}),
        ifiction: {
          loading: false,
          applying: false,
          error: !applySuccess && fields.length && applyErrors.length ? applyErrors.join('\n') : '',
          success: applyMessage,
          report
        }
      };
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        ifiction: {
          ...(this.state.editor.ifiction || this._emptyIFictionState()),
          applying: false,
          error: error.message || String(error),
          success: ''
        }
      };
    }

    this._renderLibrary();
  }

  _selectMediaType(type) {
    if (!this._mediaAssetTypes().some(item => item.type === type)) {
      return;
    }

    this.state.editor = {
      ...this.state.editor,
      selectedMediaType: type
    };
    this._renderLibrary();
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
      const fallbackMedia = this._mediaFromApi(data, this._findGame(slug) || {});
      await this._reloadManifest();
      const media = await this._refreshMediaInventory(slug, fallbackMedia);
      this.state.editor = {
        ...this.state.editor,
        selectedMediaType: this.state.editor.selectedMediaType || 'cover',
        media: {
          ...media,
          cacheKey: this._newMediaCacheKey(),
          success: 'Media uploaded and package metadata updated.'
        }
      };
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
      const fallbackMedia = this._mediaFromApi(data, this._findGame(slug) || {});
      await this._reloadManifest();
      const media = await this._refreshMediaInventory(slug, fallbackMedia);
      this.state.editor = {
        ...this.state.editor,
        media: {
          ...media,
          cacheKey: this._newMediaCacheKey(),
          success
        }
      };
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

  async _refreshMediaInventory(slug, fallbackMedia) {
    try {
      const data = await this._requestJson(this._mediaApiUrl(slug), { method: 'GET' });
      return this._mediaFromApi(data, this._findGame(slug) || {});
    } catch (error) {
      return {
        ...(fallbackMedia || this._emptyMediaState()),
        error: `Media uploaded, but inventory refresh failed: ${error.message || error}`
      };
    }
  }

  async _loadFeelies(slug, render = true) {
    if (!slug) {
      return;
    }

    this.state.editor = {
      ...this.state.editor,
      feelies: {
        ...(this.state.editor.feelies || this._emptyFeeliesState()),
        loading: true,
        error: '',
        success: ''
      }
    };

    if (render) {
      this._renderLibrary();
    }

    try {
      const data = await this._requestJson(this._feeliesApiUrl(slug), { method: 'GET' });
      this.state.editor = {
        ...this.state.editor,
        feelies: this._feeliesFromApi(data, this._findGame(slug) || {})
      };
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        feelies: {
          ...(this.state.editor.feelies || this._emptyFeeliesState()),
          loading: false,
          error: `Feelies API unavailable: ${error.message || error}`
        }
      };
    }

    if (render) {
      this._renderLibrary();
    }
  }

  async _saveFeelies(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const slug = form.dataset.feeliesSlug || this.state.editingSlug;
    const feelies = this._collectFeelies(form);

    this.state.editor = {
      ...this.state.editor,
      feelies: {
        ...(this.state.editor.feelies || this._emptyFeeliesState()),
        items: feelies,
        saving: 'manifest',
        error: '',
        success: ''
      }
    };
    this._renderLibrary();

    try {
      const data = await this._requestJson(this._feeliesApiUrl(slug), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feelies })
      });
      const fallback = this._feeliesFromApi(data, this._findGame(slug) || {});
      await this._reloadManifest();
      const refreshed = await this._refreshFeelies(slug, fallback);
      this.state.editor = {
        ...this.state.editor,
        feelies: {
          ...refreshed,
          success: 'Feelies manifest saved. No physical files were deleted.'
        }
      };
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        feelies: {
          ...(this.state.editor.feelies || this._emptyFeeliesState()),
          items: feelies,
          saving: '',
          error: error.message || String(error)
        }
      };
    }

    this._renderLibrary();
  }

  async _uploadFeelie(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const slug = form.dataset.feelieUploadSlug || this.state.editingSlug;
    const input = form.querySelector('input[type="file"]');
    const file = input?.files?.[0];
    if (!file) {
      this.state.editor = {
        ...this.state.editor,
        feelies: {
          ...(this.state.editor.feelies || this._emptyFeeliesState()),
          error: 'Choose a feelie file before uploading.',
          success: ''
        }
      };
      this._renderLibrary();
      return;
    }

    const data = new FormData(form);
    data.set('file', file);
    this.state.editor = {
      ...this.state.editor,
      feelies: {
        ...(this.state.editor.feelies || this._emptyFeeliesState()),
        saving: 'upload',
        error: '',
        success: ''
      }
    };
    this._renderLibrary();

    try {
      const response = await this._requestJson(this._feeliesApiUrl(slug), {
        method: 'POST',
        body: data
      });
      const fallback = this._feeliesFromApi(response, this._findGame(slug) || {});
      await this._reloadManifest();
      const refreshed = await this._refreshFeelies(slug, fallback);
      this.state.editor = {
        ...this.state.editor,
        feelies: {
          ...refreshed,
          success: 'Feelie uploaded and added to resources.feelies.'
        }
      };
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        feelies: {
          ...(this.state.editor.feelies || this._emptyFeeliesState()),
          saving: '',
          error: error.message || String(error)
        }
      };
    }

    this._renderLibrary();
  }

  async _refreshFeelies(slug, fallbackFeelies) {
    try {
      const data = await this._requestJson(this._feeliesApiUrl(slug), { method: 'GET' });
      return this._feeliesFromApi(data, this._findGame(slug) || {});
    } catch (error) {
      return {
        ...(fallbackFeelies || this._emptyFeeliesState()),
        error: `Feelies changed, but inventory refresh failed: ${error.message || error}`
      };
    }
  }

  _addFeelie() {
    const feelies = this._currentFeelieItems();
    feelies.push({ title: '', path: '', type: '', description: '', exists: false, url: '', valid: true, error: '' });
    this.state.editor = {
      ...this.state.editor,
      feelies: {
        ...(this.state.editor.feelies || this._emptyFeeliesState()),
        items: feelies,
        success: '',
        error: ''
      }
    };
    this._renderLibrary();
  }

  _removeFeelie(index) {
    const feelies = this._currentFeelieItems();
    if (index < 0 || index >= feelies.length) {
      return;
    }

    feelies.splice(index, 1);
    this.state.editor = {
      ...this.state.editor,
      feelies: {
        ...(this.state.editor.feelies || this._emptyFeeliesState()),
        items: feelies,
        success: 'Feelie removed from the pending manifest list only. Save to update game.yaml; the physical file is not deleted.',
        error: ''
      }
    };
    this._renderLibrary();
  }

  _moveFeelie(index, direction) {
    const feelies = this._currentFeelieItems();
    const target = index + direction;
    if (index < 0 || target < 0 || index >= feelies.length || target >= feelies.length) {
      return;
    }

    const [item] = feelies.splice(index, 1);
    feelies.splice(target, 0, item);
    this.state.editor = {
      ...this.state.editor,
      feelies: {
        ...(this.state.editor.feelies || this._emptyFeeliesState()),
        items: feelies,
        success: '',
        error: ''
      }
    };
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
      setTimeout(() => URL.revokeObjectURL(url), 1000);

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
              ${this._help('bibliographic')}
              ${this._input('Title', 'bibliographic.title', values, this._helpText('title'))}
              ${this._input('Author', 'bibliographic.author', values, this._helpText('author'))}
              ${this._input('Headline', 'bibliographic.headline', values, this._helpText('headline'))}
              ${this._input('First published', 'bibliographic.first_published', values, this._helpText('first_published'))}
              ${this._input('Genre', 'bibliographic.genre', values)}
              ${this._input('Language', 'bibliographic.language', values, this._helpText('language'))}
              ${this._textarea('Description', 'bibliographic.description', values, '', this._helpText('description'))}
            </fieldset>
            <fieldset>
              <legend>Identification</legend>
              ${this._help('identification')}
              ${this._select('Format', 'identification.format', values, [
                ['', 'Unspecified'],
                ['zcode', 'Z-code'],
                ['glulx', 'Glulx'],
                ['tads2', 'TADS 2'],
                ['tads3', 'TADS 3'],
                ['hugo', 'Hugo'],
                ['adrift', 'ADRIFT']
              ], this._helpText('format'))}
              ${this._textarea('IFIDs', 'identification.ifids', values, 'short', this._helpText('ifids'))}
            </fieldset>
            <fieldset>
              <legend>Catalog</legend>
              ${this._help('catalog')}
              ${this._input('IFDB TUID', 'catalog.ifdb.tuid', values, this._helpText('ifdb_tuid'))}
              ${this._input('IFDB URL', 'catalog.ifdb.url', values, this._helpText('ifdb_url'))}
              ${this._input('IFWiki URL', 'catalog.ifwiki.url', values, this._helpText('ifwiki_url'))}
              ${this._input('IF Archive path', 'catalog.ifarchive.path', values, this._helpText('ifarchive_path'))}
              ${this._input('IF Archive URL', 'catalog.ifarchive.url', values, this._helpText('ifarchive_url'))}
            </fieldset>
            <fieldset>
              <legend>Release & Provenance</legend>
              ${this._help('provenance')}
              ${this._input('License name', 'release.license.name', values, this._helpText('license_name'))}
              ${this._input('License URL', 'release.license.url', values)}
              ${this._textarea('License notes', 'release.license.notes', values, 'short', this._helpText('license_notes'))}
              ${this._input('Source URL', 'release.source.url', values, this._helpText('source_url'))}
              ${this._input('Source retrieved', 'release.source.retrieved', values, this._helpText('source_retrieved'))}
              ${this._textarea('Source notes', 'release.source.notes', values, 'short', this._helpText('source_notes'))}
            </fieldset>
            <fieldset>
              <legend>TerpVault</legend>
              ${this._help('terpvault')}
              ${this._select('Status', 'terpvault.status', values, [['draft', 'Draft'], ['published', 'Published']], this._helpText('status'))}
              <div class="checkbox">
                <input id="tv-featured-${this._esc(slug)}" type="checkbox" name="terpvault.featured" ${this._get(values, 'terpvault.featured') ? 'checked' : ''}>
                <label for="tv-featured-${this._esc(slug)}">Featured</label>
              </div>
              ${this._help('featured')}
              ${this._textarea('Tags', 'terpvault.tags', values, 'short', this._helpText('tags'))}
            </fieldset>
            <fieldset>
              <legend>Read-only package files</legend>
              ${this._help('readonly_files')}
              ${this._readOnlyList(readOnly)}
            </fieldset>
          </div>
          <div class="form-actions">
            <button class="button" type="button" data-action="cancel-edit">Cancel</button>
            <button class="button primary" type="submit" ${editor.loading || editor.saving ? 'disabled' : ''}>${editor.saving ? 'Saving...' : 'Save Metadata'}</button>
          </div>
        </form>
        ${this._ifictionPreviewPanel(slug)}
        ${this._storyPanel(game, slug)}
        ${this._mediaPanel(game, slug)}
        ${this._feeliesPanel(game, slug)}
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
        <p class="meta">The story file is the playable IF payload. Replacing it may affect playability. The existing registered story file will be backed up when present.</p>
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
            <input type="file" accept=".z3,.z4,.z5,.z6,.z7,.z8,.zblorb,.zlb,.ulx,.gblorb,.glb,.gam,.t3,.taf" ${story.loading || story.saving ? 'disabled' : ''}>
            <span class="meta">Allowed: z3, z4, z5, z6, z7, z8, zblorb, zlb, ulx, gblorb, glb, gam, t3, taf. Archives, scripts, HTML, SVG, and arbitrary files are not accepted.</span>
          </div>
          <div class="form-actions">
            <button class="button primary" type="submit" ${story.loading || story.saving ? 'disabled' : ''}>${story.saving ? 'Uploading...' : 'Upload Story File'}</button>
          </div>
        </form>
      </section>
    `;
  }

  _ifictionPreviewPanel(slug) {
    const ifiction = this.state.editor.ifiction || this._emptyIFictionState();
    const report = ifiction.report || null;
    const fields = Array.isArray(report?.fields) ? report.fields : [];

    return `
      <section class="story-manager">
        <h3>iFiction Metadata</h3>
        <p class="meta">Parser for package-local <code>metadata.iFiction.xml</code>, a common IF metadata format. Remote lookup is not performed.</p>
        ${ifiction.loading ? '<div class="message">Parsing local metadata.iFiction.xml...</div>' : ''}
        ${ifiction.error ? `<div class="message error">${this._esc(ifiction.error)}</div>` : ''}
        ${ifiction.success ? `<div class="message success">${this._esc(ifiction.success)}</div>` : ''}
        ${report && report.errors?.length ? `<div class="message error">${report.errors.map(error => this._esc(error)).join('<br>')}</div>` : ''}
        ${report && report.ok ? '<div class="message success">Local iFiction metadata parsed. Select fields explicitly before applying changes.</div>' : ''}
        <div class="form-actions">
          <button class="button" type="button" data-action="preview-ifiction" data-slug="${this._esc(slug)}" ${ifiction.loading || ifiction.applying ? 'disabled' : ''}>${ifiction.loading ? 'Previewing...' : 'Preview iFiction Metadata'}</button>
        </div>
        ${fields.length ? this._ifictionFieldTable(slug, fields, ifiction.applying) : (report ? '<p class="meta">No supported preview fields are available.</p>' : '')}
      </section>
    `;
  }

  _ifictionFieldTable(slug, fields, applying = false) {
    return `
      <form data-ifiction-apply-slug="${this._esc(slug)}">
        <p class="meta">This updates <code>game.yaml</code>. Existing non-empty values are only overwritten if selected. Remote lookup is not performed.</p>
        <div class="ifiction-fields">
          ${fields.map(field => {
            const status = this._ifictionFieldStatus(field);
            const disabled = applying || !field.would_change || !this._asText(field.xml);
            return `
              <div class="ifiction-field ${this._esc(status.className)}">
                <input type="checkbox" name="ifiction_fields" value="${this._esc(field.path || '')}" aria-label="Apply ${this._esc(field.label || field.path || '')}" ${field.default_selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
                <div class="ifiction-field-main">
                  <div class="ifiction-field-head">
                    <span class="ifiction-field-label">${this._esc(field.label || field.path || '')}</span>
                    <span class="ifiction-badge ${this._esc(status.className)}">${this._esc(status.label)}</span>
                  </div>
                  <div class="ifiction-field-values">
                    <div class="ifiction-value">
                      <span>Current game.yaml</span>
                      <code>${this._esc(this._asText(field.current) || 'Empty')}</code>
                    </div>
                    <div class="ifiction-value">
                      <span>metadata.iFiction.xml</span>
                      <code>${this._esc(this._asText(field.xml) || 'Empty')}</code>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="form-actions">
          <button class="button primary" type="submit" ${applying ? 'disabled' : ''}>${applying ? 'Applying...' : 'Apply Selected iFiction Fields'}</button>
        </div>
      </form>
    `;
  }

  _ifictionFieldStatus(field) {
    if (!field.would_change) {
      return { label: 'Same', className: 'same' };
    }
    if (field.overwrite_warning) {
      return { label: 'Overwrites current value', className: 'overwrite' };
    }
    if (field.current_empty) {
      return { label: 'Empty target', className: 'empty' };
    }

    return { label: 'Changed', className: 'changed' };
  }

  _mediaPanel(game, slug) {
    const media = this.state.editor.media || this._mediaFromGame(game);
    const urls = game.urls || {};
    const cacheKey = media.cacheKey || '';
    const screenshots = Array.isArray(urls.screenshots) ? urls.screenshots : (Array.isArray(game.screenshots) ? game.screenshots : []);
    const assetTypes = this._mediaAssetTypes();
    const selectedType = assetTypes.some(item => item.type === this.state.editor.selectedMediaType) ? this.state.editor.selectedMediaType : 'cover';
    const selectedAsset = this._mediaAssetData(selectedType, urls, media.resources || {}, cacheKey);

    return `
      <section class="media-manager">
        <h3>Media</h3>
        <p class="meta">Media Manager Lite accepts package-local jpg, png, webp, and gif images only. Feelies/extras are managed in their own curated section below; arbitrary file management is not available here.</p>
        ${media.loading ? '<div class="message">Loading media inventory...</div>' : ''}
        ${media.error ? `<div class="message error">${this._esc(media.error)}</div>` : ''}
        ${media.success ? `<div class="message success">${this._esc(media.success)}</div>` : ''}
        <div class="media-grid">
          ${assetTypes.map(asset => this._mediaCard(asset, this._mediaAssetData(asset.type, urls, media.resources || {}, cacheKey), selectedType === asset.type)).join('')}
        </div>
        ${this._mediaFocusPanel(slug, selectedAsset, media.saving === selectedType)}
        <div class="screenshot-list">
          <strong>Screenshots</strong>
          <p class="meta">Screenshots show representative play moments. Remove only updates <code>resources.screenshots</code>; it does not delete the underlying image file.</p>
          ${screenshots.length ? screenshots.map((url, index) => this._screenshotRow(slug, this._cacheBustUrl(url, cacheKey), media.resources?.screenshots?.[index] || '', index, screenshots.length, media.saving === 'screenshots' || media.saving === `screenshot-${index}`)).join('') : '<p class="meta">No screenshots recorded.</p>'}
        </div>
        <div class="media-uploads">
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

  _mediaAssetTypes() {
    return [
      {
        type: 'cover',
        label: 'Cover',
        key: 'cover',
        shortHelp: 'Package/title art.',
        help: 'Package/title art. This is not the same as the wide hero image.'
      },
      {
        type: 'small-cover',
        label: 'Small Cover',
        key: 'small_cover',
        shortHelp: 'Compact library artwork.',
        help: 'Compact card artwork used in library and catalog views.'
      },
      {
        type: 'hero',
        label: 'Hero',
        key: 'hero',
        shortHelp: 'Wide presentation image.',
        help: 'Wide presentation image used behind detail and play headers.'
      }
    ];
  }

  _mediaAssetData(type, urls, resources, cacheKey = '') {
    const asset = this._mediaAssetTypes().find(item => item.type === type) || this._mediaAssetTypes()[0];
    const urlMap = {
      cover: urls.cover || '',
      'small-cover': urls.small_cover || urls.thumbnail || '',
      hero: urls.hero || ''
    };

    return {
      ...asset,
      url: this._cacheBustUrl(urlMap[asset.type] || '', cacheKey),
      path: resources[asset.key] || ''
    };
  }

  _mediaCard(asset, data, selected) {
    return `
      <button class="media-card" type="button" data-action="media-select" data-type="${this._esc(asset.type)}" aria-selected="${selected ? 'true' : 'false'}">
        ${data.url ? `<img src="${this._esc(data.url)}" alt="">` : '<div class="placeholder"><span class="meta">No image</span></div>'}
        <strong>${this._esc(asset.label)}</strong>
        <p class="meta">${data.path ? `<code>${this._esc(data.path)}</code>` : 'Not recorded'}</p>
        <span class="help">${this._esc(asset.shortHelp)}</span>
      </button>
    `;
  }

  _mediaFocusPanel(slug, asset, saving) {
    return `
      <div class="media-focus">
        ${asset.url ? `<img src="${this._esc(asset.url)}" alt="">` : '<div class="placeholder"><span class="meta">No image recorded</span></div>'}
        <div>
          <h3>${this._esc(asset.label)}</h3>
          <p class="meta">${this._esc(asset.help)}</p>
          <dl>
            <dt>Manifest path</dt><dd>${asset.path ? `<code>${this._esc(asset.path)}</code>` : 'Not recorded'}</dd>
          </dl>
          <div class="actions">
            ${asset.url ? `<a class="button" href="${this._esc(asset.url)}" target="_blank" rel="noopener">Open Current Asset</a>` : ''}
          </div>
          ${this._mediaUploadForm(slug, asset.type, `Replace ${asset.label.toLowerCase()}`, saving)}
          <p class="meta">Clearing references and deleting physical files are intentionally left for a later safe workflow.</p>
        </div>
      </div>
    `;
  }

  _mediaUploadForm(slug, type, label, saving, replacePath = '', replaceIndex = '') {
    return `
      <form data-media-slug="${this._esc(slug)}" data-media-type="${this._esc(type)}" ${replacePath ? `data-replace-path="${this._esc(replacePath)}"` : ''} ${replaceIndex !== '' ? `data-replace-index="${this._esc(replaceIndex)}"` : ''}>
        <div class="field">
          <label>${this._esc(label)}</label>
          <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif" ${saving ? 'disabled' : ''}>
        </div>
        <div class="form-actions">
          <button class="button primary" type="submit" ${saving ? 'disabled' : ''}>${saving ? 'Uploading...' : 'Upload'}</button>
        </div>
      </form>
    `;
  }

  _feeliesPanel(game, slug) {
    const state = this.state.editor.feelies || this._feeliesFromGame(game);
    const items = Array.isArray(state.items) ? state.items : [];
    const saving = Boolean(state.loading || state.saving);

    return `
      <section class="feelies-manager">
        <h3>Feelies / Extras</h3>
        <p class="meta">Feelies are curated extras such as manuals, maps, clue sheets, images, audio, or other supplemental package-local files. This manages only <code>resources.feelies</code>; it is not a package file browser.</p>
        <p class="meta">Removing a feelie from the manifest does not delete the physical file.</p>
        ${state.loading ? '<div class="message">Loading feelies inventory...</div>' : ''}
        ${state.error ? `<div class="message error">${this._esc(state.error)}</div>` : ''}
        ${state.success ? `<div class="message success">${this._esc(state.success)}</div>` : ''}
        <form data-feelies-slug="${this._esc(slug)}">
          <div class="feelie-list">
            ${items.length ? items.map((item, index) => this._feelieRow(slug, item, index, items.length, saving)).join('') : '<p class="meta">No feelies recorded.</p>'}
          </div>
          <div class="form-actions">
            <button class="button" type="button" data-action="feelie-add" ${saving ? 'disabled' : ''}>Add Feelie</button>
            <button class="button primary" type="submit" ${saving ? 'disabled' : ''}>${state.saving === 'manifest' ? 'Saving...' : 'Save Feelies Manifest'}</button>
          </div>
        </form>
        <form data-feelie-upload-slug="${this._esc(slug)}" style="margin-top:.85rem;">
          <div class="fieldsets">
            <fieldset>
              <legend>Upload Feelie</legend>
              <p class="meta">Uploads are stored under <code>feelies/</code> and added to <code>resources.feelies</code>. Allowed: pdf, txt, md, jpg, jpeg, png, webp, gif, mp3, ogg, wav, m4a. SVG is excluded.</p>
              <div class="field">
                <label>File</label>
                <input type="file" name="file" accept=".pdf,.txt,.md,.jpg,.jpeg,.png,.webp,.gif,.mp3,.ogg,.wav,.m4a,application/pdf,text/plain,text/markdown,image/jpeg,image/png,image/webp,image/gif,audio/mpeg,audio/ogg,audio/wav,audio/mp4" ${saving ? 'disabled' : ''}>
              </div>
              ${this._createInput('Title', 'title')}
              ${this._createInput('Type', 'type')}
              ${this._createTextarea('Description', 'description', 'short')}
              <div class="form-actions">
                <button class="button primary" type="submit" ${saving ? 'disabled' : ''}>${state.saving === 'upload' ? 'Uploading...' : 'Upload Feelie'}</button>
              </div>
            </fieldset>
          </div>
        </form>
      </section>
    `;
  }

  _feelieRow(slug, item, index, count, saving) {
    const valid = item.valid !== false;
    const exists = Boolean(item.exists);
    return `
      <div class="feelie-row ${valid ? '' : 'invalid'}">
        <div class="feelie-actions">
          <div class="left">
            <strong>Feelie ${index + 1}</strong>
            <span class="badge ${valid && exists ? 'ok' : 'warn'}">${valid ? (exists ? 'file found' : 'missing file') : 'invalid path'}</span>
          </div>
          <div class="right">
            ${item.url ? `<a class="button" href="${this._esc(item.url)}" target="_blank" rel="noopener">Open</a>` : ''}
            <button class="button" type="button" data-action="feelie-move" data-index="${index}" data-direction="-1" ${index === 0 || saving ? 'disabled' : ''}>Move up</button>
            <button class="button" type="button" data-action="feelie-move" data-index="${index}" data-direction="1" ${index >= count - 1 || saving ? 'disabled' : ''}>Move down</button>
            <button class="button" type="button" data-action="feelie-remove" data-index="${index}" ${saving ? 'disabled' : ''}>Remove from manifest</button>
          </div>
        </div>
        ${item.error ? `<div class="message error">${this._esc(item.error)}</div>` : ''}
        <div class="feelie-grid">
          <div class="field">
            <label>Title</label>
            <input type="text" name="feelies[${index}][title]" value="${this._esc(item.title || '')}" ${saving ? 'disabled' : ''}>
          </div>
          <div class="field">
            <label>Type</label>
            <input type="text" name="feelies[${index}][type]" value="${this._esc(item.type || '')}" ${saving ? 'disabled' : ''}>
          </div>
          <div class="field wide">
            <label>Path</label>
            <input type="text" name="feelies[${index}][path]" value="${this._esc(item.path || '')}" placeholder="feelies/manual.pdf" ${saving ? 'disabled' : ''}>
            <span class="meta">Package-local allowlisted paths only. Traversal, absolute paths, URI-like paths, hidden/system paths, and SVG are rejected.</span>
          </div>
          <div class="field wide">
            <label>Description</label>
            <textarea class="short" name="feelies[${index}][description]" ${saving ? 'disabled' : ''}>${this._esc(item.description || '')}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  _help(key) {
    const text = this._helpText(key);
    return text ? `<p class="help section-help">${this._esc(text)}</p>` : '';
  }

  _helpText(key) {
    const messages = {
      bibliographic: 'Curator-facing description fields for the public detail page and library cards.',
      title: 'Use the story or package title visitors should recognize.',
      author: 'Primary credited author or authors.',
      headline: 'Short one-line catalog summary, useful on cards and headers.',
      first_published: 'Original or package publication year/date when known.',
      language: 'Short language code such as en when known.',
      description: 'Public-facing synopsis or curator note. Keep rights-sensitive source text out unless you can redistribute it.',
      identification: 'Identifiers and format hints help TerpVault choose player behavior and connect the package to IF ecosystem metadata.',
      format: 'Story-file family such as Z-code, Glulx, or TADS. Leave unspecified if the file extension should speak for now.',
      ifids: 'A unique identifier used by the interactive fiction ecosystem. Add one when known; some stories have more than one.',
      catalog: 'External catalog references are for human review and future lookup workflows. TerpVault does not fetch remote catalog data here.',
      ifdb_tuid: 'The IFDB story id, not the full URL.',
      ifdb_url: 'Public IFDB page for this work, when known.',
      ifwiki_url: 'Relevant IFWiki page for this work, author, or package.',
      ifarchive_path: 'IF Archive path such as games/zcode/example.z5, when known.',
      ifarchive_url: 'Full IF Archive URL, when useful alongside the path.',
      provenance: 'Where this package or story file came from. Useful for rights review and future maintenance.',
      license_name: 'Human-readable license or rights status.',
      license_notes: 'Redistribution limits, permission notes, or review reminders.',
      source_url: 'Original download, repository, catalog, or project page for the package or story file.',
      source_retrieved: 'Date the source was retrieved, if you track it.',
      source_notes: 'Source/provenance notes for future maintenance and rights review.',
      terpvault: 'TerpVault-specific curation fields control publication and library presentation.',
      status: 'Draft keeps a package out of normal public listings unless your site is configured to show unpublished content.',
      featured: 'Marks a package for featured placement where a theme or template uses that signal.',
      tags: 'One tag per line, or comma-separated.',
      readonly_files: 'Package-local paths currently managed by dedicated tools or read from game.yaml. Feelies are managed below as curated manifest entries, not through arbitrary package browsing.'
    };

    return messages[key] || '';
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
        <p class="meta">Plain Markdown editor for package-local curator/helper content such as play notes, hints, and walkthroughs. This does not edit story files, artwork, iFiction XML, or player config.</p>
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

  _input(label, path, values, help = '') {
    return `
      <div class="field">
        <label>${this._esc(label)}</label>
        <input type="text" name="${this._esc(path)}" value="${this._esc(this._get(values, path) || '')}">
        ${help ? `<span class="help">${this._esc(help)}</span>` : ''}
      </div>
    `;
  }

  _textarea(label, path, values, className = '', help = '') {
    const value = this._asText(this._get(values, path));
    return `
      <div class="field">
        <label>${this._esc(label)}</label>
        <textarea class="${this._esc(className)}" name="${this._esc(path)}">${this._esc(value)}</textarea>
        ${help ? `<span class="help">${this._esc(help)}</span>` : ''}
      </div>
    `;
  }

  _select(label, path, values, options, help = '') {
    const value = String(this._get(values, path) || '');
    return `
      <div class="field">
        <label>${this._esc(label)}</label>
        <select name="${this._esc(path)}">
          ${options.map(([optionValue, optionLabel]) => `<option value="${this._esc(optionValue)}" ${value === optionValue ? 'selected' : ''}>${this._esc(optionLabel)}</option>`).join('')}
        </select>
        ${help ? `<span class="help">${this._esc(help)}</span>` : ''}
      </div>
    `;
  }

  _readOnlyList(readOnly) {
    const rows = [
      ['Slug', readOnly.slug],
      ['Story file', readOnly.story_file],
      ['Cover', readOnly.cover],
      ['Small cover', readOnly.small_cover],
      ['Hero', readOnly.hero],
      ['Screenshots', this._asText(readOnly.screenshots)],
      ['Feelies', this._asText(readOnly.feelies)],
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

  _collectFeelies(form) {
    const rows = [];
    new FormData(form).forEach((value, name) => {
      const match = String(name).match(/^feelies\[(\d+)\]\[(title|path|type|description)\]$/);
      if (!match) {
        return;
      }

      const index = Number(match[1]);
      const key = match[2];
      if (!rows[index]) {
        rows[index] = { title: '', path: '', type: '', description: '' };
      }
      rows[index][key] = String(value).trim();
    });

    return rows.filter(item => item && (item.title || item.path || item.type || item.description));
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

  _newMediaCacheKey() {
    return String(Date.now());
  }

  _cacheBustUrl(url, cacheKey) {
    if (!url || !cacheKey) {
      return url || '';
    }

    const separator = String(url).includes('?') ? '&' : '?';
    return `${url}${separator}tv_media=${encodeURIComponent(cacheKey)}`;
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
      hero: this._resourcePath(resources.hero) || this._resourcePath(fallbackGame.resources?.hero) || fallbackGame.hero || '',
      screenshots: resources.screenshots || fallbackGame.screenshots || [],
      feelies: resources.feelies || fallbackGame.resources?.feelies || fallbackGame.feelies || [],
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
      hero: this._resourcePath(game.resources?.hero) || game.hero || '',
      screenshots: game.screenshots || game.resources?.screenshots || [],
      feelies: game.feelies || game.resources?.feelies || [],
      how_to_play: game.how_to_play || game.resources?.how_to_play || '',
      hints: game.hints || game.resources?.hints || '',
      walkthrough: game.walkthrough || game.resources?.walkthrough || '',
      player: game.player_engine || game.player?.engine || ''
    };
  }

  _metadataApiUrl(slug) {
    return `${this._apiBase()}/terpvault/packages/${encodeURIComponent(slug)}/metadata`;
  }

  _ifictionPreviewApiUrl(slug) {
    return `${this._apiBase()}/terpvault/packages/${encodeURIComponent(slug)}/metadata/ifiction`;
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

  _feeliesApiUrl(slug) {
    return `${this._apiBase()}/terpvault/packages/${encodeURIComponent(slug)}/feelies`;
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
      cacheKey: '',
      resources: {
        cover: '',
        small_cover: '',
        hero: '',
        screenshots: []
      }
    };
  }

  _emptyIFictionState() {
    return {
      loading: false,
      applying: false,
      error: '',
      success: '',
      report: null
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
        hero: this._resourcePath(resources.hero) || this._resourcePath(fallbackGame.resources?.hero) || fallbackGame.hero || '',
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
        hero: this._resourcePath(game.resources?.hero) || game.hero || '',
        screenshots: Array.isArray(game.resources?.screenshots) ? game.resources.screenshots : []
      }
    };
  }

  _emptyFeeliesState() {
    return {
      loading: false,
      saving: '',
      error: '',
      success: '',
      items: []
    };
  }

  _feeliesFromApi(data, fallbackGame) {
    const payload = this._unwrapApiResponse(data);
    return {
      ...this._emptyFeeliesState(),
      items: Array.isArray(payload.feelies) ? payload.feelies.map(item => this._normalizeFeelieItem(item)) : this._feeliesFromGame(fallbackGame).items
    };
  }

  _feeliesFromGame(game = {}) {
    const publicFeelies = Array.isArray(game.feelies) ? game.feelies : [];
    const manifestFeelies = Array.isArray(game.resources?.feelies) ? game.resources.feelies : [];
    const source = manifestFeelies.length ? manifestFeelies : publicFeelies;

    return {
      ...this._emptyFeeliesState(),
      items: source.map((item, index) => {
        const data = typeof item === 'string' ? { path: item } : (item || {});
        const publicItem = publicFeelies.find(feelie => feelie.path === data.path) || {};
        return this._normalizeFeelieItem({
          index,
          title: data.title || publicItem.title || '',
          path: data.path || publicItem.path || '',
          type: data.type || data.category || publicItem.type || '',
          description: data.description || publicItem.description || '',
          extension: publicItem.extension || '',
          exists: Boolean(publicItem.url),
          url: publicItem.url || '',
          valid: true,
          error: ''
        });
      })
    };
  }

  _normalizeFeelieItem(item = {}) {
    return {
      index: Number.isFinite(Number(item.index)) ? Number(item.index) : 0,
      title: item.title || '',
      path: item.path || '',
      type: item.type || '',
      description: item.description || '',
      extension: item.extension || (item.path ? String(item.path).split('.').pop() : ''),
      exists: Boolean(item.exists),
      url: item.url || '',
      valid: item.valid !== false,
      error: item.error || ''
    };
  }

  _currentFeelieItems() {
    const items = this.state.editor?.feelies?.items || [];
    return Array.isArray(items) ? items.map(item => ({ ...item })) : [];
  }

  _currentScreenshotPaths() {
    const screenshots = this.state.editor?.media?.resources?.screenshots || [];
    return Array.isArray(screenshots) ? screenshots.slice() : [];
  }

  _resourcePath(value) {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'object' && value.path) {
      return String(value.path);
    }
    return '';
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
      return value.map((item) => {
        if (item && typeof item === 'object') {
          const title = item.title ? `${item.title}: ` : '';
          return `${title}${item.path || ''}`.trim();
        }
        return String(item);
      }).filter(Boolean).join('\n');
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
          <dt>Plugin version</dt><dd><code>${this._esc(data.version || this._version() || 'unknown')}</code></dd>
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

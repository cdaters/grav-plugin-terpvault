const TAG = window.__GRAV_PAGE_TAG || 'terpvault-page';

class TerpVaultPage extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.state = {
      games: [],
      formats: {},
      settingsSave: { saving: false, result: null, error: '' },
      formatsSave: { saving: false, result: null, error: '' },
      status: null,
      source: 'loading',
      activeTab: localStorage.getItem('terpvault.admin.tab') || 'library',
      libraryControls: this._libraryControlsFromStorage(),
      packageActions: {},
      editingSlug: null,
      create: {
        open: false,
        saving: false,
        error: '',
        success: '',
        report: null,
        values: {},
        ecosystem: this._emptyEcosystemState()
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
          uploading: false,
          applying: false,
          error: '',
          success: '',
          report: null
        },
        ecosystem: this._emptyEcosystemState()
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
      const data = await this._requestJson(this._packagesApiUrl(), { method: 'GET' });
      this._applyData(data, 'Admin2 package API');
    } catch (error) {
      try {
        const manifestUrl = this._manifestUrl();
        const response = await fetch(manifestUrl, { headers: { Accept: 'application/json' } });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || response.statusText || `HTTP ${response.status}`);
        }
        this._applyData(data, 'public read-only manifest');
      } catch (fallbackError) {
        this.state.source = 'unavailable';
        this._renderUnavailable(fallbackError);
      }
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
    this._normalizeLibraryControlsForData();
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
        .library-controls { border:1px solid rgba(127,127,127,.28); border-radius:12px; padding:.8rem; margin:0 0 .85rem; background:rgba(127,127,127,.035); display:grid; gap:.7rem; }
        .library-control-grid { display:grid; grid-template-columns:minmax(220px, 1.4fr) repeat(4, minmax(150px, 1fr)) auto; gap:.55rem; align-items:end; }
        .library-control { display:grid; gap:.25rem; min-width:0; }
        .library-control label { font-weight:600; font-size:.78rem; opacity:.78; }
        .library-control input, .library-control select { min-height:2.35rem; }
        .library-count { display:flex; align-items:center; justify-content:space-between; gap:.75rem; flex-wrap:wrap; }
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
        .warning.warn { border-color: rgba(255,188,87,.65); background:rgba(255,188,87,.08); }
        .warning strong { display:block; font-size:.86rem; }
        .side { display:grid; gap:.8rem; align-content:start; }
        .provenance { display:grid; gap:.5rem; }
        .provenance-item { border:1px solid rgba(127,127,127,.2); border-radius:10px; padding:.55rem; }
        .provenance-item span { display:block; opacity:.68; font-size:.75rem; text-transform:uppercase; }
        .provenance-item a { color:inherit; overflow-wrap:anywhere; }
        .ecosystem-report { display:grid; gap:.85rem; margin-top:.85rem; }
        .ecosystem-apply { display:grid; gap:.85rem; min-width:0; }
        .preview-card-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:.65rem; align-items:stretch; }
        .preview-card { display:grid; align-content:start; gap:.35rem; min-width:0; }
        .preview-card code { display:block; overflow-wrap:anywhere; white-space:pre-wrap; }
        .preview-card .checkbox { margin-top:.45rem; }
        .preview-section { display:grid; gap:.55rem; min-width:0; }
        .preview-section h4 { margin:.15rem 0 0; }
        .comparison-table-wrap { overflow:auto; border:1px solid rgba(127,127,127,.22); border-radius:10px; background:rgba(127,127,127,.025); }
        .comparison-table { width:100%; min-width:760px; border-collapse:collapse; font-size:.86rem; }
        .comparison-table th, .comparison-table td { border-bottom:1px solid rgba(127,127,127,.18); padding:.5rem; vertical-align:top; text-align:left; }
        .comparison-table th { font-size:.74rem; opacity:.78; text-transform:uppercase; background:rgba(127,127,127,.055); position:sticky; top:0; z-index:1; }
        .comparison-field { min-width:150px; }
        .comparison-cell { display:grid; gap:.35rem; min-width:150px; }
        .comparison-cell code { display:block; max-height:8rem; overflow:auto; white-space:pre-wrap; overflow-wrap:anywhere; }
        .comparison-status { display:inline-flex; width:max-content; max-width:100%; border:1px solid rgba(127,127,127,.3); border-radius:999px; padding:.08rem .42rem; font-size:.72rem; line-height:1.25; }
        .comparison-status.identical { border-color:rgba(79,190,124,.58); background:rgba(79,190,124,.1); }
        .comparison-status.missing { border-color:rgba(93,164,255,.6); background:rgba(93,164,255,.1); }
        .comparison-status.different { border-color:rgba(255,188,87,.65); background:rgba(255,188,87,.12); }
        .comparison-status.reference, .comparison-status.unsafe { border-color:rgba(127,127,127,.36); background:rgba(127,127,127,.08); }
        .comparison-apply { display:flex; gap:.35rem; align-items:center; margin:.1rem 0 0; }
        .comparison-apply input { width:auto; }
        .editor { border-top:1px solid rgba(127,127,127,.18); padding:1rem; background:rgba(127,127,127,.035); }
        .editor-head { display:flex; gap:.75rem; align-items:flex-start; justify-content:space-between; margin-bottom:.8rem; }
        .editor-head h3 { margin:0 0 .15rem; }
        .editor form { display:grid; gap:1rem; }
        .editor-sections, .create-steps, .subsections { display:grid; gap:.75rem; }
        .editor-section, .create-step, .subsection { border:1px solid rgba(127,127,127,.24); border-radius:12px; background:rgba(127,127,127,.025); overflow:hidden; }
        .subsection { border-radius:10px; background:rgba(127,127,127,.02); }
        .editor-section > summary, .create-step > summary, .subsection > summary { cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:.75rem; padding:.7rem .85rem; font-weight:700; }
        .subsection > summary { padding:.6rem .75rem; font-size:.92rem; }
        .editor-section > summary::-webkit-details-marker, .create-step > summary::-webkit-details-marker, .subsection > summary::-webkit-details-marker { display:none; }
        .section-kicker { font-weight:400; opacity:.68; font-size:.8rem; text-align:right; }
        .section-body { border-top:1px solid rgba(127,127,127,.16); padding:.85rem; }
        .subsection .section-body { padding:.75rem; }
        .section-body > .story-manager,
        .section-body > .media-manager,
        .section-body > .feelies-manager,
        .section-body > .helper-docs { border-top:0; margin-top:0; padding-top:0; }
        .section-body > .story-manager + .story-manager,
        .section-body > .media-manager + .feelies-manager,
        .section-body > .story-manager + .helper-docs { border-top:1px solid rgba(127,127,127,.18); margin-top:1rem; padding-top:1rem; }
        .export-panel { display:grid; gap:.55rem; }
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
        .readonly { display:grid; gap:.55rem; margin-top:.35rem; min-width:0; }
        .readonly div { display:grid; grid-template-columns:minmax(0,1fr); gap:.18rem; font-size:.86rem; min-width:0; }
        .readonly span:first-child { opacity:.68; }
        .readonly code { display:block; min-width:0; max-width:100%; overflow-x:auto; white-space:nowrap; overflow-wrap:normal; word-break:normal; }
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
        .message.warn { border-color:rgba(255,188,87,.65); background:rgba(255,188,87,.1); }
        .message.success { border-color:rgba(79,190,124,.58); background:rgba(79,190,124,.1); }
        .form-actions { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; justify-content:flex-end; margin-top:.9rem; }
        .extension-chip-list { display:flex; flex-wrap:wrap; gap:.35rem; margin:.5rem 0 .15rem; }
        .extension-chip { display:inline-flex; align-items:center; border:1px solid rgba(127,127,127,.32); border-radius:999px; padding:.1rem .45rem; background:rgba(127,127,127,.065); font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:.78rem; line-height:1.35; }
        .helper-docs { border-top:1px solid rgba(127,127,127,.18); margin-top:1rem; padding-top:1rem; }
        .helper-tabs { display:flex; flex-wrap:wrap; gap:.45rem; margin:.7rem 0; }
        .helper-tabs .button[aria-selected="true"] { border-color:rgba(93,164,255,.72); background:rgba(93,164,255,.18); }
        .story-manager { border-top:1px solid rgba(127,127,127,.18); margin-top:1rem; padding-top:1rem; }
        .create-panel { border:1px solid rgba(93,164,255,.35); border-radius:12px; padding:1rem; margin:0 0 .85rem; background:rgba(93,164,255,.055); }
        .create-panel form { display:grid; gap:.85rem; }
        .create-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:.75rem; }
        .create-optional { margin-top:.75rem; }
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
          .library-control-grid { grid-template-columns:1fr; }
          .library-count { display:grid; }
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
          <p class="meta">Admin2 is opt-in. Package export, import inspection, draft-only import install, local iFiction XML upload/preview, selected-field iFiction apply, and whitelisted plugin configuration saves are available. Package delete, overwrite, arbitrary file browsing, file conversion, and remote catalog lookup are not available.</p>
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
            <button class="button primary" type="button" data-action="create-package" aria-expanded="${this.state.create.open ? 'true' : 'false'}">${this.state.create.open ? 'Package Builder Open' : 'Create Package'}</button>
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
    const visibleGames = this._visibleGames();
    root.innerHTML = `
      <div class="box notice">
        <div class="editor-head">
          <div>
            <strong>${games.length} package${games.length === 1 ? '' : 's'} found</strong>
            <p class="meta">Source: ${this._esc(this.state.source)}. Status and validation notes flag playability problems and metadata gaps before publication. Package creation, editing, export, import inspection, and draft-only import install use the Admin2 API when available. Delete and overwrite are intentionally unavailable.</p>
          </div>
          <div class="actions" style="margin-top:0;">
            <button class="button" type="button" data-action="inspect-import">${this.state.importInspect.open ? 'Inspecting Import' : 'Inspect Import'}</button>
            <button class="button primary" type="button" data-action="create-package" aria-expanded="${this.state.create.open ? 'true' : 'false'}">${this.state.create.open ? 'Package Builder Open' : 'Create Package'}</button>
          </div>
        </div>
        <div class="badges" style="justify-content:flex-start;margin-top:.5rem;">
          <span class="badge ${errors ? 'error' : 'ok'}">${errors} error${errors === 1 ? '' : 's'}</span>
          <span class="badge ${warnings ? 'warn' : 'ok'}">${warnings} warning${warnings === 1 ? '' : 's'}</span>
        </div>
      </div>
      ${this.state.create.open ? this._createPackagePanel() : ''}
      ${this.state.importInspect.open ? this._importInspectPanel() : ''}
      ${this._libraryControlBar(games, visibleGames)}
      ${visibleGames.length ? visibleGames.map(game => this._gameRow(game)).join('') : this._emptyLibraryResults(games.length)}
    `;
    this._bindLibraryActions();
  }

  _libraryControlBar(games, visibleGames) {
    const controls = this.state.libraryControls || this._defaultLibraryControls();
    const formats = this._libraryFormatOptions(games);
    return `
      <section class="library-controls" aria-label="Library search and filters">
        <div class="library-control-grid">
          <div class="library-control">
            <label for="tv-library-search">Search</label>
            <input id="tv-library-search" type="search" data-library-control="search" value="${this._esc(controls.search)}" placeholder="Title, slug, author, IFID, source...">
          </div>
          <div class="library-control">
            <label for="tv-library-sort">Sort</label>
            <select id="tv-library-sort" data-library-control="sort">
              ${this._options([
                ['title-asc', 'Title A-Z'],
                ['title-desc', 'Title Z-A'],
                ['author-asc', 'Author A-Z'],
                ['year-desc', 'Year newest'],
                ['year-asc', 'Year oldest'],
                ['format-asc', 'Format / engine'],
                ['status-asc', 'Status'],
                ['slug-asc', 'Slug A-Z']
              ], controls.sort)}
            </select>
          </div>
          <div class="library-control">
            <label for="tv-library-status">Status</label>
            <select id="tv-library-status" data-library-control="status">
              ${this._options([['all', 'All statuses'], ['published', 'Published'], ['draft', 'Draft']], controls.status)}
            </select>
          </div>
          <div class="library-control">
            <label for="tv-library-featured">Featured</label>
            <select id="tv-library-featured" data-library-control="featured">
              ${this._options([['all', 'All packages'], ['featured', 'Featured'], ['not-featured', 'Not featured']], controls.featured)}
            </select>
          </div>
          <div class="library-control">
            <label for="tv-library-format">Format</label>
            <select id="tv-library-format" data-library-control="format">
              ${this._options([['all', 'All formats'], ...formats], controls.format)}
            </select>
          </div>
          <div class="library-control">
            <label for="tv-library-completeness">Completeness</label>
            <select id="tv-library-completeness" data-library-control="completeness">
              ${this._options([
                ['all', 'All metadata'],
                ['missing-cover', 'Missing cover'],
                ['missing-screenshots', 'Missing screenshots'],
                ['missing-walkthrough', 'Missing walkthrough'],
                ['missing-ifid', 'Missing IFID'],
                ['metadata-ok', 'Metadata OK'],
                ['metadata-partial', 'Metadata partial'],
                ['metadata-needs-review', 'Metadata needs review'],
                ['metadata-error', 'Metadata error'],
                ['has-catalog-links', 'Catalog linked'],
                ['missing-catalog-links', 'No catalog links']
              ], controls.completeness)}
            </select>
          </div>
        </div>
        <div class="library-count">
          <span class="meta">Showing ${visibleGames.length} of ${games.length} package${games.length === 1 ? '' : 's'}.</span>
          <button class="button" type="button" data-action="reset-library-controls" ${this._libraryControlsAreDefault() ? 'disabled' : ''}>Reset filters</button>
        </div>
      </section>
    `;
  }

  _emptyLibraryResults(total) {
    return `
      <div class="empty">
        <h2>No packages match</h2>
        <p class="meta">No packages match the current search and filters. ${total ? 'Reset filters or broaden the search query.' : ''}</p>
      </div>
    `;
  }

  _defaultLibraryControls() {
    return {
      search: '',
      sort: 'title-asc',
      status: 'all',
      featured: 'all',
      format: 'all',
      completeness: 'all'
    };
  }

  _libraryControlsFromStorage() {
    const defaults = this._defaultLibraryControls();
    try {
      const stored = JSON.parse(localStorage.getItem('terpvault.admin.library.controls') || '{}');
      return {
        search: String(stored.search || defaults.search),
        sort: this._allowedValue(stored.sort, ['title-asc', 'title-desc', 'author-asc', 'year-desc', 'year-asc', 'format-asc', 'status-asc', 'slug-asc'], defaults.sort),
        status: this._allowedValue(stored.status, ['all', 'published', 'draft'], defaults.status),
        featured: this._allowedValue(stored.featured, ['all', 'featured', 'not-featured'], defaults.featured),
        format: String(stored.format || defaults.format),
        completeness: this._allowedValue(stored.completeness, ['all', 'missing-cover', 'missing-screenshots', 'missing-walkthrough', 'missing-ifid', 'metadata-ok', 'metadata-partial', 'metadata-needs-review', 'metadata-error', 'has-catalog-links', 'missing-catalog-links'], defaults.completeness)
      };
    } catch (e) {
      return defaults;
    }
  }

  _allowedValue(value, allowed, fallback) {
    const text = String(value || '');
    return allowed.includes(text) ? text : fallback;
  }

  _persistLibraryControls() {
    localStorage.setItem('terpvault.admin.library.controls', JSON.stringify(this.state.libraryControls || this._defaultLibraryControls()));
  }

  _updateLibraryControl(key, value) {
    if (!Object.prototype.hasOwnProperty.call(this._defaultLibraryControls(), key)) {
      return;
    }

    const activeId = this.shadowRoot.activeElement?.id || '';
    const selectionStart = typeof this.shadowRoot.activeElement?.selectionStart === 'number' ? this.shadowRoot.activeElement.selectionStart : null;
    const selectionEnd = typeof this.shadowRoot.activeElement?.selectionEnd === 'number' ? this.shadowRoot.activeElement.selectionEnd : null;
    this.state.libraryControls = {
      ...(this.state.libraryControls || this._defaultLibraryControls()),
      [key]: String(value || '')
    };
    this._persistLibraryControls();
    this._renderLibrary();
    if (activeId) {
      queueMicrotask(() => {
        const next = this.shadowRoot.getElementById(activeId);
        if (next) {
          next.focus();
          if (selectionStart !== null && typeof next.setSelectionRange === 'function') {
            next.setSelectionRange(selectionStart, selectionEnd ?? selectionStart);
          }
        }
      });
    }
  }

  _resetLibraryControls() {
    this.state.libraryControls = this._defaultLibraryControls();
    this._persistLibraryControls();
    this._renderLibrary();
  }

  _libraryControlsAreDefault() {
    const controls = this.state.libraryControls || this._defaultLibraryControls();
    const defaults = this._defaultLibraryControls();
    return Object.keys(defaults).every(key => String(controls[key] || '') === String(defaults[key] || ''));
  }

  _normalizeLibraryControlsForData() {
    const controls = this.state.libraryControls || this._defaultLibraryControls();
    if (controls.format === 'all') {
      return;
    }

    const availableFormats = new Set(this._libraryFormatOptions(this.state.games || []).map(([value]) => value));
    if (!availableFormats.has(controls.format)) {
      this.state.libraryControls = { ...controls, format: 'all' };
      this._persistLibraryControls();
    }
  }

  _visibleGames() {
    const controls = this.state.libraryControls || this._defaultLibraryControls();
    const query = this._normalizeSearch(controls.search);
    const filtered = (this.state.games || []).filter(game => {
      if (query && !this._librarySearchText(game).includes(query)) {
        return false;
      }
      if (controls.status !== 'all' && this._gameStatus(game) !== controls.status) {
        return false;
      }
      if (controls.featured === 'featured' && !this._gameFeatured(game)) {
        return false;
      }
      if (controls.featured === 'not-featured' && this._gameFeatured(game)) {
        return false;
      }
      if (controls.format !== 'all' && this._gameFormatKey(game) !== controls.format) {
        return false;
      }
      return this._matchesCompletenessFilter(game, controls.completeness);
    });

    return filtered.sort((a, b) => this._compareGames(a, b, controls.sort));
  }

  _librarySearchText(game) {
    const format = this._gameFormatInfo(game);
    const values = [
      game.title,
      game.slug,
      game.author,
      format.key,
      format.label,
      ...format.aliases,
      game.format,
      game.format_label,
      game.player_engine,
      game.player?.engine,
      game.status,
      game.year,
      game.bibliographic?.first_published,
      game.genre,
      game.language,
      game.story_file,
      this._metadataReadiness(game).label,
      game.has_ifiction ? 'ifiction xml metadata.iFiction.xml present' : 'no ifiction xml missing metadata.iFiction.xml',
      ...(Array.isArray(game.ifids) ? game.ifids : []),
      ...(Array.isArray(game.tags) ? game.tags : []),
      ...(Array.isArray(game.terpvault?.tags) ? game.terpvault.tags : []),
      ...this._catalogSearchValues(game.catalog || {}),
      ...this._catalogLinkSearchValues(game.catalog_links || []),
      ...this._provenanceSearchValues(game.provenance_rows || []),
      ...this._objectValues(game.references || {}),
      ...this._objectValues(game.release || {}),
      ...this._objectValues(game.source || {}),
      ...this._objectValues(game.license || {})
    ];

    return this._normalizeSearch(values.filter(value => value !== undefined && value !== null).join(' '));
  }

  _normalizeSearch(value) {
    return String(value || '').toLowerCase().trim();
  }

  _objectValues(value) {
    if (!value || typeof value !== 'object') {
      return [];
    }

    return Object.values(value).flatMap(item => {
      if (Array.isArray(item)) {
        return item.map(entry => String(entry || ''));
      }
      if (item && typeof item === 'object') {
        return this._objectValues(item);
      }
      return [String(item || '')];
    });
  }

  _catalogSearchValues(catalog) {
    return [
      catalog.ifdb?.tuid,
      catalog.ifdb?.url,
      catalog.ifwiki?.url,
      catalog.ifarchive?.path,
      catalog.ifarchive?.url,
      catalog.babel?.url
    ].filter(Boolean);
  }

  _catalogLinkSearchValues(links) {
    return Array.isArray(links) ? links.flatMap(link => [link.key, link.label, link.url, link.value, link.text].filter(Boolean)) : [];
  }

  _provenanceSearchValues(rows) {
    return Array.isArray(rows) ? rows.flatMap(row => [row.label, row.url, row.text, row.note, ...(Array.isArray(row.values) ? row.values : [])].filter(Boolean)) : [];
  }

  _libraryFormatOptions(games) {
    const seen = new Map();
    games.forEach(game => {
      const format = this._gameFormatInfo(game);
      if (!format.key) {
        return;
      }
      seen.set(format.key, format.label);
    });

    return Array.from(seen.entries()).sort((a, b) => this._compareText(a[1], b[1]));
  }

  _options(options, selected) {
    return options.map(([value, label]) => `<option value="${this._esc(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${this._esc(label)}</option>`).join('');
  }

  _gameFormatKey(game) {
    return this._gameFormatInfo(game).key;
  }

  _gameFormatInfo(game) {
    const explicit = this._normalizeFormatToken(game.identification?.format || game.identification?.system || game.format || game.system || '');
    const strong = [
      this._formatFromIfids(game.ifids || game.identification?.ifids || []),
      this._formatFromStoryFile(game.story_file || game.resources?.story_file || ''),
      this._formatFromCatalog(game.catalog || {}),
      this._normalizeFormatToken(game.player?.format || game.player?.runtime || '')
    ].find(Boolean);
    const engine = this._normalizeFormatToken(game.player_engine || game.player?.engine || '');
    const weak = this._formatFromTags([...(Array.isArray(game.tags) ? game.tags : []), ...(Array.isArray(game.terpvault?.tags) ? game.terpvault.tags : [])]);
    const key = explicit && explicit !== 'tads' ? explicit : (strong || explicit || engine || weak);
    const label = this._formatLabel(key, game.format_label || game.format || game.player_engine || '');

    return {
      key,
      label,
      aliases: this._formatAliases(key)
    };
  }

  _normalizeFormatToken(value) {
    const token = String(value || '').toLowerCase().trim().replace(/[_\s]+/g, '-');
    if (!token) {
      return '';
    }
    if (['zcode', 'z-code', 'z-machine', 'zmachine', 'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8', 'zblorb', 'zlb'].includes(token)) {
      return 'zcode';
    }
    if (['glulx', 'ulx', 'gblorb', 'glb', 'blorb'].includes(token)) {
      return 'glulx';
    }
    if (['tads2', 'tads-2', 'tadsii', 'tads-ii', 'gam'].includes(token)) {
      return 'tads2';
    }
    if (['tads3', 'tads-3', 'tadsiii', 'tads-iii', 't3'].includes(token)) {
      return 'tads3';
    }
    if (token === 'tads') {
      return 'tads';
    }
    if (token === 'hugo' || token === 'hex') {
      return 'hugo';
    }
    if (token === 'adrift' || token === 'taf') {
      return 'adrift';
    }
    if (token === 'ink') {
      return 'ink';
    }

    return token;
  }

  _formatFromIfids(ifids) {
    const values = Array.isArray(ifids) ? ifids : [ifids];
    const joined = values.map(value => String(value || '').toUpperCase()).join(' ');
    if (joined.includes('TADS2-')) return 'tads2';
    if (joined.includes('TADS3-')) return 'tads3';
    if (joined.includes('ZCODE-')) return 'zcode';
    if (joined.includes('GLULX-')) return 'glulx';
    return '';
  }

  _formatFromStoryFile(storyFile) {
    const ext = String(storyFile || '').toLowerCase().split('?')[0].split('#')[0].split('.').pop();
    return this._normalizeFormatToken(ext);
  }

  _formatFromCatalog(catalog) {
    const text = [
      catalog.ifarchive?.path,
      catalog.ifarchive?.url
    ].filter(Boolean).join(' ').toLowerCase();

    if (text.includes('/games/tads/') || text.includes('games/tads/')) {
      if (text.includes('.t3')) return 'tads3';
      if (text.includes('.gam')) return 'tads2';
      return 'tads';
    }

    return this._formatFromStoryFile(text);
  }

  _formatFromTags(tags) {
    const normalized = (Array.isArray(tags) ? tags : []).map(tag => this._normalizeFormatToken(tag)).filter(Boolean);
    return normalized.find(tag => ['zcode', 'glulx', 'tads2', 'tads3', 'tads', 'hugo', 'adrift', 'ink'].includes(tag)) || '';
  }

  _formatLabel(key, fallback = '') {
    const labels = {
      zcode: 'Z-code',
      glulx: 'Glulx',
      tads2: 'TADS 2',
      tads3: 'TADS 3',
      tads: 'TADS',
      hugo: 'Hugo',
      adrift: 'ADRIFT',
      ink: 'Ink'
    };
    if (labels[key]) {
      return labels[key];
    }

    return String(fallback || key || 'Unknown').trim();
  }

  _formatAliases(key) {
    const aliases = {
      zcode: ['zcode', 'z-code', 'z-machine'],
      glulx: ['glulx', 'ulx'],
      tads2: ['tads', 'tads2', 'tads 2', 'tads-2'],
      tads3: ['tads', 'tads3', 'tads 3', 'tads-3'],
      tads: ['tads'],
      hugo: ['hugo'],
      adrift: ['adrift'],
      ink: ['ink']
    };

    return aliases[key] || [];
  }

  _gameStatus(game) {
    return String(game.terpvault?.status || game.status || 'draft').toLowerCase().trim();
  }

  _gameFeatured(game) {
    return Boolean(game.terpvault?.featured || game.featured);
  }

  _matchesCompletenessFilter(game, filter) {
    if (filter === 'all') {
      return true;
    }
    if (filter === 'missing-cover') {
      return this._hasWarning(game, 'missing-cover') || !(game.urls?.cover || game.cover || game.resources?.cover);
    }
    if (filter === 'missing-screenshots') {
      const screenshots = Array.isArray(game.urls?.screenshots) ? game.urls.screenshots : (Array.isArray(game.resources?.screenshots) ? game.resources.screenshots : game.screenshots);
      return !Array.isArray(screenshots) || screenshots.length === 0;
    }
    if (filter === 'missing-walkthrough') {
      return this._hasWarning(game, 'missing-walkthrough') || !(game.walkthrough || game.resources?.walkthrough);
    }
    if (filter === 'missing-ifid') {
      return !Array.isArray(game.ifids) || game.ifids.length === 0;
    }
    if (filter === 'metadata-ok') {
      return this._metadataReadiness(game).key === 'ok';
    }
    if (filter === 'metadata-partial') {
      return this._metadataReadiness(game).key === 'partial';
    }
    if (filter === 'metadata-needs-review') {
      return this._metadataReadiness(game).key === 'needs-review';
    }
    if (filter === 'metadata-error') {
      return this._metadataReadiness(game).key === 'error';
    }
    if (filter === 'has-catalog-links') {
      return this._hasCatalogLinks(game);
    }
    if (filter === 'missing-catalog-links') {
      return !this._hasCatalogLinks(game);
    }

    return true;
  }

  _hasWarning(game, code) {
    return Array.isArray(game.warnings) && game.warnings.some(warning => warning?.code === code);
  }

  _hasCatalogLinks(game) {
    if (Array.isArray(game.catalog_links) && game.catalog_links.length) {
      return true;
    }

    const values = this._catalogSearchValues(game.catalog || {});
    return values.some(value => String(value || '').trim() !== '');
  }

  _metadataReadiness(game) {
    const errorCount = Number(game.error_count || 0);
    if (errorCount > 0 || this._gameWarnings(game).some(warning => (warning?.severity || '') === 'error')) {
      return { key: 'error', tone: 'error', label: 'Metadata error' };
    }

    const warningCount = Number(game.warning_count || 0);
    const reviewCodes = new Set(['missing-source', 'missing-license', 'missing-redistribution-notes', 'license-review']);
    const hasReviewWarning = this._gameWarnings(game).some(warning => reviewCodes.has(warning?.code || ''));
    if (hasReviewWarning) {
      return { key: 'needs-review', tone: 'warn', label: 'Metadata needs review' };
    }

    if (warningCount > 0) {
      return { key: 'partial', tone: 'warn', label: 'Metadata partial' };
    }

    if (this._hasCoreMetadata(game) && this._hasMetadataSource(game)) {
      return { key: 'ok', tone: 'ok', label: 'Metadata OK' };
    }

    return { key: 'partial', tone: 'warn', label: 'Metadata partial' };
  }

  _gameWarnings(game) {
    const warnings = Array.isArray(game.warnings) ? game.warnings : [];
    const advisory = Array.isArray(game.advisory_warnings) ? game.advisory_warnings : [];
    return warnings.length ? warnings : advisory;
  }

  _hasCoreMetadata(game) {
    const title = String(game.title || '').trim();
    const slug = String(game.slug || '').trim();
    const hasTitle = title !== '' && title !== slug;
    const hasAuthor = String(game.author || '').trim() !== '';
    const hasFormat = this._gameFormatInfo(game).key !== '';

    return hasTitle && hasAuthor && hasFormat && Boolean(game.has_story_file);
  }

  _hasMetadataSource(game) {
    if (game.has_ifiction || this._hasCatalogLinks(game) || this._hasSourceReference(game) || this._hasLicenseInfo(game)) {
      return true;
    }

    const references = game.references || {};
    if (Array.isArray(references) && references.length) {
      return true;
    }
    if (!Array.isArray(references) && references && typeof references === 'object' && Object.keys(references).length) {
      return true;
    }

    return Array.isArray(game.provenance_rows) && game.provenance_rows.length > 0;
  }

  _hasSourceReference(game) {
    const source = game.release?.source || game.source || {};
    const catalog = game.catalog || {};
    return Boolean(
      source.url
      || source.upstream?.url
      || source.port_repository?.url
      || catalog.ifarchive?.url
      || catalog.ifarchive?.path
    );
  }

  _hasLicenseInfo(game) {
    const license = game.release?.license || game.license || {};
    return Boolean(license.name || license.url || license.notes);
  }

  _compareGames(a, b, sort) {
    if (sort === 'title-desc') {
      return this._compareText(b.title || b.slug, a.title || a.slug);
    }
    if (sort === 'author-asc') {
      return this._compareText(a.author || '', b.author || '') || this._compareText(a.title || a.slug, b.title || b.slug);
    }
    if (sort === 'year-desc') {
      return this._yearValue(b) - this._yearValue(a) || this._compareText(a.title || a.slug, b.title || b.slug);
    }
    if (sort === 'year-asc') {
      return this._yearValue(a) - this._yearValue(b) || this._compareText(a.title || a.slug, b.title || b.slug);
    }
    if (sort === 'format-asc') {
      return this._compareText(this._gameFormatSortText(a), this._gameFormatSortText(b)) || this._compareText(a.title || a.slug, b.title || b.slug);
    }
    if (sort === 'status-asc') {
      return this._compareText(this._gameStatus(a), this._gameStatus(b)) || this._compareText(a.title || a.slug, b.title || b.slug);
    }
    if (sort === 'slug-asc') {
      return this._compareText(a.slug || '', b.slug || '');
    }

    return this._compareText(a.title || a.slug, b.title || b.slug);
  }

  _compareText(a, b) {
    return String(a || '').localeCompare(String(b || ''), undefined, { sensitivity: 'base', numeric: true });
  }

  _yearValue(game) {
    const value = String(game.year || game.bibliographic?.first_published || '').match(/\d{4}/);
    return value ? Number(value[0]) : 0;
  }

  _gameFormatSortText(game) {
    const format = this._gameFormatInfo(game);
    return [format.label, game.player_engine || game.player?.engine || ''].join(' ');
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
    const coverPath = game.resources?.small_cover || game.small_cover || game.resources?.cover || game.cover || '';
    const cover = urls.small_cover || urls.thumbnail || urls.cover || this._adminMediaPreviewUrl(slug, coverPath) || '';
    const metadataBadge = this._metadataReadiness(game);
    const status = this._gameStatus(game);
    const statusLabel = status === 'published' ? 'Published' : 'Draft';
    const featured = this._gameFeatured(game);
    const action = this.state.packageActions?.[slug] || {};
    const actionBusy = Boolean(action.saving);

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
            <span class="badge ${status === 'published' ? 'ok' : 'warn'}">${this._esc(statusLabel)}</span>
            <span class="badge ${featured ? 'ok' : ''}">${featured ? 'Featured' : 'Not featured'}</span>
            <span class="badge ${this._esc(metadataBadge.tone)}">${this._esc(metadataBadge.label)}</span>
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
              <button class="button" type="button" data-action="set-status" data-slug="${this._esc(slug)}" data-status="${status === 'published' ? 'draft' : 'published'}" ${actionBusy ? 'disabled' : ''}>${actionBusy && action.type === 'status' ? 'Saving...' : (status === 'published' ? 'Unpublish' : 'Publish')}</button>
              <button class="button" type="button" data-action="toggle-featured" data-slug="${this._esc(slug)}" data-featured="${featured ? 'false' : 'true'}" ${actionBusy ? 'disabled' : ''}>${actionBusy && action.type === 'featured' ? 'Saving...' : (featured ? 'Remove Featured' : 'Mark Featured')}</button>
              ${urls.detail ? `<a class="button" href="${this._esc(urls.detail)}" target="_blank" rel="noopener">Public Detail</a>` : ''}
              ${urls.play ? `<a class="button" href="${this._esc(urls.play)}" target="_blank" rel="noopener">Public Play</a>` : ''}
              ${urls.story ? `<a class="button" href="${this._esc(urls.story)}" target="_blank" rel="noopener">Story File</a>` : ''}
              <button class="button" type="button" data-action="open-ifiction" data-slug="${this._esc(slug)}">iFiction</button>
              <button class="button" type="button" data-action="export" data-slug="${this._esc(slug)}" ${this.state.export.saving && this.state.export.slug === slug ? 'disabled' : ''}>${this.state.export.saving && this.state.export.slug === slug ? 'Exporting...' : 'Export'}</button>
            </div>
            ${action.error ? `<div class="message error">${this._esc(action.error)}</div>` : ''}
            ${action.success ? `<div class="message success">${this._esc(action.success)}</div>` : ''}
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
    const upstreamUrl = source.upstream?.url || '';
    const repositoryUrl = source.port_repository?.url || '';
    return `
      <dl>
        <dt>Slug</dt><dd><code>${this._esc(game.slug || '')}</code></dd>
        <dt>Story file</dt><dd><code>${this._esc(game.story_file || '')}</code></dd>
        <dt>Author</dt><dd>${this._esc(game.author || '')}</dd>
        <dt>Year</dt><dd>${this._esc(game.year || '')}</dd>
        <dt>IFIDs</dt><dd>${this._esc((game.ifids || []).join(', ') || 'Not recorded')}</dd>
        <dt>iFiction XML</dt><dd>${game.has_ifiction ? `<code>${this._esc(game.ifiction_path || 'metadata.iFiction.xml')}</code>` : 'Not present'}</dd>
        <dt>Source</dt><dd>${source.url ? `<a href="${this._esc(source.url)}" target="_blank" rel="noopener">${this._esc(source.url)}</a>` : this._esc(source.notes || 'Not recorded')}</dd>
        <dt>Upstream</dt><dd>${upstreamUrl ? `<a href="${this._esc(upstreamUrl)}" target="_blank" rel="noopener">${this._esc(upstreamUrl)}</a>` : 'Not recorded'}</dd>
        <dt>Port repo</dt><dd>${repositoryUrl ? `<a href="${this._esc(repositoryUrl)}" target="_blank" rel="noopener">${this._esc(repositoryUrl)}</a>` : 'Not recorded'}</dd>
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
      <section class="create-panel" data-terpwright-phase="3e-metadata-crosscheck">
        <div class="editor-head">
          <div>
            <h2>Terpwright Local Package Builder</h2>
            <p class="meta">Creates a new draft package from local files and curator-supplied references. IFDB, IFWiki, IF Archive normalization, and metadata cross-check are implemented as review-only helpers.</p>
          </div>
          <button class="button" type="button" data-action="cancel-create">Close</button>
        </div>
        ${state.error ? `<div class="message error">${this._esc(state.error)}</div>` : ''}
        ${state.success ? this._statusMessage(state.success, state.report ? this._reportStatus(state.report, 'create').tone : 'success') : ''}
        <form data-create-package data-terpwright-phase="3e-metadata-crosscheck">
          <div class="create-steps">
            ${this._createStep('Identity', 'Required title and package metadata', `
              <div class="subsections">
                ${this._subsection('Identity', 'Slug, title, attribution, IFID, year, language, and format', `
                  <div class="create-grid">
                    ${this._createInput('Slug', 'slug', true)}
                    ${this._createInput('Title', 'title', true)}
                    ${this._createInput('Author / source attribution', 'author')}
                    ${this._createInput('Headline', 'headline')}
                    ${this._createInput('IFID', 'ifid')}
                    ${this._createInput('First published', 'first_published')}
                    ${this._createInput('Language', 'language', false, 'en')}
                    ${this._createSelect('Format', 'format', [['', 'Infer from story file'], ['zcode', 'Z-code'], ['glulx', 'Glulx'], ['tads3', 'TADS 3'], ['tads2', 'TADS 2'], ['hugo', 'Hugo'], ['adrift', 'ADRIFT']])}
                  </div>
                `, true)}
                ${this._subsection('Classification & Presentation', 'Genre, tags, and public description', `
                  <div class="create-grid">
                    ${this._createInput('Genre', 'genre')}
                    ${this._createInput('Tags', 'tags')}
                  </div>
                  ${this._createTextarea('Description', 'description')}
                `, true)}
              </div>
            `, true)}
            ${this._createStep('Story File', 'Required only when creating the package', `
              <div class="field">
                <label>Story file</label>
                <input type="file" name="story_file" accept=".z1,.z2,.z3,.z4,.z5,.z6,.z7,.z8,.zblorb,.zlb,.ulx,.gblorb,.glb,.blorb,.hex,.gam,.t3,.taf" required ${state.saving ? 'disabled' : ''}>
                <span class="meta">Allowed: z1, z2, z3, z4, z5, z6, z7, z8, zblorb, zlb, ulx, gblorb, glb, blorb, hex, gam, t3, taf. SHA-256 is computed into <code>resources.story_sha256</code>. Ecosystem preview can run before this file is chosen.</span>
              </div>
            `, true)}
            ${this._createStep('Provenance URLs', 'Catalog, source, license, IFDB, IFWiki, and IF Archive references', `
              <p class="meta">Optional reference links for curator review. URL presence does not prove redistribution rights.</p>
              <div class="subsections">
                ${this._subsection('Source & Rights', 'Source, upstream, repository, license, and notes', `
                  <div class="create-grid">
                    ${this._createUrlInput('Source / package URL', 'source_url')}
                    ${this._createUrlInput('Upstream project URL', 'upstream_source_url')}
                    ${this._createUrlInput('Port/source repository URL', 'port_repository_url')}
                    ${this._createInput('License name', 'license_name')}
                    ${this._createUrlInput('License URL', 'license_url')}
                  </div>
                  ${this._createTextarea('License notes', 'license_notes', 'short')}
                  ${this._createTextarea('Source notes / redistribution notes', 'source_notes', 'short')}
                `, true)}
                ${this._subsection('Catalog', 'IFDB, IFWiki, and IF Archive references', `
                  <div class="create-grid">
                    ${this._createInput('IFDB TUID', 'ifdb_tuid')}
                    ${this._createUrlInput('IFDB URL', 'ifdb_url')}
                    ${this._createInput('IFWiki URL or title', 'ifwiki_url')}
                    ${this._createInput('IFWiki title', 'ifwiki_title')}
                    ${this._createInput('IF Archive path', 'ifarchive_path')}
                    ${this._createUrlInput('IF Archive URL', 'ifarchive_url')}
                  </div>
                  <div class="message">IFWiki preview uses the MediaWiki API when requested. Results require curator review and do not prove redistribution rights.</div>
                `, true)}
                ${this._subsection('Optional Reference URLs', 'Artwork, screenshots, walkthrough, hints, map, and history links', `
                  <div class="create-grid">
                    ${this._createUrlInput('Cover art source URL', 'cover_art_source_url')}
                    ${this._createUrlInput('Hero art source URL', 'hero_art_source_url')}
                    ${this._createUrlInput('Screenshot source URL', 'screenshot_source_url')}
                    ${this._createUrlInput('Walkthrough/reference URL', 'walkthrough_reference_url')}
                    ${this._createUrlInput('Hints/reference URL', 'hints_reference_url')}
                    ${this._createUrlInput('Map/reference URL', 'map_reference_url')}
                    ${this._createUrlInput('History/background URL', 'history_reference_url')}
                  </div>
                  ${this._createTextarea('Reference notes', 'reference_notes', 'short')}
                `, false)}
              </div>
            `, true)}
            ${this._createStep('Ecosystem Preview', 'Metadata cross-check, IFDB lookup, IFWiki lookup, and IF Archive normalization', this._ecosystemPreviewPanel('create'), true)}
            ${this._createStep('Local Resources', 'Media, iFiction XML, feelies, and helper docs', `
              <div class="create-grid">
                ${this._createFile('Cover', 'cover', '.jpg,.jpeg,.png,.webp,.gif')}
                ${this._createFile('Small cover', 'small_cover', '.jpg,.jpeg,.png,.webp,.gif')}
                ${this._createFile('Hero', 'hero', '.jpg,.jpeg,.png,.webp,.gif')}
                ${this._createFile('Screenshots', 'screenshots[]', '.jpg,.jpeg,.png,.webp,.gif', true)}
                ${this._createFile('metadata.iFiction.xml', 'ifiction', '.xml')}
                ${this._createFile('Feelies', 'feelies[]', '.pdf,.txt,.md,.jpg,.jpeg,.png,.webp,.gif,.mp3,.ogg,.wav,.m4a', true)}
                ${this._createFile('how-to-play.md', 'how_to_play', '.md')}
                ${this._createFile('hints.md', 'hints', '.md')}
                ${this._createFile('walkthrough.md', 'walkthrough', '.md')}
                ${this._createFile('known-differences.md', 'known_differences', '.md')}
                ${this._createFile('provenance.md', 'provenance', '.md')}
              </div>
              <p class="meta">Files are copied into safe package-local conventional paths. Optional helper docs are referenced in <code>game.yaml</code> only when supplied.</p>
            `, false)}
            ${this._createStep('Review & Create', 'Draft-only creation and calm validation notes', `
              <div class="message">Created packages are always saved as <strong>draft</strong> and <strong>not featured</strong>. Publish and featured placement remain separate review actions.</div>
              <p class="meta">Review identity, provenance references, local resources, and ecosystem preview notes before creating the draft package.</p>
              ${state.report ? this._createReport(state.report) : ''}
              <div class="form-actions">
                <button class="button" type="button" data-action="cancel-create">Cancel</button>
                <button class="button primary" type="submit" ${state.saving ? 'disabled' : ''}>${state.saving ? 'Creating...' : 'Create Draft Package'}</button>
              </div>
            `, true)}
          </div>
        </form>
      </section>
    `;
  }

  _createStep(title, kicker, body, open = false) {
    return `
      <details class="create-step" ${open ? 'open' : ''}>
        <summary><span>${this._esc(title)}</span><span class="section-kicker">${this._esc(kicker)}</span></summary>
        <div class="section-body">${body}</div>
      </details>
    `;
  }

  _createInput(label, name, required = false, value = '') {
    return `<div class="field"><label>${this._esc(label)}</label><input type="text" name="${this._esc(name)}" value="${this._esc(this._createFieldValue(name, value))}" ${required ? 'required' : ''}></div>`;
  }

  _createUrlInput(label, name, required = false, value = '') {
    return `<div class="field"><label>${this._esc(label)}</label><input type="url" name="${this._esc(name)}" value="${this._esc(this._createFieldValue(name, value))}" ${required ? 'required' : ''} placeholder="https://example.com/"></div>`;
  }

  _createTextarea(label, name, className = '') {
    return `<div class="field"><label>${this._esc(label)}</label><textarea class="${this._esc(className)}" name="${this._esc(name)}">${this._esc(this._createFieldValue(name, ''))}</textarea></div>`;
  }

  _createSelect(label, name, options) {
    return `
      <div class="field">
        <label>${this._esc(label)}</label>
        <select name="${this._esc(name)}">
          ${options.map(([value, text]) => `<option value="${this._esc(value)}" ${this._createFieldValue(name, '') === value ? 'selected' : ''}>${this._esc(text)}</option>`).join('')}
        </select>
      </div>
    `;
  }

  _createFieldValue(name, fallback = '') {
    const values = this.state.create?.values || {};
    return Object.prototype.hasOwnProperty.call(values, name) ? values[name] : fallback;
  }

  _createFile(label, name, accept, multiple = false) {
    return `
      <div class="field">
        <label>${this._esc(label)}</label>
        <input type="file" name="${this._esc(name)}" accept="${this._esc(accept)}" ${multiple ? 'multiple' : ''}>
      </div>
    `;
  }

  _createReport(report) {
    const validation = report.validation || report;
    const warnings = Array.isArray(validation.warnings) ? validation.warnings : [];
    const fatal = Array.isArray(validation.fatal_errors) ? validation.fatal_errors : [];
    const warningItems = warnings.map(warning => warning.message || warning.label || warning.code || String(warning));
    const status = this._reportStatus(report, 'create');
    const statusLabel = status.severity === 'error' ? 'blocked' : (status.severity === 'warn' ? 'created with warnings' : 'created');
    return `
      <div class="box" style="margin:.85rem 0;">
        <h3>Creation Report</h3>
        <div class="badges" style="justify-content:flex-start;margin:.45rem 0;">
          <span class="badge ${this._esc(status.badge)}">${this._esc(statusLabel)}</span>
          <span class="badge ok">draft</span>
          <span class="badge ok">not featured</span>
          ${report.story_sha256 ? '<span class="badge ok">story SHA-256 recorded</span>' : ''}
          ${report.has_ifiction ? '<span class="badge ok">iFiction copied</span>' : ''}
        </div>
        <dl>
          <dt>Slug</dt><dd><code>${this._esc(report.slug || '')}</code></dd>
          <dt>Story file</dt><dd><code>${this._esc(report.story_file || '')}</code></dd>
          ${report.story_sha256 ? `<dt>Story SHA-256</dt><dd><code>${this._esc(report.story_sha256)}</code></dd>` : ''}
        </dl>
        ${this._reportList('Fatal errors', fatal, 'error', false)}
        ${this._reportList('Warnings', warningItems, 'warn', false)}
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
        ${state.success ? `<div class="message ${this._esc(state.report ? this._reportStatus(state.report, 'import').tone : 'success')}">${this._esc(state.success)}${state.importedSlug && state.hasIFiction ? ` <button class="button" type="button" data-action="open-ifiction" data-slug="${this._esc(state.importedSlug)}">Preview iFiction XML</button>` : ''}</div>` : ''}
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
    const ifictionPath = report.ifiction_path || 'metadata.iFiction.xml';
    const ifictionNote = report.has_ifiction
      ? `<div class="message success"><code>${this._esc(ifictionPath)}</code> found. After draft import, you can preview and selectively apply iFiction metadata from the package editor. Import does not auto-merge XML into <code>game.yaml</code>.</div>`
      : '<div class="message">No <code>metadata.iFiction.xml</code> found. Import can still continue when the package is otherwise valid.</div>';
    const status = this._reportStatus(report, 'import');
    const statusLabel = status.severity === 'error' ? 'blocked' : (status.severity === 'warn' ? 'review warnings' : 'ok');
    return `
      <div class="box" style="margin-top:.85rem;">
        <h3>Inspection Report</h3>
        <div class="badges" style="justify-content:flex-start;margin:.45rem 0;">
          <span class="badge ${this._esc(status.badge)}">${this._esc(statusLabel)}</span>
          <span class="badge ${collisionTone}">${this._esc(collisionLabel)}</span>
          <span class="badge ${report.has_ifiction ? 'ok' : 'warn'}">${report.has_ifiction ? 'iFiction found' : 'no iFiction XML'}</span>
          <span class="badge ok">imports as draft</span>
          <span class="badge ok">not featured</span>
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
          <dt>iFiction XML</dt><dd>${report.has_ifiction ? `<code>${this._esc(ifictionPath)}</code>` : 'Not present'}</dd>
          <dt>Import policy</dt><dd>Commit installs as draft, clears featured, revalidates the zip, and never overwrites an existing package folder.</dd>
        </dl>
        <p class="meta">Inspection does not create package files. Commit revalidates and installs as draft only.</p>
        ${ifictionNote}
        ${this._reportList('Fatal errors', fatal, 'error', false)}
        ${this._reportList('Warnings', warnings, 'warn', false)}
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

  _reportList(label, items, tone = '', codeItems = true) {
    items = Array.isArray(items) ? items : [];
    if (!items.length) {
      if (tone === 'error' || tone === 'warn') {
        return '';
      }
      return `<div class="warnings"><div class="warning ${this._esc(tone)}"><strong>${this._esc(label)}</strong><span class="meta">None.</span></div></div>`;
    }

    const renderItem = item => codeItems ? `<code>${this._esc(item)}</code>` : this._esc(item);
    return `
      <div class="warnings">
        <div class="warning ${this._esc(tone)}">
          <strong>${this._esc(label)}</strong>
          <ul>
            ${items.slice(0, 40).map(item => `<li>${renderItem(item)}</li>`).join('')}
            ${items.length > 40 ? `<li class="meta">${items.length - 40} more not shown.</li>` : ''}
          </ul>
        </div>
      </div>
    `;
  }

  _reportSeverity(report) {
    if (!report || typeof report !== 'object') {
      return 'info';
    }

    if (this._reportErrorItems(report).length || report.ok === false) {
      return 'error';
    }
    if (this._reportWarningItems(report).length) {
      return 'warn';
    }

    return 'success';
  }

  _reportStatus(report, context = '') {
    let severity = this._reportSeverity(report);
    if (context === 'ifiction' && this._isMissingIFictionReport(report)) {
      severity = 'warn';
    }
    const messages = {
      ecosystem: {
        error: 'Preview has errors. Fix the fields below before applying metadata.',
        warn: 'Preview is ready with review notes. Check warnings before applying metadata.',
        success: 'Ecosystem metadata preview is ready. Review and apply selected fields.',
        info: 'Preview has not run yet.'
      },
      create: {
        error: 'Package creation has errors. Fix the fields below before continuing.',
        warn: 'Package was created with validation warnings. Review notes before publishing.',
        success: 'Package created as draft. Review before publishing.',
        info: 'Creation report is not available yet.'
      },
      import: {
        error: 'Import inspection has errors. Fix or choose another package before committing.',
        warn: 'Import inspection is ready with warnings. Review notes before committing.',
        success: 'Import inspection is ready.',
        info: 'Import inspection has not run yet.'
      },
      ifiction: {
        error: 'iFiction preview has errors. Review the XML status below.',
        warn: this._isMissingIFictionReport(report) ? 'metadata.iFiction.xml is not available for this package.' : 'iFiction preview is ready with review notes.',
        success: 'Local iFiction metadata parsed. Select fields explicitly before applying changes.',
        info: 'iFiction preview has not run yet.'
      }
    };
    const group = messages[context] || {};

    return {
      severity,
      tone: severity === 'success' ? 'success' : (severity === 'error' ? 'error' : (severity === 'warn' ? 'warn' : '')),
      badge: severity === 'error' ? 'error' : (severity === 'warn' ? 'warn' : 'ok'),
      message: group[severity] || ''
    };
  }

  _reportErrorItems(report) {
    const validation = report && typeof report.validation === 'object' ? report.validation : {};
    return [
      ...(Array.isArray(report?.errors) ? report.errors : []),
      ...(Array.isArray(report?.fatal_errors) ? report.fatal_errors : []),
      ...(Array.isArray(validation.errors) ? validation.errors : []),
      ...(Array.isArray(validation.fatal_errors) ? validation.fatal_errors : [])
    ].filter(item => String(item?.message || item || '').trim() !== '');
  }

  _reportWarningItems(report) {
    const validation = report && typeof report.validation === 'object' ? report.validation : {};
    return [
      ...(Array.isArray(report?.warnings) ? report.warnings : []),
      ...(Array.isArray(report?.review_notes) ? report.review_notes : []),
      ...(Array.isArray(validation.warnings) ? validation.warnings : [])
    ].filter(item => String(item?.message || item || '').trim() !== '');
  }

  _isMissingIFictionReport(report) {
    const errors = Array.isArray(report?.errors) ? report.errors : [];
    return Boolean(report && report.exists === false && errors.length > 0 && errors.every(error => String(error || '').includes('metadata.iFiction.xml was not found')));
  }

  _statusMessage(message, tone = '') {
    if (!message) {
      return '';
    }

    return `<div class="message ${this._esc(tone)}">${this._esc(message)}</div>`;
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

    root.querySelectorAll('[data-action="open-ifiction"]').forEach(button => {
      button.addEventListener('click', () => this._openIFiction(button.dataset.slug || ''));
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

    root.querySelectorAll('[data-action="set-status"]').forEach(button => {
      button.addEventListener('click', () => this._setPackageStatus(button.dataset.slug || '', button.dataset.status || ''));
    });

    root.querySelectorAll('[data-action="toggle-featured"]').forEach(button => {
      button.addEventListener('click', () => this._setPackageFeatured(button.dataset.slug || '', button.dataset.featured === 'true'));
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

    root.querySelectorAll('[data-library-control]').forEach(control => {
      const eventName = control.tagName === 'INPUT' ? 'input' : 'change';
      control.addEventListener(eventName, () => this._updateLibraryControl(control.dataset.libraryControl || '', control.value || ''));
    });

    root.querySelectorAll('[data-action="reset-library-controls"]').forEach(button => {
      button.addEventListener('click', () => this._resetLibraryControls());
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

    root.querySelectorAll('[data-action="preview-ecosystem"]').forEach(button => {
      button.addEventListener('click', () => this._previewEcosystem(button.dataset.scope || 'create', button.dataset.slug || ''));
    });

    root.querySelectorAll('[data-action="apply-ecosystem"]').forEach(button => {
      button.addEventListener('click', () => this._applyEcosystemPreview(button.dataset.scope || 'create'));
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

    root.querySelectorAll('form[data-ifiction-upload-slug]').forEach(form => {
      form.addEventListener('submit', event => this._uploadIFiction(event));
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
    this.state.create = { open: true, saving: false, error: '', success: '', report: null, values: {}, ecosystem: this._emptyEcosystemState() };
    this._renderLibrary();
  }

  _closeCreatePackage() {
    this.state.create = { open: false, saving: false, error: '', success: '', report: null, values: {}, ecosystem: this._emptyEcosystemState() };
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
      const importedHasIFiction = Boolean(result.has_ifiction || result.report?.has_ifiction || this.state.importInspect.report?.has_ifiction);
      const importReviewCopy = importedHasIFiction
        ? 'Package imported as draft and not featured. iFiction XML is available for preview/apply from the package editor; no XML fields were auto-applied.'
        : 'Package imported as draft and not featured. Review metadata, helper docs, media, story file, license/provenance, and publish only when ready.';
      const importPanelCopy = importedHasIFiction
        ? `Imported ${importedSlug} as a draft package. iFiction XML is available for preview/apply from the package editor; no XML fields were auto-applied.`
        : `Imported ${importedSlug} as a draft package. Review metadata, helper docs, media, story file, license/provenance, and publish only when ready.`;
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
          success: importReviewCopy,
          values: this._editableFromGame(game),
          readOnly: this._readOnlyFromGame(game),
          activeHelper: 'how-to-play',
          selectedMediaType: 'cover',
          helper: this._emptyHelperState('how-to-play'),
          media: this._mediaFromGame(game),
          feelies: this._feeliesFromGame(game),
          story: this._storyFromGame(game),
          ifiction: this._emptyIFictionState(),
          ecosystem: this._emptyEcosystemState()
        };
      }
      this.state.importInspect = {
        open: true,
        saving: false,
        committing: false,
        error: '',
        success: importPanelCopy,
        report: this._committedImportReport(result.report || this.state.importInspect.report, importedSlug),
        file: null,
        finalSlug: importedSlug,
        importedSlug,
        hasIFiction: importedHasIFiction
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
    const values = this._collectCreateValues(form);
    this.state.create = {
      ...(this.state.create || {}),
      open: true,
      saving: true,
      error: '',
      success: '',
      report: null,
      values
    };
    this._renderLibrary();

    try {
      const result = await this._requestJson(this._packagesApiUrl(), {
        method: 'POST',
        body: data
      });
      const slug = result.slug || data.get('slug');
      this.state.create = {
        open: true,
        saving: false,
        error: '',
        success: `Created ${slug} as a draft package. Review validation notes before publishing.`,
        report: result,
        values,
        ecosystem: this.state.create.ecosystem || this._emptyEcosystemState()
      };
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
          success: 'Package created as draft and not featured. Review metadata, helper docs, media, story file, validation notes, and export only when ready.',
          values: this._editableFromGame(this._findGame(slug) || {}),
          readOnly: this._readOnlyFromGame(this._findGame(slug) || {}),
          activeHelper: 'how-to-play',
          selectedMediaType: 'cover',
          helper: this._emptyHelperState('how-to-play'),
          media: this._mediaFromGame(this._findGame(slug) || {}),
          feelies: this._feeliesFromGame(this._findGame(slug) || {}),
          story: this._storyFromGame(this._findGame(slug) || {}),
          ifiction: this._emptyIFictionState(),
          ecosystem: this._emptyEcosystemState()
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
        success: '',
        report: null,
        values,
        ecosystem: this.state.create.ecosystem || this._emptyEcosystemState()
      };
    }

    this._renderLibrary();
  }

  async _previewEcosystem(scope, slug = '') {
    const normalizedScope = scope === 'editor' ? 'editor' : 'create';
    const form = normalizedScope === 'create'
      ? this.shadowRoot.querySelector('form[data-create-package]')
      : this.shadowRoot.querySelector('form[data-editor-slug]');
    const values = normalizedScope === 'create'
      ? (form ? this._collectCreateValues(form) : (this.state.create.values || {}))
      : (form ? this._collectEditorValues(form) : (this.state.editor.values || {}));
    const payload = this._ecosystemPayloadFromValues(normalizedScope, values);
    if (normalizedScope === 'create') {
      this.state.create = {
        ...(this.state.create || {}),
        values,
        ecosystem: {
          ...(this.state.create.ecosystem || this._emptyEcosystemState()),
          loading: true,
          error: '',
          success: '',
          report: null
        }
      };
    } else {
      this.state.editor = {
        ...(this.state.editor || {}),
        values,
        ecosystem: {
          ...(this.state.editor.ecosystem || this._emptyEcosystemState()),
          loading: true,
          error: '',
          success: '',
          report: null
        }
      };
    }
    this._renderLibrary();

    try {
      const report = await this._requestJson(this._ecosystemPreviewApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const message = this._reportStatus(report, 'ecosystem').message;
      this._setEcosystemState(normalizedScope, {
        loading: false,
        applying: false,
        error: '',
        success: message,
        report
      });
    } catch (error) {
      this._setEcosystemState(normalizedScope, {
        loading: false,
        applying: false,
        error: error.message || String(error),
        success: '',
        report: null
      });
    }

    this._renderLibrary();
  }

  _applyEcosystemPreview(scope) {
    const normalizedScope = scope === 'editor' ? 'editor' : 'create';
    const state = normalizedScope === 'editor'
      ? (this.state.editor.ecosystem || this._emptyEcosystemState())
      : (this.state.create.ecosystem || this._emptyEcosystemState());
    const ifArchive = state.report?.ifarchive || {};
    const ifdbFields = Array.isArray(state.report?.ifdb?.fields) ? state.report.ifdb.fields : [];
    const ifwikiPreview = this._ifwikiPreviewFromReport(state.report || {});
    const ifwikiFields = Array.isArray(ifwikiPreview?.fields) ? ifwikiPreview.fields : [];
    const applyRoot = this.shadowRoot.querySelector(`[data-ecosystem-apply-scope="${normalizedScope}"]`);
    const applyPath = Boolean(applyRoot?.querySelector('[data-ecosystem-field="path"]')?.checked);
    const applyUrl = Boolean(applyRoot?.querySelector('[data-ecosystem-field="url"]')?.checked);
    const selectedIfdbFields = Array.from(applyRoot?.querySelectorAll('[data-ifdb-field]:checked') || [])
      .map(input => ifdbFields[Number(input.dataset.ifdbField)])
      .filter(field => field && field.path);
    const selectedIfwikiFields = Array.from(applyRoot?.querySelectorAll('[data-ifwiki-field]:checked') || [])
      .map(input => ifwikiFields[Number(input.dataset.ifwikiField)])
      .filter(field => field && field.path);
    const selectedCrosscheckFields = Array.from(applyRoot?.querySelectorAll('[data-crosscheck-row][data-crosscheck-source]:checked') || [])
      .map(input => this._crosscheckSelection(state.report?.comparison, input.dataset.crosscheckRow, input.dataset.crosscheckSource))
      .filter(field => field && field.path);
    const selectedFields = [...selectedIfdbFields, ...selectedIfwikiFields, ...selectedCrosscheckFields];
    if ((!applyPath && !applyUrl && !selectedFields.length) || ((applyPath || applyUrl) && !ifArchive.path && !ifArchive.url && !selectedFields.length)) {
      this._setEcosystemState(normalizedScope, {
        ...state,
        error: 'Select at least one normalized ecosystem field to apply.',
        success: ''
      });
      this._renderLibrary();
      return;
    }

    if (normalizedScope === 'create') {
      const form = this.shadowRoot.querySelector('form[data-create-package]');
      const values = form ? this._collectCreateValues(form) : { ...(this.state.create.values || {}) };
      if (applyPath) {
        values.ifarchive_path = ifArchive.path || '';
      }
      if (applyUrl) {
        values.ifarchive_url = ifArchive.url || '';
      }
      selectedIfdbFields.forEach(field => this._applyIFDBPreviewField(values, field, 'create'));
      selectedIfwikiFields.forEach(field => this._applyIFWikiPreviewField(values, field, 'create'));
      selectedCrosscheckFields.forEach(field => this._applyCrosscheckField(values, field, 'create'));
      this.state.create = {
        ...(this.state.create || {}),
        values,
        ecosystem: {
          ...state,
          error: '',
          success: 'Selected ecosystem fields were applied to the Create Package form. Review before creating the draft package.'
        }
      };
    } else {
      const editorForm = this.shadowRoot.querySelector('form[data-editor-slug]');
      const values = editorForm ? this._collectEditorValues(editorForm) : { ...(this.state.editor.values || {}) };
      if (applyPath) {
        this._set(values, 'catalog.ifarchive.path', ifArchive.path || '');
      }
      if (applyUrl) {
        this._set(values, 'catalog.ifarchive.url', ifArchive.url || '');
      }
      selectedIfdbFields.forEach(field => this._applyIFDBPreviewField(values, field, 'editor'));
      selectedIfwikiFields.forEach(field => this._applyIFWikiPreviewField(values, field, 'editor'));
      selectedCrosscheckFields.forEach(field => this._applyCrosscheckField(values, field, 'editor'));
      this.state.editor = {
        ...(this.state.editor || {}),
        values,
        ecosystem: {
          ...state,
          error: '',
          success: 'Selected ecosystem fields were applied to the metadata editor. Save Metadata is still required to write game.yaml.'
        }
      };
    }

    this._renderLibrary();
  }

  _crosscheckSelection(comparison, rowIndex, sourceKey) {
    const rows = Array.isArray(comparison?.fields) ? comparison.fields : [];
    const row = rows[Number(rowIndex)];
    const cell = row?.cells?.[sourceKey];
    if (!row || !cell || !cell.applyable || !cell.has_value) {
      return null;
    }

    return {
      path: row.path,
      label: row.label,
      value: cell.value,
      source: sourceKey
    };
  }

  _applyCrosscheckField(values, field, scope) {
    const path = String(field.path || '');
    let value = field.value;
    if (Array.isArray(value)) {
      value = value.map(item => String(item || '').trim()).filter(Boolean);
    } else {
      value = String(value || '').trim();
    }

    if (!path || (Array.isArray(value) ? !value.length : value === '')) {
      return;
    }

    if (scope === 'create') {
      const target = this._createTargetForPath(path);
      if (!target) {
        return;
      }
      values[target] = Array.isArray(value) ? value.join('\n') : value;
      return;
    }

    const targetPath = path === 'tags' ? 'terpvault.tags' : path;
    this._set(values, targetPath, value);
  }

  _applyIFWikiPreviewField(values, field, scope) {
    const path = String(field.path || '');
    let value = field.value;
    if (Array.isArray(value)) {
      value = value.map(item => String(item || '').trim()).filter(Boolean);
    } else {
      value = String(value || '').trim();
    }

    if (scope === 'create') {
      const target = this._createTargetForPath(path);
      if (!target) {
        return;
      }
      values[target] = Array.isArray(value) ? value.join('\n') : value;
      return;
    }

    if (path === 'catalog.ifwiki.title' || path === 'catalog.ifwiki.url') {
      this._set(values, path, Array.isArray(value) ? value.join('\n') : value);
    }
  }

  _applyIFDBPreviewField(values, field, scope) {
    const path = String(field.path || '');
    let value = field.value;
    if (Array.isArray(value)) {
      value = value.map(item => String(item || '').trim()).filter(Boolean);
    } else {
      value = String(value || '').trim();
    }

    if (scope === 'create') {
      const target = this._createTargetForPath(path);
      if (!target) {
        return;
      }
      values[target] = Array.isArray(value) ? value.join('\n') : value;
      return;
    }

    const targetPath = path === 'tags' ? 'terpvault.tags' : path;
    this._set(values, targetPath, value);
  }

  _createTargetForPath(path) {
    return {
      'bibliographic.title': 'title',
      'bibliographic.author': 'author',
      'bibliographic.headline': 'headline',
      'bibliographic.first_published': 'first_published',
      'bibliographic.genre': 'genre',
      'bibliographic.language': 'language',
      'bibliographic.description': 'description',
      'identification.format': 'format',
      'identification.ifids': 'ifid',
      'catalog.ifdb.tuid': 'ifdb_tuid',
      'catalog.ifdb.url': 'ifdb_url',
      'catalog.ifwiki.title': 'ifwiki_title',
      'catalog.ifwiki.url': 'ifwiki_url',
      'catalog.ifarchive.path': 'ifarchive_path',
      'catalog.ifarchive.url': 'ifarchive_url',
      'release.source.url': 'source_url',
      'release.source.upstream.url': 'upstream_source_url',
      'release.source.port_repository.url': 'port_repository_url',
      'release.license.name': 'license_name',
      'release.license.url': 'license_url',
      'tags': 'tags'
    }[String(path || '')] || '';
  }

  _setEcosystemState(scope, ecosystem) {
    if (scope === 'editor') {
      this.state.editor = {
        ...(this.state.editor || {}),
        ecosystem
      };
      return;
    }

    this.state.create = {
      ...(this.state.create || {}),
      ecosystem
    };
  }

  _ecosystemPayloadFromPage(scope) {
    if (scope === 'editor') {
      const form = this.shadowRoot.querySelector('form[data-editor-slug]');
      const values = form ? this._collectEditorValues(form) : (this.state.editor.values || {});
      return this._ecosystemPayloadFromValues(scope, values);
    }

    const form = this.shadowRoot.querySelector('form[data-create-package]');
    const values = form ? this._collectCreateValues(form) : (this.state.create.values || {});
    return this._ecosystemPayloadFromValues(scope, values);
  }

  _ecosystemPayloadFromValues(scope, values) {
    if (scope === 'editor') {
      return {
        slug: this.state.editor.slug || this.state.editingSlug || '',
        current_metadata: values || {},
        ifarchive_path: this._get(values, 'catalog.ifarchive.path'),
        ifarchive_url: this._get(values, 'catalog.ifarchive.url'),
        ifdb_tuid: this._get(values, 'catalog.ifdb.tuid'),
        ifdb_url: this._get(values, 'catalog.ifdb.url'),
        ifwiki_title: this._get(values, 'catalog.ifwiki.title'),
        ifwiki_url: this._get(values, 'catalog.ifwiki.url'),
        source_url: this._get(values, 'release.source.url'),
        upstream_source_url: this._get(values, 'release.source.upstream.url'),
        port_repository_url: this._get(values, 'release.source.port_repository.url'),
        license_url: this._get(values, 'release.license.url')
      };
    }

    return {
      current_metadata: values || {},
      ifarchive_path: values.ifarchive_path || '',
      ifarchive_url: values.ifarchive_url || '',
      ifdb_tuid: values.ifdb_tuid || '',
      ifdb_url: values.ifdb_url || '',
      ifwiki_title: values.ifwiki_title || '',
      ifwiki_url: values.ifwiki_url || '',
      source_url: values.source_url || '',
      upstream_source_url: values.upstream_source_url || '',
      port_repository_url: values.port_repository_url || '',
      license_url: values.license_url || ''
    };
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
      ifiction: this._emptyIFictionState(),
      ecosystem: this._emptyEcosystemState()
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

  async _openIFiction(slug) {
    if (!slug) {
      return;
    }

    if (this.state.editingSlug !== slug) {
      await this._openEditor(slug);
    }
    await this._previewIFiction(slug);
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
      ifiction: this._emptyIFictionState(),
      ecosystem: this._emptyEcosystemState()
    };
    this._renderLibrary();
  }

  async _saveEditor(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const slug = form.dataset.editorSlug || this.state.editingSlug;
    const metadata = this._mergeObjects(this.state.editor.values || {}, this._collectEditorValues(form));

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
      const data = await this._requestJson(this._packagesApiUrl(), { method: 'GET' });
      const payload = this._unwrapApiResponse(data);
      this.state.games = Array.isArray(payload.games) ? payload.games : [];
      this.state.formats = payload.formats || this.state.formats || this._fallbackFormats();
      this.state.status = {
        ...(this.state.status || {}),
        ...payload
      };
      this.state.source = payload.source || 'Admin2 package API';
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        error: this.state.editor.error || `Saved, but the Admin2 package list could not be refreshed: ${error.message || error}`
      };
    }
  }

  async _setPackageStatus(slug, status) {
    if (!slug || !['draft', 'published'].includes(status)) {
      return;
    }

    await this._updatePackageFlags(slug, { terpvault: { status } }, 'status', status === 'published' ? 'Package published.' : 'Package unpublished to draft.');
  }

  async _setPackageFeatured(slug, featured) {
    if (!slug) {
      return;
    }

    await this._updatePackageFlags(slug, { terpvault: { featured: Boolean(featured) } }, 'featured', featured ? 'Package marked featured.' : 'Package removed from featured.');
  }

  async _updatePackageFlags(slug, metadata, type, success) {
    this.state.packageActions = {
      ...(this.state.packageActions || {}),
      [slug]: { saving: true, type, error: '', success: '' }
    };
    this._renderLibrary();

    try {
      const data = await this._requestJson(this._metadataApiUrl(slug), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata })
      });
      await this._reloadManifest();
      const game = this._findGame(slug) || {};
      this.state.packageActions = {
        ...(this.state.packageActions || {}),
        [slug]: { saving: false, type, error: '', success }
      };
      if (this.state.editingSlug === slug) {
        this.state.editor = {
          ...this.state.editor,
          saving: false,
          success,
          values: this._editableFromApi(data, game),
          readOnly: this._readOnlyFromApi(data, game)
        };
      }
    } catch (error) {
      this.state.packageActions = {
        ...(this.state.packageActions || {}),
        [slug]: { saving: false, type, error: error.message || String(error), success: '' }
      };
    }

    this._renderLibrary();
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
        uploading: false,
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
          uploading: false,
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
          uploading: false,
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
          uploading: false,
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
          uploading: false,
          applying: false,
          error: error.message || String(error),
          success: ''
        }
      };
    }

    this._renderLibrary();
  }

  async _uploadIFiction(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const slug = form.dataset.ifictionUploadSlug || this.state.editingSlug;
    const input = form.querySelector('input[type="file"]');
    const file = input?.files?.[0];
    if (!slug) {
      return;
    }
    if (!file) {
      this.state.editor = {
        ...this.state.editor,
        ifiction: {
          ...(this.state.editor.ifiction || this._emptyIFictionState()),
          error: 'Choose an XML file before uploading.',
          success: ''
        }
      };
      this._renderLibrary();
      return;
    }

    const data = new FormData();
    data.append('file', file);
    this.state.editor = {
      ...this.state.editor,
      ifiction: {
        ...(this.state.editor.ifiction || this._emptyIFictionState()),
        uploading: true,
        error: '',
        success: ''
      }
    };
    this._renderLibrary();

    try {
      const response = await this._requestJson(this._ifictionPreviewApiUrl(slug), {
        method: 'POST',
        body: data
      });
      const report = this._unwrapApiResponse(response);
      await this._reloadManifest();
      const game = this._findGame(slug) || {};
      this.state.editor = {
        ...this.state.editor,
        ifiction: {
          loading: false,
          uploading: false,
          applying: false,
          error: '',
          success: 'metadata.iFiction.xml uploaded to the package root. Review the preview and select fields explicitly before applying anything to game.yaml.',
          report
        },
        readOnly: this._readOnlyFromGame(game)
      };
    } catch (error) {
      this.state.editor = {
        ...this.state.editor,
        ifiction: {
          ...(this.state.editor.ifiction || this._emptyIFictionState()),
          uploading: false,
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
    const exportState = this.state.export || {};
    const exporting = Boolean(exportState.saving && exportState.slug === slug);

    return `
      <div class="editor">
        <div class="editor-head">
          <div>
            <h3>Package Editor</h3>
            <p class="meta">Grouped editor for metadata, provenance review, story files, media, helper Markdown, validation, and export. Package writes still use the existing explicit save/upload/export actions.</p>
          </div>
          <button class="button" type="button" data-action="cancel-edit">Close</button>
        </div>
        ${editor.loading ? '<div class="message">Loading editable metadata from the Admin2 API...</div>' : ''}
        ${editor.error ? `<div class="message error">${this._esc(editor.error)}</div>` : ''}
        ${editor.success ? `<div class="message success">${this._esc(editor.success)}</div>` : ''}
        <form data-editor-slug="${this._esc(slug)}">
          <div class="form-actions">
            <button class="button primary" type="submit" ${editor.loading || editor.saving ? 'disabled' : ''}>${editor.saving ? 'Saving...' : 'Save Metadata'}</button>
          </div>
          <div class="editor-sections">
            ${this._editorSection('Overview', 'Lifecycle controls and package paths', `
              <div class="subsections">
                ${this._subsection('TerpVault / Status', 'Publication and placement controls', `
                  ${this._help('terpvault')}
                  <div class="fieldsets">
                    <fieldset>
                      <legend>Lifecycle</legend>
                      ${this._select('Status', 'terpvault.status', values, [['draft', 'Draft'], ['published', 'Published']], this._helpText('status'))}
                      <div class="checkbox">
                        <input id="tv-featured-${this._esc(slug)}" type="checkbox" name="terpvault.featured" ${this._get(values, 'terpvault.featured') ? 'checked' : ''}>
                        <label for="tv-featured-${this._esc(slug)}">Featured</label>
                      </div>
                      ${this._help('featured')}
                    </fieldset>
                  </div>
                `, true)}
                ${this._subsection('Advanced / Raw-ish Fields', 'Package-local paths and read-only diagnostics', `
                  ${this._help('readonly_files')}
                  ${this._readOnlyList(readOnly)}
                `, false)}
              </div>
            `, true)}
            ${this._editorSection('Metadata', 'Identity, bibliography, presentation, and classification', `
              <div class="subsections">
                ${this._subsection('Identity', 'Title, attribution, year, language, format, and IFIDs', `
                  ${this._help('bibliographic')}
                  <div class="fieldsets">
                    <fieldset>
                      <legend>Core Identity</legend>
                      ${this._input('Title', 'bibliographic.title', values, this._helpText('title'))}
                      ${this._input('Headline', 'bibliographic.headline', values, this._helpText('headline'))}
                      ${this._input('Author / source attribution', 'bibliographic.author', values, this._helpText('author'))}
                      ${this._input('First published / year', 'bibliographic.first_published', values, this._helpText('first_published'))}
                      ${this._input('Language', 'bibliographic.language', values, this._helpText('language'))}
                    </fieldset>
                    <fieldset>
                      <legend>Story Identity</legend>
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
                  </div>
                `, true)}
                ${this._subsection('Bibliographic / Presentation', 'Genre, tags, description, and public-facing copy', `
                  <div class="fieldsets">
                    <fieldset>
                      <legend>Presentation</legend>
                      ${this._input('Genre', 'bibliographic.genre', values)}
                      ${this._textarea('Tags', 'terpvault.tags', values, 'short', this._helpText('tags'))}
                    </fieldset>
                    <fieldset>
                      <legend>Description</legend>
                      ${this._textarea('Description', 'bibliographic.description', values, '', this._helpText('description'))}
                    </fieldset>
                  </div>
                `, true)}
              </div>
            `, true)}
            ${this._editorSection('Provenance', 'Catalog, source, license, IFDB, IFWiki, and IF Archive', `
              <div class="subsections">
                ${this._subsection('Catalog', 'IFDB, IFWiki, and IF Archive references', `
                  ${this._help('catalog')}
                  <div class="fieldsets">
                    <fieldset>
                      <legend>IFDB / IFWiki</legend>
                      ${this._input('IFDB TUID', 'catalog.ifdb.tuid', values, this._helpText('ifdb_tuid'))}
                      ${this._input('IFDB URL', 'catalog.ifdb.url', values, this._helpText('ifdb_url'))}
                      ${this._input('IFWiki title', 'catalog.ifwiki.title', values, this._helpText('ifwiki_title'))}
                      ${this._input('IFWiki URL', 'catalog.ifwiki.url', values, this._helpText('ifwiki_url'))}
                    </fieldset>
                    <fieldset>
                      <legend>IF Archive</legend>
                      ${this._input('IF Archive path', 'catalog.ifarchive.path', values, this._helpText('ifarchive_path'))}
                      ${this._input('IF Archive URL', 'catalog.ifarchive.url', values, this._helpText('ifarchive_url'))}
                    </fieldset>
                  </div>
                `, true)}
                ${this._subsection('Source & Rights', 'Source URLs, license, source notes, and redistribution review', `
                  ${this._help('provenance')}
                  <div class="fieldsets">
                    <fieldset>
                      <legend>Source</legend>
                      ${this._input('Source URL', 'release.source.url', values, this._helpText('source_url'))}
                      ${this._input('Upstream project URL', 'release.source.upstream.url', values, this._helpText('upstream_source_url'))}
                      ${this._input('Port/source repository URL', 'release.source.port_repository.url', values, this._helpText('port_repository_url'))}
                      ${this._input('Source retrieved', 'release.source.retrieved', values, this._helpText('source_retrieved'))}
                      ${this._textarea('Source notes / redistribution notes', 'release.source.notes', values, 'short', this._helpText('source_notes'))}
                    </fieldset>
                    <fieldset>
                      <legend>Rights</legend>
                      ${this._input('License name', 'release.license.name', values, this._helpText('license_name'))}
                      ${this._input('License URL', 'release.license.url', values)}
                      ${this._textarea('License notes', 'release.license.notes', values, 'short', this._helpText('license_notes'))}
                    </fieldset>
                  </div>
                `, true)}
                ${this._subsection('Reference Links', 'Create-time support links shown read-only in this editor', this._referenceLinksList(game), false)}
              </div>
            `, true)}
            ${this._editorSection('Validation', 'Warnings and package readiness notes', this._warnings(game), false)}
          </div>
          <div class="form-actions">
            <button class="button" type="button" data-action="cancel-edit">Cancel</button>
            <button class="button primary" type="submit" ${editor.loading || editor.saving ? 'disabled' : ''}>${editor.saving ? 'Saving...' : 'Save Metadata'}</button>
          </div>
        </form>
        <div class="editor-sections" style="margin-top:.85rem;">
          ${this._editorSection('Ecosystem Preview', 'Metadata cross-check, IFDB preview, IFWiki preview, IF Archive normalization', this._ecosystemPreviewPanel('editor', slug), true)}
          ${this._editorSection('Story', 'Story replacement workflow', this._storyPanel(game, slug), false)}
          ${this._editorSection('Media', 'Cover, small cover, hero, screenshots, and feelies', `${this._mediaPanel(game, slug)}${this._feeliesPanel(game, slug)}`, false)}
          ${this._editorSection('Docs & Oracle', 'iFiction XML and helper Markdown for play notes, hints, walkthrough, and known differences', `${this._ifictionPreviewPanel(slug)}${this._helperDocsPanel(slug)}`, false)}
          ${this._editorSection('Export', 'Download a package archive', `
            <div class="export-panel">
              <p class="meta">Export uses the existing package archive endpoint and does not change package metadata.</p>
              ${this._exportMessage(slug)}
              <div class="form-actions">
                <button class="button primary" type="button" data-action="export" data-slug="${this._esc(slug)}" ${exporting ? 'disabled' : ''}>${exporting ? 'Exporting...' : 'Export Package'}</button>
              </div>
            </div>
          `, false)}
        </div>
      </div>
    `;
  }

  _editorSection(title, kicker, body, open = false) {
    return `
      <details class="editor-section" ${open ? 'open' : ''}>
        <summary><span>${this._esc(title)}</span><span class="section-kicker">${this._esc(kicker)}</span></summary>
        <div class="section-body">${body}</div>
      </details>
    `;
  }

  _subsection(title, kicker, body, open = false) {
    return `
      <details class="subsection" ${open ? 'open' : ''}>
        <summary><span>${this._esc(title)}</span><span class="section-kicker">${this._esc(kicker)}</span></summary>
        <div class="section-body">${body}</div>
      </details>
    `;
  }

  _referenceLinksList(game = {}) {
    const references = Array.isArray(game.references)
      ? game.references
      : Object.values(game.references || {}).filter(reference => reference && typeof reference === 'object');
    const labels = {
      cover_art: 'Cover art source URL',
      hero_art: 'Hero art source URL',
      screenshot: 'Screenshot source URL',
      walkthrough: 'Walkthrough/reference URL',
      hints: 'Hints/reference URL',
      map: 'Map/reference URL',
      history: 'History/background URL'
    };
    const rows = references
      .filter(reference => reference?.url || reference?.value)
      .map(reference => {
        const label = reference.label || labels[reference.role] || 'Reference URL';
        const value = reference.url || reference.value || '';
        const notes = reference.notes || reference.note || '';
        return `
          <div class="provenance-item">
            <span>${this._esc(label)}</span>
            ${value ? `<a href="${this._esc(value)}" target="_blank" rel="noopener">${this._esc(value)}</a>` : '<div>Not recorded</div>'}
            ${notes ? `<p class="meta">${this._esc(notes)}</p>` : ''}
          </div>
        `;
      });

    if (!rows.length) {
      return '<p class="meta">No create-time reference links are recorded for this package. Editing these reference rows is not available in this UI pass.</p>';
    }

    return `
      <p class="meta">Reference links are shown read-only here so metadata saves keep using the current allowlisted fields.</p>
      <div class="provenance">${rows.join('')}</div>
    `;
  }

  _ecosystemPreviewPanel(scope, slug = '') {
    const state = scope === 'editor'
      ? (this.state.editor.ecosystem || this._emptyEcosystemState())
      : (this.state.create.ecosystem || this._emptyEcosystemState());
    const report = state.report || null;
    const ifArchive = report?.ifarchive || null;
    const ifdb = report?.ifdb || null;
    const ifwiki = this._ifwikiPreviewFromReport(report);
    const hasNormalizedIFArchive = Boolean(ifArchive?.path || ifArchive?.url);
    const references = report?.references && typeof report.references === 'object' ? report.references : {};
    const disabled = Boolean(state.loading || state.applying);
    const contextLabel = scope === 'editor' ? 'metadata editor' : 'Create Package form';
    const hasIFDBPreview = Boolean(ifdb?.tuid || ifdb?.url || (Array.isArray(ifdb?.fields) && ifdb.fields.length));
    const hasIFWikiPreview = Boolean(ifwiki?.attempted || ifwiki?.title || ifwiki?.url || (Array.isArray(ifwiki?.fields) && ifwiki.fields.length));
    const status = report ? this._reportStatus(report, 'ecosystem') : null;
    const statusLabel = status
      ? (status.severity === 'error' ? 'preview errors' : (status.severity === 'warn' ? 'review notes' : 'preview ready'))
      : '';

    return `
      <section class="story-manager ecosystem-preview" data-ecosystem-scope="${this._esc(scope)}" ${slug ? `data-slug="${this._esc(slug)}"` : ''}>
        <h3>Ecosystem Metadata Preview</h3>
        <p class="meta">IFDB and IFWiki lookup are implemented as curator-review previews. IF Archive path normalization is implemented. URL presence does not prove redistribution rights.</p>
        <p class="meta">This helper uses IFDB's official API, IFWiki's MediaWiki API, and IF Archive path normalization. It does not download story files, covers, screenshots, maps, walkthroughs, or hints.</p>
        ${state.loading ? '<div class="message">Previewing ecosystem references...</div>' : ''}
        ${state.error ? `<div class="message error">${this._esc(state.error)}</div>` : ''}
        ${state.success ? this._statusMessage(state.success, status ? status.tone : 'success') : (status ? this._statusMessage(status.message, status.tone) : '')}
        <div class="form-actions">
          <button class="button" type="button" data-action="preview-ecosystem" data-scope="${this._esc(scope)}" data-slug="${this._esc(slug)}" ${disabled ? 'disabled' : ''}>${state.loading ? 'Previewing...' : 'Preview Ecosystem Metadata'}</button>
        </div>
        ${report ? `
          <div class="box ecosystem-report">
            <div class="badges" style="justify-content:flex-start;margin:.45rem 0;">
              <span class="badge ${this._esc(status.badge)}">${this._esc(statusLabel)}</span>
              <span class="badge ok">no writes</span>
              <span class="badge ${report.remote_fetches ? 'warn' : 'ok'}">${report.remote_fetches ? 'remote lookup attempted' : 'no remote fetches'}</span>
              <span class="badge warn">draft/review only</span>
              <span class="badge warn">rights not proven</span>
            </div>
            <div class="ecosystem-apply" data-ecosystem-apply-scope="${this._esc(scope)}" ${slug ? `data-slug="${this._esc(slug)}"` : ''}>
              ${this._metadataComparisonPanel(report?.comparison, contextLabel)}
              ${hasIFWikiPreview ? this._ifwikiPreviewPanel(ifwiki, contextLabel) : ''}
              ${hasNormalizedIFArchive ? `
                <div class="preview-section">
                  <h4>IF Archive</h4>
                  <div class="preview-card-grid">
                    <div class="provenance-item preview-card">
                      <span>Normalized path</span>
                      <code>${this._esc(ifArchive.path || '')}</code>
                      <div class="checkbox">
                        <input type="checkbox" name="catalog.ifarchive.path" data-ecosystem-field="path" checked>
                        <label>Apply path to ${this._esc(contextLabel)}</label>
                      </div>
                    </div>
                    <div class="provenance-item preview-card">
                      <span>Normalized URL</span>
                      <code>${this._esc(ifArchive.url || '')}</code>
                      <div class="checkbox">
                        <input type="checkbox" name="catalog.ifarchive.url" data-ecosystem-field="url" checked>
                        <label>Apply URL to ${this._esc(contextLabel)}</label>
                      </div>
                    </div>
                  </div>
                </div>
              ` : '<p class="meta">No normalized IF Archive values are available from this preview.</p>'}
              ${hasIFDBPreview ? this._ifdbPreviewPanel(ifdb, contextLabel) : '<p class="meta">No IFDB lookup results are available from this preview.</p>'}
              ${hasIFWikiPreview ? '' : this._ifwikiNoInputPanel()}
              <p class="meta">Apply selected fields updates the ${this._esc(contextLabel)} only. Save Metadata or Create Draft Package is still required for package writes.</p>
              <div class="form-actions">
                <button class="button primary" type="button" data-action="apply-ecosystem" data-scope="${this._esc(scope)}" data-slug="${this._esc(slug)}" ${disabled ? 'disabled' : ''}>Apply Selected Ecosystem Fields</button>
              </div>
            </div>
            ${Object.keys(references).length ? this._ecosystemReferenceList(references) : ''}
            ${Array.isArray(report.errors) && report.errors.length ? this._reportList('Preview errors', report.errors, 'error', false) : ''}
            ${this._reviewNotesDetails('Warnings & review notes', report.warnings || [], 'warn')}
          </div>
        ` : ''}
      </section>
    `;
  }

  _metadataComparisonPanel(comparison, contextLabel) {
    const fields = Array.isArray(comparison?.fields) ? comparison.fields : [];
    const sources = Array.isArray(comparison?.sources) ? comparison.sources : [];
    const notes = Array.isArray(comparison?.notes) ? comparison.notes : [];
    const warnings = Array.isArray(comparison?.warnings) ? comparison.warnings : [];
    const ifiction = comparison?.ifiction || {};
    if (!fields.length || !sources.length) {
      return `
        <div class="preview-section">
          <h4>Metadata Cross-check</h4>
          <p class="meta">No comparable metadata is available yet. Add a catalog reference, normalized IF Archive value, or package-local iFiction XML preview source.</p>
        </div>
      `;
    }

    return `
      <div class="preview-section">
        <h4>Metadata Cross-check</h4>
        <div class="badges" style="justify-content:flex-start;margin:.45rem 0;">
          <span class="badge ok">field-by-field apply</span>
          <span class="badge ${ifiction.available ? 'ok' : 'warn'}">iFiction ${this._esc(ifiction.status || 'not available')}</span>
          <span class="badge warn">rights review required</span>
        </div>
        <p class="meta">Compare current values with available preview sources. Checked values update only the ${this._esc(contextLabel)}; existing non-empty values are not preselected when they differ.</p>
        <div class="comparison-table-wrap">
          <table class="comparison-table">
            <thead>
              <tr>
                <th class="comparison-field">Field</th>
                <th>Status</th>
                ${sources.map(source => `<th>${this._esc(source.label || source.key || 'Source')}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${fields.map((row, rowIndex) => `
                <tr>
                  <td class="comparison-field">
                    <strong>${this._esc(row.label || row.path || '')}</strong>
                    <div class="meta"><code>${this._esc(row.path || '')}</code></div>
                  </td>
                  <td><span class="comparison-status ${this._esc(this._comparisonStatusClass(row.status))}">${this._esc(row.status || '')}</span></td>
                  ${sources.map(source => this._comparisonCell(row, rowIndex, source, contextLabel)).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ${notes.length ? this._reviewNotesDetails('Cross-check notes', notes, 'warn') : ''}
        ${warnings.length ? this._reviewNotesDetails('Cross-check warnings', warnings, 'warn') : ''}
      </div>
    `;
  }

  _comparisonCell(row, rowIndex, source, contextLabel) {
    const sourceKey = source.key || '';
    const cell = row?.cells?.[sourceKey] || {};
    const value = this._previewFieldValue(cell.value);
    const hasValue = Boolean(cell.has_value && value);
    const status = cell.status || (hasValue ? '' : 'not available');
    return `
      <td>
        <div class="comparison-cell">
          ${hasValue ? `<code>${this._esc(value)}</code>` : '<span class="meta">Not available</span>'}
          <span class="comparison-status ${this._esc(this._comparisonStatusClass(status))}">${this._esc(status)}</span>
          ${cell.applyable ? `
            <label class="comparison-apply">
              <input type="checkbox" data-crosscheck-row="${this._esc(String(rowIndex))}" data-crosscheck-source="${this._esc(sourceKey)}" ${cell.default_selected ? 'checked' : ''}>
              <span>Apply to ${this._esc(contextLabel)}</span>
            </label>
          ` : (cell.reference_only ? '<span class="meta">Reference only</span>' : '')}
        </div>
      </td>
    `;
  }

  _comparisonStatusClass(status) {
    const text = String(status || '').toLowerCase();
    if (text.includes('identical') || text === 'current') {
      return 'identical';
    }
    if (text.includes('missing')) {
      return 'missing';
    }
    if (text.includes('different')) {
      return 'different';
    }
    if (text.includes('unsafe')) {
      return 'unsafe';
    }
    return 'reference';
  }

  _ifdbPreviewPanel(ifdb, contextLabel) {
    const fields = Array.isArray(ifdb?.fields) ? ifdb.fields : [];
    const downloads = Array.isArray(ifdb?.downloads_reference_only) ? ifdb.downloads_reference_only : [];
    const sources = Array.isArray(ifdb?.sources) ? ifdb.sources : [];
    return `
      <div class="preview-section">
        <h4>IFDB</h4>
        <div class="badges" style="justify-content:flex-start;margin:.45rem 0;">
          <span class="badge ${ifdb?.ok === false ? 'warn' : 'ok'}">${ifdb?.ok === false ? 'lookup warning' : 'lookup ready'}</span>
          <span class="badge warn">reference only</span>
          <span class="badge warn">rights not proven</span>
        </div>
        <dl>
          <dt>IFDB TUID</dt><dd><code>${this._esc(ifdb?.tuid || '')}</code></dd>
          <dt>IFDB URL</dt><dd><code>${this._esc(ifdb?.url || '')}</code></dd>
          ${ifdb?.api_url ? `<dt>API source</dt><dd><code>${this._esc(ifdb.api_url)}</code></dd>` : ''}
        </dl>
        ${fields.length ? `
          <div class="preview-card-grid">
            ${fields.map((field, index) => `
              <div class="provenance-item preview-card">
                <span>${this._esc(field.label || field.path || 'IFDB field')}</span>
                <code>${this._esc(field.path || '')}</code>
                <p class="meta">${this._esc(this._previewFieldValue(field.value))}</p>
                <div class="checkbox">
                  <input type="checkbox" data-ifdb-field="${index}" ${String(field.path || '').startsWith('catalog.ifdb.') ? 'checked' : ''}>
                  <label>Apply to ${this._esc(contextLabel)}</label>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<p class="meta">No supported IFDB metadata fields were returned.</p>'}
        ${downloads.length ? `
          <details class="review-notes" style="margin-top:.75rem;">
            <summary>IFDB download references (${downloads.length})</summary>
            <div class="preview-card-grid" style="margin-top:.75rem;">
            ${downloads.map(item => `
              <div class="provenance-item preview-card">
                <span>${this._esc(item.title || 'Download reference')}</span>
                <code>${this._esc(item.url || '')}</code>
                <p class="meta">${this._esc(item.status || 'reference only; not downloaded')}${item.format ? ` - ${this._esc(item.format)}` : ''}</p>
              </div>
            `).join('')}
            </div>
          </details>
        ` : ''}
        ${sources.length ? this._ecosystemSourceList(sources, true) : ''}
      </div>
    `;
  }

  _ifwikiPreviewPanel(ifwiki, contextLabel) {
    const fields = Array.isArray(ifwiki?.fields) ? ifwiki.fields : [];
    const externalLinks = Array.isArray(ifwiki?.external_links_reference_only) ? ifwiki.external_links_reference_only : [];
    const sources = Array.isArray(ifwiki?.sources) ? ifwiki.sources : [];
    const warnings = Array.isArray(ifwiki?.warnings) ? ifwiki.warnings : [];
    const errors = Array.isArray(ifwiki?.errors) ? ifwiki.errors : [];
    const hasLookupData = Boolean(ifwiki?.title || ifwiki?.url || fields.length || externalLinks.length || sources.length);
    return `
      <div class="preview-section">
        <h4>IFWiki</h4>
        <div class="badges" style="justify-content:flex-start;margin:.45rem 0;">
          <span class="badge ${ifwiki?.ok === false ? 'warn' : 'ok'}">${ifwiki?.ok === false ? 'lookup warning' : 'lookup ready'}</span>
          <span class="badge ok">MediaWiki API</span>
          <span class="badge warn">curator review required</span>
          <span class="badge warn">rights not proven</span>
        </div>
        ${!hasLookupData ? '<p class="meta">No IFWiki title or URL could be normalized from this preview request.</p>' : ''}
        <dl>
          <dt>IFWiki title</dt><dd><code>${this._esc(ifwiki?.title || '')}</code></dd>
          <dt>IFWiki URL</dt><dd><code>${this._esc(ifwiki?.url || '')}</code></dd>
          ${ifwiki?.api_url ? `<dt>API source</dt><dd><code>${this._esc(ifwiki.api_url)}</code></dd>` : ''}
        </dl>
        ${errors.length ? this._reportList('IFWiki preview errors', errors, 'error', false) : ''}
        ${warnings.some(item => String(item || '').startsWith('IFWiki lookup failed:')) ? this._reportList('IFWiki lookup warning', warnings.filter(item => String(item || '').startsWith('IFWiki lookup failed:')), 'warn', false) : ''}
        ${fields.length ? `
          <div class="preview-card-grid">
            ${fields.map((field, index) => `
              <div class="provenance-item preview-card">
                <span>${this._esc(field.label || field.path || 'IFWiki field')}</span>
                <code>${this._esc(field.path || '')}</code>
                <p class="meta">${this._esc(this._previewFieldValue(field.value))}</p>
                ${this._isApplyableIFWikiField(field) ? `
                  <div class="checkbox">
                    <input type="checkbox" data-ifwiki-field="${index}" checked>
                    <label>Apply to ${this._esc(contextLabel)}</label>
                  </div>
                ` : '<p class="meta">Reference preview only; not applied to package metadata.</p>'}
              </div>
            `).join('')}
          </div>
        ` : '<p class="meta">No supported IFWiki metadata fields were returned.</p>'}
        ${externalLinks.length ? `
          <details class="review-notes" style="margin-top:.75rem;">
            <summary>IFWiki external links (${externalLinks.length})</summary>
            <div class="preview-card-grid" style="margin-top:.75rem;">
            ${externalLinks.map(item => `
              <div class="provenance-item preview-card">
                <span>External reference</span>
                <code>${this._esc(item.url || '')}</code>
                <p class="meta">${this._esc(item.status || 'reference only; not downloaded')}</p>
              </div>
            `).join('')}
            </div>
          </details>
        ` : ''}
        ${sources.length ? this._ecosystemSourceList(sources, true) : ''}
      </div>
    `;
  }

  _ifwikiPreviewFromReport(report) {
    const direct = report?.ifwiki && typeof report.ifwiki === 'object' ? report.ifwiki : {};
    const catalog = report?.metadata?.catalog?.ifwiki && typeof report.metadata.catalog.ifwiki === 'object'
      ? report.metadata.catalog.ifwiki
      : {};
    const title = String(direct.title || catalog.title || '').trim();
    const url = String(direct.url || catalog.url || '').trim();
    const fields = Array.isArray(direct.fields) ? [...direct.fields] : [];
    if (title && !fields.some(field => field?.path === 'catalog.ifwiki.title')) {
      fields.unshift({ path: 'catalog.ifwiki.title', label: 'IFWiki title', value: title, group: 'catalog' });
    }
    if (url && !fields.some(field => field?.path === 'catalog.ifwiki.url')) {
      fields.splice(title ? 1 : 0, 0, { path: 'catalog.ifwiki.url', label: 'IFWiki URL', value: url, group: 'catalog' });
    }

    return {
      ...direct,
      attempted: Boolean(direct.attempted || title || url),
      title,
      url,
      fields
    };
  }

  _ifwikiNoInputPanel() {
    return `
      <div class="preview-section">
        <h4>IFWiki</h4>
        <p class="meta">No IFWiki title or URL was supplied for this preview. Enter an IFWiki page title or IFWiki URL to run the MediaWiki API lookup.</p>
      </div>
    `;
  }

  _isApplyableIFWikiField(field) {
    const path = String(field?.path || '');
    return path === 'catalog.ifwiki.title' || path === 'catalog.ifwiki.url';
  }

  _ecosystemSourceList(sources, collapsed = false) {
    const rows = sources.map(source => {
      return `<div class="provenance-item preview-card"><span>${this._esc(source.label || 'Source')}</span><code>${this._esc(source.url || '')}</code><p class="meta">${this._esc(source.type || 'reference')}</p></div>`;
    });
    if (!rows.length) {
      return '';
    }
    const body = `<div class="preview-card-grid" style="margin-top:.75rem;">${rows.join('')}</div>`;
    return collapsed
      ? `<details class="review-notes" style="margin-top:.75rem;"><summary>Source attribution (${rows.length})</summary>${body}</details>`
      : body;
  }

  _previewFieldValue(value) {
    const text = Array.isArray(value) ? value.join(', ') : String(value || '');
    return text.length > 260 ? `${text.slice(0, 260)}...` : text;
  }

  _ecosystemReferenceList(references) {
    const rows = Object.entries(references).map(([key, reference]) => {
      const label = reference.label || 'Reference';
      const status = this._ecosystemReferenceStatus(key, reference);
      return `<div class="provenance-item preview-card"><span>${this._esc(label)}</span><code>${this._esc(reference.value || '')}</code><p class="meta">${this._esc(status)}</p></div>`;
    });
    return rows.length
      ? `<details class="review-notes" style="margin-top:.75rem;"><summary>Stored reference-only links (${rows.length})</summary><div class="preview-card-grid" style="margin-top:.75rem;">${rows.join('')}</div></details>`
      : '';
  }

  _ecosystemReferenceStatus(key, reference) {
    const label = String(reference?.label || key || '').toLowerCase();
    if (key === 'ifwiki_url' || label.includes('ifwiki')) {
      return 'IFWiki lookup is available in the preview panel when an IFWiki title or URL is supplied.';
    }

    return reference?.status || 'stored/reference only';
  }

  _reviewNotesDetails(title, items, className = 'warn') {
    const notes = Array.isArray(items) ? items.filter(item => String(item || '').trim() !== '') : [];
    if (!notes.length) {
      return '';
    }

    return `
      <details class="review-notes" style="margin-top:.75rem;">
        <summary>${this._esc(title)} (${notes.length})</summary>
        ${this._reportList(title, notes, className, false)}
      </details>
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
            <input type="file" accept=".z1,.z2,.z3,.z4,.z5,.z6,.z7,.z8,.zblorb,.zlb,.ulx,.gblorb,.glb,.blorb,.hex,.gam,.t3,.taf" ${story.loading || story.saving ? 'disabled' : ''}>
            <span class="meta">Allowed: z1, z2, z3, z4, z5, z6, z7, z8, zblorb, zlb, ulx, gblorb, glb, blorb, hex, gam, t3, taf. Archives, scripts, HTML, SVG, and arbitrary files are not accepted.</span>
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
    const game = this._findGame(slug) || {};
    const hasIFiction = report ? Boolean(report.exists) : Boolean(game.has_ifiction);
    const statusBadge = hasIFiction
      ? '<span class="badge ok">iFiction XML present</span>'
      : '<span class="badge warn">No iFiction XML</span>';
    const disabled = Boolean(ifiction.loading || ifiction.uploading || ifiction.applying);
    const reportStatus = report ? this._reportStatus(report, 'ifiction') : null;

    return `
      <section class="story-manager">
        <h3>iFiction Metadata</h3>
        <p class="meta">Local Metadata Assistant for package-root <code>metadata.iFiction.xml</code>. Preview and apply are explicit; remote IFDB, IFWiki, and IF Archive lookup is not performed.</p>
        <div class="badges" style="justify-content:flex-start;margin:.45rem 0;">${statusBadge}</div>
        ${ifiction.loading ? '<div class="message">Parsing local metadata.iFiction.xml...</div>' : ''}
        ${ifiction.uploading ? '<div class="message">Uploading and validating metadata.iFiction.xml...</div>' : ''}
        ${ifiction.error ? `<div class="message error">${this._esc(ifiction.error)}</div>` : ''}
        ${ifiction.success ? this._statusMessage(ifiction.success, reportStatus ? reportStatus.tone : 'success') : (reportStatus ? this._statusMessage(reportStatus.message, reportStatus.tone) : '')}
        ${report && report.errors?.length ? `<div class="message ${this._isMissingIFictionReport(report) ? 'warn' : 'error'}">${report.errors.map(error => this._esc(error)).join('<br>')}</div>` : ''}
        <div class="form-actions">
          <button class="button" type="button" data-action="preview-ifiction" data-slug="${this._esc(slug)}" ${disabled ? 'disabled' : ''}>${ifiction.loading ? 'Previewing...' : 'Preview Local iFiction XML'}</button>
        </div>
        <form data-ifiction-upload-slug="${this._esc(slug)}" enctype="multipart/form-data" style="margin-top:.85rem;">
          <div class="field">
            <label>Upload or replace metadata.iFiction.xml</label>
            <input type="file" name="file" accept=".xml,text/xml,application/xml" ${disabled ? 'disabled' : ''}>
            <span class="meta">Writes only <code>metadata.iFiction.xml</code> in this package root. Upload validates XML and never applies fields to <code>game.yaml</code> automatically.</span>
          </div>
          <div class="form-actions">
            <button class="button" type="submit" ${disabled ? 'disabled' : ''}>${ifiction.uploading ? 'Uploading...' : 'Upload / Replace XML'}</button>
          </div>
        </form>
        ${fields.length ? this._ifictionFieldTable(slug, fields, ifiction.applying) : (report ? '<p class="meta">No supported preview fields are available.</p>' : '')}
      </section>
    `;
  }

  _ifictionFieldTable(slug, fields, applying = false) {
    return `
      <form data-ifiction-apply-slug="${this._esc(slug)}">
        <p class="meta">This updates <code>game.yaml</code> only for selected fields. Existing non-empty values are only overwritten when checked, and a package-local backup is created before writing.</p>
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
    const screenshotPaths = Array.isArray(media.resources?.screenshots) ? media.resources.screenshots : (Array.isArray(game.resources?.screenshots) ? game.resources.screenshots : []);
    const screenshots = screenshotPaths.length
      ? screenshotPaths.map(path => this._adminMediaPreviewUrl(slug, path)).filter(Boolean)
      : (Array.isArray(urls.screenshots) ? urls.screenshots : (Array.isArray(game.screenshots) ? game.screenshots : []));
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
          ${screenshots.length ? screenshots.map((url, index) => this._screenshotRow(slug, this._cacheBustUrl(url, cacheKey), screenshotPaths[index] || media.resources?.screenshots?.[index] || '', index, screenshots.length, media.saving === 'screenshots' || media.saving === `screenshot-${index}`)).join('') : '<p class="meta">No screenshots recorded.</p>'}
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
    const path = resources[asset.key] || '';
    const urlMap = {
      cover: path ? this._mediaPreviewApiUrl(this.state.editingSlug || '', path) : (urls.cover || ''),
      'small-cover': path ? this._mediaPreviewApiUrl(this.state.editingSlug || '', path) : (urls.small_cover || urls.thumbnail || ''),
      hero: path ? this._mediaPreviewApiUrl(this.state.editingSlug || '', path) : (urls.hero || '')
    };

    return {
      ...asset,
      url: this._cacheBustUrl(urlMap[asset.type] || '', cacheKey),
      path
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
      catalog: 'External catalog references are for human review. IFDB and IFWiki preview are explicit and review-only; IF Archive path normalization is metadata-only.',
      ifdb_tuid: 'The IFDB story id, not the full URL.',
      ifdb_url: 'Public IFDB page for this work, when known.',
      ifwiki_title: 'Normalized IFWiki page title, applied only after curator review.',
      ifwiki_url: 'IFWiki URL or page title. Preview uses the MediaWiki API when requested. Results require curator review and do not prove rights.',
      ifarchive_path: 'IF Archive path such as games/zcode/example.z5, when known.',
      ifarchive_url: 'Full IF Archive URL, when useful alongside the path.',
      provenance: 'Where this package or story file came from. Useful for rights review and future maintenance.',
      license_name: 'Human-readable license or rights status.',
      license_notes: 'Redistribution limits, permission notes, or review reminders.',
      source_url: 'Original download, repository, catalog, or project page for the package or story file.',
      upstream_source_url: 'Canonical upstream project, source release, or source distribution URL when different from the packaged artifact.',
      port_repository_url: 'Repository or project URL for the port/source used to build this package variant.',
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
      walkthrough: 'Walkthrough',
      'known-differences': 'Known Differences'
    };

    return `
      <section class="helper-docs">
        <h3>Helper Docs</h3>
        <p class="meta">Plain Markdown editor for package-local curator/helper content such as play notes, hints, walkthroughs, and known differences. This does not edit story files, artwork, iFiction XML, or player config.</p>
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
      ['Known differences', readOnly.known_differences],
      ['iFiction XML', readOnly.ifiction],
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

  _collectCreateValues(form) {
    const values = {};
    new FormData(form).forEach((value, name) => {
      if (value instanceof File) {
        return;
      }
      values[String(name)] = String(value);
    });

    return values;
  }

  _mergeObjects(base = {}, overlay = {}) {
    const merged = Array.isArray(base) ? [...base] : { ...(base || {}) };
    Object.entries(overlay || {}).forEach(([key, value]) => {
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        merged[key] &&
        typeof merged[key] === 'object' &&
        !Array.isArray(merged[key])
      ) {
        merged[key] = this._mergeObjects(merged[key], value);
      } else {
        merged[key] = Array.isArray(value) ? [...value] : value;
      }
    });

    return merged;
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
          title: game.catalog?.ifwiki?.title || '',
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
          upstream: {
            url: source.upstream?.url || ''
          },
          port_repository: {
            url: source.port_repository?.url || ''
          },
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
      known_differences: resources.known_differences || fallbackGame.known_differences || '',
      ifiction: fallbackGame.has_ifiction ? 'metadata.iFiction.xml' : '',
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
      known_differences: game.known_differences || game.resources?.known_differences || '',
      ifiction: game.has_ifiction ? 'metadata.iFiction.xml' : '',
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

  _configApiUrl() {
    return `${this._apiBase()}/terpvault/config`;
  }

  _formatsApiUrl() {
    return `${this._apiBase()}/terpvault/formats`;
  }

  _ecosystemPreviewApiUrl() {
    return `${this._apiBase()}/terpvault/ecosystem/preview`;
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

  _mediaPreviewApiUrl(slug, path) {
    const safeSlug = String(slug || '').trim();
    const safePath = String(path || '').trim();
    if (!safeSlug || !safePath) {
      return '';
    }

    return `${this._apiBase()}/terpvault/packages/${encodeURIComponent(safeSlug)}/media/preview?path=${encodeURIComponent(safePath)}`;
  }

  _adminMediaPreviewUrl(slug, path) {
    return this._mediaPreviewApiUrl(slug, path);
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
    return ['how-to-play', 'hints', 'walkthrough', 'known-differences'];
  }

  _emptyHelperState(type) {
    const labels = {
      'how-to-play': 'How to Play',
      hints: 'Hints',
      walkthrough: 'Walkthrough',
      'known-differences': 'Known Differences'
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
      uploading: false,
      applying: false,
      error: '',
      success: '',
      report: null
    };
  }

  _emptyEcosystemState() {
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
    const groups = formats.groups || formats;
    const story = formats.story_extensions || this._extensionsFromGroups(groups);
    const assets = formats.asset_extensions || [];
    const result = this._saveResultHtml(this.state.formatsSave, 'Formats saved.');
    root.innerHTML = `
      <div class="box notice">
        <h2>Format Allowlists</h2>
        <p class="meta">These settings control what TerpVault accepts. They do not add player/interpreter support.</p>
      </div>
      ${result}
      <div class="grid">
        ${Object.entries(groups).map(([key, item]) => `
          <div class="box">
            <h2>${this._esc(item.label || key)}</h2>
            <p class="meta"><code>${this._esc((item.extensions || []).map(ext => `.${ext}`).join(', '))}</code></p>
          </div>
        `).join('')}
      </div>
      <div class="box" style="margin-top:.8rem;">
        <form data-form="formats">
          <fieldset>
            <legend>Story Extensions</legend>
            <p class="help">One extension per line or comma-separated. Leading dots are stripped. Values are lowercased; path-like or duplicate values are rejected.</p>
            <textarea class="short" name="story_extensions" spellcheck="false">${this._esc(story.join('\n'))}</textarea>
            ${this._extensionChips(story)}
          </fieldset>
          <fieldset>
            <legend>Asset / Media Extensions</legend>
            <p class="help">One extension per line or comma-separated. Leading dots are stripped. Controls package-local public asset serving; upload workflows may have narrower role-specific allowlists.</p>
            <textarea class="short" name="asset_extensions" spellcheck="false">${this._esc(assets.join('\n'))}</textarea>
            ${this._extensionChips(assets)}
          </fieldset>
          <div class="form-actions">
            <button class="button" type="button" data-action="reset-formats">Cancel Changes</button>
            <button class="button primary" type="submit" ${this.state.formatsSave.saving ? 'disabled' : ''}>${this.state.formatsSave.saving ? 'Saving...' : 'Save Formats'}</button>
          </div>
        </form>
      </div>
    `;
    this._bindFormatsActions();
  }

  _renderSettings() {
    const root = this.shadowRoot.getElementById('settings');
    const data = this.state.status || {};
    const storage = data.storage || {};
    const config = data.config || {};
    const library = config.library || {};
    const player = config.player || {};
    const admin = config.admin || {};
    const validation = config.validation || {};
    const result = this._saveResultHtml(this.state.settingsSave, 'Settings saved.');
    root.innerHTML = `
      ${result}
      <div class="box">
        <h2>Plugin Settings</h2>
        <form data-form="settings">
          <div class="fieldsets">
            <fieldset>
              <legend>Library</legend>
              ${this._textField('library.title', 'Title', library.title || '')}
              <div class="field">
                <label for="tv-setting-library-intro">Intro</label>
                <textarea id="tv-setting-library-intro" class="short" name="library.intro">${this._esc(library.intro || '')}</textarea>
              </div>
              ${this._numberField('library.cards_per_row', 'Cards per row', library.cards_per_row || 3, 1, 6)}
              ${this._checkboxField('library.show_unpublished', 'Show unpublished on public routes', Boolean(library.show_unpublished), 'Admin2 package lists remain draft-inclusive regardless of this setting.')}
            </fieldset>
            <fieldset>
              <legend>Routing</legend>
              ${this._textField('route', 'Public route', config.route || data.route || this._publicRoute())}
              ${this._checkboxField('auto_routes', 'Enable virtual routes', Boolean(config.auto_routes ?? true), 'Controls TerpVault public virtual pages, not Admin2 API routes.')}
              <p class="help">Manifest: <code>${this._esc(data.manifest_url || this._manifestUrl())}</code></p>
            </fieldset>
            <fieldset>
              <legend>Player</legend>
              <div class="field">
                <label for="tv-setting-player-engine">Engine</label>
                <select id="tv-setting-player-engine" name="player.engine">
                  ${this._options([['parchment', 'Parchment'], ['custom', 'Custom / future adapter label']], player.engine || 'parchment')}
                </select>
                <p class="help">Changing this value does not add a new runtime. The bundled player route remains Parchment.</p>
              </div>
              <div class="field">
                <label for="tv-setting-player-theme">Theme</label>
                <select id="tv-setting-player-theme" name="player.theme">
                  ${this._options([['retro-terminal', 'Retro Terminal'], ['parchment', 'Parchment Paper'], ['clean', 'Clean']], player.theme || 'retro-terminal')}
                </select>
              </div>
              <div class="field">
                <label for="tv-setting-launch-mode">Launch mode</label>
                <select id="tv-setting-launch-mode" name="player.launch_mode">
                  ${this._options([['button', 'Button'], ['autostart', 'Autostart']], player.launch_mode || 'button')}
                </select>
              </div>
              ${this._checkboxField('player.allow_fullscreen', 'Allow fullscreen', Boolean(player.allow_fullscreen))}
              ${this._checkboxField('player.allow_download_saves', 'Allow download saves', Boolean(player.allow_download_saves))}
              ${this._checkboxField('player.allow_upload_saves', 'Allow upload saves', Boolean(player.allow_upload_saves))}
              ${this._checkboxField('player.autosave', 'Autosave', Boolean(player.autosave))}
            </fieldset>
            <fieldset>
              <legend>Validation</legend>
              ${this._checkboxField('validation.warn_missing_ifid', 'Warn missing IFID', Boolean(validation.warn_missing_ifid))}
              ${this._checkboxField('validation.warn_missing_license', 'Warn missing license', Boolean(validation.warn_missing_license))}
              ${this._checkboxField('validation.warn_missing_source', 'Warn missing source', Boolean(validation.warn_missing_source))}
              ${this._checkboxField('validation.warn_missing_help_files', 'Warn missing helper files', Boolean(validation.warn_missing_help_files))}
            </fieldset>
            <fieldset>
              <legend>Admin</legend>
              ${this._checkboxField('admin.enable_admin2_page', 'Enable Admin2 Library Manager', Boolean(admin.enable_admin2_page), 'Turning this off can hide this page after cache clear or reload.')}
              <dl class="readonly">
                <div><span>Plugin version</span><code>${this._esc(data.version || this._version() || 'unknown')}</code></div>
              </dl>
            </fieldset>
            <fieldset>
              <legend>Storage</legend>
              <dl class="readonly">
                <div><span>Configured</span><code>${this._esc(storage.games_path || 'user://data/terpvault/games')}</code></div>
                <div><span>Resolved</span><code>${this._esc(storage.resolved_path || 'Available only when embedded Admin2 data is exposed')}</code></div>
              </dl>
              <p class="help">Storage path editing is intentionally read-only in this pass.</p>
            </fieldset>
          </div>
          <div class="form-actions">
            <button class="button" type="button" data-action="reset-settings">Cancel Changes</button>
            <button class="button primary" type="submit" ${this.state.settingsSave.saving ? 'disabled' : ''}>${this.state.settingsSave.saving ? 'Saving...' : 'Save Settings'}</button>
          </div>
        </form>
      </div>
    `;
    this._bindSettingsActions();
  }

  _bindSettingsActions() {
    const form = this.shadowRoot.querySelector('form[data-form="settings"]');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this._saveSettings(form);
    });

    form.querySelector('[data-action="reset-settings"]')?.addEventListener('click', () => {
      this.state.settingsSave = { saving: false, result: null, error: '' };
      this._renderSettings();
    });
  }

  async _saveSettings(form) {
    this.state.settingsSave = { saving: true, result: null, error: '' };
    this._renderSettings();

    try {
      const settings = this._collectSettingsForm(form);
      const data = await this._requestJson(this._configApiUrl(), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      this._applyConfigPayload(data);
      this.state.settingsSave = { saving: false, result: data, error: '' };
    } catch (error) {
      this.state.settingsSave = { saving: false, result: null, error: error?.message || 'Settings save failed.' };
    }

    this._renderSettings();
    this._renderFormats();
  }

  _collectSettingsForm(form) {
    const values = {};
    const booleans = [
      'library.show_unpublished',
      'auto_routes',
      'player.allow_fullscreen',
      'player.allow_download_saves',
      'player.allow_upload_saves',
      'player.autosave',
      'admin.enable_admin2_page',
      'validation.warn_missing_ifid',
      'validation.warn_missing_license',
      'validation.warn_missing_source',
      'validation.warn_missing_help_files'
    ];

    new FormData(form).forEach((value, name) => {
      values[String(name)] = String(value);
    });

    booleans.forEach(name => {
      values[name] = form.querySelector(`[name="${name}"]`)?.checked || false;
    });

    return values;
  }

  _bindFormatsActions() {
    const form = this.shadowRoot.querySelector('form[data-form="formats"]');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this._saveFormats(form);
    });

    form.querySelector('[data-action="reset-formats"]')?.addEventListener('click', () => {
      this.state.formatsSave = { saving: false, result: null, error: '' };
      this._renderFormats();
    });
  }

  async _saveFormats(form) {
    this.state.formatsSave = { saving: true, result: null, error: '' };
    this._renderFormats();

    try {
      const data = await this._requestJson(this._formatsApiUrl(), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formats: {
            story_extensions: this._parseExtensionTextarea(form.elements.story_extensions?.value || ''),
            asset_extensions: this._parseExtensionTextarea(form.elements.asset_extensions?.value || '')
          }
        })
      });
      this._applyConfigPayload(data);
      this.state.formatsSave = { saving: false, result: data, error: '' };
    } catch (error) {
      this.state.formatsSave = { saving: false, result: null, error: error?.message || 'Formats save failed.' };
    }

    this._renderFormats();
    this._renderSettings();
  }

  _parseExtensionTextarea(value) {
    return String(value || '')
      .split(/[\s,]+/)
      .map(item => item.trim())
      .filter(item => item !== '');
  }

  _applyConfigPayload(data) {
    if (data.config) {
      this.state.status = {
        ...(this.state.status || {}),
        config: data.config,
        storage: data.storage || this.state.status?.storage || {},
        route: data.config.route || this.state.status?.route,
        formats: data.formats || this.state.status?.formats
      };
    }

    if (data.formats) {
      this.state.formats = data.formats;
    }
  }

  _saveResultHtml(state, successText) {
    if (!state) return '';
    if (state.error) {
      return `<div class="message error">${this._esc(state.error)}</div>`;
    }
    if (!state.result) {
      return '';
    }

    const warnings = Array.isArray(state.result.warnings) ? state.result.warnings : [];
    const errors = Array.isArray(state.result.errors) ? state.result.errors : [];
    const saved = Array.isArray(state.result.saved_fields) ? state.result.saved_fields : [];
    const messages = [];
    if (saved.length) {
      messages.push(`<div class="message success">${this._esc(successText)} ${this._esc(saved.join(', '))}. ${state.result.cache_clear_required ? 'Clear Grav cache for all contexts to see the new config.' : ''}</div>`);
    }
    errors.forEach(item => messages.push(`<div class="message error">${this._esc(item)}</div>`));
    warnings.forEach(item => messages.push(`<div class="message warn">${this._esc(item)}</div>`));

    return messages.join('');
  }

  _textField(name, label, value) {
    const id = `tv-setting-${name.replace(/[^a-z0-9_-]+/gi, '-')}`;
    return `
      <div class="field">
        <label for="${this._esc(id)}">${this._esc(label)}</label>
        <input id="${this._esc(id)}" type="text" name="${this._esc(name)}" value="${this._esc(value)}">
      </div>
    `;
  }

  _numberField(name, label, value, min, max) {
    const id = `tv-setting-${name.replace(/[^a-z0-9_-]+/gi, '-')}`;
    return `
      <div class="field">
        <label for="${this._esc(id)}">${this._esc(label)}</label>
        <input id="${this._esc(id)}" type="number" name="${this._esc(name)}" value="${this._esc(value)}" min="${this._esc(min)}" max="${this._esc(max)}" step="1">
      </div>
    `;
  }

  _checkboxField(name, label, checked, help = '') {
    const id = `tv-setting-${name.replace(/[^a-z0-9_-]+/gi, '-')}`;
    return `
      <div class="checkbox">
        <input id="${this._esc(id)}" type="checkbox" name="${this._esc(name)}" ${checked ? 'checked' : ''}>
        <label for="${this._esc(id)}">${this._esc(label)}</label>
      </div>
      ${help ? `<p class="help">${this._esc(help)}</p>` : ''}
    `;
  }

  _extensionsFromGroups(groups) {
    const extensions = [];
    Object.values(groups || {}).forEach(group => {
      (group.extensions || []).forEach(extension => {
        if (!extensions.includes(extension)) {
          extensions.push(extension);
        }
      });
    });
    return extensions;
  }

  _extensionChips(extensions = []) {
    if (!extensions.length) {
      return '';
    }

    return `
      <div class="extension-chip-list" aria-label="Current normalized extensions">
        ${extensions.map(extension => `<span class="extension-chip">.${this._esc(extension)}</span>`).join('')}
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

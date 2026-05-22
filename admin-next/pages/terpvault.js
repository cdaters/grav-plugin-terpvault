const TAG = window.__GRAV_PAGE_TAG || 'terpvault-page';

class TerpVaultPage extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.state = { games: [], status: null, activeTab: localStorage.getItem('terpvault.admin.tab') || 'library' };
    this._renderSkeleton();
    this._load();
  }

  _authHeaders() {
    const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    try {
      const auth = JSON.parse(localStorage.getItem('grav_admin_auth') || '{}');
      if (auth.accessToken) headers['X-API-Token'] = auth.accessToken;
      if (auth.environment) headers['X-Grav-Environment'] = auth.environment;
    } catch (e) {}
    if (window.__GRAV_API_TOKEN) headers['X-API-Token'] = window.__GRAV_API_TOKEN;
    return headers;
  }

  async _api(path) {
    const serverUrl = window.__GRAV_API_SERVER_URL || '';
    const apiPrefix = window.__GRAV_API_PREFIX || '/api/v1';
    const response = await fetch(`${serverUrl}${apiPrefix}${path}`, { headers: this._authHeaders() });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || response.statusText || `HTTP ${response.status}`);
    return json.data || json;
  }

  _renderSkeleton() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; min-height:auto; font-family: inherit; color: inherit; }
        * { box-sizing: border-box; }
        .tv-admin { padding: 1rem; }
        .hero { border: 1px solid rgba(127,127,127,.25); border-radius: 18px; padding: 1rem 1.25rem; margin-bottom: 1rem; background: rgba(127,127,127,.06); }
        h1 { margin: 0 0 .25rem; font-size: 1.55rem; }
        h2 { margin: 0 0 .65rem; font-size: 1.15rem; }
        p { margin: .35rem 0; line-height: 1.45; }
        .meta { opacity:.72; font-size:.875rem; }
        .tabs { display:flex; flex-wrap:wrap; gap:.5rem; margin:0 0 1rem; }
        .tab { border:1px solid rgba(127,127,127,.25); border-radius:999px; background:rgba(127,127,127,.08); color:inherit; padding:.45rem .8rem; cursor:pointer; }
        .tab[aria-selected="true"] { background:rgba(148,92,255,.35); border-color:rgba(148,92,255,.8); }
        .panel { display:none; }
        .panel.active { display:block; }
        .empty,.error,.box { border:1px dashed rgba(127,127,127,.35); border-radius:16px; padding:1rem; background:rgba(127,127,127,.04); }
        .game { border:1px solid rgba(127,127,127,.25); border-radius:16px; margin:0 0 .8rem; background:rgba(255,255,255,.035); overflow:hidden; }
        .game summary { cursor:pointer; display:grid; grid-template-columns: 68px 1fr auto; gap:.85rem; align-items:center; padding:.75rem; }
        .cover { width:68px; aspect-ratio:16/9; border-radius:10px; object-fit:cover; background:rgba(127,127,127,.15); border:1px solid rgba(127,127,127,.25); }
        .title { font-weight:700; font-size:1rem; margin-bottom:.15rem; }
        .tagline { opacity:.78; font-size:.9rem; }
        .badges { display:flex; align-items:center; justify-content:flex-end; flex-wrap:wrap; gap:.35rem; }
        .badge { display:inline-flex; align-items:center; border:1px solid rgba(127,127,127,.35); border-radius:999px; padding:.12rem .5rem; font-size:.75rem; white-space:nowrap; }
        .badge.warn { border-color: rgba(255,188,87,.65); background: rgba(255,188,87,.12); }
        .badge.error { border-color: rgba(255,95,95,.75); background: rgba(255,95,95,.13); }
        .badge.info { border-color: rgba(93,164,255,.6); background: rgba(93,164,255,.10); }
        .warnings { display:grid; gap:.35rem; margin-top:.75rem; }
        .warning { border:1px solid rgba(127,127,127,.22); border-radius:12px; padding:.45rem .55rem; background:rgba(127,127,127,.04); }
        .warning strong { display:block; font-size:.86rem; }
        .body { border-top:1px solid rgba(127,127,127,.18); padding:.85rem; display:grid; grid-template-columns: minmax(0, 1.5fr) minmax(220px, .8fr); gap:1rem; }
        dl { display:grid; grid-template-columns: 110px minmax(0,1fr); gap:.35rem .7rem; margin:0; }
        dt { opacity:.68; }
        dd { margin:0; overflow-wrap:anywhere; }
        .actions { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; margin-top:.75rem; }
        a.button { display:inline-flex; border:1px solid rgba(127,127,127,.35); border-radius:999px; padding:.4rem .7rem; color:inherit; text-decoration:none; background:rgba(127,127,127,.08); }
        code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:.9em; }
        .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:.8rem; }
        @media (max-width: 760px) {
          .game summary { grid-template-columns: 56px 1fr; }
          .badges { grid-column: 1 / -1; justify-content:flex-start; }
          .body { grid-template-columns: 1fr; }
        }
      </style>
      <div class="tv-admin">
        <section class="hero">
          <h1>TerpVault</h1>
          <p>Curate playable interactive-fiction packages: story files, standards-aware metadata, Inform-style cover art, screenshots, hints, walkthroughs, and bundled Parchment playback.</p>
          <p class="meta">v0.1.10 adds package validation helpers and warning badges. Full create/edit/upload actions are next.</p>
        </section>
        <nav class="tabs" aria-label="TerpVault sections">
          ${this._tabButton('library', 'Library')}
          ${this._tabButton('formats', 'Formats')}
          ${this._tabButton('settings', 'Settings')}
        </nav>
        <section id="library" class="panel ${this.state.activeTab === 'library' ? 'active' : ''}"><div class="empty">Loading game packages…</div></section>
        <section id="formats" class="panel ${this.state.activeTab === 'formats' ? 'active' : ''}"><div class="empty">Loading format support…</div></section>
        <section id="settings" class="panel ${this.state.activeTab === 'settings' ? 'active' : ''}"><div class="empty">Loading settings…</div></section>
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

  async _load() {
    try {
      const [gamesData, statusData] = await Promise.all([
        this._api('/terpvault/games'),
        this._api('/terpvault/status')
      ]);
      this.state.games = gamesData.games || [];
      this.state.status = statusData;
      this._renderLibrary();
      this._renderFormats();
      this._renderSettings();
    } catch (error) {
      const html = `<div class="error">Could not load TerpVault data: ${this._esc(error.message)}</div>`;
      ['library','formats','settings'].forEach(id => this.shadowRoot.getElementById(id).innerHTML = html);
    }
  }

  _renderLibrary() {
    const root = this.shadowRoot.getElementById('library');
    const games = this.state.games;
    if (!games.length) {
      root.innerHTML = `<div class="empty">No game packages found. Create folders under <code>user/data/terpvault/games</code>, each with a <code>game.yaml</code>.</div>`;
      return;
    }
    root.innerHTML = `
      <div class="box" style="margin-bottom:.8rem;">
        <strong>${games.length} package${games.length === 1 ? '' : 's'} found</strong>
        <p class="meta">Rows below are intentionally collapsible. Edit/upload/import controls will replace this read-only scaffold in the next implementation pass.</p>
      </div>
      ${games.map(game => this._gameRow(game)).join('')}
    `;
  }

  _gameRow(game) {
    const urls = game.urls || {};
    const open = localStorage.getItem(`terpvault.admin.open.${game.slug}`) === '1' ? 'open' : '';
    setTimeout(() => {
      const row = this.shadowRoot.querySelector(`details[data-slug="${CSS.escape(game.slug)}"]`);
      if (row) row.addEventListener('toggle', () => localStorage.setItem(`terpvault.admin.open.${game.slug}`, row.open ? '1' : '0'));
    });
    return `
      <details class="game" data-slug="${this._esc(game.slug)}" ${open}>
        <summary>
          ${urls.small_cover || urls.thumbnail ? `<img class="cover" src="${this._esc(urls.small_cover || urls.thumbnail)}" alt="">` : `<div class="cover"></div>`}
          <div>
            <div class="title">${this._esc(game.title || game.slug)}</div>
            <div class="tagline">${this._esc(game.tagline || '')}</div>
          </div>
          <div class="badges">
            <span class="badge">${this._esc(game.format_label || (game.format || 'zcode').toUpperCase())}</span>
            <span class="badge">${this._esc(game.status || 'draft')}</span>
            <span class="badge ${game.has_story_file ? '' : 'error'}">${game.has_story_file ? 'story found' : 'missing story'}</span>
            ${game.warning_count ? `<span class="badge warn">${game.warning_count} warning${game.warning_count === 1 ? '' : 's'}</span>` : `<span class="badge">healthy</span>`}
          </div>
        </summary>
        <div class="body">
          <div>
            <dl>
              <dt>Slug</dt><dd><code>${this._esc(game.slug || '')}</code></dd>
              <dt>Story file</dt><dd><code>${this._esc(game.story_file || '')}</code></dd>
              <dt>Author</dt><dd>${this._esc(game.author || '')}</dd>
              <dt>Year</dt><dd>${this._esc(game.year || '')}</dd>
              <dt>IFIDs</dt><dd>${this._esc((game.ifids || []).join(', '))}</dd>
              <dt>Cover</dt><dd><code>${this._esc(game.cover || '')}</code></dd>
              <dt>Small cover</dt><dd><code>${this._esc(game.small_cover || game['small-cover'] || game.thumbnail || '')}</code></dd>
            </dl>
            <div class="actions">
              ${urls.detail ? `<a class="button" href="${this._esc(urls.detail)}" target="_blank" rel="noopener">Details</a>` : ''}
              ${urls.play ? `<a class="button" href="${this._esc(urls.play)}" target="_blank" rel="noopener">Play</a>` : ''}
            </div>
            ${this._warnings(game)}
          </div>
          <div class="meta">
            ${this._esc((game.description || '').replace(/\s+/g, ' ').slice(0, 360))}${(game.description || '').length > 360 ? '…' : ''}
          </div>
        </div>
      </details>
    `;
  }

  _renderFormats() {
    const root = this.shadowRoot.getElementById('formats');
    const formats = this.state.status?.formats || {};
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
        <strong>Parchment adapter</strong>
        <p class="meta">Bundled Parchment can interpret Z-code, Glulx, Hugo, TADS 2/3, and ADRIFT 4 when the corresponding story format and extension are supplied.</p>
      </div>
    `;
  }

  _renderSettings() {
    const root = this.shadowRoot.getElementById('settings');
    const config = this.state.status?.config || {};
    root.innerHTML = `
      <div class="box">
        <h2>Runtime settings</h2>
        <dl>
          <dt>Route</dt><dd><code>${this._esc(config.route || '/if')}</code></dd>
          <dt>Storage</dt><dd><code>${this._esc(config.storage?.games_path || 'user://data/terpvault/games')}</code></dd>
          <dt>Resolved path</dt><dd><code>${this._esc(this.state.status?.storage_path || '')}</code></dd>
          <dt>Player</dt><dd><code>${this._esc(config.player?.engine || 'parchment')}</code></dd>
          <dt>Parchment URL</dt><dd><code>${this._esc(config.player?.parchment_url || 'bundled local adapter')}</code></dd>
        </dl>
        <p class="meta">General plugin settings still live in Plugins → TerpVault. This page is the future home for daily library work: package creation, import, media uploads, metadata editing, and Markdown helper-file editing.</p>
      </div>
    `;
  }

  _esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[s]));
  }
}

customElements.define(TAG, TerpVaultPage);

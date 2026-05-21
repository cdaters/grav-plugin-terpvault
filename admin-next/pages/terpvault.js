const TAG = window.__GRAV_PAGE_TAG || 'terpvault-page';

class TerpVaultPage extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this._renderSkeleton();
    this._loadGames();
  }

  _authHeaders() {
    const headers = { 'Accept': 'application/json' };
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
    return json.data || json;
  }

  _renderSkeleton() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; min-height:auto; font-family: inherit; }
        .tv-admin { padding: 1rem; }
        .hero { border: 1px solid rgba(127,127,127,.25); border-radius: 16px; padding: 1rem 1.25rem; margin-bottom: 1rem; background: rgba(127,127,127,.06); }
        h1 { margin: 0 0 .25rem; font-size: 1.55rem; }
        p { margin: .35rem 0; line-height: 1.45; }
        .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: .8rem; }
        .card { border: 1px solid rgba(127,127,127,.25); border-radius: 14px; padding: .85rem; background: rgba(255,255,255,.04); }
        .card h2 { margin:.1rem 0 .35rem; font-size:1rem; }
        .meta { opacity:.72; font-size:.875rem; }
        .badge { display:inline-block; border:1px solid rgba(127,127,127,.35); border-radius:999px; padding:.1rem .5rem; margin-right:.25rem; font-size:.75rem; }
        .empty,.error { border:1px dashed rgba(127,127,127,.4); border-radius:14px; padding:1rem; }
        code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      </style>
      <div class="tv-admin">
        <section class="hero">
          <h1>TerpVault</h1>
          <p>Curate playable interactive fiction packages: story file, metadata, box art, screenshots, hints, walkthroughs, and a web player shell.</p>
          <p class="meta">v0.1.0 currently provides read-only discovery. Add/edit/import UI comes next.</p>
        </section>
        <div id="content" class="empty">Loading game packages…</div>
      </div>
    `;
  }

  async _loadGames() {
    const content = this.shadowRoot.getElementById('content');
    try {
      const data = await this._api('/terpvault/games');
      const games = data.games || [];
      if (!games.length) {
        content.className = 'empty';
        content.innerHTML = `No game packages found yet. Create folders under <code>user/data/terpvault/games</code>, each with a <code>game.yaml</code>.`;
        return;
      }
      content.className = 'grid';
      content.innerHTML = games.map(game => `
        <article class="card">
          <h2>${this._esc(game.title || game.slug)}</h2>
          <p>${this._esc(game.tagline || '')}</p>
          <p class="meta">
            <span class="badge">${this._esc(game.format || 'zcode')}</span>
            <span class="badge">${this._esc(game.status || 'draft')}</span>
            ${game.has_story_file ? '<span class="badge">story file found</span>' : '<span class="badge">missing story file</span>'}
          </p>
          <p class="meta"><code>${this._esc(game.slug || '')}</code></p>
        </article>
      `).join('');
    } catch (error) {
      content.className = 'error';
      content.textContent = `Could not load TerpVault packages: ${error.message}`;
    }
  }

  _esc(value) {
    return String(value ?? '').replace(/[&<>"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s]));
  }
}

customElements.define(TAG, TerpVaultPage);

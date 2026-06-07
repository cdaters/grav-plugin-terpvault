# TerpVault Admin Roadmap

## Current Admin2 status

- TerpVault Admin2 support is experimental.
- The Admin2 Library Manager remains disabled by default through `admin.enable_admin2_page: false`.
- Admin2 package-management routes are authenticated Admin2/API routes only.
- Public package routes remain separate from Admin2 API routes.
- Admin2 routes should continue to use controller-style API integration rather than ad hoc request handlers.
- Current write workflows are scoped to specific package-management actions; TerpVault should not expose an arbitrary package file browser.
- Admin2/API write permissions should remain conservative unless a future release defines a more granular permission model.
- Current Library Manager rows show draft/published status, featured state, story/iFiction presence, validation counts, and curator actions for publish/unpublish, featured toggle, metadata editing, export, and iFiction preview.

## Shipped milestones

### v0.2.x Admin2 foundation

- Added the opt-in Admin2 Library Manager page.
- Added read-only collapsible package rows with package title, slug, format, status, story-file presence, warning/error counts, validation notes, provenance summaries, public Detail/Play links, supported interpreter formats, and storage diagnostics.
- Added authenticated metadata API routes for whitelisted `game.yaml` edits.
- Added the Admin2 metadata editor UI.
- Added package-local helper Markdown editing for `how-to-play`, `hints`, and `walkthrough`.
- Added Media Manager Lite for package-local cover, small-cover, and screenshot uploads.
- Added screenshot list reorder/remove support without deleting physical files.
- Added Story File Manager Lite for allowlisted playable story-file replacement.
- Added a limited Package Creation Wizard.
- Added authenticated package export.
- Added inspect-only package import validation.
- The Library Manager renders packages as collapsible rows and now has baseline client-side search, sort, status/featured/format filters, metadata-completeness filters, visible result counts, and reset controls.
- Browser `localStorage` is currently used for the active Admin2 tab, package row expanded/collapsed state, and Library Manager search/sort/filter state.

### v0.3.x import/export hardening

- Added draft-only import commit for inspected `.terpvault.zip` packages.
- Revalidated imports server-side during commit instead of trusting browser inspection results.
- Extracted imports into temporary staging before moving normalized packages into the configured games directory.
- Forced imported packages to draft and unfeatured status.
- Normalized empty imported IFIDs, screenshots, and tags to arrays.
- Improved import success messaging and stale collision handling.
- Kept import inspection read-only; commit revalidates the uploaded zip and reports draft/not-featured import policy clearly.
- Delayed export object URL cleanup for browser download safety.
- Aligned release metadata and docs with the v0.3.x early public-beta/foundation posture.

### v0.4.0 presentation resources

- Added package-local `resources.hero` support for public detail/play presentation.
- Kept `resources.cover` as the conventional package/display/title/box-art image.
- Kept `resources.small_cover` as the compact catalog/library-card image.
- Treated `resources.hero` as a wide atmospheric image for page backgrounds or visual headers, not as a cover-art replacement.
- Added hero presentation options such as focal position, overlay tone, gradient direction, and optional overlay color.
- Added optional package-local `resources.feelies` for supplemental files such as maps, manuals, letters, newsletters, clue sheets, PDFs, images, audio, and other curated extras.
- Rendered public feelies/extras as a clearly labeled supplemental section on the detail page.
- Kept feelies package-local and served through controlled asset routes.
- Excluded archive files from the first public feelies rendering pass.
- Kept SVG feelies excluded unless a future safe sanitization or forced-download strategy is designed.

### v0.4.2 local iFiction preview and Admin2 UX polish

- Added authenticated Admin2 preview of package-local `metadata.iFiction.xml`.
- Added a safe local XML parser for the preview route.
- Added a preview table showing the current `game.yaml` value alongside the XML value.
- Kept the workflow preview-only: no apply/import yet.
- Kept remote lookup out of scope.
- Added contextual Admin2 guidance for curator-facing terminology and expected field content.
- Added actionable Cover, Small Cover, and Hero media tiles with a focused safe-action panel.
- Refreshed and cache-busted media previews after upload or replacement.

## Active roadmap

### v0.5.x incremental Admin2 path

- Keep v0.5.x focused on small, reviewable Admin2/library improvements after the v0.5.0 milestone.
- Prioritize large-library basics before bulk mutation: search, sort, simple filters, metadata-completeness filters, `localStorage` state preservation, and then pagination or virtual scrolling.
- Treat Metadata Assistant Phase 1 as local-first: `metadata.iFiction.xml` presence/status, upload/replace, preview/apply polish, and package creation/import awareness are baseline; future work should deepen those flows without adding silent remote lookup.
- Keep safe delete/remove in design until destructive guardrails are reviewed. No physical package delete should ship until manifest removal, package folder deletion, trash/quarantine, confirmation, audit feedback, containment, permission, and CSRF/token behavior are clear.
- Keep Oracle/progressive hint work additive and backwards compatible with `resources.hints: hints.md`.
- Keep content transparency work descriptive and neutral; it should improve discovery/filtering without hiding, blocking, endorsing, or morally ranking works by default.
- Keep player/theme work additive and scoped to the TerpVault shell unless Parchment exposes a supported theme-hint path. Player placement, boot behavior, inline play, and terminal theme controls are roadmap-only until the Parchment integration path is documented.
- Treat Terpwright Phase 1/2 as the current Admin2 package-builder workflow. Keep it local-file-first, draft-only, validation-driven, manually sourced, and separate from later smart Metadata Assistant lookup.

### v0.5.0 Admin2/public milestone

- Treat v0.5.0 as a public-beta milestone candidate, not as a GPM-ready claim and not as another narrow Admin2 feature release.
- Admin2 should be stable enough for beta use across create/Terpwright, publish/unpublish, featured toggle, metadata edit, helper Markdown edit, media/screenshots management, story replacement, export, import inspect, draft-only import commit, version visibility, and large-library search/filter/sort basics.
- Public routes should remain stable while Admin2 evolves: `/if`, `/if/{slug}`, `/if/{slug}/play`, `/if/_engine/parchment`, and `/if/_manifest`.
- Security/destructive boundaries must remain explicit: no package delete unless the safe workflow exists, no silent physical file deletion, no arbitrary package browser, and import remains draft-only and non-overwriting.
- Metadata/iFiction behavior must be easy to explain: local preview/apply is supported, remote catalog lookup is roadmap unless implemented, and metadata assistance is separate from story-file/package download.
- Player launch/theme behavior should remain coherent: `/if/{slug}/play` stays supported, inline detail-page play is optional, and theme defaults do not make Parchment unreadable inside common Grav themes.

### Admin2 contextual help and glossary

- Started in v0.4.2 with inline guidance in the Library Manager and metadata/media/story/helper/import/export areas.
- Continue refining wording as real curator workflows expose confusing terms.

- Add lightweight contextual help for users unfamiliar with interactive fiction terminology and TerpVault package conventions.
- Cover jargon-heavy fields and concepts such as IFID, iFiction, IFDB, IFWiki, IF Archive, TUID, cover, small cover, hero image, feelies, story file formats, catalog identifiers, import/export, and player settings.
- Keep help unobtrusive for experienced curators but discoverable for users who need terminology support.

### Future Admin2 Guide / Help tab

- Add a dedicated top-level Admin2 tab for in-product documentation, using a short label such as `Guide`, `Help`, or `Help & Docs`.
- Use a descriptive page heading such as `TerpVault Admin Guide & How-To`, `TerpVault Package Management Guide`, or `Admin Guide & Package Help`.
- Keep the Guide tab read-only, local/offline-friendly, and separate from Settings.
- Render local bundled Markdown documentation if practical; do not fetch remote documentation.
- Cover package management, package creation, import inspection, draft-only import install, export, publication status, metadata editing, iFiction XML preview/apply, media, screenshots, feelies/extras, helper Markdown, story-file replacement, format detection, validation warnings, and publication readiness.
- Reinforce safety boundaries: no package delete yet, no arbitrary package file browser, no destructive overwrite workflow, import remains draft-only and non-overwriting, Metadata Assistant remains local-first and preview/apply, and remote lookup is not implemented.
- Include glossary coverage for IFID, iFiction, Treaty of Babel, IFDB, IFWiki, IF Archive, Z-machine, Glulx, TADS, ADRIFT, Ink, feelies, helper Markdown, hints, walkthroughs, and story files.
- Keep this separate from contextual help notes/icons near individual fields.
- Do not invent screenshots. Future Admin2 screenshots should live under a future-friendly path such as `docs/images/admin2/` and should be refreshed when Admin2 UI changes.
- See `docs/ADMIN2-GUIDE.md`.

### The Oracle / Progressive Hints

- Keep current helper Markdown editing for `how-to-play.md`, `hints.md`, and `walkthrough.md`.
- Preserve the existing simple `resources.hints: hints.md` path.
- Plan a richer spoiler-safe Oracle UI inside the existing Help & Reference area, with public label `The Oracle` and optional subtitle `Are you lost and need a hand?`.
- Normalize future hint sources into `Section -> Question -> Hint steps`.
- Candidate package-local source adapters include Markdown, structured YAML, structured JSON, ROT13 Markdown/text, legacy `.inv`, and future Ink-guided flows.
- Treat `.inv` as a legacy/classic IF compatibility source parsed or imported into TerpVault's model; do not depend on external converters at runtime.
- Keep Ink-guided hints future/complementary and separate from parser IF/Parchment support.
- See `docs/ORACLE-HINTS.md`.

### Content transparency and catalog discovery

- Add future Admin2 controls for `tags`, `content_notes`, `theme_notes`, and `audience` guidance.
- Keep ordinary tags focused on format, genre, tone, and play style.
- Use content notes for potentially sensitive or mature material.
- Use theme notes for major themes without treating them as warnings by default.
- Keep audience guidance optional and descriptive.
- Do not hide works by default based on content notes.
- Avoid loaded labels such as "problematic", "approved", "unsafe", or "forbidden".
- Align frontend search/filter work with Grav-compatible taxonomy/search structures where practical while keeping package YAML plain and export/import friendly.
- Preserve backwards compatibility with packages that only use simple tags or no tags.
- See `docs/CONTENT-TRANSPARENCY.md`.

### Actionable media cards

- Started in v0.4.2 with selectable Cover, Small Cover, and Hero tiles plus a focused safe-action panel.
- Turn Cover, Small Cover, and Hero preview cards into actionable asset tiles.
- Clicking an asset tile should open a focused management affordance such as view and replace now, with clear-reference and physical delete left for later safe workflows.
- Keep visible and accessibility-friendly controls; do not rely only on clicking the image.
- Continue using allowlisted package-local media handling and path validation.

### Feelies/extras management

- Started in v0.4.4 with Admin2 listing, metadata edits, add, manifest-only remove, reorder, public/open links when valid, and allowlisted package-local uploads for `resources.feelies`.
- Keep remove behavior manifest-only; physical file deletion remains out of scope.
- Do not turn feelies into arbitrary package file browsing; expose and manage only curated supplemental files.
- Keep SVG feelies excluded unless a future safe sanitization or forced-download strategy is designed.

### Safe package/resource remove/delete/archive workflows

- Current state: full package delete is not implemented. There is no Admin2 package delete UI, no package delete API route, and no service that physically deletes a package folder.
- Current remove behavior is intentionally narrower: screenshot remove updates `resources.screenshots` only, and feelie remove updates the pending/saved `resources.feelies` manifest list only. These actions do not delete package-local files.
- Add safe workflows for removing package/resource references and, later, deleting physical files. Clearly distinguish "remove from manifest/index/listing" from "delete the physical package folder and files."
- If a package-index/listing removal concept is added later, document whether it only hides/unregisters the package or changes package files.
- Physical package deletion must never happen silently. Show the package title and slug, require explicit confirmation, and prefer a two-step confirmation for permanent folder deletion.
- Prefer move-to-trash or quarantine behavior before permanent delete. A quarantine should preserve enough structure to restore or inspect what was moved.
- Before deleting or moving, validate that every target path is package-local and inside the configured TerpVault games directory.
- Document exactly what happens to story files, cover/small-cover/hero images, screenshots, feelies/extras, helper Markdown docs, provenance files, `metadata.iFiction.xml`, `game.yaml`, generated backups, and any package-local support files.
- Require Admin2/API authentication and conservative permissions for destructive actions, and add CSRF/token handling appropriate to the Grav Admin2/API request model before exposing any delete route.
- Return audit/result feedback after every destructive attempt: files deleted, files moved, manifest entries removed, files intentionally left untouched, skipped files, and errors.
- Add tests/checks before implementation for containment validation, dry-run/audit output, trash/quarantine behavior, permission failures, slug collisions, missing files, symlink/path traversal attempts, and partial-failure reporting.
- Keep public routes and package-management API routes separated.

### Large-library management

- Make Admin2 usable for libraries with hundreds or thousands of packages without rendering one giant page.
- Baseline shipped: client-side search/filter/sort controls before bulk mutation workflows.
- Baseline search covers available manifest fields including title, slug, author, format, engine/runtime, tags, status, year/date, IFID, catalog links, source/license, and provenance rows.
- Baseline sorting includes title A-Z/Z-A, author, year/date newest/oldest, format/engine, status, and slug A-Z.
- Baseline filters include published/draft, featured/not featured, format/engine, missing cover, missing screenshots, missing walkthrough, missing IFID, and missing catalog links.
- Future filters should add provenance verified/needs review, license verified/needs review, bundled demo/user library, and `metadata.iFiction.xml` present/missing after those signals are exposed consistently in the manifest/status data.
- Add pagination or virtual scrolling so large libraries do not render as one giant DOM. Support items-per-page choices of 25, 50, and 100 if pagination is used.
- Keep the existing collapsible package row model, but make expanded rows behave predictably when a package is filtered out, moved to a different page, or returned by a new search.
- Preserve Admin2 UI state in `localStorage` where practical. Search query, filters, sort order, active tab, and expanded/collapsed rows are persisted; page size and active page remain future pagination work.
- Lazy-load or defer heavy media previews so hundreds of covers/screenshots do not slow the admin page.
- Consider compact, grid, and list view modes later, after search/filter/sort/page state is stable.
- Add bulk actions only after safe single-package workflows exist and their audit/confirmation behavior is proven.
- Use metadata-completeness filters to feed curation workflows: missing IFID, missing cover, missing screenshots, missing helper docs, missing catalog URLs, provenance needs review, license needs review, and `metadata.iFiction.xml` present/missing.

### Library ordering/sorting

- Add future drag-and-drop ordering of collapsible game rows in the Admin2 Library Manager.
- Consider whether manual order should be stored package-locally in `game.yaml` or site-locally in a library order file.
- Allow the public library to optionally respect manual order.
- Preserve existing sortable/filterable library behavior when manual order is not enabled.

### iFiction apply/import

- Current state: Admin2 shows package-local `metadata.iFiction.xml` presence/status in package rows and details, can preview package-local XML, and can apply explicitly selected supported fields into `game.yaml`. The apply route re-parses local XML server-side and creates a package-local `game.yaml` backup through the metadata service before writing.
- Supported mapped fields are title, author, headline/subtitle, description/teaser, first published/date, genre, language, IFIDs, and format/system.
- Admin2 can upload or replace package-root `metadata.iFiction.xml`. Upload validates XML, rejects DOCTYPE declarations, backs up an existing XML file before replacement, and never applies metadata into `game.yaml` automatically.
- Terpwright Phase 1 package creation can preserve an uploaded package-root `metadata.iFiction.xml`, but it does not prefill or merge XML fields into `game.yaml`. Import inspection also reports whether an incoming package contains package-root `metadata.iFiction.xml`, and import commit preserves the file without auto-applying it.
- Keep the local XML file package-local and reviewable. Preserve unknown YAML fields when applying accepted changes.
- Future local iFiction improvements should make package creation/import flows even more directly connected to local preview/apply when XML is present.
- Continue to avoid remote lookup in local iFiction workflows.

### Metadata Assistant

- Add a future preview-driven Metadata Assistant to reduce manual metadata entry without silently changing packages.
- Candidate sources should include local `game.yaml`, package-local `metadata.iFiction.xml`, manually uploaded/replaced `metadata.iFiction.xml`, future IFDB lookup by IFID/title/URL, future IFWiki lookup by title/URL, and future IF Archive path/URL helpers.
- Future source/provider definitions should be configurable on the back end before remote lookup ships. Known or preconfigured provider definitions may include local iFiction XML, IFDB, IFWiki, and IF Archive.
- Provider definitions should include provider id, display label, enabled/disabled state, lookup method/type, base URL or API endpoint where applicable, rate-limit/caching notes, attribution/license notes, field mapping rules, and confidence/scoring notes.
- Show candidate matches with confidence and notes. Use side-by-side previews of current package metadata and candidate metadata, with field-level apply checkboxes.
- Never silently overwrite existing metadata. Always back up `game.yaml` before applying selected changes.
- Do not perform remote fetches without explicit user action.
- Keep provenance and license review explicit, even when external catalog metadata is found.
- Clearly distinguish metadata import/enrichment from story-file or package download.
- Phase 1 baseline: local iFiction XML presence/status in package rows, XML present/missing filters, package-root upload/replace, import inspection awareness, and improved local preview/apply. Remaining Phase 1 polish is package creation awareness where practical.
- Phase 2: assist catalog/provenance fields such as IFDB TUID, IFDB URL, IFWiki URL, IF Archive path, IF Archive URL, source URL, retrieved date, and license notes.
- Phase 3: add explicit ecosystem lookup helpers by title/author, IFID where possible, and pasted IFDB/IFWiki/IF Archive URL or path. Preview candidates beside current `game.yaml` and package-local iFiction XML, apply selected fields only, document source/retrieval date, and preserve the rule that lookup results are curator-review references, not proof of rights.
- Tie this assistant to large-library cleanup by letting admins filter for incomplete metadata groups, then use the assistant to resolve missing IFID, catalog URL, cover, screenshot, helper-doc, provenance, license, or `metadata.iFiction.xml` gaps.

### Public theme and Parchment integration polish

- Render TerpVault public library, detail, and play pages cleanly under light and dark Grav themes, including Quark2, Typhoon, and similar Grav/Grav2 themes.
- Current baseline: the public player shell around the iframe uses TerpVault-controlled CSS variables, light defaults, cautious common light/dark selectors, and `prefers-color-scheme` fallback instead of hard-coded player chrome colors.
- Continue avoiding assumptions that every Grav theme exposes the same dark-mode class; theme-specific refinements should remain additive and scoped.
- Investigate Parchment's supported theme options and URL/config parameters before adding TerpVault-side controls.
- Consider future player settings such as `player.theme: auto | light | dark | parchment-default`, `player.match_site_theme`, `player.frame_background`, and `player.chrome_style`.
- Pass a theme hint to the Parchment iframe when the bundled or configured Parchment runtime supports it, such as light, dark, system, or Parchment default.
- Verify Quark2 light mode, Quark2 dark mode, Typhoon light mode, Typhoon dark mode, browser/system dark mode, and fullscreen mode.
- Keep save/restore help panel, iframe border, title bar, buttons, and page background readable in every tested theme.
- Do not edit the bundled Parchment runtime directly for theme polish unless there is no supported wrapping/configuration path.
- Update `README.md` and `docs/PARCHMENT-BUNDLING.md` if future player theme options become real configuration.

### Inline Play Mode and player terminal themes

- Plan a future presentation model where game detail pages can optionally embed the Parchment player directly on `/if/{slug}`.
- Keep the existing focused `/if/{slug}/play` route supported for packages, themes, and users that prefer a separate play page.
- Separate player placement from story boot behavior.
- Candidate settings should support global defaults and package overrides:

```yaml
player:
  engine: parchment
  placement: focused
  boot: autoload
  theme: retro-terminal
  inline:
    height: 720
    allow_fullscreen: true
```

- Candidate `player.placement` values: `focused`, `inline`, and `inline_autostart`.
- Candidate `player.boot` values: `autoload` and `manual`.
- Candidate `player.theme` values: `default`, `retro-terminal`, `cit101`, `green-screen`, `amber-crt`, `light-paper`, and `parchment-classic`.
- Admin should be able to choose a default player theme. Per-package theme, placement, and boot overrides can come later if they do not complicate package validation.
- A public theme picker should be optional. Public pages should be able to hide player controls when the curator wants a locked presentation.
- When a user clicks Play from `/if/{slug}` and reaches `/if/{slug}/play`, the focused page should ideally load Parchment ready at the prompt without a redundant second Play click unless a technical or accessibility reason requires manual boot.
- Terminal themes should include a CIT101-style pale blue phosphor option, green monochrome, amber/orange monochrome, and retro terminal chrome.
- Scanline or CRT overlays should be optional and disableable. Reduced-motion preferences and readability must take priority over visual nostalgia.
- Use font stacks or licensed bundled fonts only. Do not bundle questionable terminal fonts; if custom fonts are added later, verify license and notice requirements first.
- Scope theme CSS to TerpVault/Parchment player containers so parent Grav themes, Quark2/Typhoon light/dark modes, and site-level CSS do not break player readability.
- Document Parchment iframe/internal styling limits before implementation, especially which styling can be controlled by TerpVault wrapper CSS versus Parchment-supported options or query/config parameters.
- See `docs/PLAYER-PRESENTATION.md`.

### Ink package support

- Treat Ink as a first-class future choice-based/narrative scripting format for TerpVault packages.
- Keep Ink positioned as complementary to parser IF and existing Parchment-backed Z-code/Glulx/TADS/Hugo/ADRIFT support.
- Prefer compiled Ink JSON as the playable package artifact, with optional `.ink` source files for preservation and transparency.
- Plan a future runtime path through `inkjs` or a TerpVault-hosted web player; do not add `inkjs` until the package format and runtime adapter are designed.
- Extend Admin2 package metadata, validation, and creation flows later so curators can identify Ink content without weakening current parser-story validation.
- Ink may be a v0.5.0-era roadmap/demo exploration, but it is not required for v0.5.0 unless implementation, validation, docs, and runtime support are ready.
- If any Ink element appears before v0.5.0, mark it clearly experimental and keep it separate from parser/Parchment support.

## Later / advanced

### Remote IFDB/IFWiki/IF Archive enrichment

- Treat this as Terpwright Phase 3 ecosystem lookup helper planning, not automated package creation.
- Explore IF Archive path/URL helpers first, then IFDB lookup by IFID/TUID/title/URL, then IFWiki helpers after lookup patterns are proven.
- Add optional package-local iFiction/Treaty of Babel cross-checks so current `game.yaml`, local XML, and catalog candidates can be compared in one review surface.
- Keep remote catalog lookup preview-based and curator-reviewed, not authoritative.
- Remote lookup must be an explicit admin action through a configured provider. Do not run provider lookups automatically during package import, package creation, metadata save, or manifest load.
- Treat remote data as a curator aid, not a replacement for license/provenance review.
- Show source, confidence, retrieval context, warning state, and target field for every proposed remote change.
- Do not add IFDB/IFWiki scraping, AI metadata generation, or IF Archive/story package downloads as part of metadata lookup. Any future remote feature must respect source terms, distinguish references from redistributable assets, and keep license/provenance review visible.
- Do not trust catalog metadata over package-local story/iFiction metadata without curator confirmation.

### Advanced File Type Policy

- Consider an Advanced File Type Policy area under Plugins > TerpVault > Configure.
- Use collapsible sections for story files, cover/small-cover/hero images, screenshots, helper docs, feelies/extras, and public asset-serving rules.
- Make the policy guardrailed rather than a raw freeform extension list.
- Distinguish file types allowed inside packages, file types allowed for import/export validation, and file types allowed to be served publicly through TerpVault routes.
- Explain that some extensions may be safe as package contents but unsafe as public same-origin browser links.
- Keep SVG feelies excluded unless a future safe sanitization or forced-download strategy is designed.

### Terpwright package builder

- Admin2 now includes the Phase 1 local-file package builder for creating new draft TerpVault packages from curated local files and explicit basic metadata.
- Keep generated packages reviewable before installation, export, or publication.
- Reuse import/export validation rules rather than bypassing package safety checks.
- V1 is local-file-first: local story file, local media, helper Markdown, local `metadata.iFiction.xml`, feelies, and manually supplied source/license notes. Package zip handling remains on the existing inspect/import path.
- Create draft packages only, with `game.yaml`, story file, optional `metadata.iFiction.xml`, helper Markdown, provenance notes, and the normal package folder structure.
- Keep Terpwright separate from later smart Metadata Assistant features. Remote lookup/search, provider confidence scoring, automated provenance drafting, cover generation, and art suggestions are later roadmap work.
- Phase 3 planning should limit remote/catalog work to explicit ecosystem lookup helpers: URL validation/preview shell, IF Archive helper, IFDB helper, IFWiki helper, iFiction/Babel cross-check, curator apply/diff workflow, and validation integration.
- Never silently download, redistribute, or package story files, cover art, screenshots, walkthroughs, hints, maps, manuals, scans, clue sheets, or feelies from a URL.
- Keep provenance/license review explicit, preserve source URLs and retrieval dates, require curator confirmation before packaging third-party assets, and do not auto-publish.
- Keep cover, screenshot, helper-doc, and feelie import conservative and license-aware.
- See `docs/TERPWRIGHT.md`.

### Curated demo/starter library

- Use `docs/DEMO-LIBRARY.md` as the planning/spec reference for legally clean bundled demo packages and any future Admin2 Install Demo Packages workflow.
- Keep demo package installation distinct from arbitrary file browsing and reuse package validation/import-style safety checks.

### Named saves/server-side saves

- Add server-side named saves for logged-in users in a later player-focused milestone.
- Keep this separate from Admin2 package-management work unless a future release explicitly joins the workflows.

### Ink shortcode/block and interactive page experiments

- After Ink package support exists, explore Grav/Admin2-friendly embeds such as `[terpvault-ink game="example-game"]` or `[ink src="user://path/to/story.json"]`.
- Enqueue Ink JavaScript and CSS safely and make the embed compatible with Grav caching where practical.
- Longer term, evaluate Ink-powered interactive articles, onboarding pages, guided tutorials, and narrative documentation for TerpVault and RetroRealm.
- Possible examples include "Enter the Vault", "The Archivist's Tour", and a beginner guided path through parser IF, choice IF, Z-machine, Glulx, TADS, Inform, Twine, Ink, feelies, IFIDs, and TerpVault packages.

### GPM readiness

- Prepare for GPM only when compatibility, dependency, packaging, and support posture are verified.
- Do not make GPM-readiness claims until the release process and Grav/Admin/API compatibility targets are confirmed.
- Use v0.5.x for the next full GPM readiness audit only after public routes, Parchment bundling, Admin2 beta workflows, starter/demo package posture, and release packaging are stable enough for that review.

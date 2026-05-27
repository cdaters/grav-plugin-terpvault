# TerpVault Admin Roadmap

## Current Admin2 status

- TerpVault Admin2 support is experimental.
- The Admin2 Library Manager remains disabled by default through `admin.enable_admin2_page: false`.
- Admin2 package-management routes are authenticated Admin2/API routes only.
- Public package routes remain separate from Admin2 API routes.
- Admin2 routes should continue to use controller-style API integration rather than ad hoc request handlers.
- Current write workflows are scoped to specific package-management actions; TerpVault should not expose an arbitrary package file browser.
- Admin2/API write permissions should remain conservative unless a future release defines a more granular permission model.
- v0.4.4 includes narrow Admin2 feelies/extras management for curated `resources.feelies` entries without physical delete behavior.

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

### v0.3.x import/export hardening

- Added draft-only import commit for inspected `.terpvault.zip` packages.
- Revalidated imports server-side during commit instead of trusting browser inspection results.
- Extracted imports into temporary staging before moving normalized packages into the configured games directory.
- Forced imported packages to draft and unfeatured status.
- Normalized empty imported IFIDs, screenshots, and tags to arrays.
- Improved import success messaging and stale collision handling.
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

### Admin2 contextual help and glossary

- Started in v0.4.2 with inline guidance in the Library Manager and metadata/media/story/helper/import/export areas.
- Continue refining wording as real curator workflows expose confusing terms.

- Add lightweight contextual help for users unfamiliar with interactive fiction terminology and TerpVault package conventions.
- Cover jargon-heavy fields and concepts such as IFID, iFiction, IFDB, IFWiki, IF Archive, TUID, cover, small cover, hero image, feelies, story file formats, catalog identifiers, import/export, and player settings.
- Keep help unobtrusive for experienced curators but discoverable for users who need terminology support.

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

- Add safe workflows for removing package/resource references and, later, deleting physical files.
- Distinguish removing a manifest reference from deleting a physical file.
- Prefer archive/trash behavior before permanent package delete.
- Require clear review, confirmation, package containment validation, and backup/archive behavior for destructive actions.
- Keep public routes and package-management API routes separated.

### Library ordering/sorting

- Add future drag-and-drop ordering of collapsible game rows in the Admin2 Library Manager.
- Consider whether manual order should be stored package-locally in `game.yaml` or site-locally in a library order file.
- Allow the public library to optionally respect manual order.
- Preserve existing sortable/filterable library behavior when manual order is not enabled.

### iFiction apply/import

- Add explicit curator-controlled apply/import from the local iFiction preview.
- Show proposed `game.yaml` changes before applying them.
- Prefer merge previews that identify source, confidence, current value, proposed value, and target field.
- Preserve unknown YAML fields when applying accepted changes.
- Keep the local XML file package-local and reviewable.

### Public theme and Parchment integration polish

- Render TerpVault public library, detail, and play pages cleanly under light and dark Grav themes, including Quark2, Typhoon, and similar Grav/Grav2 themes.
- Move the player shell around the iframe toward theme-aware CSS variables where practical instead of hard-coded light/dark colors.
- Avoid assuming every Grav theme exposes the same dark-mode class; use robust defaults and CSS fallbacks such as `prefers-color-scheme`.
- Investigate Parchment's supported theme options and URL/config parameters before adding TerpVault-side controls.
- Consider future player settings such as `player.theme: auto | light | dark | parchment-default`, `player.match_site_theme`, `player.frame_background`, and `player.chrome_style`.
- Pass a theme hint to the Parchment iframe when the bundled or configured Parchment runtime supports it, such as light, dark, system, or Parchment default.
- Verify Quark2 light mode, Quark2 dark mode, Typhoon light mode, Typhoon dark mode, browser/system dark mode, and fullscreen mode.
- Keep save/restore help panel, iframe border, title bar, buttons, and page background readable in every tested theme.
- Do not edit the bundled Parchment runtime directly for theme polish unless there is no supported wrapping/configuration path.
- Update `README.md` and `docs/PARCHMENT-BUNDLING.md` if future player theme options become real configuration.

### Ink package support

- Treat Ink as a first-class future choice-based/narrative scripting format for TerpVault packages.
- Keep Ink positioned as complementary to parser IF and existing Parchment-backed Z-code/Glulx/TADS/Hugo/ADRIFT support.
- Prefer compiled Ink JSON as the playable package artifact, with optional `.ink` source files for preservation and transparency.
- Plan a future runtime path through `inkjs` or a TerpVault-hosted web player; do not add `inkjs` until the package format and runtime adapter are designed.
- Extend Admin2 package metadata, validation, and creation flows later so curators can identify Ink content without weakening current parser-story validation.

## Later / advanced

### Remote IFDB/IFWiki/IF Archive enrichment

- Explore IFDB lookup by IFID/TUID after local iFiction apply/import is safe.
- Explore IFWiki and IF Archive enrichment after IFDB lookup patterns are proven.
- Keep remote catalog lookup preview-based and curator-reviewed, not authoritative.
- Treat remote data as a curator aid, not a replacement for license/provenance review.
- Show source, confidence, and target field for every proposed remote change.

### Advanced File Type Policy

- Consider an Advanced File Type Policy area under Plugins > TerpVault > Configure.
- Use collapsible sections for story files, cover/small-cover/hero images, screenshots, helper docs, feelies/extras, and public asset-serving rules.
- Make the policy guardrailed rather than a raw freeform extension list.
- Distinguish file types allowed inside packages, file types allowed for import/export validation, and file types allowed to be served publicly through TerpVault routes.
- Explain that some extensions may be safe as package contents but unsafe as public same-origin browser links.
- Keep SVG feelies excluded unless a future safe sanitization or forced-download strategy is designed.

### Vaultwright package builder

- Add a future package builder for creating or refining TerpVault packages from curated inputs.
- Keep generated packages reviewable before installation or publication.
- Reuse import/export validation rules rather than bypassing package safety checks.

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

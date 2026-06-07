# TerpVault Next Build Notes

TerpVault is in an early public-beta milestone phase. Public routes and bundled Parchment playback are established, while the Admin2 Library Manager remains experimental, opt-in, and disabled by default.

## Validation focus before the next code build

- Confirm virtual pages render under `/if`.
- Confirm virtual pages render under subdirectory installs such as `/grav2-fullsite-skeleton/if`.
- Confirm package assets render through `/if/_asset/{slug}/{path}`.
- Confirm story files stream through `/if/_story/{slug}/{filename}`.
- Confirm `[terpvault game="sample-cave"]` replacement works after page content processing.
- Confirm Admin2 sidebar registration does not appear while `admin.enable_admin2_page` is false.
- Confirm Admin2 sidebar registration appears only when Admin2/API is available and `admin.enable_admin2_page` is true.
- Confirm Admin2 create, edit, export, import inspect, and draft-only import commit workflows still require authenticated Admin2/API access.
- Confirm PHP ZipArchive/`php-zip` is present before testing `.terpvault.zip` export/import.
- Confirm Admin2 dashboard/API requests do not trigger TerpVault frontend virtual-page registration.

## Current package-management boundaries

- Package delete is not implemented.
- Removing screenshots and feelies/extras is currently manifest-only and does not delete the physical package-local files.
- Package overwrite/replace is not implemented.
- Import overwrite is not implemented.
- Arbitrary package file browsing is not implemented.
- `metadata.iFiction.xml` editing is not implemented.
- `metadata.iFiction.xml` upload/replace is limited to the package-root XML file, validates XML, and does not apply metadata automatically.
- IF Archive file download, arbitrary URL lookup, or broad catalog lookup/import is not implemented.
- Terpwright Phase 3a/3b ecosystem preview is implemented as a read-only Admin2 helper with IF Archive URL/path normalization; Phase 3c adds IFDB TUID/URL normalization and read-only IFDB metadata preview through IFDB's official API; Phase 3d adds IFWiki URL/title normalization and read-only IFWiki metadata preview through IFWiki's MediaWiki API; Phase 3e adds metadata cross-check across current metadata, package-local iFiction XML where present, IFDB, IFWiki, and IF Archive normalized values.
- Admin2 baseline client-side search, filters, sorting controls, result counts, reset controls, and `localStorage` state preservation are implemented.
- Admin2 pagination and virtual scrolling are not implemented.
- Named save slots and server-side saves are not implemented.
- Public frontend routing and Parchment/player behavior should stay unchanged during Admin2 work.
- Oracle v1 renders current helper Markdown such as `resources.hints: hints.md` in a spoiler-safe frontend panel; richer sources and Admin2 controls remain roadmap-only.
- Content transparency search/filter controls are roadmap-only; current manifests with simple tags or no tags remain valid.
- Admin2 Guide/Help tab is roadmap-only; no runtime in-product guide is implemented yet.

## Candidate next work

### v0.5.x incremental path

- Keep v0.5.x focused and incremental after the v0.5.0 milestone rather than treating every small improvement as a release event.
- Admin2 large-library basics are now baseline: search, sort, simple filters, metadata-completeness filters, and `localStorage` state preservation. Pagination or virtual scrolling remains future work.
- Metadata Assistant Phase 1 is now baseline: local `metadata.iFiction.xml` status, upload/replace, import inspection awareness, and preview/apply polish, while package-list completeness filters now use broader metadata/catalog readiness states. Terpwright Phase 1/2 package creation can preserve uploaded local `metadata.iFiction.xml` and manually entered URL/provenance metadata without remote lookup or auto-applying XML fields.
- Continue safe delete/remove design before implementation. Do not add physical package delete until guardrails are reviewed; keep manifest removal distinct from physical package deletion; prefer trash/quarantine before permanent deletion.
- Continue demo package preparation incrementally. Zork I, Zork II, and Zork III are now bundled/demo anchors for the current development tree after Zork II approval, helper-doc polish, `_demo` promotion, and clean DDEV seed verification.
- Add a stable ZILF/ZAPF tooling note or helper later. The current scratch-built ZILF/ZAPF 1.8 executables live under `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/`, but `/tmp` is volatile and `zilf` is not on `PATH`.
- Track Mainframe Zork / Dungeon as a research-only demo candidate. Do not create a playable package or bundle artifacts until source selection, license/provenance, reference transcripts, build/reconstruction path, playback behavior, and helper docs are complete.
- Polish public/demo suite candidates such as Open Adventure / Colossal Cave, Grue, and You Are Standing only when story files, art, helper docs, and license/provenance notes are original or properly licensed. Open Adventure now has a draft, non-featured `_demo` package candidate using an Inform 6 / Z-machine `.z8` port, with native `advent` still treated as a caveated oracle (`115 tests, 2 failures`: `saveresume.1`, `saveresume.3`). Keep it draft until final map/poster art and release-level provenance review are complete.
- Continue Quark2/Typhoon light/dark checks and player shell refinements. Plan Inline Play Mode and terminal-style player themes as roadmap work only; pass future Parchment theme hints only if the bundled/configured Parchment runtime supports them safely.
- Keep docs aligned before new package work around richer Oracle/progressive hints, player placement/boot behavior, content transparency, Grav-compatible tagging/search posture, and a future Admin2 Guide tab.

### v0.5.0 milestone posture

- v0.5.0 is the current coherent public-beta milestone candidate, not a GPM-ready claim.
- Plugin metadata, blueprints, README, CHANGELOG, LICENSE, third-party notices, dependencies, and compatibility should remain internally consistent before tagging.
- Public routes should remain stable: `/if`, `/if/{slug}`, `/if/{slug}/play`, `/if/_engine/parchment`, and `/if/_manifest`.
- Parchment should remain bundled, tracked, documented, and license-noticed.
- Admin2 should remain stable enough for beta use across package create, publish/unpublish, featured toggle, metadata edit, helper Markdown edit, media/screenshots management, story replacement, export, import inspect, draft-only import commit, version visibility, and large-library search/filter/sort basics.
- Demo material should remain credible and conservative: Zork I, Zork II, and Zork III are the reviewed bundled starter anchors; Open Adventure remains draft/non-featured until final art/provenance review; Grue, You Are Standing, Adventure, and other real IF candidates need redistribution review before public-release claims.
- Mainframe Zork / Dungeon may be documented as a research-only candidate, but should not be included in a v0.5.0 candidate bundle unless story/playback/provenance/build/helper docs are clean and the package is separately approved.
- Metadata/iFiction workflows should be clear: local `metadata.iFiction.xml` preview/apply documented, IF Archive path/URL normalization documented, IFDB preview documented as reference-only, IFWiki preview documented as reference-only, and IF Archive file lookup still clearly roadmap unless explicitly implemented.
- Security/destructive boundaries should stay clear: no package delete unless the safe workflow exists, no silent physical file deletion, and import remains non-overwriting and draft-only.
- Run a GPM readiness audit before calling v0.5.0 a submission candidate: blueprints, README, CHANGELOG, LICENSE, third-party notices, no dev-only paths, no accidental test/private artifacts, and a GitHub release/download ZIP sanity check.

- Field-test the current Admin2 package lifecycle: create package, edit metadata, edit helper Markdown, manage media/screenshots, replace story file, export `.terpvault.zip`, inspect import, and import as draft.
- Improve diagnostics or release packaging notes based on that testing.
- Defer new package mutation features until the existing draft-only, non-overwriting workflow has more mileage.
- Design safe package delete/remove before implementing it. The design should distinguish manifest/listing removal from physical folder deletion, require title/slug confirmation, prefer trash/quarantine before permanent delete, preserve audit feedback, and specify behavior for story files, images, screenshots, feelies/extras, helper docs, provenance files, `metadata.iFiction.xml`, and `game.yaml`.
- Continue large-library management for Admin2: add pagination or virtual scrolling; consider items-per-page choices of 25, 50, and 100 if pagination is selected; add richer review-status filters when the manifest exposes those signals; and defer heavy media previews where needed.
- Continue the preview-driven Metadata Assistant and Terpwright Phase 3 ecosystem lookup helpers around local `game.yaml`, package-local or uploaded `metadata.iFiction.xml`, current IF Archive path/URL normalization, current IFDB preview, current IFWiki preview, and the Phase 3e cross-check table. It must never silently overwrite metadata, must keep writes behind existing explicit save/create actions, and must keep license/provenance review distinct from story-file/package download.
- Design future Metadata Assistant source providers as back-end-configurable definitions. Known/preconfigured providers may include local iFiction XML, IFDB, IFWiki, and IF Archive, with provider id, display label, enabled/disabled state, lookup method/type, base URL/API endpoint, rate-limit/caching notes, attribution/license notes, field mappings, and confidence/scoring notes.
- Keep remote metadata lookup explicit and admin-triggered. Do not run remote providers during import inspection, import commit, package creation, manifest load, or metadata save.
- Treat future IFDB/IFWiki/IF Archive package-builder work as draft-only and license-aware: pasted URLs may seed metadata where allowed, but story files/assets should only be staged when legally and directly available.
- Terpwright Phase 1 local-file package building, Phase 2 manual metadata/provenance URL capture, Phase 3a/3b ecosystem preview with IF Archive URL/path normalization, Phase 3c IFDB metadata preview, Phase 3d IFWiki metadata preview, and Phase 3e metadata cross-check are now implemented for draft-oriented Admin2 workflows. Keep package-zip inspection/import on the existing import path. Future Phase 3 work should continue with validation integration and richer review-status workflow.
- Do not implement scraping, AI metadata generation, remote story/package download, automatic asset download, automatic publication, or catalog-over-package metadata replacement as part of future Phase 3 work.
- Polish public library/detail/play rendering across light and dark Grav themes, with Quark2 and Typhoon as explicit verification targets.
- Explore first-class future Ink package support as a complementary choice-based interactive narrative format, without disturbing current Z-code/Parchment playback.
- Keep Zork II in `_demo` and re-run route/checksum checks if package files, install behavior, or demo installer behavior change. The repaired artifact verifies under normal dfrotz output to `400/400` in `372` moves, passed export/import smoke, passed final package audit, and passed clean DDEV seed verification. Keep reviewing both source patches in provenance: `DREARY-ROOM-FCN` for ZILF compatibility and the `FANTASIES` table-counter repair for the normal-output balloon descent crash.

## Player and format roadmap position

- Current supported playback path: parser IF packages served to bundled Parchment under `/if/_engine/parchment`, with Parchment tracked as a required runtime dependency under `assets/vendor/parchment/`.
- Near-term polish: make the TerpVault player shell more theme-aware around the existing iframe, using CSS variables, `prefers-color-scheme` fallbacks, and carefully tested fullscreen behavior.
- Future player placement should allow selected game detail pages to embed the player directly on `/if/{slug}`. The existing focused `/if/{slug}/play` page should remain supported for users and themes that prefer a separate play surface.
- Candidate player controls should support global and per-package defaults without forcing public controls: `player.placement: focused | inline | inline_autostart`, `player.boot: autoload | manual`, `player.theme: default | retro-terminal | cit101 | green-screen | amber-crt | light-paper | parchment-classic`, and inline options such as height/fullscreen.
- When the user clicks Play from `/if/{slug}` and lands on `/if/{slug}/play`, the focused page should ideally load Parchment ready at the prompt without a redundant second Play click unless a technical or accessibility reason requires manual boot.
- Admin should be able to choose a default player theme, and public pages should be able to hide the theme picker or launch controls when configured.
- Player theme presets should include the current default, a CIT101-style pale blue terminal, green monochrome, amber/orange monochrome, and a retro terminal option. Scanline/CRT treatment should be optional, never forced.
- Accessibility and readability must be part of the design: sufficient contrast, reduced-motion handling, scanline/CRT toggle behavior, font fallbacks, and readable chrome across parent light/dark themes.
- Theme CSS should stay scoped to the TerpVault/Parchment shell. Before implementation, document Parchment iframe/internal styling limits and verify behavior with bundled and external Parchment URLs.
- Future format expansion: Ink should be planned as a first-class choice-based/narrative scripting package family, likely through compiled Ink JSON and `inkjs` or a TerpVault-hosted web player in a later build.
- Ink is complementary to Z-machine, Glulx, TADS, Inform parser works, Parchment, Quixe, and other parser-focused adapters. It should not be described as a replacement for parser IF support.
- Ink may be explored around the v0.5.0 era as roadmap/demo planning, but it is not required for v0.5.0 unless the package format, runtime adapter, validation path, and documentation are ready.
- Any Ink element included before v0.5.0 should be clearly experimental and separate from parser/Parchment support. Do not add `inkjs` or another Ink runtime until implementation is intentionally scoped.
- Interactive Grav page concepts such as "Enter the Vault", "The Archivist's Tour", and a beginner guided IF introduction remain roadmap-only.

## Frontend experience roadmap position

- Oracle/progressive hints: future hint/help UX layered into the existing Help & Reference section. Preserve `resources.hints: hints.md` and normalize richer package-local sources into `Section -> Question -> Hint steps`. Ink-guided hints are future/complementary.
- Player presentation: future gameplay presentation UX around player placement, boot behavior, and CSS-based terminal themes. Preserve `/if/{slug}/play`.
- Content transparency: future catalog discovery UX around neutral `tags`, `content_notes`, `theme_notes`, and `audience` guidance. Do not hide, block, endorse, or morally rank works by default.
- Admin2 Guide/Help tab: future in-product documentation UX with a short tab label such as `Guide`, `Help`, or `Help & Docs`; read-only, local, and separate from Settings/contextual field help.

## Packaging posture

TerpVault v0.5.0 is the current early public-beta milestone candidate, not a GPM-ready claim. Future v0.5.x work should stay incremental and conservative. Before any future GPM-ready package, keep real IF starter packages development-only unless redistribution review is complete for every story file, cover, helper document, and metadata source.

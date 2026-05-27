# TerpVault Next Build Notes

TerpVault is in an early public-beta foundation phase. Public routes and bundled Parchment playback are established, while the Admin2 Library Manager remains experimental, opt-in, and disabled by default.

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
- `metadata.iFiction.xml` upload/replace is not implemented.
- Remote IFDB, IFWiki, IF Archive, or other catalog lookup/import is not implemented.
- Admin2 search, filters, sorting controls, pagination, and virtual scrolling are not implemented.
- Named save slots and server-side saves are not implemented.
- Public frontend routing and Parchment/player behavior should stay unchanged during Admin2 work.

## Candidate next work

### v0.4.x incremental path

- Keep v0.4.x focused and incremental rather than treating every small improvement as a milestone release.
- Use v0.4.x for Admin2 large-library basics: search, sort, simple filters, metadata-completeness filters, `localStorage` state preservation, and eventually pagination or virtual scrolling.
- Use v0.4.x for Metadata Assistant Phase 1 work: better local `metadata.iFiction.xml` status, safe upload/replace planning or implementation, preview/apply polish, and package creation/import awareness where practical.
- Continue safe delete/remove design before implementation. Do not add physical package delete until guardrails are reviewed; keep manifest removal distinct from physical package deletion; prefer trash/quarantine before permanent deletion.
- Continue demo package preparation incrementally. Zork II and Zork III remain candidates until legal/provenance/build/playback/package docs are clean.
- Polish public/demo suite candidates such as Adventure / Colossal Cave, Grue, and You Are Standing only when story files, art, helper docs, and license notes are original or properly licensed.
- Continue Quark2/Typhoon light/dark checks and player shell refinements. Pass future Parchment theme hints only if the bundled/configured Parchment runtime supports them safely.

### v0.5.0 milestone concept

- Treat v0.5.0 as a coherent public milestone and possible GPM-readiness/submission candidate, not just another small feature release.
- v0.5.0 should mean the plugin metadata, blueprints, README, CHANGELOG, LICENSE, third-party notices, dependencies, and compatibility are GPM-friendly and internally consistent.
- Public routes should be stable: `/if`, `/if/{slug}`, `/if/{slug}/play`, `/if/_engine/parchment`, and `/if/_manifest`.
- Parchment should remain bundled, tracked, documented, and license-noticed.
- Admin2 should be stable enough for beta use across package create, metadata edit, helper Markdown edit, media/screenshots management, story replacement, export, import inspect, draft-only import commit, version visibility, and any completed large-library search/filter/sort basics.
- Demo material should be credible and conservative: Zork I fully bundled and verified; Zork II/Zork III added only if provenance/build/playback/helper docs are clean; Adventure / Colossal Cave, Grue, and You Are Standing polished only if included; no questionable historical/commercial assets; helper docs original or properly licensed.
- Metadata/iFiction workflows should be clear: local `metadata.iFiction.xml` preview/apply documented, and remote IFDB/IFWiki/IF Archive lookup still clearly roadmap unless explicitly implemented.
- Security/destructive boundaries should stay clear: no package delete unless the safe workflow exists, no silent physical file deletion, and import remains non-overwriting and draft-only.
- Run a GPM readiness audit before calling v0.5.0 a submission candidate: blueprints, README, CHANGELOG, LICENSE, third-party notices, no dev-only paths, no accidental test/private artifacts, and a GitHub release/download ZIP sanity check.

- Field-test the current Admin2 package lifecycle: create package, edit metadata, edit helper Markdown, manage media/screenshots, replace story file, export `.terpvault.zip`, inspect import, and import as draft.
- Improve diagnostics or release packaging notes based on that testing.
- Defer new package mutation features until the existing draft-only, non-overwriting workflow has more mileage.
- Design safe package delete/remove before implementing it. The design should distinguish manifest/listing removal from physical folder deletion, require title/slug confirmation, prefer trash/quarantine before permanent delete, preserve audit feedback, and specify behavior for story files, images, screenshots, feelies/extras, helper docs, provenance files, `metadata.iFiction.xml`, and `game.yaml`.
- Design large-library management for Admin2: search by title, slug, author, format, engine, tags, status, year, IFID, catalog, and provenance/source fields; filters for metadata completeness and review status; sorting by title, author, year, format/engine, status, modified, and added; pagination or virtual scrolling; items-per-page choices of 25, 50, and 100; and `localStorage` state preservation.
- Plan the preview-driven Metadata Assistant around local `game.yaml`, package-local or uploaded `metadata.iFiction.xml`, and later explicit IFDB/IFWiki/IF Archive lookup. It must never silently overwrite metadata, must back up `game.yaml`, and must keep license/provenance review distinct from story-file/package download.
- Treat future IFDB/IFWiki/IF Archive package-builder work as draft-only and license-aware: pasted URLs may seed metadata where allowed, but story files/assets should only be staged when legally and directly available.
- Polish public library/detail/play rendering across light and dark Grav themes, with Quark2 and Typhoon as explicit verification targets.
- Explore first-class future Ink package support as a complementary choice-based interactive narrative format, without disturbing current Z-code/Parchment playback.

## Player and format roadmap position

- Current supported playback path: parser IF packages served to bundled Parchment under `/if/_engine/parchment`, with Parchment tracked as a required runtime dependency under `assets/vendor/parchment/`.
- Near-term polish: make the TerpVault player shell more theme-aware around the existing iframe, using CSS variables, `prefers-color-scheme` fallbacks, and carefully tested fullscreen behavior.
- Future format expansion: Ink should be planned as a first-class choice-based/narrative scripting package family, likely through compiled Ink JSON and `inkjs` or a TerpVault-hosted web player in a later build.
- Ink is complementary to Z-machine, Glulx, TADS, Inform parser works, Parchment, Quixe, and other parser-focused adapters. It should not be described as a replacement for parser IF support.
- Ink may be explored around the v0.5.0 era as roadmap/demo planning, but it is not required for v0.5.0 unless the package format, runtime adapter, validation path, and documentation are ready.
- Any Ink element included before v0.5.0 should be clearly experimental and separate from parser/Parchment support. Do not add `inkjs` or another Ink runtime until implementation is intentionally scoped.
- Interactive Grav page concepts such as "Enter the Vault", "The Archivist's Tour", and a beginner guided IF introduction remain roadmap-only.

## Packaging posture

TerpVault v0.4.x remains an incremental early public-beta line. TerpVault v0.5.0 is the first planned point where the project may be evaluated as a GPM-readiness/public milestone candidate. Before any future GPM-ready package, keep real IF starter packages development-only unless redistribution review is complete for every story file, cover, helper document, and metadata source.

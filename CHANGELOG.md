# v0.3.1

## 05/23/2026

1. Improved
    - Import commit now forces imported packages to `terpvault.featured: false` in addition to draft status.
    - Empty imported list-like fields are normalized to `[]` for `identification.ifids`, `resources.screenshots`, and `terpvault.tags` when they are empty or null.
    - Admin2 import success messaging now tells curators to review metadata, helper docs, media, story file, license/provenance, and publish only when ready.
    - Export download object URLs are revoked after a short delay for broader browser safety.

2. Safety
    - Import remains draft-only and non-overwriting.
    - Non-empty imported list-like metadata is preserved.

# v0.3.0

## 05/23/2026

1. New
    - Added safe Admin2 import commit/install for validated `.terpvault.zip` packages.
    - Added controller-style `POST /terpvault/packages/import`.
    - Extended the Admin2 Inspect Import panel with a final slug field and Commit Import as Draft action after a clean inspection.

2. Safety
    - Import commit reopens and revalidates the uploaded zip server-side; it does not trust the browser's previous inspection response.
    - Imported packages are staged in temporary storage first, then installed into the configured games directory only after full validation succeeds.
    - Final import slugs are required, validated, and rejected on destination collision; existing package folders are never overwritten.
    - Imported `game.yaml` is rewritten with `id`, `slug`, and `terpvault.status: draft` while preserving unknown fields where practical.
    - Package delete, overwrite/replace, public routing, and player behavior remain out of scope.

# v0.2.9

## 05/23/2026

1. New
    - Added import inspection for uploaded `.terpvault.zip` packages without installing them.
    - Added controller-style `POST /terpvault/packages/import/inspect`.
    - Added an Admin2 Inspect Import panel that reports candidate slug, title, story file, warnings, fatal errors, ignored cruft, included files, iFiction XML presence, and slug collision status.

2. Safety
    - Import inspection stages the uploaded zip in temporary storage only and never moves files into `user/data/terpvault/games`.
    - Zip entries are validated for traversal, absolute paths, URI schemes, null bytes, package containment after the top folder is stripped, required `game.yaml`, required `resources.story_file`, and allowlisted story/media/helper references.
    - macOS and Windows cruft is ignored before top-level package folder analysis.
    - Import commit/install, package creation from imports, package delete, public routing, and player behavior remain out of scope.

# v0.2.8

## 05/23/2026

1. New
    - Added authenticated Admin2 package export for a single TerpVault package.
    - Added controller-style `GET /terpvault/packages/{slug}/export` for downloading `{slug}.terpvault.zip`.
    - Added an Admin2 Export action on each package row.

2. Safety
    - Exports use one top-level zip folder named after the package slug.
    - Export contents are limited to `game.yaml`, referenced package resources, `metadata.iFiction.xml` when present, and safe conventional cover/screenshot/helper files.
    - Backup, lock, temp, hidden cruft, macOS metadata, Windows metadata, unrelated files, traversal paths, absolute paths, URI paths, and files outside the package directory are excluded or rejected.
    - Package import, import inspect, import commit, package delete, public routing, and player behavior remain out of scope.

# v0.2.7

## 05/22/2026

1. New
    - Added a limited opt-in Admin2 Package Creation Wizard.
    - Added controller-style `POST /terpvault/packages` for creating a new package folder with starter `game.yaml`, one initial story file, and starter helper Markdown files.
    - Added an Admin2 Create Package panel that collects required package fields and uploads the initial story file.

2. Safety
    - Package creation rejects existing package folders and accepts only lowercase URL-safe slugs.
    - Initial story uploads use the same story-file extension allowlist as Story File Manager Lite.
    - Created files are limited to the new package folder, with best-effort cleanup if creation fails partway through.
    - Package delete, import/export, arbitrary file browsing, `metadata.iFiction.xml`, and player behavior remain out of scope.

# v0.2.6

## 05/22/2026

1. New
    - Added a limited opt-in Admin2 Story File Manager Lite for existing packages.
    - Added controller-style `GET /terpvault/packages/{slug}/story` and `POST /terpvault/packages/{slug}/story` handlers.
    - Added an Admin2 Story File section showing current `resources.story_file`, existence, extension, and size.
    - Added a single package-local story-file replacement upload control.

2. Safety
    - Story uploads are limited to `z3`, `z4`, `z5`, `z6`, `z7`, `z8`, `zblorb`, `zlb`, `ulx`, `gblorb`, `glb`, and `t3`.
    - Uploaded story filenames are normalized to lowercase URL-safe package-local names.
    - Existing registered story files are backed up when present before `resources.story_file` is changed.
    - Story-file writes use same-directory temp files and atomic rename, then update only `resources.story_file` with unknown `game.yaml` fields preserved.
    - Package delete, import/export, arbitrary file browsing, `metadata.iFiction.xml`, and player behavior remain out of scope.

# v0.2.5

## 05/22/2026

1. Improved
    - Added screenshot ordering and remove-from-package controls to Admin2 Media Manager Lite.
    - Added replacement upload controls for individual registered screenshots.
    - Added `PATCH /terpvault/packages/{slug}/media/screenshots` for updating `resources.screenshots` without deleting image files.

2. Safety
    - Screenshot reorder/remove operations accept only paths already registered in `resources.screenshots`.
    - Screenshot replacement accepts only an existing registered screenshot path or index and keeps replacement uploads package-local.
    - Duplicate screenshot entries are prevented when the same screenshot filename is uploaded again.
    - Physical screenshot deletion, arbitrary file browsing, story-file upload, package delete, import, and export remain out of scope.

# v0.2.4

## 05/22/2026

1. New
    - Added a limited opt-in Admin2 Media Manager Lite for package cover art and screenshots.
    - Added controller-style `GET /terpvault/packages/{slug}/media` and `POST /terpvault/packages/{slug}/media/{type}` handlers.
    - Added Admin2 upload controls for replacing cover art, replacing small-cover art, and adding screenshots.

2. Safety
    - Media uploads are limited to package-local `jpg`, `jpeg`, `png`, and `webp` image files; SVG is intentionally not allowed.
    - Cover and small-cover uploads normalize filenames to `cover.{ext}` and `small-cover.{ext}`.
    - Screenshot uploads are stored under `screenshots/` and added to `resources.screenshots` after the file write succeeds.
    - Existing replaced media files receive timestamped package-local backups, and `game.yaml` is updated with unknown fields preserved.
    - Story files, arbitrary file browsing, package delete, package import/export, `metadata.iFiction.xml`, and player config remain out of scope.

# v0.2.3

## 05/22/2026

1. New
    - Added opt-in Admin2/API editing for package-local helper Markdown files: `how-to-play.md`, `hints.md`, and `walkthrough.md`.
    - Added controller-style `GET /terpvault/packages/{slug}/markdown/{type}` and `PATCH /terpvault/packages/{slug}/markdown/{type}` handlers for the allowlisted helper types.
    - Added a plain textarea Helper Docs editor inside the existing Admin2 package editor.

2. Safety
    - Helper Markdown writes validate slug, helper type, package containment, Markdown extension, and path traversal before touching files.
    - Existing helper Markdown files receive timestamped package-local backups before replacement and are written via same-directory temp files with atomic rename.
    - Story files, covers, screenshots, `metadata.iFiction.xml`, player config, upload, delete, import, export, and package creation remain out of scope.

# v0.2.2

## 05/22/2026

1. New
    - Added the first opt-in Admin2 metadata editor UI for existing TerpVault package `game.yaml` manifests.
    - Added per-package Edit Metadata actions that load the v0.2.1 metadata API, show whitelisted editable fields, and PATCH updates back to `/api/v1/terpvault/packages/{slug}/metadata`.
    - Added read-only display for package slug, story file, cover art, screenshots, helper Markdown paths, and player settings inside the editor.

2. Safety
    - The editor preserves unsaved form values when API saves fail.
    - Upload, delete, import, export, package creation, story-file edits, artwork edits, helper Markdown edits, and player settings remain out of scope.
    - Public routing and Parchment/player behavior remain unchanged.

# v0.2.1a

## 05/22/2026

1. New
    - Added backend-only Admin2/API metadata routes for existing package `game.yaml` files.
    - Added controller-style `GET /terpvault/packages/{slug}/metadata` and `PATCH /terpvault/packages/{slug}/metadata` handlers.
    - Added a package metadata service with strict slug validation, base-path containment checks, whitelisted metadata merging, timestamped backups, lock-file coordination, same-directory temp writes, and atomic rename.

2. Security
    - Metadata API routes are registered only when `admin.enable_admin2_page` is enabled.
    - Metadata API access is limited to users with `admin.super` or `api.super`.
    - Package slug/folder names, story files, cover art, screenshots, helper Markdown paths, player config, imports, exports, uploads, deletes, and package creation remain read-only/out of scope.

3. Notes
    - No Admin2 edit UI was added in this backend-only pass.
    - No Closure request handlers were added to API route registration.
    - Public routes and Parchment/player behavior remain unchanged.

# v0.2.0

## 05/22/2026

1. New
    - Added an opt-in, read-only Admin2 Library Manager page for installed TerpVault packages.
    - The Admin2 page lists package title, slug, format, status, story-file presence, warning/error counts, advisory warnings, public Detail/Play links, and provenance/license summaries where available.
    - Embedded read-only package data in the Admin2 page definition when Admin2 exposes it, with a fallback to the existing public read-only manifest route.

2. Changed
    - Removed Admin2 component calls to disabled TerpVault API endpoints so the opt-in page can load without fatal API route errors.
    - Kept `admin.enable_admin2_page: false` as the default.
    - Bumped the plugin blueprint version to `0.2.0`.

3. Fixed
    - Registered read-only Admin2 sidebar/page discovery events whenever `admin.enable_admin2_page` is enabled, instead of requiring early URI detection to identify the request as API.
    - Removed an over-strict `admin.super` sidebar filter so Admin2 can decide page visibility for authenticated Admin2 users.

4. Notes
    - No editing, upload, delete, import, export, or file mutation workflows were added.
    - No Admin2 API endpoints were enabled; controller-style API integration remains future work.
    - Public routes and Parchment/player behavior remain unchanged.

# v0.1.20

## 05/22/2026

1. Documentation
    - Added release-readiness guidance covering install/update checks, public route verification, starter-package policy, and GPM packaging expectations.
    - Added a README Known Limitations section that distinguishes stable public routes from disabled Admin2/API work.
    - Clarified that real IF starter packages are development/demo material unless redistribution review is completed.
    - Documented that `sample-cave` is the public-safe original structure demo and not a playable game.
    - Standardized cache command examples on `bin/grav clearcache`.
    - Tightened release hygiene ignores and binary attributes for generated image sources and supported story-file formats.

2. Notes
    - No new starter packages or import/export code were added.
    - Routing, Admin2/API integration, and Parchment/player behavior remain unchanged.

# v0.1.19

## 05/22/2026

1. New
    - Added `you-are-standing` and `grue` real starter packages under `_demo/data/terpvault/games`.
    - Bundled playable Z-code story files with Treaty/iFiction-aligned `game.yaml` manifests, IFIDs, catalog links, source notes, license notes, and generated placeholder cover art.
    - Added curator-created how-to-play and hint notes for both new starter packages.

2. Documentation
    - Updated starter-library notes with package provenance and licensing rationale.
    - Updated README starter install instructions for the multi-game demo library.
    - Clarified that generated placeholder art is appropriate when original cover rights are unclear.

3. Notes
    - No import/export code was added.
    - Routing, Admin2/API integration, and Parchment/player behavior remain unchanged.

# v0.1.18

## 05/22/2026

1. Documentation
    - Added canonical TerpVault package conventions covering required files, recommended files, directory layout, and package creation checks.
    - Documented the manual package import workflow for `user/data/terpvault/games/{slug}`.
    - Documented how Inform release conventions, Treaty/iFiction metadata, IFIDs, IFDB, IFWiki, and IF Archive references map into `game.yaml`.
    - Added a future `.terpvault.zip` package convention and Admin2 import/export roadmap note.

2. Notes
    - No runtime import/export code was added in this pass.
    - Routing, Admin2/API integration, and Parchment/player behavior remain unchanged.

# v0.1.17

## 05/21/2026

1. Improved
    - Clarified package warning labels so public/detail completeness notes are curator-friendly.
    - Kept missing story-file data as the only error-level validation condition.
    - Added provenance row helpers and improved Catalog & Provenance rendering to hide empty fields and show source/license notes clearly.
    - Added a calm Package Notes section for advisory completeness checks on detail pages.

2. Documentation
    - Updated package validation docs and README wording to describe advisory provenance, artwork, helper-file, IFID, license, and redistribution checks.

3. Fixed
    - Quoted toggle option labels in the plugin blueprint so Grav Admin/Admin2 renders `Yes` / `No` and `Enabled` / `Disabled` instead of YAML boolean values.

# v0.1.16

## 05/21/2026

1. Improved
    - Clarified the public player save/restore note for bundled Parchment playback.
    - Added Parchment save/restore documentation that treats interpreter-native `SAVE` / `RESTORE` as the current baseline.

2. Notes
    - No custom TerpVault save-slot UI was added in this pass.
    - Routing, Admin2/API integration, and the Parchment iframe contract remain unchanged.

# v0.1.15

## 05/21/2026

1. Improved
    - Polished public library cards with denser package-style layout, tighter spacing, and better responsive grid behavior.
    - Improved detail page hierarchy, cover treatment, screenshots, package help accordions, and Catalog & Provenance styling.
    - Improved the play page and player shell spacing so the interpreter frame is the visual focus.
    - Added public CSS variables for easier theme customization.
    - Adjusted public component surfaces to inherit theme colors and remain readable in common dark-mode themes.
    - Updated public button and link accent styling to prefer active theme variables instead of TerpVault-specific brown/gold defaults.
    - Tightened primary button contrast in light themes and improved nested help-details padding.
    - Increased primary button link selector specificity so anchor buttons keep reversed text in their default state.
    - Kept primary button text white in dark themes as well as light themes.
    - Improved TADS format labels by inferring TADS 2 / TADS 3 from story-file extensions when available.

2. Notes
    - Public routes and base-route-aware URL helpers remain unchanged.
    - Admin2/API integration remains disabled by default and API route registration remains off.

# v0.1.12

## 05/21/2026

1. Fixed
    - Stop overriding Grav's frozen `page` service for TerpVault virtual routes.
    - Register TerpVault library/detail/play pages with Grav's page collection instead of replacing `grav[page]`.
    - Add request-context guards so TerpVault frontend routing cannot interfere with Admin/Admin2/API screens.
    - Register Admin2 sidebar/page/API hooks only when `admin.enable_admin2_page` is enabled and the request is in Admin2/API context.
    - Normalize subdirectory request paths before matching public routes, preserving installs such as `/grav2-fullsite-skeleton/if` and `/quark2/if`.
    - Run frontend virtual page registration early during `onPagesInitialized` so Grav can resolve `/if` routes from the page collection before falling through to 404.
    - Keep Admin2 API route registration disabled for now instead of passing Closure handlers to the API route collector.

2. Changed
    - Keep the experimental Admin2 Library Hub scaffold disabled by default while the public TerpVault routes remain enabled.


# v0.1.11

## 05/21/2026

1. Fixed
    - Move TerpVault virtual page installation from `onPagesInitialized` to `onPageInitialized` to avoid Grav 2/Admin2 `Cannot override frozen service "page"` errors in newer builds.

# v0.1.10

## 05/21/2026

1. New
    - Added `GamePackage::warnings()`, `warningCount()`, `metadataSummary()`, and `catalogLinks()` helpers for Admin/API use.
    - Added advisory package validation for missing story files, IFIDs, cover/small-cover art, source/provenance, license notes, and helper Markdown files.
    - Added package warning badges and expandable warning details to the Admin2 Library Hub scaffold.
    - Added a `player.launch_mode` configuration placeholder for future button/autostart behavior.

2. Documentation
    - Added `docs/PACKAGE-VALIDATION.md` for validation codes and severity meanings.
    - Added `docs/ROUTING.md` documenting base-route-safe URL expectations and a grep check for hardcoded `/if` links.

# v0.1.9

## 05/21/2026

1. Improved
    - Adopted a Treaty of Babel / iFiction-aligned `game.yaml` structure while keeping older flat fields as compatibility aliases.
    - Added IFID list support through `identification.ifids`.
    - Added catalog/provenance fields for IFDB, IFWiki, IF Archive, source, license, and redistribution notes.
    - Added optional `metadata.iFiction.xml` placeholder support in the Adventure starter package.
    - Added catalog/provenance display on game detail pages.
    - Updated frontend wording to be more interpreter-format agnostic instead of implying only Z-code content.

2. Documentation
    - Added `docs/ECOSYSTEM-METADATA.md` explaining how TerpVault maps friendly YAML to Treaty/iFiction, IFID, IFDB, IFWiki, and IF Archive concepts.
    - Updated README package examples to prefer the structured metadata layout.

# v0.1.8

## 05/21/2026

1. Bugfixes
    - Restored a small whitelist of package-local HTML after Parsedown safe mode so `<details>` and `<summary>` blocks render as collapsible spoiler sections instead of visible text.
    - Preserved Markdown safe-mode behavior for other raw HTML while allowing TerpVault hint/walkthrough disclosure widgets.

# v0.1.6

## [0.1.7] - 2026-05-21

### Fixed
- Fixed the TerpVault global `terpvault.route` value so breadcrumb links respect Grav installations in a subdirectory such as `/quark2`.


## 05/21/2026

1. [](#bugfix)
    * Improved the fallback package Markdown renderer so local help files can render safe `<details>` / `<summary>` disclosure blocks instead of showing the tags as text.
    * Added inline-code formatting support to the fallback renderer for command examples such as `LOOK`, `SAVE`, and `RESTORE`.

# v0.1.5

## 05/21/2026

1. New
    - Added an Admin2 Library Hub scaffold as a full component page with Library, Formats, and Settings tabs.
    - Added collapsible Admin2 game-package rows with stored expand/collapse state in localStorage.
    - Added `/terpvault/status` API endpoint for storage/config diagnostics and supported format discovery.
    - Added a cleaned Adventure starter package under `_demo/data/terpvault/games/adventure`.
    - Added Inform release compatibility documentation.

2. Improved
    - Registered Admin2/API hooks outside the `isAdmin()`-only branch so API-driven sidebar discovery can see TerpVault.
    - Aligned package art naming with Inform-style `cover` and `small_cover` concepts.
    - Kept `thumbnail` as a backward-compatible alias while preferring `small_cover` for new packages.
    - Added auto-detection for common Inform cover filenames such as `Cover.jpg` and `Small Cover.jpg`.
    - Broadened story-file extension allow-list for Parchment-supported formats: Z-code, Glulx, Hugo, TADS, and ADRIFT 4.
    - Rendered game descriptions through the plugin Markdown helper instead of plain `nl2br`.

3. Notes
    - The Admin2 Library Hub is still read-only. Create/edit/upload/import actions are planned for the next implementation pass.
    - The Adventure starter package includes provenance notes and should be verified before broad public redistribution.

# v0.1.4

## 05/21/2026

1. Fixed
    - Added an extension-bearing protected story route (`/_story/{slug}/{filename}`) for browser interpreters.
    - Hardened absolute URL generation to avoid duplicated Grav base paths such as `/quark2/quark2`.

2. Changed
    - Parchment now receives the `_story` route instead of the legacy `_file` route.

# v0.1.3
## 05/21/2026

1. New
    - Bundled the Parchment 2025.1.14 single-file web build as `assets/vendor/parchment/index.html`.
    - Added a controlled `/if/_engine/parchment` route for loading the bundled interpreter instead of relying on direct web-server access to plugin files.
    - Added vendor notices for the bundled Parchment adapter.

2. Improved
    - TerpVault now passes Parchment a JSON `story=` object containing `url`, `format`, and `title`, rather than a bare URL. This lets Parchment identify Z-code/Glulx/TADS/Hugo/ADRIFT formats even though TerpVault story-file routes do not expose file extensions.
    - Kept the interpreter layer adapter-based so future engines can be added without rewriting the library/detail/package system.

3. Notes
    - The bundled `sample-cave` story file is still a placeholder and is not playable. Add a real legal story file to test live gameplay.
    - Added the missing demo screenshot referenced by `sample-cave/game.yaml`.

# v0.1.2
## 05/21/2026

1. Improved
    - Added `thumbnail` artwork support for library cards, with automatic fallback to `cover`.
    - Changed library card media to a compact cropped 16:9 presentation so tall cover art does not dominate the library grid.
    - Updated the sample package with separate `thumbnail.svg`, `cover.svg`, and `splash.svg` assets.

2. Documentation
    - Added Parchment bundling notes and third-party notice placeholders.
    - Added starter-library guidance for Adventure/Colossal Cave, Scott Adams conversions, and Zork source/import workflow.

3. Notes
    - The actual Parchment web build is still not bundled in this zip. Add the release build under `assets/vendor/parchment/` and update third-party notices before distributing it as bundled.

# v0.1.1
## 05/21/2026

1. Bug Fixes
    - Fixed generated TerpVault game URLs and asset URLs when Grav is installed in a subdirectory such as `/quark2`.
    - Replaced direct `$grav['parsedown']` usage with a Grav 2-safe Markdown rendering helper and safe fallback renderer.

2. Notes
    - Parchment remains an external/adapter dependency and is not bundled in this package yet.

# v0.1.0
## 05/21/2026

1. [](#new)
    * Initial TerpVault plugin foundation.
    * Added package-folder model using `user/data/terpvault/games/{slug}/game.yaml`.
    * Added virtual library, detail, and play pages under `/if`.
    * Added controlled story-file and package-asset serving routes.
    * Added cover, splash, screenshot, hints, walkthrough, and how-to-play support.
    * Added simple native `[terpvault game="slug"]` embed pattern.
    * Added Admin2 sidebar/page scaffold with read-only package discovery.
    * Added Parchment adapter placeholder.
    * Added demo package structure.

2. [](#improved)
    * Designed player layer as an adapter rather than hard-coding one interpreter forever.

3. [](#todo)
    * Bundle or document a local Parchment install workflow.
    * Add Admin2 upload/edit/import UI.
    * Add save-slot UX.
    * Add iFiction/Treaty of Babel metadata support.

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

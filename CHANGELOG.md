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

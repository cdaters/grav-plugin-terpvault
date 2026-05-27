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
- Package overwrite/replace is not implemented.
- Import overwrite is not implemented.
- Arbitrary package file browsing is not implemented.
- `metadata.iFiction.xml` editing is not implemented.
- Named save slots and server-side saves are not implemented.
- Public frontend routing and Parchment/player behavior should stay unchanged during Admin2 work.

## Candidate next work

- Field-test the current Admin2 package lifecycle: create package, edit metadata, edit helper Markdown, manage media/screenshots, replace story file, export `.terpvault.zip`, inspect import, and import as draft.
- Improve diagnostics or release packaging notes based on that testing.
- Defer new package mutation features until the existing draft-only, non-overwriting workflow has more mileage.
- Polish public library/detail/play rendering across light and dark Grav themes, with Quark2 and Typhoon as explicit verification targets.
- Explore first-class future Ink package support as a complementary choice-based interactive narrative format, without disturbing current Z-code/Parchment playback.

## Player and format roadmap position

- Current supported playback path: parser IF packages served to bundled Parchment under `/if/_engine/parchment`, with Parchment tracked as a required runtime dependency under `assets/vendor/parchment/`.
- Near-term polish: make the TerpVault player shell more theme-aware around the existing iframe, using CSS variables, `prefers-color-scheme` fallbacks, and carefully tested fullscreen behavior.
- Future format expansion: Ink should be planned as a first-class choice-based/narrative scripting package family, likely through compiled Ink JSON and `inkjs` or a TerpVault-hosted web player in a later build.
- Ink is complementary to Z-machine, Glulx, TADS, Inform parser works, Parchment, Quixe, and other parser-focused adapters. It should not be described as a replacement for parser IF support.

## Packaging posture

TerpVault is not GPM-ready yet. Before any future GPM-ready package, keep real IF starter packages development-only unless redistribution review is complete for every story file, cover, helper document, and metadata source.

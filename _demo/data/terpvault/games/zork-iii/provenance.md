# Zork III Provenance

This is a bundled TerpVault `_demo` package. It is not official Infocom packaging and should be reviewed under `docs/DEMO-CONTENT-RIGHTS.md` before any broader public/GPM distribution.

## Source

- Upstream repository: https://github.com/historicalsource/zork3.git
- Upstream branch: `master`
- Upstream commit: `3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8`
- License file path in upstream repository: `LICENSE`
- Observed license: MIT License
- Observed copyright line: `Copyright (c) 2025 Microsoft`
- Source/license retrieval date: 2026-05-29
- Upstream license text copied to: `LICENSE-upstream.txt`

## Build

- Scratch source/build path: `/tmp/terpvault-zork3-verify-20260529`
- ZILF executable: `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf`
- ZILF version: `1.8`
- ZAPF executable: `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf`
- ZAPF version: `1.8`

Build commands used in scratch:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf zork3.zil
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork3.zap zork3-release25-serial860811.z3 -r 25 -s 860811
```

Selected package artifact:

- Source-built artifact: `/tmp/terpvault-zork3-verify-20260529/zork3-release25-serial860811.z3`
- Package filename: `zork3.z3`
- SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`
- In-game banner: `Release 25 / Serial number 860811`
- Byte size: 87858 bytes

The selected source-built artifact does not match the upstream prebuilt `COMPILED/zork3.z3` / `zork3.zip` checksum. The upstream prebuilt files both have SHA-256 `b637a242865d059890184164ce8dec28554cc80901dcbf26c740b2d1ed0d4eb8` and the same Release 25 / Serial 860811 file identification.

## Playback Verification

`dfrotz` smoke testing passed on 2026-05-29 against the selected source-built historical-header artifact. The smoke test launched the game, displayed the Release 25 / Serial 860811 banner, accepted `look` and `inventory`, and reached quit confirmation.

A DDEV-only temporary package named `zork-iii-temp` was also tested on 2026-05-29. Host-side checks returned `200` for the library route, detail route, play route, manifest route, story route, and bundled Parchment route. The play page contained a Parchment iframe configured with the `zork3.z3` story route. The host-side story route download matched SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.

After the 2026-05-31 feelies/helper-doc refresh, the manifest route returned `200` and included `zork-iii` as `draft`, the six `resources.feelies` entries, helper doc paths, one expected missing-IFID warning, and no manifest errors. A temporary publish check returned `200` for the detail page, play page, one PDF feelie asset, one JPG feelie asset, and `how-to-play.md`; the story route returned `200` with a 204-byte Grav compiled-cache parse-error response rather than story bytes. The package was restored to `draft` and cache was cleared after that check.

Later on 2026-05-31, after another cache clear, the story route delivery issue did not reproduce. Host-side and DDEV-internal story routes both returned `200 application/octet-stream`, 87858 bytes, with SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`. The earlier 204-byte response matched stale/corrupt Grav compiled-YAML cache errors from unrelated blueprint files, not a TerpVault package metadata/path issue.

## Export/Import Verification

A complete-package export/import smoke test passed on 2026-05-31.

- Export service: `PackageArchiveService` inside the DDEV site.
- Export path inside DDEV container: `/tmp/zork-iii-export-test.terpvault.zip`
- Export size: 18604153 bytes
- Export SHA-256: `c1fe020d7720d096cb1ff4bcb9ed7954e55973febdd717ab8c48b690e0290607`
- Zip hygiene: passed. No `.DS_Store`, `__MACOSX`, AppleDouble, editor backup files, `.bak-*`, lock files, temp files, scratch logs, or source-build files were present.
- Extract scratch path inside DDEV container: `/tmp/zork-iii-export-inspect-20260531`
- Extracted story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`
- Import inspect result: ok
- Import inspect fatal errors: none
- Import inspect warnings: expected source slug collision for `zork-iii` and draft-forcing note
- Imported throwaway slug: `zork-iii-import-test-20260531`
- Imported package path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii-import-test-20260531`
- Imported package status: draft
- Imported story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`
- Imported manifest result: `draft`, `has_story_file: true`, warning count `1`, error count `0`
- Imported temporary publish check: detail, play, story, cover asset, and annual-report feelie routes returned `200`; story route returned `200 application/octet-stream`, 87858 bytes, matching the expected story checksum
- Cleanup decision: `zork-iii-import-test-20260531` was left as a draft throwaway package for inspection

This package still needs final route, Parchment input, and walkthrough transcript verification after package assembly is complete.

## Package Assets

The first-pass package images were copied from:

```text
/Users/cdaters/Downloads/for-Zork3/
```

Files copied:

- `cover.jpg`
- `small-cover.jpg`
- `hero.jpg`
- `01.png` to `screenshots/01.png`
- `02.png` to `screenshots/02.png`

These images are treated as Craig-created/original TerpVault package art and screenshots for this demo package pass. They are not scans or reproductions of historical commercial packaging, manuals, maps, advertisements, logos, trade dress, Invisiclues, or commercial feelies.

## Feelies

The package-local feelies were copied from:

```text
/Users/cdaters/Downloads/for-Zork3/
```

Files copied:

- `Zork 3 - FrobozzCo International Annual Report.pdf` to `feelies/frobozzco-annual-report.pdf`
  - SHA-256: `a470dccd170d208ba957e8a2ce77399f11628eb0ab985352d5ac4b83fbc59ab5`
- `Zork 3 - Shareholder Letter.pdf` to `feelies/shareholder-letter.pdf`
  - SHA-256: `7f9dc53c0d32756030f9b08cf527f38d7eeab6ef7d0229a6ef3ebe1d54e2e89f`
- `Zork 3 - Stock Certificate.pdf` to `feelies/stock-certificate.pdf`
  - SHA-256: `2a2f2ff59658e525ba35a1c1b607ae3f9f9149066707fbd21571740a25893266`
- `Zork 3 - Map.pdf` to `feelies/zork-iii-map.pdf`
  - SHA-256: `588a461158932c977f0fbd4df5dddf0998713f1237d42146a83fb5850f4175bc`
- `Zork 3 - ZUG Map Inside.jpg` to `feelies/zug-map-inside.jpg`
  - SHA-256: `9d453239ea484ee626b39c0021b53efa037a92c29a5039debbd1c7eb527e5f7e`
- `Zork 3 - ZUG Map Outside.jpg` to `feelies/zug-map-outside.jpg`
  - SHA-256: `0b5e0db2504d6592e2d25fe379eb791752bf857827f2ae21c90a43fa5623c845`

These files are package-local Zork III supplemental materials included with package-level provenance for this TerpVault demo package. They should be reviewed and classified item by item before any broader public/GPM distribution. Do not treat the story/source MIT license as covering these feelies unless that status is separately documented.

Current bundled-demo status: included in `_demo` after the final audit and promotion recorded below. Broader redistribution should follow `docs/DEMO-CONTENT-RIGHTS.md`.

## Helper Docs

Package helper docs are original TerpVault writing:

- `how-to-play.md`
- `hints.md`
- `walkthrough.md`

The player-facing docs were revised on 2026-05-31 for readability, progressive hinting, and clearer walkthrough status. Later the same day, the walkthrough route was repaired and verified by transcript against the exact selected artifact. It may be described as a verified full-potential route for this package story file, with the fixed-seed transcript details recorded below.

## Walkthrough Verification

The 2026-05-31 walkthrough rewrite and final route repair used these local route references:

- `/Users/cdaters/Downloads/for-Zork3/zork3.sol1.txt`
- `/Users/cdaters/Downloads/for-Zork3/zork3.sol2.txt`

The two references were compared and adapted into original TerpVault package prose. Route facts were used for command sequencing, but the player-facing explanations were rewritten. No Infocom manual text, Invisiclues text, commercial packaging copy, online walkthrough prose, or fan-guide prose was copied into the package walkthrough.

Final verification:

- Target story path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/zork3.z3`
- Target story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`
- Interpreter: Frotz 2.55 dumb interface
- Interpreter commit: `acf205585a9472d27c07c0fe62da4b8bc89d1ec7`
- Exact command: `/opt/homebrew/bin/dfrotz -p -m -s 41 /Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/zork3.z3 < /private/tmp/zork3-route-working-20260531.txt > /private/tmp/zork3-transcript-working-20260531.txt`
- Scratch route candidate: `/private/tmp/zork3-route-working-20260531.txt`
- Scratch transcript: `/private/tmp/zork3-transcript-working-20260531.txt`
- Scratch debug notes: `/private/tmp/zork3-route-debug-notes-20260531.md`
- Verification date: 2026-05-31
- Route iterations recorded: 15
- Result: ending reached
- Final score: 7 of 7
- Final move count: 330
- Package walkthrough status: verified command route

The verified fixed-seed transcript reaches the Treasury of Zork, triggers the final completion text, and reports `Your potential is 7 of a possible 7, in 330 moves.` The route keeps one harmless early timing-preserving parser response after the lake-can retrieval because removing that turn changes later timed/random scenes and misses the vial. The player-facing `walkthrough.md` now includes the exact verified command route and marks the route as verified for this package artifact.

Post-walkthrough route checks:

- Manifest after cache clear: `200`, `zork-iii` remained `draft`, `walkthrough.md` was present, one expected missing-IFID warning, zero errors.
- Temporary publish check: play route returned `200`, walkthrough asset route returned `200 text/markdown`, and story route returned `200 application/octet-stream`, 87858 bytes, with SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Temporary publish detail route returned `200` with a 224-byte Grav compiled-cache parse-error body from `/cache/compiled/files/7f545128d99067b0c61724e5611ef549.yaml.php`, consistent with the known local Grav compiled-YAML cache issue.
- Package status after testing: restored to `draft`; cache cleared.

## Metadata / IFID Review

Local metadata review on 2026-05-31 initially did not find an authoritative IFID for the selected package artifact.

Commands checked:

```sh
which babel || true
which treaty || true
which rezrov || true
which txd || true
which ztools || true
ls /opt/homebrew/bin | grep -Ei 'babel|ifid|treaty|ztools|txd|infodump|zcode|zork' || true
strings -a /Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/zork3.z3 | rg -n "IFID|UUID|ZCODE|Release|Serial|Zork|ZORK|860811|Infocom|iFiction|Treaty"
```

Observed output:

- `babel not found`
- `treaty not found`
- `rezrov not found`
- `txd not found`
- `ztools not found`
- No matching Homebrew command was found under `/opt/homebrew/bin`.
- Story-string inspection found the serial string `860811`, but no IFID, UUID, iFiction, Treaty, or other authoritative IFID metadata string.

Initial package decisions before remote metadata research:

- IFID found locally: no.
- `game.yaml` update from local-only review: no.
- `metadata.iFiction.xml` from local-only review: no; deferred until an authoritative IFID/catalog source became available.
- Remote metadata lookup: not performed.
- Recommended next step: install or otherwise provide a local Treaty of Babel-compatible extraction tool, or add a TerpVault metadata helper that can authoritatively derive/verify IFIDs for legacy Z-code story files before writing `identification.ifids` or package-local `metadata.iFiction.xml`.

Follow-up public metadata research on 2026-05-31 checked the approved sources:

- IFDB: `https://ifdb.org/viewgame?id=vrsot1zgy1wfcdru`
- IFWiki: `https://www.ifwiki.org/Zork_III`
- IF Archive search/index pages:
  - `https://search.ifarchive.org/search`
  - `https://www.ifarchive.org/indexes/if-archive/infocom/`
  - `https://www.ifarchive.org/indexes/if-archive/infocom/shipped-documentation/`
- Treaty of Babel: `https://babel.ifarchive.org/babel_rev10.html`
- Local story file: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/zork3.z3`
- Verified upstream source repository already documented for this package: `https://github.com/historicalsource/zork3.git`

Accepted metadata:

- IFID: `ZCODE-25-860811`
  - IFDB lists multiple IFIDs for Zork III, including `ZCODE-25-860811`.
  - The local story artifact is Release 25 / Serial 860811.
  - The Treaty of Babel legacy Z-code rule documents pre-1990 Z-code IFIDs as `ZCODE-{release}-{serial}`.
  - IFWiki's main technical box and final-release section currently emphasize Release 17 / Serial 840727 and IFID `ZCODE-17-840727`; that metadata applies to a different Zork III release than this source-built package artifact and was not written into `game.yaml`.
- IFDB TUID: `vrsot1zgy1wfcdru`
- IFDB URL: `https://ifdb.org/viewgame?id=vrsot1zgy1wfcdru`
- IFWiki URL: `https://www.ifwiki.org/Zork_III`
- Authors: Marc Blank and Dave Lebling
- First publication year: 1982
- Language: English
- Format: Z-code / Z-machine, preserved in `game.yaml` as `zcode`

Deferred metadata:

- IF Archive package path/URL was left blank. The checked IF Archive result for Zork III points to shipped documentation (`infocom/shipped-documentation/zork3.txt`), not to this package's selected source-built story artifact.
- Publisher/catalog wording beyond the existing package notes remains for final audit because public sources describe the historical commercial game, while this package uses a 2025 MIT source release and excludes historical commercial assets.

Package updates from this metadata pass:

- `game.yaml` now records `identification.ifids: [ZCODE-25-860811]`.
- `game.yaml` now records IFDB TUID/URL and IFWiki URL.
- `game.yaml` author field now records the verified original authors and keeps the source-release note.
- Package-local `metadata.iFiction.xml` was created with the verified IFID, format, title, author, headline, first publication year, genre, language, and a short original TerpVault description.
- No copied external prose, commercial marketing copy, manual text, Invisiclues text, packaging copy, or long external descriptions were used.
- Post-metadata manifest check: `200`, `zork-iii` remained `draft`, IFID `ZCODE-25-860811` and catalog links were exposed, `metadata.iFiction.xml` was detected, warning count was zero, and error count was zero.
- Temporary publish check after metadata update: detail, play, and story routes returned `200`; story route returned `200 application/octet-stream`, 87858 bytes, with SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Package status after metadata update: restored to `draft`; cache cleared.

## Exclusions

This demo package excludes historical commercial packaging, manuals, maps, ads, logos, trade dress, scans, Invisiclues, clue sheets, `invisicluesiii.mss`, commercial helper files, online walkthroughs, catalog prose, and marketing text unless item-level review later supports inclusion.

## Supplemental Material Classification

Future supplemental materials should be classified in package provenance as one of:

- Story/source license material.
- Craig-created/original package-local material.
- Historical reference/preservation material.
- Uncertain provenance / pending review.

Historical reference/preservation material, if added later, should be identified separately from source-license material and package-local original material. Inclusion should be framed as historical preservation, documentation, research, commentary, and educational context, subject to item-level review; it should not be described as newly licensed, public domain, official, endorsed, copyright-free, or automatically fair use unless that status is specifically documented for the item.

## Rights-Holder Removal Requests / DMCA

If you are a rights holder and believe specific material should not be included, please contact [dmca@retrorealm.org](mailto:dmca@retrorealm.org) with the item name, the location of the material, and the basis for the request. Disputed material will be reviewed promptly and removed or restricted where appropriate.

## Current Package Status

- Bundled `_demo` package path: `_demo/data/terpvault/games/zork-iii`
- Source DDEV package path used for promotion: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii`
- Package status in `_demo`: published
- Featured: false
- Broader public/GPM distribution remains subject to final release packaging and demo-content rights/provenance review.

## Final Audit

Audit date: 2026-05-31.

Final audit result: passed for Craig approval review and later `_demo` promotion planning. The package remains `draft` and has not been copied to `_demo`.

Story artifact:

- Package story path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/zork3.z3`
- SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`

Metadata and manifest:

- `game.yaml` parsed successfully with DDEV PHP/YAML.
- `metadata.iFiction.xml` validated with `xmllint --noout`.
- Final draft manifest request returned `200`, 90859 bytes.
- Manifest entry for `zork-iii`: `status: draft`, `has_story_file: true`, IFID `ZCODE-25-860811`, `metadata.iFiction.xml` detected, resources present for story, cover, small cover, hero, screenshots, helper docs, and six feelies.
- Manifest warnings: 0.
- Manifest errors: 0.

File inventory and cruft:

- Expected package files were present: `game.yaml`, `zork3.z3`, `LICENSE-upstream.txt`, `provenance.md`, `metadata.iFiction.xml`, helper docs, cover/small-cover/hero images, screenshots, and six feelies.
- Stale local backup cruft was found during audit and removed from the DDEV-only package: `cover.jpg.bak-20260528-195533`, multiple `game.yaml.bak-*` files, `hero.jpg.bak-20260528-195554`, `small-cover.jpg.bak-20260528-195603`, and screenshot `.bak-*` files.
- Post-cleanup cruft check found no `.DS_Store`, `__MACOSX`, AppleDouble, editor backup, temp, swap, or lock files.
- Image assets were recognized by `file` as JPEG or PNG images.
- PDFs were recognized by `file` as PDF documents. `frobozzco-annual-report.pdf` was reported by `file` as a PDF with `0 pages`; a string-level check showed page objects and a final `/Count 9`, so this is recorded as a local file-identification quirk rather than an audit blocker.
- Helper docs, upstream license, provenance, and iFiction metadata files are non-empty.

Final route/playback recheck:

- The package was temporarily set to `published` only for public route checks, then restored to `draft` and cache was cleared.
- First play-route attempt hit a local Grav compiled-YAML cache parse error (`WELCOME_EMAIL_SUB`) and returned `500`; after one `bin/grav clearcache` retry, the route passed.
- Detail route: `200 text/html; charset=utf-8`, 41813 bytes.
- Play route: `200 text/html; charset=utf-8`, 18137 bytes.
- Story route: `200 application/octet-stream`, 87858 bytes, SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Walkthrough asset route: `200 text/markdown; charset=utf-8`, 8169 bytes.
- Cover asset route: `200 image/jpeg`, 263156 bytes.
- Annual-report feelie route: `200 application/pdf`, 584120 bytes, SHA-256 `a470dccd170d208ba957e8a2ce77399f11628eb0ab985352d5ac4b83fbc59ab5`.

Export recheck:

- A new export was not performed during final audit because the complete-package export/import smoke test had already passed on 2026-05-31 and the final audit focused on inventory, metadata, manifest, route, and cleanup checks.
- The prior export/import smoke test remains the current export evidence: zip hygiene passed, extracted story and feelie checksums matched, imported package route checks passed, and the throwaway import package was left as `draft`.

Remaining blockers at final audit time:

- Craig approval.
- Actual `_demo` promotion pass after approval.
- Re-run the route/playback and package checksum checks during the eventual `_demo` promotion pass.

These blockers were resolved for this bundled copy by Craig approval and the `_demo` promotion recorded below. A clean-site demo seed route check remains a follow-up.

## `_demo` Promotion

Promotion date: 2026-05-31.

Promotion result: Craig approved the final-audited DDEV package for `_demo` promotion, and the approved package was copied into the plugin demo library.

Promotion paths:

- Source DDEV package: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii`
- Target `_demo` package: `_demo/data/terpvault/games/zork-iii`

Copied package summary:

- Story file: `zork3.z3`
- Upstream license: `LICENSE-upstream.txt`
- Package provenance: `provenance.md`
- Package-local metadata: `metadata.iFiction.xml`
- Helper docs: `how-to-play.md`, `hints.md`, `walkthrough.md`
- Images: `cover.jpg`, `small-cover.jpg`, `hero.jpg`, `screenshots/01.png`, `screenshots/02.png`
- Feelies: `feelies/frobozzco-annual-report.pdf`, `feelies/shareholder-letter.pdf`, `feelies/stock-certificate.pdf`, `feelies/zork-iii-map.pdf`, `feelies/zug-map-inside.jpg`, `feelies/zug-map-outside.jpg`

Promotion validation:

- Story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`
- `metadata.iFiction.xml` validation: passed with `xmllint --noout`.
- Cruft exclusion: copy excluded `.DS_Store`, `__MACOSX`, AppleDouble, `.bak-*`, temp, swap, and lock files; post-copy target cruft check passed.
- Target status decision: `_demo` Zork I ships as `terpvault.status: published`, so the promoted Zork III demo package was set to `published` with `featured: false`.

Follow-up:

- Recheck the promoted package after installing or seeding `_demo` into a clean DDEV/Grav site.
- Reconfirm detail, play, story, walkthrough, image, and feelie routes from the installed demo package location.

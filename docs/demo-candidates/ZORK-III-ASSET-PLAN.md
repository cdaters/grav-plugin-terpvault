# Zork III Asset and Materials Plan

## Status

- Zork III remains candidate-only.
- This began as a docs-only materials plan; a real DDEV-only candidate package was assembled on 2026-05-29 from this plan.
- Craig-created/original package-local feelies were added to the DDEV-only draft package on 2026-05-31.
- Player-facing helper docs were refreshed on 2026-05-31; `walkthrough.md` was later expanded into a Zork I-style guide using local solution files as route references, then transcript-verified against the exact package story artifact.
- Complete-package export/import smoke testing passed on 2026-05-31 using a DDEV-only throwaway import package.
- Do not create `_demo` package contents from this plan yet.
- Do not add story files, compiled artifacts, package folders, art, screenshots, helper docs, or feelies in this pass.
- Final audit and final route/playback recheck passed on 2026-05-31.
- Package promotion remains blocked on Craig approval and the later `_demo` promotion pass.

This document expands [ZORK-III-PACKAGE-PLAN.md](ZORK-III-PACKAGE-PLAN.md) into a materials checklist for eventual package assembly. It does not approve bundling.

## DDEV-Only Assembly Result

Assembly date: 2026-05-29.

A real candidate package was assembled only in the local DDEV data library:

- Package path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii`.
- Package status after verification: `draft`.
- No `_demo` contents were created or modified.
- No story files, compiled artifacts, package folders, images, screenshots, helper docs, runtime code, Parchment files, or release metadata were added to the TerpVault plugin repository.

Files present in the DDEV-only package:

- `game.yaml`.
- `zork3.z3`.
- `LICENSE-upstream.txt`.
- `provenance.md`.
- `how-to-play.md`.
- `hints.md`.
- `walkthrough.md`.
- `cover.jpg`.
- `small-cover.jpg`.
- `hero.jpg`.
- `screenshots/01.png`.
- `screenshots/02.png`.
- `metadata.iFiction.xml`.
- `feelies/frobozzco-annual-report.pdf`.
- `feelies/shareholder-letter.pdf`.
- `feelies/stock-certificate.pdf`.
- `feelies/zork-iii-map.pdf`.
- `feelies/zug-map-inside.jpg`.
- `feelies/zug-map-outside.jpg`.

Story and provenance:

- Source scratch artifact: `/tmp/terpvault-zork3-verify-20260529/zork3-release25-serial860811.z3`.
- Package story filename: `zork3.z3`.
- SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- `LICENSE-upstream.txt` was copied from the verified source checkout license file.
- `provenance.md` records package status, upstream source, commit, toolchain, build commands, artifact checksum, upstream prebuilt difference, smoke tests, DDEV route checks, asset/helper-doc authorship, and exclusions.

Assets and helper docs:

- `cover.jpg`, `small-cover.jpg`, `hero.jpg`, `screenshots/01.png`, and `screenshots/02.png` were copied from `/Users/cdaters/Downloads/for-Zork3`.
- The copied image assets are treated as Craig-created/original package art and screenshots for this candidate pass.
- `how-to-play.md`, `hints.md`, and `walkthrough.md` were written as original package-local helper docs and refreshed on 2026-05-31 for readability and player usefulness.
- `walkthrough.md` was later expanded into a fuller Zork I-style route guide using `/Users/cdaters/Downloads/for-Zork3/zork3.sol1.txt` and `/Users/cdaters/Downloads/for-Zork3/zork3.sol2.txt` as route references only.
- `walkthrough.md` now includes the verified command route for the exact package artifact.
- The six package-local feelies were copied from `/Users/cdaters/Downloads/for-Zork3` and are treated as Craig-created/original materials; final audit passed, and `_demo` use remains pending Craig approval.

Feelie checksums:

- `feelies/frobozzco-annual-report.pdf`: `a470dccd170d208ba957e8a2ce77399f11628eb0ab985352d5ac4b83fbc59ab5`.
- `feelies/shareholder-letter.pdf`: `7f9dc53c0d32756030f9b08cf527f38d7eeab6ef7d0229a6ef3ebe1d54e2e89f`.
- `feelies/stock-certificate.pdf`: `2a2f2ff59658e525ba35a1c1b607ae3f9f9149066707fbd21571740a25893266`.
- `feelies/zork-iii-map.pdf`: `588a461158932c977f0fbd4df5dddf0998713f1237d42146a83fb5850f4175bc`.
- `feelies/zug-map-inside.jpg`: `9d453239ea484ee626b39c0021b53efa037a92c29a5039debbd1c7eb527e5f7e`.
- `feelies/zug-map-outside.jpg`: `0b5e0db2504d6592e2d25fe379eb791752bf857827f2ae21c90a43fa5623c845`.

No historical Infocom commercial scans/assets, manuals, maps, Invisiclues, packaging, logos, or trade dress were used for this feelies pass.

Verification results:

- Manifest includes `zork-iii` with `status: draft`, `format: zcode`, `story_file: zork3.z3`, `has_story_file: true`, and `player.engine: parchment`.
- Manifest resources include cover, small cover, hero, screenshots, how-to-play, hints, and walkthrough paths.
- After the 2026-05-31 refresh, manifest resources include six `resources.feelies` entries.
- IFID after metadata pass: `ZCODE-25-860811`.
- Manifest errors: none.
- Temporary publish check returned 200 for `/if/zork-iii` and `/if/zork-iii/play`.
- The 2026-05-31 temporary publish check returned 200 for one PDF feelie asset, one JPG feelie asset, and `how-to-play.md`.
- The 2026-05-31 host-side story route returned 200 but delivered a 204-byte Grav compiled-cache parse-error response instead of story bytes; story delivery was not verified in this pass.
- A later 2026-05-31 diagnosis cleared Grav cache and retested the same package. Host-side and DDEV-internal story routes both returned `200 application/octet-stream`, 87858 bytes, SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- The prior 204-byte response matched stale/corrupt Grav compiled-YAML cache errors from unrelated Grav/relatedpages blueprint files, not a Zork III package metadata/path issue and not a TerpVault story-route bug.
- The play page includes a Parchment iframe story payload for `/if/_story/zork-iii/zork3.z3`.
- DDEV-internal story route returned 200, 87858 bytes, and checksum `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- DDEV-internal cover and small-cover asset routes returned 200.
- Host-side screenshot and hero asset downloads returned 200 and matched the copied source images.
- Host-side story delivery was rechecked after cache clear and matched the selected artifact checksum. Recheck route delivery again as part of any final `_demo` promotion audit.
- Walkthrough verification on 2026-05-31 used `dfrotz` / Frotz 2.55 dumb interface against the exact package story SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Exact command: `/opt/homebrew/bin/dfrotz -p -m -s 41 /Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/zork3.z3 < /private/tmp/zork3-route-working-20260531.txt > /private/tmp/zork3-transcript-working-20260531.txt`.
- Scratch paths: route `/private/tmp/zork3-route-working-20260531.txt`, transcript `/private/tmp/zork3-transcript-working-20260531.txt`, debug notes `/private/tmp/zork3-route-debug-notes-20260531.md`.
- Result: ending reached. The verified transcript reached the Treasury ending and reported 7 of 7 in 330 moves after 15 recorded route-debug iterations.
- Post-walkthrough manifest check before the later metadata pass returned `200`; canonical `zork-iii` remained `draft`, `walkthrough.md` was present, warning count remained one expected missing-IFID warning, and error count remained zero.
- Post-walkthrough temporary publish check returned `200` for play, `/if/_asset/zork-iii/walkthrough.md`, and `/if/_story/zork-iii/zork3.z3`; the story route returned 87858 bytes with the expected SHA-256.
- The same temporary publish detail route returned `200` with a 224-byte Grav compiled-cache parse-error body from a compiled YAML cache file, consistent with the known local Grav cache issue. Canonical `zork-iii` was restored to `draft` and cache was cleared.
- IFID/iFiction review on 2026-05-31 first found no authoritative IFID locally because no Treaty/Babel extractor was available and no embedded IFID string appeared in the story file.
- Follow-up public metadata research checked IFDB, IFWiki, IF Archive search/index pages, the Treaty of Babel, the local story file, and the documented upstream source repository.
- IFID accepted for this Release 25 / Serial 860811 artifact: `ZCODE-25-860811`.
- `game.yaml` now records the IFID, IFDB TUID/URL, IFWiki URL, and a cleaner verified author field. `metadata.iFiction.xml` was created from verified fields only.
- Post-metadata manifest check returned `200`; canonical `zork-iii` remained `draft`, warning count was zero, and error count was zero.
- Post-metadata temporary publish check returned `200` for detail, play, and story routes; story route returned 87858 bytes with the expected SHA-256. Canonical `zork-iii` was restored to `draft` and cache was cleared.
- After the walkthrough rewrite, and before the later metadata pass, manifest returned `200`, canonical `zork-iii` remained `draft`, `walkthrough.md` was present, warning count remained one expected missing-IFID warning, and error count remained zero.
- Temporary publish check after the walkthrough rewrite returned `200` for detail, play, and `/if/_asset/zork-iii/walkthrough.md`; canonical `zork-iii` was restored to `draft`.
- Final audit on 2026-05-31 confirmed expected files, valid YAML, valid package-local iFiction XML, zero manifest warnings, zero manifest errors, and no remaining local cruft after stale `.bak-*` backups were removed from the DDEV-only package.
- Final route/playback recheck on 2026-05-31 temporarily published the package, cleared cache, and verified detail, play, story, walkthrough, cover, and one PDF feelie route. A first play-route attempt hit the known local Grav compiled-YAML cache issue; one cache clear resolved it. Story delivery returned `200 application/octet-stream`, 87858 bytes, SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Final audit recommendation: ready for Craig approval and later `_demo` promotion planning; no `_demo` contents were created or modified.

Complete-package export/import smoke test:

- Export path inside DDEV container: `/tmp/zork-iii-export-test.terpvault.zip`.
- Export size: 18604153 bytes.
- Export SHA-256: `c1fe020d7720d096cb1ff4bcb9ed7954e55973febdd717ab8c48b690e0290607`.
- Zip hygiene: passed; backup/cruft/temp/source-build files were excluded.
- Extracted story and feelie checksums matched the canonical DDEV package copies.
- Import inspect result: ok; fatal errors none; expected warnings for source slug collision and draft-forcing.
- Imported throwaway slug/path: `zork-iii-import-test-20260531` at `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii-import-test-20260531`.
- Imported package manifest status: `draft`, `has_story_file: true`, warning count `1`, error count `0`.
- Temporary publish check for the imported package returned `200` for detail, play, story, cover, and one PDF feelie. Story route bytes matched SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- The throwaway import package was left as `draft`; canonical `zork-iii` remained `draft`.

## Selected Candidate Basis

- Proposed package slug/id: `zork-iii`.
- Proposed display title: `Zork III`.
- Proposed headline/subtitle: `The Dungeon Master`.
- Proposed story format: `zcode`.
- Proposed player engine: `parchment`.
- Expected package story filename: `zork3.z3`.
- Selected provisional artifact basis: source-built `zork3-release25-serial860811.z3`.
- Selected provisional artifact SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- In-game release/serial: `Release 25 / Serial number 860811`.
- Source repository: `https://github.com/historicalsource/zork3.git`.
- Source commit: `3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8`.
- Observed upstream license: MIT License.
- Observed upstream copyright line: `Copyright (c) 2025 Microsoft`.
- Upstream license path: `LICENSE`.

The selected source-built artifact differs from upstream `COMPILED/zork3.z3` / `zork3.zip`, both SHA-256 `b637a242865d059890184164ce8dec28554cc80901dcbf26c740b2d1ed0d4eb8`. Keep that difference explicit in package provenance.

## Planned Package Structure

Planned only; do not create these files yet.

```text
zork-iii/
  game.yaml
  zork3.z3
  metadata.iFiction.xml
  cover.jpg
  small-cover.jpg
  hero.jpg
  screenshots/
    01.png
    02.png
  how-to-play.md
  hints.md
  walkthrough.md
  LICENSE-upstream.txt
  provenance.md
  feelies/
    frobozzco-annual-report.pdf
    shareholder-letter.pdf
    stock-certificate.pdf
    zork-iii-map.pdf
    zug-map-inside.jpg
    zug-map-outside.jpg
```

`metadata.iFiction.xml` is present in the DDEV-only package. Feelies are present, final audit passed, and `_demo` or public/GPM distribution remains pending Craig approval and a dedicated promotion pass.

## game.yaml Materials Plan

Draft planned fields only; do not create package `game.yaml` yet.

```yaml
id: zork-iii
slug: zork-iii
identification:
  format: zcode
  ifids:
    - pending-verification
bibliographic:
  title: Zork III
  author: pending-final-attribution-wording
  headline: The Dungeon Master
  first_published: '1982'
  genre: Interactive Fiction
  language: en
  description: >
    Original curator-written package description. Must avoid copying commercial
    marketing copy, manuals, Invisiclues, catalog prose, or online summaries
    unless separately licensed.
resources:
  story_file: zork3.z3
  cover: cover.jpg
  small_cover: small-cover.jpg
  hero: hero.jpg
  screenshots:
    - screenshots/01.png
    - screenshots/02.png
  feelies:
    - title: FrobozzCo International Annual Report
      path: feelies/frobozzco-annual-report.pdf
      type: pdf
    - title: Shareholder Letter
      path: feelies/shareholder-letter.pdf
      type: pdf
    - title: Stock Certificate
      path: feelies/stock-certificate.pdf
      type: pdf
    - title: Zork III Map
      path: feelies/zork-iii-map.pdf
      type: pdf
    - title: ZUG Map, Inside
      path: feelies/zug-map-inside.jpg
      type: image
    - title: ZUG Map, Outside
      path: feelies/zug-map-outside.jpg
      type: image
  how_to_play: how-to-play.md
  hints: hints.md
  walkthrough: walkthrough.md
catalog:
  ifdb:
    tuid: pending-verification
    url: pending-verification
  ifwiki:
    url: pending-verification
  ifarchive:
    path: ''
    url: ''
release:
  license:
    name: MIT License
    url: https://github.com/historicalsource/zork3/blob/master/LICENSE
    notes: >
      Observed upstream source license is MIT. Historical commercial packaging,
      manuals, maps, ads, logos, trade dress, scans, Invisiclues, and commercial
      helper material are excluded unless separately licensed.
  source:
    url: https://github.com/historicalsource/zork3.git
    retrieved: '2026-05-29'
    notes: >
      Source commit 3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8. Provisional
      package artifact basis is source-built zork3-release25-serial860811.z3,
      SHA-256 2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260,
      file identification Infocom (Z-machine 3, Release 25, Serial 860811).
terpvault:
  status: draft
  featured: false
  tags:
    - parser
    - z-code
    - classic
    - zork
player:
  engine: parchment
  theme: retro-terminal
  autosave: true
```

Required before final package review:

- Confirm final attribution wording again during the later `_demo` promotion pass.
- IFID and catalog links were confirmed during final audit. Current package provenance records that IFDB plus the Treaty legacy Z-code rule support `ZCODE-25-860811` for the Release 25 / Serial 860811 artifact.
- Keep `terpvault.status: draft` during package assembly.
- Keep `terpvault.featured: false` until final review.
- Confirm every `resources.*` path exists before export/import smoke testing. Completed for the DDEV-only package on 2026-05-31.

## metadata.iFiction.xml Options

Options, in preferred order:

1. Generate a package-local `metadata.iFiction.xml` from verified `game.yaml` metadata after title, author, IFID, release, and catalog fields are final.
2. Use local iFiction preview/apply tooling to compare XML fields against `game.yaml` without auto-applying values.
3. Defer `metadata.iFiction.xml` until IFID/catalog data is verified, and document the omission in `provenance.md`.

Current decision: option 1. `metadata.iFiction.xml` was created after the 2026-05-31 public metadata review resolved the release-specific IFID.

Do not hand-copy iFiction metadata from unverified sources. Do not use remote IFDB, IFWiki, or IF Archive metadata unless a later explicit metadata-source workflow verifies attribution, license, and field mapping.

## Provenance Plan

Future `provenance.md` should include these sections:

- Status and scope: candidate package, not official Infocom packaging, no historical commercial assets.
- Upstream source: repository URL, branch, exact commit, retrieval date, and license file path.
- License basis: observed MIT License text and observed Microsoft 2025 copyright line.
- Toolchain: .NET SDK version if used, ZILF/ZAPF version, exact executable paths or stable setup script, and whether tools were scratch-built.
- Build commands: `zilf zork3.zil` and `zapf zork3.zap zork3-release25-serial860811.z3 -r 25 -s 860811`.
- Artifact: final package story filename `zork3.z3`, source-built artifact filename, SHA-256, byte size, file identification, and release/serial banner.
- Upstream prebuilt comparison: checksum and file identification for `COMPILED/zork3.z3` / `zork3.zip`, plus note that selected source-built artifact differs.
- Local interpreter verification: `dfrotz` version, smoke-test commands, and result.
- DDEV/Parchment verification: temporary package path, route results, Parchment iframe boot configuration, story route checksum, and whether manual banner/input testing was completed.
- Export/import verification: final zip contents, no cruft, import inspect result, draft-only import result, and imported story checksum. Completed for the DDEV-only package on 2026-05-31.
- Excluded assets: historical commercial packaging, manuals, maps, ads, logos, trade dress, scans, Invisiclues, clue sheets, `invisicluesiii.mss`, and copied online walkthroughs unless separately licensed.
- Package asset authorship: cover, small cover, hero, screenshots, and feelies.
- Helper doc authorship: original how-to-play, hints, and walkthrough notes.
- Screenshot capture source: exact package slug, story checksum, route, browser/player context, and capture date.

## LICENSE-upstream.txt Requirements

Future package must include an exact copy of the upstream `LICENSE` file from the selected source basis as `LICENSE-upstream.txt`.

Before package assembly:

- Reconfirm the upstream license file at commit `3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8`.
- Copy only the license text, not unrelated repository files.
- Record retrieval date and source URL in `provenance.md`.
- Do not treat the source-code license as permission to use trademarks, packaging, marketing materials, manuals, maps, Invisiclues, or trade dress.

## Helper Docs Plan

All helper docs must be original package-local writing unless a separate source is explicitly licensed and attributed.

### `how-to-play.md`

Required contents:

- Parser basics: typing commands, using verbs and objects, examining things, and reading room descriptions.
- Movement basics: compass directions, up/down, entering/leaving where relevant.
- Inventory/object commands: `inventory`, `take`, `drop`, `examine`, `open`, `close`, and similar parser verbs.
- Save/restore expectations: use story-native `SAVE` and `RESTORE`; TerpVault does not provide separate named save slots.
- Spoiler-free orientation: explain that Zork III is a parser adventure with a more endgame-like structure, without copying marketing text or manual prose.
- Zork III-specific premise: brief original orientation around seeking the Dungeon Master/final test, avoiding copied catalog or package copy.

### `hints.md`

Required contents:

- Progressive hints grouped by puzzle or region.
- Clear spoiler boundaries before deeper hints.
- Original wording only.
- Hints aligned to the selected `zork3-release25-serial860811.z3` artifact.
- No copied Invisiclues, manual text, online hints, walkthroughs, or `invisicluesiii.mss`.

### `walkthrough.md`

Required contents:

- Clearly marked as spoilery.
- Written after the selected playable artifact is fixed.
- Verified against the exact selected package story file.
- Record score/path outcome, move count when available, interpreter/tool version, transcript date, and story checksum.
- No copied Invisiclues, manuals, hint books, online walkthroughs, or commercial helper text.

2026-05-31 helper-doc status:

- `how-to-play.md` was expanded into a spoiler-light guide for parser basics, movement, examining, inventory, save/restore, mapping, and Zork III expectations.
- `hints.md` was expanded into progressive hints by broad puzzle/area/theme with spoiler boundaries.
- `walkthrough.md` was revised as a clearly spoilery, player-usable route guide with a verified command route.
- Full-potential transcript verification passed against the exact package artifact with `dfrotz -p -m -s 41`, reaching 7 of 7 in 330 moves.

## Art Plan

All visual assets should be original Craig-created or otherwise properly licensed work. AI-assisted art is acceptable only if it is original, documented as such, and does not imitate restricted commercial packaging, logos, trade dress, historical scans, manual art, or advertising layouts.

### `cover.jpg`

- Purpose: primary package cover image for detail pages, library cards, Admin2 media views, and exports.
- Recommended usage: square or near-square image that crops cleanly.
- Visual direction: original Zork III mood, endgame/final-test atmosphere, underground fantasy, mysterious threshold, Dungeon Master theme, or abstract adventurer imagery.
- Avoid: Infocom box layout, title treatments, logos, packaging colors/layout systems, manual art, historical maps, and scans.

### `small-cover.jpg`

- Purpose: thumbnail/card-friendly cover image.
- Recommended usage: square crop or simplified companion image.
- Visual direction: high-contrast central subject readable at small sizes.
- Validate in public library cards and Admin2 media previews before final package export.

### `hero.jpg`

- Purpose: wide public detail/play-page visual.
- Recommended usage: wide image with enough visual breathing room around page text.
- Visual direction: atmospheric underground passage, final gate, ancient stair, mysterious figure, or other original scene that suggests Zork III without copying commercial imagery.
- Validate in active Grav theme layouts before final package export.

## Screenshot Plan

Screenshots are package assets and must be captured from the exact selected playable artifact in the final TerpVault/Parchment package candidate.

Required screenshots:

- `screenshots/01.png`: opening/banner or first playable scene showing `Release 25 / Serial number 860811` where practical.
- `screenshots/02.png`: interaction screenshot after a basic command such as `look` or `inventory`.

Acceptance checks:

- Confirm story route checksum immediately before capture.
- Capture from the final package slug, not the temporary `zork-iii-temp` package unless the package is intentionally still in a DDEV-only verification phase.
- Do not use unrelated interpreter screenshots, upstream prebuilt artifacts, other story versions, or external screenshots.
- Record capture date, route, browser/player context, and story checksum in `provenance.md`.

## Optional Original Feelies and Extras

Current package-local extras:

- `feelies/frobozzco-annual-report.pdf`: original in-universe FrobozzCo annual-report style feelie.
- `feelies/shareholder-letter.pdf`: original in-universe shareholder letter feelie.
- `feelies/stock-certificate.pdf`: original in-universe stock certificate feelie.
- `feelies/zork-iii-map.pdf`: original map feelie.
- `feelies/zug-map-inside.jpg`: original ZUG map inside artwork.
- `feelies/zug-map-outside.jpg`: original ZUG map outside artwork.

Future optional package-local extras may include:

- `feelies/map.png` or `feelies/map.pdf`: original navigation aid based on the selected playable artifact.
- `feelies/command-cheat-sheet.pdf`: original parser command reference for TerpVault players.
- `feelies/curator-notes.pdf`: original notes about the package basis, gameplay expectations, or preservation context.

Rules:

- Feelies must be original or separately licensed.
- Do not copy historical Infocom maps, package inserts, manuals, advertisements, reference cards, Invisiclues, clue sheets, scans, logos, trade dress, or online fan maps unless rights are explicit and preserved.
- Each feelie needs `resources.feelies` metadata with title, path, type, and description.
- Each feelie needs authorship/license notes in `provenance.md`.

## Excluded Materials

Do not include these unless a later pass documents explicit redistribution rights:

- Historical Infocom packaging scans.
- Commercial manuals.
- Historical maps.
- Invisiclues or clue sheets.
- Advertisements.
- Logos.
- Trade dress.
- Historical scans or copied online package art.
- `invisicluesiii.mss`.
- Online walkthrough, hint, map, catalog, or marketing text.
- Upstream prebuilt `COMPILED/zork3.z3` / `zork3.zip` unless a later artifact-basis decision selects and documents that path.

## What Craig/AI/Manual Curation Can Create

Can be Craig-created, AI-assisted, or manually curated if original and documented:

- `cover.jpg`.
- `small-cover.jpg`.
- `hero.jpg`.
- `how-to-play.md`.
- `hints.md`.
- `walkthrough.md`, after artifact selection and transcript verification.
- Optional map/navigation aid.
- Optional command cheat sheet.
- Optional curator notes.
- Public-facing package description.
- Final attribution wording, with careful source/provenance review.

Must be verified from the selected playable artifact:

- Story route checksum.
- Release/serial banner.
- Parchment playback behavior.
- Screenshots.
- Walkthrough path and score.
- Any map/navigation aid that makes factual claims about game geography.
- Any hints or walkthrough commands.

## Final Audit Checklist

Before package assembly can move toward bundled-demo review:

- Final artifact basis is explicitly approved.
- `zork3.z3` story file is copied only into a DDEV package candidate first.
- Story checksum matches `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- File identification is recorded as `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- `game.yaml` is complete, draft, and not featured.
- `LICENSE-upstream.txt` is present and exactly sourced from the selected upstream commit.
- `provenance.md` records source, toolchain, build, artifact, playback, asset, helper-doc, screenshot, and exclusion notes.
- `metadata.iFiction.xml` is generated and package-local.
- Original `how-to-play.md`, `hints.md`, and `walkthrough.md` are written.
- Walkthrough is verified against the exact selected story artifact.
- Original or properly licensed cover, small cover, hero, screenshots, and optional feelies are complete.
- Screenshots are captured from the final playable package candidate.
- DDEV detail/play/story/Parchment routes pass.
- Manual Parchment banner/input check passes.
- Export zip contains expected files and no `.DS_Store`, `__MACOSX`, AppleDouble, editor backups, scratch logs, or temporary source files.
- Import inspect passes without fatal errors.
- Import commit creates a draft package under a throwaway slug.
- Imported story checksum matches the selected artifact.
- No historical commercial assets are included.
- Craig explicitly approves copying the finished package into `_demo`.

## Open Questions

- Final audit approval for IFID/catalog references and package-local `metadata.iFiction.xml`.
- Final attribution wording.
- Exact visual direction for cover, small cover, and hero art.
- Whether optional feelies should ship in the first Zork III package pass or wait for later polish.
- Whether the final package should install as draft or published in future demo-install workflows.

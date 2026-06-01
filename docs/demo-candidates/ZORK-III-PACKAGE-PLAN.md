# Zork III Candidate Package Plan

## Status

- Candidate package plan only.
- Not approved for bundled demo.
- Do not create `_demo` package contents from this plan yet.
- Do not add story files, compiled artifacts, screenshots, art, feelies, helper docs, or package folders in this pass.
- A real DDEV-only candidate package was assembled on 2026-05-29 under `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii`.
- Craig-created/original package-local feelies were added to the DDEV-only draft package on 2026-05-31.
- Player-facing helper docs were refreshed on 2026-05-31; `walkthrough.md` was later expanded into a Zork I-style guide using local solution files as route references, then transcript-verified against the exact package story artifact.
- Complete-package export/import smoke testing passed on 2026-05-31 using a DDEV-only throwaway import package.
- Package promotion remains blocked until final audit, final route/playback recheck, and Craig approval are complete.

This document records the likely package shape for a future Zork III TerpVault demo candidate. It is a planning artifact, not a packaging approval.

Use [ZORK-III-ASSET-PLAN.md](ZORK-III-ASSET-PLAN.md) for the expanded docs-only materials checklist covering `game.yaml`, provenance, upstream license, iFiction metadata, helper docs, art, screenshots, optional feelies, and final audit requirements.

## DDEV Candidate Package

Assembly date: 2026-05-29.

A real candidate package now exists only in the local DDEV data library:

```text
/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/
  game.yaml
  zork3.z3
  cover.jpg
  small-cover.jpg
  hero.jpg
  screenshots/
    01.png
    02.png
  feelies/
    frobozzco-annual-report.pdf
    shareholder-letter.pdf
    stock-certificate.pdf
    zork-iii-map.pdf
    zug-map-inside.jpg
    zug-map-outside.jpg
  how-to-play.md
  hints.md
  walkthrough.md
  LICENSE-upstream.txt
  provenance.md
```

The DDEV package uses the selected source-built artifact as `zork3.z3`:

- Source artifact: `/tmp/terpvault-zork3-verify-20260529/zork3-release25-serial860811.z3`.
- SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.

The package includes an upstream license copy, package-local provenance, revised original helper docs, Craig-created/original image assets, and Craig-created/original package-local feelies from `/Users/cdaters/Downloads/for-Zork3`. `walkthrough.md` now contains a verified full-potential route for this exact story artifact.

DDEV-only feelies added on 2026-05-31:

- `feelies/frobozzco-annual-report.pdf`.
  - SHA-256: `a470dccd170d208ba957e8a2ce77399f11628eb0ab985352d5ac4b83fbc59ab5`.
- `feelies/shareholder-letter.pdf`.
  - SHA-256: `7f9dc53c0d32756030f9b08cf527f38d7eeab6ef7d0229a6ef3ebe1d54e2e89f`.
- `feelies/stock-certificate.pdf`.
  - SHA-256: `2a2f2ff59658e525ba35a1c1b607ae3f9f9149066707fbd21571740a25893266`.
- `feelies/zork-iii-map.pdf`.
  - SHA-256: `588a461158932c977f0fbd4df5dddf0998713f1237d42146a83fb5850f4175bc`.
- `feelies/zug-map-inside.jpg`.
  - SHA-256: `9d453239ea484ee626b39c0021b53efa037a92c29a5039debbd1c7eb527e5f7e`.
- `feelies/zug-map-outside.jpg`.
  - SHA-256: `0b5e0db2504d6592e2d25fe379eb791752bf857827f2ae21c90a43fa5623c845`.

The feelies are treated as Craig-created/original package-local materials. No historical Infocom commercial scans/assets, manuals, maps, Invisiclues, packaging, logos, or trade dress were used for this feelies pass. Redistribution remains pending final audit.

Verification status:

- Manifest includes `zork-iii` as `draft`, `zcode`, `zork3.z3`, `has_story_file: true`, and `player.engine: parchment`.
- Manifest includes the six `resources.feelies` entries after the 2026-05-31 refresh.
- IFID after metadata pass: `ZCODE-25-860811`.
- Manifest errors: none.
- Temporary publish check returned 200 for the detail and play routes.
- The 2026-05-31 temporary publish check returned 200 for one PDF feelie asset, one JPG feelie asset, and `how-to-play.md`.
- The 2026-05-31 host-side story route returned 200 but delivered a 204-byte Grav compiled-cache parse-error response instead of story bytes; story delivery was not verified in this pass.
- A later 2026-05-31 diagnosis cleared Grav cache and retested the same package. Host-side and DDEV-internal story routes both returned `200 application/octet-stream`, 87858 bytes, SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- The prior 204-byte response matched stale/corrupt Grav compiled-YAML cache errors from unrelated Grav/relatedpages blueprint files, not a Zork III package metadata/path issue and not a TerpVault story-route bug.
- Parchment iframe boot configuration points at `/if/_story/zork-iii/zork3.z3`.
- DDEV-internal story route returned 200 and matched the selected artifact checksum.
- DDEV-internal cover/small-cover asset checks returned 200.
- Package was restored to `draft` after route verification.
- Walkthrough rewrite check on 2026-05-31: `zork3.sol1.txt` and `zork3.sol2.txt` from `/Users/cdaters/Downloads/for-Zork3` were used as route references only; package prose was rewritten as original TerpVault text.
- Walkthrough transcript verification: `dfrotz` / Frotz 2.55 dumb interface, exact command `/opt/homebrew/bin/dfrotz -p -m -s 41 /Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/zork3.z3 < /private/tmp/zork3-route-working-20260531.txt > /private/tmp/zork3-transcript-working-20260531.txt`.
- Walkthrough result: ending reached. The verified transcript reached the Treasury ending and reported 7 of 7 in 330 moves after 15 recorded route-debug iterations.
- Walkthrough scratch paths: route `/private/tmp/zork3-route-working-20260531.txt`, transcript `/private/tmp/zork3-transcript-working-20260531.txt`, debug notes `/private/tmp/zork3-route-debug-notes-20260531.md`.
- Post-walkthrough manifest check: `zork-iii` remained `draft`, `walkthrough.md` was present, warning count remained one expected missing-IFID warning, and error count remained zero.
- Post-walkthrough temporary publish check: play route, walkthrough asset route, and story route returned `200`; story route returned `application/octet-stream`, 87858 bytes, with SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- The same temporary publish detail route returned `200` with a 224-byte Grav compiled-cache parse-error body from a compiled YAML cache file, consistent with the known local Grav cache issue. Canonical `zork-iii` was restored to `draft` and cache was cleared.
- IFID/iFiction review on 2026-05-31: local extraction tools were unavailable and story-string inspection found no embedded IFID, but follow-up public metadata research checked IFDB, IFWiki, IF Archive search/index pages, the Treaty of Babel, the local story file, and the documented upstream source repository.
- IFID result: resolved for this package artifact as `ZCODE-25-860811`. IFDB lists that IFID, the local artifact is Release 25 / Serial 860811, and the Treaty of Babel legacy Z-code rule maps pre-1990 story files as `ZCODE-{release}-{serial}`.
- Catalog metadata added: IFDB TUID/URL and IFWiki URL. IF Archive path/URL remains blank because the checked IF Archive Zork III result points to shipped documentation, not this source-built story artifact.
- Package-local `metadata.iFiction.xml` was created from verified fields only.
- Post-metadata manifest check: canonical `zork-iii` remained `draft`, IFID `ZCODE-25-860811` and catalog links were exposed, `metadata.iFiction.xml` was detected, warning count was zero, and error count was zero.
- Post-metadata temporary publish check: detail, play, and story routes returned `200`; story route returned `application/octet-stream`, 87858 bytes, with the expected SHA-256. Canonical `zork-iii` was restored to `draft` and cache was cleared.
- After the walkthrough rewrite, manifest returned `200`, canonical `zork-iii` remained `draft`, `walkthrough.md` was present, warning count remained one expected missing-IFID warning, and error count remained zero.
- Temporary publish check after the walkthrough rewrite returned `200` for detail, play, and `/if/_asset/zork-iii/walkthrough.md`; canonical `zork-iii` was restored to `draft`.

Host-side story delivery was rechecked after cache clear and matched the selected artifact checksum. Recheck route delivery again as part of any final `_demo` promotion audit.

Complete-package export/import smoke test:

- Export path inside DDEV container: `/tmp/zork-iii-export-test.terpvault.zip`.
- Export size: 18604153 bytes.
- Export SHA-256: `c1fe020d7720d096cb1ff4bcb9ed7954e55973febdd717ab8c48b690e0290607`.
- Zip hygiene: passed; no `.DS_Store`, `__MACOSX`, AppleDouble, editor backup files, `.bak-*`, lock files, temp files, scratch logs, or source-build files were present.
- Export included `game.yaml`, `zork3.z3`, license/provenance, helper docs, cover/small-cover/hero, screenshots, and six feelies.
- Extracted story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Import inspect result: ok; fatal errors none; expected warnings for source slug collision and draft-forcing.
- Imported throwaway slug: `zork-iii-import-test-20260531`.
- Imported package path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii-import-test-20260531`.
- Imported story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Imported manifest status after cache clear: `draft`, `has_story_file: true`, warning count `1`, error count `0`.
- Temporary publish check for the imported package returned `200` for detail, play, story, cover, and one PDF feelie. The story route returned `200 application/octet-stream`, 87858 bytes, and the expected checksum.
- The throwaway import package was left as `draft`; canonical `zork-iii` remained `draft`.

## Upstream Source Candidate

- Repository: `https://github.com/historicalsource/zork3.git`.
- Verified branch: `master`.
- Verified commit: `3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8`.
- Tags/releases observed: none in the current candidate verification docs.
- Source form: ZIL, with `zork3.zil` as the natural top-level source file.
- License file: `LICENSE`.
- Observed license text: MIT License.
- Observed copyright line: `Copyright (c) 2025 Microsoft`.

License/provenance cautions:

- The observed MIT license is a strong source-code basis, but this is not a legal opinion.
- Historical commercial packaging, manuals, maps, advertisements, logos, trade dress, scans, and commercial helper material remain excluded unless separately licensed.
- The repository includes `invisicluesiii.mss`; do not treat it as package-ready helper text without separate provenance and redistribution review.
- Trademarks and branding remain separate from source-code license status.

## Artifact Basis Options

### Option A: Source-Built Artifact

Existing scratch evidence from `docs/demo-candidates/ZORK-III.md`:

- Build toolchain: ZILF 1.8 / ZAPF 1.8 in scratch.
- Fresh scratch build reverified on 2026-05-29 from checkout `/tmp/terpvault-zork3-verify-20260529`.
- Source build command used:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf zork3.zil
```

- Historical-header reassembly command used:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork3.zap zork3-release25-serial860811.z3 -r 25 -s 860811
```

- Historical-header artifact: `zork3-release25-serial860811.z3`.
- SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- `dfrotz` smoke test: passed on 2026-05-29 with `look`, `inventory`, `quit`, `y`.
- DDEV-only temporary package smoke test: host-side detail/play/story/manifest/Parchment routes passed on 2026-05-29 for `zork-iii-temp`.
- DDEV story route checksum for `zork-iii-temp/zork3.z3`: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- The 2026-05-29 DDEV pass confirmed the Parchment iframe boot configuration. Manual browser confirmation of the game banner and command input remains a follow-up.

Recommended basis for future package planning: use the source-built `zork3-release25-serial860811.z3` unless a later review selects another basis. This recommendation is provisional and does not approve bundling.

### Option B: Upstream Prebuilt Artifact

Observed upstream prebuilt files:

- `COMPILED/zork3.z3`.
- `zork3.zip`.
- SHA-256 for both: `b637a242865d059890184164ce8dec28554cc80901dcbf26c740b2d1ed0d4eb8`.
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.

Do not select the upstream prebuilt artifact without an explicit packaging decision. The repository README notes that `.ZIP` files in some historical source repositories were present at final spin-down and the original production process is not currently reproducible.

## What Still Needs Verification

- Final artifact basis decision.
- Selected artifact filename, file identification, checksum, and redistribution basis.
- Package-local provenance notes for the selected artifact.
- Full DDEV TerpVault detail/play/story route checks against the final package candidate.
- Parchment playback beyond basic smoke testing where practical.
- Complete-package export/import smoke test passed on 2026-05-31.
- Full walkthrough or score/path verification against the exact selected bundled artifact.
- Final package metadata, IFIDs, catalog links, and iFiction metadata source.
- Original helper docs, screenshots, art, and optional feelies.

## Proposed Package Identity

- Proposed package slug: `zork-iii`.
- Proposed display title: `Zork III`.
- Proposed subtitle/headline: `The Dungeon Master`.
- Proposed story format: `zcode`.
- Proposed player engine: `parchment`.
- Expected story file name: `zork3.z3`.
- Proposed install status during assembly: draft until final review.

Final attribution wording should be drafted carefully. It should credit Infocom and the original Zork III creators separately from the Microsoft/Open Source Programs Office/Xbox/Activision source release and TerpVault package curation.

## Required Package Structure

Current DDEV candidate structure; do not copy this package into `_demo` yet.

```text
zork-iii/
  game.yaml
  zork3.z3
  cover.jpg
  small-cover.jpg
  hero.jpg
  screenshots/
    01.png
    02.png
  feelies/
    frobozzco-annual-report.pdf
    shareholder-letter.pdf
    stock-certificate.pdf
    zork-iii-map.pdf
    zug-map-inside.jpg
    zug-map-outside.jpg
  how-to-play.md
  hints.md
  walkthrough.md
  LICENSE-upstream.txt
  provenance.md
```

All feelies must remain original or otherwise clearly licensed for redistribution. The current package-local feelies are Craig-created/original materials pending final audit.

## Draft Metadata Plan

Draft planned sections only; do not create `game.yaml` yet.

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
      Candidate package based on verified source release. Historical commercial
      packaging, manuals, maps, ads, logos, trade dress, scans, Invisiclues, and
      commercial helper material are excluded.
  source:
    url: https://github.com/historicalsource/zork3.git
    retrieved: '2026-05-29'
    notes: >
      Candidate source commit 3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8.
      Provisional preferred artifact basis is source-built
      zork3-release25-serial860811.z3, SHA-256
      2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260.
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

Release-specific IFID and IFDB/IFWiki catalog fields have been recorded for the DDEV-only package. Final attribution wording and selected artifact notes still need final audit before any `_demo` promotion.

## Required Provenance Files

Future package must include:

- `LICENSE-upstream.txt`: exact upstream license text from the selected source basis.
- `provenance.md`: package-local source, build, artifact, asset, helper-doc, screenshot, and redistribution notes.

`provenance.md` should record:

- Upstream repository URL.
- Branch and commit.
- License file path and observed license summary.
- Retrieval date.
- Toolchain and build commands if source-built artifact is selected, including the current scratch-only ZILF/ZAPF path or its eventual stable replacement.
- Selected artifact filename, file identification, and checksum.
- Whether the selected artifact differs from upstream `COMPILED/zork3.z3` / `zork3.zip`.
- DDEV playback/export/import verification dates, including whether each check was done with a temporary draft package, a temporarily published package, or the final package candidate.
- Authorship/licensing notes for every art/helper/screenshot/feelie file.
- Explicit exclusion of historical commercial assets.

## Helper Docs Plan

Required original helper docs:

- `how-to-play.md`: parser primer, movement/object commands, save/restore expectations, and Zork III-specific play notes.
- `hints.md`: original spoiler-light progressive hints with clear spoiler boundaries.
- `walkthrough.md`: original clearly spoilery route aligned to the exact selected playable artifact.

2026-05-31 status:

- `how-to-play.md` was expanded into a spoiler-light guide for new parser players.
- `hints.md` was expanded into progressive hints organized by broad puzzle/area/theme.
- `walkthrough.md` was revised as a player-usable draft route outline with a final verification block.
- Full-route/full-score transcript verification has not been completed against the exact package artifact.

Do not copy or adapt commercial manuals, Invisiclues, hint books, `invisicluesiii.mss`, online walkthroughs, catalog prose, or marketing text unless redistribution rights are explicit and preserved.

## Art, Screenshots, and Feelies Plan

See [ZORK-III-ASSET-PLAN.md](ZORK-III-ASSET-PLAN.md) for the expanded materials checklist and acceptance criteria.

Required original art:

- `cover.jpg`: original cover/display art.
- `small-cover.jpg`: thumbnail/card-friendly crop or companion image.
- `hero.jpg`: wide public detail/play presentation image.

Required screenshots:

- `screenshots/01.png`: captured from the selected playable artifact in the final TerpVault/Parchment package candidate.
- `screenshots/02.png`: second gameplay screenshot from the same selected package candidate.

Optional original feelies/extras:

- Original map or navigation aid.
- Original command cheat sheet.
- Original curator notes.

Excluded unless separately licensed:

- Historical Infocom packaging scans.
- Manuals.
- Maps.
- Invisiclues or clue sheets.
- Advertisements.
- Logos and trade dress.
- Commercial helper files such as `invisicluesiii.mss`.
- Historical scans or copied online package art.

## Playback Verification Plan

Before package creation is promoted:

1. Reconfirm selected artifact checksum in scratch.
2. Run local Frotz or `dfrotz` smoke test:

```text
look
inventory
quit
y
```

3. Assemble a temporary DDEV-only package outside the plugin repo.
4. Confirm TerpVault routes:
   - `/if/zork-iii`
   - `/if/zork-iii/play`
   - `/if/_story/zork-iii/zork3.z3`
   - `/if/_engine/parchment`
5. Confirm Parchment loads the game banner and accepts input.
6. Confirm story route bytes match the selected artifact checksum.
7. Export the complete package and inspect zip contents.
8. Import as draft under a throwaway slug and confirm the imported story checksum.

## Walkthrough Verification Plan

- Original walkthrough text is written in the DDEV-only package.
- Complete-route verification passed against the exact selected playable artifact on 2026-05-31.
- Verification used a repeatable `dfrotz` transcript with `-p -m -s 41`.
- Recorded final result: Treasury ending reached, 7 of 7, 330 moves.
- Re-run the route during final promotion audit if the story file, walkthrough route, interpreter, or package artifact changes.

## Promotion Checklist

Zork III can move from candidate package plan to bundled-demo review only after:

- Artifact basis is approved.
- Source/provenance and license basis are documented.
- Playable story file is verified.
- DDEV TerpVault/Parchment playback passes.
- `game.yaml` is drafted and reviewed.
- `metadata.iFiction.xml` plan/source is resolved for the DDEV-only candidate package.
- `LICENSE-upstream.txt` and `provenance.md` are complete.
- Original `how-to-play.md`, `hints.md`, and `walkthrough.md` are written.
- Full route/walkthrough verification is complete against the selected artifact.
- Original or properly licensed cover, small cover, hero art, screenshots, and optional feelies are complete.
- Export/import smoke testing passes for the complete package. Completed for the DDEV-only candidate on 2026-05-31.
- No historical commercial assets are included without separate license review.
- Recheck IFID/catalog/iFiction metadata during final audit if the story artifact changes.
- Final package audit notes are complete.
- Craig explicitly approves copying the finished package into `_demo`.

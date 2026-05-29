# Zork III Candidate Package Plan

## Status

- Candidate package plan only.
- Not approved for bundled demo.
- Do not create `_demo` package contents from this plan yet.
- Do not add story files, compiled artifacts, screenshots, art, feelies, helper docs, or package folders in this pass.
- Package creation remains blocked until the artifact basis and final audit are approved.

This document records the likely package shape for a future Zork III TerpVault demo candidate. It is a planning artifact, not a packaging approval.

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
- Frotz smoke test: passed.
- DDEV-only Parchment smoke test: passed for a temporary package.

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
- Export/import smoke test for the complete candidate package.
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

Planned structure only; do not create these files yet.

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
  how-to-play.md
  hints.md
  walkthrough.md
  LICENSE-upstream.txt
  provenance.md
```

Optional feelies should use package-local paths such as:

```text
zork-iii/
  feelies/
    map.png
    command-cheat-sheet.pdf
```

All optional feelies must be original or otherwise clearly licensed for redistribution.

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

Exact IFID, IFDB/IFWiki/catalog fields, final attribution wording, and selected artifact notes must be verified before final package assembly.

## Required Provenance Files

Future package must include:

- `LICENSE-upstream.txt`: exact upstream license text from the selected source basis.
- `provenance.md`: package-local source, build, artifact, asset, helper-doc, screenshot, and redistribution notes.

`provenance.md` should record:

- Upstream repository URL.
- Branch and commit.
- License file path and observed license summary.
- Retrieval date.
- Toolchain and build commands if source-built artifact is selected.
- Selected artifact filename, file identification, and checksum.
- Whether the selected artifact differs from upstream `COMPILED/zork3.z3` / `zork3.zip`.
- DDEV playback/export/import verification dates.
- Authorship/licensing notes for every art/helper/screenshot/feelie file.
- Explicit exclusion of historical commercial assets.

## Helper Docs Plan

Required original helper docs:

- `how-to-play.md`: parser primer, movement/object commands, save/restore expectations, and Zork III-specific play notes.
- `hints.md`: original spoiler-light progressive hints with clear spoiler boundaries.
- `walkthrough.md`: original clearly spoilery route aligned to the exact selected playable artifact.

Do not copy or adapt commercial manuals, Invisiclues, hint books, `invisicluesiii.mss`, online walkthroughs, catalog prose, or marketing text unless redistribution rights are explicit and preserved.

## Art, Screenshots, and Feelies Plan

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

- Write original walkthrough text only after the selected artifact is fixed.
- Verify a complete route against the exact selected playable artifact.
- Prefer a `dfrotz` transcript or equivalent repeatable transcript check.
- Record final score/path result, move count when available, transcript date, interpreter/tool version, and selected story checksum.
- Do not claim full walkthrough verification until the route reaches the intended ending/score against the exact bundled artifact.

## Promotion Checklist

Zork III can move from candidate package plan to bundled-demo review only after:

- Artifact basis is approved.
- Source/provenance and license basis are documented.
- Playable story file is verified.
- DDEV TerpVault/Parchment playback passes.
- `game.yaml` is drafted and reviewed.
- `metadata.iFiction.xml` plan or source is resolved.
- `LICENSE-upstream.txt` and `provenance.md` are complete.
- Original `how-to-play.md`, `hints.md`, and `walkthrough.md` are written.
- Full route/walkthrough verification is complete against the selected artifact.
- Original or properly licensed cover, small cover, hero art, screenshots, and optional feelies are complete.
- Export/import smoke testing passes for the complete package.
- No historical commercial assets are included without separate license review.
- Final package audit notes are complete.
- Craig explicitly approves copying the finished package into `_demo`.

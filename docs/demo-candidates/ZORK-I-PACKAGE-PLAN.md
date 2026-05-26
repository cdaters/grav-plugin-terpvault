# Zork I Finished Demo Package Plan

## Status

- Zork I remains candidate-only.
- Source-build verification has passed.
- Frotz smoke testing has passed.
- DDEV-only TerpVault/Parchment browser playback has passed.
- DDEV-only export/import smoke testing has passed.
- A DDEV-only package shell has been created and manually inspected.
- Core DDEV-only visual assets have been integrated and route/render checked.
- The package is not yet approved for bundled demo.
- Actual `_demo` package creation is still pending.

This is a planning document only. Do not create package contents, copy story files, add art, or bundle generated packages from this plan until a later explicit packaging pass.

## DDEV-only package shell status

Verification date: 2026-05-25.

A local package assembly draft exists only in the DDEV test site:

- Package path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-i`.
- Files present: `game.yaml`, `provenance.md`, `LICENSE-upstream.txt`, `how-to-play.md`, `hints.md`, `walkthrough.md`, and `zork1.z3`.
- Art, screenshots, and feelies are still pending.
- `terpvault.status` is published only for local DDEV route testing. Final demo installer status remains undecided.

Route/checksum results:

- Detail page `https://grav20.ddev.site/if/zork-i` returned `200`.
- Play page `https://grav20.ddev.site/if/zork-i/play` returned `200`.
- Story route `https://grav20.ddev.site/if/_story/zork-i/zork1.z3` returned `200`, 86928 bytes.
- Story route bytes matched the selected source-built artifact SHA-256: `973d3e5a21fba45077e01b1342e17d75db405f45948bca38ccfa9001b7d54917`.

Manual browser inspection result:

- Detail page loads.
- Play page loads.
- Parchment launches.
- The game responds to `look` and `inventory`.
- Helper docs appear and render.

The DDEV shell is suitable for local review and package polish. It does not approve Zork I for bundled demo inclusion.

## DDEV-only visual asset integration status

Verification date: 2026-05-25.

Core visual assets are now present in the DDEV-only package shell:

- `cover.jpg`.
- `small-cover.jpg`.
- `hero.jpg`.
- `screenshots/01.png`.
- `screenshots/02.png`.

Route/render checks passed for the detail page, play page, story route, and controlled `_asset` routes for the four visual assets. The story route checksum still matched the selected source-built artifact SHA-256: `973d3e5a21fba45077e01b1342e17d75db405f45948bca38ccfa9001b7d54917`.

Export-inspect initially found that package-root `provenance.md` and `LICENSE-upstream.txt` were omitted. Narrow package-root support-file export/import handling has since been added and DDEV smoke-tested: the export now includes both files, import inspect accepts them, and import commit restores them into a draft package.

The DDEV package description was also polished with original public-facing copy so the visible About section no longer exposes DDEV/test-package wording. The reported `ParsedownExtra::blockSetextHeader()` deprecation warning was not reproduced in repeated detail-page fetches, though one transient compiled-language cache parse error appeared immediately after cache clear and resolved on refresh.

Remaining asset/package gaps:

- Optional feelies are still pending.
- Final public package copy still needs final review before bundled demo approval.
- Any reproducible Parsdown/deprecation warning or repeated compiled-language cache parse error should be captured with exact text as a separate follow-up.
- Public tag rendering on detail/card views remains a later frontend polish decision.

## Proposed package identity

- Proposed final package slug: `zork-i`.
- Proposed display title: `Zork I`.
- Proposed subtitle/headline: `The Great Underground Empire`.
- Proposed author/credits: preserve original authorship and attribution carefully. Draft wording should credit Infocom and the original Zork I creators, while separately noting the Microsoft/Open Source Programs Office/Xbox/Activision source release and TerpVault package-local curation.
- Proposed story file name: `zork1.z3`.
- Selected source-built artifact basis: `/tmp/terpvault-zork1-build/zork1-release119-serial880429.z3`.
- Selected artifact SHA-256: `973d3e5a21fba45077e01b1342e17d75db405f45948bca38ccfa9001b7d54917`.
- Build basis: source-built from `https://github.com/historicalsource/zork1.git` at commit `97b7b3d68c075dd9af7da499c3e9690ada3471fd` with ZILF/ZAPF 1.8.
- Checksum note: the selected source-built artifact reproduces Release 119 / Serial 880429 header metadata but does not match upstream prebuilt `COMPILED/zork1.z3` / `zork1.zip`.

## Proposed package structure

Do not create these files yet.

```text
zork-i/
  game.yaml
  metadata.iFiction.xml
  zork1.z3
  cover.jpg
  small-cover.jpg
  hero.jpg
  screenshots/
    01.png
    02.png
  how-to-play.md
  hints.md
  walkthrough.md
  feelies/
    map.jpg or map.pdf
    adventurer-notes.pdf or similar if useful
  LICENSE-upstream.txt
  provenance.md
```

## game.yaml plan

Draft planned sections only; do not create the package file yet.

```yaml
id: zork-i
slug: zork-i
identification:
  format: zcode
  ifids:
    - pending-verification
bibliographic:
  title: Zork I
  author: pending-final-attribution-wording
  headline: The Great Underground Empire
  first_published: '1980'
  genre: Interactive Fiction
  language: en
  description: >
    Original curator-written package description. Must avoid copying commercial
    marketing copy, manuals, or online summaries unless separately licensed.
resources:
  story_file: zork1.z3
  cover: cover.jpg
  small_cover: small-cover.jpg
  hero: hero.jpg
  screenshots:
    - screenshots/01.png
    - screenshots/02.png
  how_to_play: how-to-play.md
  hints: hints.md
  walkthrough: walkthrough.md
  feelies:
    - title: Original Map
      path: feelies/map.jpg
      type: map
      description: Original TerpVault-created map, not historical Infocom art.
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
    url: https://github.com/historicalsource/zork1/blob/master/LICENSE
    notes: >
      Candidate package based on verified source release. Historical commercial
      packaging, manuals, maps, ads, logos, trade dress, and scans are excluded.
  source:
    url: https://github.com/historicalsource/zork1.git
    retrieved: '2026-05-24'
    notes: >
      Source-built with ZILF/ZAPF 1.8 from commit
      97b7b3d68c075dd9af7da499c3e9690ada3471fd. Selected artifact:
      zork1-release119-serial880429.z3, SHA-256
      973d3e5a21fba45077e01b1342e17d75db405f45948bca38ccfa9001b7d54917.
terpvault:
  status: draft-or-published-pending-installer-decision
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

Exact IFID, IFDB/IFWiki/catalog fields, final attribution wording, and install status must be verified before final package assembly.

## metadata.iFiction.xml plan

- Generate `metadata.iFiction.xml` from verified package metadata after `game.yaml` wording is final.
- Mark IFID as pending verification until confirmed from a trusted catalog/source or generated in a way consistent with TerpVault conventions.
- Use local TerpVault iFiction preview/apply tooling later to validate metadata shape before final package export/import testing.
- Do not hand-copy iFiction metadata from unverified sources.

## Legal/provenance plan

Record these facts in package-local `provenance.md` and preserve upstream license text in `LICENSE-upstream.txt` or equivalent:

- Upstream repo URL: `https://github.com/historicalsource/zork1.git`.
- Upstream commit: `97b7b3d68c075dd9af7da499c3e9690ada3471fd`.
- License file path: `LICENSE`.
- Observed license: MIT License text.
- Observed copyright line: `Copyright (c) 2025 Microsoft`.
- Retrieval date: 2026-05-24 for source/license verification.
- Source build verification date: 2026-05-25.
- Toolchain: .NET SDK 10.0.300, ZILF 1.8, ZAPF 1.8.
- Natural build command: `zilf zork1.zil`.
- Historical-header reassembly command: `zapf zork1.zap zork1-release119-serial880429.z3 -r 119 -s 880429`.
- Selected output artifact: `zork1-release119-serial880429.z3`.
- Selected output artifact SHA-256: `973d3e5a21fba45077e01b1342e17d75db405f45948bca38ccfa9001b7d54917`.
- Upstream prebuilt comparison: selected source-built artifact does not match upstream prebuilt `COMPILED/zork1.z3` / `zork1.zip`.
- Exclude historical commercial packaging, manuals, maps, ads, logos, trade dress, scans, and marketing art unless separately licensed.
- Use Craig-created art, screenshots, helper docs, maps, and feelies.
- Treat trademarks and branding separately from source-code license.

## Art plan

See [ZORK-I-ASSET-PLAN.md](ZORK-I-ASSET-PLAN.md) for the detailed docs-only asset requirements, current DDEV asset status, and creation workflow.

- `cover.jpg`: Craig-created original art.
- `small-cover.jpg`: Craig-created square or thumbnail-friendly crop.
- `hero.jpg`: Craig-created wide detail/play-page visual.
- `screenshots/01.png`: captured from the DDEV package/play page.
- `screenshots/02.png`: still pending; capture from the final DDEV package/play page.
- Avoid copying Infocom packaging, trade dress, logos, manual art, advertisements, maps, or scans.

## Helper docs plan

- `how-to-play.md`: original parser primer, basic movement/object commands, save/restore expectations, and Zork-specific parser conventions.
- `hints.md`: original spoiler-light progressive hints with clear spoiler boundaries.
- `walkthrough.md`: original clearly spoilery walkthrough aligned to the exact bundled playable version.
- Do not copy Invisiclues, manuals, commercial hint books, online walkthroughs, or catalog prose unless explicitly licensed for redistribution.

## Feelies plan

See [ZORK-I-ASSET-PLAN.md](ZORK-I-ASSET-PLAN.md) for optional feelies scope, legal guardrails, and acceptance checks.

- Optional original map, for example `feelies/map.jpg` or `feelies/map.pdf`.
- Optional adventurer notes, for example `feelies/adventurer-notes.pdf`.
- Optional command cheat sheet if useful.
- No historical scans unless separately licensed.
- Use existing `resources.feelies` conventions with title, path, type, and description.

## Final package verification checklist

- Create package in DDEV first.
- Confirm public detail page works.
- Confirm play page works.
- Confirm Parchment boots and accepts input.
- Confirm story route checksum matches selected artifact.
- Confirm media assets display.
- Confirm helper docs render.
- Confirm feelies links work.
- Confirm export includes package-local provenance and upstream license files.
- Confirm export zip contains expected files and no cruft.
- Confirm import inspect passes.
- Confirm import commit creates a draft package.
- Confirm imported package story checksum matches.
- Update candidate docs with final package verification results.
- Confirm final package polish after original art, screenshots, and feelies are added.
- Only after all checks pass, decide whether to copy into `_demo`.

## Open questions

- Exact IFID.
- Whether package status should install as draft or published in a future demo installer.
- Whether to include source-build logs or only `provenance.md`.
- Whether Zork I alone should ship first before Zork III.
- Final naming, copyright, and attribution wording.
- Final art, screenshot, and feelies scope.

# TerpVault Demo Library

This document defines standards for a curated, rights-aware TerpVault demo/starter library that can eventually live under:

```text
_demo/data/terpvault/games/
```

The starter library should feel finished and distribution-ready, not like placeholder test data. Demo packages must be useful for real first-run evaluation while remaining conservative about licensing, provenance, and redistribution rights.

Use `docs/DEMO-CANDIDATES.md` as the working verification worksheet for individual candidate packages before any package is bundled. Use `docs/DEMO-CONTENT-RIGHTS.md` as the shared demo-content rights/provenance policy.

## Goals

- Provide a first-run starter library for new TerpVault installs.
- Make demo packages useful for testing public library pages, detail pages, play pages, Admin2 media workflows, iFiction metadata preview/apply workflows, feelies/extras, helper docs, import/export, and future demo install workflows.
- Keep packages provenance-reviewed before bundling.
- Prefer original/custom-created art and helper docs when historical assets are not clearly documented for the intended use.
- Keep demo package structure aligned with TerpVault package conventions so each package can also serve as a reference implementation.

## v0.4.x and v0.5.0 posture

- During v0.4.x, continue preparing demo packages incrementally. A candidate can be researched, built, smoke-tested, or documented without becoming bundled.
- Do not add Open Adventure / Colossal Cave, Grue, You Are Standing, or any other real IF package to a public/GPM-ready bundle unless story-file provenance, license terms, build/playback behavior, helper docs, artwork, screenshots, and package metadata are clean.
- Mainframe Zork / Dungeon may be tracked as a research-only candidate, separate from Zork I, Zork II, and Zork III. Do not add story files, playable artifacts, draft package skeletons, package art, or bundled-demo claims until source selection, license/provenance, reference transcripts, build/reconstruction, playback, and helper docs are complete.
- Treat v0.5.0 as the first possible public milestone where the demo suite should feel coherent rather than ad hoc.
- A v0.5.0 candidate demo suite may include Zork I as the verified anchor package. Zork II has now joined the development `_demo` tree after approval, helper-doc polish, final audit, `_demo` copy validation, and clean DDEV seed verification. Zork III has completed that path for the development `_demo` tree.
- Adventure / Colossal Cave, Grue, and You Are Standing may be polished for public/demo use only when their exact rights, package notes, package-local original materials, and any reuse rights for non-original art/helper docs are complete.
- Classify each package item under the shared rights/provenance policy. Generated or Craig-created art/helper docs should be identified honestly and should not imitate restricted packaging, manuals, logos, or trade dress.

## Package completeness checklist

Each finished demo package should include, where appropriate:

- Playable story file.
- `game.yaml`.
- `metadata.iFiction.xml` if available or generated from known metadata.
- Cover image.
- Small cover image.
- Hero image.
- Screenshots.
- `how-to-play.md`.
- `hints.md`.
- `walkthrough.md`.
- Optional feelies/extras such as maps, manuals, clue sheets, or notes.
- Source/provenance notes.
- License/redistribution notes.

Not every work needs every optional resource, but omissions should be intentional. A bundled starter package should not rely on empty placeholder files, unknown-license artwork, or vague provenance.

## Art and asset policy

- Prefer original Craig-created artwork for cover, small cover, hero, maps, screenshots, and feelies.
- Do not use historical commercial box art, manuals, maps, packaging, advertising, or scans unless item-level provenance and review support inclusion.
- When selected historical reference/preservation materials are included, identify them separately from story/source-license material and package-local original material.
- AI-assisted or hand-created art should avoid copying specific copyrighted packaging, trade dress, logos, typography, or advertising layouts.
- Store package-local assets using TerpVault conventions from `docs/PACKAGE-CONVENTIONS.md`.
- Use stable, lowercase, package-local paths where practical, such as `cover.jpg`, `small-cover.jpg`, `hero.jpg`, `screenshots/01.png`, and `feelies/map.png`.
- Treat screenshots as package assets too: verify they are produced from the bundled playable version and do not incorporate unrelated copyrighted material.

## Helper docs policy

- `how-to-play.md` should teach basic commands and platform/story expectations.
- `hints.md` should provide spoiler-light progressive hints when possible.
- `walkthrough.md` should be clearly labeled as spoilery.
- Helper docs should be original writing unless the source license explicitly allows reuse.
- If upstream docs are reused under license, preserve attribution and license notices as required.
- Avoid copying commercial hint books, manuals, clue sheets, Invisiclues-style text, or walkthroughs unless redistribution rights are explicit.

## Candidate package review

| Candidate | Source/repository | License status | Story/package format concerns | Asset plan | Helper docs plan | Ready status |
| --- | --- | --- | --- | --- | --- | --- |
| Zork I | `https://github.com/historicalsource/zork1.git` at verified commit `97b7b3d68c075dd9af7da499c3e9690ada3471fd` | Reviewed for this bundled development demo tree from the verified MIT source release; package preserves upstream license/provenance notes; trademarks and supplemental materials remain separately classified | Bundled Z-machine starter package at `_demo/data/terpvault/games/zork-i`; source-built story checksum documented; release-specific IFID `ZCODE-119-880429`, IFDB TUID/URL, IFWiki URL, and package-local `metadata.iFiction.xml` recorded; DDEV playback/export/import smoke tests passed; walkthrough verified with `dfrotz` to 350/350 against the bundled story file | Package-local original Craig-created cover, small cover, hero, screenshots, and poster-style feelie; additional maps/documents/poster material classified in provenance as historical reference/preservation material or likely commercial material requiring caution | Original TerpVault how-to-play, progressive hints, and clearly spoilery walkthrough with a verified full command route; Rights-Holder Removal Requests / DMCA language present in package provenance | Bundled starter/demo package |
| Zork II | `https://github.com/historicalsource/zork2.git` rechecked on `master` at commit `3da9661098809788a99cef00f00c865c6c204f96`; no tags/releases observed | Reviewed for this bundled development demo tree from the verified MIT source release; trademarks and supplemental materials remain separately classified under `docs/DEMO-CONTENT-RIGHTS.md` | Promoted `_demo` package uses the repaired patched source-built historical-header artifact; `zork2.z3` SHA-256 `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef`, 92414 bytes, Release 63 / Serial 860811; release-specific IFID `ZCODE-63-860811`, IFDB TUID/URL, IFWiki URL, and package-local `metadata.iFiction.xml` are recorded; adopted source patches are `DREARY-ROOM-FCN` build compatibility and `FANTASIES` table-counter repair; dfrotz verification completed to `400/400` in `372` moves, rank `Master Adventurer`; export/import smoke, helper-doc polish, final audit, `_demo` copy validation, and clean DDEV seed verification passed | Package-local cover, small cover, hero art, and gameplay screenshots are included in `_demo`; seven feelies are classified as historical reference/preservation material, historical reference/preservation requiring caution, or likely commercial material requiring caution | Polished original how-to, progressive hints, and verified walkthrough are present; walkthrough completes without `SUPERBRIEF` | Bundled starter/demo package |
| Zork III | `https://github.com/historicalsource/zork3.git` rechecked on `master` at commit `3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8`; no tags/releases observed | Reviewed for this bundled development demo tree from the verified MIT source release; package preserves upstream license/provenance notes; trademarks and supplemental materials remain separately classified | Scratch source build and `dfrotz` smoke were reverified on 2026-05-29; DDEV package assembly, story-route diagnosis, complete-package export/import smoke, full walkthrough transcript verification, release-specific IFID/catalog metadata review, final audit, final route/playback recheck, `_demo` promotion, and clean DDEV demo-seed route/checksum verification passed on 2026-05-31 | Package-local cover, small cover, hero, screenshots, and feelies are included in the bundled `_demo` package with package-level provenance; do not treat source license as covering historical commercial assets | Original helper docs were refreshed on 2026-05-31; walkthrough is verified with `dfrotz -p -m -s 41` against the exact story, reaching 7 of 7 in 330 moves; IFID `ZCODE-25-860811`, IFDB TUID/URL, IFWiki URL, and package-local `metadata.iFiction.xml` are recorded; do not reuse `invisicluesiii.mss` or other commercial helper material without separate rights review | Bundled starter/demo package |
| Mainframe Zork / Dungeon | Phase 0 research packet outside the repo; exact source basis not selected | Research only; license/provenance not verified for bundling; existing reconstructions are comparison witnesses, not automatically canonical | No playable TerpVault package; likely future Glulx/`.gblorb` first, `.z8` only if practical after source/build constraints are clear | No package art until the candidate is reviewed beyond research | Helper docs should wait until story/playback/provenance basis is clean | Research-only candidate; not reviewed for bundled demo |
| Open Adventure / Colossal Cave | Open Adventure project/release source; exact upstream repository, release version, and artifact to record during review | Requires final license/provenance review for the selected source and any compiled artifact | Resolve exact playable target format before bundling; may be better as a source/provenance demo until a web-playable story package is confirmed | Use original Craig-created cave-themed artwork, screenshots from the selected playable version, and optional original maps/notes | Original command primer, spoiler-light hints, and spoilery walkthrough if written from the selected playable version | Candidate only; verify before redistribution |
| Modern permissively licensed IF candidate A | TBD | TBD; require explicit permissive license and redistribution rights | Confirm supported story format, IFID/iFiction metadata, and browser playability | Prefer original package art unless upstream art is clearly licensed | Prefer original helper docs; preserve upstream attribution if reused | TBD |
| Modern permissively licensed IF candidate B | TBD | TBD; require explicit permissive license and redistribution rights | Confirm supported story format, IFID/iFiction metadata, and browser playability | Prefer original package art unless upstream art is clearly licensed | Prefer original helper docs; preserve upstream attribution if reused | TBD |

Zork I, Zork II, and Zork III are now bundled as reviewed starter/demo packages in `_demo`. Mainframe Zork / Dungeon and Open Adventure / Colossal Cave remain candidates only; they require local build/package verification and final license/provenance review before bundling. Mainframe Zork / Dungeon is research-only and should not get `_demo` package contents until it is explicitly reviewed beyond that status.

Admin2 Library Manager can preview draft package cover, small-cover, hero, and screenshot images through authenticated Admin/API media-preview routes. This keeps candidate packages such as DDEV-only Zork II visible in Admin2 without changing public draft visibility; public `/if/_asset/...` routes for draft packages remain blocked.

## Legal/provenance rules

- Follow the shared policy in `docs/DEMO-CONTENT-RIGHTS.md`.
- Do not assume "on IF Archive" means freely redistributable in TerpVault.
- Track license source and retrieval date in `game.yaml` or package-local provenance notes.
- Preserve upstream license files when required.
- Include attribution where required.
- Avoid bundling files with unclear redistribution rights.
- If uncertain, mark "verify before redistribution" and do not ship the package as a bundled demo.
- Keep source/provenance notes close to the package so future maintainers can audit why each file is present.
- Record separate provenance for story files, artwork, helper docs, screenshots, iFiction metadata, and feelies/extras when they come from different sources.
- Treat trademarks and branding separately from copyright license status.
- Include package-level "Rights-Holder Removal Requests / DMCA" language for bundled demo packages.

## Future Admin2 feature: Install Demo Packages

A future Admin2 Install Demo Packages feature should:

- List available bundled demo packages.
- Inspect package validity before install.
- Copy selected packages from `_demo/data/terpvault/games` into the configured games directory.
- Never overwrite existing packages.
- Report installed, skipped, and invalid packages.
- Ignore cruft such as `.DS_Store`, `__MACOSX`, and AppleDouble files.
- Use package validation/import-style safety checks.
- Stay distinct from arbitrary file browsing.

The feature should reuse existing package validation and import/export safety rules where practical. It should treat demo packages as curated plugin-provided inputs, not as a general filesystem picker.

## Open questions

- Whether all Zork source releases should be bundled or only Zork I initially.
- Whether Mainframe Zork / Dungeon should ever be bundled, offered as a separate optional package, or remain a documented research recipe after source/provenance review.
- Whether Open Adventure should be bundled as a compiled/playable story package, a source/provenance demo, or omitted until the exact play format is resolved.
- Which modern permissively licensed IF games are best candidates.
- Whether demo packages should install as draft or published by default.
- Whether demo-package install should be a one-time first-run prompt, an Admin2 action, or both.
- Whether bundled demo packages should be included in any future GPM-ready package or offered as an optional separate artifact.
- Whether v0.5.0 should ship with only the safest minimal demo set or with additional optional demo packages delivered separately.

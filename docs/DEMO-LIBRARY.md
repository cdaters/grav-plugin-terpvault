# TerpVault Demo Library

This document defines standards for a curated, legally clean TerpVault demo/starter library that can eventually live under:

```text
_demo/data/terpvault/games/
```

The starter library should feel finished and distribution-ready, not like placeholder test data. Demo packages must be useful for real first-run evaluation while remaining conservative about licensing, provenance, and redistribution rights.

Use `docs/DEMO-CANDIDATES.md` as the working verification worksheet for individual candidate packages before any package is bundled.

## Goals

- Provide a first-run starter library for new TerpVault installs.
- Make demo packages useful for testing public library pages, detail pages, play pages, Admin2 media workflows, iFiction metadata preview/apply workflows, feelies/extras, helper docs, import/export, and future demo install workflows.
- Keep packages legally clean and provenance-reviewed before bundling.
- Prefer original/custom-created art and helper docs when historical assets are not clearly licensed for redistribution.
- Keep demo package structure aligned with TerpVault package conventions so each package can also serve as a reference implementation.

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
- Do not use historical commercial box art, manuals, maps, packaging, advertising, or scans unless explicitly licensed for redistribution.
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
| Zork I | `https://github.com/historicalsource/zork1.git` at verified commit `97b7b3d68c075dd9af7da499c3e9690ada3471fd` | Approved for this bundled development demo tree from the verified MIT source release; package preserves upstream license/provenance notes; trademarks and historical commercial assets remain excluded | Bundled Z-machine starter package at `_demo/data/terpvault/games/zork-i`; source-built story checksum documented; DDEV playback/export/import smoke tests passed; walkthrough verified with `dfrotz` to 350/350 against the bundled story file | Original Craig-created cover, small cover, hero, screenshots, and poster-style feelie; no historical Infocom packaging or manual scans | Original TerpVault how-to-play, progressive hints, and clearly spoilery walkthrough with a verified full command route | Bundled starter/demo package |
| Zork II | Microsoft/Open Source Programs Office historical source release; exact upstream repo and release artifact to record during review | Source release reported as MIT, but packaging, trademarks, marketing materials, and non-source assets require final review | Requires local build/package verification, likely through a Z-machine build toolchain; confirm produced story file, IFID, format, and web interpreter behavior | Use original Craig-created artwork and package-local extras only; avoid historical commercial assets | Original helper docs only unless a reusable source is explicitly licensed | Candidate only; verify before redistribution |
| Zork III | Microsoft/Open Source Programs Office historical source release; exact upstream repo and release artifact to record during review | Source release reported as MIT, but packaging, trademarks, marketing materials, and non-source assets require final review | Requires local build/package verification, likely through a Z-machine build toolchain; confirm produced story file, IFID, format, and web interpreter behavior | Use original Craig-created artwork and package-local extras only; avoid historical commercial assets | Original helper docs only unless a reusable source is explicitly licensed | Candidate only; verify before redistribution |
| Open Adventure / Colossal Cave | Open Adventure project/release source; exact upstream repository, release version, and artifact to record during review | Requires final license/provenance review for the selected source and any compiled artifact | Resolve exact playable target format before bundling; may be better as a source/provenance demo until a web-playable story package is confirmed | Use original Craig-created cave-themed artwork, screenshots from the selected playable version, and optional original maps/notes | Original command primer, spoiler-light hints, and spoilery walkthrough if written from the selected playable version | Candidate only; verify before redistribution |
| Modern permissively licensed IF candidate A | TBD | TBD; require explicit permissive license and redistribution rights | Confirm supported story format, IFID/iFiction metadata, and browser playability | Prefer original package art unless upstream art is clearly licensed | Prefer original helper docs; preserve upstream attribution if reused | TBD |
| Modern permissively licensed IF candidate B | TBD | TBD; require explicit permissive license and redistribution rights | Confirm supported story format, IFID/iFiction metadata, and browser playability | Prefer original package art unless upstream art is clearly licensed | Prefer original helper docs; preserve upstream attribution if reused | TBD |

Zork I is now bundled as the first reviewed starter/demo package in `_demo`. Zork II, Zork III, and Open Adventure / Colossal Cave remain candidates only; they require local build/package verification and final license/provenance review before bundling.

## Legal/provenance rules

- Do not assume "on IF Archive" means freely redistributable in TerpVault.
- Track license source and retrieval date in `game.yaml` or package-local provenance notes.
- Preserve upstream license files when required.
- Include attribution where required.
- Avoid bundling files with unclear redistribution rights.
- If uncertain, mark "verify before redistribution" and do not ship the package as a bundled demo.
- Keep source/provenance notes close to the package so future maintainers can audit why each file is present.
- Record separate provenance for story files, artwork, helper docs, screenshots, iFiction metadata, and feelies/extras when they come from different sources.
- Treat trademarks and branding separately from copyright license status.

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
- Whether Open Adventure should be bundled as a compiled/playable story package, a source/provenance demo, or omitted until the exact play format is resolved.
- Which modern permissively licensed IF games are best candidates.
- Whether demo packages should install as draft or published by default.
- Whether demo-package install should be a one-time first-run prompt, an Admin2 action, or both.
- Whether bundled demo packages should be included in any future GPM-ready package or offered as an optional separate artifact.

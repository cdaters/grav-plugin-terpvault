# TerpVault Demo Candidate Verification

This is a working verification checklist for future curated TerpVault starter/demo packages.

It supports `docs/DEMO-LIBRARY.md` by tracking exact candidate packages, source, license, build/play format, asset plan, helper-doc plan, and remaining questions. It is not itself a legal opinion.

A candidate does not become bundled or distribution-ready until story file, metadata, assets, helper docs, feelies, and license/provenance notes are complete. Do not claim a candidate is ready to bundle unless the package record shows exact source, exact license, redistribution requirements, and playable packaging status.

## Candidate status legend

- Research
- Build verification needed
- Asset/doc creation needed
- Legal/provenance review needed
- Package assembly needed
- Ready for bundled demo review
- Approved for bundled demo

## Candidate table

| Candidate | Upstream source/repo | License/redistribution status | Playable artifact/build status | TerpVault package format target | Asset plan | Helper docs/feelies plan | Current status | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Zork I](demo-candidates/ZORK-I.md) | `https://github.com/historicalsource/zork1.git` verified at commit `97b7b3d68c075dd9af7da499c3e9690ada3471fd` | Approved for the bundled development demo tree from the verified MIT source release; preserve upstream MIT license text and package-local provenance; historical packaging/assets remain excluded | Source build, Frotz smoke test, DDEV Parchment playback, export/import, and `_demo` package copy completed; walkthrough remains partially Frotz-verified | Bundled Z-machine starter package at `_demo/data/terpvault/games/zork-i` with `game.yaml`, story file, provenance, upstream license, original art, screenshots, helper docs, and one original poster feelie | Craig-created cover, small cover, hero, screenshots from the bundled playable version, and original poster feelie; no historical commercial assets | Original `how-to-play.md`, progressive `hints.md`, and clearly spoilery `walkthrough.md`; full 350-point transcript still pending | Approved for bundled demo; included in `_demo`; walkthrough partially verified | Keep package in `_demo`, preserve provenance/license notes, and run a future full walkthrough transcript before claiming full walkthrough verification |
| [Zork II](demo-candidates/ZORK-II.md) | `https://github.com/historicalsource/zork2.git` verified at commit `3da9661098809788a99cef00f00c865c6c204f96` | Strong candidate basis if MIT source release and redistribution requirements are confirmed; preserve upstream MIT license text and attribution; historical packaging/assets remain excluded unless separately licensed | Not ready; source build attempted but failed before producing a playable artifact | Likely Z-machine story file package after build/playback/package basis is resolved | Craig-created art, screenshots from bundled playable version, and original package-local extras | Original helper docs and feelies only unless upstream reusable docs are explicitly licensed | Candidate only; source-build issue investigation needed; legal/provenance review needed | Use `docs/demo-candidates/ZORK-II.md` to investigate the ZILF build failure and keep out of bundled demos |
| [Zork III](demo-candidates/ZORK-III.md) | `https://github.com/historicalsource/zork3.git` verified at commit `3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8` | Strong candidate basis if MIT source release and redistribution requirements are confirmed; preserve upstream MIT license text and attribution; historical packaging/assets remain excluded unless separately licensed | Not ready for package; source build and Frotz smoke test completed, but TerpVault/Parchment and package verification are pending | Likely Z-machine story file package after package basis is resolved | Craig-created art, screenshots from bundled playable version, and original package-local extras | Original helper docs and feelies only unless upstream reusable docs are explicitly licensed | Candidate only; package/provenance/playback verification needed; legal/provenance review needed | Use `docs/demo-candidates/ZORK-III.md` to continue package planning without creating `_demo` contents |
| Open Adventure / Colossal Cave | Open Adventure project; exact repository, release version, source artifact, and playable artifact path require verification | Strong candidate if exact open-source license and redistribution requirements are confirmed; do not treat unrelated Adventure ports as interchangeable | Not ready; resolve whether to package compiled/playable target, source/provenance demo, or wait for confirmed web-playable format | TBD; possible playable package if supported browser-playable target exists, otherwise omit from bundled demos until resolved | Craig-created cave-themed cover, small cover, hero, screenshots from chosen playable version, and original maps/notes | Original command primer, spoiler-light hints, spoilery walkthrough, and optional original maps/clue notes | Research; build verification needed; legal/provenance review needed | Verify exact repo/release/license, determine playable target path, and test TerpVault play page behavior |
| Modern permissively licensed IF candidate A, TBD | TBD | Must have explicit license allowing redistribution and clear author attribution | Not selected; verify supported story format or feasible browser-playable adapter path | TBD based on selected work and supported format | Prefer original package art unless upstream art is clearly licensed | Prefer original helper docs and optional feelies; preserve upstream attribution if reused | Research | Identify candidate with explicit redistribution rights, IFID/iFiction metadata, and polished small-scope gameplay |
| Modern permissively licensed IF candidate B, TBD | TBD | Must have explicit license allowing redistribution and clear author attribution | Not selected; verify supported story format or feasible browser-playable adapter path | TBD based on selected work and supported format | Prefer original package art unless upstream art is clearly licensed | Prefer original helper docs and optional feelies; preserve upstream attribution if reused | Research | Identify a second candidate that complements candidate A and exercises different TerpVault features |

## Zork trilogy notes

- Treat the Microsoft/Open Source Programs Office/Xbox/Activision MIT source release as a strong candidate basis.
- Verify the exact GitHub repository for each game.
- Preserve upstream MIT license text and attribution requirements.
- Build/package verification is required before bundling.
- Avoid historical commercial packaging, manual scans, maps, ads, logos, and trade dress unless explicitly licensed.
- Prefer Craig-created cover/small-cover/hero art, maps/feelies, screenshots from the bundled playable version, and original how-to-play/hints/walkthrough text.
- Consider bundling Zork I first rather than all three at once.
- Record the selected build toolchain, build command, source revision, output artifact, and artifact checksum before package review.
- Confirm whether generated metadata should come from source, iFiction tooling, catalog research, or curator-authored notes.

## Open Adventure / Colossal Cave notes

- Treat Open Adventure as a strong candidate because it has an explicit open-source project/license, but verify the exact repository, release version, and playable artifact path before bundling.
- Resolve whether TerpVault should package a compiled/playable story target, a source/provenance demo, or wait until a web-playable format is confirmed.
- Use Craig-created cave-themed art, screenshots from the chosen playable version, and original helper docs/feelies.
- Do not treat unrelated Adventure ports as interchangeable without license review.
- Record the selected implementation, release tag or commit, license file, build path, output artifact, and TerpVault interpreter/play strategy.

## Modern permissive IF candidates

Placeholder criteria:

- Must have explicit license allowing redistribution.
- Must have supported story format or a feasible browser-playable adapter path.
- Must have clear author attribution.
- Must allow or not require upstream art/manual assets.
- Prefer works with IFID/iFiction metadata.
- Prefer small, polished works that show TerpVault features well.
- Prefer candidates that exercise package metadata, public detail pages, play pages, screenshots, helper docs, and optional feelies without requiring complex rights review.

## Package readiness checklist

For each candidate, require:

- Story file or playable artifact verified.
- `game.yaml`.
- `metadata.iFiction.xml` if available/generated.
- Cover image.
- Small cover image.
- Hero image.
- Screenshots.
- `how-to-play.md`.
- `hints.md`.
- `walkthrough.md`.
- Optional feelies/extras.
- Source/license files or notes.
- Provenance/retrieved date.
- Export/import test.
- Public detail/play test.
- Admin2 media/feelies/iFiction test.

## Open questions

- Should demo packages install as draft or published?
- Should the starter library include Zork I only at first?
- Should Zork II/III wait until Zork I package conventions are proven?
- What is the best playable format/build path for Zork source releases?
- What is the best playable format/build path for Open Adventure?
- Should demo packages be bundled in the plugin, offered as a separate release artifact, or both?

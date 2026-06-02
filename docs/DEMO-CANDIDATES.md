# TerpVault Demo Candidate Verification

This is a working verification checklist for future curated TerpVault starter/demo packages.

It supports `docs/DEMO-LIBRARY.md` by tracking exact candidate packages, source, license, build/play format, asset plan, helper-doc plan, and remaining questions. It is not itself a legal opinion.

Use `docs/DEMO-CONTENT-RIGHTS.md` for the shared demo-content rights/provenance policy. Candidate records should classify story/source material, package-local original materials, historical reference/preservation materials, third-party materials requiring caution, and uncertain provenance separately.

A candidate does not become bundled or distribution-ready until story file, metadata, assets, helper docs, feelies, and license/provenance notes are complete. Do not claim a candidate is ready to bundle unless the package record shows exact source, exact license, redistribution requirements, and playable packaging status.

## Release-train posture

- v0.4.x candidate work should stay incremental: verify sources, build artifacts, playback, package metadata, helper docs, and assets one candidate at a time.
- v0.5.0 may be evaluated as a public/GPM-readiness milestone only after the demo suite is credible and conservative.
- Zork II remains a candidate until package/playback verification and package-level provenance review are complete. The 2026-06-02 artifact-basis recheck selected the documented patched source-built historical-header artifact, and a DDEV-only draft package has passed route, story-checksum, manifest, and dfrotz smoke checks. It is not in `_demo`. Zork III has completed its review path for this development demo tree and is bundled in `_demo`.
- Open Adventure / Colossal Cave remains a candidate until the exact repository, release, license, playable artifact, and TerpVault play strategy are verified.
- Mainframe Zork / Dungeon remains a research-only candidate. Treat external Phase 0 packet material as research notes, not as bundled source, story, art, or playable package content.
- Grue and You Are Standing may be polished as demos only if exact story-file licensing, source notes, package-local original material notes, and any supplemental material provenance are complete.
- Ink candidates should wait for first-class Ink package/runtime/validation support. Any pre-v0.5.0 Ink work should be labeled experimental and kept separate from parser/Parchment support.

## Candidate status legend

- Research
- Build verification needed
- Asset/doc creation needed
- Legal/provenance review needed
- Package assembly needed
- Ready for bundled demo review
- Reviewed for bundled demo

## Candidate table

| Candidate | Upstream source/repo | License/redistribution status | Playable artifact/build status | TerpVault package format target | Asset plan | Helper docs/feelies plan | Current status | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Zork I](demo-candidates/ZORK-I.md) | `https://github.com/historicalsource/zork1.git` verified at commit `97b7b3d68c075dd9af7da499c3e9690ada3471fd` | Reviewed for the bundled development demo tree from the verified MIT source release; preserve upstream MIT license text and package-local provenance; classify supplemental materials separately | Source build, Frotz smoke test, DDEV Parchment playback, export/import, `_demo` package copy, release-specific IFID/catalog/iFiction metadata, and full `dfrotz` walkthrough verification completed | Bundled Z-machine starter package at `_demo/data/terpvault/games/zork-i` with `game.yaml`, story file, provenance, upstream license, `metadata.iFiction.xml`, original art, screenshots, helper docs, original poster feelie, and additional classified feelies | Craig-created cover, small cover, hero, screenshots from the bundled playable version, original poster feelie, historical reference/preservation maps/documents, and one likely commercial poster image requiring caution | Original `how-to-play.md`, progressive `hints.md`, and clearly spoilery `walkthrough.md`; verified to 350/350 against the bundled story file; IFID `ZCODE-119-880429`, IFDB TUID/URL, IFWiki URL, and Rights-Holder Removal Requests / DMCA language present | Reviewed bundled demo; included in `_demo`; walkthrough fully verified for the bundled story | Keep package in `_demo`, preserve provenance/license notes, and re-run the transcript if the story file changes |
| [Zork II](demo-candidates/ZORK-II.md) | `https://github.com/historicalsource/zork2.git` rechecked at commit `3da9661098809788a99cef00f00c865c6c204f96` on `master`; no tags/releases observed | Strong candidate basis if MIT source release and redistribution requirements are confirmed; preserve upstream MIT license text and attribution; historical packaging/assets remain excluded unless separately reviewed | DDEV-only draft package assembled from patched source-built historical-header artifact `zork2-release63-serial860811.z3`; DDEV story target `zork2.z3` has SHA-256 `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`, size 92412, Release 63 / Serial 860811; route/story/helper-doc checks and dfrotz smoke passed; IFID/catalog/iFiction and export/import still pending | Z-machine DDEV draft package only; no `_demo` package yet | Craig-created art, screenshots from the selected bundled playable version, and original package-local extras; classify any historical reference/preservation materials under the shared policy; no feelies copied yet | Placeholder helper docs only; final how-to, hints, walkthrough, and walkthrough verification pending | Candidate only; DDEV package restored to draft | Add final helper docs, metadata/iFiction, screenshots/art, feelies classification, export/import smoke, final audit, and approval before any `_demo` work |
| [Zork III](demo-candidates/ZORK-III.md) | `https://github.com/historicalsource/zork3.git` rechecked at commit `3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8` on `master`; no tags/releases observed | Reviewed for the bundled development demo tree from the verified MIT source release; preserve upstream MIT license text and attribution; classify supplemental materials separately | Source build and `dfrotz` smoke were reverified in scratch on 2026-05-29; DDEV package assembly, story-route diagnosis, complete-package export/import smoke, full walkthrough transcript verification, release-specific IFID/catalog metadata review, final audit, final route/playback recheck, `_demo` promotion, and clean demo-seed route/checksum verification passed on 2026-05-31 | Bundled Z-machine starter package at `_demo/data/terpvault/games/zork-iii`; see [candidate package plan](demo-candidates/ZORK-III-PACKAGE-PLAN.md) | Package-local art, screenshots, and feelies were copied into the bundled `_demo` package with package-level provenance; see [asset/materials plan](demo-candidates/ZORK-III-ASSET-PLAN.md) | Original helper docs were refreshed in the DDEV-only package on 2026-05-31 and copied into `_demo`; walkthrough is verified with `dfrotz -p -m -s 41` against the exact story, reaching 7 of 7 in 330 moves; IFID `ZCODE-25-860811`, IFDB TUID/URL, IFWiki URL, and package-local `metadata.iFiction.xml` are recorded; do not reuse `invisicluesiii.mss` without separate rights review | Reviewed bundled demo; included in `_demo`; walkthrough fully verified for the bundled story | Keep package in `_demo`; re-run route/checksum checks if package files or installer behavior change |
| Mainframe Zork / Dungeon | Phase 0 research packet exists outside the repo; exact source basis not selected | Research-only; license/provenance not verified for TerpVault bundling; do not treat any existing reconstruction as automatically canonical | No TerpVault playable artifact; no story file should be copied or bundled in this pass | Likely future Glulx/`.gblorb` first if practical; `.z8` only if reconstruction and constraints make it realistic | No package art until source/playback/provenance path is reviewed beyond research | Helper docs, transcripts, and provenance notes should be written only after the selected playable basis is clean | Research only; not reviewed for bundled demo | Select exact source basis, verify license/provenance, establish reference runner, compare transcripts, choose target story format, then build/reconstruct before any package work |
| Open Adventure / Colossal Cave | Open Adventure project; exact repository, release version, source artifact, and playable artifact path require verification | Strong candidate if exact open-source license and redistribution requirements are confirmed; do not treat unrelated Adventure ports as interchangeable | Not ready; resolve whether to package compiled/playable target, source/provenance demo, or wait for confirmed web-playable format | TBD; possible playable package if supported browser-playable target exists, otherwise omit from bundled demos until resolved | Craig-created cave-themed cover, small cover, hero, screenshots from chosen playable version, and original maps/notes | Original command primer, spoiler-light hints, spoilery walkthrough, and optional original maps/clue notes | Research; build verification needed; legal/provenance review needed | Verify exact repo/release/license, determine playable target path, and test TerpVault play page behavior |
| Modern permissively licensed IF candidate A, TBD | TBD | Must have explicit license allowing redistribution and clear author attribution | Not selected; verify supported story format or feasible browser-playable adapter path | TBD based on selected work and supported format | Prefer original package art unless upstream art is clearly licensed | Prefer original helper docs and optional feelies; preserve upstream attribution if reused | Research | Identify candidate with explicit redistribution rights, IFID/iFiction metadata, and polished small-scope gameplay |
| Modern permissively licensed IF candidate B, TBD | TBD | Must have explicit license allowing redistribution and clear author attribution | Not selected; verify supported story format or feasible browser-playable adapter path | TBD based on selected work and supported format | Prefer original package art unless upstream art is clearly licensed | Prefer original helper docs and optional feelies; preserve upstream attribution if reused | Research | Identify a second candidate that complements candidate A and exercises different TerpVault features |

## Zork trilogy notes

- Treat the Microsoft/Open Source Programs Office/Xbox/Activision MIT source release as a strong candidate basis.
- Verify the exact GitHub repository for each game.
- Preserve upstream MIT license text and attribution requirements.
- Build/package verification is required before bundling.
- Avoid historical commercial packaging, manual scans, maps, ads, logos, and trade dress unless item-level provenance and review support inclusion.
- Prefer Craig-created cover/small-cover/hero art, maps/feelies, screenshots from the bundled playable version, and original how-to-play/hints/walkthrough text. Classify historical reference/preservation materials separately if any are added.
- Consider bundling Zork I first rather than all three at once.
- Record the selected build toolchain, build command, source revision, output artifact, and artifact checksum before package review.
- Confirm whether generated metadata should come from source, iFiction tooling, catalog research, or curator-authored notes.
- Zork II's 2026-06-02 DDEV-only package uses the scratch-only `DREARY-ROOM-FCN` compatibility patch with historical release/serial reassembly; initial DDEV/Parchment routes and story checksum passed, but final package docs, metadata, materials, export/import, audit, and approval remain before any `_demo` promotion.
- Zork III has stronger scratch build/playback evidence, complete-package export/import smoke coverage, a full-potential walkthrough verified with `dfrotz`, release-specific IFID/catalog/iFiction metadata, a passed final audit, Craig approval, a bundled `_demo` package, and a passed clean DDEV demo-seed route/checksum verification.

### Local ZILF/ZAPF scratch tooling

- `zilf` is not installed on `PATH` in the current local environment.
- A scratch-built ZILF/ZAPF 1.8 toolchain currently exists under:

```text
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/
```

- Current direct invocation examples:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf --version
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf --version
```

- `/tmp` is volatile. Future candidate work should move this to a stable tooling location or add a documented setup/helper script that locates or configures ZILF/ZAPF without requiring a global install.
- Future builds should write source checkouts, `.zap` files, story outputs, transcripts, and any other generated files only to scratch locations outside the TerpVault repository.
- Compiled artifacts should not be committed until the selected package provenance, playback behavior, helper docs, screenshots/art plan, and package audit are complete.

## Open Adventure / Colossal Cave notes

- Treat Open Adventure as a strong candidate because it has an explicit open-source project/license, but verify the exact repository, release version, and playable artifact path before bundling.
- Resolve whether TerpVault should package a compiled/playable story target, a source/provenance demo, or wait until a web-playable format is confirmed.
- Use Craig-created cave-themed art, screenshots from the chosen playable version, and original helper docs/feelies.
- Do not treat unrelated Adventure ports as interchangeable without license review.
- Record the selected implementation, release tag or commit, license file, build path, output artifact, and TerpVault interpreter/play strategy.

## Mainframe Zork / Dungeon notes

- Keep Mainframe Zork separate from the existing Zork I, Zork II, and Zork III package tracks.
- Treat the Phase 0 material as research only. Do not copy story files, playable artifacts, draft package skeletons, package art, or anything that implies bundled-demo approval.
- The future goal is a playable Mainframe Zork / Dungeon experience in TerpVault, but only after the evidence chain is clean.
- Likely path: select the exact source basis, verify license/provenance, establish a reference runner, compare reference transcripts, choose a target story format, build or reconstruct the work, and then create a TerpVault package only after story/playback/provenance/helper docs are complete.
- Glulx/`.gblorb` is the likely first target if the reconstruction needs more space or modern library support. `.z8` should be considered only if practical after source and build constraints are understood.
- Existing Z-code reconstructions such as `zdungeon.z5` are useful witnesses or comparison artifacts, but they should not be treated as automatically canonical.
- Do not bundle Mainframe Zork until legal/provenance/build/playback/helper docs are complete and the candidate is explicitly moved out of research-only status.

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
- Package-level "Rights-Holder Removal Requests / DMCA" language.

## Open questions

- Should demo packages install as draft or published?
- Should the starter library include Zork I only at first?
- Should Zork II/III wait until Zork I package conventions are proven?
- What is the best playable format/build path for Zork source releases?
- What is the best playable format/build path for Open Adventure?
- Should demo packages be bundled in the plugin, offered as a separate release artifact, or both?

# Zork III Demo Candidate Verification

## Status

- Candidate only.
- Upstream repo verified on 2026-05-25.
- Upstream repo rechecked on 2026-05-29 for branch, commit, tags/releases, license, source layout, and prebuilt artifacts.
- License/provenance reviewed from observed repository files only.
- Source build verified on 2026-05-25.
- Source build reverified in fresh scratch on 2026-05-29.
- Frotz smoke test passed for source-built historical-header variants.
- `dfrotz` smoke test passed on 2026-05-29 for the source-built historical-header artifact.
- A real DDEV-only candidate package was assembled on 2026-05-29 at `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii`.
- The DDEV-only candidate package includes the verified story artifact, `game.yaml`, upstream license copy, provenance, original first-pass helper docs, Craig-created/original image assets, and two screenshots.
- Not approved for bundled demo.
- Requires final package audit, full walkthrough transcript verification, export/import verification, IFID/catalog/iFiction decisions, and Craig approval before any `_demo` promotion.
- Candidate package plan: [ZORK-III-PACKAGE-PLAN.md](ZORK-III-PACKAGE-PLAN.md).
- Candidate asset/materials plan: [ZORK-III-ASSET-PLAN.md](ZORK-III-ASSET-PLAN.md).
- Next state: complete final package verification without copying anything into `_demo`.

Zork III must not be treated as ready to bundle until the source, license, build output, TerpVault package contents, assets, helper docs, and provenance notes are verified and complete.

## Upstream source verified

- Exact GitHub repository URL: `https://github.com/historicalsource/zork3.git`.
- Branch verified: `master`.
- Exact commit verified and rechecked: `3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8`.
- Latest commit observed: `2025-11-21T01:34:48+09:00`, `Update README.md`.
- Tags/releases observed: no local tags, no remote tags from `git ls-remote --tags origin`, and no GitHub releases returned by `gh release list --repo historicalsource/zork3 --limit 20`. Rechecked on 2026-05-29 with the same result.
- License file path: `LICENSE`.
- License status: observed file appears to be MIT License text.
- Attribution/copyright line: `Copyright (c) 2025 Microsoft`.
- Historical commercial assets: no commercial packaging, manuals, maps, ads, logos, trade dress, scans, images, PDFs, or generated package assets were observed in the repository file listing. One text source file named `invisicluesiii.mss` was observed; do not treat it as package-ready helper text without separate provenance and redistribution review.

## License/provenance checklist

- Preserve upstream MIT license text if packaging proceeds.
- Record retrieval date: 2026-05-25.
- Record source URL, branch, and commit hash.
- Avoid historical commercial packaging, manuals, maps, ads, logos, trade dress, and scans unless separately licensed.
- Use Craig-created art, screenshots, helper docs, maps, and feelies later.
- Treat trademarks separately from source-code license.
- Do not bundle until redistribution requirements and package-local provenance are documented.
- Record whether any selected generated playable artifact is covered by the same license path as the verified source.

## Verification notes

- Scratch checkout location: `/tmp/terpvault-zork3-build`.
- Docs-only recheck checkout: `/private/tmp/terpvault-zork3-doccheck`.
- Repository URL: `https://github.com/historicalsource/zork3.git`.
- Branch: `master`.
- Commit: `3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8`.
- Source language/format: ZIL (Zork Implementation Language), with `.zil` source files and related source/build-side files including `zork3.zil`, `3actions.zil`, `3dungeon.zil`, `actions.zil`, `dungeon.zil`, `clock.zil`, `demons.zil`, `macros.zil`, `main.zil`, `parser.zil`, `shadow.zil`, `syntax.zil`, `tm.zil`, `verbs.zil`, `.zap` files, `zork3.chart`, `zork3.errors`, `zork3.record`, `zork3.serial`, `zork3.xzap`, and `zork3freq.xzap`.
- README build context: the README says there is currently no known way to compile the source into a final ZIP file using the original Infocom process, says some repositories include `.ZIP` files from final spin-down, and describes the source as a ZIL snapshot from the Infocom development system.
- Natural top-level ZIL file identified: `zork3.zil`.
- Prebuilt story artifacts observed: `COMPILED/zork3.z3` and `zork3.zip`.
- Prebuilt artifact file identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- `COMPILED/zork3.z3` SHA-256: `b637a242865d059890184164ce8dec28554cc80901dcbf26c740b2d1ed0d4eb8`.
- `zork3.zip` SHA-256: `b637a242865d059890184164ce8dec28554cc80901dcbf26c740b2d1ed0d4eb8`.
- Treat the prebuilt artifacts cautiously. This pass did not establish that either prebuilt artifact is package-ready for TerpVault.
- The 2026-05-29 docs-only recheck did not run a new build and did not produce new compiled artifacts. It only inspected repository metadata, source files, license text, README notes, and existing upstream prebuilt files in `/private/tmp`.

## Build tooling verification

Verification date: 2026-05-25.

This pass used scratch paths outside the TerpVault repo. No source/tool repository, generated story file, screenshot, image, or package content was created or copied into this repository.

.NET SDK:

- Executable: `/usr/local/share/dotnet/dotnet`.
- SDK version: `10.0.300`.

ZILF/ZAPF:

- Scratch checkout/build path: `/tmp/terpvault-zilf-verification`.
- ZILF executable: `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf`.
- ZAPF executable: `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf`.
- `zilf` was not available on `PATH` during the 2026-05-29 docs-only recheck, but the scratch-built ZILF/ZAPF executables above were still present.
- ZILF repo branch: `branch/default`.
- ZILF repo commit: `e1434a03a5f82b931234f52c07fe5f43ff7ea7d6`.
- ZILF version: `1.8`.
- ZAPF version: `1.8`.

Frotz:

- Executable: `/opt/homebrew/bin/frotz`.
- Version: `FROTZ V2.55`.
- Smoke-test commands used inside Frotz:

```text
look
inventory
quit
y
```

## Build attempt

Source build was completed in scratch only.

Default build command:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf zork3.zil
```

Result:

- Built successfully with ZILF 1.8 / ZAPF 1.8.
- Output banner: `Renovated ZORK III: The Dungeon Master`.
- Warnings: `26 warnings (26 suppressed)`.
- Output: `zork3.z3`, 87858 bytes.
- File identification: `Infocom (Z-machine 3, Release 0, Serial 260525)`.
- SHA-256: `97df06476b066bd37843329d116233d0e478c8c288272d8fe78a09cf73a37733`.

Historical release/serial reassembly command:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork3.zap zork3-release25-serial860811.z3 -r 25 -s 860811
```

Result:

- Built successfully.
- Output: `zork3-release25-serial860811.z3`, 87858 bytes.
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Frotz smoke test: passed.

Historical release/serial no-creator reassembly command:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork3.zap zork3-release25-serial860811-nocreator.z3 -r 25 -s 860811 -N
```

Result:

- Built successfully.
- Output: `zork3-release25-serial860811-nocreator.z3`, 87858 bytes.
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- SHA-256: `2b5e26dc4961b24dc62682ed11c662d339532266d9236508993809129974b8a8`.
- Frotz smoke test: passed.

## Artifact result

- Generated artifact filename: `zork3.z3`.
- Generated artifact SHA-256: `97df06476b066bd37843329d116233d0e478c8c288272d8fe78a09cf73a37733`.
- Historical-header artifact filename: `zork3-release25-serial860811.z3`.
- Historical-header artifact SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Historical-header no-creator artifact filename: `zork3-release25-serial860811-nocreator.z3`.
- Historical-header no-creator artifact SHA-256: `2b5e26dc4961b24dc62682ed11c662d339532266d9236508993809129974b8a8`.
- Upstream prebuilt `COMPILED/zork3.z3` and `zork3.zip` file identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- Upstream prebuilt `COMPILED/zork3.z3` and `zork3.zip` SHA-256: `b637a242865d059890184164ce8dec28554cc80901dcbf26c740b2d1ed0d4eb8`.
- Comparison with upstream `COMPILED/zork3.z3`: neither source-built historical-header artifact matched the upstream prebuilt checksum.
- TerpVault/Parchment local browser playback test: passed on 2026-05-25 for the DDEV-only `zork-iii-test` package.

## Frotz smoke test

- Source-built historical-header artifact tested: `zork3-release25-serial860811.z3`.
- Source-built historical-header no-creator artifact tested: `zork3-release25-serial860811-nocreator.z3`.
- Commands used: `look`, `inventory`, `quit`, `y`.
- Result: both artifacts launched, accepted commands, displayed game output, and responded to quit confirmation successfully.

## TerpVault/Parchment local playback test

Verification date: 2026-05-25.

Temporary DDEV-only package:

- Package path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii-test`.
- Story file in temporary package: `zork3.z3`.
- Source-built artifact copied into DDEV package: `/tmp/terpvault-zork3-build/zork3-release25-serial860811.z3`.
- Source-built artifact SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- DDEV copy was not added to the TerpVault plugin repo.

Routes tested:

- Detail page: `https://grav20.ddev.site/if/zork-iii-test` returned `200 text/html; charset=utf-8`.
- Play page: `https://grav20.ddev.site/if/zork-iii-test/play` returned `200 text/html; charset=utf-8`.
- Story route: `https://grav20.ddev.site/if/_story/zork-iii-test/zork3.z3` returned `200 application/octet-stream`, 87858 bytes.
- Bundled Parchment route: `https://grav20.ddev.site/if/_engine/parchment` returned `200 text/html; charset=utf-8`.

Playback/bootstrap findings:

- The play page rendered an iframe pointing at `/if/_engine/parchment`.
- The iframe `story` payload referenced `https://grav20.ddev.site/if/_story/zork-iii-test/zork3.z3`, format `zcode`, and title `Zork III Local Test`.
- The downloaded story route bytes matched the selected source-built artifact checksum.
- Manual browser playback URL: `https://grav20.ddev.site/if/zork-iii-test/play`.
- Manual browser result: Parchment loaded, showed the game banner, and accepted/responded to `look` and `inventory`.

## Export/import smoke test

Verification date: 2026-05-25.

Temporary DDEV-only source package:

- Package path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii-test`.
- Story file: `zork3.z3`.
- Story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.

Export result:

- Export was performed through the existing TerpVault package archive service inside the DDEV site because unauthenticated API curl returned `401`.
- Scratch export path inside DDEV container: `/tmp/zork-iii-test.terpvault.zip`.
- Export size: 61855 bytes.
- Zip contents:
  - `zork-iii-test/`
  - `zork-iii-test/game.yaml`
  - `zork-iii-test/zork3.z3`
- No `.DS_Store`, `__MACOSX`, AppleDouble, or other macOS cruft entries were present.

Import inspect result:

- Import inspect was performed through the existing TerpVault package import service inside the DDEV site.
- Result: ok.
- Metadata read: title `Zork III Local Test`, candidate slug `zork-iii-test`, story file `zork3.z3`.
- Fatal errors: none.
- Warnings: existing source slug collision, missing `metadata.iFiction.xml`, and draft-forcing note. These are expected for this temporary candidate/test package.

Import commit result:

- Import commit was performed only after confirming `zork-iii-import-test` did not already exist.
- Imported temporary slug: `zork-iii-import-test`.
- Imported package path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii-import-test`.
- Import result: ok.
- Import was forced to draft status.
- Imported story SHA-256 matched the source temporary package story SHA-256.

Imported draft route check:

- Grav cache was cleared after import.
- Detail route `https://grav20.ddev.site/if/zork-iii-import-test` returned `404`.
- Play route `https://grav20.ddev.site/if/zork-iii-import-test/play` returned `404`.
- Story route `https://grav20.ddev.site/if/_story/zork-iii-import-test/zork3.z3` returned `404`.
- This is expected for a draft-forced imported package while public TerpVault routes hide unpublished packages.

## DDEV-only candidate package assembly

Verification date: 2026-05-29.

This pass assembled a real candidate package only in the local DDEV data library. No `_demo` package contents, story files, compiled artifacts, package folders, image assets, helper docs, runtime code, Parchment files, or release metadata were added to the TerpVault plugin repository.

Package path:

- `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii`.

Files created in the DDEV-only package:

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

Story artifact:

- Source scratch artifact: `/tmp/terpvault-zork3-verify-20260529/zork3-release25-serial860811.z3`.
- Package story filename: `zork3.z3`.
- SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.

Package materials:

- `LICENSE-upstream.txt` was copied from the verified upstream checkout license file.
- `provenance.md` records the source repo, commit, toolchain, build commands, artifact checksum/file ID, upstream prebuilt difference, smoke checks, DDEV package status, image/helper-doc authorship notes, and excluded commercial/historical assets.
- `how-to-play.md`, `hints.md`, and `walkthrough.md` were written as original first-pass package-local helper docs.
- `walkthrough.md` is explicitly a draft route pending transcript verification; it does not claim a complete score/path verification.
- Images were copied from `/Users/cdaters/Downloads/for-Zork3` and treated as Craig-created/original package art/screenshots for this candidate pass.

Manifest and route checks:

- Manifest route `https://grav20.ddev.site/if/_manifest` returned `200 application/json`.
- Manifest includes `zork-iii` with `status: draft`, `format: zcode`, `story_file: zork3.z3`, `has_story_file: true`, and `player.engine: parchment`.
- Manifest exposes declared resources for cover, small cover, hero, screenshots, how-to-play, hints, and walkthrough.
- Manifest warnings: one expected `missing-ifid` warning because IFID remains unverified.
- Manifest errors: none.
- The package was temporarily changed to `published` only long enough to verify public routes, then restored to `draft` and cache was cleared.
- Detail route `https://grav20.ddev.site/if/zork-iii` returned `200 text/html; charset=utf-8` during the temporary publish check.
- Play route `https://grav20.ddev.site/if/zork-iii/play` returned `200 text/html; charset=utf-8` during the temporary publish check.
- The play page included a Parchment iframe boot payload pointing at `/if/_story/zork-iii/zork3.z3`, format `zcode`, title `Zork III`.
- DDEV-internal story route check returned `200 application/octet-stream`, 87858 bytes, and SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- DDEV-internal cover and small-cover asset checks returned `200 image/jpeg`.
- Host-side screenshot and hero asset checks returned `200` and matched the source image checksums.
- Host-side binary/asset curl checks intermittently hit an existing Grav compiled-cache parse error on some `_story`/asset requests; DDEV-internal route checks succeeded and matched expected bytes. Recheck host-side binary delivery before `_demo` promotion.
- Final package status after verification: `draft`.

## Fresh scratch verification pass

Verification date: 2026-05-29.

This pass used scratch paths outside the TerpVault repo. No source checkout, generated `.zap` file, story file, transcript, package folder, screenshot, image, helper doc, or package content was created or copied into this repository.

Tool availability:

- `zilf` on `PATH`: not found.
- `zapf` on `PATH`: not found.
- Scratch ZILF executable: `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf`.
- Scratch ZILF version: `1.8`.
- Scratch ZAPF executable: `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf`.
- Scratch ZAPF version: `1.8`.
- `frotz`: `/opt/homebrew/bin/frotz`, `FROTZ V2.55`.
- `dfrotz`: `/opt/homebrew/bin/dfrotz`, `FROTZ V2.55` dumb interface.

Fresh checkout:

- Scratch checkout path: `/tmp/terpvault-zork3-verify-20260529`.
- Clone source: `https://github.com/historicalsource/zork3.git`.
- Checked out commit: `3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8`.
- Checkout status before build: clean.
- Local tags observed in checkout: none.
- Upstream prebuilt `COMPILED/zork3.z3` SHA-256: `b637a242865d059890184164ce8dec28554cc80901dcbf26c740b2d1ed0d4eb8`.
- Upstream prebuilt `zork3.zip` SHA-256: `b637a242865d059890184164ce8dec28554cc80901dcbf26c740b2d1ed0d4eb8`.
- Upstream prebuilt file identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.

Build commands run in scratch only:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf zork3.zil
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork3.zap zork3-release25-serial860811.z3 -r 25 -s 860811
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork3.zap zork3-release25-serial860811-nocreator.z3 -r 25 -s 860811 -N
```

Build result:

- ZILF output banner: `Renovated ZORK III: The Dungeon Master`.
- ZILF warnings: `26 warnings (26 suppressed)`.
- Generated default artifact: `zork3.z3`, 87858 bytes.
- Generated default artifact file identification: `Infocom (Z-machine 3, Release 0, Serial 260528)`.
- Generated default artifact SHA-256: `e0f913ac2ee9fb43c1ae3344ffcf03427745f7670c0ee36d51c43bfc1a85abb9`.
- Historical-header artifact: `zork3-release25-serial860811.z3`, 87858 bytes.
- Historical-header artifact file identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- Historical-header artifact SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Historical-header no-creator artifact: `zork3-release25-serial860811-nocreator.z3`, 87858 bytes.
- Historical-header no-creator artifact file identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- Historical-header no-creator artifact SHA-256: `2b5e26dc4961b24dc62682ed11c662d339532266d9236508993809129974b8a8`.
- Comparison with upstream prebuilt artifact: the source-built historical-header artifact still differs from upstream `COMPILED/zork3.z3` / `zork3.zip`, which both have SHA-256 `b637a242865d059890184164ce8dec28554cc80901dcbf26c740b2d1ed0d4eb8`.

`dfrotz` smoke test:

- Artifact tested: `zork3-release25-serial860811.z3`.
- Command input: `look`, `inventory`, `quit`, `y`.
- Result: passed. The game launched, displayed the `Release 25 / Serial number 860811` banner, accepted commands, displayed room/inventory output, and reached quit confirmation.

DDEV/Parchment smoke test:

- Skipped in this pass to keep the work scratch-only and avoid creating temporary package folders or story-file copies outside the plugin repo.
- Prior DDEV-only Parchment smoke evidence from 2026-05-25 remains recorded above.
- Re-run DDEV/Parchment playback when a complete candidate package exists with final metadata, provenance, art, screenshots, and helper docs.

## DDEV-only temporary package smoke test

Verification date: 2026-05-29.

This pass created a temporary package only in the local DDEV site data directory. No `_demo` package, plugin-repo story file, compiled artifact, package folder, art, screenshot, feelie, helper doc, runtime code, Parchment file, or release metadata was created or changed in the TerpVault plugin repository.

Temporary package:

- Path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii-temp`.
- Story file: `zork3.z3`.
- Source artifact copied from scratch: `/tmp/terpvault-zork3-verify-20260529/zork3-release25-serial860811.z3`.
- Story SHA-256 in DDEV package: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Story file identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- Minimal resources only: `game.yaml` and `zork3.z3`.
- No cover, screenshots, art, feelies, or helper docs were added.

Package status handling:

- The package was first created as `terpvault.status: draft`.
- `/if/_manifest` included `zork-iii-temp` with `status: draft`, `format: zcode`, `player.engine: parchment`, `story_file: zork3.z3`, and story/detail/play URLs.
- Public detail/play/story routes returned 404 while the package was draft, which is expected because public TerpVault routes hide unpublished packages.
- The temporary DDEV-only package was then changed to `terpvault.status: published` so public route and Parchment boot checks could run.
- The temporary package was left in place as published for manual browser testing at `https://grav20.ddev.site/if/zork-iii-temp/play`.

Published route checks from the host:

- `https://grav20.ddev.site/if`: `200 text/html; charset=utf-8`.
- `https://grav20.ddev.site/if/zork-iii-temp`: `200 text/html; charset=utf-8`.
- `https://grav20.ddev.site/if/zork-iii-temp/play`: `200 text/html; charset=utf-8`.
- `https://grav20.ddev.site/if/_manifest`: `200 application/json`.
- `https://grav20.ddev.site/if/_story/zork-iii-temp/zork3.z3`: `200 application/octet-stream`, 87858 bytes.
- `https://grav20.ddev.site/if/_engine/parchment`: `200 text/html; charset=utf-8`.

Published manifest result:

- Slug: `zork-iii-temp`.
- Status: `published`.
- Format: `zcode`.
- Story file: `zork3.z3`.
- `has_story_file`: `true`.
- Player engine: `parchment`.
- Error count: `0`.
- Warning count: `7`, expected for a minimal temporary package without IFID, cover, helper docs, or final license review.

Story route checksum:

- Downloaded host-side route output: `/private/tmp/terpvault-zork3-story-host.z3`.
- SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.

Parchment boot check:

- The play page rendered a TerpVault player shell for `zork-iii-temp`.
- The page contains an iframe pointing at `/if/_engine/parchment`.
- The iframe `story` payload references `https://grav20.ddev.site/if/_story/zork-iii-temp/zork3.z3`, format `zcode`, and title `Zork III Temporary Verification`.
- Browser automation for confirming the in-game banner and typed commands was not available in this session because the required browser-control Node tool was not exposed.
- Manual follow-up: open `https://grav20.ddev.site/if/zork-iii-temp/play`, confirm Parchment loads the game banner, confirm `Release 25 / Serial number 860811` appears, and confirm `look` / `inventory` produce game output.

Container-internal curl note:

- `ddev exec curl` returned `200` for `/if`, `/if/zork-iii-temp/play`, `/if/_manifest`, and `/if/_engine/parchment`.
- `ddev exec curl` returned `500` for `/if/zork-iii-temp` and `/if/_story/zork-iii-temp/zork3.z3`, with a Grav compiled-file parse error containing bytes from the story file.
- Host-side requests to the same URLs returned `200`; treat the container-internal curl behavior as a local DDEV/Grav request-path quirk to recheck later, not as evidence that the host browser playback route is unavailable.

## Packaging recommendation

- Keep Zork III candidate-only.
- Not approved for bundled demo.
- Do not create `_demo` package contents yet.
- Use [ZORK-III-PACKAGE-PLAN.md](ZORK-III-PACKAGE-PLAN.md) as the docs-only package-planning checklist; it does not approve bundling or artifact commits.
- Use [ZORK-III-ASSET-PLAN.md](ZORK-III-ASSET-PLAN.md) as the docs-only materials checklist for `game.yaml`, provenance, upstream license, iFiction metadata, helper docs, art, screenshots, and optional feelies.
- Recommended eventual package artifact remains the source-built `zork3-release25-serial860811.z3`, not the `-N` no-creator variant, unless a later decision says otherwise.
- Do not bundle `zork3.zip` or `COMPILED/zork3.z3` unless an explicit later packaging decision selects the upstream prebuilt artifact and documents the basis.
- Do not mark Zork III package-ready until package metadata, provenance notes, full TerpVault/Parchment playback, export/import, original art, screenshots, helper docs, maps, and feelies are complete.
- Do not use commercial packaging, manual, map, ad, logo, trade-dress, or scan assets.
- Use Craig-created art, screenshots, helper docs, maps, and feelies later.

## Remaining blockers

- Decide whether the source-built `zork3-release25-serial860811.z3`, source provenance, or some combination is appropriate for the package.
- Record selected artifact filename, file identification, checksum, and redistribution basis in package-local provenance notes.
- Verify full TerpVault/Parchment browser playback behavior.
- Create package metadata and package-local provenance notes.
- Create original package art, screenshots, helper docs, maps, and feelies.
- Package export/import smoke testing has passed only for DDEV-only temporary packages; a final package export/import test remains pending once real package metadata/assets/docs exist.
- Run package export/import smoke tests once a package exists.

## Recommended next action

Keep Zork III candidate-only and use [ZORK-III-PACKAGE-PLAN.md](ZORK-III-PACKAGE-PLAN.md) for the next docs-only package-planning pass. Proceed to package assembly only after the package metadata, package-local provenance notes, TerpVault/Parchment playback test plan, export/import smoke test plan, original art plan, screenshot plan, helper docs, maps, and feelies are ready and approved. Do not create `_demo` package contents yet.

## Promotion checklist against Zork I standard

Before Zork III can move from candidate to bundled demo review, it still needs:

- Final decision on source-built artifact versus upstream prebuilt artifact.
- Source/provenance and license basis documented for the selected artifact.
- Playable story file verified against the selected basis.
- Final TerpVault/Parchment playback verification for the selected package candidate.
- Package metadata drafted.
- Original how-to-play, hints, and walkthrough text.
- Screenshots captured from the selected bundled playable version.
- Original or properly licensed cover, small cover, hero art, and any feelies.
- Explicit exclusion of historical commercial packaging, manuals, maps, ads, logos, trade dress, scans, `invisicluesiii.mss`, and other commercial helper material unless separately licensed.
- Package-local audit notes, upstream license text, export/import smoke tests, and final review.

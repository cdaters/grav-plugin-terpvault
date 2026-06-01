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
- The DDEV-only candidate package includes the verified story artifact, `game.yaml`, upstream license copy, provenance, revised original helper docs, Craig-created/original image assets, two screenshots, and Craig-created/original package-local feelies.
- Craig-created/original feelies were added to the DDEV-only draft package on 2026-05-31 and documented in package provenance.
- `walkthrough.md` was expanded on 2026-05-31 into a Zork I-style, human-readable route guide using local solution files as route references; full end-to-end transcript verification passed with `dfrotz -p -m -s 41`, reaching 7 of 7 in 330 moves.
- Release-specific IFID/catalog metadata was resolved and package-local `metadata.iFiction.xml` was created on 2026-05-31.
- Final audit and final route/playback recheck passed on 2026-05-31.
- Not approved for bundled demo.
- Requires Craig approval and a dedicated `_demo` promotion pass before any bundled demo copy.
- Candidate package plan: [ZORK-III-PACKAGE-PLAN.md](ZORK-III-PACKAGE-PLAN.md).
- Candidate asset/materials plan: [ZORK-III-ASSET-PLAN.md](ZORK-III-ASSET-PLAN.md).
- Next state: Craig approval review without copying anything into `_demo`.

Zork III should not be copied to `_demo` until Craig approves the final-audited DDEV package and a dedicated promotion pass reruns the route/checksum checks from the bundled location.

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
- `feelies/frobozzco-annual-report.pdf`.
- `feelies/shareholder-letter.pdf`.
- `feelies/stock-certificate.pdf`.
- `feelies/zork-iii-map.pdf`.
- `feelies/zug-map-inside.jpg`.
- `feelies/zug-map-outside.jpg`.

## DDEV-only feelies and helper-doc refresh

Verification date: 2026-05-31.

This pass updated only the local DDEV candidate package and repo documentation. No `_demo` contents, story files, package folders, PDFs, JPGs, compiled artifacts, runtime code, Admin2 files, Parchment files, or release metadata were added to the TerpVault plugin repository.

Package path:

- `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii`.

Source feelie folder:

- `/Users/cdaters/Downloads/for-Zork3`.

Feelies copied into the DDEV-only package:

- `Zork 3 - FrobozzCo International Annual Report.pdf` to `feelies/frobozzco-annual-report.pdf`.
  - SHA-256: `a470dccd170d208ba957e8a2ce77399f11628eb0ab985352d5ac4b83fbc59ab5`.
- `Zork 3 - Shareholder Letter.pdf` to `feelies/shareholder-letter.pdf`.
  - SHA-256: `7f9dc53c0d32756030f9b08cf527f38d7eeab6ef7d0229a6ef3ebe1d54e2e89f`.
- `Zork 3 - Stock Certificate.pdf` to `feelies/stock-certificate.pdf`.
  - SHA-256: `2a2f2ff59658e525ba35a1c1b607ae3f9f9149066707fbd21571740a25893266`.
- `Zork 3 - Map.pdf` to `feelies/zork-iii-map.pdf`.
  - SHA-256: `588a461158932c977f0fbd4df5dddf0998713f1237d42146a83fb5850f4175bc`.
- `Zork 3 - ZUG Map Inside.jpg` to `feelies/zug-map-inside.jpg`.
  - SHA-256: `9d453239ea484ee626b39c0021b53efa037a92c29a5039debbd1c7eb527e5f7e`.
- `Zork 3 - ZUG Map Outside.jpg` to `feelies/zug-map-outside.jpg`.
  - SHA-256: `0b5e0db2504d6592e2d25fe379eb791752bf857827f2ae21c90a43fa5623c845`.

The feelies are treated as Craig-created/original package-local materials. No historical Infocom commercial scans/assets, manuals, maps, Invisiclues, packaging, logos, or trade dress were used for this feelies pass. Final audit passed; these files are still not approved for `_demo` or public/GPM distribution until Craig approval and a dedicated promotion pass.

`game.yaml` was updated with `resources.feelies` entries for the six package-local feelies. `provenance.md` now records source folder, copied package paths, checksums, authorship, exclusion notes, and redistribution status.

The player-facing helper docs were revised:

- `how-to-play.md`: expanded into a spoiler-light player guide with parser basics, movement, looking/examining, inventory, save/restore, mapping, and Zork III-specific expectations.
- `hints.md`: expanded into progressive hint ladders by broad area/theme, with spoiler boundaries and cautious wording.
- `walkthrough.md`: revised as a clearly spoilery, player-usable route guide and then updated with the verified command route.

Walkthrough status: verified for the exact DDEV package artifact. On 2026-05-31, `/Users/cdaters/Downloads/for-Zork3/zork3.sol1.txt` and `/Users/cdaters/Downloads/for-Zork3/zork3.sol2.txt` were used as route references only; the package-facing prose was rewritten as original TerpVault text. A final `dfrotz` 2.55 fixed-seed route reached the Treasury ending and reported `Your potential is 7 of a possible 7, in 330 moves.`

Walkthrough verification:

- Target story: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/zork3.z3`.
- Target story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Interpreter: `dfrotz` / Frotz 2.55 dumb interface.
- Command: `/opt/homebrew/bin/dfrotz -p -m -s 41 /Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/zork3.z3 < /private/tmp/zork3-route-working-20260531.txt > /private/tmp/zork3-transcript-working-20260531.txt`.
- Scratch route candidate: `/private/tmp/zork3-route-working-20260531.txt`.
- Scratch transcript: `/private/tmp/zork3-transcript-working-20260531.txt`.
- Scratch debug notes: `/private/tmp/zork3-route-debug-notes-20260531.md`.
- Route iterations recorded: 15.
- Result: ending reached; final score 7 of 7; final move count 330.
- Package provenance now records the solution references, transcript path, interpreter, checksum, route iterations, final score, and verified walkthrough state.

Route/manifest check after this pass:

- Final manifest route returned `200`.
- Manifest includes `zork-iii` as `draft`.
- Manifest includes the six `resources.feelies` entries and helper doc resource paths.
- Manifest warning count: 1, expected `missing-ifid`.
- Manifest error count: 0.
- After the walkthrough rewrite, the manifest still returned `200`, still listed `zork-iii` as `draft`, still exposed `walkthrough.md`, and still had one expected missing-IFID warning with zero errors.
- Temporary publish check returned `200` for detail, play, one PDF feelie, one JPG feelie, and `how-to-play.md`.
- After the walkthrough rewrite, a temporary publish check returned `200` for detail, play, and `/if/_asset/zork-iii/walkthrough.md`; the package was restored to `draft`.
- Temporary publish story route returned `200` but delivered a 204-byte Grav compiled-cache parse-error response instead of story bytes; treat story delivery as not verified in this pass.
- Package was restored to `draft` after temporary publish checking.
- After the verified walkthrough update, cache was cleared and the manifest returned `200` with `zork-iii` still `draft`, `walkthrough.md` present, one expected missing-IFID warning, and zero errors.
- A temporary publish check after the verified walkthrough update returned `200` for the play route, `200 text/markdown` for `/if/_asset/zork-iii/walkthrough.md`, and `200 application/octet-stream` for `/if/_story/zork-iii/zork3.z3`; the story bytes matched SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- The same temporary publish detail route returned `200` with a 224-byte Grav compiled-cache parse-error body from `/cache/compiled/files/7f545128d99067b0c61724e5611ef549.yaml.php`, consistent with the known local Grav compiled-YAML cache issue. The package was restored to `draft` and cache was cleared.

IFID/iFiction metadata review on 2026-05-31:

- Local extractor tools checked: `babel`, `treaty`, `rezrov`, `txd`, `ztools`, plus Homebrew binary-name search for Babel/Treaty/IFID/Z-code tooling.
- Result: no local Treaty/Babel-compatible IFID extraction tool was available.
- Story-string inspection found the serial string `860811`, but no IFID, UUID, iFiction, Treaty, or other authoritative IFID metadata string.
- Follow-up public metadata research checked IFDB, IFWiki, IF Archive search/index pages, the Treaty of Babel, the local story file, and the already documented upstream source repository.
- IFDB lists multiple Zork III IFIDs, including `ZCODE-25-860811`; the local package artifact is Release 25 / Serial 860811; the Treaty of Babel legacy Z-code rule maps pre-1990 Z-code IFIDs as `ZCODE-{release}-{serial}`.
- IFID accepted for this package artifact: `ZCODE-25-860811`.
- IFWiki and IFDB also emphasize Release 17 / Serial 840727 and IFID `ZCODE-17-840727` as current/final public metadata; that applies to a different Zork III release and was not written into this Release 25 package.
- `game.yaml` now records `identification.ifids: [ZCODE-25-860811]`, IFDB TUID/URL, IFWiki URL, and a cleaner verified author field.
- Package-local `metadata.iFiction.xml` was created from verified fields only.
- Post-metadata manifest check returned `200`; `zork-iii` remained `draft`, IFID `ZCODE-25-860811` and catalog links were exposed, `metadata.iFiction.xml` was detected, warning count was zero, and error count was zero.
- Post-metadata temporary publish check returned `200` for detail, play, and story routes; story route returned `application/octet-stream`, 87858 bytes, with SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`. Canonical `zork-iii` was restored to `draft` and cache was cleared.

Package status after this pass: `draft`.

## Final audit

Final audit date: 2026-05-31.

Result: passed for Craig approval review and later `_demo` promotion planning. The package remains candidate-only and draft in DDEV; it has not been copied to `_demo`.

Audit evidence:

- Expected package files are present, including `metadata.iFiction.xml`, helper docs, screenshots, and six feelies.
- Stale local `.bak-*` backup files were found in the DDEV-only package and removed; the follow-up cruft scan found no `.DS_Store`, `__MACOSX`, AppleDouble, editor backup, temp, swap, or lock files.
- `game.yaml` parsed successfully with DDEV PHP/YAML.
- `metadata.iFiction.xml` validated with `xmllint --noout`.
- Final draft manifest returned `200`, exposed IFID `ZCODE-25-860811`, detected `metadata.iFiction.xml`, and reported warning count `0`, error count `0`.
- Final temporary publish route check returned `200` for detail, play, story, walkthrough, cover, and one PDF feelie route after one cache clear resolved a local Grav compiled-YAML cache parse error on the first play-route attempt.
- Story route returned `200 application/octet-stream`, 87858 bytes, SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- The annual-report feelie route returned `200 application/pdf`, 584120 bytes, SHA-256 `a470dccd170d208ba957e8a2ce77399f11628eb0ab985352d5ac4b83fbc59ab5`.
- The package was restored to `draft` and Grav cache was cleared after route testing.

Final recommendation: ready for Craig approval. After approval, run a separate `_demo` promotion pass and recheck routes/checksums from the bundled location.

## Story route delivery diagnosis

Verification date: 2026-05-31.

This pass diagnosed the 204-byte parse-error response previously seen from `https://grav20.ddev.site/if/_story/zork-iii/zork3.z3`. The issue did not reproduce after the current Grav cache clear.

Package and manifest checks:

- DDEV package status before route testing: `draft`.
- Local package story file: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/zork3.z3`.
- Local story size: 87858 bytes.
- Local story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Local file identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.
- Draft manifest included `zork-iii` with `has_story_file: true`, `resources.story_file: zork3.z3`, story/detail/play URLs, one expected `missing-ifid` warning, and no errors.
- Draft story route returned `404 text/plain`, which is expected while public routes hide unpublished packages.

Temporary publish checks:

- Detail route: `200 text/html; charset=utf-8`, 39784 bytes.
- Play route: `200 text/html; charset=utf-8`, 18137 bytes.
- Host story route: `200 application/octet-stream`, 87858 bytes.
- Host story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Host `_file` route: `200 application/octet-stream`, 87858 bytes.
- Host `_file` SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Host cover route: `200 image/jpeg`, 263156 bytes.
- Host small-cover route: `200 image/jpeg`, 263156 bytes.
- Host annual-report feelie route: `200 application/pdf`, 584120 bytes.
- DDEV-internal story route: `200 application/octet-stream`, 87858 bytes.
- DDEV-internal story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- DDEV-internal cover route: `200 image/jpeg`, 263156 bytes.
- DDEV-internal annual-report feelie route: `200 application/pdf`, 584120 bytes.

Zork I comparison:

- `https://grav20.ddev.site/if/_story/zork-i/zork1.z3` returned `200 application/octet-stream`, 86928 bytes.
- Zork I story SHA-256: `973d3e5a21fba45077e01b1342e17d75db405f45948bca38ccfa9001b7d54917`.
- Zork I file identification: `Infocom (Z-machine 3, Release 119, Serial 880429)`.
- Zork I and Zork III both use `resources.story_file` with a package-local `.z3` filename.

Code-path review:

- Story serving is handled by `TerpVaultPlugin::serveStoryFile()` and `TerpVaultPlugin::serveFile()`.
- The route resolves the package through `GameRepository::find()`, resolves the package-local path through `GamePackage::storyPath()`, checks the configured allowed story extension, sets binary headers, calls `readfile()`, and exits.
- Package warnings do not block story delivery.
- Draft/published status does affect public story/detail/play routes because `show_unpublished` is false; temporary publish is required for public route checks.
- No slug, Roman-numeral, hyphen, `.z3`, or package metadata issue was found.

Log/cache findings:

- The earlier 204-byte response matched PHP parse errors from Grav compiled YAML cache files, not TerpVault package files.
- Current web logs still contained older parse errors for compiled files generated from `/var/www/html/user/plugins/relatedpages/blueprints.yaml` and `/var/www/html/system/blueprints/config/security.yaml`.
- After cache rebuild, those compiled files were present as valid PHP arrays.
- Diagnosis: the prior failure was consistent with a stale/corrupt Grav compiled-YAML cache state, not a Zork III package metadata/path issue and not a TerpVault story-route bug.

Outcome:

- No runtime code changes were made.
- Zork III story route was verified to serve the expected 87858-byte story bytes while temporarily published.
- Package was restored to `draft` and cache was cleared after testing.

## Complete package export/import smoke test

Verification date: 2026-05-31.

This pass exported and re-imported the complete DDEV-only Zork III candidate package. No `_demo` contents, plugin-repo package files, exported zips, story files, PDFs, JPGs, compiled artifacts, runtime code, Parchment files, or release metadata were changed.

Canonical package:

- Package path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii`.
- Package status before and after test: `draft`.
- Story SHA-256 before export: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Manifest status before export: `draft`, `has_story_file: true`, warning count `1`, error count `0`.

Export result:

- Export was performed through `PackageArchiveService` inside the DDEV site.
- Export path inside DDEV container: `/tmp/zork-iii-export-test.terpvault.zip`.
- Export size: 18604153 bytes.
- Export SHA-256: `c1fe020d7720d096cb1ff4bcb9ed7954e55973febdd717ab8c48b690e0290607`.
- Zip hygiene: passed. No `.DS_Store`, `__MACOSX`, AppleDouble, editor backup files, `.bak-*`, lock files, temp files, scratch logs, or source-build files were present.
- The package folder contains old backup files, but the export service correctly excluded them.

Zip contents:

- `zork-iii/game.yaml`.
- `zork-iii/zork3.z3`.
- `zork-iii/LICENSE-upstream.txt`.
- `zork-iii/provenance.md`.
- `zork-iii/how-to-play.md`.
- `zork-iii/hints.md`.
- `zork-iii/walkthrough.md`.
- `zork-iii/cover.jpg`.
- `zork-iii/small-cover.jpg`.
- `zork-iii/hero.jpg`.
- `zork-iii/screenshots/01.png`.
- `zork-iii/screenshots/02.png`.
- `zork-iii/feelies/frobozzco-annual-report.pdf`.
- `zork-iii/feelies/shareholder-letter.pdf`.
- `zork-iii/feelies/stock-certificate.pdf`.
- `zork-iii/feelies/zork-iii-map.pdf`.
- `zork-iii/feelies/zug-map-inside.jpg`.
- `zork-iii/feelies/zug-map-outside.jpg`.

Extract verification:

- Extract scratch path inside DDEV container: `/tmp/zork-iii-export-inspect-20260531`.
- Extracted story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Extracted feelie SHA-256 values matched the canonical package copies:
  - `frobozzco-annual-report.pdf`: `a470dccd170d208ba957e8a2ce77399f11628eb0ab985352d5ac4b83fbc59ab5`.
  - `shareholder-letter.pdf`: `7f9dc53c0d32756030f9b08cf527f38d7eeab6ef7d0229a6ef3ebe1d54e2e89f`.
  - `stock-certificate.pdf`: `2a2f2ff59658e525ba35a1c1b607ae3f9f9149066707fbd21571740a25893266`.
  - `zork-iii-map.pdf`: `588a461158932c977f0fbd4df5dddf0998713f1237d42146a83fb5850f4175bc`.
  - `zug-map-inside.jpg`: `9d453239ea484ee626b39c0021b53efa037a92c29a5039debbd1c7eb527e5f7e`.
  - `zug-map-outside.jpg`: `0b5e0db2504d6592e2d25fe379eb791752bf857827f2ae21c90a43fa5623c845`.

Import inspect result:

- Result: ok.
- Fatal errors: none.
- Ignored files: none.
- Included package files: 18.
- Candidate slug from the zip: `zork-iii`.
- Expected warnings:
  - Existing package folder collision for `zork-iii`; import commit required a new slug.
  - Future import commit should force imported packages to draft status.

Import commit result:

- Preferred throwaway slug `zork-iii-import-test` already existed, so it was not overwritten.
- Imported throwaway slug: `zork-iii-import-test-20260531`.
- Imported package path: `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii-import-test-20260531`.
- Import result: ok.
- Import was forced to `draft` and `featured: false`.
- Imported story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Imported helper docs, images, screenshots, feelies, `LICENSE-upstream.txt`, and `provenance.md` were present.
- Imported manifest status after cache clear: `draft`, `has_story_file: true`, warning count `1`, error count `0`.
- Only expected imported manifest warning: missing IFID.

Temporary publish check for imported package:

- Detail route: `200 text/html; charset=utf-8`, 40057 bytes.
- Play route: `200 text/html; charset=utf-8`, 18263 bytes.
- Story route: `200 application/octet-stream`, 87858 bytes.
- Story route SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- Cover asset route: `200 image/jpeg`, 263156 bytes.
- Annual-report feelie route: `200 application/pdf`, 584120 bytes.
- Imported package was restored to `draft` and cache was cleared after route testing.

Cleanup decision:

- The throwaway package `zork-iii-import-test-20260531` was left in the DDEV package library as `draft` for inspection.
- The canonical `zork-iii` package remains `draft`.

Story artifact:

- Source scratch artifact: `/tmp/terpvault-zork3-verify-20260529/zork3-release25-serial860811.z3`.
- Package story filename: `zork3.z3`.
- SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- File identification: `Infocom (Z-machine 3, Release 25, Serial 860811)`.

Package materials:

- `LICENSE-upstream.txt` was copied from the verified upstream checkout license file.
- `provenance.md` records the source repo, commit, toolchain, build commands, artifact checksum/file ID, upstream prebuilt difference, smoke checks, DDEV package status, image/feelie/helper-doc authorship notes, and excluded commercial/historical assets.
- `how-to-play.md`, `hints.md`, and `walkthrough.md` were written as original package-local helper docs and refreshed on 2026-05-31.
- `walkthrough.md` now includes a verified command route for the exact DDEV package story artifact: `dfrotz -p -m -s 41` reached the Treasury ending and reported 7 of 7 in 330 moves.
- Metadata pass on 2026-05-31 added IFID `ZCODE-25-860811`, IFDB TUID/URL, IFWiki URL, and package-local `metadata.iFiction.xml`.
- Images were copied from `/Users/cdaters/Downloads/for-Zork3` and treated as Craig-created/original package art/screenshots for this candidate pass.

Manifest and route checks:

- Manifest route `https://grav20.ddev.site/if/_manifest` returned `200 application/json`.
- Manifest includes `zork-iii` with `status: draft`, `format: zcode`, `story_file: zork3.z3`, `has_story_file: true`, and `player.engine: parchment`.
- Manifest exposes declared resources for cover, small cover, hero, screenshots, how-to-play, hints, and walkthrough.
- Manifest warning after the earlier assembly pass: one expected `missing-ifid` warning before the later metadata pass resolved the release-specific IFID.
- Manifest errors: none.
- The package was temporarily changed to `published` only long enough to verify public routes, then restored to `draft` and cache was cleared.
- Detail route `https://grav20.ddev.site/if/zork-iii` returned `200 text/html; charset=utf-8` during the temporary publish check.
- Play route `https://grav20.ddev.site/if/zork-iii/play` returned `200 text/html; charset=utf-8` during the temporary publish check.
- The play page included a Parchment iframe boot payload pointing at `/if/_story/zork-iii/zork3.z3`, format `zcode`, title `Zork III`.
- DDEV-internal story route check returned `200 application/octet-stream`, 87858 bytes, and SHA-256 `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`.
- DDEV-internal cover and small-cover asset checks returned `200 image/jpeg`.
- Host-side screenshot and hero asset checks returned `200` and matched the source image checksums.
- A later 2026-05-31 diagnosis verified host-side and DDEV-internal story delivery after cache clear. The prior host-side parse-error response was consistent with stale/corrupt Grav compiled-YAML cache files unrelated to TerpVault packages.
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
- The DDEV-only package is ready for Craig approval after final package metadata/provenance review, final TerpVault/Parchment route checks, and final audit passed on 2026-05-31.
- Do not use commercial packaging, manual, map, ad, logo, trade-dress, or scan assets.
- Use Craig-created art, screenshots, helper docs, maps, and feelies later.

## Remaining blockers

- Craig approval.
- Actual `_demo` promotion pass after approval.
- Re-run route/playback and package checksum checks during the eventual `_demo` promotion pass.

## Recommended next action

Keep Zork III candidate-only until Craig approves it. The DDEV-only package now has verified story delivery, export/import smoke coverage, feelies, helper docs, a verified walkthrough route, release-specific IFID/catalog metadata, package-local iFiction XML, and a passed final audit. It is ready for Craig approval and later `_demo` promotion planning, but it has not been copied to `_demo`.

## Promotion checklist against Zork I standard

Before Zork III can move from candidate to bundled demo review, it still needs:

- Craig approval.
- A dedicated `_demo` promotion pass that copies the approved package and reruns route/playback checks from the bundled location.
- Explicit exclusion of historical commercial packaging, manuals, maps, ads, logos, trade dress, scans, `invisicluesiii.mss`, and other commercial helper material unless separately licensed.
- Package-local audit notes, upstream license text, export/import smoke tests, and final review are already present in the DDEV-only package.

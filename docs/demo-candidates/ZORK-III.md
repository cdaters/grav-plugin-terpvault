# Zork III Demo Candidate Verification

## Status

- Candidate only.
- Upstream repo verified on 2026-05-25.
- License/provenance reviewed from observed repository files only.
- Source build verified on 2026-05-25.
- Frotz smoke test passed for source-built historical-header variants.
- Not approved for bundled demo.
- Requires package verification, TerpVault/Parchment playback verification, original package assets, helper docs, screenshots, and provenance notes.
- Next state: package/provenance/playback verification needed.

Zork III must not be treated as ready to bundle until the source, license, build output, TerpVault package contents, assets, helper docs, and provenance notes are verified and complete.

## Upstream source verified

- Exact GitHub repository URL: `https://github.com/historicalsource/zork3.git`.
- Branch verified: `master`.
- Exact commit verified: `3ec9ed412b5f3cafe65d83c727d07db1fe4a86a8`.
- Latest commit observed: `2025-11-21T01:34:48+09:00`, `Update README.md`.
- Tags/releases observed: no local tags, no remote tags from `git ls-remote --tags origin`, and no GitHub releases returned by `gh release list --repo historicalsource/zork3 --limit 20`.
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

## Packaging recommendation

- Keep Zork III candidate-only.
- Not approved for bundled demo.
- Do not create `_demo` package contents yet.
- Recommended eventual package artifact is probably the source-built `zork3-release25-serial860811.z3`, not the `-N` no-creator variant, unless a later decision says otherwise.
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

Keep Zork III candidate-only and proceed with package-planning work only after the package metadata, package-local provenance notes, TerpVault/Parchment playback test plan, export/import smoke test plan, original art plan, screenshot plan, helper docs, maps, and feelies are ready. Do not create `_demo` package contents yet.

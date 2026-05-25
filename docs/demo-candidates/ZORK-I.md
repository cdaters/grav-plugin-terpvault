# Zork I Demo Candidate Verification

## Status

- Candidate only.
- Upstream repo verified on 2026-05-24.
- License/provenance reviewed from observed repository files only.
- Source build verified on 2026-05-25.
- Requires package verification.
- Requires original package assets and helper docs.
- Next state: package/provenance/playback verification needed.

Zork I must not be treated as ready to bundle until the source, license, build output, TerpVault package contents, assets, helper docs, and provenance notes are verified and complete.

## Upstream source to verify

- Exact GitHub repository URL: `https://github.com/historicalsource/zork1.git`.
- Branch verified: `master`.
- Exact commit verified: `97b7b3d68c075dd9af7da499c3e9690ada3471fd`.
- Tags/releases observed: no local tags, no remote tags from `git ls-remote --tags origin`, and no GitHub releases returned by `gh release list --repo historicalsource/zork1 --limit 20`.
- License file path and license text summary: `LICENSE`; appears to be MIT License text.
- Attribution/copyright line observed in license: `Copyright (c) 2025 Microsoft`.
- Whether source includes build notes: `README.md` includes source/build context, states the files are ZIL, notes historical ZILCH/TOPS20 usage, and notes user-maintained ZILF can compile the `.ZIL` files with minor issues. It does not provide an exact build command in the repository.
- Whether the source repo includes or does not include historical commercial assets: no commercial packaging, manuals, maps, ads, logos, trade dress, or scans were observed in the repository file listing. Observed files are ZIL/source-related files, repository docs/license, and prebuilt Z-machine artifacts.

Do not treat this as final packaging approval. Record the repository, source revision, license file, build toolchain, build command, artifact checksum, and package-specific provenance before creating package contents.

## Verification notes

Verification date: 2026-05-24.

- Scratch checkout location: `/tmp/terpvault-zork1-verification`.
- Repository URL: `https://github.com/historicalsource/zork1.git`.
- Branch: `master`.
- Commit: `97b7b3d68c075dd9af7da499c3e9690ada3471fd`.
- Latest commit observed: `2025-11-21 01:27:37 +0900`, `Update README.md`.
- Tags/releases: none observed via local `git tag --list`, remote `git ls-remote --tags origin`, or `gh release list --repo historicalsource/zork1 --limit 20`.
- Official announcement context checked separately: Microsoft Open Source Blog announced on 2025-11-20 that Microsoft OSPO, Team Xbox, and Activision made Zork I, II, and III available under MIT License, focused on code, and did not include commercial packaging/marketing materials or trademark/brand rights.

License/provenance findings:

- License path: `LICENSE`.
- License status: observed file appears to be MIT License text.
- Attribution/copyright line: `Copyright (c) 2025 Microsoft`.
- Repository README says this is a source code directory for Infocom's Zork I, including files used and discarded in production, and says the contributed source represents a snapshot of the Infocom development system at shutdown.
- No separate commercial packaging, manuals, maps, ads, logos, trade dress, scans, or marketing assets were observed in the checkout.
- No legal conclusion is made here beyond observed repository contents.

Source/build notes summary:

- Source language/format: ZIL (Zork Implementation Language), with `.zil` source files and related source/build-side files including `parser.cmp`, `zork1.chart`, `zork1.errors`, `zork1.record`, `zork1.serial`, and `zork1freq.xzap`.
- README build context: Infocom historically used TOPS20 and ZILCH; the README says there is currently no known way to compile with an official Infocom compiler, and says user-maintained ZILF has been shown to compile these `.ZIL` files with minor issues.
- Repository build path: no exact command, script, Makefile, or documented ZILF/ZAPF invocation was observed.
- Local tooling check on 2026-05-25: .NET SDK, ZILF/ZAPF, and Frotz were available outside the TerpVault repo for scratch build verification.
- Build attempt: completed from source in scratch with ZILF 1.8 / ZAPF 1.8.

Available files/artifacts summary:

- Source files observed: `zork1.zil`, `1actions.zil`, `1dungeon.zil`, `gclock.zil`, `gglobals.zil`, `gmacros.zil`, `gmain.zil`, `gparser.zil`, `gsyntax.zil`, and `gverbs.zil`.
- Prebuilt story artifacts observed: `COMPILED/zork1.z3` and `zork1.zip`.
- `file` identifies both artifacts as `Infocom (Z-machine 3, Release 119, Serial 880429)`.
- `COMPILED/zork1.z3` and `zork1.zip` have identical SHA-256: `37084966477dff679282de42974b2077156b1bd68fad92a65d4ea94d8eb64d79`.
- Treat the prebuilt artifacts cautiously. The README states `.ZIP` files in some Infocom source repositories were present at final spin-down and the means to create them is currently lost; this pass did not establish that either prebuilt artifact is package-ready for TerpVault.

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
- Latest ZILF repo commit observed: `e1434a03a5f82b931234f52c07fe5f43ff7ea7d6`, `2026-05-13 23:46:24 -0700`, `Fix INSERT-HELD-WORD truncation bug`.
- ZILF version: `1.8`.
- ZAPF version: `1.8`.

Frotz:

- Executable: `/opt/homebrew/bin/frotz`.
- Version output:

```text
FROTZ V2.55
Curses interface.
Audio output enabled.
Commit date: 2025-02-01 14:36:37 -0800
Git commit: acf205585a9472d27c07c0fe62da4b8bc89d1ec7
Official release.
```

- Smoke-test commands used inside Frotz:

```text
look
inventory
quit
y
```

- Both source-built historical-header variants launched and responded successfully in Frotz:
  - `zork1-release119-serial880429.z3`.
  - `zork1-release119-serial880429-nocreator.z3`.

## Tooling discovered

ZILF/ZAPF upstream:

- Main project/repository: `https://foss.heptapod.net/zilf/zilf`.
- GitHub mirror observed: `https://github.com/taradinoc/zilf`.
- Project summary: ZILF is a ZIL compiler/tool suite; ZAPF is the included Z-machine assembler used after ZILF compilation.
- License observed from the GitHub mirror: GPL-3.0 for the project, with README notes also referring to separate ZILF library/runtime license terms for relevant surrounding code.
- Current release observed from the GitHub mirror/IFWiki search results: ZILF 1.8, dated 2026-04-08.
- Build requirement observed from the upstream README: .NET 10 SDK.
- Upstream build command observed: `dotnet build Zilf.sln`.
- Upstream test command observed: `dotnet test Zilf.sln`.
- Typical installed usage observed: `zilf mygame.zil`, which should produce a story file such as `mygame.z3`; ZAPF is part of the installed/compiler toolchain path.

## Build attempt

Build from source was completed in scratch.

Zork I source checkout:

- Scratch checkout: `/tmp/terpvault-zork1-build`.
- Repository: `https://github.com/historicalsource/zork1.git`.
- Commit: `97b7b3d68c075dd9af7da499c3e9690ada3471fd`.

Default build command:

```sh
zilf zork1.zil
```

Result:

- Built successfully with ZILF 1.8 / ZAPF 1.8.
- Output banner: `Renovated ZORK I: The Great Underground Empire`.
- Warnings: `28 warnings (26 suppressed)`.
- Visible warnings were ZSCII 9 tab warnings in `1DUNGEON.zil` for Z-machine version 3.
- Output: `zork1.z3`, 86928 bytes.
- File identification: `Infocom (Z-machine 3, Release 0, Serial 260525)`.
- SHA-256: `2ede50b5b2346e6078de8ab1fcee8631c377d66d856333fb00ff39e9c77ba6b6`.

Historical release/serial reassembly command:

```sh
zapf zork1.zap zork1-release119-serial880429.z3 -r 119 -s 880429
```

Result:

- Built successfully.
- Output: `zork1-release119-serial880429.z3`, 86928 bytes.
- File identification: `Infocom (Z-machine 3, Release 119, Serial 880429)`.
- SHA-256: `973d3e5a21fba45077e01b1342e17d75db405f45948bca38ccfa9001b7d54917`.
- Frotz smoke test: passed.

Historical release/serial no-creator reassembly command:

```sh
zapf zork1.zap zork1-release119-serial880429-nocreator.z3 -r 119 -s 880429 -N
```

Result:

- Built successfully.
- Output: `zork1-release119-serial880429-nocreator.z3`, 86928 bytes.
- File identification: `Infocom (Z-machine 3, Release 119, Serial 880429)`.
- SHA-256: `208b82f59c6639bb89dd16dbb1b83fa0b3b6d11523aa7a3a3236be028071ddc`.
- Frotz smoke test: passed.

## Artifact result

- Generated artifact filename: `zork1.z3`.
- Generated artifact SHA-256: `2ede50b5b2346e6078de8ab1fcee8631c377d66d856333fb00ff39e9c77ba6b6`.
- Historical-header artifact filename: `zork1-release119-serial880429.z3`.
- Historical-header artifact SHA-256: `973d3e5a21fba45077e01b1342e17d75db405f45948bca38ccfa9001b7d54917`.
- Historical-header no-creator artifact filename: `zork1-release119-serial880429-nocreator.z3`.
- Historical-header no-creator artifact SHA-256: `208b82f59c6639bb89dd16dbb1b83fa0b3b6d11523aa7a3a3236be028071ddc`.
- Upstream prebuilt `COMPILED/zork1.z3` and `zork1.zip` file identification: `Infocom (Z-machine 3, Release 119, Serial 880429)`.
- Upstream prebuilt `COMPILED/zork1.z3` and `zork1.zip` SHA-256: `37084966477dff679282de42974b2077156b1bd68fad92a65d4ea94d8eb64d79`.
- Comparison with upstream `COMPILED/zork1.z3`: neither source-built historical-header artifact matched the upstream prebuilt checksum.
- Interpreter smoke test: passed in Frotz for both source-built historical-header variants.
- TerpVault/Parchment playback testing: pending.

## Remaining blockers

- Package metadata is not complete.
- Package-local provenance notes are not complete.
- TerpVault/Parchment playback testing is pending.
- Package export/import smoke testing is pending.
- Original package art is not created.
- Screenshots are not created.
- Helper docs are not created.
- Feelies are not created.
- Redistribution/package basis for the exact generated story artifact still needs to be recorded in package-local notes before bundling.
- Keep Zork I candidate-only until package metadata, provenance notes, TerpVault/Parchment playback, export/import behavior, original art, screenshots, helper docs, and feelies are complete.

## Recommended next action

Keep Zork I candidate-only and proceed with package-planning work only after the package metadata, package-local provenance notes, TerpVault/Parchment playback test plan, export/import smoke test plan, original art plan, screenshot plan, helper docs, and feelies are ready. Do not create `_demo` package contents yet.

Packaging recommendation:

- Keep Zork I as candidate-only.
- Do not create `_demo` package contents yet.
- Recommended eventual package artifact is probably the source-built `zork1-release119-serial880429.z3`, not the `-N` no-creator variant, unless a later decision says otherwise.
- Do not bundle `zork1.zip` or `COMPILED/zork1.z3` unless an explicit later packaging decision selects the upstream prebuilt artifact and documents the basis.
- Do not mark Zork I package-ready until package metadata, provenance notes, TerpVault/Parchment playback, export/import, original art, screenshots, helper docs, and feelies are complete.
- If packaging proceeds later, include upstream MIT license text and package-local provenance notes, and use only Craig-created art/helper docs unless other assets have separately verified redistribution rights.

Remaining blockers:

- Decide whether the source-built `zork1-release119-serial880429.z3`, source provenance, or some combination is appropriate for the package.
- Verify IFID/format and TerpVault/Parchment playback behavior.
- Create original package assets and helper docs only after packaging basis is resolved.
- Run package export/import smoke tests once a package exists.

## Legal/provenance checklist

- Preserve MIT license text if applicable.
- Record retrieval date.
- Record commit hash/tag.
- Avoid historical commercial packaging, manuals, maps, ads, logos, trade dress, and scans unless separately licensed.
- Use Craig-created art and helper docs.
- Treat trademarks separately from source-code license.
- Do not bundle until redistribution requirements are documented.
- Record whether the generated playable artifact is covered by the same license path as the verified source.
- Keep source, license, attribution, and package provenance notes available inside or alongside the package.

## Build/package verification checklist

- Identify required build toolchain. Done for source-build verification.
- Build from source locally. Done in scratch.
- Record build command. Done.
- Record output story artifact. Done for scratch build artifacts.
- Record output checksum. Done for scratch build artifacts.
- Confirm artifact plays in TerpVault/Parchment.
- Confirm IFID and format.
- Decide whether to include generated story artifact, source provenance, or both.
- Confirm package export/import smoke test.
- Record any interpreter-specific behavior, warnings, or metadata gaps discovered during TerpVault/Parchment testing.

## TerpVault package plan

Proposed package structure:

```text
zork-i/
  game.yaml
  metadata.iFiction.xml
  story-file-name-tbd.z3
  cover.jpg
  small-cover.jpg
  hero.jpg
  screenshots/
    01.png
  how-to-play.md
  hints.md
  walkthrough.md
  feelies/
  LICENSE-upstream.txt
  provenance.md
```

Notes:

- Story file exact filename: probably `zork1-release119-serial880429.z3`, unless a later package decision selects a different artifact.
- `LICENSE-upstream.txt` or equivalent should be included if required by the verified license.
- Provenance notes should record source URL, retrieved date, commit/tag, build toolchain, build command, output checksum, and any package-local asset authorship notes.

## Art plan

- Craig-created cover image.
- Craig-created small-cover image.
- Craig-created hero image.
- Screenshots from the bundled playable version.
- Optional original map/feelie notes.
- Avoid copying historical Infocom packaging or trade dress.
- Avoid using commercial logos, scans, manual art, advertising layouts, or map designs unless separately licensed for redistribution.

## Helper docs plan

- Original `how-to-play.md` focused on basic parser commands and Zork expectations.
- Original spoiler-light `hints.md`.
- Original clearly spoilery `walkthrough.md`.
- Avoid copying commercial Invisiclues/manual/hint book text.
- Keep helper docs aligned with the exact bundled playable version so commands, room names, and puzzle order are accurate.

## Open questions

- Should the source-built `zork1-release119-serial880429.z3` artifact be selected for eventual packaging?
- Is the generated artifact clearly redistributable under the same license path?
- What IFID should be recorded?
- Should Zork I install as draft or published in the future demo installer?
- Should the package include upstream source license text in feelies, root package, or provenance metadata?
- Should source provenance be represented only in `game.yaml`/`provenance.md`, or should source snapshots/build logs be kept outside bundled package contents?

## Next actions

- Test in TerpVault.
- Draft `game.yaml`.
- Create original art.
- Create helper docs.
- Add provenance/license notes.
- Export/import smoke test.

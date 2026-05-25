# Zork II Demo Candidate Verification

## Status

- Candidate only.
- Upstream repo verified on 2026-05-25.
- License/provenance reviewed from observed repository files only.
- Source build attempted on 2026-05-25.
- Source build did not produce a playable artifact.
- Not approved for bundled demo.
- Requires package verification, TerpVault/Parchment playback verification, original package assets, helper docs, screenshots, and provenance notes.
- Next state: source-build issue investigation needed.

Zork II must not be treated as ready to bundle until the source, license, build output, TerpVault package contents, assets, helper docs, and provenance notes are verified and complete.

## Upstream source verified

- Exact GitHub repository URL: `https://github.com/historicalsource/zork2.git`.
- Branch verified: `master`.
- Exact commit verified: `3da9661098809788a99cef00f00c865c6c204f96`.
- Latest commit observed: `2025-11-21T01:32:50+09:00`, `Update README.md`.
- Tags/releases observed: no local tags, no remote tags from `git ls-remote --tags origin`, and no GitHub releases returned by `gh release list --repo historicalsource/zork2 --limit 20`.
- License file path: `LICENSE`.
- License status: observed file appears to be MIT License text.
- Attribution/copyright line: `Copyright (c) 2025 Microsoft`.
- Historical commercial assets: no commercial packaging, manuals, maps, ads, logos, trade dress, scans, images, PDFs, or generated package assets were observed in the repository file listing. Observed files are ZIL/source-related files, ZAP/build-side files, repository docs/license, and prebuilt Z-machine artifacts.

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

- Scratch checkout location: `/tmp/terpvault-zork2-build`.
- Repository URL: `https://github.com/historicalsource/zork2.git`.
- Branch: `master`.
- Commit: `3da9661098809788a99cef00f00c865c6c204f96`.
- Source language/format: ZIL (Zork Implementation Language), with `.zil` source files and related source/build-side files including `zork2.zil`, `2actions.zil`, `2dungeon.zil`, `gclock.zil`, `gglobals.zil`, `gmacros.zil`, `gmain.zil`, `gparser.zil`, `gsyntax.zil`, `gverbs.zil`, `.zap` files, `zork2.chart`, `zork2.errors`, `zork2.record`, `zork2.serial`, and `zork2freq.xzap`.
- README build context: the README says there is currently no known way to compile the source into a final ZIP file using the original Infocom process, says some repositories include `.ZIP` files from final spin-down, and describes the source as a ZIL snapshot from the Infocom development system.
- Natural top-level ZIL file identified: `zork2.zil`.
- Prebuilt story artifacts observed: `COMPILED/zork2.z3` and `zork2.zip`.
- Prebuilt artifact file identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- `COMPILED/zork2.z3` SHA-256: `3ae7d5558943e9721f3e4b273c8a7faec1a03a604e1ae4ee1cde472c21cb24ac`.
- `zork2.zip` SHA-256: `3ae7d5558943e9721f3e4b273c8a7faec1a03a604e1ae4ee1cde472c21cb24ac`.
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
- Smoke-test command sequence reserved for playable artifacts:

```text
look
inventory
quit
y
```

## Build attempt

Source build was attempted in scratch only.

Command:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf zork2.zil
```

Result:

- Build failed; no `zork2.z3` story artifact was produced.
- Output banner: `Renovated ZORK II: The Wizard of Frobozz`.
- Warnings: `26 warnings (26 suppressed)`.
- Error:

```text
[error ZIL0123] /private/tmp/terpvault-zork2-build/2ACTIONS.zil:1560: expressions of type 'LIST' cannot be compiled
    [info ZIL0124] /private/tmp/terpvault-zork2-build/2ACTIONS.zil:1551: misplaced bracket in COND or loop?
```

- The failed build modified or generated scratch-only ZAP-side files including `zork2.zap`, `zork2_data.zap`, and `zork2_str.zap`.
- Historical release/serial reassembly was not attempted because the natural source build did not complete successfully and did not produce a playable source-built artifact.

## Artifact result

- Generated playable artifact filename: none.
- Generated playable artifact SHA-256: none.
- Comparison with upstream `COMPILED/zork2.z3`: not performed for source-built artifacts.
- Upstream prebuilt `COMPILED/zork2.z3` and `zork2.zip` file identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- Upstream prebuilt `COMPILED/zork2.z3` and `zork2.zip` SHA-256: `3ae7d5558943e9721f3e4b273c8a7faec1a03a604e1ae4ee1cde472c21cb24ac`.
- TerpVault/Parchment playback testing: pending.

## Frotz smoke test

- Not performed.
- Reason: no source-built playable artifact was produced.

## Packaging recommendation

- Keep Zork II candidate-only.
- Not approved for bundled demo.
- Do not create `_demo` package contents yet.
- Do not bundle `zork2.zip` or `COMPILED/zork2.z3` unless an explicit later packaging decision selects the upstream prebuilt artifact and documents the basis.
- Prefer a source-built artifact only if the ZILF/ZAPF build issue is resolved and playback is verified.
- Do not use commercial packaging, manual, map, ad, logo, trade-dress, or scan assets.
- Use Craig-created art, screenshots, helper docs, maps, and feelies later.

## Remaining blockers

- Resolve or document the ZILF source-build error in `2ACTIONS.zil`.
- Produce a successful source-built playable artifact, or make and document an explicit later decision to use a prebuilt artifact.
- Record selected artifact filename, file identification, checksum, and redistribution basis.
- Verify Frotz and TerpVault/Parchment playback for the selected artifact.
- Create package metadata and package-local provenance notes.
- Create original package art, screenshots, helper docs, maps, and feelies.
- Run package export/import smoke tests once a package exists.

## Recommended next action

Investigate the ZILF build failure in scratch or upstream context without changing the TerpVault repo. Keep Zork II candidate-only until a successful source build or a documented explicit prebuilt-artifact decision exists, then verify playback before any package assembly.

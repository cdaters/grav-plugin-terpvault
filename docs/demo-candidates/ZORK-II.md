# Zork II Demo Candidate Verification

## Status

- Candidate only.
- Upstream repo verified on 2026-05-25.
- License/provenance reviewed from observed repository files only.
- Source build attempted on 2026-05-25.
- Unmodified source build failed; scratch-only compatibility patch produced a playable artifact.
- Frotz smoke test passed for scratch-patched source-built historical-header variants.
- Not approved for bundled demo.
- Requires package verification, TerpVault/Parchment playback verification, original package assets, helper docs, screenshots, and provenance notes.
- Next state: package/provenance/playback verification needed after deciding how to handle the scratch-only source compatibility patch.

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

Unmodified source build was reproduced in scratch only.

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

Source context around `2ACTIONS.zil:1551-1560`:

```zil
<ROUTINE DREARY-ROOM-FCN (RARG)
    #DECL ((RARG) <OR FIX FALSE>)
    <COND (<EQUAL? .RARG ,M-LOOK>
       <TELL
"This is a small and rather dreary room, eerily illuminated by a red glow
emanating from a crack in one wall. The light falls upon a dusty wooden table
in the center of the room. ">
       <P-DOOR "south" ,LID-2 ,KEYHOLE-2>
       <RTRUE>)>
          (T <PCHECK> <RFALSE>)>
```

Likely cause, stated conservatively:

- The first `COND` branch in `DREARY-ROOM-FCN` appears to close the surrounding `COND` too early with `<RTRUE>)>`.
- That leaves `(T <PCHECK> <RFALSE>)` outside the `COND`, where ZILF treats it as a bare list expression and reports `expressions of type 'LIST' cannot be compiled`.
- The adjacent `TINY-ROOM-FCN` uses the same two-branch room-function pattern but keeps the second branch inside the `COND`.

Scratch-only compatibility patch tested:

```diff
diff --git a/2actions.zil b/2actions.zil
index bec062c..1dc1de8 100644
--- a/2actions.zil
+++ b/2actions.zil
@@ -1556,8 +1556,8 @@ an exit down a precarious climb. ">
 emanating from a crack in one wall. The light falls upon a dusty wooden table
 in the center of the room. ">
        <P-DOOR "south" ,LID-2 ,KEYHOLE-2>
-       <RTRUE>)>
-          (T <PCHECK> <RFALSE>)>
+       <RTRUE>)
+          (T <PCHECK> <RFALSE>)>>
```

Build command after scratch-only patch:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf zork2.zil
```

Result after scratch-only patch:

- Built successfully with ZILF 1.8 / ZAPF 1.8.
- Output banner: `Renovated ZORK II: The Wizard of Frobozz`.
- Warnings: `26 warnings (26 suppressed)`.
- Output: `zork2.z3`, 92412 bytes.
- File identification: `Infocom (Z-machine 3, Release 0, Serial 260525)`.
- SHA-256: `eef62c11d56350feb62907090f2fd901e39a826a7d60f81450f7b3e31646598e`.

Historical release/serial reassembly command:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork2.zap zork2-release63-serial860811.z3 -r 63 -s 860811
```

Result:

- Built successfully.
- Output: `zork2-release63-serial860811.z3`, 92412 bytes.
- File identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- SHA-256: `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.
- Frotz smoke test: passed.

Historical release/serial no-creator reassembly command:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork2.zap zork2-release63-serial860811-nocreator.z3 -r 63 -s 860811 -N
```

Result:

- Built successfully.
- Output: `zork2-release63-serial860811-nocreator.z3`, 92412 bytes.
- File identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- SHA-256: `f6843b07941792589eebfd54bcd640b327812f85ac46b688f6c530c8feb72911`.
- Frotz smoke test: passed.

## Artifact result

- Generated artifact filename after scratch-only patch: `zork2.z3`.
- Generated artifact SHA-256 after scratch-only patch: `eef62c11d56350feb62907090f2fd901e39a826a7d60f81450f7b3e31646598e`.
- Historical-header artifact filename after scratch-only patch: `zork2-release63-serial860811.z3`.
- Historical-header artifact SHA-256 after scratch-only patch: `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.
- Historical-header no-creator artifact filename after scratch-only patch: `zork2-release63-serial860811-nocreator.z3`.
- Historical-header no-creator artifact SHA-256 after scratch-only patch: `f6843b07941792589eebfd54bcd640b327812f85ac46b688f6c530c8feb72911`.
- Comparison with upstream `COMPILED/zork2.z3`: neither scratch-patched source-built historical-header artifact matched the upstream prebuilt checksum.
- Upstream prebuilt `COMPILED/zork2.z3` and `zork2.zip` file identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- Upstream prebuilt `COMPILED/zork2.z3` and `zork2.zip` SHA-256: `3ae7d5558943e9721f3e4b273c8a7faec1a03a604e1ae4ee1cde472c21cb24ac`.
- TerpVault/Parchment playback testing: pending.

## Frotz smoke test

- Scratch-patched source-built historical-header artifact tested: `zork2-release63-serial860811.z3`.
- Scratch-patched source-built historical-header no-creator artifact tested: `zork2-release63-serial860811-nocreator.z3`.
- Commands used: `look`, `inventory`, `quit`, `y`.
- Result: both artifacts launched, accepted commands, displayed game output, and responded to quit confirmation successfully.

## Packaging recommendation

- Keep Zork II candidate-only.
- Not approved for bundled demo.
- Do not create `_demo` package contents yet.
- Do not bundle `zork2.zip` or `COMPILED/zork2.z3` unless an explicit later packaging decision selects the upstream prebuilt artifact and documents the basis.
- Prefer a source-built artifact only if the scratch-only compatibility patch is accepted, recorded in package-local provenance, and TerpVault/Parchment playback is verified.
- Do not use commercial packaging, manual, map, ad, logo, trade-dress, or scan assets.
- Use Craig-created art, screenshots, helper docs, maps, and feelies later.

## Remaining blockers

- Decide whether to carry the scratch-only `DREARY-ROOM-FCN` compatibility patch into any future source-build provenance.
- Produce a successful source-built playable artifact from a documented build source, or make and document an explicit later decision to use a prebuilt artifact.
- Record selected artifact filename, file identification, checksum, and redistribution basis.
- Verify TerpVault/Parchment playback for the selected artifact.
- Create package metadata and package-local provenance notes.
- Create original package art, screenshots, helper docs, maps, and feelies.
- Run package export/import smoke tests once a package exists.

## Recommended next action

Review the scratch-only `DREARY-ROOM-FCN` bracket fix as a source compatibility patch candidate, preferably against upstream history or ZILF maintainers before treating it as a packaging input. Keep Zork II candidate-only until the selected artifact and patch/provenance basis are documented and TerpVault/Parchment playback is verified.

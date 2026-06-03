# Zork II Demo Candidate Verification

## Status

- Candidate only.
- Upstream repo verified on 2026-05-25.
- Upstream repo rechecked on 2026-05-29 for branch, commit, tags/releases, license, source layout, and prebuilt artifacts.
- Artifact basis rechecked on 2026-06-02 in scratch at `/private/tmp/terpvault-zork2-source-20260602`.
- DDEV-only draft package assembled and route-checked on 2026-06-02 at `~/Sites/grav2.0-ddev/user/data/terpvault/games/zork-ii`.
- DDEV-only package updated on 2026-06-02 with classified feelies and original draft helper docs.
- DDEV-only package updated on 2026-06-02 with package-local cover/small-cover/hero art and gameplay screenshots.
- DDEV-only package updated on 2026-06-02 with release-specific IFID, IFDB/IFWiki catalog fields, and package-local `metadata.iFiction.xml`.
- Admin2 Library Manager draft-preview handling was fixed on 2026-06-02 so the correct DDEV package metadata and draft package thumbnails can be displayed without publishing Zork II.
- Walkthrough transcript verification was attempted on 2026-06-02 and the selected DDEV artifact still fails under normal dfrotz output during the post-crown balloon descent.
- A scratch source/playback repair pass on 2026-06-02 traced that crash to the Fantasize spell's `FANTASIES` `LTABLE` shape and built a scratch-only repair candidate that gets past the normal-output balloon descent without `SUPERBRIEF`; the selected DDEV story artifact was not replaced.
- License/provenance reviewed from observed repository files only.
- Source build attempted on 2026-05-25.
- Unmodified source build still fails; scratch-only compatibility patch produced playable artifacts.
- Frotz smoke test passed for scratch-patched source-built historical-header variants and the upstream prebuilt artifact.
- DDEV package dfrotz smoke passed against the selected story file.
- Not approved for bundled demo.
- Requires a decision on whether to reopen the selected source-built artifact basis for the `FANTASIES` repair, then complete walkthrough verification, export/import smoke, final audit, and provenance review before any `_demo` work.
- Next state: continue source/playback verification and route cleanup while keeping the DDEV package draft and candidate-only.

Zork II must not be treated as ready to bundle until the source, license, build output or prebuilt artifact basis, TerpVault package contents, assets, helper docs, and provenance notes are verified and complete.

## Artifact basis recheck - 2026-06-02

This artifact-basis pass rechecked the Zork II artifact basis only. At that point it did not create a Zork II `_demo` package, did not create a DDEV package, did not copy feelies, and did not copy any story file into the TerpVault repository.

Scratch path used:

```text
/private/tmp/terpvault-zork2-source-20260602
```

Repository state:

- Remote URL: `https://github.com/historicalsource/zork2.git`.
- Branch: `master`.
- Commit: `3da9661098809788a99cef00f00c865c6c204f96`.
- Tags/releases observed: no tags from `git tag --list` and no remote tags from `git ls-remote --heads --tags`.
- License file observed: `LICENSE`, MIT License text with `Copyright (c) 2025 Microsoft`.
- Build instructions: repository README states there is currently no known original-process way to compile the source into a final ZIP file; no TerpVault-ready build recipe is documented upstream.
- Prebuilt story artifacts observed: `COMPILED/zork2.z3` and `zork2.zip`.

Local toolchain used:

- ZILF: `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf`, version `1.8`.
- ZAPF: `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf`, version `1.8`.
- dfrotz: `/opt/homebrew/bin/dfrotz`.

Unmodified source build command:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf zork2.zil
```

Unmodified build result:

- Failed.
- Output banner: `Renovated ZORK II: The Wizard of Frobozz`.
- Warnings: `26 warnings (26 suppressed)`.
- Error:

```text
[error ZIL0123] /private/tmp/terpvault-zork2-source-20260602/2ACTIONS.zil:1560: expressions of type 'LIST' cannot be compiled
    [info ZIL0124] /private/tmp/terpvault-zork2-source-20260602/2ACTIONS.zil:1551: misplaced bracket in COND or loop?
```

Scratch-only compatibility patch applied:

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

The patch keeps the default `T` branch inside `DREARY-ROOM-FCN`'s surrounding `COND`. It was applied only in scratch and was not copied into the TerpVault repository.

Patched source build command:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf zork2.zil
```

Patched source build result:

- Succeeded.
- Output: `zork2.z3`.
- Size: 92412 bytes.
- File identification: `Infocom (Z-machine 3, Release 0, Serial 260601)`.
- SHA-256: `845f2abefc996d095ab56faf70a6be1db3e76113311eb1311e38cf7376b2588e`.

Historical release/serial reassembly command:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork2.zap zork2-release63-serial860811.z3 -r 63 -s 860811
```

Historical release/serial reassembly result:

- Succeeded.
- Output: `zork2-release63-serial860811.z3`.
- Size: 92412 bytes.
- File identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- SHA-256: `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.
- dfrotz smoke: passed with `look`, `inventory`, `quit`, `y`.

Historical release/serial no-creator reassembly result:

- Command included `-N`.
- Output: `zork2-release63-serial860811-nocreator.z3`.
- Size: 92412 bytes.
- File identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- SHA-256: `f6843b07941792589eebfd54bcd640b327812f85ac46b688f6c530c8feb72911`.
- dfrotz smoke: passed with `look`, `inventory`, `quit`, `y`.

Upstream prebuilt artifact result:

- `COMPILED/zork2.z3` and `zork2.zip` are byte-identical.
- Size: 92524 bytes.
- File identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- SHA-256: `3ae7d5558943e9721f3e4b273c8a7faec1a03a604e1ae4ee1cde472c21cb24ac`.
- dfrotz smoke: passed for `COMPILED/zork2.z3` with `look`, `inventory`, `quit`, `y`.

Artifact candidates:

| Candidate | Origin / method | SHA-256 | File identification | Smoke result | Pros | Cons / provenance risk | Package suitability |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Unmodified source build | Fresh clone of upstream source at `3da9661098809788a99cef00f00c865c6c204f96`; `zilf zork2.zil` | None | None | Not runnable | Cleanest source story if it worked | Build fails at `2ACTIONS.zil:1560` | Not suitable |
| Scratch patched source build | Same source plus documented `DREARY-ROOM-FCN` bracket compatibility patch; default ZILF/ZAPF output | `845f2abefc996d095ab56faf70a6be1db3e76113311eb1311e38cf7376b2588e` | `Infocom (Z-machine 3, Release 0, Serial 260601)` | Not separately smoke-tested in this pass | Directly source-derived and patch is minimal | Default generated release/serial is not the historical release header | Useful build evidence, but not preferred package basis |
| Scratch patched historical-header build | Same patched source, reassembled with `-r 63 -s 860811` | `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019` | `Infocom (Z-machine 3, Release 63, Serial 860811)` | Passed | Directly source-derived, minimal documented patch, historical header matches known upstream prebuilt release/serial | Not byte-identical to upstream prebuilt; patch must be explicitly recorded in package provenance | Recommended next DDEV package-basis candidate |
| Scratch patched historical-header no-creator build | Same patched source, reassembled with `-r 63 -s 860811 -N` | `f6843b07941792589eebfd54bcd640b327812f85ac46b688f6c530c8feb72911` | `Infocom (Z-machine 3, Release 63, Serial 860811)` | Passed | Directly source-derived and explicit no-creator variant is reproducible | No clear package advantage over the non-`-N` artifact | Alternative only if later package review prefers `-N` |
| Upstream prebuilt artifact | `COMPILED/zork2.z3` or top-level `zork2.zip` in upstream repo at verified commit | `3ae7d5558943e9721f3e4b273c8a7faec1a03a604e1ae4ee1cde472c21cb24ac` | `Infocom (Z-machine 3, Release 63, Serial 860811)` | Passed | Directly traceable to upstream repo and has historical release/serial | Not produced by the reproduced source build; README notes original build process uncertainty | Viable fallback only if explicitly selected and documented |

Artifact-basis recommendation:

- Use the documented scratch-patched source-built historical-header artifact, `zork2-release63-serial860811.z3`, as the DDEV package-basis candidate.
- Keep Zork II candidate-only after initial DDEV package assembly until final TerpVault/Parchment coverage, package-local provenance, helper docs, assets, metadata, export/import smoke, audit, and approval are completed.
- Do not use `COMPILED/zork2.z3` or `zork2.zip` unless a later explicit decision selects the upstream prebuilt artifact and documents why the source-built patched artifact is not being used.

## DDEV draft package assembly - 2026-06-02

This pass assembled a DDEV-only Zork II draft package for local TerpVault/Parchment verification. It did not copy any Zork II files into `_demo`, did not copy feelies, and did not add story files to the TerpVault plugin repository.

Package target:

```text
~/Sites/grav2.0-ddev/user/data/terpvault/games/zork-ii
```

Package files created in DDEV:

- `game.yaml`
- `zork2.z3`
- `LICENSE-upstream.txt`
- `provenance.md`
- `how-to-play.md`
- `hints.md`
- `walkthrough.md`
- Empty `screenshots/` and `feelies/` directories

Selected story artifact:

- Source path: `/private/tmp/terpvault-zork2-source-20260602/zork2-release63-serial860811.z3`.
- DDEV target path: `~/Sites/grav2.0-ddev/user/data/terpvault/games/zork-ii/zork2.z3`.
- Size: 92412 bytes.
- SHA-256: `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.
- File identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- Upstream `COMPILED/zork2.z3` and top-level `zork2.zip` were not selected for this DDEV package.

Package metadata/provenance state:

- `terpvault.status`: restored to `draft` after route checks.
- `terpvault.featured`: `false`.
- `identification.ifids`: initially empty pending IFID/catalog/iFiction enrichment; later updated to `ZCODE-63-860811` in the metadata review below.
- At initial assembly, `resources.feelies` was empty and no support files from `~/Downloads/for-Zork2` were copied.
- At initial assembly, `how-to-play.md`, `hints.md`, and `walkthrough.md` were placeholders only. They were replaced by original draft helper docs in the later materials update below.
- `provenance.md` records the selected story artifact, patch/build basis, upstream source, license summary, shared rights/provenance policy, and Rights-Holder Removal Requests / DMCA contact.

Local package validation:

- YAML parse: passed.
- Story checksum: matched expected SHA-256.
- Story file identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- `LICENSE-upstream.txt`, `provenance.md`, and helper docs: non-empty.
- Cruft check for `.DS_Store`, `__MACOSX`, AppleDouble files, backups, temp files, swap files, and lock files: clean.

DDEV manifest check while draft:

- Manifest route: `https://grav20.ddev.site/if/_manifest`.
- HTTP result: `200`.
- `zork-ii` present: yes.
- Status: `draft`.
- `has_story_file`: `true`.
- Warnings: `missing-ifid`, `missing-cover`, `missing-small-cover`.
- Errors: none.

Temporary published route checks:

- `/if/zork-ii`: `200`, `text/html`.
- `/if/zork-ii/play`: `200`, `text/html`.
- `/if/_story/zork-ii/zork2.z3`: `200`, `application/octet-stream`, 92412 bytes, SHA-256 matched `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.
- `/if/_asset/zork-ii/how-to-play.md`: `200`, `text/markdown`.
- `/if/_asset/zork-ii/hints.md`: initially returned a Grav compiled-cache parse error; after one `ddev exec bin/grav clearcache`, retry passed with `200`, `text/markdown`.
- `/if/_asset/zork-ii/walkthrough.md`: `200`, `text/markdown`.

dfrotz smoke from DDEV package file:

- Command sequence: `look`, `inventory`, `quit`, `y`.
- Result: passed. The story launched, displayed Release 63 / Serial 860811, accepted commands, and quit cleanly.

The package was restored to draft and cache was cleared after the temporary route checks.

## DDEV materials and helper docs update - 2026-06-02

This pass updated the DDEV-only Zork II draft package with classified feelies and original TerpVault helper docs. It did not copy any Zork II files into `_demo` and did not add story files, support files, PDFs, images, or solution files to the TerpVault plugin repository.

Source/reference folder:

```text
~/Downloads/for-Zork2
```

Feelies copied into DDEV:

| Target path | SHA-256 | Classification |
| --- | --- | --- |
| `feelies/bozbarland-flyer.pdf` | `eff3f0ad8bc8a85b80332efc561047881058ccb9ed5cf594fa52ccacad917693` | Historically circulating reference/preservation material |
| `feelies/gue-nine-zorkminds.pdf` | `c411dc9e1235a7f3669dfb1d21aa917741195bf68fa29fdb0aac8f63641d4b31` | Historically circulating reference/preservation material |
| `feelies/grayslopes-brochure.pdf` | `1beb6526d5edefdbca2fac6aae56370ad68c21f80222aca115688482b1554a2e` | Historically circulating reference/preservation material |
| `feelies/zork-ii-invisiclues-map.pdf` | `e8a9329e5b95cb112141ff25dba8d418d6aa4d3a9d38f08b15ee91ee12a365ae` | Historically circulating reference/preservation material requiring caution |
| `feelies/zork-ii-poster.jpg` | `2a839c6e8c8b1585a9508aad68c2fed002b7dc8b396c3e9c37d8b16edfe8e0e1` | Likely commercial material requiring caution |
| `feelies/zug-map-inside.jpg` | `7732ecb3f973e6e89ed8192c4450fa6cddd305ef8475b7795be3eb097bf68178` | Historically circulating reference/preservation material |
| `feelies/zug-map-outside.jpg` | `59270b28e5fea2a2fea1ec75f6a5f52d824a9414598018b649d81fbcca929a14` | Historically circulating reference/preservation material |

The materials are described under the shared policy in `docs/DEMO-CONTENT-RIGHTS.md`. They are not described as official, endorsed, newly licensed, public domain, copyright-free, or automatically fair use. Package provenance includes Rights-Holder Removal Requests / DMCA contact language for `dmca@retrorealm.org`.

Helper docs:

- `how-to-play.md` was rewritten as a Zork II parser guide for the draft package.
- `hints.md` was rewritten with original progressive hints.
- `walkthrough.md` was rewritten as an original TerpVault draft route using local `zork2.sol.txt` and `zork2.sol2.txt` as references only.
- The solution text files were not copied into the DDEV package or the repo.
- The walkthrough is explicitly pending dfrotz transcript verification and should not be treated as a verified route yet.

Validation:

- YAML parse: passed.
- Story checksum remained `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.
- Feelie `file` and SHA-256 checks passed.
- Helper docs, provenance, and upstream license were non-empty.
- Cruft check was clean.
- Draft manifest route returned HTTP `200`; `zork-ii` status `draft`, `has_story_file` true, seven feelies visible, warnings `missing-ifid`, `missing-cover`, and `missing-small-cover`, errors none.
- Temporary published route checks passed for `/if/zork-ii`, `/if/zork-ii/play`, `/if/_story/zork-ii/zork2.z3`, helper Markdown assets, `feelies/zug-map-inside.jpg`, and `feelies/zork-ii-poster.jpg`.
- `feelies/zork-ii-invisiclues-map.pdf` initially hit a Grav compiled-cache parse error; after one `ddev exec bin/grav clearcache`, retry passed with HTTP `200`, `application/pdf`, size 1745245, and matching SHA-256.

The package was restored to draft and cache was cleared after the temporary route checks. IFID/catalog/iFiction metadata was added in the later metadata review below.

## DDEV art and screenshots update - 2026-06-02

This pass added package-local visual art and gameplay screenshots to the DDEV-only Zork II draft package. It did not copy any Zork II files into `_demo`, did not copy source working files, and did not change the story artifact, feelies, or helper docs.

Source folder:

```text
~/Downloads/for-Zork2
```

Copied assets:

| Target path | SHA-256 | Dimensions | Classification |
| --- | --- | --- | --- |
| `cover.jpg` | `b757c982f0bfd1a35f21f7740b1c912b2cdccff94e00775cbe88d7b8de3590a0` | 920 x 920 | Craig-created/original package-local material |
| `small-cover.jpg` | `b757c982f0bfd1a35f21f7740b1c912b2cdccff94e00775cbe88d7b8de3590a0` | 920 x 920 | Craig-created/original package-local material |
| `hero.jpg` | `2e92ba19674705958c53ed8d980e7b36e1d3944a828985f8b8b5615fb93626ce` | 1920 x 1080 | Craig-created/original package-local material |
| `screenshots/01.png` | `35e812de3f7e8d59f3bc6ebae7871c159887419533054e859971cbf58592d69f` | 1814 x 1072 | Gameplay screenshot from selected packaged artifact |
| `screenshots/02.png` | `7504bd8daec8b1d5ba6c6f9f7fc28d3640008b4476edccad5fcd5cbeeb8a864f` | 1814 x 1218 | Gameplay screenshot from selected packaged artifact |

The cover, small cover, and hero image are treated as package-local visual materials for this DDEV candidate package. They are not presented as official, endorsed, newly licensed, or historical commercial packaging. The screenshots are treated as gameplay screenshots from the selected packaged Zork II artifact.

Skipped files included `hero-zork2.psd`, loose generated-image working files, existing feelies, solution/reference text files, `.DS_Store`, and source/cruft files.

Validation:

- YAML parse: passed.
- Story checksum remained `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.
- Image `file`, SHA-256, and `sips` dimension checks passed.
- Helper docs, provenance, and upstream license were non-empty.
- Cruft check was clean after removing old DDEV `game.yaml.bak-*` files.
- Draft manifest route returned HTTP `200`; `zork-ii` status `draft`, `has_story_file` true, cover/small-cover/hero/screenshots visible, warnings only `missing-ifid`, errors none.
- Temporary published route checks passed for `/if/zork-ii`, `/if/zork-ii/play`, `/if/_story/zork-ii/zork2.z3`, `/if/_asset/zork-ii/cover.jpg`, `/if/_asset/zork-ii/small-cover.jpg`, `/if/_asset/zork-ii/hero.jpg`, `/if/_asset/zork-ii/screenshots/01.png`, and `/if/_asset/zork-ii/screenshots/02.png`.
- Route-served story and visual assets matched expected SHA-256 checksums.

The package was restored to draft and cache was cleared after the temporary route checks. Walkthrough transcript verification remained pending; IFID/catalog/iFiction metadata was added in the later metadata review below.

## DDEV metadata and iFiction update - 2026-06-02

This pass added release-specific identification and selected public catalog metadata to the DDEV-only Zork II draft package. It did not copy any Zork II files into `_demo`, did not change the selected story artifact, and did not run walkthrough transcript verification or export/import smoke.

Accepted metadata:

| Field | Value |
| --- | --- |
| Story SHA-256 | `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019` |
| File identification | `Infocom (Z-machine 3, Release 63, Serial 860811)` |
| Release / serial | `63` / `860811` |
| IFID | `ZCODE-63-860811` |
| IFDB TUID | `yzzm4puxyjakk8c4` |
| IFDB URL | `https://ifdb.org/viewgame?id=yzzm4puxyjakk8c4` |
| IFWiki URL | `https://www.ifwiki.org/Zork_II` |
| IF Archive | Left blank; shipped documentation was checked, but no story-artifact catalog path was accepted for this selected package artifact. |

IFID basis:

- The local DDEV story file identifies as Release 63 / Serial 860811.
- The Treaty of Babel legacy Z-code convention supports `ZCODE-{release}-{serial}` for pre-1990 Z-code story files.
- IFDB lists `ZCODE-63-860811` among Zork II IFIDs.
- IFWiki was checked for title/context but was not used to replace this package's release-specific IFID with another release's IFID.

Package updates:

- `game.yaml` now records `identification.ifids: [ZCODE-63-860811]`.
- `game.yaml` now records IFDB TUID/URL and IFWiki URL.
- `metadata.iFiction.xml` was created with verified/careful metadata only and validated with `xmllint --noout`.
- `provenance.md` now records the IFID basis, catalog sources checked, retrieval date, accepted fields, and remaining pending work.

Validation:

- YAML parse: passed.
- `metadata.iFiction.xml` validation: passed.
- Story checksum remained `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.
- Non-empty provenance, helper docs, upstream license, and iFiction files were confirmed.
- Cruft check was clean after removing one DDEV `.DS_Store`.
- Draft manifest route returned HTTP `200`; `zork-ii` status `draft`, `has_story_file` true, `has_ifiction` true, `ifiction_path` `metadata.iFiction.xml`, IFID present, cover/small-cover/hero/screenshots/feelies visible, warnings `[]`, and errors none.
- Temporary published checks passed for `/if/zork-ii`, `/if/zork-ii/play`, `/if/_story/zork-ii/zork2.z3`, `/if/_asset/zork-ii/cover.jpg`, and `/if/_asset/zork-ii/hero.jpg`.
- The route-served story returned HTTP `200`, `application/octet-stream`, 92412 bytes, and the expected SHA-256.
- `/if/_asset/zork-ii/metadata.iFiction.xml` returned HTTP `404` because XML is not a public asset extension under the current TerpVault asset-serving policy; the manifest still detects `metadata.iFiction.xml` via `has_ifiction` and `ifiction_path`.

The package was restored to draft and cache was cleared after the temporary route checks. Walkthrough transcript verification, export/import smoke, final audit, and `_demo` promotion remain pending.

## DDEV walkthrough verification attempt - 2026-06-02

This pass attempted to verify the package-local Zork II walkthrough against the exact selected DDEV story artifact. It did not copy any Zork II files into `_demo`, did not change the selected story artifact, and did not run export/import smoke.

Selected story artifact:

- Path: `~/Sites/grav2.0-ddev/user/data/terpvault/games/zork-ii/zork2.z3`.
- SHA-256: `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.
- File identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- IFID: `ZCODE-63-860811`.

Best selected-artifact dfrotz command:

```sh
/opt/homebrew/bin/dfrotz -p -s 41 user/data/terpvault/games/zork-ii/zork2.z3 < /private/tmp/terpvault-zork2-walkthrough-commands-v17.txt > /private/tmp/terpvault-zork2-walkthrough-transcript-v17.txt 2>&1
```

Scratch files:

- Command file: `/private/tmp/terpvault-zork2-walkthrough-commands-v17.txt`.
- Transcript: `/private/tmp/terpvault-zork2-walkthrough-transcript-v17.txt`.

Result:

- Verification failed / blocked.
- The iterated route reaches the crown and `Score: 175`.
- The route then blocks during the expected post-crown balloon descent after closing the receptacle.
- dfrotz reports `Fatal error: Store out of dynamic memory` while entering the Volcano Core transition.
- No final score, move count, or rank is claimed.

Rejected route-level workarounds included taking the balloon label, changing close/untie ordering, dropping the crown, landing on the narrow ledge, waiting for the newspaper to burn out, and trying to extinguish the burning newspaper after opening the receptacle.

A scratch control against upstream `COMPILED/zork2.z3` reproduced the same post-crown descent crash under dfrotz:

- Path: `/private/tmp/terpvault-zork2-source-20260602/COMPILED/zork2.z3`.
- SHA-256: `3ae7d5558943e9721f3e4b273c8a7faec1a03a604e1ae4ee1cde472c21cb24ac`.
- Transcript: `/private/tmp/terpvault-zork2-walkthrough-transcript-upstream-prebuilt-v8.txt`.

DDEV helper docs were updated to keep the walkthrough explicitly unverified and to document the blocker in package provenance. The package remains draft. Export/import smoke, final audit, Craig approval, and `_demo` promotion remain pending.

## Source/playback repair investigation - 2026-06-02

This pass investigated whether the normal post-crown balloon descent crash could be repaired at the source/build level while preserving intended gameplay. It did not copy any Zork II files into `_demo`, did not change the selected DDEV story artifact, did not change Zork I or Zork III, and did not run export/import smoke.

Selected DDEV story artifact checked:

- Path: `~/Sites/grav2.0-ddev/user/data/terpvault/games/zork-ii/zork2.z3`.
- SHA-256: `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.
- File identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- Package status: draft.

Scratch transcript evidence:

- Baseline transcript: `/private/tmp/terpvault-zork2-triage-dfrotz-baseline.txt`.
- SUPERBRIEF diagnostic transcript: `/private/tmp/terpvault-zork2-triage-dfrotz-superbrief-v2.txt`.
- Corrected normal-output transcript: `/private/tmp/terpvault-zork2-repair-transcript-normal-waits.txt`.
- Corrected BRIEF transcript: `/private/tmp/terpvault-zork2-repair-transcript-brief-waits.txt`.
- Repaired-source normal-output transcript: `/private/tmp/terpvault-zork2-repair-transcript-fantasies-counter-normal-waits.txt`.

Findings:

- The selected DDEV artifact still reproduces the dfrotz `Fatal error: Store out of dynamic memory` under normal output and under `BRIEF`.
- `SUPERBRIEF` remains a diagnostic workaround, not a proposed final gameplay route. It gets past the descent because it skips normal room/object listing after `V-FIRST-LOOK`.
- The normal-output crash occurs immediately after the balloon descends into `Volcano Core, in the basket`, after the balloon vehicle description and while printing `There is a`.
- Source inspection showed that this text matches the Zork II `S-FANTASIZE` spell branch in `PRINT-CONT`, which prints a random item from `FANTASIES` when a room/object listing is otherwise empty.
- `FANTASIES` was declared as `<LTABLE "pile of jewels" ...>` while `PICK-ONE` expects a table whose first entry is a rotation counter, as seen in other `PICK-ONE` tables such as `JUMPLOSS`.
- Adding the missing leading `0` to `FANTASIES` in scratch produced a source-built historical-header artifact that gets past the normal-output post-crown balloon descent without `SUPERBRIEF`.
- A separate scratch test changing `I-BURNUP` from `REMOVE` to `REMOVE-CAREFULLY` did not fix the crash, so burned-fuel cleanup is not the primary cause found in this pass.

Scratch source/build repair candidate:

```diff
diff --git a/2actions.zil b/2actions.zil
@@ -3906,7 +3906,7 @@

 <GLOBAL FANTASIES
-    <LTABLE "pile of jewels" "gold ingot" "basilisk"
+    <LTABLE 0 "pile of jewels" "gold ingot" "basilisk"
         "bulging chest" "yellow sphere" "grue"
         "convention of wizards" "copy of ZORK I">>
```

- Scratch source path: `/private/tmp/terpvault-zork2-source-repair-fantasies-counter`.
- Source commit: `3da9661098809788a99cef00f00c865c6c204f96`.
- Patch basis: existing scratch-only `DREARY-ROOM-FCN` compatibility patch plus the scratch-only `FANTASIES` table-counter repair above.
- Build tools: ZILF/ZAPF 1.8 from `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/`.
- Build command: `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf zork2.zil`.
- Historical-header reassembly command: `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork2.zap zork2-release63-serial860811-fantasies-counter.z3 -r 63 -s 860811`.
- Scratch artifact: `/private/tmp/terpvault-zork2-source-repair-fantasies-counter/zork2-release63-serial860811-fantasies-counter.z3`.
- Scratch artifact SHA-256: `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef`.
- File identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.

The repaired-source normal-output route reaches `Volcano Bottom` after the post-crown descent, remains at `Score: 175`, and later reaches `Score: 215`. It then fails from downstream route/object-staging/navigation problems in the Oddly-angled Room area and eventually dies after the lamp goes out. No completed walkthrough is claimed.

`DREARY-ROOM-FCN` assessment:

- The existing scratch-only `DREARY-ROOM-FCN` compatibility patch remains necessary for ZILF compilation of the source tree used here.
- It is localized to the Dreary Room door/keyhole/`PCHECK` conditional structure and does not plausibly explain the balloon/volcano/Fantasize crash found in this pass.
- If a future package artifact uses a repaired source build, both patches should be documented in package provenance until upstream/source-tooling review gives a cleaner basis.

Recommendation:

- Treat the `FANTASIES` repair as a credible source/build repair candidate, not as an adopted package artifact yet.
- Reopen the selected artifact basis for review before replacing the DDEV story file.
- Keep the current DDEV package draft and candidate-only.
- Continue route cleanup against a scratch repaired artifact, then decide whether to replace the DDEV artifact only after a complete transcript and provenance basis are documented.

## Admin2 draft package preview fix - 2026-06-02

The active DDEV Zork II package files were already correct: `terpvault.status` was `draft`, cover/small-cover/hero/screenshot files existed, `metadata.iFiction.xml` existed, `identification.ifids` included `ZCODE-63-860811`, and `/if/_manifest` reported `has_ifiction: true`, warnings `[]`, and errors `null`.

Admin2 Library Manager displayed stale-looking health and a broken thumbnail because package rows used public `/if/_asset/...` image URLs. Those URLs are intentionally blocked for draft packages, so draft package thumbnails could not render even when package-local images existed.

The fix adds an authenticated Admin/API image-preview route for package-local images only:

```text
/api/v1/terpvault/packages/{slug}/media/preview?path={package-local-image}
```

Admin2 now uses that route for cover, small-cover, hero, and screenshot previews when package-local paths are known. The route does not serve story files, XML, arbitrary package files, or non-image assets. Public draft visibility is unchanged: `/if/_asset/zork-ii/cover.jpg` remains blocked while Zork II is draft.

Validation after the fix:

- DDEV package status remained `draft`.
- Public manifest still reported `has_ifiction: true`, `ifiction_path: metadata.iFiction.xml`, IFID `ZCODE-63-860811`, warnings `[]`, and errors `null`.
- Public `/if/_asset/zork-ii/cover.jpg` returned HTTP `404` while draft.
- Unauthenticated Admin API preview request returned HTTP `401`.
- PHP lint passed for the changed plugin PHP files in DDEV.
- Admin2 JS syntax check passed with `node --check`.

## Upstream source verified

- Exact GitHub repository URL: `https://github.com/historicalsource/zork2.git`.
- Branch verified: `master`.
- Exact commit verified and rechecked: `3da9661098809788a99cef00f00c865c6c204f96`.
- Latest commit observed: `2025-11-21T01:32:50+09:00`, `Update README.md`.
- Tags/releases observed: no local tags, no remote tags from `git ls-remote --tags origin`, and no GitHub releases returned by `gh release list --repo historicalsource/zork2 --limit 20`. Rechecked on 2026-05-29 with the same result.
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
- Docs-only recheck checkout: `/private/tmp/terpvault-zork2-doccheck`.
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
- TerpVault/Parchment playback testing: passed for initial DDEV route/playback smoke; full walkthrough transcript verification was attempted against the selected DDEV artifact and remains incomplete. A later scratch source repair gets past the normal-output post-crown balloon descent under dfrotz, but the selected DDEV artifact has not been replaced and the route still fails after `Score: 215`.

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
- Continue with a source-built artifact only if the scratch-only compatibility patches are recorded in package-local provenance and a complete walkthrough transcript verifies the selected artifact; final package audit is still required before `_demo` promotion.
- Do not use commercial packaging, manual, map, ad, logo, trade-dress, or scan assets.
- Use Craig-created art, screenshots, helper docs, maps, and feelies later.

## Remaining blockers

- Decide whether to carry the scratch-only `DREARY-ROOM-FCN` compatibility patch into any future source-build provenance.
- Decide whether to reopen the selected source-built artifact basis for the scratch-only `FANTASIES` table-counter repair.
- Produce a successful source-built playable artifact from a documented build source, or make and document an explicit later decision to use a prebuilt artifact.
- Record selected artifact filename, file identification, checksum, and redistribution basis.
- Verify TerpVault/Parchment playback for the selected artifact.
- Package metadata and package-local provenance notes created for the DDEV draft package; final audit remains pending.
- Package-local art, screenshots, helper docs, and classified feelies added to the DDEV draft package; walkthrough transcript verification was attempted and remains incomplete. The selected artifact still reproduces the normal-output balloon crash, while a scratch repaired-source artifact gets past that crash and then exposes downstream route cleanup work after `Score: 215`.
- Resolve or reopen the source/playback verification basis, complete a full route transcript, then run package export/import smoke tests.

## Recommended next action

Keep reviewing the scratch-only `DREARY-ROOM-FCN` bracket fix and the scratch-only `FANTASIES` table-counter repair as source compatibility patch candidates, preferably against upstream history or ZILF maintainers before treating them as final bundled-demo provenance. Keep Zork II candidate-only until the selected artifact basis is resolved, a complete walkthrough transcript is verified, and final package docs, metadata, materials, export/import smoke, audit, and approval are complete.

## Promotion checklist against Zork I standard

Before Zork II can move from candidate to bundled demo review, it still needs:

- Final decision on source-built patched artifact versus upstream prebuilt artifact.
- Final decision on whether the source-built artifact should include the scratch-only `FANTASIES` table-counter repair.
- Source/provenance and license basis documented for the selected artifact.
- Playable story file verified without adding it to the repo during research.
- TerpVault/Parchment playback verification for the selected artifact.
- Package metadata, release-specific IFID/catalog fields, and package-local `metadata.iFiction.xml` drafted for the DDEV package.
- Original how-to-play, hints, and walkthrough text.
- Screenshots captured from the selected bundled playable version.
- Original or properly licensed cover, small cover, hero art, and any feelies.
- Explicit exclusion of historical commercial packaging, manuals, maps, ads, logos, trade dress, scans, and Invisiclues-style material unless separately licensed.
- Package-local audit notes, upstream license text, export/import smoke tests, and final review.

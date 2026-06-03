# Zork II DDEV Package Provenance

## Current Status

This is a DDEV-only draft candidate package for local TerpVault/Parchment verification. It is not included in `_demo`, is not approved for bundled demo distribution, and should not be promoted until the remaining package audit items are complete.

No Zork II feelies, screenshots, catalog metadata, iFiction metadata, or final helper docs were added in this pass.

## Selected Story Artifact

- Source artifact path: `/private/tmp/terpvault-zork2-source-20260602/zork2-release63-serial860811.z3`.
- DDEV package target path: `user/data/terpvault/games/zork-ii/zork2.z3`.
- Size: 92412 bytes.
- SHA-256: `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.
- File identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- Prior dfrotz smoke test: passed with `look`, `inventory`, `quit`, `y`.

## Upstream Source

- Repository: `https://github.com/historicalsource/zork2.git`.
- Branch: `master`.
- Commit: `3da9661098809788a99cef00f00c865c6c204f96`.
- License file copied into this package as `LICENSE-upstream.txt`.
- Observed license summary: MIT License text with `Copyright (c) 2025 Microsoft`.

The upstream README notes uncertainty around reproducing the original Infocom build process and says there is currently no known way to compile the source into a final ZIP file using the original process. This package does not claim that the selected artifact is official, endorsed, or an original commercial build.

## Patch And Build Basis

The unmodified ZILF build failed in scratch at:

```text
2ACTIONS.zil:1560: expressions of type 'LIST' cannot be compiled
2ACTIONS.zil:1551: misplaced bracket in COND or loop?
```

The selected story artifact was built from the verified source with a scratch-only `DREARY-ROOM-FCN` bracket compatibility patch. The patch keeps the default `T` branch inside the surrounding `COND`.

Patch summary:

```diff
-       <RTRUE>)>
-          (T <PCHECK> <RFALSE>)>
+       <RTRUE>)
+          (T <PCHECK> <RFALSE>)>>
```

After the patched source build produced `zork2.zap`, the selected historical-header artifact was assembled with:

```sh
/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork2.zap zork2-release63-serial860811.z3 -r 63 -s 860811
```

This DDEV package intentionally uses the patched source-built historical-header artifact. It does not use upstream `COMPILED/zork2.z3` or top-level `zork2.zip`.

## Rights And Provenance Policy

This package follows the shared TerpVault demo-content rights/provenance policy in:

```text
docs/DEMO-CONTENT-RIGHTS.md
```

Story/source material, package-local original materials, historical reference/preservation materials, third-party materials requiring caution, and uncertain provenance must be classified separately. Rights-holder removal requests are not a substitute for provenance review.

## Rights-Holder Removal Requests / DMCA

If you are a rights holder and believe specific material should not be included, please contact [dmca@retrorealm.org](mailto:dmca@retrorealm.org) with the item name, the location of the material, and the basis for the request. Disputed material will be reviewed promptly and removed or restricted where appropriate.

## Pending Work

- DDEV/Parchment verification.
- Feelies classification and copy review.
- Final `how-to-play.md`.
- Final `hints.md`.
- Final `walkthrough.md` and dfrotz verification.
- IFID/catalog/iFiction metadata.
- Screenshots and package-local art.
- Export/import smoke test.
- Final package audit.
- Craig approval.
- `_demo` promotion decision.

## Zork II Materials and Helper Docs Update - 2026-06-02

This update adds classified feelies and replaces placeholder helper docs in the DDEV-only Zork II draft package. The package remains draft and is still not included in `_demo`.

Source folder:

```text
~/Downloads/for-Zork2
```

Copied feelies:

| Source filename | Target path | SHA-256 | Classification | Preservation / review note |
| --- | --- | --- | --- | --- |
| `Zork 2 - Bozbarland Flyer.pdf` | `feelies/bozbarland-flyer.pdf` | `eff3f0ad8bc8a85b80332efc561047881058ccb9ed5cf594fa52ccacad917693` | Historically circulating reference/preservation material | Included for historical preservation, documentation, research, commentary, and educational context; not presented as official, endorsed, newly licensed, or as a substitute for any commercial product. |
| `Zork 2 - G.U.E. on Nine Zorkminds A Day.pdf` | `feelies/gue-nine-zorkminds.pdf` | `c411dc9e1235a7f3669dfb1d21aa917741195bf68fa29fdb0aac8f63641d4b31` | Historically circulating reference/preservation material | Included for historical preservation, documentation, research, commentary, and educational context; not presented as official, endorsed, newly licensed, or as a substitute for any commercial product. |
| `Zork 2 - Grayslopes Brochure.pdf` | `feelies/grayslopes-brochure.pdf` | `1beb6526d5edefdbca2fac6aae56370ad68c21f80222aca115688482b1554a2e` | Historically circulating reference/preservation material | Included for historical preservation, documentation, research, commentary, and educational context; not presented as official, endorsed, newly licensed, or as a substitute for any commercial product. |
| `Zork 2 - InvisiClues Map.pdf` | `feelies/zork-ii-invisiclues-map.pdf` | `e8a9329e5b95cb112141ff25dba8d418d6aa4d3a9d38f08b15ee91ee12a365ae` | Historically circulating reference/preservation material requiring caution | Included only with explicit historical-reference labeling and the package rights/removal policy; not presented as official, endorsed, newly licensed, or as commercial hint replacement content. |
| `Zork 2 - Poster.jpg` | `feelies/zork-ii-poster.jpg` | `2a839c6e8c8b1585a9508aad68c2fed002b7dc8b396c3e9c37d8b16edfe8e0e1` | Likely commercial material requiring caution | Included for preservation and visual context under caution; not presented as original package-local art, official, endorsed, newly licensed, or copyright-free. |
| `zug-map-inside.jpg` | `feelies/zug-map-inside.jpg` | `7732ecb3f973e6e89ed8192c4450fa6cddd305ef8475b7795be3eb097bf68178` | Historically circulating reference/preservation material | Included for historical preservation, documentation, research, commentary, and educational context; not presented as official, endorsed, newly licensed, or as a substitute for any commercial product. |
| `zug-map-outside.jpg` | `feelies/zug-map-outside.jpg` | `59270b28e5fea2a2fea1ec75f6a5f52d824a9414598018b649d81fbcca929a14` | Historically circulating reference/preservation material | Included for historical preservation, documentation, research, commentary, and educational context; not presented as official, endorsed, newly licensed, or as a substitute for any commercial product. |

Solution/reference files used but not copied:

- `zork2.sol.txt`, SHA-256 `e836801dc42a9987c37cc0fb8bf78111d510e98e53c89f4ddf5aa6a9a8b38b88`.
- `zork2.sol2.txt`, SHA-256 `26aa2372e5c0877a0e76b67c3551c73f66377ce266489bbef02580efe29c9527`.

The `how-to-play.md`, `hints.md`, and `walkthrough.md` files are original TerpVault helper docs drafted for this package. The walkthrough uses the local solution files as references but is not a direct copy and is pending dfrotz transcript verification against the selected story artifact.

Shared policy reference:

```text
docs/DEMO-CONTENT-RIGHTS.md
```

Rights-Holder Removal Requests / DMCA contact:

```text
dmca@retrorealm.org
```

No `_demo` files changed in this pass. No Zork I or Zork III files changed. IFID/catalog/iFiction metadata remains pending.

## Zork II Art and Screenshots Update - 2026-06-02

This update adds package-local visual assets and gameplay screenshots to the DDEV-only Zork II draft package. The package remains draft and is still not included in `_demo`.

Source folder:

```text
~/Downloads/for-Zork2
```

Copied files:

| Source filename | Target path | SHA-256 | Dimensions | Classification |
| --- | --- | --- | --- | --- |
| `cover.jpg` | `cover.jpg` | `b757c982f0bfd1a35f21f7740b1c912b2cdccff94e00775cbe88d7b8de3590a0` | 920 x 920 | Craig-created/original package-local material |
| `small-cover.jpg` | `small-cover.jpg` | `b757c982f0bfd1a35f21f7740b1c912b2cdccff94e00775cbe88d7b8de3590a0` | 920 x 920 | Craig-created/original package-local material |
| `hero.jpg` | `hero.jpg` | `2e92ba19674705958c53ed8d980e7b36e1d3944a828985f8b8b5615fb93626ce` | 1920 x 1080 | Craig-created/original package-local material |
| `01.png` | `screenshots/01.png` | `35e812de3f7e8d59f3bc6ebae7871c159887419533054e859971cbf58592d69f` | 1814 x 1072 | Gameplay screenshot from selected packaged artifact |
| `02.png` | `screenshots/02.png` | `7504bd8daec8b1d5ba6c6f9f7fc28d3640008b4476edccad5fcd5cbeeb8a864f` | 1814 x 1218 | Gameplay screenshot from selected packaged artifact |

The cover, small cover, and hero image are treated as package-local visual materials for this DDEV candidate package. They are not presented as official, endorsed, newly licensed, or historical commercial packaging. The screenshots are treated as gameplay screenshots from the selected packaged Zork II artifact.

Shared policy reference:

```text
docs/DEMO-CONTENT-RIGHTS.md
```

Files intentionally not copied in this pass include `hero-zork2.psd`, loose generated-image working files, existing feelies, solution/reference text files, `.DS_Store`, and other cruft or source working files.

No `_demo` files changed in this pass. No Zork I or Zork III files changed. Walkthrough transcript verification and IFID/catalog/iFiction metadata remain pending.

## Zork II Source/Playback Repair Investigation - 2026-06-02

This investigation checked whether the normal post-crown balloon descent crash could be repaired at the source/build level while preserving intended gameplay. The package remains draft. The selected story artifact was not replaced, no `_demo` files changed, and no Zork I or Zork III files changed.

Selected story artifact retained:

| Field | Value |
| --- | --- |
| Path | `user/data/terpvault/games/zork-ii/zork2.z3` |
| SHA-256 | `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019` |
| File identification | `Infocom (Z-machine 3, Release 63, Serial 860811)` |
| IFID | `ZCODE-63-860811` |

Tooling and source checked:

- Source repository: `https://github.com/historicalsource/zork2.git`.
- Source commit: `3da9661098809788a99cef00f00c865c6c204f96`.
- Source scratch path: `/private/tmp/terpvault-zork2-source-20260602`.
- ZILF/ZAPF tooling: `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/`, version `1.8`.
- dfrotz: `/opt/homebrew/bin/dfrotz`.

Transcript evidence:

- Baseline selected-artifact transcript: `/private/tmp/terpvault-zork2-triage-dfrotz-baseline.txt`.
- SUPERBRIEF diagnostic transcript: `/private/tmp/terpvault-zork2-triage-dfrotz-superbrief-v2.txt`.
- Corrected normal-output transcript: `/private/tmp/terpvault-zork2-repair-transcript-normal-waits.txt`.
- Corrected BRIEF transcript: `/private/tmp/terpvault-zork2-repair-transcript-brief-waits.txt`.
- Repaired-source normal-output transcript: `/private/tmp/terpvault-zork2-repair-transcript-fantasies-counter-normal-waits.txt`.

Findings:

- The selected DDEV story artifact still reproduces the dfrotz `Fatal error: Store out of dynamic memory` under normal output and `BRIEF` during the post-crown descent into Volcano Core.
- `SUPERBRIEF` gets past the descent by skipping the normal object-listing path. It remains diagnostic only, not the intended final gameplay route.
- Source inspection found the crash text matches the `S-FANTASIZE` branch in `PRINT-CONT`, which prints `There is a` plus a random entry from `FANTASIES` when a room/object listing is otherwise empty.
- `FANTASIES` is declared without the leading rotation counter expected by `PICK-ONE`; other `PICK-ONE` tables include a leading `0`.
- A scratch-only source repair adding that leading `0` produced an artifact that gets past the normal-output post-crown balloon descent without `SUPERBRIEF`.
- A separate scratch test changing `I-BURNUP` from `REMOVE` to `REMOVE-CAREFULLY` did not fix the crash.

Scratch repaired-source artifact:

| Field | Value |
| --- | --- |
| Source path | `/private/tmp/terpvault-zork2-source-repair-fantasies-counter` |
| Story path | `/private/tmp/terpvault-zork2-source-repair-fantasies-counter/zork2-release63-serial860811-fantasies-counter.z3` |
| SHA-256 | `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef` |
| File identification | `Infocom (Z-machine 3, Release 63, Serial 860811)` |
| Patch basis | Existing scratch-only `DREARY-ROOM-FCN` compatibility patch plus scratch-only `FANTASIES` table-counter repair |

The existing `DREARY-ROOM-FCN` compatibility patch remains localized to the Dreary Room door/keyhole/`PCHECK` conditional structure. It is still needed for this source tree to compile with the current ZILF/ZAPF tooling, but it does not plausibly explain the balloon/volcano/Fantasize crash found here.

The repaired-source normal-output route reaches Volcano Bottom after the descent and later reaches `Score: 215`, but it still fails from downstream route/object-staging/navigation issues around the Oddly-angled Room and eventually dies after the lamp goes out. No completed walkthrough is claimed.

Recommendation:

- Keep this DDEV package draft and candidate-only.
- Treat the `FANTASIES` repair as a credible source/build repair candidate, not an adopted package artifact.
- Reopen the selected artifact basis before replacing the DDEV story file.
- Continue route cleanup against a scratch repaired artifact, then update the package only after a complete transcript and provenance basis are documented.

## Zork II Metadata / IFID Review - 2026-06-02

This review adds release-specific identification and selected public catalog metadata to the DDEV-only Zork II draft package. The package remains draft and is still not included in `_demo`.

Story artifact reviewed:

```text
user/data/terpvault/games/zork-ii/zork2.z3
```

Story verification:

| Field | Value |
| --- | --- |
| SHA-256 | `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019` |
| File identification | `Infocom (Z-machine 3, Release 63, Serial 860811)` |
| Release | `63` |
| Serial | `860811` |
| IFID accepted for this artifact | `ZCODE-63-860811` |

IFID basis:

- The local packaged story file identifies as Release 63 / Serial 860811.
- The Treaty of Babel legacy Z-code convention uses `ZCODE-{release}-{serial}` for pre-1990 Z-code story files.
- IFDB lists `ZCODE-63-860811` among the Zork II IFIDs, matching this artifact's release and serial.
- IFWiki lists Zork II metadata and emphasizes some other release IFIDs; those were not used to replace this package's release-specific IFID.

Sources checked on 2026-06-02:

| Source | URL | Result |
| --- | --- | --- |
| Local story file | `user/data/terpvault/games/zork-ii/zork2.z3` | Confirmed Release 63 / Serial 860811. |
| IFDB | `https://ifdb.org/viewgame?id=yzzm4puxyjakk8c4` | Accepted TUID `yzzm4puxyjakk8c4`, URL, and matching IFID listing. |
| IFWiki | `https://www.ifwiki.org/Zork_II` | Accepted page URL and factual series/title context. |
| IF Archive | `https://ifarchive.org/if-archive/infocom/shipped-documentation/zork2.txt` | Checked as shipped documentation reference; not accepted as a story-artifact catalog path for this package. |
| Treaty of Babel | `https://babel.ifarchive.org/babel_rev11.html` | Used for the legacy Z-code IFID convention. |
| Upstream source repository | `https://github.com/historicalsource/zork2.git` | Retained as source/provenance context for the selected patched source-built artifact. |

Fields accepted into `game.yaml`:

- `identification.ifids`: `ZCODE-63-860811`
- `catalog.ifdb.tuid`: `yzzm4puxyjakk8c4`
- `catalog.ifdb.url`: `https://ifdb.org/viewgame?id=yzzm4puxyjakk8c4`
- `catalog.ifwiki.url`: `https://www.ifwiki.org/Zork_II`

The `catalog.ifarchive.path` and `catalog.ifarchive.url` fields remain blank because no IF Archive story-artifact catalog entry was accepted for this selected package artifact in this pass.

The package-local `metadata.iFiction.xml` file was created with verified/careful metadata only:

- IFID `ZCODE-63-860811`
- Format `zcode`
- Title `Zork II`
- Author line `Marc Blank, Dave Lebling, Bruce Daniels, and Tim Anderson`
- Headline `The Wizard of Frobozz`
- First published year `1981`
- Language `en`
- Original TerpVault package description

No external marketing copy or long external description was copied into `game.yaml`, `metadata.iFiction.xml`, or this provenance section.

Shared policy reference:

```text
docs/DEMO-CONTENT-RIGHTS.md
```

This metadata review does not change the package's rights/provenance posture. The story artifact remains a patched source-built historical-header DDEV candidate with the source/build basis documented above; the supplemental materials remain governed by the shared demo-content rights/provenance policy and the package-level Rights-Holder Removal Requests / DMCA notice.

Remaining pending work:

- Walkthrough transcript verification.
- Export/import smoke test.
- Final package audit.
- Craig approval.
- `_demo` promotion decision.

No `_demo` files changed in this pass. No Zork I or Zork III files changed.

## Zork II Walkthrough Verification - 2026-06-02

This pass attempted to verify the package-local `walkthrough.md` against the exact selected DDEV story artifact. The package remains draft and the walkthrough remains unverified.

Story artifact reviewed:

```text
user/data/terpvault/games/zork-ii/zork2.z3
```

Story verification:

| Field | Value |
| --- | --- |
| SHA-256 | `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019` |
| File identification | `Infocom (Z-machine 3, Release 63, Serial 860811)` |
| Release | `63` |
| Serial | `860811` |
| IFID | `ZCODE-63-860811` |

Verification command used for the final selected-artifact attempt:

```sh
/opt/homebrew/bin/dfrotz -p -s 41 user/data/terpvault/games/zork-ii/zork2.z3 < /private/tmp/terpvault-zork2-walkthrough-commands-v17.txt > /private/tmp/terpvault-zork2-walkthrough-transcript-v17.txt 2>&1
```

Scratch command and transcript paths:

```text
/private/tmp/terpvault-zork2-walkthrough-commands-v17.txt
/private/tmp/terpvault-zork2-walkthrough-transcript-v17.txt
```

Result: failed / blocked.

The route was iterated through robot retry timing, Carousel/Low Room pathing, inventory staging, balloon ledge timing, and the bomb/crown sequence. The best selected-artifact transcript reaches the crown and `Score: 175`, then blocks during the expected post-crown balloon descent. Closing the receptacle and descending toward Volcano Core consistently triggers:

```text
Fatal error: Store out of dynamic memory
```

The same post-crown balloon descent crash was reproduced in scratch against the upstream prebuilt Release 63 / Serial 860811 artifact:

```text
/private/tmp/terpvault-zork2-source-20260602/COMPILED/zork2.z3
SHA-256: 3ae7d5558943e9721f3e4b273c8a7faec1a03a604e1ae4ee1cde472c21cb24ac
Transcript: /private/tmp/terpvault-zork2-walkthrough-transcript-upstream-prebuilt-v8.txt
```

Route-level workarounds tested but not accepted:

- Taking the balloon label before descent.
- Closing the receptacle before untying the wire.
- Dropping the crown in the basket.
- Landing on the narrow ledge during descent and trying to continue by ledge exits.
- Waiting for the newspaper to burn out before untying the balloon.
- Opening the receptacle and attempting to extinguish the newspaper before the Volcano Core transition.

None produced a complete verified route. Because the transcript does not prove completion, `walkthrough.md` remains marked as an unverified draft and no final score, move count, or rank is claimed.

The local reference files `zork2.sol.txt` and `zork2.sol2.txt` were used as references only and were not copied into this package. No story artifact, IFID/catalog/iFiction metadata, feelies, art, or screenshots changed in this pass.

Remaining pending work:

- Resolve the dfrotz post-crown balloon descent blocker or reopen the artifact/interpreter verification basis.
- Complete walkthrough transcript verification.
- Export/import smoke test.
- Final package audit.
- Craig approval.
- `_demo` promotion decision.

No `_demo` files changed in this pass. No Zork I or Zork III files changed.

## Zork II Repaired-Artifact Route Completion - 2026-06-02

This pass continued route verification against the scratch repaired artifact only. The DDEV package remains draft, and the selected DDEV story artifact was not replaced.

Selected DDEV artifact, unchanged:

| Field | Value |
| --- | --- |
| Path | `user/data/terpvault/games/zork-ii/zork2.z3` |
| SHA-256 | `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019` |
| File identification | `Infocom (Z-machine 3, Release 63, Serial 860811)` |

Scratch repaired artifact tested:

| Field | Value |
| --- | --- |
| Path | `/private/tmp/terpvault-zork2-source-repair-fantasies-counter/zork2-release63-serial860811-fantasies-counter.z3` |
| SHA-256 | `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef` |
| File identification | `Infocom (Z-machine 3, Release 63, Serial 860811)` |

Best completed command and transcript paths:

```text
/private/tmp/terpvault-zork2-repair-commands-fantasies-counter-v17.txt
/private/tmp/terpvault-zork2-repair-transcript-fantasies-counter-v17-nomore.txt
```

Command used:

```sh
/opt/homebrew/bin/dfrotz -p -m -s 41 /private/tmp/terpvault-zork2-source-repair-fantasies-counter/zork2-release63-serial860811-fantasies-counter.z3 < /private/tmp/terpvault-zork2-repair-commands-fantasies-counter-v17.txt > /private/tmp/terpvault-zork2-repair-transcript-fantasies-counter-v17-nomore.txt 2>&1
```

Result:

- Normal output completed the route; `SUPERBRIEF` was not used.
- The corrected Bank route preserved both Bank treasures without invoking the Zurich gnome.
- The demon accepted the portrait as the ninth counted treasure and the stack of zorkmid bills as the tenth counted treasure, then gave the wand.
- The transcript reached the Landing and reported `Your score would be 400 (total of 400 points), in 372 moves.`
- Final rank: `Master Adventurer`.

This section confirmed that the repaired scratch artifact could complete the walkthrough under normal dfrotz output before adoption. The later adoption section below supersedes the earlier non-adopted status and records the repaired artifact as the selected DDEV package artifact.

No `_demo` files changed in this pass. No Zork I or Zork III files changed.

## Zork II Repaired Artifact Adoption - 2026-06-02

This pass adopted the verified repaired scratch artifact as the selected DDEV package story artifact. The package remains draft and candidate-only.

Artifact replacement:

| Field | Value |
| --- | --- |
| Previous selected artifact SHA-256 | `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019` |
| Previous artifact backup path | `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-ii/zork2.z3.pre-repair-10015c-20260602-192833.bak` |
| New selected DDEV artifact path | `user/data/terpvault/games/zork-ii/zork2.z3` |
| New selected DDEV artifact SHA-256 | `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef` |
| File identification | `Infocom (Z-machine 3, Release 63, Serial 860811)` |
| IFID | `ZCODE-63-860811` |

Source/build basis:

| Field | Value |
| --- | --- |
| Source repository | `https://github.com/historicalsource/zork2.git` |
| Source commit | `3da9661098809788a99cef00f00c865c6c204f96` |
| Scratch source path | `/private/tmp/terpvault-zork2-source-repair-fantasies-counter` |
| Build command | `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zilf zork2.zil` |
| Historical-header reassembly command | `/tmp/terpvault-zilf-verification/bin/Debug/net10.0/zapf zork2.zap zork2-release63-serial860811-fantasies-counter.z3 -r 63 -s 860811` |

Adopted DDEV candidate source patches:

- `DREARY-ROOM-FCN` compatibility patch: keeps the default branch inside the surrounding `COND` so the source builds under the local ZILF/ZAPF toolchain.
- `FANTASIES` table-counter repair: adds the leading rotation counter expected by `PICK-ONE`, fixing the normal-output post-crown balloon descent crash.

Verification evidence:

```text
/private/tmp/terpvault-zork2-repair-commands-fantasies-counter-v17.txt
/private/tmp/terpvault-zork2-repair-transcript-fantasies-counter-v17-nomore.txt
/private/tmp/terpvault-zork2-ddev-adopted-v17-transcript.txt
```

Verification result:

- Normal output completed the route; `SUPERBRIEF` was not used.
- Final score: `400/400`.
- Move count: `372`.
- Rank: `Master Adventurer`.
- Release/serial remain Release 63 / Serial 860811.
- IFID remains `ZCODE-63-860811`.

The DDEV package remains draft. No `_demo` files changed. Export/import smoke later passed in the section below; final package audit remains pending.

## Zork II Export/Import Smoke - 2026-06-02

This pass verified that the repaired DDEV candidate package exports cleanly, imports safely under a non-overwriting temporary slug, routes correctly when temporarily published, and still completes the verified walkthrough after import. The original `zork-ii` package remains draft and candidate-only.

Pre-export cleanup:

- Package-root backup files were moved out of the active package folder before export so they would not be package contents.
- Backup location: `/private/tmp/terpvault-zork2-pre-repair-backup/`.
- Moved backups:
  - `game.yaml.bak-20260601-235526`, SHA-256 `8f5d5d329fbdb3309d5da580e5b903717c4b17e28cd9693038e0155e71043af3`.
  - `game.yaml.bak-20260602-000136`, SHA-256 `23d76931f3b4e040491c677b59984468dbee44e12c16971bd9fb1db0173ab8b4`.
  - `zork2.z3.pre-repair-10015c-20260602-192833.bak`, SHA-256 `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.

Export result:

| Field | Value |
| --- | --- |
| Export zip path | `/private/tmp/terpvault-zork-ii-export-smoke/zork-ii.terpvault.zip` |
| Export zip SHA-256 | `8f49305048c708829415bcbe928885edee79d3a11642a985d46011bd9d18259c` |
| Export zip size | `100827901` bytes |
| Exported story SHA-256 | `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef` |

Exported contents summary:

- `game.yaml`, `zork2.z3`, `LICENSE-upstream.txt`, `provenance.md`, `metadata.iFiction.xml`, `how-to-play.md`, `hints.md`, and `walkthrough.md`.
- `cover.jpg`, `small-cover.jpg`, `hero.jpg`, `screenshots/01.png`, and `screenshots/02.png`.
- Seven feelies under `feelies/`.
- No `.DS_Store`, `__MACOSX`, AppleDouble files, temp files, swap files, lock files, or `.bak` story files were present in the exported package.

Import inspection result:

- Result: ok.
- Candidate slug: `zork-ii`.
- Title detected: `Zork II`.
- Story file detected: `zork2.z3`.
- `metadata.iFiction.xml` detected and preview-capable.
- Expected warnings only: original slug collision and draft-forcing note.
- Fatal errors: none.

Import commit result:

- Temporary import slug: `zork-ii-import-smoke`.
- Import result: ok.
- Import was forced to `draft` and `featured: false`.
- IFID remained `ZCODE-63-860811`.
- Imported story SHA-256: `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef`.
- Imported helper docs, images, screenshots, feelies, `LICENSE-upstream.txt`, `provenance.md`, and package-root `metadata.iFiction.xml` were present.

Manifest and route checks:

- Manifest after import showed both original `zork-ii` and temporary `zork-ii-import-smoke` as `draft`, with `has_story_file: true`, `has_ifiction: true`, IFID `ZCODE-63-860811`, warnings `[]`, and errors `null`.
- Temporary publish route checks for `zork-ii-import-smoke` returned `200` for detail, play, story, walkthrough, cover, and hero routes.
- Story route returned `application/octet-stream`, `92414` bytes, SHA-256 `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef`.

Imported-package dfrotz verification:

```sh
/opt/homebrew/bin/dfrotz -p -s 41 /Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-ii-import-smoke/zork2.z3 < /private/tmp/terpvault-zork2-repair-commands-fantasies-counter-v17.txt > /private/tmp/terpvault-zork2-import-smoke-transcript.txt 2>&1
```

Result:

- Final score: `400/400`.
- Move count: `372`.
- Rank: `Master Adventurer`.
- Normal output worked.
- `SUPERBRIEF` was not needed.
- No fatal memory error occurred.

Cleanup:

- Temporary import package moved out of the active DDEV library to `/private/tmp/terpvault-zork-ii-import-smoke/zork-ii-import-smoke`.
- Grav cache was cleared after cleanup.
- Original `zork-ii` remains draft with story SHA-256 `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef`.
- No `_demo` files changed.
- No Zork I or Zork III files changed.
- Final package audit and any `_demo` promotion decision remain pending.

## Zork II Final Package Audit - 2026-06-02

This pass audited the repaired DDEV-only Zork II draft package after artifact adoption and export/import smoke. It did not copy anything into `_demo`, did not modify Zork I or Zork III, and did not change runtime/Admin2/Parchment code.

Audit result:

- Result: passed for DDEV package readiness.
- Recommendation: ready for Craig approval and ready for an explicit `_demo` promotion pass, if approved.
- Package remains candidate-only and draft until that later explicit pass.

Story artifact:

| Field | Value |
| --- | --- |
| Selected package story path | `user/data/terpvault/games/zork-ii/zork2.z3` |
| SHA-256 | `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef` |
| File identification | `Infocom (Z-machine 3, Release 63, Serial 860811)` |
| IFID | `ZCODE-63-860811` |

Package hygiene:

- Active package file inventory contained only expected package files: `game.yaml`, `zork2.z3`, `LICENSE-upstream.txt`, `provenance.md`, `metadata.iFiction.xml`, helper Markdown, cover/small-cover/hero art, screenshots, and feelies.
- Cruft check returned no active package files matching `.DS_Store`, `__MACOSX`, AppleDouble files, temp files, editor backups, swap files, lock files, `.bak`, or `.bak-*`.
- Pre-repair backup remains outside the package at `/private/tmp/terpvault-zork2-pre-repair-backup/zork2.z3.pre-repair-10015c-20260602-192833.bak`, SHA-256 `10015c715e9226c491bbfe23e448df14e859a0d9f905afc4fe0c18d65d176019`.

Metadata and helper docs:

- `game.yaml` parsed as YAML.
- `terpvault.status` remained `draft`.
- `terpvault.featured` remained `false`.
- `resources.story_file` remained `zork2.z3`.
- `identification.format` remained `zcode`.
- `identification.ifids` included `ZCODE-63-860811`.
- Package resources referenced cover, small cover, hero, two screenshots, helper docs, and seven feelies.
- `metadata.iFiction.xml` passed `xmllint --noout` and references `Zork II`, `ZCODE-63-860811`, and Release 63 / Serial 860811 context.
- Player-facing helper docs are current: `walkthrough.md` states the repaired artifact checksum, final score `400/400`, `372` moves, rank `Master Adventurer`, normal output, and that `SUPERBRIEF` was not needed. `how-to-play.md` now states export/import checks have passed.
- Historical failed-verification sections remain in provenance for evidence continuity and are superseded by the repaired artifact adoption, export/import smoke, and this final audit section.

Final dfrotz audit:

```sh
/opt/homebrew/bin/dfrotz -p -s 41 user/data/terpvault/games/zork-ii/zork2.z3 < /private/tmp/terpvault-zork2-repair-commands-fantasies-counter-v17.txt > /private/tmp/terpvault-zork2-final-audit-transcript.txt 2>&1
```

Result:

- Final score: `400/400`.
- Move count: `372`.
- Rank: `Master Adventurer`.
- Normal output worked.
- `SUPERBRIEF` was not needed.
- No fatal memory error occurred.

Manifest and route checks:

- Draft manifest returned HTTP `200`.
- `zork-ii` status was `draft`.
- `has_story_file: true`.
- `has_ifiction: true`.
- IFID `ZCODE-63-860811` present.
- Warnings `[]`.
- Errors `null`.
- Resources present for story, cover, small cover, hero, screenshots, helper docs, and feelies.

Temporary publish route checks passed, then the package was restored to draft:

- `/if/zork-ii`: `200`, `text/html`.
- `/if/zork-ii/play`: `200`, `text/html`.
- `/if/_story/zork-ii/zork2.z3`: `200`, `application/octet-stream`, `92414` bytes, SHA-256 `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef`.
- `/if/_asset/zork-ii/walkthrough.md`: `200`, `text/markdown`.
- `/if/_asset/zork-ii/hints.md`: `200`, `text/markdown`.
- `/if/_asset/zork-ii/how-to-play.md`: `200`, `text/markdown`.
- `/if/_asset/zork-ii/cover.jpg`: `200`, `image/jpeg`.
- `/if/_asset/zork-ii/small-cover.jpg`: `200`, `image/jpeg`.
- `/if/_asset/zork-ii/hero.jpg`: `200`, `image/jpeg`.
- `/if/_asset/zork-ii/screenshots/01.png`: `200`, `image/png`.
- `/if/_asset/zork-ii/feelies/bozbarland-flyer.pdf`: `200`, `application/pdf`.
- `/if/_asset/zork-ii/feelies/zug-map-inside.jpg`: `200`, `image/jpeg`.

Public draft behavior after restore:

- `/if/zork-ii`: `404`.
- `/if/_asset/zork-ii/cover.jpg`: `404`.

Prior export/import smoke remains passed. The temporary import package was already moved out of the active DDEV library. No `_demo` files changed. No Zork I or Zork III files changed.

## Zork II Approval and Player-Facing Docs Polish - 2026-06-02

Craig approved Zork II for `_demo` promotion after the repaired artifact adoption, full route verification, export/import smoke, and final package audit.

Before copying the package into the repository `_demo` tree, the public helper Markdown files were reviewed and polished for player use:

- `how-to-play.md` was rewritten as a friendly parser guide without DDEV, audit, or candidate-status language.
- `hints.md` was kept as a spoiler-safe progressive hint document without development or verification jargon.
- `walkthrough.md` was kept as a full-spoiler complete command route and simplified to player-facing notes plus the final result.

Technical development details, source patch notes, checksums, failed transcript history, export/import evidence, and audit evidence remain in this `provenance.md` file rather than in the player-facing helper docs.

The selected story artifact remains unchanged:

- Path: `zork2.z3`.
- SHA-256: `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef`.
- File identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- IFID: `ZCODE-63-860811`.

At this note stage, no `_demo` copy had been made yet. The package remained draft in DDEV pending the explicit promotion copy and clean seed check.

## Zork II _demo Promotion / Clean Seed Check - 2026-06-02

Craig approved Zork II for `_demo` promotion. The reviewed DDEV package was copied into the repository `_demo` tree at:

```text
_demo/data/terpvault/games/zork-ii
```

The `_demo` package follows the existing Zork I/Zork III `_demo` convention:

- `terpvault.status: published`
- `terpvault.featured: false`

Promotion validation:

- `_demo` `game.yaml` parsed as YAML.
- `_demo` `metadata.iFiction.xml` passed XML validation.
- `_demo` package cruft check found no `.DS_Store`, `__MACOSX`, AppleDouble files, temp files, editor backups, swap files, lock files, `.bak`, or `.bak-*` files.
- `_demo` story SHA-256: `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef`.
- `_demo` story file identification: `Infocom (Z-machine 3, Release 63, Serial 860811)`.
- `_demo` story dfrotz verification reached `400/400` in `372` moves, rank `Master Adventurer`.

Clean DDEV seed check:

- Previous DDEV `zork-ii` package was moved aside to `/private/tmp/terpvault-zork2-ddev-pre-demo-seed-20260602-202609/zork-ii`.
- The repository `_demo` package was copied back into DDEV at `user/data/terpvault/games/zork-ii`.
- Grav cache was cleared after seeding.
- Seeded DDEV `game.yaml` status: `published`.
- Seeded DDEV `game.yaml` featured: `false`.
- Seeded DDEV story SHA-256: `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef`.
- Seeded DDEV manifest returned HTTP `200`; `zork-ii` was present as `published`, with `has_story_file: true`, `has_ifiction: true`, IFID `ZCODE-63-860811`, warnings `[]`, and errors `null`.
- Public seeded route checks returned `200` for `/if/zork-ii`, `/if/zork-ii/play`, `/if/_story/zork-ii/zork2.z3`, `/if/_asset/zork-ii/walkthrough.md`, `/if/_asset/zork-ii/cover.jpg`, and `/if/_asset/zork-ii/hero.jpg`.
- Seeded story route returned `application/octet-stream`, `92414` bytes, SHA-256 `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef`.

No Zork I or Zork III package files changed during this promotion pass. No TerpVault runtime/Admin2/Parchment code changed.

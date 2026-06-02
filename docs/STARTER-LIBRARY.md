# Starter Library Notes

TerpVault should ship with a safe original sample package, then offer optional starter package recipes for classic public/free IF where redistribution is permitted.

Use `docs/DEMO-CONTENT-RIGHTS.md` as the shared rights/provenance policy for demo and starter content. Future packages should classify story/source material, package-local original materials, historical reference/preservation materials, third-party materials requiring caution, and uncertain provenance separately.

## Recommended default bundle

Before any future GPM-ready plugin package, ship only `sample-cave`, an original placeholder/demo package owned by the TerpVault project.

For Craig's development branch, the `_demo` tree also includes real starter packages so the player and library views can be tested with multiple playable titles. Each package should retain cautious source, license, provenance, supplemental-material classification, and redistribution notes before broader public distribution.

## v0.4.x and v0.5.0 direction

- Keep v0.4.x starter-library work incremental and evidence-driven.
- Zork II should remain a candidate until its source build, playable artifact, Parchment playback, package metadata, helper docs, and package-level provenance are complete. Zork III has completed that review path for this development demo tree and is bundled in `_demo`.
- Mainframe Zork / Dungeon should remain a research-only candidate, separate from Zork I/II/III, until source selection, legal/provenance review, reference transcripts, build/reconstruction path, playback, and helper docs are clean.
- Adventure / Colossal Cave should remain a candidate until the exact implementation, license, playable target, and TerpVault runtime strategy are verified.
- Grue and You Are Standing should be polished only if the exact story-file license, package-local original material notes, and supplemental material provenance are clear enough for the intended distribution.
- v0.5.0 may become a public/GPM-readiness candidate only if the included starter/demo set is conservative, well documented, and free of questionable historical/commercial assets.
- Demo art and helper docs should be original or have documented reuse rights, with package-local notes explaining source, classification, and license/provenance status.

## Current real starter packages

### Adventure / Colossal Cave

The `adventure` starter package uses a portable Adventure/Colossal Cave story-file variant for TerpVault playback testing. Its package manifest intentionally keeps "Verify before redistribution" license notes because the exact rights/provenance still need review before publishing broadly.

### You Are Standing

The `you-are-standing` starter package uses `standing.z5`, downloaded from IF Archive:

```text
https://ifarchive.org/if-archive/games/zcode/standing.z5
```

IFDB lists the work as Creative Commons and records IFIDs `ZCODE-2-231227-5C4E` and `ZCODE-3-240105-9704`. The IFDB page also links author-hosted source, but the checked source package did not clarify the exact Creative Commons variant. TerpVault therefore records the license as generic `Creative Commons` with a note to verify the exact CC variant before redistribution beyond this starter/demo package.

The package uses generated placeholder cover art and curator-created `how-to-play.md` / `hints.md` files. Author-hosted external hints are not bundled.

### Grue

The `grue` starter package uses `grue.z8`, downloaded from IF Archive:

```text
https://ifarchive.org/if-archive/games/zcode/Grue.z8
```

IFDB lists the work as Creative Commons and records IFID `47DEC7E0-8F4D-4791-BFB8-382E1F4E6A16`. The author's GitHub README identifies the work as Creative Commons Attribution-ShareAlike 4.0 International:

```text
https://github.com/option8/grue
```

The IF Archive story file and GitHub `GRUE.z8` file were compared by SHA-256 and matched. The package uses generated placeholder cover art and curator-created `how-to-play.md` / `hints.md` files. The external walkthrough linked from IFDB is not bundled because it is a separate work with separate provenance.

## Good candidates to package after license/provenance review

### Ink works

Ink should be considered for future starter/demo candidates after TerpVault has first-class Ink package support. Ink is a choice-based interactive narrative scripting language from inkle, so candidates should be reviewed as complementary choice-based IF rather than parser IF.

Prefer candidates that provide clear redistribution rights, compiled Ink JSON, optional `.ink` source for transparency, and a small polished scope suitable for inline web play. Do not add Ink starter packages until the package manifest, runtime adapter, and Admin2 validation path exist.

### Scott Adams conversions

IF Archive lists `adamsinform.zip`, containing 17 Scott Adams adventures and one sample mini-adventure converted from ScottFree to Inform `.z5`. This would make a terrific optional package set, but it should not be bundled until redistribution rights are verified for the converted story files and any metadata/art we add.

### Zork

Microsoft/Open Source Programs Office announced Zork I, II, and III source code under the MIT License, but the announcement also says packaging, marketing materials, trademarks, and other assets outside the source-code scope are excluded. For TerpVault, the cleanest path is a documented user recipe: compile the official source with ZILF, then import the resulting `.z3` into TerpVault.

Current candidate notes:

- Zork I is the verified bundled anchor demo, with story/source provenance recorded separately from package-local original materials and selected historical reference/preservation feelies. It records release-specific IFID `ZCODE-119-880429`, IFDB/IFWiki catalog links, and package-local `metadata.iFiction.xml`.
- Zork II remains candidate-only because the unmodified ZILF build failed and the scratch-only compatibility patch or prebuilt artifact basis has not been selected for packaging.
- Zork III is bundled in `_demo` after source build verification, DDEV playback checks, export/import smoke, verified walkthrough, metadata/iFiction review, final audit, Craig approval, and clean DDEV demo-seed route/checksum verification.
- Do not add Zork II to `_demo` until the selected artifact basis, license/provenance, playback behavior, helper docs, screenshots, package-local original materials, any historical reference/preservation materials, and export/import audit are complete.

### Mainframe Zork / Dungeon

Mainframe Zork / Dungeon is a separate research-only candidate, not a fourth entry in the current Zork I/II/III package track. The Phase 0 research packet should inform future source selection and transcript comparison, but TerpVault should not copy story files, draft package skeletons, package art, or playable artifacts from it.

The likely future path is to select the exact source basis, verify license/provenance, establish a reference runner, compare transcripts, choose a target story format, and only then build or reconstruct a TerpVault package. Glulx/`.gblorb` is likely a more practical first target than `.z8`, but that choice should wait for source/build constraints. Existing Z-code reconstructions such as `zdungeon.z5` are witnesses for comparison, not automatically canonical bundled artifacts.

### PDFA Ottumwa

PDFA Ottumwa remains a backup candidate for future starter-package work if additional Creative Commons packages are needed. Review IFDB, IF Archive/source files, and any included metadata before bundling a story file.

## Package rule

Every bundled or downloadable starter package should include metadata like:

```yaml
license:
  name: ""
  url: ""
  notes: ""
source:
  url: ""
  retrieved: ""
  notes: ""
```

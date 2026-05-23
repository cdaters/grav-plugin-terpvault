# Starter Library Notes

TerpVault should ship with a safe original sample package, then offer optional starter package recipes for classic public/free IF where redistribution is permitted.

## Recommended default bundle

Before any future GPM-ready plugin package, ship only `sample-cave`, an original placeholder/demo package owned by the TerpVault project.

For Craig's development branch, the `_demo` tree also includes real starter packages so the player and library views can be tested with multiple playable titles. Each package should retain cautious source, license, and redistribution notes before broader public distribution.

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

### Scott Adams conversions

IF Archive lists `adamsinform.zip`, containing 17 Scott Adams adventures and one sample mini-adventure converted from ScottFree to Inform `.z5`. This would make a terrific optional package set, but it should not be bundled until redistribution rights are verified for the converted story files and any metadata/art we add.

### Zork

Microsoft/Open Source Programs Office announced Zork I, II, and III source code under the MIT License, but the announcement also says packaging, marketing materials, trademarks, and other assets outside the source-code scope are excluded. For TerpVault, the cleanest path is a documented user recipe: compile the official source with ZILF, then import the resulting `.z3` into TerpVault.

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

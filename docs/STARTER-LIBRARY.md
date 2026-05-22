# Starter Library Notes

TerpVault should ship with a safe original sample package, then offer optional starter package recipes for classic public/free IF where redistribution is permitted.

## Recommended default bundle

For a public GPM-ready plugin, ship only `sample-cave`, an original placeholder/demo package owned by the TerpVault project. For Craig's development branch, v0.1.5 also includes a user-provided `adventure` package so the player can be tested with a real playable title.

## Good candidates to package after license/provenance review

### Adventure / Colossal Cave

IF Archive lists multiple Z-code versions of Adventure / Colossal Cave, including `Advent.z5`, `advent.z6`, and other variants. The v0.1.5 development package includes an `adventure` package built from the user-provided archive and should retain source/provenance fields before public distribution.

### Scott Adams conversions

IF Archive lists `adamsinform.zip`, containing 17 Scott Adams adventures and one sample mini-adventure converted from ScottFree to Inform `.z5`. This would make a terrific optional package set, but it should not be bundled until redistribution rights are verified for the converted story files and any metadata/art we add.

### Zork

Microsoft/Open Source Programs Office announced Zork I, II, and III source code under the MIT License, but the announcement also says packaging, marketing materials, trademarks, and other assets outside the source-code scope are excluded. For TerpVault, the cleanest path is a documented user recipe: compile the official source with ZILF, then import the resulting `.z3` into TerpVault.

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

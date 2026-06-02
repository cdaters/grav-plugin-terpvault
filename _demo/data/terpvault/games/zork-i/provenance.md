# Zork I Provenance

This is a bundled TerpVault `_demo` package. It is not official Infocom packaging and should be reviewed under `docs/DEMO-CONTENT-RIGHTS.md` before any broader public/GPM distribution.

## Source

- Upstream repository: https://github.com/historicalsource/zork1.git
- Upstream commit: `97b7b3d68c075dd9af7da499c3e9690ada3471fd`
- License file path in upstream repository: `LICENSE`
- Observed license: MIT License
- Observed copyright line: `Copyright (c) 2025 Microsoft`
- Source/license retrieval date: 2026-05-24

## Build

- .NET SDK: 10.0.300
- ZILF: 1.8
- ZAPF: 1.8
- Scratch source/build path: `/tmp/terpvault-zork1-build`

Build commands used in scratch:

```sh
zilf zork1.zil
zapf zork1.zap zork1-release119-serial880429.z3 -r 119 -s 880429
```

Selected package artifact:

- Source-built artifact: `/tmp/terpvault-zork1-build/zork1-release119-serial880429.z3`
- Package filename: `zork1.z3`
- SHA-256: `973d3e5a21fba45077e01b1342e17d75db405f45948bca38ccfa9001b7d54917`
- File identification: `Infocom (Z-machine 3, Release 119, Serial 880429)`

The selected source-built artifact does not match the upstream prebuilt `COMPILED/zork1.z3` / `zork1.zip` checksum.

## Exclusions

Historical commercial packaging, manuals, maps, ads, logos, trade dress, scans, and marketing art are excluded from this demo package unless item-level review later supports inclusion.

Future art, screenshots, helper docs, maps, and feelies should be classified before inclusion. A source/story-file license should not be treated as covering supplemental materials unless that status is separately documented.

## Supplemental Material Classification

Future supplemental materials should be classified in package provenance as one of:

- Story/source license material.
- Craig-created/original package-local material.
- Historical reference/preservation material.
- Uncertain provenance / pending review.

Historical reference/preservation material, if added later, should be identified separately from source-license material and package-local original material. Inclusion should be framed as historical preservation, documentation, research, commentary, and educational context, subject to item-level review; it should not be described as newly licensed, public domain, official, endorsed, copyright-free, or automatically fair use unless that status is specifically documented for the item.

## Package-local original feelies

- `feelies/feelie-01-poster.png`: original Craig Daters 2026 poster art inspired by the retail-era tradition of adventure-game feelies. It is not copied from Infocom packaging, manuals, maps, ads, logos, trade dress, scans, or commercial feelies.

## Zork I Feelies Update

Update date: 2026-06-02.

Shared policy: `docs/DEMO-CONTENT-RIGHTS.md`.

Source folder: `/Users/cdaters/Downloads/for-Zork1`.

Copied files:

| Source filename | Target path | SHA-256 | Provenance classification |
| --- | --- | --- | --- |
| `Zork 1 - InvisiClues Map.pdf` | `feelies/zork-i-invisiclues-map.pdf` | `f379b1c08788beba7933a38e0a0efe01ee170eb40979903fa927fb491057b2f4` | Historically circulating reference/preservation material requiring caution |
| `Zork 1 - Map.jpg` | `feelies/zork-i-map.jpg` | `aeef787f5add2d14671e0cd22276e9fe54a9e6aeee6f18bed8eab1cf5eb55ed9` | Historically circulating reference/preservation material |
| `Zork 1 - Poster.jpg` | `feelies/zork-i-poster.jpg` | `8c833877753b9a3de1441338cac9f0b35591ce6ffa97797a8ed3d80e2aedf459` | Likely commercial material requiring caution |
| `Zork 1 - The Great Underground Empire.pdf` | `feelies/great-underground-empire.pdf` | `1094ffd0f09f65923f5ca5051bd2d7e985ba1b689e58c0434247b619ddc33a5b` | Historically circulating reference/preservation material |
| `Zork 1 - ZUG Map Inside.jpg` | `feelies/zug-map-inside.jpg` | `65e454f4166aa3094a3e1885e452d6ee84c204bde6a1d6dae60970114eafa5ea` | Historically circulating reference/preservation material |
| `Zork 1 - ZUG Map Outside.jpg` | `feelies/zug-map-outside.jpg` | `08637e1370e626b9299d12afc11d55252acad667cce2c6f8d56f02fb1b639df6` | Historically circulating reference/preservation material |

Preservation/fair-use rationale: these supplemental materials are included for historical preservation, documentation, research, commentary, educational context, and play context. They are not presented as newly licensed, public domain, official, endorsed, copyright-free, or automatically fair use. They are not intended as a substitute for any commercial product, and the story/source MIT license is not treated as covering these supplemental materials unless an item-specific review documents that status.

The `Zork 1 - Poster.jpg` image includes historical copyright/creator text in the image and is therefore classified as likely commercial material requiring caution rather than Craig-created/original package-local material. It is included only as historical visual context under the shared policy.

No expected Zork I feelies were skipped in this pass. Non-target files in the source folder, including `.DS_Store`, screenshots, cover/small-cover/hero images, source working folders, and notes, were not copied as part of this feelies update. The existing package-local `.DS_Store` cruft file was removed from `_demo/data/terpvault/games/zork-i`.

Rights-Holder Removal Requests / DMCA: if you are a rights holder and believe specific material should not be included, please contact [dmca@retrorealm.org](mailto:dmca@retrorealm.org) with the item name, the location of the material, and the basis for the request. Disputed material will be reviewed promptly and removed or restricted where appropriate.

No runtime code, Admin2 files, Parchment files, story files, release metadata, or package binaries were changed for this feelies update. No external prose was copied into `game.yaml` descriptions or this provenance narrative.

Validation:

- `game.yaml` parsed successfully with Ruby YAML.
- `file` recognized the copied feelies as PDF or JPEG files.
- Copied feelie SHA-256 checksums matched the source files listed above.
- Package support files were non-empty.
- Package cruft scan found no `.DS_Store`, `__MACOSX`, AppleDouble, backup, temp, swap, or lock files after cleanup.

DDEV seed and route check:

- Existing DDEV package was moved to `/private/tmp/terpvault-ddev-zork-i-backup-20260602`.
- Updated `_demo` package was copied to `/Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-i`.
- `bin/grav clearcache` was run through DDEV.
- Detail route `https://grav20.ddev.site/if/zork-i` returned `200 text/html`.
- Play route `https://grav20.ddev.site/if/zork-i/play` returned `200 text/html`.
- Story route `https://grav20.ddev.site/if/_story/zork-i/zork1.z3` returned `200 application/octet-stream`, 86928 bytes, SHA-256 `973d3e5a21fba45077e01b1342e17d75db405f45948bca38ccfa9001b7d54917`.
- New feelie route `https://grav20.ddev.site/if/_asset/zork-i/feelies/zork-i-invisiclues-map.pdf` returned `200 application/pdf`, 2924735 bytes.
- New feelie route `https://grav20.ddev.site/if/_asset/zork-i/feelies/zug-map-inside.jpg` returned `200 image/jpeg`, 7553801 bytes after a second cache clear resolved a transient compiled-YAML cache parse error.
- New feelie route `https://grav20.ddev.site/if/_asset/zork-i/feelies/zork-i-poster.jpg` returned `200 image/jpeg`, 4753920 bytes.
- New feelie route `https://grav20.ddev.site/if/_asset/zork-i/feelies/great-underground-empire.pdf` returned `200 application/pdf`, 1426021 bytes.

## Rights-Holder Removal Requests / DMCA

If you are a rights holder and believe specific material should not be included, please contact [dmca@retrorealm.org](mailto:dmca@retrorealm.org) with the item name, the location of the material, and the basis for the request. Disputed material will be reviewed promptly and removed or restricted where appropriate.

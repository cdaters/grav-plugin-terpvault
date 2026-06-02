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

## Rights-Holder Removal Requests / DMCA

If you are a rights holder and believe specific material should not be included, please contact [dmca@retrorealm.org](mailto:dmca@retrorealm.org) with the item name, the location of the material, and the basis for the request. Disputed material will be reviewed promptly and removed or restricted where appropriate.

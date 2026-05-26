# Zork I Provenance

This is a DDEV-only TerpVault draft package. It is not approved for bundled demo use and should not be copied into `_demo` until final package review is complete.

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

Historical commercial packaging, manuals, maps, ads, logos, trade dress, scans, and marketing art are excluded from this draft package unless separately licensed later.

Final art, screenshots, helper docs, maps, and feelies should be Craig-created/original unless a separate license review explicitly allows reuse of another source.

## Package-local original feelies

- `feelies/feelie-01-poster.png`: original Craig Daters 2026 poster art inspired by the retail-era tradition of adventure-game feelies. It is not copied from Infocom packaging, manuals, maps, ads, logos, trade dress, scans, or commercial feelies.

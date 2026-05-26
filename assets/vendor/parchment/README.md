# Parchment Vendor Build

This folder contains the bundled TerpVault Parchment adapter.

Included file:

```text
index.html
```

`index.html` is the single-file Parchment web build from release **2025.1.14**, supplied as `parchment-single-file-2025-01-14.zip` and renamed from `parchment.html` so TerpVault can load it consistently.

TerpVault serves this file through its controlled `/if/_engine/parchment` route and passes a JSON `story=` query parameter containing the controlled story URL, inferred/interpreted format, and title. This is important because TerpVault serves story files through routes such as `/if/_file/sample-cave`, which do not expose the original `.z5` extension.

See:

- `docs/PARCHMENT-BUNDLING.md`
- `docs/THIRD-PARTY-NOTICES.md`

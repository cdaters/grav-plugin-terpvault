# Third-Party Notices

TerpVault plugin code is MIT licensed.

## Parchment

Bundled version: **Parchment 2025.1.14**

Bundled file:

```text
assets/vendor/parchment/index.html
```

Source artifact provided to this project:

```text
parchment-single-file-2025-01-14.zip
  parchment.html
```

The file was renamed to `index.html` for TerpVault's local adapter path.

Parchment itself is MIT licensed and may incorporate upstream components under MIT, BSD-2-Clause, OFL, GPL-2.0, and/or other licenses depending on the release/build included. The bundled single-file HTML includes an embedded bundled-license comment near the end of the file; keep it intact.

Known bundled/upstream component families include jQuery, js-cookie, Lodash, Bocfel, Glulxe, Git, Hugo, Scare, TADS, RemGlk-rs, AsyncGlk, Emglken, and Iosevka. Verify against the upstream Parchment release when updating this vendor build.

## Bundled / demo game packages

The included `sample-cave` package uses original placeholder metadata/art and a non-playable placeholder `game.z5` text file for structure testing only.

This development package also includes a cleaned user-provided Adventure starter package under `_demo/data/terpvault/games/adventure`. Its `game.yaml` includes source and license/provenance notes. Verify redistribution rights before publishing it broadly or shipping it as part of a public plugin release.

## Starter libraries

Classic IF story files from IF Archive or other sources should be added only when their redistribution rights are clear. See `docs/STARTER-LIBRARY.md` for suggested package recipes and provenance fields.

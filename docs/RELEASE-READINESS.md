# Release Readiness

This checklist is for preparing TerpVault before starting broader Admin2 Library Manager work or packaging a public plugin release.

## Current release posture

- Public routes under `/if` are the stable surface.
- Public virtual routes support subdirectory installs through Grav base-route-aware URL helpers.
- Bundled Parchment playback is the current player path.
- Save and restore are interpreter-native. Players should use story commands such as `SAVE` and `RESTORE`.
- The Admin2 Library Hub is an experimental scaffold and is disabled by default with `admin.enable_admin2_page: false`.
- Admin2/API endpoints are not enabled yet.
- `.terpvault.zip` package import/export is planned but not implemented.

## Starter package policy

For a public GPM-ready release, ship only public-safe original demo material unless real IF redistribution review is complete.

- `sample-cave`: original TerpVault structure demo; public-safe, but not a playable story.
- `adventure`: development starter package for playback testing; keep cautious redistribution/provenance notes.
- `you-are-standing`: development starter package. IFDB lists Creative Commons, but the exact CC variant is not confirmed in package metadata; do not overclaim specificity.
- `grue`: development starter package. IFDB lists Creative Commons, and the author's GitHub README identifies Creative Commons Attribution-ShareAlike 4.0 International.

Generated placeholder art and curator-created helper notes should be described as TerpVault starter-package material, not original cover art or official game documentation.

## Install/update checks

Use Grav's cache command consistently:

```bash
bin/grav clearcache
```

Before tagging:

- Install or update the plugin in a clean Grav 2 site.
- Run `bin/grav clearcache`.
- Confirm `/if` renders the library.
- Confirm `/if/{slug}` and `/if/{slug}/play` render for at least one real package.
- Confirm `/if/_story/{slug}/{story-file}` streams a story file.
- Confirm `/if/_asset/{slug}/cover.jpg` serves package art.
- Confirm the same routes work when Grav is installed in a subdirectory.
- Confirm Admin2 loads normally with `admin.enable_admin2_page: false`.

## GPM/public-release checklist

- Exclude development-only real IF packages unless redistribution review is complete.
- Keep `sample-cave` if a structure demo is needed.
- Preserve `docs/THIRD-PARTY-NOTICES.md`.
- Preserve Parchment's embedded bundled-license comment in `assets/vendor/parchment/index.html`.
- Confirm README does not advertise Admin2/API package editing as available.
- Confirm README states `.terpvault.zip` import/export is planned but not implemented.
- Confirm no package manifest invents license specificity.
- Confirm no `.DS_Store`, `__MACOSX`, AppleDouble `._*`, temporary image source, or editor backup files are included.

## Local verification commands

```bash
git diff --check
rg -n "bin/grav clearcache" README.md docs CHANGELOG.md
find . -name '.DS_Store' -o -name '__MACOSX' -o -name '._*'
```

The `rg` command above should find the approved cache-command spelling. Search separately for outdated cache-command variants before tagging.

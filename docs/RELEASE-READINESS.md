# Release Readiness

This checklist is for preparing TerpVault before broader public-beta testing or any future public plugin packaging.

## Current release posture

- Public routes under `/if` are the stable surface.
- Public virtual routes support subdirectory installs through Grav base-route-aware URL helpers.
- Bundled Parchment playback is the current player path.
- Parchment is a required bundled parser/runtime dependency under `assets/vendor/parchment/` and must remain tracked in release packages.
- Ink support is future roadmap only and must not disturb current Parchment/Z-code playback.
- Save and restore are interpreter-native. Players should use story commands such as `SAVE` and `RESTORE`.
- The Admin2 Library Manager is experimental and disabled by default with `admin.enable_admin2_page: false`.
- Admin2/API package management routes are registered only when the Admin2 Library Manager is enabled.
- Admin2 create/edit/export/import workflows require authenticated Admin2/API access with `admin.super` or `api.super`.
- `.terpvault.zip` export, import inspection, and draft-only import commit are implemented; import overwrite/replace is not.
- Imported packages are forced to draft, forced to not featured, and never overwrite existing package folders.
- TerpVault is not GPM-ready yet.

## Starter package policy

Before any future GPM-ready release, ship only public-safe original demo material unless real IF redistribution review is complete.

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
- Confirm public library/detail/play pages remain readable in the active site theme, with future explicit coverage for Quark2 and Typhoon light/dark modes.
- Confirm Admin2 loads normally with `admin.enable_admin2_page: false`.
- If `admin.enable_admin2_page: true` is tested, confirm Admin2 create/edit/export/import workflows are authenticated, non-overwriting, and do not add package delete or overwrite/replace behavior.
- For future delete/remove work, confirm destructive actions are absent until a reviewed design exists with package title/slug confirmation, manifest-vs-physical-delete distinction, trash/quarantine or backup behavior, CSRF/token and permission guardrails, package containment checks, and audit/result feedback.
- For future large-library work, confirm Admin2 still handles small libraries while search/filter/sort/pagination or virtual scrolling preserve row state and avoid rendering hundreds of heavy media previews at once.
- For future metadata-assistant work, confirm local iFiction apply remains preview-driven, `game.yaml` is backed up before writes, remote lookup requires explicit action, and metadata enrichment remains separate from story-file/package download or asset redistribution.

## GPM/public-release checklist

- Exclude development-only real IF packages unless redistribution review is complete.
- Keep `sample-cave` if a structure demo is needed.
- Preserve `docs/THIRD-PARTY-NOTICES.md`.
- Preserve tracked bundled Parchment adapter assets under `assets/vendor/parchment/`; GitHub source/download ZIP installs must include the files served through `/if/_engine/parchment`.
- Preserve Parchment's embedded bundled-license comment in `assets/vendor/parchment/index.html`.
- Confirm README describes Admin2/API package creation, editing, export, import inspection, and draft-only import commit as experimental opt-in workflows.
- Confirm README states `.terpvault.zip` import is draft-only, non-overwriting, and forced to not featured.
- Confirm no package manifest invents license specificity.
- Confirm no `.DS_Store`, `__MACOSX`, AppleDouble `._*`, temporary image source, or editor backup files are included.

## GitHub About suggestions

Suggested description:

```text
Grav plugin for curating, importing/exporting, and playing interactive fiction packages with Parchment.
```

Suggested topics:

```text
grav, grav-plugin, interactive-fiction, parser-fiction, zcode, glulx, tads, parchment, retro, games
```

## Local verification commands

```bash
git diff --check
rg -n "bin/grav clearcache" README.md docs CHANGELOG.md
find . -name '.DS_Store' -o -name '__MACOSX' -o -name '._*'
```

The `rg` command above should find the approved cache-command spelling. Search separately for outdated cache-command variants before tagging.

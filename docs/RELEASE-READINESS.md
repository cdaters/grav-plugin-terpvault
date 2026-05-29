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
- The v0.4.x line should remain incremental: focused Admin2/library improvements, metadata/iFiction polish, safe delete design, demo candidate preparation, and player/theme checks.
- Inline Play Mode, autostart, terminal theme presets, and public theme pickers are roadmap-only unless a future build explicitly implements and documents them.
- v0.5.0 is the intended public milestone/GPM-readiness candidate line, pending a full audit and a credible demo/support posture.

## v0.5.0 milestone criteria

- Plugin metadata, `blueprints.yaml`, README, CHANGELOG, LICENSE, and third-party notices are GPM-friendly.
- Grav/Admin2/API dependencies and compatibility are correct and stable.
- Bundled Parchment is tracked, documented, included in GitHub source/download ZIPs, and license-noticed.
- Public routes are stable: `/if`, `/if/{slug}`, `/if/{slug}/play`, `/if/_engine/parchment`, and `/if/_manifest`.
- Admin2 Library Manager is stable enough for beta use: package create, metadata edit, helper Markdown edit, media/screenshots management, story replacement, export, import inspect, draft-only import commit, version visibility, and any completed large-library search/filter/sort basics.
- Metadata/iFiction behavior is clear: local `metadata.iFiction.xml` preview/apply is documented, and IFDB/IFWiki/IF Archive remote lookup remains roadmap unless implemented.
- Security/destructive boundaries are clear: no package delete unless a safe workflow exists, no silent physical file deletion, no arbitrary package browser, and import remains draft-only and non-overwriting.
- Demo package posture is credible: Zork I remains fully bundled and verified; Zork II/Zork III are added only if provenance/build/playback/helper docs are clean; Adventure / Colossal Cave, Grue, and You Are Standing are polished only if included and properly licensed.
- Mainframe Zork / Dungeon remains research-only unless its source basis, license/provenance, reference transcripts, build/reconstruction path, playable artifact, playback behavior, and helper docs are complete and separately approved.
- Player presentation is readable across common themes. If Inline Play Mode or terminal themes are implemented before v0.5.0, they must preserve `/if/{slug}/play`, support admin defaults, keep public controls optional, and document Parchment iframe/internal styling limits.
- Release artifacts contain no dev-only paths, accidental test/private artifacts, platform cruft, or questionable historical/commercial assets.
- A GitHub release/download ZIP sanity check has been completed before any GPM submission.

## Starter package policy

Before any future GPM-ready release, ship only public-safe original demo material unless real IF redistribution review is complete.

- `sample-cave`: original TerpVault structure demo; public-safe, but not a playable story.
- `adventure`: development starter package for playback testing; keep cautious redistribution/provenance notes.
- `you-are-standing`: development starter package. IFDB lists Creative Commons, but the exact CC variant is not confirmed in package metadata; do not overclaim specificity.
- `grue`: development starter package. IFDB lists Creative Commons, and the author's GitHub README identifies Creative Commons Attribution-ShareAlike 4.0 International.
- `zork-i`: bundled demo package with verified source/provenance and original package assets; keep it audited and re-verify if the story file changes.
- `zork-ii`: candidate only unless the source-build patch or prebuilt artifact basis, provenance, playback, helper docs, original/properly licensed assets, and package audit are complete.
- `zork-iii`: candidate only unless build/artifact basis, provenance, playback, helper docs, original/properly licensed assets, and package audit are complete.
- Mainframe Zork / Dungeon: research-only candidate, separate from the Zork trilogy packages. Do not bundle story files, playable artifacts, draft package skeletons, package art, or demo claims until legal/provenance/build/playback/helper docs are complete.
- Open Adventure / Colossal Cave: candidate only until exact source/release/license and playable package target are verified.

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
- For large-library work, confirm Admin2 search/filter/sort controls preserve state, show accurate result counts, keep expanded row state intact, and still handle small libraries normally. Pagination or virtual scrolling remains future work for very large libraries.
- For metadata-assistant work, confirm local iFiction status/upload/import-awareness/preview/apply remains preview-driven, upload writes only package-root `metadata.iFiction.xml`, import commit preserves XML without auto-applying it, `game.yaml` is backed up before selected-field writes, remote lookup requires explicit action, and metadata enrichment remains separate from story-file/package download or asset redistribution.
- For future Inline Play Mode or terminal theme work, confirm detail-page inline playback is optional, `/if/{slug}/play` still works, autostart behavior lands directly at the story prompt only when safe, public controls can be hidden, contrast is acceptable, scanline/CRT effects can be disabled, reduced-motion preferences are respected, font fallbacks are readable, and Quark2/Typhoon light/dark modes do not break the player.

## GPM/public-release checklist

- Exclude development-only real IF packages unless redistribution review is complete.
- Keep `sample-cave` if a structure demo is needed.
- Keep Zork II, Zork III, Mainframe Zork / Dungeon, Adventure / Colossal Cave, Grue, and You Are Standing out of any GPM-ready bundle unless each package has clean story-file provenance, license notes, original or properly licensed art/helper docs, and package-level audit notes.
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

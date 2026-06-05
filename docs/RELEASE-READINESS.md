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
- Player placement, boot behavior, Inline Play Mode, terminal theme presets, and public theme pickers are roadmap-only unless a future build explicitly implements and documents them.
- Oracle v1 renders simple package-local `resources.hints: hints.md` in the frontend; richer Oracle sources, guided flows, and Admin2 controls remain roadmap-only.
- Content transparency filtering and Admin2 controls are roadmap-only; content notes should describe works neutrally and should not hide, block, endorse, or morally rank works by default.
- A future Admin2 Guide/Help tab is roadmap-only; no runtime Guide tab is implemented yet.
- v0.5.0 is the intended public milestone/GPM-readiness candidate line, pending a full audit and a credible demo/support posture.

## v0.5.0 milestone criteria

- Plugin metadata, `blueprints.yaml`, README, CHANGELOG, LICENSE, and third-party notices are GPM-friendly.
- Grav/Admin2/API dependencies and compatibility are correct and stable.
- Bundled Parchment is tracked, documented, included in GitHub source/download ZIPs, and license-noticed.
- Public routes are stable: `/if`, `/if/{slug}`, `/if/{slug}/play`, `/if/_engine/parchment`, and `/if/_manifest`.
- Admin2 Library Manager is stable enough for beta use: package create, metadata edit, helper Markdown edit, media/screenshots management with authenticated draft-safe image previews, story replacement, export, import inspect, draft-only import commit, version visibility, and any completed large-library search/filter/sort basics.
- Metadata/iFiction behavior is clear: local `metadata.iFiction.xml` preview/apply is documented, and IFDB/IFWiki/IF Archive remote lookup remains roadmap unless implemented.
- Security/destructive boundaries are clear: no package delete unless a safe workflow exists, no silent physical file deletion, no arbitrary package browser, and import remains draft-only and non-overwriting.
- Demo package posture is credible: Zork I, Zork II, and Zork III are fully bundled and verified for the development demo tree; `docs/DEMO-CONTENT-RIGHTS.md` is followed; Adventure / Colossal Cave, Grue, and You Are Standing are polished only if story-file licensing and package-level provenance are complete for the intended distribution.
- Mainframe Zork / Dungeon remains research-only unless its source basis, license/provenance, reference transcripts, build/reconstruction path, playable artifact, playback behavior, and helper docs are complete and separately approved.
- Player presentation is readable across common themes. If player placement/boot controls, Inline Play Mode, or terminal themes are implemented before v0.5.0, they must preserve `/if/{slug}/play`, support admin defaults and package overrides, keep public controls optional, avoid redundant second Play clicks on the focused play page where practical, and document Parchment iframe/internal styling limits.
- If Oracle/progressive hints are implemented before v0.5.0, they must preserve simple `resources.hints: hints.md`, keep package imports/exports backwards compatible, and avoid adding an Ink runtime unless that work is separately scoped.
- If content transparency/search filtering is implemented before v0.5.0, it must preserve packages with simple/no tags, align with Grav-compatible taxonomy/search structures where practical, and keep filtering descriptive rather than punitive.
- If an Admin2 Guide/Help tab is implemented before v0.5.0, it must render local/read-only docs, avoid remote fetches, remain separate from Settings, and reinforce current safety boundaries.
- Release artifacts contain no dev-only paths, accidental test/private artifacts, platform cruft, or questionable historical/commercial assets.
- A GitHub release/download ZIP sanity check has been completed before any GPM submission.

## Starter package policy

Before any future GPM-ready release, ship only public-safe original demo material unless real IF redistribution review is complete.

Follow `docs/DEMO-CONTENT-RIGHTS.md` for demo package rights/provenance. Package records should distinguish story/source license material, package-local original materials, historical reference/preservation materials, third-party materials requiring caution, rights-holder removal requests, and uncertain provenance / pending review.

- `sample-cave`: original TerpVault structure demo; public-safe, but not a playable story.
- `adventure`: development starter package for playback testing; keep cautious redistribution/provenance notes.
- `you-are-standing`: development starter package. IFDB lists Creative Commons, but the exact CC variant is not confirmed in package metadata; do not overclaim specificity.
- `grue`: development starter package. IFDB lists Creative Commons, and the author's GitHub README identifies Creative Commons Attribution-ShareAlike 4.0 International.
- `zork-i`: bundled demo package with verified source/provenance, release-specific IFID/catalog/iFiction metadata, package-local original materials, and selected historical reference/preservation feelies classified in package provenance; keep it audited and re-verify if the story file changes.
- `zork-ii`: bundled demo package with repaired source-built artifact basis, provenance, playback checks, helper-doc polish, package-local materials, package-local iFiction metadata, package audit, approval, and clean DDEV demo-seed route/checksum verification. The promoted artifact has SHA-256 `02830587cfe5ca68c2f9289a9178780761ccec5f1582d13130d6217bd9e437ef`, IFID `ZCODE-63-860811`, includes the `DREARY-ROOM-FCN` build-compatibility patch and `FANTASIES` table-counter repair, and completes under normal dfrotz output to `400/400` in `372` moves, rank `Master Adventurer`.
- `zork-iii`: bundled demo package with verified build/artifact basis, provenance, playback checks, helper docs, package-local materials, package-local iFiction metadata, package audit, and clean DDEV demo-seed route/checksum verification.
- Mainframe Zork / Dungeon: research-only candidate, separate from the Zork trilogy packages. Do not bundle story files, playable artifacts, draft package skeletons, package art, or demo claims until legal/provenance/build/playback/helper docs are complete.
- Open Adventure / Colossal Cave: candidate-only until exact source/commit, license scope, playable format, and TerpVault strategy are verified. Local native build is confirmed from https://gitlab.com/esr/open-adventure (commit `993291a21da44234ae9cf303d0ffc0df19ec3c31`), with `115 tests, 2 failures` in the current environment (`saveresume.1`, `saveresume.3` from save/resume prompt/session conditions). Treat it as a caveated oracle, not a zero-failure oracle. TerpVault cannot play native `advent` directly; the preferred future playable strategy is a Z-machine `.z8` port. No playable TerpVault artifact, package, or `_demo` content exists yet.

Generated placeholder art and curator-created helper notes should be described as TerpVault starter-package material, not official game documentation. Inclusion of supplemental material should not be described as licensed, public domain, official, endorsed, or copyright-free unless that status is separately documented.

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
- If `admin.enable_admin2_page: true` is tested, confirm Admin2 create/edit/export/import workflows are authenticated, non-overwriting, and do not add package delete or overwrite/replace behavior. Confirm draft package thumbnails use authenticated Admin/API image previews while public draft `/if/_asset/...` routes remain blocked.
- For future delete/remove work, confirm destructive actions are absent until a reviewed design exists with package title/slug confirmation, manifest-vs-physical-delete distinction, trash/quarantine or backup behavior, CSRF/token and permission guardrails, package containment checks, and audit/result feedback.
- For large-library work, confirm Admin2 search/filter/sort controls preserve state, show accurate result counts, keep expanded row state intact, and still handle small libraries normally. Pagination or virtual scrolling remains future work for very large libraries.
- For metadata-assistant work, confirm local iFiction status/upload/import-awareness/preview/apply remains preview-driven, upload writes only package-root `metadata.iFiction.xml`, import commit preserves XML without auto-applying it, `game.yaml` is backed up before selected-field writes, remote lookup requires explicit action, and metadata enrichment remains separate from story-file/package download or asset redistribution.
- For future player placement/boot or terminal theme work, confirm detail-page inline playback is optional, `/if/{slug}/play` still works, focused-page `boot: autoload` lands directly at the story prompt when safe, public controls can be hidden, contrast is acceptable, scanline/CRT effects can be disabled, reduced-motion preferences are respected, font fallbacks are readable, and Quark2/Typhoon light/dark modes do not break the player.
- For future Oracle work, confirm existing Markdown hints still render, `resources.hints: hints.md` packages remain valid, richer source adapters normalize into the same model, and Ink-guided hints remain future/complementary unless intentionally implemented.
- For future content transparency work, confirm ordinary tags, content notes, theme notes, and audience guidance are neutral, searchable/filterable where implemented, and do not hide or rank works by default.
- For a future Admin2 Guide/Help tab, confirm bundled local docs render read-only, screenshots are current or omitted, safety boundaries are stated, and contextual field help remains available separately.

## GPM/public-release checklist

- Exclude development-only real IF packages unless redistribution review is complete.
- Keep `sample-cave` if a structure demo is needed.
- Keep Mainframe Zork / Dungeon, Adventure / Colossal Cave, Grue, and You Are Standing out of any GPM-ready bundle unless each package has story-file provenance, license notes, package-local original material notes, supplemental material classification, Rights-Holder Removal Requests / DMCA language, and package-level audit notes. Zork II and Zork III now have that package-level audit for the development `_demo` tree and passed clean DDEV demo-seed route/checksum verification.
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

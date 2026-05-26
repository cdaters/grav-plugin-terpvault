# Zork I Asset Plan

## Status

- Zork I remains candidate-only.
- A DDEV-only package shell exists for local review.
- Core visual assets are now integrated in the DDEV-only package shell: `cover.jpg`, `small-cover.jpg`, `hero.jpg`, and `screenshots/01.png`.
- `screenshots/02.png` and optional feelies are not yet created.
- This is a planning document only. Do not create `_demo` contents, copy story files, add images, or add package assets from this plan until a later explicit packaging pass.

## Legal/art guardrails

- Use Craig-created/original art and supplemental materials.
- Do not copy Infocom box art, manuals, maps, ads, logos, trade dress, scans, Invisiclues, or other historical commercial assets unless separately licensed.
- Avoid visual imitation of specific Infocom packaging, logos, layout systems, color blocking, trade dress, or title treatments.
- Screenshots should be captured from the selected source-built playable artifact in the final DDEV package.
- Any AI-assisted art should be original and should not imitate protected commercial packaging or historical Infocom marketing materials.

## Required package assets

### `cover.jpg`

- Purpose: primary package cover image for detail pages, catalog views, and exports.
- Recommended aspect/usage: square or near-square; should crop cleanly in card and cover contexts.
- Visual direction: original title/cover art evoking classic parser interactive fiction, underground exploration, white house/forest/cave mystery, brass lantern/adventurer energy, and fantasy-adventure atmosphere.
- Filename/path: `cover.jpg`.
- Status: present in DDEV package; final review still pending.
- Notes for creation: no text is required unless Craig later chooses to create an original title treatment. Avoid Infocom package mimicry and historical trade dress.

### `small-cover.jpg`

- Purpose: thumbnail/card-friendly cover crop.
- Recommended aspect/usage: square thumbnail; should remain legible at small sizes.
- Visual direction: simple central subject, high contrast, clear silhouette, and minimal tiny detail.
- Filename/path: `small-cover.jpg`.
- Status: present in DDEV package; final review still pending.
- Notes for creation: derive from original cover art or create a separate thumbnail-focused crop after testing in Admin2 and public catalog cards.

### `hero.jpg`

- Purpose: wide banner/detail-page visual.
- Recommended aspect/usage: wide cinematic image that can work behind or near page text.
- Visual direction: forest edge, white house, dark cave mouth, brass lantern glow, underground passage, or mysterious fantasy-adventure atmosphere.
- Filename/path: `hero.jpg`.
- Status: present in DDEV package; final review still pending.
- Notes for creation: avoid clutter and leave visual breathing room for page layout. Do not include copied packaging, logos, or historical marketing imagery.

### `screenshots/01.png`

- Purpose: first gameplay screenshot for package detail and export review.
- Recommended aspect/usage: capture at the final package/player viewport size used for TerpVault screenshots.
- Visual direction: opening/banner or first room from the selected source-built playable artifact.
- Filename/path: `screenshots/01.png`.
- Status: present in DDEV package; final review still pending.
- Notes for capture: capture from the final DDEV package/play page, not from unrelated interpreters, prebuilt artifacts, or other story versions.

### `screenshots/02.png`

- Purpose: second gameplay screenshot showing interaction.
- Recommended aspect/usage: same capture dimensions/style as `screenshots/01.png`.
- Visual direction: gameplay after a basic command such as `look` or `inventory`.
- Filename/path: `screenshots/02.png`.
- Status: pending.
- Notes for capture: capture from the final DDEV package/play page after confirming the selected story route checksum still matches the chosen artifact.

## Cover image plan

- Create square or near-square original cover art.
- Evoke classic parser IF, underground exploration, white house/forest/cave mystery, brass lantern/adventurer energy, and a sense of discovery.
- Do not require text. If a title treatment is added later, it should be Craig-created and not modeled on Infocom packaging.
- Avoid Infocom package mimicry, logo use, trade dress, manual art, advertisements, scans, and historical map imagery.

## Small cover plan

- Create a thumbnail/card-friendly crop from original art or a simpler companion image.
- Keep the subject legible at small sizes.
- Prefer a simple central subject, high contrast, and no tiny details.
- Validate in Admin2 media preview cards and public package/card contexts before final packaging.

## Hero image plan

- Create a wide cinematic banner/detail-page visual.
- Suggested motifs: forest edge, white house, dark cave mouth, brass lantern glow, underground passage, or mysterious fantasy-adventure atmosphere.
- Keep the composition uncluttered so it works near page text.
- Avoid copied packaging, logos, trade dress, historical manual art, and advertising layouts.

## Screenshot plan

- Capture screenshots from the final DDEV package/play page.
- Use only the selected source-built playable artifact.
- `screenshots/01.png`: opening/banner or first room.
- `screenshots/02.png`: gameplay after a basic command such as `look` or `inventory`.
- Do not use screenshots from unrelated interpreters, prebuilt upstream artifacts, or different story versions.

## Feelies plan

### `feelies/map.jpg` or `feelies/map.pdf`

- Purpose: optional original navigation aid.
- Expected contents: Craig-created map or simplified exploration aid aligned with the selected playable artifact.
- Legal notes: do not copy historical maps, scans, packaging inserts, or online map artwork unless separately licensed.
- Status: optional/pending.

### `feelies/adventurer-notes.pdf`

- Purpose: optional atmospheric helper document.
- Expected contents: original notes, reminders, or in-world-flavored package supplement written for TerpVault.
- Legal notes: do not copy manual prose, Invisiclues, commercial feelies, or historical package text.
- Status: optional/pending.

### `feelies/command-cheat-sheet.pdf`

- Purpose: optional quick parser reference for new players.
- Expected contents: original command examples, movement reminders, inventory/object verbs, and save/restore notes.
- Legal notes: do not copy manual command lists or historical reference cards unless separately licensed.
- Status: optional/pending.

## Asset creation workflow

1. Create art and supplemental files outside the TerpVault plugin repo first.
2. Add assets to the DDEV package first. Done for `cover.jpg`, `small-cover.jpg`, `hero.jpg`, and `screenshots/01.png`.
3. Update `game.yaml` resource references only after the files exist. Done for the four current DDEV visual assets.
4. Test Admin2 media preview cards.
5. Test the public detail page. Route/render checks passed for the DDEV package.
6. Confirm screenshots render and match the selected playable artifact. Done for `screenshots/01.png`; `screenshots/02.png` remains pending.
7. Test any feelies links.
8. Export the package and confirm the zip contains expected files and no `.DS_Store`, `__MACOSX`, AppleDouble, or other cruft. Current DDEV retest has no cruft and includes visual assets plus root `provenance.md` and `LICENSE-upstream.txt`.
9. Keep package-root provenance/license files separate from feelies.
10. Run import inspect/commit smoke testing in DDEV.
11. Only after review, consider copying a finished package into `_demo`.

## Acceptance checklist

- `cover.jpg` displays. DDEV `_asset` route passed.
- `small-cover.jpg` displays in card/thumbnail contexts. DDEV `_asset` route passed.
- `hero.jpg` displays in the detail-page context. DDEV detail/play HTML and `_asset` route passed.
- `screenshots/01.png` displays. DDEV detail HTML and `_asset` route passed.
- `screenshots/02.png` displays. Pending.
- Feelies links work if feelies are included.
- No broken resource references exist in `game.yaml`.
- Export/import smoke test passes, including package-local provenance and upstream license files.
- Package remains legally/provenance clean.
- Candidate docs are updated with final asset verification results.

## Open questions

- Exact art style.
- Whether cover should include text or be text-free.
- Whether map should be image or PDF.
- Whether a command cheat sheet is useful.
- Whether feelies should be included in the first demo package or added later.

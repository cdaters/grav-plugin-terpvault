# TerpVault Package Conventions

TerpVault packages are plain folders under Grav's `user/data` tree. The format is intentionally simple so a curator can copy, review, edit, back up, and eventually zip a package without a database migration or a custom build step.

## Canonical directory structure

Each playable work lives in one directory named for its package slug:

```text
user/data/terpvault/games/
  adventure/
    game.yaml
    advent.z5
    cover.jpg
    small-cover.jpg
    metadata.iFiction.xml
    provenance.md
    LICENSE-upstream.txt
    screenshots/
      01.png
      02.png
    how-to-play.md
    hints.md
    walkthrough.md
```

The folder name should be stable, URL-safe, and lowercase where practical. TerpVault uses this folder as the fallback slug when `game.yaml` does not provide one.

## Required files

A package needs these files to be useful:

- `game.yaml`: the TerpVault package manifest.
- One playable story file, referenced by `resources.story_file`.

Common playable extensions include `.z3`, `.z5`, `.z8`, `.zblorb`, `.ulx`, `.gblorb`, `.glb`, `.blorb`, `.t3`, `.gam`, `.hex`, and `.taf`. The list is not meant to be a rights statement or a promise that every interpreter feature is supported; it documents the package-side convention for story files TerpVault can catalog and hand to a web interpreter.

Minimum manifest:

```yaml
slug: adventure
identification:
  format: zcode
bibliographic:
  title: Adventure
resources:
  story_file: advent.z5
terpvault:
  status: published
```

Missing or unreadable story files are the only error-level package condition because they prevent reliable play. Other metadata gaps are advisory completeness notes.

## Recommended files

These files make a package easier to browse, verify, and play:

- `cover.jpg` or `cover.png`: display/title/box art for the detail page.
- `small-cover.jpg` or `small-cover.png`: compact art for library cards.
- `hero.jpg` or `hero.png`: optional wide presentation art for public detail/play page backgrounds.
- `metadata.iFiction.xml`: original or exported iFiction metadata.
- `provenance.md`: package-local source/build/asset provenance notes for curator review.
- `LICENSE-upstream.txt`: package-local copy of upstream license text when redistribution terms require or benefit from preserving it.
- `screenshots/`: screenshots such as `screenshots/01.png`.
- `how-to-play.md`: basic commands, parser conventions, or accessibility notes.
- `hints.md`: spoiler-safe hint sections, ideally using Markdown headings or `<details>` blocks.
- `walkthrough.md`: a solution or route through the work.
- `feelies/`: optional package-local supplemental files such as manuals, maps, clue sheets, newsletters, audio, and other extras.

## Preferred manifest shape

New packages should use the structured manifest fields. Older flat fields still work as compatibility aliases.

```yaml
slug: adventure

identification:
  format: zcode
  ifids: []
  bafn: ''

bibliographic:
  title: Adventure
  author: Will Crowther and Don Woods
  headline: Before Zork, there was a road, a grate, a lamp, and a cave.
  first_published: '1977'
  genre: Adventure
  language: en
  description: |
    Markdown-friendly description shown on the public detail page.

resources:
  story_file: advent.z5
  cover: cover.jpg
  small_cover: small-cover.jpg
  hero:
    path: hero.jpg
    focal_position: center center
    overlay_tone: dark
    gradient_direction: to bottom
    overlay_color: '#000000'
  screenshots:
    - screenshots/01.png
  how_to_play: how-to-play.md
  hints: hints.md
  walkthrough: walkthrough.md
  feelies:
    - path: feelies/manual.pdf
      title: Original Manual
      type: manual
      description: Player manual for package review.
    - path: feelies/map.png
      title: Map
      type: map

catalog:
  ifdb:
    tuid: ''
    url: ''
  ifwiki:
    url: ''
  ifarchive:
    path: ''
    url: ''

release:
  license:
    name: Verify before redistribution
    url: ''
    notes: Confirm rights and provenance before publishing broadly.
  source:
    url: ''
    retrieved: ''
    notes: Source/provenance notes for this package.

terpvault:
  status: published
  featured: false
  tags: []

player:
  engine: parchment
  theme: retro-terminal
  launch_mode: button
```

## Presentation resources

The fields in this section are optional. Existing packages without hero art or feelies continue to work.

### Cover, small-cover, and hero responsibilities

- `resources.cover`: package/display/title/box art. This remains the main artwork for the public detail page and package identity.
- `resources.small_cover`: compact catalog art for library cards and dense package lists.
- `resources.hero`: optional wide atmospheric image for public detail/play backgrounds or large headers. It should not replace cover art or be required for package validity.

Preferred `resources.hero` shape:

```yaml
resources:
  hero:
    path: hero.jpg
    focal_position: center center
    overlay_tone: dark
    gradient_direction: to bottom
    overlay_color: '#000000'
```

`resources.hero` may also be a simple string path:

```yaml
resources:
  hero: hero.jpg
```

Hero options:

- `path`: package-local image path.
- `focal_position`: CSS-like image focal point, such as `center center`, `top center`, or `35% 45%`.
- `overlay_tone`: preset readability treatment, such as `light`, `dark`, `warm`, `cool`, or `none`.
- `gradient_direction`: overlay direction, such as `to bottom`, `to top`, `to right`, `to left`, or `radial`.
- `overlay_color`: optional color value for site-specific overlay tone.

Hero image extensions: `jpg`, `jpeg`, `png`, `webp`, and `gif`. SVG is not accepted for hero images.

### Feelies and extras

`resources.feelies` is for package-local supplemental files. The intent is to represent curated extras, not to expose a general file browser.

Preferred shape:

```yaml
resources:
  feelies:
    - path: feelies/manual.pdf
      title: Original Manual
      type: manual
      description: Player manual.
    - path: feelies/clue-sheet.pdf
      title: Clue Sheet
      type: clues
    - path: feelies/map.png
      title: Map
      type: map
    - path: feelies/theme.mp3
      title: Theme Audio
      type: audio
```

Item fields:

- `path`: required package-local file path.
- `title`: curator-facing/public label.
- `type`: optional grouping hint, such as `manual`, `map`, `clues`, `newsletter`, `image`, `audio`, or `other`.
- `description`: optional short note.

Allowed extensions:

- Documents: `pdf`, `txt`, `md`
- Images/maps: `jpg`, `jpeg`, `png`, `webp`, `gif`
- Audio: `mp3`, `ogg`, `wav`, `m4a`

Archives and executable-like files are not accepted for feelies. Import/export continues to reject traversal, absolute paths, URI-like paths, unsafe cruft-looking paths, and unrelated files.

Admin2 feelies/extras management edits only curated `resources.feelies` entries and controlled uploads under the package. Removing an entry from the manifest does not delete the physical file. Uploads and edited paths must remain package-local and use the allowlisted document, image, or audio extensions above; SVG remains excluded.

## Inform release mapping

TerpVault borrows useful naming ideas from Inform release folders:

- Inform cover art maps to `resources.cover`, usually `cover.jpg` or `cover.png`.
- Compact browsing art maps to `resources.small_cover`, usually `small-cover.jpg` or `small-cover.png`.
- iFiction metadata maps to `metadata.iFiction.xml` plus the structured `identification`, `bibliographic`, `catalog`, and `release` fields in `game.yaml`.
- Released solutions and player notes map to `walkthrough.md`, `hints.md`, and `how-to-play.md`.

TerpVault also auto-detects common Inform-style filenames such as `Cover.jpg`, `Cover.png`, `Small Cover.jpg`, and `Small Cover.png` when manifest artwork fields are missing.

## Treaty, iFiction, and catalog mapping

TerpVault keeps metadata in YAML today, but the fields are aligned with common IF ecosystem concepts:

- `identification.ifids`: one or more IFIDs for the work or package variant.
- `identification.format`: broad story-file family such as `zcode`, `glulx`, `tads3`, `hugo`, or `adrift`.
- `bibliographic.*`: title, author, headline, publication date, genre, language, and description.
- `catalog.ifdb.tuid` and `catalog.ifdb.url`: IFDB identity and page link.
- `catalog.ifwiki.url`: IFWiki reference link.
- `catalog.ifarchive.path` and `catalog.ifarchive.url`: IF Archive provenance or download reference.
- `release.source.*`: where the package files came from and when they were retrieved.
- `release.license.*`: license, rights, and redistribution notes.

`metadata.iFiction.xml` is included in package zip export/import payloads when present. Admin2 can preview a conservative subset of local iFiction XML fields and apply explicitly selected supported fields into `game.yaml`. TerpVault does not edit the XML file.

Current metadata workflow limits:

- Admin2 does not upload, replace, or edit `metadata.iFiction.xml`.
- Package creation creates `game.yaml`, starter helper Markdown, and the initial story file; it does not ingest iFiction XML.
- Import preserves accepted `metadata.iFiction.xml` files, but import commit does not currently use the XML to prefill or merge `game.yaml`.
- Remote IFDB, IFWiki, IF Archive, or catalog metadata lookup is not implemented.

Future Metadata Assistant work should stay explicit and preview-driven. It may compare current `game.yaml` values with package-local or manually uploaded iFiction XML and, later, explicit IFDB/IFWiki/IF Archive lookup candidates. Curators should see side-by-side current/candidate values, select fields one by one, and receive a `game.yaml` backup before changes are applied. Metadata import should remain separate from story-file/package download, and provenance/license review should remain visible.

Future large-library cleanup filters should include metadata completeness checks such as missing IFID, missing cover, missing screenshots, missing helper docs, missing catalog URLs, provenance needs review, license needs review, and `metadata.iFiction.xml` present/missing.

## Future Ink package shape

Ink is a choice-based interactive narrative scripting language from inkle. It is not parser IF like Z-machine, Glulx, TADS, or Inform parser works, but it belongs in TerpVault's roadmap as a complementary web-playable IF format.

Future Ink packages should prefer compiled Ink JSON as the playable artifact and may include source `.ink` files for preservation/transparency:

```text
user/data/terpvault/games/example-ink/
  game.yaml
  story/
    game.ink
    game.json
  images/
    cover.jpg
  docs/
    how-to-play.md
  resources/
    feelies/
```

Possible future manifest concepts:

```yaml
identification:
  engine_family: choice-based
  format: ink
resources:
  source_file: story/game.ink
  compiled_file: story/game.json
player:
  runtime: inkjs
  play_mode: embedded_web
```

These fields are roadmap concepts only. Current TerpVault playback remains centered on parser IF packages served through bundled Parchment, and Ink package support should not disturb existing Z-code/Parchment behavior.

## Manual import workflow

Manual folder installation remains available:

1. Copy the package folder into `user/data/terpvault/games/{slug}`.
2. Confirm `game.yaml` points `resources.story_file` at the playable story file in that same package.
3. Clear Grav's cache.
4. Visit the public library route, usually `/if`.

Admin2 can also inspect a `.terpvault.zip` package and import it as a draft-only, non-featured package. Admin2 import does not overwrite existing package folders.

Example:

```bash
mkdir -p user/data/terpvault/games
cp -R /path/to/adventure user/data/terpvault/games/adventure
bin/grav clearcache
```

## Package creation checklist

- Choose a stable lowercase slug and directory name.
- Add `game.yaml`.
- Add one playable story file and reference it with `resources.story_file`.
- Set `identification.format` or use a recognizable story-file extension.
- Add title, author, year/date, language, and description.
- Add IFIDs when known.
- Add cover and small-cover artwork when redistribution rights allow it.
- Add hero artwork when a wide page background improves presentation.
- Use clearly labeled generated placeholder art when original cover rights are unclear.
- Add source, license, and redistribution notes before publishing broadly.
- Add IFDB, IFWiki, and IF Archive links when known.
- Add feelies/extras such as manuals, maps, clue sheets, and audio when rights allow it.
- Add how-to-play, hints, and walkthrough Markdown when useful.
- Clear Grav cache and check `/if`, `/if/{slug}`, and `/if/{slug}/play`.

## `.terpvault.zip` packages

Admin2 export creates a `.terpvault.zip` archive containing exactly one top-level folder named after the package slug.

```text
adventure/
  game.yaml
  advent.z5
  cover.jpg
  small-cover.jpg
  hero.jpg
  metadata.iFiction.xml
  provenance.md
  LICENSE-upstream.txt
  screenshots/01.png
  feelies/manual.pdf
  how-to-play.md
  hints.md
  walkthrough.md
```

Export includes:

- `game.yaml`.
- One playable story file referenced by `resources.story_file`.
- Referenced cover, small-cover, hero, screenshot, feelies, how-to-play, hints, and walkthrough files.
- `metadata.iFiction.xml` when present.
- Exact package-root support files `provenance.md` and `LICENSE-upstream.txt` when present.
- Safe conventional cover, small-cover, hero, screenshot, feelies, and helper Markdown filenames when present.

Export excludes backups, lock files, temp files, hidden files/directories, macOS cruft such as `__MACOSX/` and `.DS_Store`, Windows cruft such as `Thumbs.db` and `desktop.ini`, and unrelated/unreferenced files.

Admin2 import requires relative package paths only, rejects traversal and unsafe absolute/URI paths, ignores safe platform cruft, rejects unsupported package entries, and shows a validation report before commit. Import commit always installs as a draft, not-featured package, rewrites `id`, `slug`, `terpvault.status`, and `terpvault.featured`, and refuses to overwrite an existing package folder.

## Future package deletion/removal

Full package delete is not implemented. Existing Admin2 remove controls are manifest-only for curated lists such as screenshots and feelies/extras; they do not delete package-local files.

Before any future delete workflow ships, the behavior must distinguish:

- Removing a package from a list or manifest, if that concept is added.
- Deleting or moving the physical package folder and its files.

Physical deletion should require title/slug confirmation, preferably a two-step confirmation, and should prefer moving to trash/quarantine before permanent removal. The result should report what happened to story files, images, screenshots, feelies/extras, helper docs, provenance files, `metadata.iFiction.xml`, `game.yaml`, backups, and other package-local support files. Delete routes must remain authenticated Admin2/API actions with conservative permission and CSRF/token guardrails, package containment validation, and tests for traversal, symlink, missing-file, partial-failure, and audit-output behavior.

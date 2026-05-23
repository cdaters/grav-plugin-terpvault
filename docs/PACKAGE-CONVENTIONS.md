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
- `metadata.iFiction.xml`: original or exported iFiction metadata.
- `screenshots/`: screenshots such as `screenshots/01.png`.
- `how-to-play.md`: basic commands, parser conventions, or accessibility notes.
- `hints.md`: spoiler-safe hint sections, ideally using Markdown headings or `<details>` blocks.
- `walkthrough.md`: a solution or route through the work.

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
  screenshots:
    - screenshots/01.png
  how_to_play: how-to-play.md
  hints: hints.md
  walkthrough: walkthrough.md

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

`metadata.iFiction.xml` is reserved for future import/export support. TerpVault does not parse or write that XML file yet.

## Manual import workflow

Until Admin2 import tools exist, packages are installed manually:

1. Copy the package folder into `user/data/terpvault/games/{slug}`.
2. Confirm `game.yaml` points `resources.story_file` at the playable story file in that same package.
3. Clear Grav's cache.
4. Visit the public library route, usually `/if`.

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
- Use clearly labeled generated placeholder art when original cover rights are unclear.
- Add source, license, and redistribution notes before publishing broadly.
- Add IFDB, IFWiki, and IF Archive links when known.
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
  metadata.iFiction.xml
  screenshots/01.png
  how-to-play.md
  hints.md
  walkthrough.md
```

Export includes:

- `game.yaml`.
- One playable story file referenced by `resources.story_file`.
- Referenced cover, small-cover, screenshot, how-to-play, hints, and walkthrough files.
- `metadata.iFiction.xml` when present.
- Safe conventional cover, small-cover, screenshot, and helper Markdown filenames when present.

Export excludes backups, lock files, temp files, hidden files/directories, macOS cruft such as `__MACOSX/` and `.DS_Store`, Windows cruft such as `Thumbs.db` and `desktop.ini`, and unrelated/unreferenced files.

Admin2 import requires relative package paths only, rejects traversal and unsafe absolute/URI paths, ignores safe platform cruft, and shows a validation report before commit. Import commit always installs as a draft package, rewrites `id`, `slug`, and `terpvault.status`, and refuses to overwrite an existing package folder.

# TerpVault Metadata and the IF Ecosystem

TerpVault uses a friendly `game.yaml` manifest because Grav site owners should be able to read and edit game packages without specialized tools. The manifest is intentionally aligned with the broader interactive fiction ecosystem so packages can later exchange metadata with other IF cataloging tools.

See `docs/PACKAGE-CONVENTIONS.md` for the canonical TerpVault package folder structure, required files, manual import workflow, and current `.terpvault.zip` convention.

## Standards and reference systems

- **Treaty of Babel / iFiction**: metadata vocabulary for identifying and describing interactive fiction works.
- **IFID**: the durable identifier used to connect a story file/work across catalogs and tools. TerpVault stores IFIDs as a list because older works and variants may have more than one.
- **IFDB**: public catalog/database. TerpVault stores the IFDB TUID and URL when known.
- **IFWiki**: encyclopedia/history/reference layer. TerpVault stores a URL for context.
- **IF Archive**: archive/source/provenance reference. TerpVault stores both path and URL when known.

## Preferred package structure

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
    Markdown-friendly description.

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
    notes: ''
  source:
    url: ''
    retrieved: ''
    notes: ''

terpvault:
  status: published
  featured: false
  tags: []
```

## iFiction XML

A package may include:

```text
metadata.iFiction.xml
```

TerpVault includes this file in `.terpvault.zip` export/import payloads when present. Admin2 can preview a conservative subset of local iFiction XML fields, including title, author, description/headline, publication date, genre, language, IFIDs, and format/system where available. Preview is local-only and does not write `game.yaml`.

Curator-controlled import/apply from the preview remains future work.

## Compatibility aliases

The earlier flat TerpVault fields still work:

```yaml
title: Adventure
format: zcode
story_file: advent.z5
cover: cover.jpg
small_cover: small-cover.jpg
```

New packages should use the structured form above.

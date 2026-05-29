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

TerpVault includes this file in `.terpvault.zip` export/import payloads when present. Admin2 shows whether each package has local iFiction XML, import inspection reports whether an incoming package contains package-root `metadata.iFiction.xml`, and draft-only import preserves that XML for later preview/apply from the package editor. Admin2 can upload or replace package-root `metadata.iFiction.xml`, and can preview a conservative subset of local iFiction XML fields, including title, author, description/headline, publication date, genre, language, IFIDs, and format/system where available. Preview is local-only, and curators can explicitly apply selected supported fields into `game.yaml`.

The upload workflow validates XML and writes only `metadata.iFiction.xml` in the package root. It does not apply metadata automatically. The apply workflow re-parses package-local XML on the server, does not perform remote lookup, backs up `game.yaml`, and only overwrites existing non-empty `game.yaml` values when the curator selects that field.

Current limits:

- Admin2 can upload or replace `metadata.iFiction.xml`, but it does not edit XML contents in place.
- Package creation does not accept `metadata.iFiction.xml` as an input.
- Import inspection reports whether accepted `.terpvault.zip` packages include package-root `metadata.iFiction.xml`; import commit preserves the file but does not use it to merge or prefill `game.yaml`.
- Remote IFDB, IFWiki, IF Archive, or catalog lookup is not implemented.
- Metadata workflows do not download story files, packages, cover art, screenshots, or other remote assets.

## Metadata Assistant roadmap

A future Metadata Assistant should reduce manual metadata entry while staying explicit and preview-driven.

Candidate sources:

- Current local `game.yaml`.
- Package-local `metadata.iFiction.xml`.
- Manually uploaded or replaced `metadata.iFiction.xml`.
- Future IFDB lookup by IFID, title, or pasted URL.
- Future IFWiki lookup by title or pasted URL.
- Future IF Archive path/URL helper.

Required behavior:

- Show candidate matches with confidence and notes.
- Preview current package metadata beside candidate metadata.
- Apply only fields selected by the curator.
- Never silently overwrite existing metadata.
- Back up `game.yaml` before applying changes.
- Perform no remote fetch without explicit user action.
- Keep provenance and license review explicit.
- Clearly distinguish metadata import from story-file, package, cover, screenshot, or asset download.

Future provider/source definitions should be back-end configurable before remote lookup is added. Known or preconfigured providers may include local iFiction XML, IFDB, IFWiki, and IF Archive. A provider definition should record:

- Provider id.
- Display label.
- Enabled/disabled state.
- Lookup method or source type.
- Base URL or API endpoint when applicable.
- Rate-limit and caching notes.
- Attribution and license notes.
- Field mapping rules.
- Confidence or scoring notes.

Remote providers must run only after an explicit admin action. No provider should silently fetch, merge, overwrite, download story files, or download assets. Candidate metadata from any provider should appear in the same side-by-side review model, with field-level checkboxes and a `game.yaml` backup before writes.

Phased plan:

- Phase 1 baseline: local iFiction XML presence/status, package-root upload/replace, import inspection awareness, preview/apply polish, and metadata-completeness filters for XML present/missing. Future Phase 1 polish may integrate local preview/apply into package creation/import when XML is present.
- Phase 2: assist catalog and provenance fields such as IFDB TUID, IFDB URL, IFWiki URL, IF Archive path, IF Archive URL, source URL, retrieved date, and license notes.
- Phase 3: add explicit remote metadata lookup by title/author, IFID where possible, and pasted IFDB/IFWiki/IF Archive URL. Preview candidates, apply selected fields only, and document the source/retrieval date.

Large-library cleanup should eventually connect to the assistant. Admins should be able to filter for missing IFID, missing cover, missing screenshots, missing helper docs, missing catalog URLs, provenance needing review, license needing review, and `metadata.iFiction.xml` present/missing, then use the assistant to work through those problem groups.

## Future package-builder lookup

A later package-builder workflow may accept pasted IFDB, IFWiki, or IF Archive URLs and resolve metadata where allowed. It should create draft packages only, keep provenance/license review explicit, and avoid silently downloading or redistributing questionable story files or assets. If a story file is legally and directly available, staging it should be an explicit curator action. Cover, screenshot, and art import should stay conservative and license-aware.

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

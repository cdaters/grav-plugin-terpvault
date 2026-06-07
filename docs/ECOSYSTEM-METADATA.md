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
    upstream:
      url: ''
    port_repository:
      url: ''

references:
  - role: map
    label: Map reference
    url: https://example.com/map
    notes: Reference only; confirm rights before packaging derived material.

terpvault:
  status: published
  featured: false
  tags: []
```

New package metadata should prefer top-level discovery and transparency fields:

```yaml
tags:
  - parser
  - fantasy
  - puzzle-focused
content_notes:
  - mild violence
theme_notes:
  - exploration
audience:
  rating: teen
  note: "Contains fantasy peril and old-school parser death."
```

`terpvault.tags` remains a compatibility location for older packages. Future search/filter work should map appropriate package metadata into Grav-compatible taxonomy/search structures where practical, while preserving richer package-local fields such as `content_notes`, `theme_notes`, and `audience`. These fields are descriptive; they should not hide, block, endorse, or morally rank works by default.

## iFiction XML

A package may include:

```text
metadata.iFiction.xml
```

TerpVault includes this file in `.terpvault.zip` export/import payloads when present. Admin2 shows whether each package has local iFiction XML, import inspection reports whether an incoming package contains package-root `metadata.iFiction.xml`, and draft-only import preserves that XML for later preview/apply from the package editor. Admin2 can upload or replace package-root `metadata.iFiction.xml`, and can preview a conservative subset of local iFiction XML fields, including title, author, description/headline, publication date, genre, language, IFIDs, and format/system where available. Preview is local-only, and curators can explicitly apply selected supported fields into `game.yaml`.

The upload workflow validates XML and writes only `metadata.iFiction.xml` in the package root. It does not apply metadata automatically. The apply workflow re-parses package-local XML on the server, does not perform remote lookup, backs up `game.yaml`, and only overwrites existing non-empty `game.yaml` values when the curator selects that field.

Current behavior:

- Admin2 can upload or replace `metadata.iFiction.xml`, but it does not edit XML contents in place.
- Package creation can accept local `metadata.iFiction.xml` as a package-root file, but it does not apply XML fields to `game.yaml` automatically.
- Import inspection reports whether accepted `.terpvault.zip` packages include package-root `metadata.iFiction.xml`; import commit preserves the file but does not use it to merge or prefill `game.yaml`.
- The Admin2 Ecosystem Metadata Preview can normalize curator-supplied IF Archive paths/URLs without downloading the referenced file.
- The Admin2 Ecosystem Metadata Preview can look up curator-supplied IFDB TUID/URL values through IFDB's official API and IFWiki URL/title values through IFWiki's MediaWiki API.
- IF Archive file download, broad catalog search, and arbitrary URL lookup are not implemented.
- Metadata workflows do not download story files, packages, cover art, screenshots, or other remote assets.

## Manual URL roles

Terpwright Phase 2 accepts pasted, curator-supplied URLs as reference metadata only. The workflow performs light syntax validation, stores the values in `game.yaml`, and displays them in Admin2 readback. Terpwright Phase 3c adds a narrow IFDB preview helper for pasted IFDB TUID/URL values, and Phase 3d adds IFWiki URL/title preview. Manual URL capture still does not scrape, search broadly, trust, or summarize arbitrary remote pages.

Use these roles consistently:

- `catalog.ifdb.tuid` and `catalog.ifdb.url`: IFDB context for the work or related catalog entry.
- `catalog.ifwiki.title` and `catalog.ifwiki.url`: IFWiki context or historical reference.
- `catalog.ifarchive.path` and `catalog.ifarchive.url`: IF Archive path/URL when known.
- `release.source.url`: primary package/story/source URL when there is one clear source.
- `release.source.upstream.url`: canonical upstream project, source release, or source distribution URL.
- `release.source.port_repository.url`: source repository or port repository used for this package variant.
- `release.license.url`: license text or license page URL.
- `references[]`: supporting reference-only links for art, screenshots, walkthroughs, hints, maps, and background/history sources.

URL presence does not prove redistribution rights. Curators should still record license names, license notes, source notes, retrieval/review context, item-level asset provenance, and any pending-review status before publishing.

## Ecosystem Metadata Preview

Terpwright Phase 3a/3b adds an authenticated preview-only Admin2 helper, Phase 3c extends it with IFDB lookup preview, and Phase 3d adds IFWiki lookup preview:

```text
POST /api/v1/terpvault/ecosystem/preview
```

The endpoint accepts named curator-supplied fields such as `ifarchive_path`, `ifarchive_url`, `ifdb_tuid`, `ifdb_url`, `ifwiki_title`, `ifwiki_url`, `source_url`, `upstream_source_url`, `port_repository_url`, and `license_url`. It does not write package files, download assets, download story files, or publish packages. Responses include stable review flags:

```json
{
  "reference_only": true,
  "curator_review_required": true,
  "rights_notice": "URL presence does not prove redistribution rights.",
  "writes": false,
  "remote_fetches": false
}
```

`remote_fetches` is `true` only when an IFDB or IFWiki API lookup was attempted. Source, repository, and license URLs are reported as `stored/reference only` with lookup not implemented.

Accepted IF Archive inputs normalize to both `catalog.ifarchive.path` and `catalog.ifarchive.url`:

| Input | Normalized path | Normalized URL |
| --- | --- | --- |
| `https://ifarchive.org/if-archive/games/zcode/Advent.z5` | `games/zcode/Advent.z5` | `https://ifarchive.org/if-archive/games/zcode/Advent.z5` |
| `if-archive/games/zcode/Advent.z5` | `games/zcode/Advent.z5` | `https://ifarchive.org/if-archive/games/zcode/Advent.z5` |
| `games/zcode/Advent.z5` | `games/zcode/Advent.z5` | `https://ifarchive.org/if-archive/games/zcode/Advent.z5` |

The helper rejects or warns about traversal segments, empty preview input, absolute filesystem paths, unsafe schemes, non-IF Archive hosts, malformed IF Archive URL paths, mismatched path/URL pairs, and ignored query strings or fragments. It does not assume the referenced file may be redistributed.

Accepted IFDB inputs normalize to both `catalog.ifdb.tuid` and `catalog.ifdb.url`:

| Input | Normalized TUID | Normalized URL |
| --- | --- | --- |
| `fft6pu91j85y4acv` | `fft6pu91j85y4acv` | `https://ifdb.org/viewgame?id=fft6pu91j85y4acv` |
| `https://ifdb.org/viewgame?id=fft6pu91j85y4acv` | `fft6pu91j85y4acv` | `https://ifdb.org/viewgame?id=fft6pu91j85y4acv` |

The IFDB helper rejects or warns about empty requested lookup input, unsafe schemes such as `javascript:`, malformed URLs, non-IFDB hosts, path traversal, IFDB URLs without an `id` parameter, implausible TUIDs, and mismatched TUID/URL pairs. It uses IFDB's official `viewgame` JSON API and does not scrape rendered HTML.

Supported IFDB preview candidates may include title, author, first published, genre, language, concise description text, IFIDs, format, IFDB tags, normalized IFDB TUID/URL, and source attribution. IFDB download links are displayed as reference-only when present; TerpVault does not download those files. Descriptions are converted from IFDB HTML to concise plain text for preview and should only be applied when the curator is comfortable using that text.

Accepted IFWiki inputs normalize to both `catalog.ifwiki.title` and `catalog.ifwiki.url`:

| Input | Normalized title | Normalized URL |
| --- | --- | --- |
| `Babel` | `Babel` | `https://www.ifwiki.org/Babel` |
| `https://www.ifwiki.org/Babel` | `Babel` | `https://www.ifwiki.org/Babel` |

The IFWiki helper rejects or warns about empty requested lookup input, unsafe schemes such as `javascript:`, malformed URLs, non-IFWiki hosts, path traversal, page paths with nested/traversal segments, unsupported title punctuation, ignored query strings or fragments, and mismatched title/URL pairs. It uses IFWiki's MediaWiki API and does not scrape rendered HTML.

Supported IFWiki preview candidates may include page title, canonical URL, a short extract if the API provides one, categories, safe external links, and source attribution. IFWiki external links are displayed as reference-only when present; TerpVault does not download those files. IFWiki metadata is encyclopedia/catalog context only and does not prove redistribution rights.

If IFDB or IFWiki lookup fails, the endpoint returns warnings and `writes: false`; it does not crash package editing or write package files. IFWiki's live API may not provide every requested property, such as short extracts, so missing optional fields should be treated as unavailable rather than fatal.

The Admin2 Create Package form and metadata editor both include an `Ecosystem Metadata Preview` section. A curator can preview references, review warnings, and apply selected normalized IF Archive, IFDB, or IFWiki fields into the visible form. Applying to the metadata editor only changes the editor state; the curator must still press `Save Metadata` before `game.yaml` is written.

## Metadata Assistant roadmap

A future Metadata Assistant should reduce manual metadata entry while staying explicit and preview-driven.

Candidate sources:

- Current local `game.yaml`.
- Package-local `metadata.iFiction.xml`.
- Manually uploaded or replaced `metadata.iFiction.xml`.
- Future IFDB lookup by IFID or title.
- Current IFDB lookup by TUID or pasted URL.
- Current IFWiki lookup by title or pasted URL.
- Current IF Archive path/URL helper output.

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

Remote providers must run only after an explicit admin action. No provider should silently fetch, merge, overwrite, download story files, download assets, publish packages, or treat catalog metadata as more authoritative than package-local story/iFiction metadata without curator confirmation. Candidate metadata from any provider should appear in the same side-by-side review model, with field-level checkboxes and a `game.yaml` backup before writes.

Phase 3 Terpwright treats remote/catalog support as ecosystem lookup helpers, not automated package creation. Phase 3a/3b is limited to preview shell behavior and IF Archive normalization. Future candidate lookup sources may include IFDB, IFWiki, upstream project/source repositories, package-local `metadata.iFiction.xml`, and Treaty of Babel / iFiction metadata where available. Candidate fields may include title, author, publication year, IFID, format, source URLs, IF Archive path, license hints, external catalog links, and cover/art references when appropriate.

Phase 3 helpers should not assume redistribution rights, scrape pages when a stable source/API/manual entry is appropriate, copy large web text into package docs, auto-download story files or artwork, or publish packages. Lookup failures should be handled as warnings or unavailable states so package-local editing still works offline. Any cached/stored data should be review-safe metadata, not whole remote pages or copied prose.

The intended curator workflow is:

1. Enter a URL, IFID, TUID, IF Archive path, or search term.
2. Preview lookup candidates beside current `game.yaml` and package-local iFiction XML.
3. Review field-level differences, source attribution, confidence, retrieval context, and warnings.
4. Apply only selected fields.
5. Review generated draft provenance notes as editable text.
6. Keep the package draft until the separate publish action is used.

Phased plan:

- Phase 1 baseline: local iFiction XML presence/status, package-root upload/replace, import inspection awareness, preview/apply polish, and metadata-completeness filters for XML present/missing. Future Phase 1 polish may integrate local preview/apply into package creation/import when XML is present.
- Phase 2: manual catalog and provenance URL capture in package creation, including IFDB TUID/URL, IFWiki URL, IF Archive path/URL, source URL, upstream URL, port/source repository URL, license URL/notes, and reference-only URL roles.
- Phase 3: add explicit ecosystem lookup helpers by title/author, IFID where possible, and pasted IFDB/IFWiki/IF Archive URL or path. Preview candidates, apply selected fields only, document source/retrieval date, and preserve the rule that URLs are curator-review references, not proof of rights.
- Phase 3a: URL validation and metadata preview shell. Implemented for curator-supplied references.
- Phase 3b: IF Archive path/URL helper. Implemented for normalization only.
- Phase 3c: IFDB lookup helper.
- Phase 3d: IFWiki helper. Implemented for URL/title normalization and MediaWiki API preview.
- Phase 3e: iFiction/Babel cross-check.
- Phase 3f: curator apply/diff workflow.
- Phase 3g: package validation integration.

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

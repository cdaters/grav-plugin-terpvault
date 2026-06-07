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
    known-differences.md
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

`terpvault.status` controls public visibility. `published` packages appear on normal public routes, while `draft` packages are hidden from `/if`, `/if/_manifest`, detail/play pages, story files, and assets unless the site explicitly enables `library.show_unpublished`. Admin2 Library Manager is draft-inclusive for authenticated curators and can publish or unpublish a package by updating only `terpvault.status`.

`terpvault.featured` is a curator-facing placement signal. Admin2 can toggle it without changing publication status; public themes/templates may use the flag where featured placement is supported.

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
- `known-differences.md`: package-specific notes on meaningful differences between this playable package and another source, release, reference implementation, native build, or historical edition.
- `feelies/`: optional package-local supplemental files such as manuals, maps, clue sheets, newsletters, audio, and other extras.

The simple `resources.hints: hints.md` convention is the backwards-compatible hint path and should remain valid even after richer Oracle/progressive hint support is added.

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
  known_differences: known-differences.md
  feelies:
    - path: feelies/manual.pdf
      title: Original Manual
      type: manual
      description: Player manual for package review.
    - path: feelies/map.png
      title: Map
      type: map

tags:
  - parser
  - fantasy
  - puzzle-focused
content_notes:
  - mild violence
theme_notes:
  - exploration
  - underground
audience:
  rating: teen
  note: "Contains fantasy peril and old-school parser death."

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

player:
  engine: parchment
  placement: focused
  boot: autoload
  theme: retro-terminal
  inline:
    height: 720
    allow_fullscreen: true
```

`terpvault.tags` remains a compatibility location for older packages, but new package metadata should prefer top-level `tags`, `content_notes`, `theme_notes`, and `audience` for discovery and transparency.

## Known differences

`resources.known_differences` is an optional package-local Markdown document for explaining meaningful package/version differences. Use it when a playable package is a port, reconstruction, source-built variant, browser-playable adaptation, patched artifact, or otherwise differs from an upstream/native/reference version in ways a player or curator should understand.

Preferred shape:

```yaml
resources:
  known_differences: known-differences.md
```

The file must be a safe package-local `.md` path. It renders as Markdown HTML in a collapsed `Known Differences` item in the public Help & Reference area when present. It is not required for package validity.

Use `known-differences.md` for player-facing or curator-facing behavioral/version notes such as changed scoring, parser behavior, missing native features, port caveats, supported browser-playable subset, patched bugs, or known parity gaps. Use `provenance.md` for source, build, license, checksum, retrieval, and rights/audit notes. Use `walkthrough.md` for solution commands and route spoilers.

Older packages may already list a known-differences document under `resources.feelies`. That remains valid for backward compatibility. New or updated packages should prefer `resources.known_differences`; if the same existing Markdown file is also listed as a feelie, TerpVault suppresses the duplicate feelie card where practical and renders the first-class Known Differences section instead. Package authors should avoid listing the same file twice in new manifests.

Current player fields are intentionally minimal. Future player presentation fields may expand to support focused and inline player placement, boot behavior, and terminal theme presets without changing the package's story/provenance contract:

```yaml
player:
  engine: parchment
  placement: focused
  boot: autoload
  theme: retro-terminal
  inline:
    height: 720
    allow_fullscreen: true
```

Candidate `player.placement` values are `focused`, `inline`, and `inline_autostart`. Candidate `player.boot` values are `autoload` and `manual`. Candidate `player.theme` values are `default`, `retro-terminal`, `cit101`, `green-screen`, `amber-crt`, `light-paper`, and `parchment-classic`.

These are roadmap concepts until implemented. The focused `/if/{slug}/play` page should remain supported even if a package later opts into inline detail-page playback. When the focused play route is opened from the detail page Play button, the ideal future behavior is for Parchment to be loaded and ready at the prompt without a redundant second Play click, unless a technical or accessibility reason requires manual boot. Public theme controls should be optional, and site/admin defaults should be able to hide controls for a locked presentation.

Player theme CSS should be scoped to the TerpVault/Parchment shell and designed for accessibility: sufficient contrast, readable font fallbacks, optional scanline/CRT effects, reduced-motion handling, and compatibility with parent Grav light/dark themes. If custom fonts are bundled later, verify license and notice requirements first.

Older roadmap examples used `player.launch_mode` and `player.autostart`. Treat those as migration/backwards-compatibility concepts only; new examples should use `placement` and `boot`.

## The Oracle hint roadmap

The Oracle is TerpVault's spoiler-safe hint experience. Oracle v1 renders the current Help & Reference hints area as a progressive panel without replacing the whole detail page structure.

Simple packages should continue to declare:

```yaml
resources:
  hints: hints.md
```

For current packages, `hints.md` may be plain Markdown, Markdown with `<details>/<summary>` spoiler blocks, or heading-based progressive hints using `##` groups and `###` steps such as `Gentle`, `Stronger`, and `Answer`. TerpVault renders these inside the collapsed Oracle panel and keeps individual hints collapsed by default. Put full command routes in `resources.walkthrough` instead of the first hint, and keep all hint sources package-local.

Future richer packages may add an `oracle` block:

```yaml
oracle:
  title: "The Oracle"
  subtitle: "Are you lost and need a hand?"
  mode: progressive
  sources:
    - path: hints.md
      format: markdown
    - path: hints.inv
      format: inv
    - path: hints.rot13.txt
      format: markdown
      encoding: rot13
    - path: hints.yaml
      format: yaml
    - path: hints.json
      format: json
    - path: hints.ink.json
      format: ink-guided
```

This block is roadmap-only. Static hint adapters should normalize package-local sources into `Section -> Question -> Hint steps`. `.inv` support should parse or import legacy/classic IF hint files into that normalized model without a runtime dependency on external converters. Ink-guided hints are future complementary guided-help flows and should not replace parser IF support or simple Markdown hints.

See `docs/ORACLE-HINTS.md`.

## Content transparency and discovery

TerpVault should separate catalog discovery tags from content notes, theme notes, and audience guidance. These fields describe works for discovery and patron choice; they do not hide, block, endorse, or morally rank packages by default.

Preferred shape:

```yaml
tags:
  - parser
  - fantasy
  - puzzle-focused
  - beginner-friendly
content_notes:
  - mild violence
  - death
theme_notes:
  - exploration
  - underground
  - treasure hunting
audience:
  rating: teen
  note: "Contains fantasy peril and old-school parser death."
```

Future Admin2 and frontend search/filter work should map appropriate fields into Grav-compatible taxonomy/search structures where practical, while preserving richer package-local YAML fields such as `content_notes`, `theme_notes`, and `audience`.

See `docs/CONTENT-TRANSPARENCY.md`.

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
- `release.source.upstream.url`: canonical upstream project, source release, or source distribution URL when distinct from the packaged artifact.
- `release.source.port_repository.url`: source repository or port repository used for the TerpVault package variant.
- `release.license.*`: license, rights, and redistribution notes.
- `references[]`: role-labeled reference-only links for supporting sources such as cover art, hero art, screenshots, walkthroughs, hints, maps, and history/background pages.

Reference links are evidence for curator review, not permission by themselves. Use `catalog.*` for IF ecosystem catalog context, `release.source.*` for package/story/source provenance, and `references[]` for supporting or reference-only material. Do not collapse canonical upstream, port repository, catalog context, and historical references into one undifferentiated URL.

For IFDB references, new create/edit workflows accept either a TUID such as `fft6pu91j85y4acv` or a URL such as `https://ifdb.org/viewgame?id=fft6pu91j85y4acv`. TerpVault stores the normalized pair:

```yaml
catalog:
  ifdb:
    tuid: fft6pu91j85y4acv
    url: https://ifdb.org/viewgame?id=fft6pu91j85y4acv
```

The IFDB preview helper can show catalog metadata candidates from IFDB's official `viewgame` JSON API, including bibliographic fields, IFIDs, format, and tags when available. These are review candidates only. IFDB metadata does not prove redistribution rights, and IFDB download links are not downloaded or treated as package sources unless the curator separately records and verifies a source/license basis.

For IF Archive references, new create/edit workflows normalize path and URL as a pair. A curator may enter a full URL such as `https://ifarchive.org/if-archive/games/zcode/Advent.z5`, a prefixed path such as `if-archive/games/zcode/Advent.z5`, or a bare archive path such as `games/zcode/Advent.z5`. TerpVault stores:

```yaml
catalog:
  ifarchive:
    path: games/zcode/Advent.z5
    url: https://ifarchive.org/if-archive/games/zcode/Advent.z5
```

IF Archive normalization is metadata-only. It rejects traversal, absolute filesystem paths, unsafe schemes, non-IF Archive URL hosts, malformed `/if-archive/` paths, and mismatched path/URL pairs. It does not download the referenced story file and does not prove redistribution rights.

`metadata.iFiction.xml` is included in package zip export/import payloads when present. Admin2 can show whether the XML is present, report XML presence during import inspection, upload or replace the package-root XML file, preview a conservative subset of local iFiction XML fields, and apply explicitly selected supported fields into `game.yaml`. TerpVault does not edit XML contents in place.

When `identification.format` is blank, TerpVault may infer a normalized package format from strong local evidence such as IFID prefixes, story-file extension, or declared player engine/runtime. Curator-supplied non-empty format values should be preserved rather than overwritten. Admin2 also uses defensive format inference for library search, sort, and filters so packages with blank format fields can still appear under the right format family.

Current metadata workflow limits:

- Admin2 can upload or replace `metadata.iFiction.xml`, but upload writes only the package-root XML file and does not apply fields automatically.
- Package creation creates `game.yaml`, optional local helper Markdown/resources, optional package-root `metadata.iFiction.xml`, and the initial story file. iFiction fields are still not applied to `game.yaml` automatically.
- Import preserves accepted `metadata.iFiction.xml` files and reports their presence during inspection, but import commit does not use the XML to prefill or merge `game.yaml`.
- Admin2 can preview curator-supplied ecosystem references and normalize IF Archive path/URL metadata without remote fetches or writes.
- Remote IFDB, IFWiki, IF Archive file download, or catalog metadata lookup is not implemented.

Future Metadata Assistant work should stay explicit and preview-driven. It may compare current `game.yaml` values with package-local or manually uploaded iFiction XML, current IF Archive normalized values, and later explicit IFDB/IFWiki lookup candidates. Curators should see side-by-side current/candidate values, select fields one by one, and receive a `game.yaml` backup before changes are applied. Metadata import should remain separate from story-file/package download, and provenance/license review should remain visible.

Future metadata source providers should be defined on the back end before remote lookup ships. Provider definitions should include a provider id, display label, enabled/disabled state, lookup method/type, base URL or API endpoint where applicable, rate-limit/caching notes, attribution/license notes, field mapping rules, and confidence/scoring notes. Remote provider lookup must be an explicit admin action and should never run automatically during import or package creation.

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
- Add known-differences Markdown when the playable package differs materially from a source, native build, reference release, or historical edition.
- Clear Grav cache and check `/if`, `/if/{slug}`, and `/if/{slug}/play`.

## Terpwright package-builder output

Terpwright is the Admin2 package-builder workflow. The current implementation produces ordinary draft TerpVault packages, not a separate package format.

Current Phase 1/2 builder output follows this document's conventions:

- Create draft packages only, with `terpvault.status: draft` and `terpvault.featured: false`.
- Use the structured `game.yaml` shape for new manifests.
- Keep story files, media, helper Markdown including `known-differences.md`, `metadata.iFiction.xml`, provenance notes, and feelies package-local.
- Reuse existing validation, import inspection, draft-only install, and `.terpvault.zip` export rules.
- Preserve source URLs, upstream/port repository URLs, IFDB/IFWiki/IF Archive references, retrieval dates, license notes, reference-only URLs, and package-local provenance.
- Treat uncertain rights as warnings or pending-review notes, not hidden assumptions.
- Do not imply Ink package/runtime support, structured Oracle support, remote lookup, or automated asset download until those features are intentionally implemented and documented.

Future Phase 3 ecosystem lookup helpers should only propose package-convention fields for curator review. They may compare current `game.yaml`, package-local `metadata.iFiction.xml`, IFDB/IFWiki/IF Archive candidates, and source/license/provenance hints, but they must not rewrite package metadata, package remote assets, download story files, or publish packages without explicit curator actions. Catalog URLs and lookup results remain references, not proof of redistribution rights.

See `docs/TERPWRIGHT.md`.

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
  known-differences.md
```

Export includes:

- `game.yaml`.
- One playable story file referenced by `resources.story_file`.
- Referenced cover, small-cover, hero, screenshot, feelies, how-to-play, hints, walkthrough, and known-differences files.
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

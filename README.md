# TerpVault Plugin

**TerpVault** is a Grav plugin for curating, presenting, and playing classic interactive fiction story files. Think of it as a standards-aware shelf of digital IF boxes: story file, metadata, Inform-style cover art, small-cover art, screenshots, hints, walkthroughs, and a bundled web player.

This is a **v0.2.x foundation build**. It is intentionally repo-ready and readable, not a finished public 1.0.

## What it does now

- Reads game package folders from `user/data/terpvault/games`.
- Uses a per-game `game.yaml` metadata file.
- Uses Inform-friendly naming ideas: `cover` for display/title/box art and `small_cover` for compact library card art.
- Supports screenshots, how-to-play notes, hints, and walkthrough files.
- Renders compact package cards, detail pages with help/provenance sections, and a focused play view.
- Provides virtual frontend routes under `/if` by default:
  - `/if` library page
  - `/if/{slug}` game detail page
  - `/if/{slug}/play` focused play page
  - `/if/_story/{slug}/{filename}` controlled story-file endpoint
  - `/if/_asset/{slug}/{path}` controlled package-asset endpoint
- Provides a native shortcode-style embed:
  - `[terpvault game="adventure"]`
- Bundles the Parchment 2025.1.14 single-file web build as the first engine adapter.
- Includes an optional Admin2 Library Manager with collapsible package rows, format support, package validation warnings, provenance summaries, runtime settings diagnostics, a limited package creation wizard, package export, draft-only package import, a metadata-only `game.yaml` editor, helper Markdown editing, limited package-local cover/screenshot image uploads, and limited story-file replacement. It is disabled by default.

## What it does not do yet

- It does not provide package delete, overwrite, or replace.
- It enables only the opt-in Admin2 package creation, export, draft-only import, and metadata/helper/media/story API for TerpVault packages; package delete and import overwrite/replace endpoints are not implemented.
- It does not yet provide named save slots or server-side save syncing.
- It does not yet import/export iFiction XML automatically, but the package metadata model now maps toward Treaty of Babel/iFiction concepts.
- It does not yet provide a full classic Grav Admin custom management page beyond the standard plugin settings screen.

## Known limitations

- The Admin2 Library Manager is experimental, disabled by default with `admin.enable_admin2_page: false`, and currently limited to package inventory, package export, draft-only import, whitelisted `game.yaml` metadata edits, allowlisted helper Markdown edits, limited cover/screenshot image uploads, and limited story-file replacement.
- Public virtual routes and Admin2 API routes are separate integration surfaces. Admin2 API routes are registered only when the Admin2 Library Manager is enabled.
- `.terpvault.zip` export and draft-only import are available through Admin2. Import overwrite/replace is not implemented.
- Parchment save/restore is interpreter-native. Players should use story commands such as `SAVE` and `RESTORE`.
- The `_demo` tree includes development starter packages for testing. Real IF packages need license/provenance review before broad redistribution.
- `sample-cave` is the public-safe original structure demo, but its placeholder `game.z5` is not a playable story file.

## Installation for local development

From your Grav install:

```bash
cd user/plugins
git clone git@github.com:cdaters/grav-plugin-terpvault.git terpvault
```

Or unzip this package as:

```text
user/plugins/terpvault
```

Then clear cache:

```bash
bin/grav clearcache
```

## Updating

From an existing install:

```bash
cd user/plugins/terpvault
git pull
bin/grav clearcache
```

If your shell is inside the Grav root instead of the plugin directory, run `bin/grav clearcache` from the Grav root after replacing or updating the plugin files.

## Configuration

Default config lives in:

```text
user/plugins/terpvault/terpvault.yaml
```

Override it in:

```text
user/config/plugins/terpvault.yaml
```

Useful settings:

```yaml
enabled: true
route: /if
auto_routes: true

admin:
  enable_admin2_page: false

player:
  engine: parchment
  parchment_url: ''
  theme: retro-terminal
  launch_mode: button
```

## Game package format

Each game lives in its own folder under `user/data/terpvault/games/{slug}`. The canonical package convention is documented in `docs/PACKAGE-CONVENTIONS.md`.

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
    how-to-play.md
    hints.md
    walkthrough.md
```

Minimum `game.yaml`:

```yaml
slug: adventure
identification:
  format: zcode
bibliographic:
  title: Adventure
resources:
  story_file: advent.z5
  cover: cover.jpg
  small_cover: small-cover.jpg
terpvault:
  status: published
```

Treaty/iFiction-aligned example:

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
    A Markdown-friendly description shown on the game detail page.

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
  autosave: true
```

Required files:

- `game.yaml`
- one playable story file such as `.z3`, `.z5`, `.z8`, `.ulx`, `.gblorb`, `.t3`, `.gam`, `.hex`, or `.taf`

Recommended files:

- `cover.jpg` or `cover.png`
- `small-cover.jpg` or `small-cover.png`
- `metadata.iFiction.xml`
- `screenshots/`
- `how-to-play.md`
- `hints.md`
- `walkthrough.md`

Older flat fields such as `title`, `format`, `story_file`, `cover`, `small_cover`, `description`, `license`, and `source` remain supported as compatibility aliases.

### Manual package import

Until Admin2 import tools exist, install a package by copying its folder into the site data directory, clearing cache, and visiting the library:

```bash
mkdir -p user/data/terpvault/games
cp -R /path/to/adventure user/data/terpvault/games/adventure
bin/grav clearcache
```

Then visit:

```text
/if
/if/adventure
```

Admin2 export creates a `.terpvault.zip` package with one top-level `{slug}/` folder containing `game.yaml`, the playable story file, referenced package resources, `metadata.iFiction.xml` when present, and safe conventional helper/media files. Admin2 can inspect and import an uploaded `.terpvault.zip`, but imported packages are always installed as draft, forced to not featured, and existing package folders are never overwritten.

### Package creation checklist

- Choose a stable URL-safe slug.
- Add `game.yaml` and one playable story file.
- Point `resources.story_file` at the playable file.
- Add title, author, format, language, and description.
- Add IFIDs, IFDB, IFWiki, and IF Archive references when known.
- Add source, license, and redistribution notes before publishing broadly.
- Add cover, small-cover, screenshots, how-to-play, hints, and walkthrough files when available.
- Clear Grav cache and check `/if`, `/if/{slug}`, and `/if/{slug}/play`.

### Inform-friendly artwork naming

TerpVault prefers:

- `cover: cover.jpg` or `cover: cover.png`
- `small_cover: small-cover.jpg` or `small_cover: small-cover.png`

For compatibility, TerpVault also auto-detects common Inform-style filenames when metadata is missing:

- `Cover.jpg`
- `Cover.png`
- `Small Cover.jpg`
- `Small Cover.png`

The older `thumbnail` field still works as an alias for `small_cover`, but new packages should use `small_cover`.

## Package validation

TerpVault package validation is curator-facing. Missing or unreadable story files are the only serious errors because they prevent reliable play. Other checks are advisory completeness notes:

- IFID not recorded
- cover or small-cover art not found
- source/provenance URL not recorded
- license name or redistribution notes not recorded
- how-to-play, hints, or walkthrough helper files not found

The public detail page may show these as calm package notes. They do not make missing catalog metadata look like a fatal public error. Validation results are exposed through `GamePackage::warnings()`, `advisoryWarnings()`, `warning_count`, and `error_count`.

## Treaty of Babel / iFiction alignment

TerpVault keeps a human-friendly `game.yaml` manifest, but its structure now maps toward the IF ecosystem vocabulary used by the Treaty of Babel and iFiction metadata:

- `identification.ifids` stores one or more IFIDs.
- `identification.format` stores the interpreter/story-file family.
- `bibliographic.*` stores title, author, headline, first publication date, genre, language, and description.
- `resources.*` stores the local story file, cover art, small-cover art, screenshots, and Markdown helper files.
- `catalog.ifdb`, `catalog.ifwiki`, and `catalog.ifarchive` store public catalog/reference links.
- `release.license` and `release.source` store rights, redistribution, and provenance notes.

A package may also include an optional `metadata.iFiction.xml` file. TerpVault includes that file in package exports when present, but it does not parse or edit the XML yet.

## Supported interpreter formats

The bundled Parchment adapter can be used for these broad story families:

| Family | Common extensions |
| --- | --- |
| Z-code | `.z1` through `.z8`, `.zblorb` |
| Glulx | `.ulx`, `.gblorb`, `.glb`, `.blorb` |
| Hugo | `.hex` |
| TADS 2 / TADS 3 | `.gam`, `.t3` |
| ADRIFT 4 | `.taf` |

Format labels are shown per package, based on package metadata and story-file extension where useful.

## Save and restore

With the bundled Parchment player, TerpVault expects players to use the story/interpreter's native save workflow. In many parser works, that means typing:

```text
SAVE
RESTORE
```

Parchment handles the save interaction inside the embedded player. TerpVault does not provide named save slots or server-side save syncing yet. See `docs/PARCHMENT-SAVES.md` for details.

## Public page theming

TerpVault's public CSS is scoped under `.terpvault` and exposes CSS variables for quick theme adjustments:

```css
.terpvault {
  --tv-link-color: var(--pico-primary, currentColor);
  --tv-button-bg: var(--pico-primary-background, var(--pico-primary, currentColor));
  --tv-radius: 8px;
  --tv-grid-min: 250px;
}
```

The library cards are intentionally compact so a shelf of packages scans quickly instead of behaving like oversized poster tiles.

## Installing starter packages

This development package includes starter packages under:

```text
user/plugins/terpvault/_demo/data/terpvault/games/
  sample-cave/
  adventure/
  you-are-standing/
  grue/
```

`sample-cave` is original placeholder/demo content intended for public-safe structure testing. It is not a playable game. `adventure`, `you-are-standing`, and `grue` are real IF development starter packages with source/license notes in their manifests. Review their provenance before broad redistribution or before including them in a public plugin release.

To install the real development starter packages into a local Grav site:

```bash
mkdir -p user/data/terpvault/games
cp -R user/plugins/terpvault/_demo/data/terpvault/games/adventure user/data/terpvault/games/
cp -R user/plugins/terpvault/_demo/data/terpvault/games/you-are-standing user/data/terpvault/games/
cp -R user/plugins/terpvault/_demo/data/terpvault/games/grue user/data/terpvault/games/
bin/grav clearcache
```

Then visit:

```text
/if
/if/adventure
/if/you-are-standing
/if/grue
```

## Public release checklist

- Run `git diff --check`.
- Run PHP lint where PHP is available.
- Install into a clean Grav 2 site and run `bin/grav clearcache`.
- Confirm `/if`, `/if/{slug}`, `/if/{slug}/play`, `/_story`, and `/_asset` routes work, including a subdirectory install.
- Confirm Admin2 loads with `admin.enable_admin2_page: false`.
- Confirm Admin2/API editing is described as opt-in metadata/helper/media-only work, not full package management.
- Confirm Parchment launches and save/restore guidance still points to interpreter-native `SAVE` / `RESTORE`.
- Confirm package manifests include source, license, and redistribution notes.
- Confirm no `.DS_Store`, `__MACOSX`, AppleDouble `._*`, or temporary generated image source files are included.

## Public GPM release contents

For a public GPM-ready package, ship the plugin, bundled Parchment notices, and the public-safe `sample-cave` structure demo only. Keep real IF starter packages such as `adventure`, `you-are-standing`, and `grue` development/demo-only unless redistribution review is completed for each story file, cover, helper document, and metadata source.

## Admin2 Library Manager

The Admin2 Library Manager is experimental and disabled by default. To test it, enable:

```yaml
admin:
  enable_admin2_page: true
```

When that setting is enabled and the current request is an Admin2/API request, TerpVault registers a sidebar item at:

```text
/plugin/terpvault
```

The current page provides package inventory plus metadata/helper/media/story editing:

- Library tab with collapsible game package rows and package health badges.
- Formats tab showing supported interpreter families.
- Settings tab showing route/storage/player diagnostics.
- Public Detail and Play links for each package.
- Advisory validation warnings and Catalog & Provenance summaries where package metadata provides them.
- Create Package wizard for a new folder, starter `game.yaml`, starter helper Markdown, and one initial story file.
- Edit Metadata action for whitelisted existing `game.yaml` fields such as bibliographic details, IFIDs, catalog links, license/source notes, status, featured, and tags.
- Helper Docs editor for package-local `how-to-play.md`, `hints.md`, and `walkthrough.md` content.
- Media Manager Lite controls for replacing cover/small-cover art, adding screenshots, replacing registered screenshots, and reordering/removing screenshot entries with package-local `jpg`, `jpeg`, `png`, or `webp` files.
- Story File Manager Lite controls for replacing the package-local playable story file with allowlisted IF story formats.
- Export action for downloading a single installed package as `{slug}.terpvault.zip`.
- Import panel for validating a `.terpvault.zip` package and committing it as a draft package after server-side revalidation.

Package delete, import overwrite/replace, arbitrary file browsing, `metadata.iFiction.xml` edits, and player settings edits are not implemented yet. Package creation uses `/api/v1/terpvault/packages`, package export uses `/api/v1/terpvault/packages/{slug}/export`, import inspection uses `/api/v1/terpvault/packages/import/inspect`, import commit uses `/api/v1/terpvault/packages/import`, metadata saves use `/api/v1/terpvault/packages/{slug}/metadata`, helper Markdown saves use `/api/v1/terpvault/packages/{slug}/markdown/{type}`, image uploads use `/api/v1/terpvault/packages/{slug}/media/{type}`, and story replacement uses `/api/v1/terpvault/packages/{slug}/story` when the Admin2 Library Manager is enabled.

Public virtual routes and Admin2 API routes are intentionally separate. Frontend routes such as `/if`, `/if/{slug}`, `/if/{slug}/play`, and `/if/_story/{slug}/{filename}` are registered as virtual Grav pages or controlled file endpoints only for frontend requests. Admin2 endpoints are controller-style API routes and are registered only when the experimental Admin2 Library Manager is enabled.

For subdirectory installs, TerpVault matches the browser URL after Grav's mount path is removed. For example, `/grav2-fullsite-skeleton/if/adventure` maps to the configured TerpVault route `/if/adventure`.

## Notes on game files and rights

TerpVault can play story files, but it does not make copyrighted game files free to redistribute. Keep license/provenance notes in each package's `game.yaml`, especially if you publish a starter library on a public site.

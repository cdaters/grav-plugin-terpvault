# TerpVault Plugin

**TerpVault** is a Grav plugin for curating, presenting, and playing classic interactive fiction story files. Think of it as a standards-aware shelf of digital IF boxes: story file, metadata, Inform-style cover art, small-cover art, screenshots, hints, walkthroughs, and a bundled web player.

This is a **v0.1.x foundation build**. It is intentionally repo-ready and readable, not a finished public 1.0.

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
- Includes an optional Admin2 library hub scaffold with collapsible package rows, format support, package validation warnings, and runtime settings diagnostics. It is disabled by default.

## What it does not do yet

- It does not yet provide full Admin2 create/edit/upload/import forms.
- It does not yet provide named save slots or server-side save syncing.
- It does not yet import/export iFiction XML automatically, but the package metadata model now maps toward Treaty of Babel/iFiction concepts.
- It does not yet provide a full classic Grav Admin custom management page beyond the standard plugin settings screen.

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
bin/grav clear-cache
```

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

Each game lives in its own folder:

```text
user/data/terpvault/games/
  adventure/
    game.yaml
    advent.z5
    cover.jpg
    small-cover.jpg
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

Older flat fields such as `title`, `format`, `story_file`, `cover`, `small_cover`, `description`, `license`, and `source` remain supported as compatibility aliases.

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

TerpVault v0.1.11 adds advisory package-health checks used by the Admin2 Library Hub and API responses. These checks do not block early package assembly, but they flag likely issues before a game is published broadly:

- missing or unreadable story file
- missing IFID list
- missing cover or small-cover art
- missing source/provenance links
- missing license or redistribution notes
- missing how-to-play, hints, or walkthrough helper files

Validation results are exposed through `GamePackage::warnings()` and the `/terpvault/games` API response as `warnings`, `warning_count`, and `error_count`.

## Treaty of Babel / iFiction alignment

TerpVault keeps a human-friendly `game.yaml` manifest, but its structure now maps toward the IF ecosystem vocabulary used by the Treaty of Babel and iFiction metadata:

- `identification.ifids` stores one or more IFIDs.
- `identification.format` stores the interpreter/story-file family.
- `bibliographic.*` stores title, author, headline, first publication date, genre, language, and description.
- `resources.*` stores the local story file, cover art, small-cover art, screenshots, and Markdown helper files.
- `catalog.ifdb`, `catalog.ifwiki`, and `catalog.ifarchive` store public catalog/reference links.
- `release.license` and `release.source` store rights, redistribution, and provenance notes.

A package may also include an optional `metadata.iFiction.xml` file. TerpVault does not parse or export it yet, but the package slot is reserved for future iFiction import/export support.

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

## Public page theming

TerpVault's public CSS is scoped under `.terpvault` and exposes CSS variables for quick theme adjustments:

```css
.terpvault {
  --tv-accent: #775f36;
  --tv-radius: 8px;
  --tv-grid-min: 250px;
}
```

The library cards are intentionally compact so a shelf of packages scans quickly instead of behaving like oversized poster tiles.

## Installing the Adventure starter package

This package includes a cleaned Adventure starter package under:

```text
user/plugins/terpvault/_demo/data/terpvault/games/adventure
```

To install it into a Grav site:

```bash
mkdir -p user/data/terpvault/games
cp -R user/plugins/terpvault/_demo/data/terpvault/games/adventure user/data/terpvault/games/
php bin/grav cache
```

Then visit:

```text
/if/adventure
/if/adventure/play
```

## Admin2 Library Hub

The Admin2 Library Hub is an experimental read-only scaffold and is disabled by default. To test it, enable:

```yaml
admin:
  enable_admin2_page: true
```

When that setting is enabled and the current request is an Admin2/API request, TerpVault registers a sidebar item at:

```text
/plugin/terpvault
```

The current page is intentionally a scaffold:

- Library tab with collapsible game package rows.
- Formats tab showing supported interpreter families.
- Settings tab showing route/storage/player diagnostics.

The next implementation pass should add create/edit/import/upload actions.

Public virtual routes and Admin2 API routes are intentionally separate. Frontend routes such as `/if`, `/if/{slug}`, `/if/{slug}/play`, and `/if/_story/{slug}/{filename}` are registered as virtual Grav pages or controlled file endpoints only for frontend requests. Admin2 API endpoints remain disabled until they are implemented with a controller-style Grav 2/Admin2 integration.

For subdirectory installs, TerpVault matches the browser URL after Grav's mount path is removed. For example, `/grav2-fullsite-skeleton/if/adventure` maps to the configured TerpVault route `/if/adventure`.

## Notes on game files and rights

TerpVault can play story files, but it does not make copyrighted game files free to redistribute. Keep license/provenance notes in each package's `game.yaml`, especially if you publish a starter library on a public site.
